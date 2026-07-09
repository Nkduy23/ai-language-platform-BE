// database/seeds/grammar.seed.ts — Seed grammar lessons
import { PrismaClient } from "@prisma/client";

export async function seedGrammar(prisma: PrismaClient) {
  console.log("  → Seeding grammar lessons...");

  const enLang = await prisma.language.findUnique({ where: { code: "EN" } });
  if (!enLang) throw new Error("Language EN chưa được seed.");

  const lessons = [
    // ── A1 ────────────────────────────────────────────────────────────────────
    {
      id: "en-grammar-a1-01",
      title: 'Động từ "To Be" (am / is / are)',
      level: "A1",
      orderIndex: 1,
      content: `# Động từ "To Be": am / is / are

## Giới thiệu
Động từ "to be" là một trong những động từ quan trọng nhất trong tiếng Anh. Nó được dùng để diễn tả trạng thái, nghề nghiệp, quốc tịch, và nhiều thứ khác.

## Cấu trúc

| Chủ ngữ | Động từ | Ví dụ |
|---------|---------|-------|
| I | am | I am a student. |
| He / She / It | is | She is happy. |
| You / We / They | are | They are friends. |

## Dạng phủ định
- I am **not** → I'm not
- He is **not** → He isn't
- They are **not** → They aren't

## Dạng câu hỏi
- **Am** I late? → Yes, you are. / No, you aren't.
- **Is** she a doctor? → Yes, she is. / No, she isn't.
- **Are** they students? → Yes, they are. / No, they aren't.

## Ví dụ thực tế
- I **am** Vietnamese. (Tôi là người Việt Nam.)
- He **is** 25 years old. (Anh ấy 25 tuổi.)
- We **are** happy today. (Hôm nay chúng tôi vui.)
- **Is** she your friend? (Cô ấy có phải bạn của bạn không?)

## Lưu ý
Trong văn nói, người ta thường dùng dạng rút gọn:
- I am → **I'm**
- He is → **He's**
- They are → **They're**`,
    },
    {
      id: "en-grammar-a1-02",
      title: "Mạo từ: a / an / the",
      level: "A1",
      orderIndex: 2,
      content: `# Mạo từ: a / an / the

## Giới thiệu
Mạo từ (article) đứng trước danh từ để xác định danh từ đó là cụ thể hay không cụ thể.

## A và AN — Mạo từ không xác định

Dùng khi nhắc đến thứ gì đó **lần đầu tiên** hoặc **không cụ thể**.

| Khi nào dùng | Mạo từ | Ví dụ |
|---|---|---|
| Trước phụ âm | **a** | a book, a car, a student |
| Trước nguyên âm (a,e,i,o,u) | **an** | an apple, an egg, an umbrella |

## THE — Mạo từ xác định

Dùng khi **cả người nói lẫn người nghe đều biết** thứ đang được nhắc đến.

- Please close **the** door. (cái cửa đó — cả hai cùng biết)
- **The** sun is hot today. (mặt trời — chỉ có một)
- I have a cat. **The** cat is black. (lần 2 nhắc lại)

## Không dùng mạo từ

- Trước danh từ số nhiều không xác định: **Books** are useful.
- Trước tên riêng: **Vietnam** is beautiful.
- Trước bữa ăn: I eat **breakfast** at 7am.

## Ví dụ tổng hợp
- I saw **a** dog in the park. **The** dog was very cute.
- She is **a** doctor at **a** hospital.
- **The** coffee in this café is delicious.`,
    },
    {
      id: "en-grammar-a1-03",
      title: "Thì Hiện Tại Đơn (Simple Present)",
      level: "A1",
      orderIndex: 3,
      content: `# Thì Hiện Tại Đơn (Simple Present Tense)

## Khi nào dùng?
1. Thói quen, hành động lặp đi lặp lại
2. Sự thật hiển nhiên, quy luật tự nhiên
3. Lịch trình cố định

## Cấu trúc

### Câu khẳng định
- I / You / We / They + **V (nguyên thể)**
- He / She / It + **V-s / V-es**

| Chủ ngữ | Động từ | Ví dụ |
|---------|---------|-------|
| I | work | I work every day. |
| She | works | She works at a school. |
| They | study | They study English. |

### Thêm -s hay -es?
- Thêm **-s**: play → plays, eat → eats
- Thêm **-es** (sau s, sh, ch, x, o): watch → watches, go → goes
- Bất quy tắc: have → **has**

### Câu phủ định
- I / You / We / They + **do not (don't)** + V
- He / She / It + **does not (doesn't)** + V

> She **doesn't** like coffee.
> I **don't** watch TV.

### Câu hỏi
- **Do** + I/you/we/they + V?
- **Does** + he/she/it + V?

> **Does** she speak English? → Yes, she does.
> **Do** you like pizza? → No, I don't.

## Từ chỉ tần suất (Adverbs of frequency)
always > usually > often > sometimes > rarely > never

> I **always** wake up at 6am.
> She **sometimes** eats lunch at home.`,
    },
    {
      id: "en-grammar-a1-04",
      title: "Đại từ nhân xưng & Tính từ sở hữu",
      level: "A1",
      orderIndex: 4,
      content: `# Đại từ nhân xưng & Tính từ sở hữu

## Đại từ nhân xưng (Personal Pronouns)

| Chủ ngữ | Tân ngữ | Nghĩa |
|---------|---------|-------|
| I | me | tôi |
| You | you | bạn |
| He | him | anh ấy |
| She | her | cô ấy |
| It | it | nó |
| We | us | chúng tôi |
| They | them | họ |

> **I** love **her**. (Tôi yêu cô ấy.)
> **She** knows **me**. (Cô ấy biết tôi.)

## Tính từ sở hữu (Possessive Adjectives)

| Chủ ngữ | Sở hữu | Ví dụ |
|---------|--------|-------|
| I | **my** | my book |
| You | **your** | your car |
| He | **his** | his phone |
| She | **her** | her bag |
| It | **its** | its name |
| We | **our** | our house |
| They | **their** | their dog |

> This is **my** bag. (Đây là túi của tôi.)
> What is **your** name? (Tên bạn là gì?)
> **His** father is a doctor. (Bố anh ấy là bác sĩ.)`,
    },
    {
      id: "en-grammar-a1-05",
      title: "Câu hỏi với Wh- (What, Where, When, Who, Why, How)",
      level: "A1",
      orderIndex: 5,
      content: `# Câu hỏi với Wh-

## Các từ để hỏi

| Từ hỏi | Dùng để hỏi | Ví dụ |
|--------|-------------|-------|
| **What** | cái gì, điều gì | What is your name? |
| **Where** | ở đâu | Where do you live? |
| **When** | khi nào | When is your birthday? |
| **Who** | ai | Who is your teacher? |
| **Why** | tại sao | Why are you late? |
| **How** | như thế nào | How are you? |
| **How much** | bao nhiêu (không đếm được) | How much is this? |
| **How many** | bao nhiêu (đếm được) | How many siblings do you have? |

## Cấu trúc

### Với động từ "to be"
**Wh-** + am/is/are + chủ ngữ?
> **Where** is the hospital?
> **Who** is she?

### Với động từ thường
**Wh-** + do/does + chủ ngữ + V?
> **What** do you eat for breakfast?
> **Where** does she work?

## Ví dụ hội thoại
A: **What** is your job?
B: I am a teacher.

A: **Where** do you work?
B: I work in Hanoi.

A: **How** do you go to work?
B: I go by motorbike.`,
    },

    // ── A2 ────────────────────────────────────────────────────────────────────
    {
      id: "en-grammar-a2-01",
      title: "Thì Hiện Tại Tiếp Diễn (Present Continuous)",
      level: "A2",
      orderIndex: 1,
      content: `# Thì Hiện Tại Tiếp Diễn (Present Continuous)

## Khi nào dùng?
1. Hành động đang xảy ra **ngay lúc nói**
2. Kế hoạch đã sắp xếp trong **tương lai gần**
3. Xu hướng đang thay đổi

## Cấu trúc
**am / is / are + V-ing**

| Chủ ngữ | Công thức | Ví dụ |
|---------|-----------|-------|
| I | am + V-ing | I am eating. |
| He/She/It | is + V-ing | She is working now. |
| You/We/They | are + V-ing | They are studying. |

## Quy tắc thêm -ing
- Thông thường: work → work**ing**
- Kết thúc bằng -e: come → com**ing**
- Kết thúc bằng phụ âm đơn (sau nguyên âm đơn): run → run**ning**

## Phủ định
am/is/are + **not** + V-ing
> I **am not** watching TV. / She **isn't** sleeping.

## Câu hỏi
am/is/are + chủ ngữ + V-ing?
> **Are** you **working** now? → Yes, I am. / No, I'm not.

## So sánh với Simple Present

| Simple Present | Present Continuous |
|---|---|
| I **work** every day. (thói quen) | I **am working** now. (đang làm) |
| She **drinks** coffee. (thói quen) | She **is drinking** coffee. (đang uống) |

## Từ chỉ thời gian thường gặp
now, right now, at the moment, currently, today, this week`,
    },
    {
      id: "en-grammar-a2-02",
      title: "Thì Quá Khứ Đơn (Simple Past)",
      level: "A2",
      orderIndex: 2,
      content: `# Thì Quá Khứ Đơn (Simple Past Tense)

## Khi nào dùng?
Diễn tả hành động đã **hoàn thành** trong quá khứ (có thời gian cụ thể).

## Cấu trúc

### Động từ có quy tắc (Regular verbs)
V + **-ed**
> work → work**ed**, play → play**ed**, study → studi**ed**

### Động từ bất quy tắc (Irregular verbs) — phải học thuộc
| Hiện tại | Quá khứ | Nghĩa |
|----------|---------|-------|
| go | went | đi |
| eat | ate | ăn |
| have | had | có |
| see | saw | nhìn thấy |
| come | came | đến |
| do | did | làm |
| get | got | lấy/nhận |
| make | made | làm/tạo ra |
| say | said | nói |
| know | knew | biết |

## Phủ định
**did not (didn't)** + V (nguyên thể)
> I **didn't go** to school yesterday.
> She **didn't eat** breakfast.

## Câu hỏi
**Did** + chủ ngữ + V?
> **Did** you **see** the movie? → Yes, I did. / No, I didn't.

## Từ chỉ thời gian
yesterday, last night, last week, last year, ago, in 2020

> I **visited** Hanoi **last year**.
> She **called** me **2 hours ago**.`,
    },
    {
      id: "en-grammar-a2-03",
      title: "Giới từ chỉ nơi chốn (in / on / at)",
      level: "A2",
      orderIndex: 3,
      content: `# Giới từ chỉ nơi chốn: in / on / at

## IN — Bên trong

Dùng cho:
- Không gian bao quanh: in a room, in a box, in a bag
- Thành phố, quốc gia: in Hanoi, in Vietnam
- Phương tiện (cabin kín): in a car, in a taxi

> The book is **in** the bag.
> She lives **in** Ho Chi Minh City.

## ON — Trên bề mặt

Dùng cho:
- Trên bề mặt: on the table, on the floor, on the wall
- Phương tiện công cộng: on the bus, on the train, on the plane
- Đường phố: on Nguyen Hue street

> The phone is **on** the table.
> I go to work **on** the bus.

## AT — Tại điểm cụ thể

Dùng cho:
- Địa điểm cụ thể: at school, at home, at work, at the airport
- Địa chỉ: at 123 Le Loi street
- Sự kiện: at a party, at a concert

> She is **at** work now.
> I'll meet you **at** the café.

## Tóm tắt nhanh
| | Ví dụ |
|---|---|
| **in** (bên trong) | in the room, in Vietnam |
| **on** (bề mặt) | on the table, on the bus |
| **at** (điểm cụ thể) | at home, at school |`,
    },

    // ── B1 ────────────────────────────────────────────────────────────────────
    {
      id: "en-grammar-b1-01",
      title: "Thì Hiện Tại Hoàn Thành (Present Perfect)",
      level: "B1",
      orderIndex: 1,
      content: `# Thì Hiện Tại Hoàn Thành (Present Perfect)

## Khi nào dùng?
1. Hành động xảy ra trong quá khứ nhưng **kết quả ảnh hưởng đến hiện tại**
2. Kinh nghiệm trong cuộc đời (không cần thời gian cụ thể)
3. Hành động vừa mới xảy ra

## Cấu trúc
**have / has + V3 (past participle)**

| Chủ ngữ | Công thức | Ví dụ |
|---------|-----------|-------|
| I / You / We / They | have + V3 | I have eaten. |
| He / She / It | has + V3 | She has lived here for 5 years. |

## Các từ thường đi kèm
- **ever** (đã từng): Have you **ever** been to Japan?
- **never** (chưa bao giờ): I have **never** eaten sushi.
- **already** (rồi): She has **already** finished.
- **yet** (chưa — cuối câu hỏi/phủ định): Have you eaten **yet**? / I haven't called **yet**.
- **just** (vừa mới): He has **just** arrived.
- **for** (trong khoảng): I have lived here **for** 3 years.
- **since** (kể từ): She has worked here **since** 2020.

## Phân biệt với Simple Past

| Present Perfect | Simple Past |
|---|---|
| I **have visited** Paris. (kinh nghiệm, không biết khi nào) | I **visited** Paris **in 2019**. (thời gian cụ thể) |
| She **has just** eaten. (vừa xong, ảnh hưởng hiện tại) | She **ate** at 12pm. (đã xong, không liên quan hiện tại) |

## Ví dụ thực tế
- Have you **ever** tried Vietnamese coffee? — Yes, I **have**!
- I **have never** been to Japan.
- She **has lived** in Hanoi for 10 years.
- He **has just** called me.`,
    },
    {
      id: "en-grammar-b1-02",
      title: "Câu điều kiện loại 1 và 2",
      level: "B1",
      orderIndex: 2,
      content: `# Câu điều kiện (Conditionals)

## Loại 1 — Điều kiện có thể xảy ra (Real / Possible)

**If + Simple Present, will + V**

Dùng khi điều kiện **có thể** xảy ra trong thực tế.

> **If** it **rains** tomorrow, I **will stay** at home.
> **If** you **study** hard, you **will pass** the exam.
> **If** she **calls** me, I **will answer**.

💡 Có thể đảo vế: **Will + V** if + Simple Present
> I **will stay** at home if it **rains**.

## Loại 2 — Điều kiện không có thật (Unreal / Hypothetical)

**If + Simple Past, would + V**

Dùng cho tình huống **không có thật** ở hiện tại, hoặc rất khó xảy ra.

> **If** I **were** rich, I **would travel** the world.
> **If** she **had** more time, she **would learn** Japanese.
> **If** I **were** you, I **would apologize**.

⚠️ Lưu ý: Với "to be" trong loại 2, dùng **"were"** cho tất cả chủ ngữ:
> If I **were** a bird... (KHÔNG phải: If I was)

## So sánh nhanh

| | Loại 1 | Loại 2 |
|---|---|---|
| Khả năng | Có thể xảy ra | Khó/không xảy ra |
| If clause | Simple Present | Simple Past |
| Main clause | will + V | would + V |
| Ví dụ | If it rains, I'll stay home. | If I were rich, I'd travel. |`,
    },
  ];

  for (const lesson of lessons) {
    await prisma.grammarLesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: {
        id: lesson.id,
        languageId: enLang.id,
        title: lesson.title,
        content: lesson.content,
        level: lesson.level as any,
        orderIndex: lesson.orderIndex,
      },
    });
  }

  console.log(`  ✓ Grammar EN seeded: ${lessons.length} bài học (A1→B1)`);

  // ── Tiếng Trung ──────────────────────────────────────────────────────────
  const zhLang = await prisma.language.findUnique({ where: { code: "ZH" } });
  if (!zhLang) throw new Error("Language ZH chưa được seed.");

  const zhLessons = [
    {
      id: "zh-grammar-a1-01",
      title: "Câu trần thuật với 是 (shì) — là",
      level: "A1",
      orderIndex: 1,
      content: `# Câu trần thuật với 是 (shì)

## Cấu trúc
\`\`\`
Chủ ngữ + 是 (shì) + Tân ngữ
\`\`\`

是 nghĩa là "là", dùng để nối 2 danh từ, khẳng định danh tính/thân phận.

## Ví dụ
- 我是学生。(Wǒ shì xuéshēng.) — Tôi là học sinh.
- 他是老师。(Tā shì lǎoshī.) — Anh ấy là giáo viên.
- 这是我的书。(Zhè shì wǒ de shū.) — Đây là sách của tôi.

## Thể phủ định
Thêm 不 (bù) trước 是:
- 我不是学生。(Wǒ bú shì xuéshēng.) — Tôi không phải là học sinh.
  *(Lưu ý: 不 đứng trước 是 đọc thành bú do biến điệu thanh 4)*

## Thể nghi vấn
Thêm 吗 (ma) vào cuối câu:
- 你是学生吗？(Nǐ shì xuéshēng ma?) — Bạn là học sinh phải không?`,
    },
    {
      id: "zh-grammar-a1-02",
      title: "Trợ từ sở hữu 的 (de)",
      level: "A1",
      orderIndex: 2,
      content: `# Trợ từ sở hữu 的 (de)

## Cấu trúc
\`\`\`
Người sở hữu + 的 + Vật sở hữu
\`\`\`

的 tương đương với "của" trong tiếng Việt, đặt SAU người sở hữu (ngược với tiếng Việt).

## Ví dụ
- 我的书 (wǒ de shū) — sách của tôi
- 他的名字 (tā de míngzì) — tên của anh ấy
- 老师的电话 (lǎoshī de diànhuà) — số điện thoại của giáo viên

## Lưu ý
Với người thân/quan hệ gần gũi, có thể bỏ 的:
- 我妈妈 (wǒ māma) — mẹ tôi (không cần 我的妈妈, dù vẫn đúng ngữ pháp)

## Bài tập nhanh
Dịch: "Đây là xe của anh ấy." → 这是他的车。(Zhè shì tā de chē.)`,
    },
    {
      id: "zh-grammar-a2-01",
      title: "Trợ từ động thái 了 (le) — chỉ hành động đã hoàn thành",
      level: "A2",
      orderIndex: 3,
      content: `# Trợ từ động thái 了 (le)

## Cấu trúc
\`\`\`
Chủ ngữ + Động từ + 了 + (Tân ngữ)
\`\`\`

了 đặt sau động từ để chỉ hành động đã **hoàn thành**, không hẳn là "quá khứ" như tiếng Anh.

## Ví dụ
- 我吃了。(Wǒ chī le.) — Tôi ăn rồi.
- 他去了北京。(Tā qùle Běijīng.) — Anh ấy đã đi Bắc Kinh.
- 我买了三本书。(Wǒ mǎile sān běn shū.) — Tôi đã mua 3 quyển sách.

## Phân biệt với 过 (guo)
- 了: hành động đã hoàn thành, tập trung vào kết quả
- 过: đã từng trải nghiệm (không quan tâm khi nào)
  - 我去过北京。(Tôi đã từng đi Bắc Kinh — có thể nhiều lần)

## Thể phủ định
Dùng 没(有) + Động từ, **bỏ** 了:
- 我没吃。(Wǒ méi chī.) — Tôi chưa ăn. (KHÔNG nói 我没吃了)`,
    },
    {
      id: "zh-grammar-a2-02",
      title: "Lượng từ (Measure Words) 个, 本, 张...",
      level: "A2",
      orderIndex: 4,
      content: `# Lượng từ (量词 liàngcí)

## Vì sao cần lượng từ?
Trong tiếng Trung, khi đếm danh từ PHẢI có lượng từ đứng giữa số đếm và danh từ — khác tiếng Việt/Anh.

\`\`\`
Số từ + Lượng từ + Danh từ
\`\`\`

## Các lượng từ phổ biến
| Lượng từ | Dùng cho | Ví dụ |
|---|---|---|
| 个 (gè) | Đa năng, người, vật chung chung | 一个人 (một người) |
| 本 (běn) | Sách, vở | 两本书 (hai quyển sách) |
| 张 (zhāng) | Vật phẳng: giấy, bàn, vé | 三张纸 (ba tờ giấy) |
| 杯 (bēi) | Ly, cốc | 一杯水 (một ly nước) |
| 件 (jiàn) | Áo, việc | 一件衣服 (một cái áo) |

## Ví dụ câu đầy đủ
- 我有三个朋友。(Wǒ yǒu sān gè péngyǒu.) — Tôi có 3 người bạn.
- 她买了两本书。(Tā mǎile liǎng běn shū.) — Cô ấy đã mua 2 quyển sách.

## Lưu ý
"2" khi đứng trước lượng từ đọc là 两 (liǎng), không phải 二 (èr).`,
    },
  ];

  for (const lesson of zhLessons) {
    await prisma.grammarLesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: {
        id: lesson.id,
        languageId: zhLang.id,
        title: lesson.title,
        content: lesson.content,
        level: lesson.level as any,
        orderIndex: lesson.orderIndex,
      },
    });
  }
  console.log(`  ✓ Grammar ZH seeded: ${zhLessons.length} bài học (A1→A2)`);

  // ── Tiếng Nhật ───────────────────────────────────────────────────────────
  const jaLang = await prisma.language.findUnique({ where: { code: "JA" } });
  if (!jaLang) throw new Error("Language JA chưa được seed.");

  const jaLessons = [
    {
      id: "ja-grammar-a1-01",
      title: "Trợ từ は (wa) và です (desu)",
      level: "A1",
      orderIndex: 1,
      content: `# Trợ từ は (wa) và です (desu)

## Cấu trúc
\`\`\`
Chủ đề + は + Danh từ/Tính từ + です
\`\`\`

は (đọc là "wa" khi làm trợ từ) đánh dấu **chủ đề** của câu. です là thể lịch sự của "là".

## Ví dụ
- 私は学生です。(Watashi wa gakusei desu.) — Tôi là học sinh.
- これは本です。(Kore wa hon desu.) — Đây là quyển sách.
- 田中さんは先生です。(Tanaka-san wa sensei desu.) — Anh Tanaka là giáo viên.

## Thể phủ định
です → ではありません (dewa arimasen), văn nói: じゃありません
- 私は学生ではありません。— Tôi không phải học sinh.

## Thể nghi vấn
Thêm か (ka) vào cuối câu:
- あなたは学生ですか？(Anata wa gakusei desu ka?) — Bạn là học sinh phải không?`,
    },
    {
      id: "ja-grammar-a1-02",
      title: "Trợ từ を (wo) — đánh dấu tân ngữ",
      level: "A1",
      orderIndex: 2,
      content: `# Trợ từ を (wo/o) — đánh dấu tân ngữ trực tiếp

## Cấu trúc
\`\`\`
Chủ ngữ + は + Tân ngữ + を + Động từ
\`\`\`

を đặt sau tân ngữ trực tiếp của động từ (vật bị tác động).

## Ví dụ
- 水を飲みます。(Mizu o nomimasu.) — Uống nước.
- 本を読みます。(Hon o yomimasu.) — Đọc sách.
- 私はパンを食べます。(Watashi wa pan o tabemasu.) — Tôi ăn bánh mì.

## Lưu ý phát âm
Trợ từ を luôn đọc là "o" (giống お), mặc dù chữ viết khác — đây là 1 trong 3 trợ từ có cách đọc đặc biệt trong tiếng Nhật (cùng với は đọc "wa" và へ đọc "e").

## So sánh với は
- は đánh dấu chủ đề (topic)
- を đánh dấu tân ngữ (đối tượng bị tác động bởi động từ)`,
    },
    {
      id: "ja-grammar-a2-01",
      title: "Thể ます (masu) — động từ lịch sự",
      level: "A2",
      orderIndex: 3,
      content: `# Thể ます (masu-form)

## Vì sao dùng thể ます?
Đây là dạng lịch sự, trung tính của động từ — dùng trong hầu hết giao tiếp hàng ngày với người không thân quen.

## Cấu trúc theo thì
| Thì | Dạng | Ví dụ (食べる - ăn) |
|---|---|---|
| Hiện tại/tương lai khẳng định | ～ます | 食べます (taberu → tabemasu) |
| Hiện tại/tương lai phủ định | ～ません | 食べません |
| Quá khứ khẳng định | ～ました | 食べました |
| Quá khứ phủ định | ～ませんでした | 食べませんでした |

## Ví dụ đầy đủ
- 昨日、映画を見ました。(Kinou, eiga o mimashita.) — Hôm qua tôi đã xem phim.
- 明日は行きません。(Ashita wa ikimasen.) — Ngày mai tôi không đi.

## Lưu ý
Thể ます là thể "từ điển đơn giản hoá" — người mới học nên học thể này trước, thể thường (辞書形/plain form) học sau khi đã quen.`,
    },
    {
      id: "ja-grammar-a2-02",
      title: "Trợ từ に và で — chỉ thời gian, địa điểm",
      level: "A2",
      orderIndex: 4,
      content: `# Trợ từ に và で

## に — thời điểm cụ thể / điểm đến
- 7時に起きます。(Shichi-ji ni okimasu.) — Tôi dậy lúc 7 giờ.
- 学校に行きます。(Gakkou ni ikimasu.) — Tôi đi đến trường.

## で — nơi diễn ra hành động
- 図書館で勉強します。(Toshokan de benkyou shimasu.) — Tôi học ở thư viện.
- レストランで食べます。(Resutoran de tabemasu.) — Tôi ăn ở nhà hàng.

## Phân biệt に vs で
| に | で |
|---|---|
| Thời điểm cụ thể (7時に) | Nơi hành động xảy ra |
| Điểm đến (学校に行く) | Không dùng cho điểm đến |

## Lỗi thường gặp
❌ 図書館に勉強します。
✅ 図書館で勉強します。
(で dùng khi có HÀNH ĐỘNG diễn ra tại đó, に chỉ dùng cho điểm đến/thời điểm)`,
    },
  ];

  for (const lesson of jaLessons) {
    await prisma.grammarLesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: {
        id: lesson.id,
        languageId: jaLang.id,
        title: lesson.title,
        content: lesson.content,
        level: lesson.level as any,
        orderIndex: lesson.orderIndex,
      },
    });
  }
  console.log(`  ✓ Grammar JA seeded: ${jaLessons.length} bài học (A1→A2)`);
}
