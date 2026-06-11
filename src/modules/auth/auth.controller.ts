// Route handlers, request/response
import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, RefreshTokenDto } from "./auth.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // POST /auth/refresh
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt-refresh"))
  async refresh(@CurrentUser() user: any) {
    return this.authService.refreshTokens(user.sub, user.email, user.role);
  }

  // GET /auth/me
  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser("id") userId: string) {
    return this.authService.getMe(userId);
  }

  // POST /auth/logout
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout() {
    // Stateless JWT — client tự xóa token
    // Phase 2 có thể thêm blacklist với Redis
    return { message: "Đăng xuất thành công" };
  }
}
