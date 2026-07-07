import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator'

export enum LanguageCode {
  EN = 'EN',
  ZH = 'ZH',
  JA = 'JA',
}

// POST /community/questions
export class CreateQuestionDto {
  @IsEnum(LanguageCode)
  language: LanguageCode

  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string

  @IsString()
  @MinLength(5)
  content: string
}

// POST /community/questions/:id/answers
export class CreateAnswerDto {
  @IsString()
  @MinLength(2)
  content: string
}
