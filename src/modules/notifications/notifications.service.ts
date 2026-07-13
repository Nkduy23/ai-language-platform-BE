// notifications.service.ts — Trung tâm thông báo in-app + đẩy Web Push (Phase 3)
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { PushService } from "../../common/push/push.service";

export type NotificationType = "STREAK_REMINDER" | "WEEKLY_REPORT" | "COMMUNITY_ANSWER" | "COMMUNITY_LIKE" | "BADGE_EARNED" | "SYSTEM";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly push: PushService,
  ) {}

  // Helper dùng nội bộ bởi các module khác (community, roadmap, scheduler...) để tạo thông báo
  // Tự động gửi kèm Web Push nếu user đã đăng ký subscription (không chặn nếu gửi push lỗi)
  async create(userId: string, type: NotificationType, title: string, body: string, link?: string) {
    const notification = await this.prisma.notification.create({ data: { userId, type, title, body, link } });
    this.push.sendToUser(userId, { title, body, link }).catch(() => {});
    return notification;
  }

  // GET /notifications
  async list(userId: string, page = 1, limit = 20) {
    const [data, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return { data, unreadCount, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // PATCH /notifications/:id/read
  async markAsRead(userId: string, id: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif || notif.userId !== userId) throw new NotFoundException("Không tìm thấy thông báo");
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  // PATCH /notifications/read-all
  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
    return { success: true };
  }

  // GET /notifications/push/vapid-public-key — FE cần key này để subscribe
  getVapidPublicKey() {
    return { publicKey: process.env.VAPID_PUBLIC_KEY ?? null };
  }

  // POST /notifications/push/subscribe
  async subscribePush(userId: string, subscription: any, userAgent?: string) {
    await this.push.subscribe(userId, subscription, userAgent);
    return { success: true };
  }

  // POST /notifications/push/unsubscribe
  async unsubscribePush(userId: string, endpoint: string) {
    return this.push.unsubscribe(userId, endpoint);
  }
}
