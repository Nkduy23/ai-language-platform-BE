import { PrismaClient } from '@prisma/client'

export async function seedQuiz(prisma: PrismaClient) {
  console.log('  → Seeding quiz questions...')

  const enLang = await prisma.language.findUnique({ where: { code: 'EN' } })
  if (!enLang) throw new Error('Language EN chưa được seed.')

  const questions = [
    // ── MULTIPLE CHOICE A1 ────────────────────────────────────────────────────
    {
      id: 'q-en-mc-01',
      type: 'MULTIPLE_CHOICE',
      level: 'A1',
      question: 'Choose the correct form: "She ___ a teacher."',
      options: ['am', 'is', 'are', 'be'],
      correctAns: 'is',
      explanation: 'Dùng "is" với chủ ngữ He/She/It.',
    },
    {
      id: 'q-en-mc-02',
      type: 'MULTIPLE_CHOICE',
      level: 'A1',
      question: 'Which sentence is correct?',
      options: [
        'I am not go to school today.',
        'I do not go to school today.',
        'I not go to school today.',
        'I does not go to school today.',
      ],
      correctAns: 'I do not go to school today.',
      explanation: 'Phủ định thì hiện tại đơn với I/You/We/They dùng "do not".',
    },
    {
      id: 'q-en-mc-03',
      type: 'MULTIPLE_CHOICE',
      level: 'A1',
      question: 'What is the plural of "child"?',
      options: ['childs', 'childes', 'children', 'child'],
      correctAns: 'children',
      explanation: '"Children" là số nhiều bất quy tắc của "child".',
    },
    {
      id: 'q-en-mc-04',
      type: 'MULTIPLE_CHOICE',
      level: 'A1',
      question: 'Choose the correct article: "___ apple a day keeps the doctor away."',
      options: ['A', 'An', 'The', 'No article'],
      correctAns: 'An',
      explanation: 'Dùng "an" trước từ bắt đầu bằng nguyên âm (a, e, i, o, u). "Apple" bắt đầu bằng "a".',
    },
    {
      id: 'q-en-mc-05',
      type: 'MULTIPLE_CHOICE',
      level: 'A1',
      question: 'What does "happy" mean in Vietnamese?',
      options: ['buồn', 'tức giận', 'vui vẻ / hạnh phúc', 'mệt mỏi'],
      correctAns: 'vui vẻ / hạnh phúc',
      explanation: '"Happy" nghĩa là vui vẻ hoặc hạnh phúc.',
    },
    {
      id: 'q-en-mc-06',
      type: 'MULTIPLE_CHOICE',
      level: 'A1',
      question: 'Choose the correct possessive: "This is ___ book." (belonging to him)',
      options: ['he', 'him', 'his', 'her'],
      correctAns: 'his',
      explanation: '"His" là tính từ sở hữu của "he" (anh ấy).',
    },
    {
      id: 'q-en-mc-07',
      type: 'MULTIPLE_CHOICE',
      level: 'A1',
      question: 'Which word is a verb?',
      options: ['beautiful', 'study', 'happy', 'school'],
      correctAns: 'study',
      explanation: '"Study" là động từ (học tập). Các từ còn lại là tính từ hoặc danh từ.',
    },
    {
      id: 'q-en-mc-08',
      type: 'MULTIPLE_CHOICE',
      level: 'A1',
      question: '"What time ___ it?" — Choose the correct word.',
      options: ['am', 'is', 'are', 'do'],
      correctAns: 'is',
      explanation: '"What time is it?" — dùng "is" vì chủ ngữ là "it".',
    },

    // ── MULTIPLE CHOICE A2 ────────────────────────────────────────────────────
    {
      id: 'q-en-mc-09',
      type: 'MULTIPLE_CHOICE',
      level: 'A2',
      question: 'She ___ TV when I called her. (watch)',
      options: ['watched', 'was watching', 'is watching', 'watches'],
      correctAns: 'was watching',
      explanation: 'Dùng Past Continuous (was/were + V-ing) cho hành động đang xảy ra khi có hành động khác xen vào.',
    },
    {
      id: 'q-en-mc-10',
      type: 'MULTIPLE_CHOICE',
      level: 'A2',
      question: 'I ___ to Japan twice. (be)',
      options: ['was', 'have been', 'went', 'had been'],
      correctAns: 'have been',
      explanation: 'Dùng Present Perfect (have/has + V3) để nói về kinh nghiệm trong cuộc đời.',
    },
    {
      id: 'q-en-mc-11',
      type: 'MULTIPLE_CHOICE',
      level: 'A2',
      question: 'The book is ___ the table.',
      options: ['in', 'on', 'at', 'by'],
      correctAns: 'on',
      explanation: 'Dùng "on" cho vật trên bề mặt.',
    },
    {
      id: 'q-en-mc-12',
      type: 'MULTIPLE_CHOICE',
      level: 'A2',
      question: 'Choose the comparative form: "This exercise is ___ than the last one." (difficult)',
      options: ['more difficult', 'difficulter', 'most difficult', 'the most difficult'],
      correctAns: 'more difficult',
      explanation: 'Tính từ dài (≥3 âm tiết) dùng "more + adj" để so sánh hơn.',
    },

    // ── FILL IN THE BLANK A1 ──────────────────────────────────────────────────
    {
      id: 'q-en-fill-01',
      type: 'FILL_BLANK',
      level: 'A1',
      question: 'Complete the sentence: "I ___ (eat) breakfast every morning."',
      options: null,
      correctAns: 'eat',
      explanation: 'Thì hiện tại đơn với I, dùng động từ nguyên thể: eat.',
    },
    {
      id: 'q-en-fill-02',
      type: 'FILL_BLANK',
      level: 'A1',
      question: 'Fill in the blank: "She ___ (not/like) coffee."',
      options: null,
      correctAns: "doesn't like",
      explanation: 'Phủ định hiện tại đơn với She: doesn\'t + V nguyên thể.',
    },
    {
      id: 'q-en-fill-03',
      type: 'FILL_BLANK',
      level: 'A1',
      question: 'Complete: "There ___ two cats in the garden."',
      options: null,
      correctAns: 'are',
      explanation: 'Dùng "are" với danh từ số nhiều (two cats).',
    },
    {
      id: 'q-en-fill-04',
      type: 'FILL_BLANK',
      level: 'A2',
      question: 'Fill in: "He ___ (go) to school yesterday."',
      options: null,
      correctAns: 'went',
      explanation: '"Went" là quá khứ bất quy tắc của "go".',
    },
    {
      id: 'q-en-fill-05',
      type: 'FILL_BLANK',
      level: 'A2',
      question: 'Complete: "I have lived in Hanoi ___ 5 years."',
      options: null,
      correctAns: 'for',
      explanation: 'Dùng "for" với khoảng thời gian (5 years). Dùng "since" với mốc thời gian (2019).',
    },

    // ── ARRANGE A1 ────────────────────────────────────────────────────────────
    {
      id: 'q-en-arr-01',
      type: 'ARRANGE',
      level: 'A1',
      question: 'Arrange the words to make a correct sentence: [every / I / day / English / study]',
      options: ['every', 'I', 'day', 'English', 'study'],
      correctAns: 'I study English every day',
      explanation: 'Cấu trúc câu: Chủ ngữ + Động từ + Tân ngữ + Trạng ngữ thời gian.',
    },
    {
      id: 'q-en-arr-02',
      type: 'ARRANGE',
      level: 'A1',
      question: 'Arrange: [is / name / your / What]',
      options: ['is', 'name', 'your', 'What'],
      correctAns: 'What is your name',
      explanation: 'Câu hỏi với "what": What + is + chủ ngữ?',
    },
    {
      id: 'q-en-arr-03',
      type: 'ARRANGE',
      level: 'A2',
      question: 'Arrange: [does / Where / work / she]',
      options: ['does', 'Where', 'work', 'she'],
      correctAns: 'Where does she work',
      explanation: 'Câu hỏi Wh- với hiện tại đơn: Wh- + does + chủ ngữ + V?',
    },

    // ── MULTIPLE CHOICE B1 ────────────────────────────────────────────────────
    {
      id: 'q-en-mc-b1-01',
      type: 'MULTIPLE_CHOICE',
      level: 'B1',
      question: 'If I ___ rich, I would travel the world.',
      options: ['am', 'was', 'were', 'will be'],
      correctAns: 'were',
      explanation: 'Câu điều kiện loại 2: If + Simple Past (dùng "were" cho tất cả chủ ngữ), would + V.',
    },
    {
      id: 'q-en-mc-b1-02',
      type: 'MULTIPLE_CHOICE',
      level: 'B1',
      question: 'She asked me ___ I was happy.',
      options: ['that', 'if', 'what', 'which'],
      correctAns: 'if',
      explanation: 'Câu hỏi gián tiếp Yes/No dùng "if" hoặc "whether".',
    },
    {
      id: 'q-en-mc-b1-03',
      type: 'MULTIPLE_CHOICE',
      level: 'B1',
      question: 'The report ___ by the team last week.',
      options: [
        'was written',
        'written',
        'is written',
        'has written',
      ],
      correctAns: 'was written',
      explanation: 'Câu bị động thì quá khứ đơn: was/were + V3.',
    },
  ]

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
    })
  }

  console.log(`  ✓ Quiz seeded: ${questions.length} câu hỏi (MC, Fill-blank, Arrange — A1→B1)`)
}
