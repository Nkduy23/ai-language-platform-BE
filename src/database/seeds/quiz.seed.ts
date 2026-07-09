import { PrismaClient } from "@prisma/client";

export async function seedQuiz(prisma: PrismaClient) {
  console.log("  → Seeding quiz questions...");

  const enLang = await prisma.language.findUnique({ where: { code: "EN" } });
  if (!enLang) throw new Error("Language EN chưa được seed.");

  const questions = [
    // ── MULTIPLE CHOICE A1 ────────────────────────────────────────────────────
    {
      id: "q-en-mc-01",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: 'Choose the correct form: "She ___ a teacher."',
      options: ["am", "is", "are", "be"],
      correctAns: "is",
      explanation: 'Dùng "is" với chủ ngữ He/She/It.',
    },
    {
      id: "q-en-mc-02",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: "Which sentence is correct?",
      options: ["I am not go to school today.", "I do not go to school today.", "I not go to school today.", "I does not go to school today."],
      correctAns: "I do not go to school today.",
      explanation: 'Phủ định thì hiện tại đơn với I/You/We/They dùng "do not".',
    },
    {
      id: "q-en-mc-03",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: 'What is the plural of "child"?',
      options: ["childs", "childes", "children", "child"],
      correctAns: "children",
      explanation: '"Children" là số nhiều bất quy tắc của "child".',
    },
    {
      id: "q-en-mc-04",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: 'Choose the correct article: "___ apple a day keeps the doctor away."',
      options: ["A", "An", "The", "No article"],
      correctAns: "An",
      explanation: 'Dùng "an" trước từ bắt đầu bằng nguyên âm (a, e, i, o, u). "Apple" bắt đầu bằng "a".',
    },
    {
      id: "q-en-mc-05",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: 'What does "happy" mean in Vietnamese?',
      options: ["buồn", "tức giận", "vui vẻ / hạnh phúc", "mệt mỏi"],
      correctAns: "vui vẻ / hạnh phúc",
      explanation: '"Happy" nghĩa là vui vẻ hoặc hạnh phúc.',
    },
    {
      id: "q-en-mc-06",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: 'Choose the correct possessive: "This is ___ book." (belonging to him)',
      options: ["he", "him", "his", "her"],
      correctAns: "his",
      explanation: '"His" là tính từ sở hữu của "he" (anh ấy).',
    },
    {
      id: "q-en-mc-07",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: "Which word is a verb?",
      options: ["beautiful", "study", "happy", "school"],
      correctAns: "study",
      explanation: '"Study" là động từ (học tập). Các từ còn lại là tính từ hoặc danh từ.',
    },
    {
      id: "q-en-mc-08",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: '"What time ___ it?" — Choose the correct word.',
      options: ["am", "is", "are", "do"],
      correctAns: "is",
      explanation: '"What time is it?" — dùng "is" vì chủ ngữ là "it".',
    },

    // ── MULTIPLE CHOICE A2 ────────────────────────────────────────────────────
    {
      id: "q-en-mc-09",
      type: "MULTIPLE_CHOICE",
      level: "A2",
      question: "She ___ TV when I called her. (watch)",
      options: ["watched", "was watching", "is watching", "watches"],
      correctAns: "was watching",
      explanation: "Dùng Past Continuous (was/were + V-ing) cho hành động đang xảy ra khi có hành động khác xen vào.",
    },
    {
      id: "q-en-mc-10",
      type: "MULTIPLE_CHOICE",
      level: "A2",
      question: "I ___ to Japan twice. (be)",
      options: ["was", "have been", "went", "had been"],
      correctAns: "have been",
      explanation: "Dùng Present Perfect (have/has + V3) để nói về kinh nghiệm trong cuộc đời.",
    },
    {
      id: "q-en-mc-11",
      type: "MULTIPLE_CHOICE",
      level: "A2",
      question: "The book is ___ the table.",
      options: ["in", "on", "at", "by"],
      correctAns: "on",
      explanation: 'Dùng "on" cho vật trên bề mặt.',
    },
    {
      id: "q-en-mc-12",
      type: "MULTIPLE_CHOICE",
      level: "A2",
      question: 'Choose the comparative form: "This exercise is ___ than the last one." (difficult)',
      options: ["more difficult", "difficulter", "most difficult", "the most difficult"],
      correctAns: "more difficult",
      explanation: 'Tính từ dài (≥3 âm tiết) dùng "more + adj" để so sánh hơn.',
    },

    // ── FILL IN THE BLANK A1 ──────────────────────────────────────────────────
    {
      id: "q-en-fill-01",
      type: "FILL_BLANK",
      level: "A1",
      question: 'Complete the sentence: "I ___ (eat) breakfast every morning."',
      options: null,
      correctAns: "eat",
      explanation: "Thì hiện tại đơn với I, dùng động từ nguyên thể: eat.",
    },
    {
      id: "q-en-fill-02",
      type: "FILL_BLANK",
      level: "A1",
      question: 'Fill in the blank: "She ___ (not/like) coffee."',
      options: null,
      correctAns: "doesn't like",
      explanation: "Phủ định hiện tại đơn với She: doesn't + V nguyên thể.",
    },
    {
      id: "q-en-fill-03",
      type: "FILL_BLANK",
      level: "A1",
      question: 'Complete: "There ___ two cats in the garden."',
      options: null,
      correctAns: "are",
      explanation: 'Dùng "are" với danh từ số nhiều (two cats).',
    },
    {
      id: "q-en-fill-04",
      type: "FILL_BLANK",
      level: "A2",
      question: 'Fill in: "He ___ (go) to school yesterday."',
      options: null,
      correctAns: "went",
      explanation: '"Went" là quá khứ bất quy tắc của "go".',
    },
    {
      id: "q-en-fill-05",
      type: "FILL_BLANK",
      level: "A2",
      question: 'Complete: "I have lived in Hanoi ___ 5 years."',
      options: null,
      correctAns: "for",
      explanation: 'Dùng "for" với khoảng thời gian (5 years). Dùng "since" với mốc thời gian (2019).',
    },

    // ── ARRANGE A1 ────────────────────────────────────────────────────────────
    {
      id: "q-en-arr-01",
      type: "ARRANGE",
      level: "A1",
      question: "Arrange the words to make a correct sentence: [every / I / day / English / study]",
      options: ["every", "I", "day", "English", "study"],
      correctAns: "I study English every day",
      explanation: "Cấu trúc câu: Chủ ngữ + Động từ + Tân ngữ + Trạng ngữ thời gian.",
    },
    {
      id: "q-en-arr-02",
      type: "ARRANGE",
      level: "A1",
      question: "Arrange: [is / name / your / What]",
      options: ["is", "name", "your", "What"],
      correctAns: "What is your name",
      explanation: 'Câu hỏi với "what": What + is + chủ ngữ?',
    },
    {
      id: "q-en-arr-03",
      type: "ARRANGE",
      level: "A2",
      question: "Arrange: [does / Where / work / she]",
      options: ["does", "Where", "work", "she"],
      correctAns: "Where does she work",
      explanation: "Câu hỏi Wh- với hiện tại đơn: Wh- + does + chủ ngữ + V?",
    },

    // ── MULTIPLE CHOICE B1 ────────────────────────────────────────────────────
    {
      id: "q-en-mc-b1-01",
      type: "MULTIPLE_CHOICE",
      level: "B1",
      question: "If I ___ rich, I would travel the world.",
      options: ["am", "was", "were", "will be"],
      correctAns: "were",
      explanation: 'Câu điều kiện loại 2: If + Simple Past (dùng "were" cho tất cả chủ ngữ), would + V.',
    },
    {
      id: "q-en-mc-b1-02",
      type: "MULTIPLE_CHOICE",
      level: "B1",
      question: "She asked me ___ I was happy.",
      options: ["that", "if", "what", "which"],
      correctAns: "if",
      explanation: 'Câu hỏi gián tiếp Yes/No dùng "if" hoặc "whether".',
    },
    {
      id: "q-en-mc-b1-03",
      type: "MULTIPLE_CHOICE",
      level: "B1",
      question: "The report ___ by the team last week.",
      options: ["was written", "written", "is written", "has written"],
      correctAns: "was written",
      explanation: "Câu bị động thì quá khứ đơn: was/were + V3.",
    },
  ];

  for (const q of questions) {
    await prisma.quizQuestion.upsert({
      where: { id: q.id },
      update: {},
      create: {
        id: q.id,
        languageId: enLang.id,
        type: q.type as any,
        level: q.level as any,
        question: q.question,
        options: q.options ? q.options : undefined,
        correctAns: q.correctAns,
        explanation: q.explanation,
      },
    });
  }

  console.log(`  ✓ Quiz EN seeded: ${questions.length} câu hỏi (A1→B1)`);

  // ── Tiếng Trung ──────────────────────────────────────────────────────────
  const zhLang = await prisma.language.findUnique({ where: { code: "ZH" } });
  if (!zhLang) throw new Error("Language ZH chưa được seed.");

  const zhQuestions = [
    {
      id: "q-zh-mc-01",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: "选择正确的答案: 我___学生。(Chọn đáp án đúng)",
      options: ["是", "不", "的", "吗"],
      correctAns: "是",
      explanation: '是 (shì) nghĩa là "là", dùng nối chủ ngữ với danh từ.',
    },
    {
      id: "q-zh-mc-02",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: '"你好" nghĩa là gì?',
      options: ["Tạm biệt", "Xin chào", "Cảm ơn", "Xin lỗi"],
      correctAns: "Xin chào",
      explanation: "你好 (nǐ hǎo) là lời chào phổ biến nhất trong tiếng Trung.",
    },
    {
      id: "q-zh-mc-03",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: "Chọn lượng từ đúng: 一___书 (một quyển sách)",
      options: ["个", "本", "张", "杯"],
      correctAns: "本",
      explanation: "本 (běn) là lượng từ dùng cho sách, vở.",
    },
    {
      id: "q-zh-mc-04",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: '"谢谢" nghĩa là gì?',
      options: ["Xin chào", "Cảm ơn", "Không sao", "Làm ơn"],
      correctAns: "Cảm ơn",
      explanation: "谢谢 (xièxie) nghĩa là cảm ơn.",
    },
    {
      id: "q-zh-mc-05",
      type: "MULTIPLE_CHOICE",
      level: "A2",
      question: 'Chọn câu đúng khi diễn đạt "Tôi đã ăn cơm rồi":',
      options: ["我吃饭。", "我吃饭了。", "我了吃饭。", "我不吃饭了。"],
      correctAns: "我吃饭了。",
      explanation: "了 đặt sau động từ (hoặc cuối câu) để chỉ hành động đã hoàn thành.",
    },
    {
      id: "q-zh-mc-06",
      type: "MULTIPLE_CHOICE",
      level: "A2",
      question: '"这是我___书。" (Đây là sách của tôi.) Điền từ còn thiếu:',
      options: ["是", "的", "了", "吗"],
      correctAns: "的",
      explanation: "的 (de) là trợ từ sở hữu, đặt sau người sở hữu.",
    },
    {
      id: "q-zh-mc-07",
      type: "FILL_BLANK",
      level: "A1",
      question: "我___老师。(Tôi không phải là giáo viên.) — điền phần phủ định của 是",
      options: null,
      correctAns: "不是",
      explanation: '不是 (bú shì) là phủ định của 是 — "không phải là".',
    },
    {
      id: "q-zh-mc-08",
      type: "MULTIPLE_CHOICE",
      level: "A2",
      question: 'Số "2" khi đứng trước lượng từ (vd: 2 người) đọc là gì?',
      options: ["二 (èr)", "两 (liǎng)", "双 (shuāng)", "第二 (dì èr)"],
      correctAns: "两 (liǎng)",
      explanation: "两 dùng khi đếm số lượng trước lượng từ, 二 dùng khi đếm số thứ tự/số học thông thường.",
    },
  ];

  for (const q of zhQuestions) {
    await prisma.quizQuestion.upsert({
      where: { id: q.id },
      update: {},
      create: {
        id: q.id,
        languageId: zhLang.id,
        type: q.type as any,
        level: q.level as any,
        question: q.question,
        options: q.options ? q.options : undefined,
        correctAns: q.correctAns,
        explanation: q.explanation,
      },
    });
  }
  console.log(`  ✓ Quiz ZH seeded: ${zhQuestions.length} câu hỏi (A1→A2)`);

  // ── Tiếng Nhật ───────────────────────────────────────────────────────────
  const jaLang = await prisma.language.findUnique({ where: { code: "JA" } });
  if (!jaLang) throw new Error("Language JA chưa được seed.");

  const jaQuestions = [
    {
      id: "q-ja-mc-01",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: '"こんにちは" nghĩa là gì?',
      options: ["Tạm biệt", "Xin chào (ban ngày)", "Cảm ơn", "Xin lỗi"],
      correctAns: "Xin chào (ban ngày)",
      explanation: "こんにちは (konnichiwa) là lời chào dùng vào ban ngày.",
    },
    {
      id: "q-ja-mc-02",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: "Chọn trợ từ đúng: 私___学生です。(Tôi là học sinh.)",
      options: ["を", "は", "に", "で"],
      correctAns: "は",
      explanation: "は (wa) đánh dấu chủ đề của câu.",
    },
    {
      id: "q-ja-mc-03",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: '"ありがとう" nghĩa là gì?',
      options: ["Xin chào", "Cảm ơn", "Xin lỗi", "Không sao"],
      correctAns: "Cảm ơn",
      explanation: "ありがとう (arigatou) nghĩa là cảm ơn.",
    },
    {
      id: "q-ja-mc-04",
      type: "MULTIPLE_CHOICE",
      level: "A1",
      question: "Chọn trợ từ đúng: 水___飲みます。(Uống nước.)",
      options: ["は", "が", "を", "に"],
      correctAns: "を",
      explanation: 'を đánh dấu tân ngữ trực tiếp của động từ, đọc là "o".',
    },
    {
      id: "q-ja-mc-05",
      type: "MULTIPLE_CHOICE",
      level: "A2",
      question: "Thể quá khứ lịch sự của 食べます (ăn) là gì?",
      options: ["食べません", "食べました", "食べませんでした", "食べます"],
      correctAns: "食べました",
      explanation: "～ました là thể quá khứ khẳng định lịch sự (masu-form).",
    },
    {
      id: "q-ja-mc-06",
      type: "MULTIPLE_CHOICE",
      level: "A2",
      question: "Chọn trợ từ đúng: 図書館___勉強します。(Học ở thư viện.)",
      options: ["に", "で", "を", "は"],
      correctAns: "で",
      explanation: "で chỉ nơi hành động diễn ra.",
    },
    {
      id: "q-ja-mc-07",
      type: "FILL_BLANK",
      level: "A1",
      question: "これ___本です。(Đây là quyển sách.) — điền trợ từ còn thiếu",
      options: null,
      correctAns: "は",
      explanation: 'は đánh dấu chủ đề "これ" (đây).',
    },
    {
      id: "q-ja-mc-08",
      type: "MULTIPLE_CHOICE",
      level: "A2",
      question: 'Trợ từ nào dùng để chỉ thời điểm cụ thể, vd "7時___起きます" (dậy lúc 7 giờ)?',
      options: ["で", "を", "に", "は"],
      correctAns: "に",
      explanation: "に dùng cho thời điểm cụ thể và điểm đến.",
    },
  ];

  for (const q of jaQuestions) {
    await prisma.quizQuestion.upsert({
      where: { id: q.id },
      update: {},
      create: {
        id: q.id,
        languageId: jaLang.id,
        type: q.type as any,
        level: q.level as any,
        question: q.question,
        options: q.options ? q.options : undefined,
        correctAns: q.correctAns,
        explanation: q.explanation,
      },
    });
  }
  console.log(`  ✓ Quiz JA seeded: ${jaQuestions.length} câu hỏi (A1→A2)`);
}
