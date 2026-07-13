// Stage 1 — the canonical hand-authored stage. Content workers: copy this
// file's structure and conventions for your own stage. Rules that the
// validator enforces:
//   - wordIds / grammarLessonIds come from allocation.ts, verbatim
//   - every Chinese string uses only words from this stage or earlier
//     (plus 们/儿 and the names 王明 / 李华)
//   - every stage word is credited (wordIds) by ≥3 exercises across ≥2 kinds
//   - blocks have 4–10 exercises; the checkpoint has 8–12
import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import type { Stage } from "./types";

export const stage01: Stage = {
  id: "hsk1-stage-01",
  index: 1,
  title: "Who are you?",
  hanziTitle: "你是谁",
  scenario: "Meeting someone for the first time — hello, names, who's who.",
  description:
    "Greet people, ask their name, and say who is a student and who is a teacher. Two grammar patterns carry the whole conversation: 是 to say what someone is, and 吗 to turn anything into a question.",
  wordIds: STAGE_WORD_IDS[1],
  grammarLessonIds: STAGE_GRAMMAR[1],

  dialogue: [
    { speaker: "王明", hanzi: "你好！", pinyin: "Nǐ hǎo!", english: "Hello!" },
    {
      speaker: "李华",
      hanzi: "你好！你叫什么名字？",
      pinyin: "Nǐ hǎo! Nǐ jiào shénme míngzi?",
      english: "Hi! What's your name?",
    },
    {
      speaker: "王明",
      hanzi: "我叫王明。你叫什么名字？",
      pinyin: "Wǒ jiào Wáng Míng. Nǐ jiào shénme míngzi?",
      english: "I'm Wang Ming. What's your name?",
    },
    {
      speaker: "李华",
      hanzi: "我叫李华。你是学生吗？",
      pinyin: "Wǒ jiào Lǐ Huá. Nǐ shì xuésheng ma?",
      english: "I'm Li Hua. Are you a student?",
    },
    {
      speaker: "王明",
      hanzi: "我是学生。他是老师。",
      pinyin: "Wǒ shì xuésheng. Tā shì lǎoshī.",
      english: "I'm a student. He is a teacher.",
    },
    {
      speaker: "李华",
      hanzi: "他是我们老师吗？",
      pinyin: "Tā shì wǒmen lǎoshī ma?",
      english: "Is he our teacher?",
    },
    {
      speaker: "王明",
      hanzi: "是。老师好！",
      pinyin: "Shì. Lǎoshī hǎo!",
      english: "Yes. Hello, teacher!",
    },
    {
      speaker: "李华",
      hanzi: "谢谢你！再见！",
      pinyin: "Xièxie nǐ! Zàijiàn!",
      english: "Thank you! Goodbye!",
    },
    { speaker: "王明", hanzi: "再见！", pinyin: "Zàijiàn!", english: "Bye!" },
  ],

  teach: [
    {
      wordId: "hsk1-073", // 你
      note: "The all-purpose “you”. 你好 is literally “you good”.",
      example: { hanzi: "你好！", pinyin: "Nǐ hǎo!", english: "Hello!" },
    },
    {
      wordId: "hsk1-036", // 好
      note: "“Good” — and half of 你好, the standard greeting.",
      example: {
        hanzi: "老师好！",
        pinyin: "Lǎoshī hǎo!",
        english: "Hello, teacher!",
      },
    },
    {
      wordId: "hsk1-112", // 我
      example: {
        hanzi: "我是学生。",
        pinyin: "Wǒ shì xuésheng.",
        english: "I am a student.",
      },
    },
    {
      wordId: "hsk1-113", // 我们
      note: "我 + 们 (the plural marker) = we.",
      example: {
        hanzi: "我们是学生。",
        pinyin: "Wǒmen shì xuésheng.",
        english: "We are students.",
      },
    },
    {
      wordId: "hsk1-096", // 是
      note: "Links two nouns: A 是 B. Never used with adjectives.",
      example: {
        hanzi: "我是老师。",
        pinyin: "Wǒ shì lǎoshī.",
        english: "I am a teacher.",
      },
    },
    {
      wordId: "hsk1-061", // 吗
      note: "A spoken question mark — add it to any statement.",
      example: {
        hanzi: "你是学生吗？",
        pinyin: "Nǐ shì xuésheng ma?",
        english: "Are you a student?",
      },
    },
    {
      wordId: "hsk1-007", // 不
      note: "“Not”. 不是 = is not.",
      example: {
        hanzi: "我不是老师。",
        pinyin: "Wǒ bù shì lǎoshī.",
        english: "I am not a teacher.",
      },
    },
    {
      wordId: "hsk1-046", // 叫
      note: "“To be called” — how you give your name.",
      example: {
        hanzi: "我叫王明。",
        pinyin: "Wǒ jiào Wáng Míng.",
        english: "I'm called Wang Ming.",
      },
    },
    {
      wordId: "hsk1-093", // 什么
      example: {
        hanzi: "你叫什么名字？",
        pinyin: "Nǐ jiào shénme míngzi?",
        english: "What's your name?",
      },
    },
    {
      wordId: "hsk1-067", // 名字
      example: {
        hanzi: "他叫什么名字？",
        pinyin: "Tā jiào shénme míngzi?",
        english: "What's his name?",
      },
    },
    {
      wordId: "hsk1-105", // 他
      example: {
        hanzi: "他是学生。",
        pinyin: "Tā shì xuésheng.",
        english: "He is a student.",
      },
    },
    {
      wordId: "hsk1-106", // 她
      note: "Same sound as 他 — the 女 (woman) radical makes it “she”.",
      example: {
        hanzi: "她是老师。",
        pinyin: "Tā shì lǎoshī.",
        english: "She is a teacher.",
      },
    },
    {
      wordId: "hsk1-054", // 老师
      example: {
        hanzi: "老师好！",
        pinyin: "Lǎoshī hǎo!",
        english: "Hello, teacher!",
      },
    },
    {
      wordId: "hsk1-128", // 学生
      example: {
        hanzi: "我是学生。",
        pinyin: "Wǒ shì xuésheng.",
        english: "I am a student.",
      },
    },
    {
      wordId: "hsk1-126", // 谢谢
      example: {
        hanzi: "谢谢你！",
        pinyin: "Xièxie nǐ!",
        english: "Thank you!",
      },
    },
    {
      wordId: "hsk1-138", // 再见
      note: "再 (again) + 见 (see) — “see you again”.",
      example: { hanzi: "再见！", pinyin: "Zàijiàn!", english: "Goodbye!" },
    },
  ],

  blocks: [
    {
      id: "s1-vocab-hello",
      title: "Say hello",
      kind: "vocab",
      exercises: [
        {
          id: "s1-hello-1",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-073", "hsk1-036"],
          question: "你好",
          questionPinyin: "nǐ hǎo",
          choices: ["hello", "goodbye", "thank you", "what"],
          answer: "hello",
          explain: "你 (you) + 好 (good) — the standard greeting.",
        },
        {
          id: "s1-hello-2",
          kind: "listen",
          wordIds: ["hsk1-073", "hsk1-036"],
          text: "你好",
          pinyin: "nǐ hǎo",
          choices: ["你好", "再见", "谢谢", "名字"],
          answer: "你好",
          translation: "hello",
        },
        {
          id: "s1-hello-3",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-126"],
          question: "谢谢",
          questionPinyin: "xièxie",
          choices: ["thank you", "hello", "goodbye", "name"],
          answer: "thank you",
        },
        {
          id: "s1-hello-4",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-138"],
          question: "再见",
          questionPinyin: "zàijiàn",
          choices: ["goodbye", "thank you", "hello", "student"],
          answer: "goodbye",
          explain: "再 (again) + 见 (see) — see you again.",
        },
        {
          id: "s1-hello-5",
          kind: "match",
          matchType: "pinyin",
          wordIds: ["hsk1-073", "hsk1-036", "hsk1-126", "hsk1-138"],
          pairs: [
            { hanzi: "你", match: "nǐ" },
            { hanzi: "好", match: "hǎo" },
            { hanzi: "谢谢", match: "xièxie" },
            { hanzi: "再见", match: "zàijiàn" },
          ],
        },
        {
          id: "s1-hello-6",
          kind: "cloze",
          wordIds: ["hsk1-067", "hsk1-046", "hsk1-093"],
          sentence: "你叫什么＿？",
          translation: "What's your name?",
          choices: ["名字", "你好", "再见"],
          answer: "名字",
          explain: "叫 (to be called) + 什么 (what) + 名字 (name).",
        },
        {
          id: "s1-hello-7",
          kind: "listen",
          wordIds: ["hsk1-138"],
          text: "再见",
          pinyin: "zàijiàn",
          choices: ["再见", "谢谢", "你好", "名字"],
          answer: "再见",
          translation: "goodbye",
        },
        {
          id: "s1-hello-8",
          kind: "order",
          wordIds: ["hsk1-073", "hsk1-046", "hsk1-093", "hsk1-067"],
          tiles: ["你", "叫", "什么", "名字"],
          translation: "What is your name?",
          pinyin: "Nǐ jiào shénme míngzi?",
        },
      ],
    },
    {
      id: "s1-vocab-people",
      title: "People around you",
      kind: "vocab",
      exercises: [
        {
          id: "s1-people-1",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-054"],
          question: "老师",
          questionPinyin: "lǎoshī",
          choices: ["teacher", "student", "name", "we"],
          answer: "teacher",
        },
        {
          id: "s1-people-2",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-128"],
          question: "学生",
          questionPinyin: "xuésheng",
          choices: ["student", "teacher", "goodbye", "hello"],
          answer: "student",
        },
        {
          id: "s1-people-3",
          kind: "match",
          matchType: "meaning",
          wordIds: ["hsk1-112", "hsk1-105", "hsk1-106", "hsk1-113"],
          pairs: [
            { hanzi: "我", match: "I" },
            { hanzi: "他", match: "he" },
            { hanzi: "她", match: "she" },
            { hanzi: "我们", match: "we" },
          ],
        },
        {
          id: "s1-people-4",
          kind: "listen",
          wordIds: ["hsk1-128"],
          text: "学生",
          pinyin: "xuésheng",
          choices: ["学生", "老师", "名字", "什么"],
          answer: "学生",
          translation: "student",
        },
        {
          id: "s1-people-5",
          kind: "choice",
          direction: "en-hanzi",
          wordIds: ["hsk1-054"],
          question: "teacher",
          choices: ["老师", "学生", "名字", "我们"],
          answer: "老师",
        },
        {
          id: "s1-people-6",
          kind: "listen",
          wordIds: ["hsk1-113"],
          text: "我们",
          pinyin: "wǒmen",
          choices: ["我们", "我", "你", "他"],
          answer: "我们",
          translation: "we",
        },
        {
          id: "s1-people-7",
          kind: "choice",
          direction: "en-hanzi",
          wordIds: ["hsk1-112"],
          question: "I / me",
          choices: ["我", "你", "他", "她"],
          answer: "我",
        },
        {
          id: "s1-people-8",
          kind: "cloze",
          wordIds: ["hsk1-096"],
          sentence: "我＿学生。",
          translation: "I am a student.",
          choices: ["是", "不", "吗"],
          answer: "是",
          explain: "是 links two nouns: A 是 B.",
        },
      ],
    },
    {
      id: "s1-grammar-shi-sentences",
      title: '"A is B" sentences with 是',
      kind: "grammar",
      grammarLessonId: "shi-sentences",
      exercises: [
        {
          id: "s1-shi-1",
          kind: "order",
          wordIds: ["hsk1-112", "hsk1-096", "hsk1-128"],
          tiles: ["我", "是", "学生"],
          translation: "I am a student.",
          pinyin: "Wǒ shì xuésheng.",
        },
        {
          id: "s1-shi-2",
          kind: "cloze",
          wordIds: ["hsk1-106", "hsk1-096", "hsk1-054"],
          sentence: "她＿老师。",
          translation: "She is a teacher.",
          choices: ["是", "不", "吗"],
          answer: "是",
        },
        {
          id: "s1-shi-3",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-007", "hsk1-096"],
          question: "我不是老师。",
          questionPinyin: "Wǒ bù shì lǎoshī.",
          choices: [
            "I am not a teacher.",
            "I am a teacher.",
            "He is a teacher.",
            "I am a student.",
          ],
          answer: "I am not a teacher.",
          explain: "不 before 是 negates it: 不是 = is not.",
        },
        {
          id: "s1-shi-4",
          kind: "order",
          wordIds: ["hsk1-105", "hsk1-007", "hsk1-096"],
          tiles: ["他", "不", "是", "学生"],
          translation: "He is not a student.",
          pinyin: "Tā bù shì xuésheng.",
        },
        {
          id: "s1-shi-5",
          kind: "cloze",
          wordIds: ["hsk1-007"],
          sentence: "我＿是老师，我是学生。",
          translation: "I'm not a teacher, I'm a student.",
          choices: ["不", "是", "吗"],
          answer: "不",
        },
        {
          id: "s1-shi-6",
          kind: "reply",
          wordIds: ["hsk1-096", "hsk1-061"],
          scene: "Your new classmate points at someone and asks about him.",
          line: { hanzi: "他是老师吗？", pinyin: "Tā shì lǎoshī ma?" },
          choices: [
            { hanzi: "是，他是老师。", pinyin: "Shì, tā shì lǎoshī." },
            { hanzi: "我叫王明。", pinyin: "Wǒ jiào Wáng Míng." },
            { hanzi: "再见！", pinyin: "Zàijiàn!" },
          ],
          answer: "是，他是老师。",
          explain: "Answer a 吗 question by repeating the verb: 是 (or 不是).",
        },
      ],
    },
    {
      id: "s1-grammar-ma-questions",
      title: "Yes/no questions with 吗",
      kind: "grammar",
      grammarLessonId: "ma-questions",
      exercises: [
        {
          id: "s1-ma-1",
          kind: "cloze",
          wordIds: ["hsk1-061"],
          sentence: "你是学生＿？",
          translation: "Are you a student?",
          choices: ["吗", "什么", "不"],
          answer: "吗",
          explain: "吗 at the end turns a statement into a yes/no question.",
        },
        {
          id: "s1-ma-2",
          kind: "order",
          wordIds: ["hsk1-061", "hsk1-096", "hsk1-073"],
          tiles: ["你", "是", "老师", "吗"],
          translation: "Are you a teacher?",
          pinyin: "Nǐ shì lǎoshī ma?",
        },
        {
          id: "s1-ma-3",
          kind: "reply",
          wordIds: ["hsk1-061", "hsk1-096", "hsk1-128"],
          scene: "You are indeed a student. Answer truthfully.",
          line: { hanzi: "你是学生吗？", pinyin: "Nǐ shì xuésheng ma?" },
          choices: [
            { hanzi: "是，我是学生。", pinyin: "Shì, wǒ shì xuésheng." },
            { hanzi: "我叫李华。", pinyin: "Wǒ jiào Lǐ Huá." },
            { hanzi: "谢谢！", pinyin: "Xièxie!" },
          ],
          answer: "是，我是学生。",
        },
        {
          id: "s1-ma-4",
          kind: "choice",
          direction: "hanzi-en",
          wordIds: ["hsk1-046", "hsk1-093", "hsk1-067"],
          question: "你叫什么名字？",
          questionPinyin: "Nǐ jiào shénme míngzi?",
          choices: [
            "What's your name?",
            "Are you a student?",
            "Is he a teacher?",
            "Thank you!",
          ],
          answer: "What's your name?",
          explain:
            "什么 questions don't need 吗 — the question word does the work.",
        },
        {
          id: "s1-ma-5",
          kind: "listen",
          wordIds: ["hsk1-061"],
          text: "你是老师吗？",
          pinyin: "Nǐ shì lǎoshī ma?",
          choices: [
            "你是老师吗？",
            "你是学生吗？",
            "他是老师。",
            "你叫什么名字？",
          ],
          answer: "你是老师吗？",
          translation: "Are you a teacher?",
        },
        {
          id: "s1-ma-6",
          kind: "cloze",
          wordIds: ["hsk1-093", "hsk1-046"],
          sentence: "他叫＿名字？",
          translation: "What's his name?",
          choices: ["什么", "吗", "再见"],
          answer: "什么",
        },
      ],
    },
  ],

  checkpoint: [
    {
      id: "s1-check-1",
      kind: "listen",
      wordIds: ["hsk1-073", "hsk1-036"],
      text: "你好",
      pinyin: "nǐ hǎo",
      choices: ["你好", "再见", "谢谢", "学生"],
      answer: "你好",
      translation: "hello",
    },
    {
      id: "s1-check-2",
      kind: "choice",
      direction: "en-hanzi",
      wordIds: ["hsk1-113"],
      question: "we",
      choices: ["我们", "我", "你", "他"],
      answer: "我们",
    },
    {
      id: "s1-check-3",
      kind: "cloze",
      wordIds: ["hsk1-105"],
      sentence: "＿叫什么名字？",
      translation: "What's his name?",
      choices: ["他", "吗", "谢谢"],
      answer: "他",
    },
    {
      id: "s1-check-4",
      kind: "choice",
      direction: "hanzi-en",
      wordIds: ["hsk1-126"],
      question: "谢谢你！",
      questionPinyin: "Xièxie nǐ!",
      choices: ["Thank you!", "Goodbye!", "Hello!", "What's your name?"],
      answer: "Thank you!",
    },
    {
      id: "s1-check-5",
      kind: "order",
      wordIds: ["hsk1-106", "hsk1-096", "hsk1-061"],
      tiles: ["她", "是", "老师", "吗"],
      translation: "Is she a teacher?",
      pinyin: "Tā shì lǎoshī ma?",
    },
    {
      id: "s1-check-6",
      kind: "choice",
      direction: "hanzi-en",
      wordIds: ["hsk1-113", "hsk1-096", "hsk1-128"],
      question: "我们是学生。",
      questionPinyin: "Wǒmen shì xuésheng.",
      choices: [
        "We are students.",
        "We are teachers.",
        "I am a student.",
        "They are students.",
      ],
      answer: "We are students.",
    },
    {
      id: "s1-check-7",
      kind: "listen",
      wordIds: ["hsk1-138"],
      text: "再见",
      pinyin: "zàijiàn",
      choices: ["再见", "你好", "谢谢", "我们"],
      answer: "再见",
      translation: "goodbye",
    },
    {
      id: "s1-check-8",
      kind: "cloze",
      wordIds: ["hsk1-007", "hsk1-096"],
      sentence: "我不＿老师。",
      translation: "I am not a teacher.",
      choices: ["是", "吗", "叫"],
      answer: "是",
    },
    {
      id: "s1-check-9",
      kind: "reply",
      wordIds: ["hsk1-036", "hsk1-054"],
      scene: "You bump into your teacher in the morning.",
      line: { hanzi: "你好！", pinyin: "Nǐ hǎo!" },
      choices: [
        { hanzi: "老师好！", pinyin: "Lǎoshī hǎo!" },
        { hanzi: "再见！", pinyin: "Zàijiàn!" },
        { hanzi: "我叫李华。", pinyin: "Wǒ jiào Lǐ Huá." },
      ],
      answer: "老师好！",
    },
    {
      id: "s1-check-10",
      kind: "choice",
      direction: "en-hanzi",
      wordIds: ["hsk1-138"],
      question: "goodbye",
      choices: ["再见", "谢谢", "你好", "名字"],
      answer: "再见",
    },
  ],
};
