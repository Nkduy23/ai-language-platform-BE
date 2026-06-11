import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { PrismaModule } from "./database/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    // Config global — dùng được ở mọi module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ".env",
    }),

    // Prisma global — inject PrismaService ở mọi nơi
    PrismaModule,

    // Feature modules
    AuthModule,

    // TODO Phase 1: thêm dần
    // UsersModule,
    // VocabularyModule,
    // GrammarModule,
    // QuizModule,
  ],
})
export class AppModule {}
