import { PrismaClient } from "@prisma/client";
import { seedLanguages } from "./languages.seed";
import { seedVocabulary } from "./vocabulary.seed";
import { seedGrammar } from "./grammar.seed";
import { seedQuiz } from "./quiz.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu seed data...");

  await seedLanguages(prisma);
  await seedVocabulary(prisma);
  await seedGrammar(prisma);
  await seedQuiz(prisma);

  console.log("✅ Seed data hoàn thành!");
}

main()
  .catch((e) => {
    console.error("❌ Seed thất bại:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
