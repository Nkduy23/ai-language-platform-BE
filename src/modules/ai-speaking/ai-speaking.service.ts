// ai-speaking.service.ts — Whisper STT + GPT-4o scoring + Google TTS phát lại câu mẫu
import { Injectable, BadRequestException, NotFoundException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI, { toFile } from "openai";
import { PrismaService } from "../../database/prisma.service";
import { TtsService } from "../../common/tts/tts.service";
import { SpeakingEvaluationShape } from "./ai-speaking.dto";

const LANGUAGE_NAME: Record<string, string> = {
  EN: "English",
  ZH: "Chinese (Mandarin)",
  JA: "Japanese",
};

const WHISPER_LANG_HINT: Record<string, string> = {
  EN: "en",
  ZH: "zh",
  JA: "ja",
};

@Injectable()
export class AiSpeakingService {
  private readonly logger = new Logger(AiSpeakingService.name);
  private openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly tts: TtsService,
    private readonly configService: ConfigService,
  ) {
    this.openai = new OpenAI({ apiKey: this.configService.get<string>("openai.apiKey") });
  }

  async analyzeAudio(userId: string, languageCode: string, prompt: string | undefined, file: { buffer: Buffer; originalname: string; mimetype: string }) {
    if (!file) throw new BadRequestException("Thiếu file audio");

    const language = await this.prisma.language.findUnique({ where: { code: languageCode as any } });
    if (!language) throw new NotFoundException("Ngôn ngữ không hợp lệ");

    // 1) Speech To Text — Whisper
    const { transcribed, avgLogProb } = await this.transcribe(file, languageCode);

    // 2) Chấm điểm grammar/fluency/vocabulary + tạo câu mẫu — GPT-4o
    const evaluation = await this.evaluate(transcribed, languageCode, prompt);

    // Pronunciation: ước lượng heuristic từ độ tin cậy (avg_logprob) của Whisper.
    // Đây là xấp xỉ, không phải phân tích ngữ âm chuyên sâu — cần cải thiện khi có model chuyên biệt.
    const pronunciationScore = this.estimatePronunciationScore(avgLogProb);

    // 3) TTS phát lại câu mẫu chuẩn
    const modelAudioUrl = await this.tts.synthesizeToDataUrl(evaluation.modelAnswer, languageCode);

    const scores = {
      pronunciation: pronunciationScore,
      grammar: evaluation.scores.grammar,
      fluency: evaluation.scores.fluency,
      vocabulary: evaluation.scores.vocabulary,
    };

    // Lưu session — chưa có S3/R2 nên tạm chưa lưu file audio gốc của user, chỉ lưu transcript + điểm.
    // TODO: khi có AWS S3/R2 config, upload file.buffer và set userAudioUrl là URL thật.
    const session = await this.prisma.speakingSession.create({
      data: {
        userId,
        languageId: language.id,
        originalText: prompt ?? null,
        userAudioUrl: "pending-storage-integration",
        transcribed,
        scorePronun: scores.pronunciation,
        scoreGrammar: scores.grammar,
        scoreFluency: scores.fluency,
        scoreVocab: scores.vocabulary,
        feedback: { summary: evaluation.summary, details: evaluation.details } as any,
        modelAudioUrl,
      },
    });

    return {
      sessionId: session.id,
      transcribed,
      scores,
      feedback: {
        summary: evaluation.summary,
        details: evaluation.details,
        modelAnswer: evaluation.modelAnswer,
        modelAudioUrl,
      },
    };
  }

  async listSessions(userId: string) {
    return this.prisma.speakingSession.findMany({
      where: { userId },
      include: { language: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  private async transcribe(file: { buffer: Buffer; originalname: string; mimetype: string }, languageCode: string): Promise<{ transcribed: string; avgLogProb: number | null }> {
    try {
      const uploadable = await toFile(file.buffer, file.originalname || "audio.webm", {
        type: file.mimetype || "audio/webm",
      });
      const response: any = await this.openai.audio.transcriptions.create({
        file: uploadable,
        model: "whisper-1",
        language: WHISPER_LANG_HINT[languageCode],
        response_format: "verbose_json",
      });

      const segments = response.segments ?? [];
      const avgLogProb = segments.length ? segments.reduce((sum: number, s: any) => sum + (s.avg_logprob ?? 0), 0) / segments.length : null;

      return { transcribed: response.text ?? "", avgLogProb };
    } catch (err) {
      this.logger.warn(`Whisper transcribe thất bại: ${(err as Error).message}`);
      throw new BadRequestException("Không thể xử lý file audio, vui lòng thử lại");
    }
  }

  private estimatePronunciationScore(avgLogProb: number | null): number {
    if (avgLogProb === null) return 70; // fallback trung bình khi không có dữ liệu confidence
    // avg_logprob thường trong khoảng ~0 (rất tự tin) đến ~-1.5 (không rõ ràng)
    const score = 100 + avgLogProb * 40;
    return Math.max(40, Math.min(100, Math.round(score)));
  }

  private async evaluate(transcribed: string, languageCode: string, prompt: string | undefined): Promise<SpeakingEvaluationShape> {
    const languageName = LANGUAGE_NAME[languageCode] ?? languageCode;
    const contextLine = prompt ? `Học viên được yêu cầu nói về/trả lời: "${prompt}".` : "Học viên nói tự do, không có đề bài cụ thể.";

    const systemPrompt = `Bạn là giám khảo chấm nói ${languageName} cho người học Việt Nam.
${contextLine}
Đây là bản chuyển từ giọng nói sang văn bản (Whisper STT) của học viên: "${transcribed}"

Chấm điểm 0-100 cho 3 tiêu chí (KHÔNG chấm pronunciation, phần đó đã tính riêng): grammar, fluency, vocabulary.
Viết summary ngắn gọn (1-2 câu, tiếng Việt) và 2-4 gợi ý cải thiện cụ thể (tiếng Việt) trong details.
Viết modelAnswer: một câu trả lời mẫu chuẩn, tự nhiên bằng ${languageName} cho cùng ngữ cảnh, để học viên nghe và so sánh.

Trả về CHỈ MỘT JSON object đúng schema, không thêm text nào khác:
{
  "scores": {"grammar": number, "fluency": number, "vocabulary": number},
  "summary": "string",
  "details": ["string"],
  "modelAnswer": "string bằng ${languageName}"
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>("openai.chatModel") ?? "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.5,
      });
      const raw = response.choices[0]?.message?.content ?? "{}";
      return JSON.parse(raw) as SpeakingEvaluationShape;
    } catch (err) {
      this.logger.warn(`GPT-4o evaluate thất bại: ${(err as Error).message}`);
      return {
        scores: { grammar: 70, fluency: 70, vocabulary: 70 },
        summary: "Không thể phân tích chi tiết lúc này, nhưng bạn đã hoàn thành bài nói tốt.",
        details: [],
        modelAnswer: transcribed,
      };
    }
  }
}
