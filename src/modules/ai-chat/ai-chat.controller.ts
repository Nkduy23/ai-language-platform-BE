// ai-chat.controller.ts — Route handlers cho AI Chat
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AiChatService } from "./ai-chat.service";
import { CreateChatSessionDto, SendMessageDto } from "./ai-chat.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("ai-chat")
@UseGuards(JwtAuthGuard)
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  // GET /ai-chat/sessions — lịch sử chat
  @Get("sessions")
  listSessions(@CurrentUser("id") userId: string) {
    return this.aiChatService.listSessions(userId);
  }

  // POST /ai-chat/sessions — tạo session mới
  @Post("sessions")
  createSession(@CurrentUser("id") userId: string, @Body() dto: CreateChatSessionDto) {
    return this.aiChatService.createSession(userId, dto);
  }

  // GET /ai-chat/sessions/:id/messages
  @Get("sessions/:id/messages")
  getMessages(@CurrentUser("id") userId: string, @Param("id") sessionId: string) {
    return this.aiChatService.getMessages(userId, sessionId);
  }

  // POST /ai-chat/sessions/:id/messages — gửi tin nhắn
  @Post("sessions/:id/messages")
  sendMessage(@CurrentUser("id") userId: string, @Param("id") sessionId: string, @Body() dto: SendMessageDto) {
    return this.aiChatService.sendMessage(userId, sessionId, dto);
  }
}
