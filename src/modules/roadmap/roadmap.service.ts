// roadmap.service.ts — Placement test, lộ trình cá nhân hoá, weak-point detection, gamification (badge/leaderboard)
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { StartPlacementTestDto, SubmitPlacementTestDto } from "./roadmap.dto";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const QUESTIONS_PER_LEVEL = 3;
const PASS_THRESHOLD = 0.6; // >= 60% đúng ở 1 level mới coi là đạt level đó

const BADGE_DEFINITIONS = [
  { id: "streak_3", label: "3 ngày liên tiếp", icon: "🔥", check: (p: any) => p.streakDays >= 3 },
  { id: "streak_7", label: "7 ngày liên tiếp", icon: "🔥", check: (p: any) => p.streakDays >= 7 },
  { id: "streak_30", label: "30 ngày liên tiếp", icon: "🏆", check: (p: any) => p.streakDays >= 30 },
  { id: "xp_100", label: "100 XP đầu tiên", icon: "⭐", check: (p: any) => p.totalXp >= 100 },
  { id: "xp_1000", label: "1000 XP", icon: "🌟", check: (p: any) => p.totalXp >= 1000 },
  {
    id: "quiz_10",
    label: "Hoàn thành 10 quiz",
    icon: "📝",
    check: (_p: any, stats: any) => stats.quizCompleted >= 10,
  },
  {
    id: "chat_master",
    label: "50 tin nhắn AI Chat",
    icon: "💬",
    check: (_p: any, stats: any) => stats.chatCompleted >= 50,
  },
];

@Injectable()
export class RoadmapService {
  constructor(private readonly prisma: PrismaService) {}

  // POST /roadmap/placement-test/start — trộn câu hỏi trải đều A1→C2, ẩn đáp án đúng
  async startPlacementTest(dto: StartPlacementTestDto) {
    const language = await this.prisma.language.findUnique({ where: { code: dto.language } });
    if (!language) throw new NotFoundException("Ngôn ngữ không hợp lệ");

    const questionsByLevel = await Promise.all(
      LEVELS.map((level) =>
        this.prisma.quizQuestion.findMany({
          where: { languageId: language.id, level: level as any },
          take: QUESTIONS_PER_LEVEL,
        }),
      ),
    );

    const questions = questionsByLevel.flat().map((q) => ({
      id: q.id,
      level: q.level,
      type: q.type,
      question: q.question,
      options: q.options,
      audioUrl: q.audioUrl,
    }));

    return { questions };
  }

  // POST /roadmap/placement-test/submit — chấm điểm, xác định level, cập nhật UserProfile
  async submitPlacementTest(userId: string, dto: SubmitPlacementTestDto) {
    const questionIds = dto.answers.map((a) => a.questionId);
    const questions = await this.prisma.quizQuestion.findMany({ where: { id: { in: questionIds } } });
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const resultByLevel: Record<string, { correct: number; total: number }> = {};
    for (const level of LEVELS) resultByLevel[level] = { correct: 0, total: 0 };

    for (const answer of dto.answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) continue;
      resultByLevel[question.level].total += 1;
      if (answer.answer.trim().toLowerCase() === question.correctAns.trim().toLowerCase()) {
        resultByLevel[question.level].correct += 1;
      }
    }

    // Đi từ A1 lên, level nào đạt >= 60% đúng thì được công nhận, dừng ở level đầu tiên KHÔNG đạt
    let determinedLevel: (typeof LEVELS)[number] = "A1";
    for (const level of LEVELS) {
      const { correct, total } = resultByLevel[level];
      if (total === 0) break;
      const ratio = correct / total;
      if (ratio >= PASS_THRESHOLD) {
        determinedLevel = level;
      } else {
        break;
      }
    }

    await this.prisma.userProfile.update({
      where: { userId },
      data: { currentLevel: determinedLevel, learningLang: dto.language },
    });

    return { level: determinedLevel, breakdown: resultByLevel };
  }

  // GET /roadmap/recommendations — phát hiện điểm yếu + gợi ý bài học tiếp theo
  async getRecommendations(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Không tìm thấy hồ sơ user");

    const progress = await this.prisma.userProgress.findMany({ where: { userId } });

    const byType: Record<string, { count: number; avgScore: number; totalScore: number }> = {};
    for (const p of progress) {
      const type = p.type;
      if (!byType[type]) byType[type] = { count: 0, avgScore: 0, totalScore: 0 };
      byType[type].count += 1;
      byType[type].totalScore += p.score ? Number(p.score) : 0;
    }
    for (const type of Object.keys(byType)) {
      byType[type].avgScore = byType[type].count ? byType[type].totalScore / byType[type].count : 0;
    }

    // Điểm yếu = loại có avgScore thấp nhất trong số loại đã có ít nhất 1 lần luyện tập
    const practiced = Object.entries(byType).filter(([, v]) => v.count > 0);
    const weakestType = practiced.length ? practiced.reduce((min, cur) => (cur[1].avgScore < min[1].avgScore ? cur : min))[0] : null;

    // Gợi ý ngữ pháp/quiz tiếp theo theo level hiện tại chưa hoàn thành
    const language = await this.prisma.language.findUnique({ where: { code: profile.learningLang } });
    const completedResourceIds = new Set(progress.filter((p) => p.status === "COMPLETED").map((p) => p.resourceId));

    const nextGrammar = language
      ? await this.prisma.grammarLesson.findFirst({
          where: { languageId: language.id, level: profile.currentLevel, id: { notIn: [...completedResourceIds] } },
          orderBy: { orderIndex: "asc" },
        })
      : null;

    return {
      currentLevel: profile.currentLevel,
      weakestArea: weakestType,
      progressByType: byType,
      nextGrammarLesson: nextGrammar,
    };
  }

  // GET /roadmap/leaderboard — top user theo tổng XP (all-time)
  async getLeaderboard(limit = 10) {
    const top = await this.prisma.userProfile.findMany({
      orderBy: { totalXp: "desc" },
      take: limit,
      select: { displayName: true, avatarUrl: true, totalXp: true, streakDays: true, learningLang: true },
    });
    return top.map((u, i) => ({ rank: i + 1, ...u }));
  }

  // GET /roadmap/badges — tính badge dựa trên streak/XP/hoạt động (không cần bảng riêng)
  async getBadges(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Không tìm thấy hồ sơ user");

    const [quizCompleted, chatSessions] = await Promise.all([
      this.prisma.userProgress.count({ where: { userId, type: "QUIZ", status: "COMPLETED" } }),
      this.prisma.chatSession.aggregate({ where: { userId }, _sum: { msgCount: true } }),
    ]);
    const stats = { quizCompleted, chatCompleted: chatSessions._sum.msgCount ?? 0 };

    return BADGE_DEFINITIONS.map((b) => ({
      id: b.id,
      label: b.label,
      icon: b.icon,
      achieved: b.check(profile, stats),
    }));
  }
}
