// database/seeds/vocabulary.seed.ts — Seed vocabulary cards
import { PrismaClient } from "@prisma/client";

export async function seedVocabulary(prisma: PrismaClient) {
  console.log("  → Seeding vocabulary...");

  const enLang = await prisma.language.findUnique({ where: { code: "EN" } });
  const zhLang = await prisma.language.findUnique({ where: { code: "ZH" } });
  const jaLang = await prisma.language.findUnique({ where: { code: "JA" } });

  if (!enLang || !zhLang || !jaLang) {
    throw new Error("Languages chưa được seed. Chạy seedLanguages() trước.");
  }

  // ─── Tiếng Anh A1 ────────────────────────────────────────────────────────────
  const englishWords = [
    // Food & Drink
    { word: "apple", pronunciation: "/ˈæp.əl/", meaningVi: "quả táo", exampleSentence: "I eat an apple every day.", topicTags: ["food"], level: "A1" },
    { word: "banana", pronunciation: "/bəˈnɑː.nə/", meaningVi: "quả chuối", exampleSentence: "She likes banana smoothies.", topicTags: ["food"], level: "A1" },
    { word: "water", pronunciation: "/ˈwɔː.tər/", meaningVi: "nước", exampleSentence: "Please give me a glass of water.", topicTags: ["food", "daily"], level: "A1" },
    { word: "rice", pronunciation: "/raɪs/", meaningVi: "cơm, gạo", exampleSentence: "We have rice for lunch.", topicTags: ["food"], level: "A1" },
    { word: "bread", pronunciation: "/bred/", meaningVi: "bánh mì", exampleSentence: "I eat bread for breakfast.", topicTags: ["food"], level: "A1" },
    { word: "milk", pronunciation: "/mɪlk/", meaningVi: "sữa", exampleSentence: "Children should drink milk every day.", topicTags: ["food"], level: "A1" },
    { word: "coffee", pronunciation: "/ˈkɒf.i/", meaningVi: "cà phê", exampleSentence: "He drinks coffee in the morning.", topicTags: ["food", "daily"], level: "A1" },
    { word: "egg", pronunciation: "/eɡ/", meaningVi: "quả trứng", exampleSentence: "I had two eggs for breakfast.", topicTags: ["food"], level: "A1" },

    // Daily Life
    { word: "house", pronunciation: "/haʊs/", meaningVi: "ngôi nhà", exampleSentence: "My house has three bedrooms.", topicTags: ["daily", "home"], level: "A1" },
    { word: "school", pronunciation: "/skuːl/", meaningVi: "trường học", exampleSentence: "She goes to school every day.", topicTags: ["daily", "education"], level: "A1" },
    { word: "book", pronunciation: "/bʊk/", meaningVi: "quyển sách", exampleSentence: "I am reading a good book.", topicTags: ["daily", "education"], level: "A1" },
    { word: "phone", pronunciation: "/fəʊn/", meaningVi: "điện thoại", exampleSentence: "My phone is new.", topicTags: ["daily", "technology"], level: "A1" },
    { word: "car", pronunciation: "/kɑːr/", meaningVi: "xe ô tô", exampleSentence: "He drives a red car.", topicTags: ["daily", "transport"], level: "A1" },
    { word: "money", pronunciation: "/ˈmʌn.i/", meaningVi: "tiền", exampleSentence: "I need more money.", topicTags: ["daily"], level: "A1" },
    { word: "time", pronunciation: "/taɪm/", meaningVi: "thời gian", exampleSentence: "What time is it?", topicTags: ["daily"], level: "A1" },
    { word: "day", pronunciation: "/deɪ/", meaningVi: "ngày", exampleSentence: "Today is a beautiful day.", topicTags: ["daily"], level: "A1" },

    // Family
    { word: "family", pronunciation: "/ˈfæm.ɪ.li/", meaningVi: "gia đình", exampleSentence: "I love my family.", topicTags: ["family"], level: "A1" },
    { word: "mother", pronunciation: "/ˈmʌð.ər/", meaningVi: "mẹ", exampleSentence: "My mother is a teacher.", topicTags: ["family"], level: "A1" },
    { word: "father", pronunciation: "/ˈfɑː.ðər/", meaningVi: "bố", exampleSentence: "My father works in an office.", topicTags: ["family"], level: "A1" },
    { word: "brother", pronunciation: "/ˈbrʌð.ər/", meaningVi: "anh/em trai", exampleSentence: "I have one brother.", topicTags: ["family"], level: "A1" },
    { word: "sister", pronunciation: "/ˈsɪs.tər/", meaningVi: "chị/em gái", exampleSentence: "My sister is very kind.", topicTags: ["family"], level: "A1" },
    { word: "friend", pronunciation: "/frend/", meaningVi: "bạn bè", exampleSentence: "She is my best friend.", topicTags: ["family", "daily"], level: "A1" },

    // Colors
    { word: "red", pronunciation: "/red/", meaningVi: "màu đỏ", exampleSentence: "I like red roses.", topicTags: ["colors"], level: "A1" },
    { word: "blue", pronunciation: "/bluː/", meaningVi: "màu xanh dương", exampleSentence: "The sky is blue.", topicTags: ["colors"], level: "A1" },
    { word: "green", pronunciation: "/ɡriːn/", meaningVi: "màu xanh lá", exampleSentence: "Leaves are green.", topicTags: ["colors"], level: "A1" },
    { word: "white", pronunciation: "/waɪt/", meaningVi: "màu trắng", exampleSentence: "Snow is white.", topicTags: ["colors"], level: "A1" },
    { word: "black", pronunciation: "/blæk/", meaningVi: "màu đen", exampleSentence: "I have a black cat.", topicTags: ["colors"], level: "A1" },

    // Numbers & Time
    { word: "morning", pronunciation: "/ˈmɔː.nɪŋ/", meaningVi: "buổi sáng", exampleSentence: "Good morning!", topicTags: ["daily", "time"], level: "A1" },
    { word: "afternoon", pronunciation: "/ˌɑːf.təˈnuːn/", meaningVi: "buổi chiều", exampleSentence: "I take a nap in the afternoon.", topicTags: ["daily", "time"], level: "A1" },
    { word: "night", pronunciation: "/naɪt/", meaningVi: "buổi tối/đêm", exampleSentence: "Good night, sleep well.", topicTags: ["daily", "time"], level: "A1" },
    { word: "week", pronunciation: "/wiːk/", meaningVi: "tuần", exampleSentence: "There are seven days in a week.", topicTags: ["daily", "time"], level: "A1" },
    { word: "month", pronunciation: "/mʌnθ/", meaningVi: "tháng", exampleSentence: "January is the first month.", topicTags: ["daily", "time"], level: "A1" },
    { word: "year", pronunciation: "/jɪər/", meaningVi: "năm", exampleSentence: "Happy New Year!", topicTags: ["daily", "time"], level: "A1" },

    // Common Verbs A1
    { word: "eat", pronunciation: "/iːt/", meaningVi: "ăn", exampleSentence: "I eat breakfast at 7am.", topicTags: ["daily", "verbs"], level: "A1" },
    { word: "drink", pronunciation: "/drɪŋk/", meaningVi: "uống", exampleSentence: "He drinks water every hour.", topicTags: ["daily", "verbs"], level: "A1" },
    { word: "sleep", pronunciation: "/sliːp/", meaningVi: "ngủ", exampleSentence: "I sleep 8 hours a day.", topicTags: ["daily", "verbs"], level: "A1" },
    { word: "work", pronunciation: "/wɜːrk/", meaningVi: "làm việc", exampleSentence: "She works at a hospital.", topicTags: ["daily", "verbs", "work"], level: "A1" },
    { word: "study", pronunciation: "/ˈstʌd.i/", meaningVi: "học tập", exampleSentence: "I study English every day.", topicTags: ["education", "verbs"], level: "A1" },
    { word: "go", pronunciation: "/ɡəʊ/", meaningVi: "đi", exampleSentence: "Let us go to the park.", topicTags: ["daily", "verbs"], level: "A1" },
    { word: "come", pronunciation: "/kʌm/", meaningVi: "đến, đi đến", exampleSentence: "Please come here.", topicTags: ["daily", "verbs"], level: "A1" },
    { word: "see", pronunciation: "/siː/", meaningVi: "nhìn thấy, gặp", exampleSentence: "I see you tomorrow.", topicTags: ["daily", "verbs"], level: "A1" },
    { word: "like", pronunciation: "/laɪk/", meaningVi: "thích", exampleSentence: "I like this song.", topicTags: ["daily", "verbs"], level: "A1" },
    { word: "want", pronunciation: "/wɒnt/", meaningVi: "muốn", exampleSentence: "I want to learn English.", topicTags: ["daily", "verbs"], level: "A1" },

    // Places
    { word: "hospital", pronunciation: "/ˈhɒs.pɪ.təl/", meaningVi: "bệnh viện", exampleSentence: "My mother works in a hospital.", topicTags: ["places"], level: "A1" },
    { word: "supermarket", pronunciation: "/ˈsuː.pəˌmɑː.kɪt/", meaningVi: "siêu thị", exampleSentence: "I buy food at the supermarket.", topicTags: ["places", "daily"], level: "A1" },
    { word: "restaurant", pronunciation: "/ˈres.tər.ɒnt/", meaningVi: "nhà hàng", exampleSentence: "We had dinner at a restaurant.", topicTags: ["places", "food"], level: "A1" },
    { word: "park", pronunciation: "/pɑːrk/", meaningVi: "công viên", exampleSentence: "Children play in the park.", topicTags: ["places", "daily"], level: "A1" },
    { word: "airport", pronunciation: "/ˈeər.pɔːrt/", meaningVi: "sân bay", exampleSentence: "We arrived at the airport early.", topicTags: ["places", "travel"], level: "A2" },

    // Adjectives A1
    { word: "happy", pronunciation: "/ˈhæp.i/", meaningVi: "vui vẻ, hạnh phúc", exampleSentence: "I am very happy today.", topicTags: ["emotions", "adjectives"], level: "A1" },
    { word: "sad", pronunciation: "/sæd/", meaningVi: "buồn", exampleSentence: "She looks sad today.", topicTags: ["emotions", "adjectives"], level: "A1" },
    { word: "big", pronunciation: "/bɪɡ/", meaningVi: "to lớn", exampleSentence: "That is a big house.", topicTags: ["adjectives"], level: "A1" },
    { word: "small", pronunciation: "/smɔːl/", meaningVi: "nhỏ bé", exampleSentence: "She has a small cat.", topicTags: ["adjectives"], level: "A1" },
    { word: "good", pronunciation: "/ɡʊd/", meaningVi: "tốt, ngon", exampleSentence: "This food is very good.", topicTags: ["adjectives", "daily"], level: "A1" },
    { word: "beautiful", pronunciation: "/ˈbjuː.tɪ.fəl/", meaningVi: "đẹp", exampleSentence: "Vietnam is a beautiful country.", topicTags: ["adjectives"], level: "A1" },
  ];

  for (const word of englishWords) {
    await prisma.vocabularyCard.upsert({
      where: {
        // upsert theo word + languageId để tránh duplicate
        id: `en-${word.word}`,
      },
      update: {},
      create: {
        id: `en-${word.word}`,
        languageId: enLang.id,
        word: word.word,
        pronunciation: word.pronunciation,
        meaningVi: word.meaningVi,
        exampleSentence: word.exampleSentence,
        topicTags: word.topicTags,
        level: word.level as any,
      },
    });
  }

  // ─── Tiếng Trung A1 (mẫu 10 từ) ──────────────────────────────────────────────
  const chineseWords = [
    { word: "你好", pronunciation: "nǐ hǎo", meaningVi: "xin chào", exampleSentence: "你好，很高兴认识你。(Xin chào, rất vui được gặp bạn.)", topicTags: ["greetings"], level: "A1" },
    { word: "谢谢", pronunciation: "xiè xiè", meaningVi: "cảm ơn", exampleSentence: "谢谢你的帮助。(Cảm ơn sự giúp đỡ của bạn.)", topicTags: ["greetings", "daily"], level: "A1" },
    { word: "再见", pronunciation: "zài jiàn", meaningVi: "tạm biệt", exampleSentence: "明天见，再见！(Hẹn gặp ngày mai, tạm biệt!)", topicTags: ["greetings"], level: "A1" },
    { word: "水", pronunciation: "shuǐ", meaningVi: "nước", exampleSentence: "我要喝水。(Tôi muốn uống nước.)", topicTags: ["food", "daily"], level: "A1" },
    { word: "吃饭", pronunciation: "chī fàn", meaningVi: "ăn cơm", exampleSentence: "我们去吃饭吧。(Chúng ta đi ăn cơm thôi.)", topicTags: ["food", "daily"], level: "A1" },
    { word: "朋友", pronunciation: "péng yǒu", meaningVi: "bạn bè", exampleSentence: "他是我的好朋友。(Anh ấy là bạn tốt của tôi.)", topicTags: ["family", "daily"], level: "A1" },
    { word: "家", pronunciation: "jiā", meaningVi: "nhà, gia đình", exampleSentence: "我回家了。(Tôi về nhà rồi.)", topicTags: ["home", "family"], level: "A1" },
    { word: "工作", pronunciation: "gōng zuò", meaningVi: "công việc, làm việc", exampleSentence: "我喜欢我的工作。(Tôi thích công việc của mình.)", topicTags: ["work", "daily"], level: "A1" },
    { word: "学习", pronunciation: "xué xí", meaningVi: "học tập", exampleSentence: "我每天学习中文。(Tôi học tiếng Trung mỗi ngày.)", topicTags: ["education"], level: "A1" },
    { word: "喜欢", pronunciation: "xǐ huān", meaningVi: "thích", exampleSentence: "我喜欢吃越南菜。(Tôi thích ăn món Việt.)", topicTags: ["daily", "verbs"], level: "A1" },
  ];

  for (const word of chineseWords) {
    await prisma.vocabularyCard.upsert({
      where: { id: `zh-${word.word}` },
      update: {},
      create: {
        id: `zh-${word.word}`,
        languageId: zhLang.id,
        word: word.word,
        pronunciation: word.pronunciation,
        meaningVi: word.meaningVi,
        exampleSentence: word.exampleSentence,
        topicTags: word.topicTags,
        level: word.level as any,
      },
    });
  }

  // ─── Tiếng Nhật A1 (mẫu 10 từ) ───────────────────────────────────────────────
  const japaneseWords = [
    {
      word: "こんにちは",
      pronunciation: "konnichiwa",
      meaningVi: "xin chào (ban ngày)",
      exampleSentence: "こんにちは、元気ですか？(Xin chào, bạn khỏe không?)",
      topicTags: ["greetings"],
      level: "A1",
    },
    { word: "ありがとう", pronunciation: "arigatou", meaningVi: "cảm ơn", exampleSentence: "ありがとうございます。(Cảm ơn bạn rất nhiều.)", topicTags: ["greetings", "daily"], level: "A1" },
    { word: "さようなら", pronunciation: "sayounara", meaningVi: "tạm biệt", exampleSentence: "さようなら、またね！(Tạm biệt, hẹn gặp lại!)", topicTags: ["greetings"], level: "A1" },
    { word: "水", pronunciation: "mizu", meaningVi: "nước", exampleSentence: "水を飲みたい。(Tôi muốn uống nước.)", topicTags: ["food", "daily"], level: "A1" },
    { word: "食べる", pronunciation: "taberu", meaningVi: "ăn", exampleSentence: "ご飯を食べる。(Ăn cơm.)", topicTags: ["food", "verbs"], level: "A1" },
    { word: "友達", pronunciation: "tomodachi", meaningVi: "bạn bè", exampleSentence: "彼は私の友達です。(Anh ấy là bạn của tôi.)", topicTags: ["family", "daily"], level: "A1" },
    { word: "家", pronunciation: "ie / uchi", meaningVi: "nhà", exampleSentence: "家に帰ります。(Tôi về nhà.)", topicTags: ["home", "daily"], level: "A1" },
    { word: "仕事", pronunciation: "shigoto", meaningVi: "công việc", exampleSentence: "仕事が好きです。(Tôi thích công việc.)", topicTags: ["work"], level: "A1" },
    { word: "勉強", pronunciation: "benkyou", meaningVi: "học tập", exampleSentence: "日本語を勉強しています。(Tôi đang học tiếng Nhật.)", topicTags: ["education"], level: "A1" },
    { word: "好き", pronunciation: "suki", meaningVi: "thích", exampleSentence: "音楽が好きです。(Tôi thích âm nhạc.)", topicTags: ["daily", "adjectives"], level: "A1" },
  ];

  for (const word of japaneseWords) {
    await prisma.vocabularyCard.upsert({
      where: { id: `ja-${word.word}` },
      update: {},
      create: {
        id: `ja-${word.word}`,
        languageId: jaLang.id,
        word: word.word,
        pronunciation: word.pronunciation,
        meaningVi: word.meaningVi,
        exampleSentence: word.exampleSentence,
        topicTags: word.topicTags,
        level: word.level as any,
      },
    });
  }

  console.log(`  ✓ Vocabulary seeded: ${englishWords.length} EN, ${chineseWords.length} ZH, ${japaneseWords.length} JA`);
}
