// notifications.service.ts — Trung tâm thông báo in-app (Phase 3)
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

export type NotificationType =
  | 'STREAK_REMINDER'
  | 'WEEKLY_REPORT'
  | 'COMMUNITY_ANSWER'
  | 'COMMUNITY_LIKE'
  | 'BADGE_EARNED'
  | 'SYSTEM'

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper dùng nội bộ bởi các module khác (community, roadmap, scheduler...) để tạo thông báo
  async create(userId: string, type: NotificationType, title: string, body: string, link?: string) {
    return this.prisma.notification.create({ data: { userId, type, title, body, link } })
  }

  // GET /notifications
  async list(userId: string, page = 1, limit = 20) {
    const [data, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ])
    return { data, unreadCount, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  // PATCH /notifications/:id/read
  async markAsRead(userId: string, id: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } })
    if (!notif || notif.userId !== userId) throw new NotFoundException('Không tìm thấy thông báo')
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } })
  }

  // PATCH /notifications/read-all
  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } })
    return { success: true }
  }
}
