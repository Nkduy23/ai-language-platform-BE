import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import configuration from "./config/configuration";
import { PrismaModule } from "./database/prisma.module";
import { RedisModule } from "./common/redis/redis.module";
import { TtsModule } from "./common/tts/tts.module";
import { CloudinaryModule } from "./common/cloudinary/cloudinary.module";
import { AuthModule } from "./modules/auth/auth.module";
import { VocabularyModule } from "./modules/vocabulary/vocabulary.module";
import { GrammarModule } from "./modules/grammar/grammar.module";
import { QuizModule } from "./modules/quiz/quiz.module";
import { AiChatModule } from "./modules/ai-chat/ai-chat.module";
import { UsersModule } from "./modules/users/users.module";
import { AiSpeakingModule } from "./modules/ai-speaking/ai-speaking.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { RoadmapModule } from "./modules/roadmap/roadmap.module";
import { ContentModule } from "./modules/content/content.module";
import { EmailModule } from "./common/email/email.module";
import { PushModule } from "./common/push/push.module";
import { StreakReminderTask } from "./common/scheduler/streak-reminder.task";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { CommunityModule } from "./modules/community/community.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ".env",
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    TtsModule,
    CloudinaryModule,
    EmailModule,
    PushModule,
    NotificationsModule,
    AuthModule,
    VocabularyModule,
    GrammarModule,
    QuizModule,
    AiChatModule,
    UsersModule,
    AiSpeakingModule,
    SubscriptionsModule,
    RoadmapModule,
    ContentModule,
    CommunityModule,
    AdminModule,
  ],
  providers: [StreakReminderTask],
})
export class AppModule {}
