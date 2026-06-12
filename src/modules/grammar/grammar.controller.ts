// grammar.controller.ts — Route handlers, request/response
import { Controller, Get, Post, Param, Query, UseGuards, HttpCode, HttpStatus, Request } from "@nestjs/common";
import { GrammarService } from "./grammar.service";
import { GetGrammarDto } from "./grammar.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("grammar")
export class GrammarController {
  constructor(private readonly grammarService: GrammarService) {}

  // GET /grammar/lessons — danh sách bài học (public)
  @Get("lessons")
  findAll(@Query() dto: GetGrammarDto) {
    return this.grammarService.findAll(dto);
  }

  // GET /grammar/progress — progress của user
  @Get("progress")
  @UseGuards(JwtAuthGuard)
  getUserProgress(@CurrentUser("id") userId: string, @Query("language") language?: string) {
    return this.grammarService.getUserProgress(userId, language);
  }

  // GET /grammar/lessons/:id — chi tiết bài học
  // Optional auth — có login thì trả thêm progress
  @Get("lessons/:id")
  findOne(@Param("id") id: string, @Request() req: any) {
    const userId = req.user?.id;
    return this.grammarService.findOne(id, userId);
  }

  // POST /grammar/lessons/:id/complete — đánh dấu hoàn thành
  @Post("lessons/:id/complete")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  completeLesson(@CurrentUser("id") userId: string, @Param("id") lessonId: string) {
    return this.grammarService.completeLesson(userId, lessonId);
  }
}
