// Route handlers, request/response — auth token giờ set qua httpOnly cookie thay vì trả JSON
import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./auth.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { setAuthCookies, clearAuthCookies } from "./auth-cookie.util";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // POST /auth/register
  @Post("register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.register(dto);
    setAuthCookies(res, this.configService, accessToken, refreshToken);
    return { user };
  }

  // POST /auth/login
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);
    setAuthCookies(res, this.configService, accessToken, refreshToken);
    return { user };
  }

  // POST /auth/refresh — đọc refreshToken từ cookie, set lại cả 2 cookie mới
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt-refresh"))
  async refresh(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(user.sub, user.email, user.role);
    setAuthCookies(res, this.configService, accessToken, refreshToken);
    return { success: true };
  }

  // GET /auth/me — dùng để FE lấy user mới nhất (role, plan...) mỗi lần load app
  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser("id") userId: string) {
    return this.authService.getMe(userId);
  }

  // POST /auth/logout
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    clearAuthCookies(res, this.configService);
    return { message: "Đăng xuất thành công" };
  }
}
