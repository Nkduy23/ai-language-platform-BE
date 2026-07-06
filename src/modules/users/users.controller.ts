// users.controller.ts — Route handlers cho Users module
import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./users.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getMe(@CurrentUser("id") userId: string) {
    return this.usersService.getMe(userId);
  }

  @Patch("me")
  updateProfile(@CurrentUser("id") userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get("me/progress")
  getProgress(@CurrentUser("id") userId: string) {
    return this.usersService.getProgress(userId);
  }

  @Get("me/streak")
  getStreak(@CurrentUser("id") userId: string) {
    return this.usersService.getStreak(userId);
  }
}
