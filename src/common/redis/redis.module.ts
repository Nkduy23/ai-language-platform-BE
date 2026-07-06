// common/redis/redis.module.ts — Global module, dùng ở AiChatModule (rate limit), cache TTS...
import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
