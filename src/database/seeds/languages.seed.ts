// database/seeds/languages.seed.ts — Seed EN/ZH/JA languages
import { PrismaClient } from "@prisma/client";

export async function seedLanguages(prisma: PrismaClient) {
  console.log("  → Seeding languages...");

  const languages = [
    { code: "EN" as const, name: "Tiếng Anh", flag: "🇺🇸" },
    { code: "ZH" as const, name: "Tiếng Trung", flag: "🇨🇳" },
    { code: "JA" as const, name: "Tiếng Nhật", flag: "🇯🇵" },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: lang,
    });
  }

  console.log("  ✓ Languages seeded (EN, ZH, JA)");
}
