// users.controller.ts — Route handlers cho Users module
import { Body, Controller, Get, Patch, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./users.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

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

  // POST /users/me/avatar — upload ảnh đại diện thật lên Cloudinary
  @Post("me/avatar")
  @UseInterceptors(FileInterceptor("avatar", { limits: { fileSize: MAX_AVATAR_SIZE_BYTES } }))
  async uploadAvatar(@CurrentUser("id") userId: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Thiếu file ảnh (field "avatar")');
    return this.usersService.uploadAvatar(userId, file.buffer);
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
