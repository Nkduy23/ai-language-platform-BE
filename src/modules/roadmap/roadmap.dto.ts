import { IsArray, IsEnum, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export enum LanguageCode {
  EN = "EN",
  ZH = "ZH",
  JA = "JA",
}

// POST /roadmap/placement-test/start
export class StartPlacementTestDto {
  @IsEnum(LanguageCode)
  language: LanguageCode;
}

class PlacementAnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  answer: string;
}

// POST /roadmap/placement-test/submit
export class SubmitPlacementTestDto {
  @IsEnum(LanguageCode)
  language: LanguageCode;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlacementAnswerDto)
  answers: PlacementAnswerDto[];
}
