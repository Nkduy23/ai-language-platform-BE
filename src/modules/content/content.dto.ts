import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";

export enum LanguageCode {
  EN = "EN",
  ZH = "ZH",
  JA = "JA",
}

// POST /content/blog
export class CreateBlogPostDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(500)
  excerpt: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsEnum(LanguageCode)
  language: LanguageCode;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

// PATCH /content/blog/:id
export class UpdateBlogPostDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
