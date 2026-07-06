import { Module } from "@nestjs/common";
import { AiSpeakingService } from "./ai-speaking.service";
import { AiSpeakingController } from "./ai-speaking.controller";
import { SubscriptionGuard } from "../../common/guards/subscription.guard";

@Module({
  controllers: [AiSpeakingController],
  providers: [AiSpeakingService, SubscriptionGuard],
  exports: [AiSpeakingService],
})
export class AiSpeakingModule {}
