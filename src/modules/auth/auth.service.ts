//Business logic, DB queries, external API calls
import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../database/prisma.service";
import { RegisterDto, LoginDto } from "./auth.dto";
import { EmailService } from "../../common/email/email.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  // ─── Register ───────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    // Check email đã tồn tại chưa
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException("Email đã được sử dụng");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Tạo user + profile + subscription trong 1 transaction
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          profile: {
            create: {
              displayName: dto.displayName,
            },
          },
          subscription: {
            create: {
              plan: "FREE",
              status: "ACTIVE",
            },
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
          profile: {
            select: { displayName: true, avatarUrl: true },
          },
        },
      });
      return newUser;
    });

    // Tạo tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Gửi welcome email — không await chặn response, lỗi email không nên làm fail đăng ký
    this.emailService.sendWelcomeEmail(user.email, user.profile?.displayName ?? user.email).catch(() => {});

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName,
        avatarUrl: user.profile?.avatarUrl,
        role: user.role,
      },
    };
  }

  // ─── Login ──────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    // Tìm user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        profile: { select: { displayName: true, avatarUrl: true } },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Email hoặc mật khẩu không đúng");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Tài khoản đã bị khóa");
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email hoặc mật khẩu không đúng");
    }

    // Cập nhật last_active
    await this.prisma.userProfile.update({
      where: { userId: user.id },
      data: { lastActiveAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName,
        avatarUrl: user.profile?.avatarUrl,
        role: user.role,
      },
    };
  }

  // ─── Refresh Token ──────────────────────────────────────────────────────────

  async refreshTokens(userId: string, email: string, role: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Tài khoản không hợp lệ");
    }

    const tokens = await this.generateTokens(userId, email, role);
    return tokens;
  }

  // ─── Get Me ─────────────────────────────────────────────────────────────────

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
            learningLang: true,
            currentLevel: true,
            dailyGoalMin: true,
            streakDays: true,
            totalXp: true,
          },
        },
        subscription: {
          select: {
            plan: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("jwt.accessSecret"),
        expiresIn: this.configService.get<string>("jwt.accessExpires"),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("jwt.refreshSecret"),
        expiresIn: this.configService.get<string>("jwt.refreshExpires"),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
