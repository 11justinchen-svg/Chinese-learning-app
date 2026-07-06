// Stage 8 — Study, school & language. In class: what you're learning and
// what you can do. Hand-authored content; see stage-01.ts for the conventions
// the validator enforces (frozen wordIds, vocabulary gating, ≥3 credits
// across ≥2 kinds per stage word).
//
// Grammar: ye-dou. 也 is not an HSK-1 word, so the exercises and dialogue
// drill 都 only (Subject + 都 + Verb); the lesson intro card covers 也.
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import type { Stage } from "./types";

export const stage08: Stage = {
  id: "hsk1-stage-08",
  index: 8,
  title: "Study, school & language",
  hanziTitle: "学习",
  scenario: "In class — what you can do and what you're learning.",
  description:
    "Read, write, listen and speak — plus 会 and 能 for what you're able to do, and 都 to say everyone's doing it.",
  wordIds: STAGE_WORD_IDS[8],
  grammarLessonIds: STAGE_GRAMMAR[8],

  dialogue: [
    {
      speaker: "王明",
      hanzi: "李华，你在学习什么？",
      pinyin: "Lǐ Huá, nǐ zài xuéxí shénme?",
      english: "Li Hua, what are you studying?",
    },
    {
      speaker: "李华",
      hanzi: "我在学习汉语。我的同学都喜欢汉语。",
      pinyin: "Wǒ zài xuéxí Hànyǔ. Wǒ de tóngxué dōu xǐhuan Hànyǔ.",
      english: "I'm studying Chinese. My classmates all like Chinese.",
    },
    {
      speaker: "王明",
      hanzi: "你会写字吗？",
      pinyin: "Nǐ huì xiě zì ma?",
      english: "Can you write characters?",
    },
    {
      speaker: "李华",
      hanzi: "我会读，能写几个字。你的书在哪儿？",
      pinyin: "Wǒ huì dú, néng xiě jǐ gè zì. Nǐ de shū zài nǎr?",
      english:
        "I can read, and I can write a few characters. Where are your books?",
    },
    {
      speaker: "王明",
      hanzi: "我有三本书，都在桌子上。",
      pinyin: "Wǒ yǒu sān běn shū, dōu zài zhuōzi shàng.",
      english: "I have three books — they're all on the table.",
    },
    {
      speaker: "李华",
      hanzi: "椅子上的电脑是谁的？",
      pinyin: "Yǐzi shàng de diànnǎo shì shéi de?",
      english: "Whose computer is that on the chair?",
    },
    {
      speaker: "王明",
      hanzi: "是老师的。老师在说话，我们听！",
      pinyin: "Shì lǎoshī de. Lǎoshī zài shuōhuà, wǒmen tīng!",
      english: "It's the teacher's. The teacher is speaking — let's listen!",
    },
    { speaker: "李华", hanzi: "好！", pinyin: "Hǎo!", english: "OK!" },
  ],

  teach: [
    {
      wordId: "hsk1-129", // 学习
      note: "学 (study) + 习 (practice) — to study or learn. 在学习 = is studying right now.",
      example: {
        hanzi: "我在学习汉语。",
        pinyin: "Wǒ zài xuéxí Hànyǔ.",
        english: "I'm studying Chinese.",
      },
    },
    {
      wordId: "hsk1-110", // 同学
      note: "同 (same) + 学 (study) — someone who studies with you.",
      example: {
        hanzi: "他是我的同学。",
        pinyin: "Tā shì wǒ de tóngxué.",
        english: "He is my classmate.",
      },
    },
    {
      wordId: "hsk1-097", // 书
      note: "Book. Always counted with 本: 一本书, never 一个书.",
      example: {
        hanzi: "我有三本书。",
        pinyin: "Wǒ yǒu sān běn shū.",
        english: "I have three books.",
      },
    },
    {
      wordId: "hsk1-006", // 本
      note: "The measure word for books (三本书) — what 个 is for people, 本 is for books.",
      example: {
        hanzi: "这本书是我的。",
        pinyin: "Zhè běn shū shì wǒ de.",
        english: "This book is mine.",
      },
    },
    {
      wordId: "hsk1-022", // 读
      note: "To read — often out loud. The 讠 (speech) radical gives it away.",
      example: {
        hanzi: "你能读这个字吗？",
        pinyin: "Nǐ néng dú zhè ge zì ma?",
        english: "Can you read this character?",
      },
    },
    {
      wordId: "hsk1-125", // 写
      note: "To write. 写字 = to write characters.",
      example: {
        hanzi: "我会写字。",
        pinyin: "Wǒ huì xiě zì.",
        english: "I can write characters.",
      },
    },
    {
      wordId: "hsk1-147", // 字
      note: "A written character — the same 字 as in 名字 (name).",
      example: {
        hanzi: "这个字是什么？",
        pinyin: "Zhè ge zì shì shénme?",
        english: "What is this character?",
      },
    },
    {
      wordId: "hsk1-035", // 汉语
      note: "汉 (the Han people) + 语 (language) — the Chinese language.",
      example: {
        hanzi: "我们都学习汉语。",
        pinyin: "Wǒmen dōu xuéxí Hànyǔ.",
        english: "We all study Chinese.",
      },
    },
    {
      wordId: "hsk1-042", // 会
      note: "“Can” for a learned skill — something you know how to do. Compare 能.",
      example: {
        hanzi: "你会汉语吗？",
        pinyin: "Nǐ huì Hànyǔ ma?",
        english: "Do you know Chinese?",
      },
    },
    {
      wordId: "hsk1-072", // 能
      note: "“Can” for ability or possibility in the moment; 会 is for learned skills.",
      example: {
        hanzi: "我能写几个字。",
        pinyin: "Wǒ néng xiě jǐ gè zì.",
        english: "I can write a few characters.",
      },
    },
    {
      wordId: "hsk1-102", // 说话
      note: "To speak, to talk — used as one word: 他在说话 (he's talking).",
      example: {
        hanzi: "老师在说话。",
        pinyin: "Lǎoshī zài shuōhuà.",
        english: "The teacher is speaking.",
      },
    },
    {
      wordId: "hsk1-109", // 听
      note: "To listen — the 口 (mouth) radical, but it's all about the ears.",
      example: {
        hanzi: "我们听老师说话。",
        pinyin: "Wǒmen tīng lǎoshī shuōhuà.",
        english: "We listen to the teacher speak.",
      },
    },
    {
      wordId: "hsk1-017", // 电脑
      note: "电 (electric) + 脑 (brain) = computer.",
      example: {
        hanzi: "电脑在桌子上。",
        pinyin: "Diànnǎo zài zhuōzi shàng.",
        english: "The computer is on the table.",
      },
    },
    {
      wordId: "hsk1-146", // 桌子
      note: "Table or desk — 木 (wood) radical, with the noun ending 子.",
      example: {
        hanzi: "书都在桌子上。",
        pinyin: "Shū dōu zài zhuōzi shàng.",
        english: "The books are all on the table.",
      },
    },
    {
      wordId: "hsk1-135", // 椅子
      note: "Chair — wooden like 桌子, with the same 木 radical and 子 ending.",
      example: {
        hanzi: "椅子在桌子后面。",
        pinyin: "Yǐzi zài zhuōzi hòumian.",
        english: "The chair is behind the table.",
      },
    },
    {
      wordId: "hsk1-021", // 都
      note: "“All / both” — sits right before the verb, never before the noun: 我们都是学生.",
      example: {
        hanzi: "他们都会汉语。",
        pinyin: "Tāmen dōu huì Hànyǔ.",
        english: "They all know Chinese.",
      },
    },
  ],

  blocks: [
    {
      id: "s8-vocab-classroom",
      title: "In the classroom",
      kind: "vocab",
      exercises: [
        {
          id: "s8-class-1",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-097"],
          question: "书",
          questionPinyin: "shū",
          choices: ["book", "table", "chair", "character"],
          answer: "book",
        },
        {
          id: "s8-class-2",
          kind: "match",
          matchType: "meaning",
          wordIds: ["hsk1-097", "hsk1-017", "hsk1-146", "hsk1-135"],
          pairs: [
            { hanzi: "书", match: "book" },
            { hanzi: "电脑", match: "computer" },
            { hanzi: "桌子", match: "table" },
            { hanzi: "椅子", match: "chair" },
          ],
        },
        {
          id: "s8-class-3",
          kind: "listen",
          wordIds: ["hsk1-017"],
          text: "电脑",
          pinyin: "diànnǎo",
          choices: ["电脑", "桌子", "椅子", "书"],
          answer: "电脑",
          translation: "computer",
        },
        {
          id: "s8-class-4",
          kind: "cloze",
          wordIds: ["hsk1-006", "hsk1-097"],
          sentence: "我有三＿书。",
          translation: "I have three books.",
          choices: ["本", "个", "块"],
          answer: "本",
          explain: "本 is the measure word for books: 三本书, never 三个书.",
        },
        {
          id: "s8-class-5",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-110"],
          question: "同学",
          questionPinyin: "tóngxué",
          choices: ["classmate", "teacher", "student", "friend"],
          answer: "classmate",
          explain: "同 (same) + 学 (study) — someone who studies with you.",
        },
        {
          id: "s8-class-6",
          kind: "order",
          wordIds: ["hsk1-017", "hsk1-146"],
          tiles: ["电脑", "在", "桌子", "上"],
          translation: "The computer is on the table.",
          pinyin: "Diànnǎo zài zhuōzi shàng.",
        },
        {
          id: "s8-class-7",
          kind: "cloze",
          wordIds: ["hsk1-097", "hsk1-146", "hsk1-021"],
          sentence: "书都在＿上。",
          translation: "The books are all on the table.",
          choices: ["桌子", "椅子", "电脑"],
          answer: "桌子",
        },
        {
          id: "s8-class-8",
          kind: "reply",
          wordIds: ["hsk1-017", "hsk1-135"],
          scene: "A classmate asks where your computer is.",
          line: { hanzi: "你的电脑在哪儿？", pinyin: "Nǐ de diànnǎo zài nǎr?" },
          choices: [
            { hanzi: "在椅子上。", pinyin: "Zài yǐzi shàng." },
            { hanzi: "我会写字。", pinyin: "Wǒ huì xiě zì." },
            { hanzi: "谢谢你！", pinyin: "Xièxie nǐ!" },
          ],
          answer: "在椅子上。",
        },
      ],
    },
    {
      id: "s8-vocab-skills",
      title: "Read, write, listen, speak",
      kind: "vocab",
      exercises: [
        {
          id: "s8-skill-1",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-129"],
          question: "学习",
          questionPinyin: "xuéxí",
          choices: ["to study", "to listen", "to write", "to read"],
          answer: "to study",
        },
        {
          id: "s8-skill-2",
          kind: "match",
          matchType: "meaning",
          wordIds: ["hsk1-022", "hsk1-125", "hsk1-109", "hsk1-102"],
          pairs: [
            { hanzi: "读", match: "to read" },
            { hanzi: "写", match: "to write" },
            { hanzi: "听", match: "to listen" },
            { hanzi: "说话", match: "to speak" },
          ],
        },
        {
          id: "s8-skill-3",
          kind: "cloze",
          wordIds: ["hsk1-129", "hsk1-035"],
          sentence: "我在学习＿。",
          translation: "I'm studying Chinese.",
          choices: ["汉语", "桌子", "椅子"],
          answer: "汉语",
        },
        {
          id: "s8-skill-4",
          kind: "order",
          wordIds: ["hsk1-042", "hsk1-125", "hsk1-147"],
          tiles: ["你", "会", "写", "字", "吗"],
          translation: "Can you write characters?",
          pinyin: "Nǐ huì xiě zì ma?",
        },
        {
          id: "s8-skill-5",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-042", "hsk1-072", "hsk1-022", "hsk1-125", "hsk1-147"],
          question: "我会读，能写几个字。",
          questionPinyin: "Wǒ huì dú, néng xiě jǐ gè zì.",
          choices: [
            "I can read, and I can write a few characters.",
            "I can write, but I can't read.",
            "I can't read or write.",
            "I read a few books every day.",
          ],
          answer: "I can read, and I can write a few characters.",
          explain:
            "会 = a skill you've learned; 能 = what you're able to manage. Here: reading is a skill, a few characters is the limit of ability.",
        },
        {
          id: "s8-skill-6",
          kind: "listen",
          wordIds: ["hsk1-035"],
          text: "汉语",
          pinyin: "Hànyǔ",
          choices: ["汉语", "说话", "学习", "同学"],
          answer: "汉语",
          translation: "Chinese (language)",
        },
        {
          id: "s8-skill-7",
          kind: "cloze",
          wordIds: ["hsk1-102", "hsk1-109"],
          sentence: "老师在＿，我们听。",
          translation: "The teacher is speaking — we're listening.",
          choices: ["说话", "学习", "再见"],
          answer: "说话",
          explain: "说话 works as one word: 他在说话 — he's speaking.",
        },
        {
          id: "s8-skill-8",
          kind: "choice",
          direction: "en-hanzi",
          wordIds: ["hsk1-109"],
          question: "to listen",
          choices: ["听", "读", "写", "说话"],
          answer: "听",
        },
        {
          id: "s8-skill-9",
          kind: "reply",
          wordIds: ["hsk1-042", "hsk1-129", "hsk1-035"],
          scene: "Your classmate asks whether you know Chinese.",
          line: { hanzi: "你会汉语吗？", pinyin: "Nǐ huì Hànyǔ ma?" },
          choices: [
            {
              hanzi: "我会，我在学习汉语。",
              pinyin: "Wǒ huì, wǒ zài xuéxí Hànyǔ.",
            },
            { hanzi: "我有三本书。", pinyin: "Wǒ yǒu sān běn shū." },
            { hanzi: "再见！", pinyin: "Zàijiàn!" },
          ],
          answer: "我会，我在学习汉语。",
          explain:
            "Answer a 会 question by repeating 会 — just like 是 answers 是.",
        },
        {
          id: "s8-skill-10",
          kind: "listen",
          wordIds: ["hsk1-072", "hsk1-022", "hsk1-147"],
          text: "我能读这个字。",
          pinyin: "Wǒ néng dú zhè ge zì.",
          choices: [
            "我能读这个字。",
            "我能写这个字。",
            "我会说话。",
            "我有一本书。",
          ],
          answer: "我能读这个字。",
          translation: "I can read this character.",
        },
      ],
    },
    {
      id: "s8-grammar-dou",
      title: "都 — everyone, everything",
      kind: "grammar",
      grammarLessonId: "ye-dou",
      exercises: [
        {
          id: "s8-dou-1",
          kind: "order",
          wordIds: ["hsk1-021", "hsk1-110"],
          tiles: ["我们", "都", "是", "同学"],
          translation: "We are all classmates.",
          pinyin: "Wǒmen dōu shì tóngxué.",
        },
        {
          id: "s8-dou-2",
          kind: "cloze",
          wordIds: ["hsk1-021"],
          sentence: "我们＿是学生。",
          translation: "We are all students.",
          choices: ["都", "太", "不"],
          answer: "都",
          explain:
            "都 sits right before the verb: Subject + 都 + Verb. 也 (also) takes the same slot.",
        },
        {
          id: "s8-dou-3",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-021", "hsk1-042", "hsk1-035"],
          question: "他们都会汉语。",
          questionPinyin: "Tāmen dōu huì Hànyǔ.",
          choices: [
            "They all know Chinese.",
            "They are all learning Chinese.",
            "He knows Chinese.",
            "They don't know Chinese.",
          ],
          answer: "They all know Chinese.",
          explain: "都 covers the whole subject: 他们都 = all of them.",
        },
        {
          id: "s8-dou-4",
          kind: "order",
          wordIds: ["hsk1-110", "hsk1-021", "hsk1-129"],
          tiles: ["同学们", "都", "在", "学习"],
          translation: "The classmates are all studying.",
          pinyin: "Tóngxuémen dōu zài xuéxí.",
        },
        {
          id: "s8-dou-5",
          kind: "cloze",
          wordIds: ["hsk1-021", "hsk1-097", "hsk1-017", "hsk1-146"],
          sentence: "书和电脑＿在桌子上。",
          translation: "The books and the computer are all on the table.",
          choices: ["都", "个", "吗"],
          answer: "都",
          explain:
            "都 works for things too — everything before it, all at once.",
        },
        {
          id: "s8-dou-6",
          kind: "reply",
          wordIds: ["hsk1-021", "hsk1-035"],
          scene: "Your teacher asks if you all like Chinese.",
          line: {
            hanzi: "你们都喜欢汉语吗？",
            pinyin: "Nǐmen dōu xǐhuan Hànyǔ ma?",
          },
          choices: [
            {
              hanzi: "我们都喜欢汉语。",
              pinyin: "Wǒmen dōu xǐhuan Hànyǔ.",
            },
            {
              hanzi: "椅子在桌子后面。",
              pinyin: "Yǐzi zài zhuōzi hòumian.",
            },
            { hanzi: "再见！", pinyin: "Zàijiàn!" },
          ],
          answer: "我们都喜欢汉语。",
          explain: "Echo the 都 back: 我们都喜欢汉语 — we all do.",
        },
      ],
    },
  ],

  checkpoint: [
    {
      id: "s8-check-1",
      kind: "choice",
      direction: "hanzi-en",
      wordIds: ["hsk1-006", "hsk1-097"],
      question: "这本书是我的。",
      questionPinyin: "Zhè běn shū shì wǒ de.",
      choices: [
        "This book is mine.",
        "That book is hers.",
        "This computer is mine.",
        "These books are all mine.",
      ],
      answer: "This book is mine.",
    },
    {
      id: "s8-check-2",
      kind: "order",
      wordIds: ["hsk1-006", "hsk1-097"],
      tiles: ["我", "有", "三", "本", "书"],
      translation: "I have three books.",
      pinyin: "Wǒ yǒu sān běn shū.",
    },
    {
      id: "s8-check-3",
      kind: "listen",
      wordIds: ["hsk1-135"],
      text: "椅子",
      pinyin: "yǐzi",
      choices: ["椅子", "桌子", "电脑", "书"],
      answer: "椅子",
      translation: "chair",
    },
    {
      id: "s8-check-4",
      kind: "choice",
      direction: "hanzi-en",
      wordIds: ["hsk1-102"],
      question: "他在说话。",
      questionPinyin: "Tā zài shuōhuà.",
      choices: [
        "He is speaking.",
        "He is listening.",
        "He is writing.",
        "He is reading.",
      ],
      answer: "He is speaking.",
    },
    {
      id: "s8-check-5",
      kind: "cloze",
      wordIds: ["hsk1-072", "hsk1-042", "hsk1-125", "hsk1-147"],
      sentence: "我不会写这个字，你＿写吗？",
      translation: "I can't write this character — can you?",
      choices: ["能", "都", "吗"],
      answer: "能",
      explain:
        "能 asks about ability in the moment: 你能写吗？ — can you manage it?",
    },
    {
      id: "s8-check-6",
      kind: "match",
      matchType: "pinyin",
      wordIds: ["hsk1-129", "hsk1-035", "hsk1-017", "hsk1-110"],
      pairs: [
        { hanzi: "学习", match: "xuéxí" },
        { hanzi: "汉语", match: "Hànyǔ" },
        { hanzi: "电脑", match: "diànnǎo" },
        { hanzi: "同学", match: "tóngxué" },
      ],
    },
    {
      id: "s8-check-7",
      kind: "reply",
      wordIds: ["hsk1-129", "hsk1-035"],
      scene: "The teacher asks what you are studying.",
      line: { hanzi: "你在学习什么？", pinyin: "Nǐ zài xuéxí shénme?" },
      choices: [
        { hanzi: "我在学习汉语。", pinyin: "Wǒ zài xuéxí Hànyǔ." },
        { hanzi: "我喜欢喝茶。", pinyin: "Wǒ xǐhuan hē chá." },
        { hanzi: "电脑在桌子上。", pinyin: "Diànnǎo zài zhuōzi shàng." },
      ],
      answer: "我在学习汉语。",
    },
    {
      id: "s8-check-8",
      kind: "listen",
      wordIds: ["hsk1-021", "hsk1-110"],
      text: "我们都是同学。",
      pinyin: "Wǒmen dōu shì tóngxué.",
      choices: [
        "我们都是同学。",
        "我们都是学生。",
        "他们都会汉语。",
        "我们都喜欢汉语。",
      ],
      answer: "我们都是同学。",
      translation: "We are all classmates.",
    },
    {
      id: "s8-check-9",
      kind: "choice",
      direction: "en-hanzi",
      wordIds: ["hsk1-017"],
      question: "computer",
      choices: ["电脑", "桌子", "椅子", "书"],
      answer: "电脑",
    },
    {
      id: "s8-check-10",
      kind: "order",
      wordIds: ["hsk1-021", "hsk1-129", "hsk1-035"],
      tiles: ["我们", "都", "在", "学习", "汉语"],
      translation: "We are all studying Chinese.",
      pinyin: "Wǒmen dōu zài xuéxí Hànyǔ.",
    },
    {
      id: "s8-check-11",
      kind: "cloze",
      wordIds: ["hsk1-109", "hsk1-102"],
      sentence: "我喜欢＿老师说话。",
      translation: "I like listening to the teacher speak.",
      choices: ["听", "写", "读"],
      answer: "听",
    },
    {
      id: "s8-check-12",
      kind: "reply",
      wordIds: ["hsk1-042", "hsk1-125", "hsk1-147"],
      scene: "A classmate asks if you can write Chinese characters.",
      line: { hanzi: "你会写字吗？", pinyin: "Nǐ huì xiě zì ma?" },
      choices: [
        { hanzi: "我会写几个字。", pinyin: "Wǒ huì xiě jǐ gè zì." },
        { hanzi: "他是我的同学。", pinyin: "Tā shì wǒ de tóngxué." },
        { hanzi: "再见！", pinyin: "Zàijiàn!" },
      ],
      answer: "我会写几个字。",
    },
  ],
};
