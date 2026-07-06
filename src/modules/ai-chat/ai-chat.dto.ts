import { IsEnum, IsString, MinLength, MaxLength } from "class-validator";

export enum LanguageCode {
  EN = "EN",
  ZH = "ZH",
  JA = "JA",
}

export enum ChatTopic {
  DAILY = "DAILY",
  TRAVEL = "TRAVEL",
  BUSINESS = "BUSINESS",
  INTERVIEW = "INTERVIEW",
}

// POST /ai-chat/sessions — tạo session hội thoại mới
export class CreateChatSessionDto {
  @IsEnum(LanguageCode)
  language: LanguageCode;

  @IsEnum(ChatTopic)
  topic: ChatTopic;
}

// POST /ai-chat/sessions/:id/messages — gửi tin nhắn
export class SendMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;
}

// Shape JSON mà GPT-4o phải trả về (ép qua response_format json_object)
export interface AiChatCompletionShape {
  reply: string;
  grammarNote: {
    errors: { original: string; correction: string; explanation: string }[];
    suggestions: string[];
    naturalAlternative: string | null;
  };
  newWords: { word: string; meaningVi: string }[];
}
