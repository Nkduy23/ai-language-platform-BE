// users.service.ts — Profile CRUD, progress, streak
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CloudinaryService } from "../../common/cloudinary/cloudinary.service";
import { UpdateProfileDto } from "./users.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // GET /users/me
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, subscription: true },
    });
    if (!user) throw new NotFoundException("Không tìm thấy user");
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  // PATCH /users/me
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.userProfile.update({
      where: { userId },
      data: { ...dto },
    });
  }

  // POST /users/me/complete-onboarding — đánh dấu user đã hoàn thành luồng onboarding
  // (chọn ngôn ngữ → placement test → xem kết quả). Server tự set thời điểm, client không
  // được tự truyền timestamp tuỳ ý qua PATCH /users/me để tránh giả mạo.
  async completeOnboarding(userId: string) {
    return this.prisma.userProfile.update({
      where: { userId },
      data: { onboardingCompletedAt: new Date() },
    });
  }

  // POST /users/me/avatar — upload lên Cloudinary, xoá ảnh cũ (nếu có) rồi cập nhật avatarUrl
  async uploadAvatar(userId: string, buffer: Buffer) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Không tìm thấy hồ sơ user");

    const newUrl = await this.cloudinary.uploadImage(buffer, "avatars");

    if (profile.avatarUrl) {
      this.cloudinary.deleteImage(profile.avatarUrl).catch(() => {});
    }

    return this.prisma.userProfile.update({ where: { userId }, data: { avatarUrl: newUrl } });
  }

  // GET /users/me/progress
  async getProgress(userId: string) {
    const progress = await this.prisma.userProgress.findMany({ where: { userId } });

    const summary = {
      vocabulary: this.summarize(progress, "VOCABULARY"),
      grammar: this.summarize(progress, "GRAMMAR"),
      quiz: this.summarize(progress, "QUIZ"),
      speaking: this.summarize(progress, "SPEAKING"),
      chat: this.summarize(progress, "CHAT"),
    };

    return { items: progress, summary };
  }

  // GET /users/me/streak
  async getStreak(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Không tìm thấy hồ sơ user");
    return {
      streakDays: profile.streakDays,
      totalXp: profile.totalXp,
      lastActiveAt: profile.lastActiveAt,
    };
  }

  // Gọi khi user hoàn thành 1 activity bất kỳ trong ngày — cập nhật streak + XP
  async touchDailyActivity(userId: string, xpEarned: number) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) return;

    const now = new Date();
    const lastActive = profile.lastActiveAt;
    let newStreak = profile.streakDays;

    if (!lastActive) {
      newStreak = 1;
    } else {
      const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) newStreak += 1;
      else if (daysDiff > 1) newStreak = 1;
      // daysDiff === 0 → cùng ngày, giữ nguyên streak
    }

    return this.prisma.userProfile.update({
      where: { userId },
      data: {
        streakDays: newStreak,
        totalXp: { increment: xpEarned },
        lastActiveAt: now,
      },
    });
  }

  private summarize(progress: { type: string; status: string; xpEarned: number }[], type: string) {
    const items = progress.filter((p) => p.type === type);
    return {
      total: items.length,
      completed: items.filter((p) => p.status === "COMPLETED").length,
      xpEarned: items.reduce((sum, p) => sum + p.xpEarned, 0),
    };
  }
}
