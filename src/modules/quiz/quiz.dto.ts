import {
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export enum LanguageCode {
  EN = 'EN',
  ZH = 'ZH',
  JA = 'JA',
}

export enum CefrLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum QuizType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_BLANK = 'FILL_BLANK',
  ARRANGE = 'ARRANGE',
  LISTENING = 'LISTENING',
}

// POST /quiz/sessions — tạo session mới
export class CreateQuizSessionDto {
  @IsEnum(LanguageCode)
  language: LanguageCode

  @IsOptional()
  @IsEnum(CefrLevel)
  level?: CefrLevel

  @IsOptional()
  @IsEnum(QuizType)
  type?: QuizType

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(30)
  questionCount?: number = 10
}

// Một câu trả lời trong batch submit
export class AnswerItemDto {
  @IsString()
  questionId: string

  @IsString()
  answer: string
}

// POST /quiz/sessions/:id/submit — nộp bài
export class SubmitQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers: AnswerItemDto[]
}
