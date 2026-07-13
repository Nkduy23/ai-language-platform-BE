// common/push/push.service.ts — Web Push API (VAPID), gửi thông báo đẩy tới trình duyệt
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as webpush from 'web-push'
import { PrismaService } from '../../database/prisma.service'

export interface PushPayload {
  title: string
  body: string
  link?: string
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name)
  private configured = false

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const publicKey = this.configService.get<string>('vapid.publicKey')
    const privateKey = this.configService.get<string>('vapid.privateKey')
    const subject = this.configService.get<string>('vapid.subject')

    if (publicKey && privateKey) {
      webpush.setVapidDetails(subject!, publicKey, privateKey)
      this.configured = true
    } else {
      this.logger.warn('VAPID chưa được cấu hình — push notification sẽ bị bỏ qua (chỉ ảnh hưởng web push, in-app notification vẫn hoạt động bình thường)')
    }
  }

  // POST /notifications/push/subscribe — lưu subscription mới từ trình duyệt
  async subscribe(userId: string, subscription: { endpoint: string; keys: { p256dh: string; auth: string } }, userAgent?: string) {
    return this.prisma.pushSubscription.upsert({
      where: { userId_endpoint: { userId, endpoint: subscription.endpoint } },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
      },
      update: { p256dh: subscription.keys.p256dh, auth: subscription.keys.auth },
    })
  }

  // POST /notifications/push/unsubscribe
  async unsubscribe(userId: string, endpoint: string) {
    await this.prisma.pushSubscription.deleteMany({ where: { userId, endpoint } })
    return { success: true }
  }

  // Helper nội bộ — NotificationsService gọi hàm này mỗi khi tạo notification mới
  async sendToUser(userId: string, payload: PushPayload) {
    if (!this.configured) return

    const subscriptions = await this.prisma.pushSubscription.findMany({ where: { userId } })
    if (subscriptions.length === 0) return

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            JSON.stringify(payload),
          )
        } catch (err: any) {
          // Subscription hết hạn/bị thu hồi (410 Gone hoặc 404) — dọn dẹp khỏi DB
          if (err?.statusCode === 410 || err?.statusCode === 404) {
            await this.prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
          } else {
            this.logger.warn(`Gửi push thất bại tới subscription ${sub.id}: ${err?.message}`)
          }
        }
      }),
    )
  }
}
