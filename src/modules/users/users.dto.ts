import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

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

// PATCH /users/me
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(LanguageCode)
  learningLang?: LanguageCode;

  @IsOptional()
  @IsEnum(CefrLevel)
  currentLevel?: CefrLevel;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(240)
  dailyGoalMin?: number;

  @IsOptional()
  @IsString()
  timezone?: string;
}
