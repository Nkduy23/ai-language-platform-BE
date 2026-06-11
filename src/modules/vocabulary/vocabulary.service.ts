// vocabulary.service.ts — Business logic, DB queries, external API calls
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { GetVocabularyDto, StartFlashcardSessionDto, FlashcardResultDto } from "./vocabulary.dto";

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  // ─── Lấy danh sách từ vựng (có filter + pagination) ─────────────────────────

  async findAll(dto: GetVocabularyDto) {
    const { language, level, topic, search, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (language) {
      const lang = await this.prisma.language.findUnique({
        where: { code: language },
      });
      if (lang) where.languageId = lang.id;
    }

    if (level) where.level = level;

    if (topic) {
      // topicTags là JSON array: ["food", "daily"]
      where.topicTags = { path: "$", array_contains: topic };
    }

    if (search) {
      where.OR = [{ word: { contains: search } }, { meaningVi: { contains: search } }];
    }

    const [data, total] = await Promise.all([
      this.prisma.vocabularyCard.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          word: true,
          pronunciation: true,
          meaningVi: true,
          meaningEn: true,
          exampleSentence: true,
          imageUrl: true,
          level: true,
          topicTags: true,
          language: { select: { code: true, name: true } },
        },
      }),
      this.prisma.vocabularyCard.count({ where }),
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

  // ─── Lấy 1 từ theo ID ────────────────────────────────────────────────────────

  async findOne(id: string) {
    const card = await this.prisma.vocabularyCard.findUnique({
      where: { id },
      include: {
        language: { select: { code: true, name: true, flag: true } },
      },
    });

    if (!card) throw new NotFoundException("Không tìm thấy từ vựng");
    return card;
  }

  // ─── Bắt đầu flashcard session (lấy N từ theo SRS) ───────────────────────────

  async startFlashcardSession(userId: string, dto: StartFlashcardSessionDto) {
    const { language, level, topic, cardCount = 10 } = dto;

    const where: any = {};

    if (language) {
      const lang = await this.prisma.language.findUnique({
        where: { code: language },
      });
      if (lang) where.languageId = lang.id;
    }

    if (level) where.level = level;
    if (topic) where.topicTags = { path: "$", array_contains: topic };

    // Lấy các từ user đã học (để ưu tiên ôn lại)
    const studied = await this.prisma.userProgress.findMany({
      where: {
        userId,
        type: "VOCABULARY",
        status: { in: ["IN_PROGRESS", "COMPLETED"] },
      },
      select: { resourceId: true },
    });

    const studiedIds = studied.map((p) => p.resourceId);

    // Ưu tiên 1: từ chưa học
    const newCards = await this.prisma.vocabularyCard.findMany({
      where: { ...where, id: { notIn: studiedIds } },
      take: cardCount,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        word: true,
        pronunciation: true,
        meaningVi: true,
        meaningEn: true,
        exampleSentence: true,
        imageUrl: true,
        level: true,
        topicTags: true,
        language: { select: { code: true } },
      },
    });

    // Nếu chưa đủ thì lấy thêm từ đã học để ôn
    let cards = newCards;
    if (newCards.length < cardCount) {
      const reviewCards = await this.prisma.vocabularyCard.findMany({
        where: { ...where, id: { in: studiedIds } },
        take: cardCount - newCards.length,
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          word: true,
          pronunciation: true,
          meaningVi: true,
          meaningEn: true,
          exampleSentence: true,
          imageUrl: true,
          level: true,
          topicTags: true,
          language: { select: { code: true } },
        },
      });
      cards = [...newCards, ...reviewCards];
    }

    return {
      sessionCards: cards,
      total: cards.length,
      newCount: newCards.length,
      reviewCount: cards.length - newCards.length,
    };
  }

  // ─── Ghi nhận kết quả flashcard (biết/không biết/khó) ────────────────────────

  async submitFlashcardResult(userId: string, cardId: string, dto: FlashcardResultDto) {
    // Kiểm tra card tồn tại
    const card = await this.prisma.vocabularyCard.findUnique({
      where: { id: cardId },
    });
    if (!card) throw new NotFoundException("Không tìm thấy từ vựng");

    const xpMap = { know: 10, hard: 5, dontknow: 0 };
    const statusMap = {
      know: "COMPLETED" as const,
      hard: "IN_PROGRESS" as const,
      dontknow: "IN_PROGRESS" as const,
    };

    const xpEarned = xpMap[dto.result];
    const status = statusMap[dto.result];

    // Upsert progress
    await this.prisma.userProgress.upsert({
      where: {
        userId_resourceId_type: {
          userId,
          resourceId: cardId,
          type: "VOCABULARY",
        },
      },
      update: {
        status,
        xpEarned: { increment: xpEarned },
        completedAt: dto.result === "know" ? new Date() : null,
      },
      create: {
        userId,
        resourceId: cardId,
        type: "VOCABULARY",
        status,
        xpEarned,
        completedAt: dto.result === "know" ? new Date() : null,
      },
    });

    // Cộng XP vào profile
    if (xpEarned > 0) {
      await this.prisma.userProfile.update({
        where: { userId },
        data: { totalXp: { increment: xpEarned } },
      });
    }

    return { success: true, xpEarned, status };
  }

  // ─── Toggle favorite ──────────────────────────────────────────────────────────

  async toggleFavorite(userId: string, cardId: string) {
    const card = await this.prisma.vocabularyCard.findUnique({
      where: { id: cardId },
    });
    if (!card) throw new NotFoundException("Không tìm thấy từ vựng");

    const existing = await this.prisma.vocabularyFavorite.findUnique({
      where: { userId_cardId: { userId, cardId } },
    });

    if (existing) {
      await this.prisma.vocabularyFavorite.delete({
        where: { userId_cardId: { userId, cardId } },
      });
      return { favorited: false };
    } else {
      await this.prisma.vocabularyFavorite.create({
        data: { userId, cardId },
      });
      return { favorited: true };
    }
  }

  // ─── Lấy danh sách từ yêu thích ──────────────────────────────────────────────

  async getFavorites(userId: string, dto: GetVocabularyDto) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.vocabularyFavorite.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { savedAt: "desc" },
        select: {
          savedAt: true,
          card: {
            select: {
              id: true,
              word: true,
              pronunciation: true,
              meaningVi: true,
              meaningEn: true,
              exampleSentence: true,
              imageUrl: true,
              level: true,
              topicTags: true,
              language: { select: { code: true, name: true } },
            },
          },
        },
      }),
      this.prisma.vocabularyFavorite.count({ where: { userId } }),
    ]);

    return {
      data: data.map((f) => ({ ...f.card, savedAt: f.savedAt })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Thống kê progress từ vựng của user ──────────────────────────────────────

  async getUserStats(userId: string) {
    const [total, completed, inProgress, totalXp] = await Promise.all([
      this.prisma.vocabularyCard.count(),
      this.prisma.userProgress.count({
        where: { userId, type: "VOCABULARY", status: "COMPLETED" },
      }),
      this.prisma.userProgress.count({
        where: { userId, type: "VOCABULARY", status: "IN_PROGRESS" },
      }),
      this.prisma.userProfile.findUnique({
        where: { userId },
        select: { totalXp: true, streakDays: true },
      }),
    ]);

    return {
      totalCards: total,
      learned: completed,
      inProgress,
      notStarted: total - completed - inProgress,
      totalXp: totalXp?.totalXp ?? 0,
      streakDays: totalXp?.streakDays ?? 0,
    };
  }
}
