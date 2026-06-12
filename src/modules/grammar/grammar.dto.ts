// grammar.dto.ts — Data Transfer Objects, validation schemas
import { IsEnum, IsOptional, IsInt, Min, Max } from "class-validator";
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

// GET /grammar/lessons?language=EN&level=A1&page=1&limit=20
export class GetGrammarDto {
  @IsOptional()
  @IsEnum(LanguageCode)
  language?: LanguageCode;

  @IsOptional()
  @IsEnum(CefrLevel)
  level?: CefrLevel;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}
