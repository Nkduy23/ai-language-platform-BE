// admin.service.ts — Thống kê tổng quan + quản lý user cho Admin dashboard
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /admin/stats
  async getStats() {
    const [
      totalUsers,
      usersByPlan,
      totalVocabulary,
      totalGrammar,
      totalQuiz,
      totalBlogPosts,
      publishedBlogPosts,
      totalQuestions,
      totalChatSessions,
      totalSpeakingSessions,
      newUsersLast7Days,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.subscription.groupBy({ by: ['plan'], _count: true }),
      this.prisma.vocabularyCard.count(),
      this.prisma.grammarLesson.count(),
      this.prisma.quizQuestion.count(),
      this.prisma.blogPost.count(),
      this.prisma.blogPost.count({ where: { isPublished: true } }),
      this.prisma.communityQuestion.count(),
      this.prisma.chatSession.count(),
      this.prisma.speakingSession.count(),
      this.prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    ])

    return {
      users: {
        total: totalUsers,
        newLast7Days: newUsersLast7Days,
        byPlan: usersByPlan.reduce((acc, p) => ({ ...acc, [p.plan]: p._count }), {} as Record<string, number>),
      },
      content: {
        vocabulary: totalVocabulary,
        grammar: totalGrammar,
        quiz: totalQuiz,
        blogPosts: { total: totalBlogPosts, published: publishedBlogPosts },
      },
      engagement: {
        communityQuestions: totalQuestions,
        chatSessions: totalChatSessions,
        speakingSessions: totalSpeakingSessions,
      },
    }
  }

  // GET /admin/users
  async listUsers(page = 1, limit = 20, search?: string) {
    const where = search
      ? {
          OR: [
            { email: { contains: search } },
            { profile: { displayName: { contains: search } } },
          ],
        }
      : {}

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          profile: { select: { displayName: true, currentLevel: true, totalXp: true, streakDays: true } },
          subscription: { select: { plan: true, status: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  // PATCH /admin/users/:id/toggle-active — khoá/mở tài khoản
  async toggleUserActive(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('Không tìm thấy user')
    return this.prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } })
  }
}
