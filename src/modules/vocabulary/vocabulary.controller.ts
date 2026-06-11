// vocabulary.controller.ts — Route handlers, request/response
import { Controller, Get, Post, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { VocabularyService } from "./vocabulary.service";
import { GetVocabularyDto, StartFlashcardSessionDto, FlashcardResultDto } from "./vocabulary.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("vocabulary")
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  // GET /vocabulary — danh sách từ vựng (public, không cần login)
  @Get()
  findAll(@Query() dto: GetVocabularyDto) {
    return this.vocabularyService.findAll(dto);
  }

  // GET /vocabulary/stats — thống kê progress của user
  @Get("stats")
  @UseGuards(JwtAuthGuard)
  getUserStats(@CurrentUser("id") userId: string) {
    return this.vocabularyService.getUserStats(userId);
  }

  // GET /vocabulary/favorites — từ yêu thích
  @Get("favorites")
  @UseGuards(JwtAuthGuard)
  getFavorites(@CurrentUser("id") userId: string, @Query() dto: GetVocabularyDto) {
    return this.vocabularyService.getFavorites(userId, dto);
  }

  // GET /vocabulary/:id — chi tiết 1 từ
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.vocabularyService.findOne(id);
  }

  // POST /vocabulary/flashcard/session — bắt đầu session học flashcard
  @Post("flashcard/session")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  startFlashcardSession(@CurrentUser("id") userId: string, @Body() dto: StartFlashcardSessionDto) {
    return this.vocabularyService.startFlashcardSession(userId, dto);
  }

  // POST /vocabulary/flashcard/:cardId/result — ghi nhận kết quả
  @Post("flashcard/:cardId/result")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  submitFlashcardResult(@CurrentUser("id") userId: string, @Param("cardId") cardId: string, @Body() dto: FlashcardResultDto) {
    return this.vocabularyService.submitFlashcardResult(userId, cardId, dto);
  }

  // POST /vocabulary/:id/favorite — toggle yêu thích
  @Post(":id/favorite")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  toggleFavorite(@CurrentUser("id") userId: string, @Param("id") cardId: string) {
    return this.vocabularyService.toggleFavorite(userId, cardId);
  }
}
