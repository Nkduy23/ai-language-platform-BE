import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { QuizService } from './quiz.service'
import { CreateQuizSessionDto, SubmitQuizDto } from './quiz.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@Controller('quiz')
@UseGuards(JwtAuthGuard) // Tất cả quiz endpoints đều cần login
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // POST /quiz/sessions — tạo session + lấy câu hỏi
  @Post('sessions')
  @HttpCode(HttpStatus.OK)
  createSession(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateQuizSessionDto,
  ) {
    return this.quizService.createSession(userId, dto)
  }

  // POST /quiz/sessions/:id/submit — nộp bài
  @Post('sessions/:id/submit')
  @HttpCode(HttpStatus.OK)
  submitSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.quizService.submitSession(userId, sessionId, dto)
  }

  // GET /quiz/sessions — lịch sử làm bài
  @Get('sessions')
  getHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.quizService.getHistory(userId, page, limit)
  }

  // GET /quiz/sessions/:id — chi tiết 1 session
  @Get('sessions/:id')
  getSessionDetail(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.quizService.getSessionDetail(userId, sessionId)
  }

  // GET /quiz/stats — thống kê tổng hợp
  @Get('stats')
  getStats(@CurrentUser('id') userId: string) {
    return this.quizService.getStats(userId)
  }
}
