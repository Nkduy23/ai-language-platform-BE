// common/tts/tts.service.ts — Google Cloud TTS, dùng cho AI Speaking (phát lại câu mẫu) và Vocabulary TTS
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as textToSpeech from "@google-cloud/text-to-speech";

const VOICE_MAP: Record<string, { languageCode: string; name: string }> = {
  EN: { languageCode: "en-US", name: "en-US-Neural2-F" },
  ZH: { languageCode: "cmn-CN", name: "cmn-CN-Wavenet-A" },
  JA: { languageCode: "ja-JP", name: "ja-JP-Wavenet-B" },
};

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private client: textToSpeech.TextToSpeechClient | null = null;

  constructor(private readonly configService: ConfigService) {
    const credsJson = this.configService.get<string>("googleTts.credentialsJson");
    try {
      const credentials = credsJson ? JSON.parse(credsJson) : undefined;
      this.client = new textToSpeech.TextToSpeechClient(credentials ? { credentials } : undefined);
    } catch (err) {
      this.logger.warn(`Google TTS client init thất bại: ${(err as Error).message}`);
    }
  }

  // Trả về audio dạng base64 data URL (mp3) — chưa upload lên S3/R2, dùng tạm để phát trực tiếp trên FE.
  // TODO: khi có AWS S3/R2 config, upload buffer và trả về URL thật thay vì data URL để giảm payload.
  async synthesizeToDataUrl(text: string, languageCode: string): Promise<string | null> {
    if (!this.client) return null;
    const voice = VOICE_MAP[languageCode] ?? VOICE_MAP.EN;

    try {
      const [response] = await this.client.synthesizeSpeech({
        input: { text },
        voice: { languageCode: voice.languageCode, name: voice.name },
        audioConfig: { audioEncoding: "MP3" },
      });
      const audioContent = response.audioContent;
      if (!audioContent) return null;
      const base64 = Buffer.from(audioContent as Uint8Array).toString("base64");
      return `data:audio/mp3;base64,${base64}`;
    } catch (err) {
      this.logger.warn(`TTS synthesize thất bại: ${(err as Error).message}`);
      return null;
    }
  }
}
