import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateQuizSessionDto, SubmitQuizDto } from './quiz.dto'

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  // ─── Tạo quiz session + lấy câu hỏi ngẫu nhiên ───────────────────────────────

  async createSession(userId: string, dto: CreateQuizSessionDto) {
    const { language, level, type, questionCount = 10 } = dto

    const where: any = {}

    if (language) {
      const lang = await this.prisma.language.findUnique({
        where: { code: language },
      })
      if (!lang) throw new NotFoundException('Ngôn ngữ không hợp lệ')
      where.languageId = lang.id
    }

    if (level) where.level = level
    if (type) where.type = type

    // Lấy tổng số câu hỏi phù hợp
    const totalAvailable = await this.prisma.quizQuestion.count({ where })
    if (totalAvailable === 0) {
      throw new NotFoundException('Không có câu hỏi nào phù hợp với bộ lọc này')
    }

    // Lấy ngẫu nhiên bằng cách skip random offset
    const take = Math.min(questionCount, totalAvailable)
    const skip = Math.max(0, Math.floor(Math.random() * (totalAvailable - take)))

    const questions = await this.prisma.quizQuestion.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        type: true,
        question: true,
        options: true,
        audioUrl: true,
        level: true,
        // KHÔNG trả correctAns về client
      },
    })

    // Shuffle câu hỏi
    const shuffled = questions.sort(() => Math.random() - 0.5)

    // Tạo quiz session trong DB
    const session = await this.prisma.quizSession.create({
      data: { userId },
    })

    return {
      sessionId: session.id,
      questions: shuffled,
      totalQuestions: shuffled.length,
    }
  }

  // ─── Nộp bài + chấm điểm ─────────────────────────────────────────────────────

  async submitSession(userId: string, sessionId: string, dto: SubmitQuizDto) {
    // Kiểm tra session tồn tại và thuộc về user này
    const session = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
    })

    if (!session) throw new NotFoundException('Không tìm thấy quiz session')
    if (session.userId !== userId) throw new BadRequestException('Không có quyền truy cập')
    if (session.finishedAt) throw new BadRequestException('Session này đã được nộp rồi')

    // Lấy đáp án đúng từ DB
    const questionIds = dto.answers.map((a) => a.questionId)
    const questions = await this.prisma.quizQuestion.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, correctAns: true, explanation: true, question: true, type: true },
    })

    const questionMap = new Map(questions.map((q) => [q.id, q]))

    // Chấm điểm từng câu
    let correctCount = 0
    const details: any[] = []
    const answerRecords: any[] = []

    for (const answer of dto.answers) {
      const question = questionMap.get(answer.questionId)
      if (!question) continue

      const isCorrect = this.checkAnswer(answer.answer, question.correctAns, question.type)
      if (isCorrect) correctCount++

      details.push({
        questionId: answer.questionId,
        question: question.question,
        yourAnswer: answer.answer,
        correctAnswer: question.correctAns,
        isCorrect,
        explanation: question.explanation,
      })

      answerRecords.push({
        sessionId,
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
      })
    }

    const totalAnswered = dto.answers.length
    const score = totalAnswered > 0 ? (correctCount / totalAnswered) * 100 : 0
    const xpEarned = this.calculateXp(score, totalAnswered)

    // Lưu kết quả vào DB
    await this.prisma.$transaction([
      // Lưu từng câu trả lời
      this.prisma.quizAnswer.createMany({ data: answerRecords }),

      // Cập nhật session: score + finishedAt + xp
      this.prisma.quizSession.update({
        where: { id: sessionId },
        data: {
          finishedAt: new Date(),
          score,
          xpEarned,
        },
      }),

      // Cộng XP vào profile
      this.prisma.userProfile.update({
        where: { userId },
        data: { totalXp: { increment: xpEarned } },
      }),

      // Lưu progress
      this.prisma.userProgress.create({
        data: {
          userId,
          resourceId: sessionId,
          type: 'QUIZ',
          status: 'COMPLETED',
          score,
          xpEarned,
          completedAt: new Date(),
        },
      }),
    ])

    return {
      sessionId,
      score: Math.round(score),
      correct: correctCount,
      total: totalAnswered,
      xpEarned,
      grade: this.getGrade(score),
      details,
    }
  }

  // ─── Lịch sử quiz của user ────────────────────────────────────────────────────

  async getHistory(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      this.prisma.quizSession.findMany({
        where: { userId, finishedAt: { not: null } },
        skip,
        take: limit,
        orderBy: { startedAt: 'desc' },
        select: {
          id: true,
          score: true,
          xpEarned: true,
          startedAt: true,
          finishedAt: true,
          answers: { select: { isCorrect: true } },
        },
      }),
      this.prisma.quizSession.count({
        where: { userId, finishedAt: { not: null } },
      }),
    ])

    return {
      data: data.map((s) => ({
        ...s,
        correct: s.answers.filter((a) => a.isCorrect).length,
        total: s.answers.length,
        answers: undefined, // ẩn raw answers
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  // ─── Chi tiết 1 session đã làm ───────────────────────────────────────────────

  async getSessionDetail(userId: string, sessionId: string) {
    const session = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        answers: {
          include: {
            question: {
              select: {
                id: true,
                question: true,
                correctAns: true,
                explanation: true,
                type: true,
              },
            },
          },
        },
      },
    })

    if (!session) throw new NotFoundException('Không tìm thấy session')
    if (session.userId !== userId) throw new BadRequestException('Không có quyền truy cập')

    return session
  }

  // ─── Thống kê tổng hợp ────────────────────────────────────────────────────────

  async getStats(userId: string) {
    const sessions = await this.prisma.quizSession.findMany({
      where: { userId, finishedAt: { not: null } },
      select: { score: true, xpEarned: true, answers: { select: { isCorrect: true } } },
    })

    if (sessions.length === 0) {
      return { totalSessions: 0, avgScore: 0, totalXpFromQuiz: 0, totalCorrect: 0, totalAnswered: 0 }
    }

    const totalSessions = sessions.length
    const avgScore = sessions.reduce((sum, s) => sum + Number(s.score ?? 0), 0) / totalSessions
    const totalXpFromQuiz = sessions.reduce((sum, s) => sum + s.xpEarned, 0)
    const totalAnswered = sessions.reduce((sum, s) => sum + s.answers.length, 0)
    const totalCorrect = sessions.reduce((sum, s) => sum + s.answers.filter((a) => a.isCorrect).length, 0)

    return {
      totalSessions,
      avgScore: Math.round(avgScore),
      totalXpFromQuiz,
      totalCorrect,
      totalAnswered,
      accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private checkAnswer(userAnswer: string, correctAnswer: string, type: string): boolean {
    const normalize = (s: string) => s.trim().toLowerCase()

    if (type === 'MULTIPLE_CHOICE') {
      return normalize(userAnswer) === normalize(correctAnswer)
    }

    if (type === 'FILL_BLANK') {
      // Cho phép sai chính tả nhỏ — so sánh sau khi normalize
      return normalize(userAnswer) === normalize(correctAnswer)
    }

    if (type === 'ARRANGE') {
      // So sánh sau khi join lại
      return normalize(userAnswer) === normalize(correctAnswer)
    }

    return normalize(userAnswer) === normalize(correctAnswer)
  }

  private calculateXp(score: number, totalQuestions: number): number {
    if (score >= 90) return totalQuestions * 10
    if (score >= 70) return totalQuestions * 7
    if (score >= 50) return totalQuestions * 5
    return totalQuestions * 2
  }

  private getGrade(score: number): string {
    if (score >= 90) return 'Xuất sắc ⭐'
    if (score >= 70) return 'Tốt 👍'
    if (score >= 50) return 'Trung bình 📚'
    return 'Cần cố gắng hơn 💪'
  }
}
