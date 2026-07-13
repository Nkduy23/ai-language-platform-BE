// ai-speaking.controller.ts — Upload audio (multipart/form-data) + lấy lịch sử
import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AiSpeakingService } from "./ai-speaking.service";
import { CreateSpeakingSessionDto } from "./ai-speaking.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { SubscriptionGuard } from "../../common/guards/subscription.guard";
import { RequirePlan } from "../../common/decorators/require-plan.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Multer } from "multer";

const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

@Controller("ai-speaking")
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class AiSpeakingController {
  constructor(private readonly aiSpeakingService: AiSpeakingService) {}

  // POST /ai-speaking/sessions — field "audio" (file) + language + prompt (optional) — cần Premium/Pro
  @Post("sessions")
  @RequirePlan("PREMIUM", "PRO")
  @UseInterceptors(
    FileInterceptor("audio", {
      limits: { fileSize: MAX_AUDIO_SIZE_BYTES },
    }),
  )
  async createSession(@CurrentUser("id") userId: string, @Body() dto: CreateSpeakingSessionDto, @UploadedFile() audio: Express.Multer.File) {
    if (!audio) throw new BadRequestException('Thiếu file audio (field "audio")');
    return this.aiSpeakingService.analyzeAudio(userId, dto.language, dto.prompt, {
      buffer: audio.buffer,
      originalname: audio.originalname,
      mimetype: audio.mimetype,
    });
  }

  // GET /ai-speaking/sessions — lịch sử luyện nói
  @Get("sessions")
  listSessions(@CurrentUser("id") userId: string) {
    return this.aiSpeakingService.listSessions(userId);
  }
}
