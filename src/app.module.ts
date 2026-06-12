import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { PrismaModule } from "./database/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { VocabularyModule } from "./modules/vocabulary/vocabulary.module";
import { GrammarModule } from "./modules/grammar/grammar.module";
import { QuizModule } from "./modules/quiz/quiz.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ".env",
    }),
    PrismaModule,
    AuthModule,
    VocabularyModule,
    GrammarModule,
    QuizModule,
  ],
})
export class AppModule {}
