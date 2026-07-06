// ai-chat.service.ts — GPT-4o conversation + grammar feedback extraction + rate limit
import { Injectable, NotFoundException, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { PrismaService } from "../../database/prisma.service";
import { RedisService } from "../../common/redis/redis.service";
import { CreateChatSessionDto, SendMessageDto, AiChatCompletionShape } from "./ai-chat.dto";

const TOPIC_PROMPT_VI: Record<string, string> = {
  DAILY: "các chủ đề đời sống hàng ngày (gia đình, sở thích, thời tiết, mua sắm)",
  TRAVEL: "chủ đề du lịch (đặt phòng khách sạn, hỏi đường, sân bay, nhà hàng)",
  BUSINESS: "chủ đề công việc/kinh doanh (họp, email, đàm phán)",
  INTERVIEW: "phỏng vấn xin việc (câu hỏi thường gặp, giới thiệu bản thân, kỹ năng)",
};

const LANGUAGE_NAME: Record<string, string> = {
  EN: "English",
  ZH: "Chinese (Mandarin)",
  JA: "Japanese",
};

@Injectable()
export class AiChatService {
  private openai: OpenAI;
  private readonly chatModel: string;
  private readonly freeLimit: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.openai = new OpenAI({ apiKey: this.configService.get<string>("openai.apiKey") });
    this.chatModel = this.configService.get<string>("openai.chatModel") ?? "gpt-4o";
    this.freeLimit = this.configService.get<number>("chatLimits.freeMessagesPerDay") ?? 10;
  }

  // GET /ai-chat/sessions
  async listSessions(userId: string) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      include: { language: true },
      orderBy: { startedAt: "desc" },
    });
  }

  // POST /ai-chat/sessions
  async createSession(userId: string, dto: CreateChatSessionDto) {
    const language = await this.prisma.language.findUnique({ where: { code: dto.language } });
    if (!language) throw new NotFoundException("Ngôn ngữ không hợp lệ");

    return this.prisma.chatSession.create({
      data: { userId, languageId: language.id, topic: dto.topic },
      include: { language: true },
    });
  }

  // GET /ai-chat/sessions/:id/messages
  async getMessages(userId: string, sessionId: string) {
    await this.assertOwnership(userId, sessionId);
    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });
  }

  // POST /ai-chat/sessions/:id/messages — gửi tin nhắn, nhận phản hồi AI + grammar feedback
  async sendMessage(userId: string, sessionId: string, dto: SendMessageDto) {
    const session = await this.assertOwnership(userId, sessionId);

    // Rate limit theo Free tier (chỉ áp dụng nếu không phải Premium/Pro)
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    const isPaid = !!(subscription && subscription.plan !== "FREE" && subscription.status === "ACTIVE");
    const usage = await this.checkAndIncrementUsage(userId, isPaid);

    // Lưu tin nhắn user
    await this.prisma.chatMessage.create({
      data: { sessionId, role: "USER", content: dto.content },
    });

    // Lấy 10 tin nhắn gần nhất làm ngữ cảnh
    const history = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    history.reverse();

    const completion = await this.callOpenAi(session.topic, session.language.code, history);

    const assistantMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: "ASSISTANT",
        content: completion.reply,
        grammarNote: completion.grammarNote as any,
      },
    });

    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { msgCount: { increment: 2 } },
    });

    return {
      message: {
        id: assistantMessage.id,
        role: "assistant",
        content: completion.reply,
        grammarNote: completion.grammarNote,
        newWords: completion.newWords,
      },
      usage: isPaid ? null : { used: usage, limit: this.freeLimit },
    };
  }

  private async assertOwnership(userId: string, sessionId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { language: true },
    });
    if (!session || session.userId !== userId) {
      throw new NotFoundException("Không tìm thấy chat session");
    }
    return session;
  }

  private async checkAndIncrementUsage(userId: string, isPaid: boolean): Promise<number> {
    if (isPaid) return 0;
    const today = new Date().toISOString().slice(0, 10);
    const key = `chat:limit:${userId}:${today}`;
    const count = await this.redis.incrWithExpiry(key, 24 * 60 * 60);
    if (count > this.freeLimit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "Daily limit reached",
          resetAt: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return count;
  }

  private async callOpenAi(topic: string, languageCode: string, history: { role: string; content: string }[]): Promise<AiChatCompletionShape> {
    const languageName = LANGUAGE_NAME[languageCode] ?? languageCode;
    const topicDesc = TOPIC_PROMPT_VI[topic] ?? TOPIC_PROMPT_VI.DAILY;

    const systemPrompt = `Bạn là giáo viên ${languageName} bản ngữ, đang trò chuyện với học viên người Việt xoay quanh ${topicDesc}.
Luôn trả lời TỰ NHIÊN bằng ${languageName}, độ dài vừa phải, phù hợp trình độ người học.
Sau đó phân tích tin nhắn GẦN NHẤT của học viên (tin nhắn "user" cuối cùng) và trả về CHỈ MỘT JSON object theo đúng schema sau, không thêm text nào khác:
{
  "reply": "câu trả lời của bạn bằng ${languageName}",
  "grammarNote": {
    "errors": [{"original": "...", "correction": "...", "explanation": "giải thích ngắn gọn bằng tiếng Việt"}],
    "suggestions": ["cách diễn đạt tự nhiên hơn, bằng tiếng Việt"],
    "naturalAlternative": "câu tự nhiên hơn nếu có, hoặc null"
  },
  "newWords": [{"word": "từ mới trong câu trả lời của bạn", "meaningVi": "nghĩa tiếng Việt"}]
}
Nếu câu của học viên không có lỗi, để errors là mảng rỗng.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({
        role: (h.role === "USER" ? "user" : "assistant") as "user" | "assistant",
        content: h.content,
      })),
    ];

    try {
      const response = await this.openai.chat.completions.create({
        model: this.chatModel,
        messages,
        response_format: { type: "json_object" },
        temperature: 0.7,
      });
      const raw = response.choices[0]?.message?.content ?? "{}";
      return JSON.parse(raw) as AiChatCompletionShape;
    } catch (err) {
      // Fallback khi OpenAI timeout/lỗi — không để user bị treo
      return {
        reply: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
        grammarNote: { errors: [], suggestions: [], naturalAlternative: null },
        newWords: [],
      };
    }
  }
}
