// community.service.ts — Q&A: đăng câu hỏi, trả lời, like, bookmark (Phase 3)
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateQuestionDto, CreateAnswerDto } from "./community.dto";

@Injectable()
export class CommunityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // GET /community/questions
  async listQuestions(language?: string, page = 1, limit = 20) {
    const where = language ? { language: { code: language as any } } : {};
    const [data, total] = await Promise.all([
      this.prisma.communityQuestion.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { profile: { select: { displayName: true, avatarUrl: true } } } },
          language: true,
          _count: { select: { answers: true, likes: true } },
          // Chỉ lấy tối thiểu cần thiết để tính hasAcceptedAnswer, không load toàn bộ answers
          answers: { where: { isAccepted: true }, select: { id: true }, take: 1 },
        },
      }),
      this.prisma.communityQuestion.count({ where }),
    ]);

    const mapped = data.map(({ answers, ...q }) => ({
      ...q,
      hasAcceptedAnswer: answers.length > 0,
    }));

    return { data: mapped, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // GET /community/questions/:id
  async getQuestion(id: string) {
    const question = await this.prisma.communityQuestion.findUnique({
      where: { id },
      include: {
        user: { select: { profile: { select: { displayName: true, avatarUrl: true } } } },
        language: true,
        _count: { select: { likes: true } },
        answers: {
          orderBy: [{ isAccepted: "desc" }, { createdAt: "asc" }],
          include: {
            user: { select: { profile: { select: { displayName: true, avatarUrl: true } } } },
            _count: { select: { likes: true } },
          },
        },
      },
    });
    if (!question) throw new NotFoundException("Không tìm thấy câu hỏi");
    return question;
  }

  // POST /community/questions
  async createQuestion(userId: string, dto: CreateQuestionDto) {
    const language = await this.prisma.language.findUnique({ where: { code: dto.language } });
    if (!language) throw new NotFoundException("Ngôn ngữ không hợp lệ");

    return this.prisma.communityQuestion.create({
      data: { userId, languageId: language.id, title: dto.title, content: dto.content },
    });
  }

  // POST /community/questions/:id/answers
  async createAnswer(userId: string, questionId: string, dto: CreateAnswerDto) {
    const question = await this.prisma.communityQuestion.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException("Không tìm thấy câu hỏi");

    const answer = await this.prisma.communityAnswer.create({
      data: { questionId, userId, content: dto.content },
    });

    if (question.userId !== userId) {
      await this.notifications.create(question.userId, "COMMUNITY_ANSWER", "Câu hỏi của bạn có câu trả lời mới", dto.content.slice(0, 100), `/community/${questionId}`);
    }

    return answer;
  }

  // POST /community/questions/:id/like — toggle
  async toggleQuestionLike(userId: string, questionId: string) {
    return this.toggleLike(userId, { questionId });
  }

  // POST /community/answers/:id/like — toggle
  async toggleAnswerLike(userId: string, answerId: string) {
    return this.toggleLike(userId, { answerId });
  }

  private async toggleLike(userId: string, target: { questionId?: string; answerId?: string }) {
    const existing = await this.prisma.communityLike.findFirst({ where: { userId, ...target } });
    if (existing) {
      await this.prisma.communityLike.delete({ where: { id: existing.id } });
      return { liked: false };
    }

    await this.prisma.communityLike.create({ data: { userId, ...target } });

    // Thông báo cho chủ sở hữu (không tự thông báo cho chính mình)
    if (target.questionId) {
      const question = await this.prisma.communityQuestion.findUnique({ where: { id: target.questionId } });
      if (question && question.userId !== userId) {
        await this.notifications.create(question.userId, "COMMUNITY_LIKE", "Câu hỏi của bạn được thích", "", `/community/${target.questionId}`);
      }
    }
    if (target.answerId) {
      const answer = await this.prisma.communityAnswer.findUnique({ where: { id: target.answerId } });
      if (answer && answer.userId !== userId) {
        await this.notifications.create(answer.userId, "COMMUNITY_LIKE", "Câu trả lời của bạn được thích", "", `/community/${answer.questionId}`);
      }
    }

    return { liked: true };
  }

  // POST /community/questions/:id/bookmark — toggle
  async toggleBookmark(userId: string, questionId: string) {
    const existing = await this.prisma.communityBookmark.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });
    if (existing) {
      await this.prisma.communityBookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    }
    await this.prisma.communityBookmark.create({ data: { userId, questionId } });
    return { bookmarked: true };
  }

  // GET /community/bookmarks — câu hỏi user đã lưu
  async listBookmarks(userId: string) {
    const bookmarks = await this.prisma.communityBookmark.findMany({
      where: { userId },
      include: { question: { include: { language: true, _count: { select: { answers: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    return bookmarks.map((b) => b.question);
  }

  // PATCH /community/answers/:id/accept — chỉ chủ câu hỏi mới được duyệt câu trả lời hay nhất
  async acceptAnswer(userId: string, answerId: string) {
    const answer = await this.prisma.communityAnswer.findUnique({
      where: { id: answerId },
      include: { question: true },
    });
    if (!answer) throw new NotFoundException("Không tìm thấy câu trả lời");
    if (answer.question.userId !== userId) {
      throw new ForbiddenException("Chỉ người đặt câu hỏi mới được duyệt câu trả lời hay nhất");
    }

    // Bỏ accepted cũ (nếu có) rồi set accepted mới
    await this.prisma.communityAnswer.updateMany({
      where: { questionId: answer.questionId },
      data: { isAccepted: false },
    });
    return this.prisma.communityAnswer.update({ where: { id: answerId }, data: { isAccepted: true } });
  }
}
