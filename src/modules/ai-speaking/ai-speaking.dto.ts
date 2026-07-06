import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";

export enum LanguageCode {
  EN = "EN",
  ZH = "ZH",
  JA = "JA",
}

// POST /ai-speaking/sessions — multipart/form-data, field "audio" tách riêng qua FileInterceptor
export class CreateSpeakingSessionDto {
  @IsEnum(LanguageCode)
  language: LanguageCode;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  prompt?: string;
}

// Shape JSON GPT-4o phải trả về khi chấm điểm
export interface SpeakingEvaluationShape {
  scores: {
    grammar: number;
    fluency: number;
    vocabulary: number;
  };
  summary: string;
  details: string[];
  modelAnswer: string;
}
