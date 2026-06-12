// grammar.service.ts — Business logic, DB queries, external API calls
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { GetGrammarDto } from "./grammar.dto";

@Injectable()
export class GrammarService {
  constructor(private prisma: PrismaService) {}

  // ─── Lấy danh sách bài học (có filter) ───────────────────────────────────────

  async findAll(dto: GetGrammarDto) {
    const { language, level, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (language) {
      const lang = await this.prisma.language.findUnique({
        where: { code: language },
      });
      if (lang) where.languageId = lang.id;
    }

    if (level) where.level = level;

    const [data, total] = await Promise.all([
      this.prisma.grammarLesson.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ level: "asc" }, { orderIndex: "asc" }],
        select: {
          id: true,
          title: true,
          level: true,
          orderIndex: true,
          createdAt: true,
          language: { select: { code: true, name: true, flag: true } },
        },
      }),
      this.prisma.grammarLesson.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── Lấy chi tiết 1 bài học ───────────────────────────────────────────────────

  async findOne(id: string, userId?: string) {
    const lesson = await this.prisma.grammarLesson.findUnique({
      where: { id },
      include: {
        language: { select: { code: true, name: true, flag: true } },
      },
    });

    if (!lesson) throw new NotFoundException("Không tìm thấy bài học");

    // Lấy progress của user nếu đã đăng nhập
    let progress = null;
    if (userId) {
      progress = await this.prisma.userProgress.findUnique({
        where: {
          userId_resourceId_type: {
            userId,
            resourceId: id,
            type: "GRAMMAR",
          },
        },
        select: { status: true, score: true, completedAt: true },
      });
    }

    // Lấy bài trước / bài sau để navigate
    const [prevLesson, nextLesson] = await Promise.all([
      this.prisma.grammarLesson.findFirst({
        where: {
          languageId: lesson.languageId,
          level: lesson.level,
          orderIndex: { lt: lesson.orderIndex },
        },
        orderBy: { orderIndex: "desc" },
        select: { id: true, title: true },
      }),
      this.prisma.grammarLesson.findFirst({
        where: {
          languageId: lesson.languageId,
          level: lesson.level,
          orderIndex: { gt: lesson.orderIndex },
        },
        orderBy: { orderIndex: "asc" },
        select: { id: true, title: true },
      }),
    ]);

    return {
      ...lesson,
      progress,
      navigation: { prev: prevLesson, next: nextLesson },
    };
  }

  // ─── Đánh dấu hoàn thành bài học ─────────────────────────────────────────────

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.grammarLesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException("Không tìm thấy bài học");

    const XP_PER_LESSON = 20;

    await this.prisma.userProgress.upsert({
      where: {
        userId_resourceId_type: {
          userId,
          resourceId: lessonId,
          type: "GRAMMAR",
        },
      },
      update: {
        status: "COMPLETED",
        completedAt: new Date(),
        xpEarned: XP_PER_LESSON,
      },
      create: {
        userId,
        resourceId: lessonId,
        type: "GRAMMAR",
        status: "COMPLETED",
        xpEarned: XP_PER_LESSON,
        completedAt: new Date(),
      },
    });

    // Cộng XP vào profile
    await this.prisma.userProfile.update({
      where: { userId },
      data: { totalXp: { increment: XP_PER_LESSON } },
    });

    return { success: true, xpEarned: XP_PER_LESSON };
  }

  // ─── Thống kê progress ngữ pháp của user ─────────────────────────────────────

  async getUserProgress(userId: string, language?: string) {
    const where: any = { userId, type: "GRAMMAR" };

    // Nếu filter theo ngôn ngữ
    let languageId: string | undefined;
    if (language) {
      const lang = await this.prisma.language.findUnique({
        where: { code: language as any },
      });
      languageId = lang?.id;
    }

    // Tổng số bài học
    const totalLessons = await this.prisma.grammarLesson.count({
      where: languageId ? { languageId } : {},
    });

    // Số bài đã hoàn thành
    const completed = await this.prisma.userProgress.count({
      where: { ...where, status: "COMPLETED" },
    });

    // Breakdown theo level
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const byLevel = await Promise.all(
      levels.map(async (level) => {
        const total = await this.prisma.grammarLesson.count({
          where: { level: level as any, ...(languageId ? { languageId } : {}) },
        });
        const done = await this.prisma.userProgress.count({
          where: {
            userId,
            type: "GRAMMAR",
            status: "COMPLETED",
            // join qua resourceId — lấy các lesson thuộc level này
          },
        });
        return { level, total, completed: done };
      }),
    );

    return {
      totalLessons,
      completed,
      remaining: totalLessons - completed,
      percentComplete: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
      byLevel,
    };
  }
}
