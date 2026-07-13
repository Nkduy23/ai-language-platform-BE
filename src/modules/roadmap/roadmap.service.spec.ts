// roadmap.service.spec.ts — Unit test cho logic chấm placement test (xác định CEFR level)
import { Test } from "@nestjs/testing";
import { RoadmapService } from "./roadmap.service";
import { PrismaService } from "../../database/prisma.service";

describe("RoadmapService", () => {
  let service: RoadmapService;
  let prisma: any;

  const mockPrisma = {
    language: { findUnique: jest.fn() },
    quizQuestion: { findMany: jest.fn() },
    userProfile: { update: jest.fn(), findUnique: jest.fn(), findMany: jest.fn() },
    userProgress: { findMany: jest.fn() },
    grammarLesson: { findFirst: jest.fn() },
    chatSession: { aggregate: jest.fn() },
    communityQuestion: { count: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [RoadmapService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get(RoadmapService);
    prisma = mockPrisma;
  });

  describe("submitPlacementTest", () => {
    // Helper tạo câu hỏi giả cho 1 level, tất cả cùng đáp án "A" để dễ kiểm soát đúng/sai
    const makeQuestions = (level: string, count: number) => Array.from({ length: count }, (_, i) => ({ id: `${level}-${i}`, level, correctAns: "A" }));

    it("xác định level A1 nếu trả lời sai hết ngay từ đầu", async () => {
      const questions = makeQuestions("A1", 3);
      prisma.quizQuestion.findMany.mockResolvedValue(questions);
      prisma.userProfile.update.mockResolvedValue({});

      const result = await service.submitPlacementTest("user-1", {
        language: "EN" as any,
        answers: questions.map((q) => ({ questionId: q.id, answer: "WRONG" })),
      });

      expect(result.level).toBe("A1"); // level mặc định thấp nhất khi không đạt gì
    });

    it("xác định đúng level khi đạt >= 60% ở A1, A2 nhưng fail ở B1", async () => {
      const a1 = makeQuestions("A1", 3); // đúng cả 3 = 100%
      const a2 = makeQuestions("A2", 3); // đúng 2/3 = 66% → đạt
      const b1 = makeQuestions("B1", 3); // đúng 0/3 = 0% → không đạt, dừng tại đây

      prisma.quizQuestion.findMany.mockResolvedValue([...a1, ...a2, ...b1]);
      prisma.userProfile.update.mockResolvedValue({});

      const answers = [
        ...a1.map((q) => ({ questionId: q.id, answer: "A" })), // đúng hết
        { questionId: a2[0].id, answer: "A" },
        { questionId: a2[1].id, answer: "A" },
        { questionId: a2[2].id, answer: "WRONG" }, // sai 1/3
        ...b1.map((q) => ({ questionId: q.id, answer: "WRONG" })), // sai hết
      ];

      const result = await service.submitPlacementTest("user-1", { language: "EN" as any, answers });

      expect(result.level).toBe("A2");
      expect(prisma.userProfile.update).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        data: { currentLevel: "A2", learningLang: "EN" },
      });
    });

    it("bỏ qua câu hỏi không tìm thấy trong DB (an toàn khi id không khớp)", async () => {
      prisma.quizQuestion.findMany.mockResolvedValue([]);
      prisma.userProfile.update.mockResolvedValue({});

      const result = await service.submitPlacementTest("user-1", {
        language: "EN" as any,
        answers: [{ questionId: "non-existent-id", answer: "A" }],
      });

      expect(result.level).toBe("A1");
    });
  });

  describe("getLeaderboard", () => {
    it("trả về danh sách kèm rank tăng dần bắt đầu từ 1", async () => {
      prisma.userProfile.findMany.mockResolvedValue([
        { displayName: "Alice", totalXp: 500, streakDays: 10, learningLang: "EN" },
        { displayName: "Bob", totalXp: 300, streakDays: 5, learningLang: "JA" },
      ]);

      const result = await service.getLeaderboard(10);

      expect(result[0]).toMatchObject({ rank: 1, displayName: "Alice" });
      expect(result[1]).toMatchObject({ rank: 2, displayName: "Bob" });
    });
  });
});
