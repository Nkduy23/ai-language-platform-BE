// community.controller.ts — Q&A routes
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CommunityService } from './community.service'
import { CreateQuestionDto, CreateAnswerDto } from './community.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // GET /community/questions — public
  @Get('questions')
  listQuestions(@Query('language') language?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.communityService.listQuestions(language, page ? +page : 1, limit ? +limit : 20)
  }

  // GET /community/bookmarks — đặt trước :id để tránh bị nuốt route
  @Get('bookmarks')
  @UseGuards(JwtAuthGuard)
  listBookmarks(@CurrentUser('id') userId: string) {
    return this.communityService.listBookmarks(userId)
  }

  // GET /community/questions/:id — public
  @Get('questions/:id')
  getQuestion(@Param('id') id: string) {
    return this.communityService.getQuestion(id)
  }

  // POST /community/questions
  @Post('questions')
  @UseGuards(JwtAuthGuard)
  createQuestion(@CurrentUser('id') userId: string, @Body() dto: CreateQuestionDto) {
    return this.communityService.createQuestion(userId, dto)
  }

  // POST /community/questions/:id/answers
  @Post('questions/:id/answers')
  @UseGuards(JwtAuthGuard)
  createAnswer(@CurrentUser('id') userId: string, @Param('id') questionId: string, @Body() dto: CreateAnswerDto) {
    return this.communityService.createAnswer(userId, questionId, dto)
  }

  // POST /community/questions/:id/like
  @Post('questions/:id/like')
  @UseGuards(JwtAuthGuard)
  likeQuestion(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.communityService.toggleQuestionLike(userId, id)
  }

  // POST /community/answers/:id/like
  @Post('answers/:id/like')
  @UseGuards(JwtAuthGuard)
  likeAnswer(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.communityService.toggleAnswerLike(userId, id)
  }

  // POST /community/questions/:id/bookmark
  @Post('questions/:id/bookmark')
  @UseGuards(JwtAuthGuard)
  bookmark(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.communityService.toggleBookmark(userId, id)
  }

  // PATCH /community/answers/:id/accept
  @Patch('answers/:id/accept')
  @UseGuards(JwtAuthGuard)
  acceptAnswer(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.communityService.acceptAnswer(userId, id)
  }
}
