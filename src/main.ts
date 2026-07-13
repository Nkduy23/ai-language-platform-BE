import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  process.exit(1); // để Railway biết mà restart thay vì treo lơ lửng
});

async function bootstrap() {
  // Sentry — chỉ bật khi có DSN, không throw lỗi nếu thiếu (dev local không cần)
  if (process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.2 });
  }

  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Security
  app.use(helmet());
  app.use(cookieParser());

  // CORS
  // app.enableCors({
  //   origin: process.env.FRONTEND_URL || "http://localhost:3001",
  //   credentials: true,
  // });
  app.enableCors({
    origin: ["https://www.flueni.id.vn"],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api/v1");

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // bỏ field không có trong DTO
      forbidNonWhitelisted: true,
      transform: true, // auto transform types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server đang chạy tại: http://localhost:${port}/api/v1`);
}

bootstrap();
