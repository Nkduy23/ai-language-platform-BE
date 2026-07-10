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
    // ── B2 ────────────────────────────────────────────────────────────────────
    {
      id: "en-grammar-b2-01",
      title: "Câu bị động (Passive Voice)",
      level: "B2",
      orderIndex: 1,
      content: `# Câu bị động (Passive Voice)

## Cấu trúc
\`\`\`
Chủ động: S + V + O
Bị động:  O + be + V3/ed (+ by S)
\`\`\`

## Ví dụ theo thì
| Thì | Chủ động | Bị động |
|---|---|---|
| Simple Present | They **make** cars. | Cars **are made**. |
| Simple Past | She **wrote** the report. | The report **was written**. |
| Present Perfect | They **have built** the house. | The house **has been built**. |
| Future | They **will finish** it. | It **will be finished**. |

## Khi nào dùng bị động?
- Không biết/không quan trọng ai làm hành động: My car **was stolen**.
- Muốn nhấn mạnh đối tượng chịu tác động thay vì người thực hiện: This book **was written** in 1990.
- Văn phong trang trọng, khoa học: The results **were analyzed** carefully.

## Lưu ý
Chỉ động từ TRẠNG TỪ (transitive verbs — có tân ngữ) mới chuyển được sang bị động. Động từ nội động (arrive, happen, sleep...) không có dạng bị động.`,
    },
    {
      id: "en-grammar-b2-02",
      title: "Mệnh đề quan hệ (Relative Clauses)",
      level: "B2",
      orderIndex: 2,
      content: `# Mệnh đề quan hệ (Relative Clauses)

## Các đại từ quan hệ chính
| Đại từ | Dùng cho | Ví dụ |
|---|---|---|
| who | người (chủ ngữ) | The man **who** called is my boss. |
| whom | người (tân ngữ, trang trọng) | The man **whom** I met is my boss. |
| which | vật/việc | The book **which** I bought is great. |
| that | người/vật (thay who/which, ít trang trọng) | The book **that** I bought is great. |
| whose | sở hữu | The woman **whose** car was stolen called police. |
| where | nơi chốn | The city **where** I grew up is beautiful. |

## Mệnh đề quan hệ xác định vs không xác định
**Xác định (defining)** — không có dấu phẩy, cần thiết để xác định danh từ:
> The man **who lives next door** is a doctor.

**Không xác định (non-defining)** — có dấu phẩy, chỉ bổ sung thông tin:
> My brother, **who lives in Hanoi**, is visiting us. (chỉ có 1 anh trai)

## Lưu ý quan trọng
- Có thể lược bỏ đại từ quan hệ khi nó làm TÂN NGỮ trong mệnh đề xác định:
  > The book (which/that) I bought is great.
- KHÔNG được lược bỏ trong mệnh đề không xác định.`,
    },
    {
      id: "en-grammar-b2-03",
      title: "Câu giả định (Wish / If only)",
      level: "B2",
      orderIndex: 3,
      content: `# Câu giả định với Wish / If only

## Wish + Quá khứ đơn — ước hiện tại trái ngược thực tế
> I **wish** I **had** more time. (thực tế: tôi không có nhiều thời gian)
> I **wish** I **were** taller. (dùng "were" cho mọi chủ ngữ, giống Conditional 2)

## Wish + Quá khứ hoàn thành — ước quá khứ (hối tiếc)
> I **wish** I **had studied** harder. (thực tế: tôi đã không học chăm)
> She **wishes** she **hadn't said** that. (thực tế: cô ấy đã nói điều đó)

## Wish + would — mong muốn ai đó thay đổi hành vi (thường phàn nàn)
> I **wish** you **would stop** smoking.
> I **wish** it **would stop** raining.

## If only — nhấn mạnh hơn Wish, cấu trúc tương tự
> **If only** I **had known** about this earlier!
> **If only** I **were** rich!

## So sánh nhanh
| Mẫu câu | Dùng cho |
|---|---|
| wish + Past Simple | Ước hiện tại |
| wish + Past Perfect | Ước quá khứ (hối tiếc) |
| wish + would | Mong người khác thay đổi |`,
    },
    // ── C1 ────────────────────────────────────────────────────────────────────
    {
      id: "en-grammar-c1-01",
      title: "Đảo ngữ (Inversion) trong câu nhấn mạnh",
      level: "C1",
      orderIndex: 1,
      content: `# Đảo ngữ (Inversion)

## Khái niệm
Đảo ngữ là đưa trợ động từ lên trước chủ ngữ để nhấn mạnh, thường dùng trong văn viết trang trọng.

## Với trạng từ phủ định đứng đầu câu
Never, Rarely, Seldom, Not only, No sooner, Hardly + trợ động từ + S + V

> **Never have I seen** such a beautiful sunset.
> **Not only did she pass** the exam, but she also got the highest score.
> **Hardly had I arrived** when the phone rang.

## Với "Only" + cụm trạng từ
> **Only after** the meeting **did he realize** his mistake.
> **Only then did I understand** what she meant.

## Với "So/Such...that"
> **So beautiful was the view that** we stayed for hours.
> **Such was his anger that** he couldn't speak.

## Lưu ý
Đảo ngữ chủ yếu dùng trong văn viết học thuật/trang trọng, IELTS Writing Task 2 band cao — ít dùng trong giao tiếp hàng ngày.`,
    },
    {
      id: "en-grammar-c1-02",
      title: "Câu điều kiện hỗn hợp (Mixed Conditionals)",
      level: "C1",
      orderIndex: 2,
      content: `# Câu điều kiện hỗn hợp (Mixed Conditionals)

## Loại 1: Điều kiện quá khứ → Kết quả hiện tại
**If + Past Perfect, would + V (bare)**

> If I **had studied** medicine, I **would be** a doctor now.
> (Thực tế: tôi đã không học y, nên bây giờ tôi không phải bác sĩ)

## Loại 2: Điều kiện hiện tại (luôn đúng) → Kết quả quá khứ
**If + Past Simple, would have + V3**

> If I **weren't** afraid of heights, I **would have gone** skydiving.
> (Thực tế: tôi luôn sợ độ cao — tính cách không đổi, nên trong quá khứ tôi đã không đi nhảy dù)

## So sánh với Conditional thường
| Loại | Vế If | Vế chính | Ý nghĩa |
|---|---|---|---|
| Type 2 thường | Past Simple | would + V | Giả định hiện tại → kết quả hiện tại |
| Type 3 thường | Past Perfect | would have + V3 | Giả định quá khứ → kết quả quá khứ |
| Mixed 1 | Past Perfect | would + V | Giả định quá khứ → kết quả HIỆN TẠI |
| Mixed 2 | Past Simple | would have + V3 | Giả định hiện tại (tính chất) → kết quả QUÁ KHỨ |

## Mẹo phân biệt
Xác định THỜI ĐIỂM của từng vế câu riêng biệt — nếu 2 vế không cùng thời điểm, đó là mixed conditional.`,
    },
    // ── C2 ────────────────────────────────────────────────────────────────────
    {
      id: "en-grammar-c2-01",
      title: "Cấu trúc nhấn mạnh nâng cao (Cleft Sentences)",
      level: "C2",
      orderIndex: 1,
      content: `# Cleft Sentences — Câu chẻ nhấn mạnh

## It-cleft — nhấn mạnh 1 thành phần cụ thể
\`\`\`
It + be + [thành phần nhấn mạnh] + that/who...
\`\`\`

> **It was John who** broke the window. (nhấn mạnh JOHN, không phải ai khác)
> **It was yesterday that** the accident happened. (nhấn mạnh thời gian)
> **It's the price that** worries me, not the quality. (nhấn mạnh vấn đề GIÁ)

## What-cleft (Pseudo-cleft) — nhấn mạnh hành động/ý cả câu
\`\`\`
What + S + V + be + [phần nhấn mạnh]
\`\`\`

> **What I need is** a good night's sleep.
> **What surprised me was** her sudden decision to quit.
> **What we should do is** talk to him directly.

## So sánh sắc thái
- It-cleft: nhấn mạnh MỘT thành phần cụ thể (người, vật, thời gian...)
- What-cleft: nhấn mạnh một Ý TƯỞNG/HÀNH ĐỘNG trừu tượng hơn

## Ứng dụng
Cleft sentences rất phổ biến trong văn phong học thuật, tranh luận, và bài luận band cao IELTS/TOEFL để tạo điểm nhấn logic.`,
    },
    {
      id: "en-grammar-c2-02",
      title: "Câu điều kiện đảo ngữ trang trọng (Formal Inversion in Conditionals)",
      level: "C2",
      orderIndex: 2,
      content: `# Đảo ngữ trong câu điều kiện trang trọng

## Bỏ "If", đảo trợ động từ lên đầu

### Loại 2 (Were)
\`\`\`
If + S + were... → Were + S...
\`\`\`
> Were I in your position, I would accept the offer.
> (= If I were in your position...)

### Loại 3 (Had)
\`\`\`
If + S + had + V3... → Had + S + V3...
\`\`\`
> Had I known about the traffic, I would have left earlier.
> (= If I had known...)

### Với Should (giả định ít chắc chắn)
\`\`\`
If + S + should... → Should + S...
\`\`\`
> Should you need any help, please contact us.
> (= If you should need any help...)

## Văn phong sử dụng
Cấu trúc này chỉ xuất hiện trong văn viết TRANG TRỌNG (hợp đồng, thư từ công việc, văn học, diễn văn) — hiếm khi dùng trong giao tiếp hàng ngày.

## Lưu ý
KHÔNG dùng đảo ngữ này cho câu điều kiện loại 1 (không có "Should" đặc biệt) — chỉ áp dụng cho Type 2, Type 3, và câu với "should" mang tính giả định.`,
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

  console.log(`  ✓ Grammar EN seeded: ${lessons.length} bài học (A1→C2)`);

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
    {
      id: "zh-grammar-b1-01",
      title: "So sánh với 比 (bǐ)",
      level: "B1",
      orderIndex: 5,
      content: `# So sánh với 比 (bǐ)

## Cấu trúc
\`\`\`
A + 比 (bǐ) + B + Tính từ
\`\`\`

## Ví dụ
- 我比他高。(Wǒ bǐ tā gāo.) — Tôi cao hơn anh ấy.
- 今天比昨天热。(Jīntiān bǐ zuótiān rè.) — Hôm nay nóng hơn hôm qua.

## Thêm mức độ chênh lệch
- 我比他高一点。(Wǒ bǐ tā gāo yìdiǎn.) — Tôi cao hơn anh ấy một chút.
- 我比他高十厘米。(Wǒ bǐ tā gāo shí límǐ.) — Tôi cao hơn anh ấy 10cm.

## Thể phủ định — dùng 没有, KHÔNG dùng 不比
- 我没有他高。(Wǒ méiyǒu tā gāo.) — Tôi không cao bằng anh ấy.

## So sánh ngang bằng — dùng 跟...一样
- 我跟他一样高。(Wǒ gēn tā yíyàng gāo.) — Tôi cao bằng anh ấy.`,
    },
    {
      id: "zh-grammar-b1-02",
      title: "Bổ ngữ khả năng với 得 và 不",
      level: "B1",
      orderIndex: 6,
      content: `# Bổ ngữ khả năng (可能补语)

## Cấu trúc khẳng định — Động từ + 得 + Bổ ngữ kết quả/xu hướng
\`\`\`
听得懂 (tīng de dǒng) — nghe hiểu được
看得见 (kàn de jiàn) — nhìn thấy được
\`\`\`

## Cấu trúc phủ định — Động từ + 不 + Bổ ngữ
\`\`\`
听不懂 (tīng bu dǒng) — nghe không hiểu
看不见 (kàn bu jiàn) — không nhìn thấy
\`\`\`

## Ví dụ trong câu
- 我听得懂中文。(Wǒ tīng de dǒng zhōngwén.) — Tôi nghe hiểu được tiếng Trung.
- 这个字太小，我看不见。(Zhège zì tài xiǎo, wǒ kàn bu jiàn.) — Chữ này quá nhỏ, tôi không nhìn thấy.
- 你做得完这个作业吗？(Nǐ zuò de wán zhège zuòyè ma?) — Bạn có làm xong bài tập này không?

## Phân biệt với 能/可以
- 能/可以: khả năng chung chung, được phép
- 得/不 bổ ngữ: khả năng cụ thể đạt được KẾT QUẢ của hành động hay không`,
    },
    {
      id: "zh-grammar-b2-01",
      title: "Câu chữ 把 (bǎ) — nhấn mạnh xử lý đối tượng",
      level: "B2",
      orderIndex: 7,
      content: `# Câu chữ 把 (bǎ)

## Cấu trúc
\`\`\`
Chủ ngữ + 把 + Tân ngữ + Động từ + Bổ ngữ/kết quả
\`\`\`

Câu 把 nhấn mạnh việc XỬ LÝ 1 đối tượng CỤ THỂ và kết quả của việc xử lý đó — tân ngữ phải xác định (không phải chung chung).

## Ví dụ
- 我把书放在桌子上了。(Wǒ bǎ shū fàng zài zhuōzi shàng le.) — Tôi đã đặt quyển sách lên bàn.
- 请把门关上。(Qǐng bǎ mén guānshàng.) — Xin hãy đóng cửa lại.
- 他把作业写完了。(Tā bǎ zuòyè xiěwán le.) — Anh ấy đã viết xong bài tập.

## So sánh với câu thường
- 我看了这本书。(câu thường, chỉ nói đã đọc)
- 我把这本书看完了。(câu 把, nhấn mạnh ĐÃ ĐỌC XONG — có kết quả rõ ràng)

## Lưu ý quan trọng
- Động từ trong câu 把 PHẢI có bổ ngữ đi kèm (kết quả, xu hướng, hoặc 了) — không thể chỉ có động từ trơ trọi.
- ❌ 我把书看。 (sai — thiếu bổ ngữ)
- ✅ 我把书看完了。 (đúng)`,
    },
    {
      id: "zh-grammar-b2-02",
      title: "Câu bị động với 被 (bèi)",
      level: "B2",
      orderIndex: 8,
      content: `# Câu bị động với 被 (bèi)

## Cấu trúc
\`\`\`
Đối tượng bị tác động + 被 + (Người thực hiện) + Động từ + Bổ ngữ
\`\`\`

## Ví dụ
- 我的钱包被偷了。(Wǒ de qiánbāo bèi tōu le.) — Ví của tôi bị lấy trộm.
- 这本书被他借走了。(Zhè běn shū bèi tā jièzǒu le.) — Quyển sách này đã bị anh ấy mượn mất.
- 杯子被打破了。(Bēizi bèi dǎpò le.) — Cái cốc đã bị làm vỡ.

## Khi nào dùng 被?
Câu bị động 被 trong tiếng Trung thường mang sắc thái **KHÔNG MAY MẮN/tiêu cực** — khác với passive voice tiếng Anh trung tính.
- 被偷 (bị trộm), 被骗 (bị lừa), 被打破 (bị vỡ) — đều là điều không mong muốn

## Lưu ý
Nếu không biết/không cần nói rõ ai làm, có thể bỏ chủ thể sau 被:
- 车被撞坏了。(Chē bèi zhuànghuài le.) — Xe bị đâm hỏng. (không rõ ai đâm)`,
    },
    {
      id: "zh-grammar-c1-01",
      title: "Câu chữ 虽然...但是 và các liên từ nâng cao",
      level: "C1",
      orderIndex: 9,
      content: `# Liên từ nâng cao: 虽然...但是, 不但...而且, 既然...就

## 虽然 (suīrán)...但是 (dànshì) — Mặc dù...nhưng
> 虽然下雨，但是我们还是出门了。(Suīrán xiàyǔ, dànshì wǒmen háishì chūmén le.) — Mặc dù trời mưa nhưng chúng tôi vẫn ra ngoài.

## 不但 (búdàn)...而且 (érqiě) — Không những...mà còn
> 她不但聪明，而且很努力。(Tā búdàn cōngming, érqiě hěn nǔlì.) — Cô ấy không những thông minh mà còn rất chăm chỉ.

## 既然 (jìrán)...就 (jiù) — Đã như vậy thì...
> 既然你已经决定了，我们就支持你。(Jìrán nǐ yǐjīng juédìng le, wǒmen jiù zhīchí nǐ.) — Đã như vậy bạn quyết định rồi thì chúng tôi ủng hộ bạn.

## 除非 (chúfēi)...否则 (fǒuzé) — Trừ khi...nếu không thì
> 除非你道歉，否则我不会原谅你。(Chúfēi nǐ dàoqiàn, fǒuzé wǒ bú huì yuánliàng nǐ.) — Trừ khi bạn xin lỗi, nếu không tôi sẽ không tha thứ.

## Lưu ý
Các cặp liên từ này thường xuất hiện CẢ 2 vế trong 1 câu (đối xứng), khác với tiếng Việt đôi khi chỉ cần 1 từ.`,
    },
    {
      id: "zh-grammar-c1-02",
      title: "Bổ ngữ xu hướng phức hợp (复合趋向补语)",
      level: "C1",
      orderIndex: 10,
      content: `# Bổ ngữ xu hướng phức hợp

## Cấu trúc
\`\`\`
Động từ + 上/下/进/出/回/过/起 + 来/去
\`\`\`

Diễn tả hướng di chuyển PHỨC HỢP (2 lớp): hướng chính (lên/xuống/vào/ra...) kết hợp hướng so với người nói (đến/đi).

## Ví dụ
- 他走进来了。(Tā zǒu jìnlái le.) — Anh ấy đi vào (phía người nói).
- 她拿出去了。(Tā ná chūqù le.) — Cô ấy mang ra (xa người nói).
- 孩子们跑上去了。(Háizimen pǎo shàngqù le.) — Bọn trẻ chạy lên (xa người nói).

## Ý nghĩa mở rộng (trừu tượng)
Nhiều bổ ngữ xu hướng còn mang nghĩa bóng:
- 想起来 (xiǎng qǐlái) — nhớ ra, chợt nghĩ ra
- 坚持下去 (jiānchí xiàqù) — kiên trì tiếp tục
- 提出来 (tíchūlái) — đề xuất, nêu ra

## Lưu ý
Đây là 1 trong những điểm ngữ pháp khó nhất với người học trung cấp — cần luyện nghe/đọc nhiều để cảm nhận tự nhiên hơn là học thuộc quy tắc.`,
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
  console.log(`  ✓ Grammar ZH seeded: ${zhLessons.length} bài học (A1→C1)`);

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
    {
      id: "ja-grammar-b1-01",
      title: "Thể て (te-form) và cách dùng",
      level: "B1",
      orderIndex: 5,
      content: `# Thể て (te-form)

## Vì sao thể て quan trọng?
Thể て là "trung tâm" của ngữ pháp tiếng Nhật — dùng để nối câu, tạo thể tiếp diễn, yêu cầu, xin phép...

## Cách chuyển đổi (nhóm động từ u-verb)
| Đuôi từ điển | Đuôi て |
|---|---|
| う, つ, る | って (買う→買って) |
| む, ぶ, ぬ | んで (飲む→飲んで) |
| く | いて (書く→書いて) |
| ぐ | いで (泳ぐ→泳いで) |
| す | して (話す→話して) |

Động từ nhóm る (ru-verb): bỏ る thêm て — 食べる→食べて
Bất quy tắc: する→して, 来る→来て

## Cách dùng phổ biến
1. **Nối hành động liên tiếp**: 起きて、シャワーを浴びます。(Dậy rồi tắm.)
2. **Thể tiếp diễn**: ～ています — 今、食べています。(Đang ăn.)
3. **Yêu cầu**: ～てください — ここに座ってください。(Xin hãy ngồi đây.)
4. **Xin phép**: ～てもいいですか — 入ってもいいですか？(Tôi vào được không?)`,
    },
    {
      id: "ja-grammar-b1-02",
      title: "So sánh với より và ほう",
      level: "B1",
      orderIndex: 6,
      content: `# So sánh với より (yori) và ほう (hou)

## Cấu trúc so sánh 2 đối tượng
\`\`\`
A は B より Tính từ です
\`\`\`
— A ... hơn B

## Ví dụ
- 日本語は英語より難しいです。(Nihongo wa eigo yori muzukashii desu.) — Tiếng Nhật khó hơn tiếng Anh.
- 今日は昨日より寒いです。(Kyou wa kinou yori samui desu.) — Hôm nay lạnh hơn hôm qua.

## Hỏi "cái nào hơn" — どちらのほうが
\`\`\`
AとBと、どちらのほうが～ですか
\`\`\`
- 犬と猫と、どちらのほうが好きですか？(Chó và mèo, bạn thích con nào hơn?)
- → 犬のほうが好きです。(Tôi thích chó hơn.)

## So sánh ngang bằng
\`\`\`
A は B と 同じぐらい Tính từ です
\`\`\`
- 兄は父と同じぐらい背が高いです。(Anh tôi cao ngang bố tôi.)`,
    },
    {
      id: "ja-grammar-b2-01",
      title: "Thể bị động (受身形)",
      level: "B2",
      orderIndex: 7,
      content: `# Thể bị động (受身形 - ukemikei)

## Cách chuyển đổi
| Nhóm động từ | Quy tắc | Ví dụ |
|---|---|---|
| Nhóm I (u-verb) | đổi う→われる | 読む→読まれる |
| Nhóm II (ru-verb) | bỏ る thêm られる | 食べる→食べられる |
| Bất quy tắc | する→される, 来る→来られる | — |

## Cấu trúc câu bị động
\`\`\`
Đối tượng + は/が + (Người thực hiện) + に + Động từ bị động
\`\`\`

## Ví dụ
- 私は先生に褒められました。(Watashi wa sensei ni homeraremashita.) — Tôi được thầy khen.
- この本は多くの人に読まれています。(Cuốn sách này được nhiều người đọc.)

## Bị động "gây phiền" (迷惑受身) — đặc trưng riêng của tiếng Nhật
Diễn tả bị ảnh hưởng tiêu cực bởi hành động của người khác, kể cả động từ tự thân (nội động từ):
- 雨に降られました。(Ame ni furaremashita.) — Tôi bị mắc mưa. (trời mưa làm phiền tôi)
- 子供に泣かれました。(Kodomo ni nakaremashita.) — Tôi bị (con) khóc làm phiền.`,
    },
    {
      id: "ja-grammar-b2-02",
      title: "Thể sai khiến (使役形)",
      level: "B2",
      orderIndex: 8,
      content: `# Thể sai khiến (使役形 - shiekikei)

## Cách chuyển đổi
| Nhóm động từ | Quy tắc | Ví dụ |
|---|---|---|
| Nhóm I (u-verb) | đổi う→わせる | 書く→書かせる |
| Nhóm II (ru-verb) | bỏ る thêm させる | 食べる→食べさせる |
| Bất quy tắc | する→させる, 来る→来させる | — |

## 2 ý nghĩa chính
**1. Bắt buộc/ra lệnh** (thường chủ thể có quyền, vd cha mẹ-con cái, sếp-nhân viên):
> 母は子供に野菜を食べさせました。(Mẹ bắt con ăn rau.)

**2. Cho phép** (khi kết hợp với てあげる/てくれる):
> 先生は学生に早く帰らせてくれました。(Thầy giáo cho học sinh về sớm.)

## Thể sai khiến bị động (使役受身) — "bị bắt phải làm gì"
Kết hợp cả 2 thể để diễn tả bị BUỘC làm điều mình không muốn:
> 私は毎日残業させられます。(Watashi wa mainichi zangyou saseraremasu.) — Tôi bị bắt làm thêm giờ mỗi ngày.

## Lưu ý
Thể sai khiến bị động rất hay dùng để than phiền trong văn nói tiếng Nhật hàng ngày.`,
    },
    {
      id: "ja-grammar-c1-01",
      title: "Kính ngữ (敬語) — Tôn kính ngữ và Khiêm nhường ngữ",
      level: "C1",
      orderIndex: 9,
      content: `# Kính ngữ (敬語 - keigo)

## 3 loại kính ngữ chính
1. **尊敬語 (sonkeigo)** — Tôn kính ngữ: nâng cao hành động của NGƯỜI KHÁC (cấp trên, khách hàng)
2. **謙譲語 (kenjougo)** — Khiêm nhường ngữ: hạ thấp hành động của BẢN THÂN
3. **丁寧語 (teineigo)** — Lịch sự ngữ: です/ます (đã học ở trình độ thấp hơn)

## Ví dụ Tôn kính ngữ (dùng cho hành động của người khác)
| Động từ thường | Tôn kính ngữ |
|---|---|
| 行く (đi) | いらっしゃる |
| 食べる (ăn) | 召し上がる |
| 言う (nói) | おっしゃる |
| する (làm) | なさる |

> 社長はもう帰られました。(Giám đốc đã về rồi.)
> 何を召し上がりますか？(Ngài dùng gì ạ?)

## Ví dụ Khiêm nhường ngữ (dùng cho hành động của bản thân)
| Động từ thường | Khiêm nhường ngữ |
|---|---|
| 行く/来る | 参る |
| 言う | 申す |
| する | いたす |
| 見る | 拝見する |

> 明日、そちらに参ります。(Ngày mai tôi sẽ đến đó ạ.)
> 資料を拝見しました。(Tôi đã xem qua tài liệu ạ.)

## Lưu ý quan trọng
KHÔNG BAO GIỜ dùng Tôn kính ngữ cho chính mình, và không dùng Khiêm nhường ngữ cho người khác — đây là lỗi rất phổ biến của người học.`,
    },
    {
      id: "ja-grammar-c1-02",
      title: "Diễn đạt suy đoán: らしい, ようだ, みたいだ, そうだ",
      level: "C1",
      orderIndex: 10,
      content: `# So sánh các cách diễn đạt suy đoán/nghe nói

## そうだ (dựa trên thông tin nghe được — truyền văn)
> 天気予報によると、明日雨が降るそうです。(Theo dự báo, ngày mai sẽ mưa.)
— Chỉ đơn thuần THUẬT LẠI thông tin, không có ý kiến cá nhân.

## らしい (suy đoán dựa trên căn cứ khách quan, có phần chắc chắn)
> 彼はもう結婚しているらしいです。(Nghe nói/có vẻ anh ấy đã kết hôn rồi.)
— Dựa trên thông tin gián tiếp, độ tin cậy tương đối.

## ようだ (suy đoán dựa trên cảm nhận/quan sát trực tiếp của người nói)
> 部屋の電気が消えている。誰もいないようだ。(Đèn phòng tắt rồi. Có vẻ như không có ai ở đó.)
— Dựa trên QUAN SÁT TRỰC TIẾP của bản thân.

## みたいだ (giống ようだ nhưng thân mật, dùng trong văn nói)
> 雨が降っているみたい。(Hình như trời đang mưa.)
— Văn nói suồng sã, ý nghĩa gần giống ようだ.

## Bảng so sánh nhanh
| Mẫu | Nguồn thông tin | Văn phong |
|---|---|---|
| そうだ | Nghe/đọc được | Trung tính |
| らしい | Gián tiếp, có căn cứ | Trung tính, hơi trang trọng |
| ようだ | Quan sát/cảm nhận trực tiếp | Trang trọng |
| みたいだ | Quan sát/cảm nhận trực tiếp | Thân mật, văn nói |`,
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
  console.log(`  ✓ Grammar JA seeded: ${jaLessons.length} bài học (A1→C1)`);
}
