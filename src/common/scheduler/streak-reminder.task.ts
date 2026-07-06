// common/scheduler/streak-reminder.task.ts — Cron nhắc streak sắp mất (chạy 20h mỗi ngày)
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../database/prisma.service";
import { EmailService } from "../email/email.service";

@Injectable()
export class StreakReminderTask {
  private readonly logger = new Logger(StreakReminderTask.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // Chạy mỗi ngày lúc 20:00 — nhắc user có streak > 0 nhưng chưa hoạt động hôm nay
  @Cron("0 20 * * *", { timeZone: "Asia/Ho_Chi_Minh" })
  async remindUsersAboutToLoseStreak() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const profiles = await this.prisma.userProfile.findMany({
      where: {
        streakDays: { gt: 0 },
        OR: [{ lastActiveAt: null }, { lastActiveAt: { lt: startOfToday } }],
      },
      include: { user: { select: { email: true } } },
    });

    this.logger.log(`Streak reminder: gửi cho ${profiles.length} user`);

    for (const profile of profiles) {
      await this.emailService.sendStreakReminder(profile.user.email, profile.displayName, profile.streakDays);
    }
  }
}
