// vocabulary.dto.ts — Data Transfer Objects, validation schemas
import { IsEnum, IsOptional, IsString, IsInt, Min, Max, IsArray } from "class-validator";
import { Type } from "class-transformer";

export enum LanguageCode {
  EN = "EN",
  ZH = "ZH",
  JA = "JA",
}

export enum CefrLevel {
  A1 = "A1",
  A2 = "A2",
  B1 = "B1",
  B2 = "B2",
  C1 = "C1",
  C2 = "C2",
}

// GET /vocabulary?language=EN&level=A1&topic=food&page=1&limit=20
export class GetVocabularyDto {
  @IsOptional()
  @IsEnum(LanguageCode)
  language?: LanguageCode;

  @IsOptional()
  @IsEnum(CefrLevel)
  level?: CefrLevel;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

// POST /vocabulary/flashcard/session
export class StartFlashcardSessionDto {
  @IsEnum(LanguageCode)
  language: LanguageCode;

  @IsOptional()
  @IsEnum(CefrLevel)
  level?: CefrLevel;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(50)
  cardCount?: number = 10;
}

// POST /vocabulary/flashcard/:cardId/result
export class FlashcardResultDto {
  @IsEnum(["know", "dontknow", "hard"])
  result: "know" | "dontknow" | "hard";
}

// POST /vocabulary/:id/favorite
// (no body needed)
