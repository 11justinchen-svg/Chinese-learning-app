export interface GrammarResource {
  label: string;
  url: string;
  type: "video" | "article";
}

export interface GrammarVocabRequirement {
  /** Which preset HSK-1 unit (see lib/hsk.ts UNITS) covers the words this lesson leans on. */
  unit: number;
  /** The specific words from that unit this lesson actually uses. */
  words: string[];
}

export interface GrammarLesson {
  id: string;
  title: string;
  hanzi: string;
  pattern: string;
  summary: string;
  examples: { hanzi: string; pinyin: string; meaning: string }[];
  vocab: GrammarVocabRequirement[];
  resources: GrammarResource[];
}

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: "shi-sentences",
    title: '"A is B" sentences with 是',
    hanzi: "是",
    pattern: "Subject + 是 + Noun",
    summary:
      "是 (shì) links two nouns to say one is the other — identification, not description. Negate with 不是, question with 是……吗.",
    examples: [
      {
        hanzi: "我是学生。",
        pinyin: "Wǒ shì xuésheng.",
        meaning: "I am a student.",
      },
      {
        hanzi: "这是我们的家。",
        pinyin: "Zhè shì wǒmen de jiā.",
        meaning: "This is our home.",
      },
    ],
    vocab: [{ unit: 1, words: ["是", "我", "你", "他", "这个", "我们"] }],
    resources: [
      {
        label: 'eChineseLearning — "Wǒ shì (我是) I am"',
        url: "https://www.youtube.com/watch?v=sgjcJGt3reM",
        type: "video",
      },
      {
        label: 'Chinese Grammar Wiki — Connecting nouns with "shi"',
        url: 'https://resources.allsetlearning.com/chinese/grammar/Connecting_nouns_with_"shi"',
        type: "article",
      },
    ],
  },
  {
    id: "de-possession",
    title: "Possession with 的",
    hanzi: "的",
    pattern: "Owner + 的 + Thing",
    summary:
      "的 (de) works like an apostrophe-s: noun/pronoun + 的 + noun means the first owns the second. Drop it for close relationships, like 我妈妈.",
    examples: [
      { hanzi: "我的家。", pinyin: "Wǒ de jiā.", meaning: "My home." },
      { hanzi: "他的东西。", pinyin: "Tā de dōngxi.", meaning: "His things." },
    ],
    vocab: [{ unit: 1, words: ["的", "我", "你", "他", "我们"] }],
    resources: [
      {
        label: "ChineseABC — Possessive particle 的 (HSK1)",
        url: "https://www.youtube.com/watch?v=V-zEbxV47XU",
        type: "video",
      },
      {
        label: 'Chinese Grammar Wiki — Expressing possession with "de"',
        url: 'https://resources.allsetlearning.com/chinese/grammar/Expressing_possession_with_"de"',
        type: "article",
      },
    ],
  },
  {
    id: "ma-questions",
    title: "Yes/no questions with 吗",
    hanzi: "吗",
    pattern: "Statement + 吗？",
    summary:
      "Tack 吗 (ma) onto the end of any statement to turn it into a yes/no question — like adding a spoken question mark. Answer by repeating the verb (positive) or negating it.",
    examples: [
      {
        hanzi: "你是学生吗？",
        pinyin: "Nǐ shì xuésheng ma?",
        meaning: "Are you a student?",
      },
      {
        hanzi: "你喜欢吗？",
        pinyin: "Nǐ xǐhuan ma?",
        meaning: "Do you like it?",
      },
    ],
    vocab: [{ unit: 3, words: ["吗", "怎么"] }],
    resources: [
      {
        label: "Yoyo Chinese — Asking a Yes/No Question in Mandarin",
        url: "https://www.youtube.com/watch?v=k3OUtJXk2tE",
        type: "video",
      },
      {
        label: 'Chinese Grammar Wiki — Yes-no questions with "ma"',
        url: 'https://resources.allsetlearning.com/chinese/grammar/Yes-no_questions_with_"ma"',
        type: "article",
      },
    ],
  },
  {
    id: "bu-vs-mei",
    title: "Negation: 不 vs. 没(有)",
    hanzi: "不 / 没",
    pattern: "不 + Verb/Adj  ·  没(有) + Verb",
    summary:
      "不 (bù) negates habits, states, and the future. 没 (méi) negates 有 and past actions — never put 不 in front of 有.",
    examples: [
      {
        hanzi: "我不喜欢。",
        pinyin: "Wǒ bù xǐhuan.",
        meaning: "I don't like it.",
      },
      {
        hanzi: "我没有钱。",
        pinyin: "Wǒ méiyǒu qián.",
        meaning: "I don't have money.",
      },
    ],
    vocab: [
      { unit: 1, words: ["不", "有"] },
      { unit: 3, words: ["没"] },
    ],
    resources: [
      {
        label: "YouTube — 不 (bù) vs. 没 (méi): 8 clear rules",
        url: "https://www.youtube.com/watch?v=6FLHLwQqiXY",
        type: "video",
      },
      {
        label: 'Chinese Grammar Wiki — Comparing "bu" and "mei"',
        url: "https://resources.allsetlearning.com/chinese/grammar/Bu_and_mei",
        type: "article",
      },
    ],
  },
  {
    id: "measure-words",
    title: "Measure words (个, 岁, 分钟…)",
    hanzi: "个",
    pattern: "Number + Measure word + Noun",
    summary:
      "Chinese nouns need a measure word between a number (or 这/那) and the noun — 个 is the default, but many nouns take a specific one (岁 for age, 分钟 for minutes).",
    examples: [
      { hanzi: "这个人。", pinyin: "Zhège rén.", meaning: "This person." },
      { hanzi: "三岁。", pinyin: "Sān suì.", meaning: "Three years old." },
    ],
    vocab: [
      { unit: 1, words: ["这个"] },
      { unit: 2, words: ["一", "点"] },
      { unit: 5, words: ["三", "岁", "分钟", "四"] },
    ],
    resources: [
      {
        label: "YouTube — Learn Chinese Measure Words for Beginners (HSK1)",
        url: "https://www.youtube.com/watch?v=LoczXWFNjUc",
        type: "video",
      },
      {
        label: "AllSet Learning — HSK 1–3 Measure Words",
        url: "https://resources.allsetlearning.com/chinese/vocabulary/HSK_1-3_Measure_Words",
        type: "article",
      },
    ],
  },
  {
    id: "zai-location",
    title: "Location with 在",
    hanzi: "在",
    pattern: "Subject + 在 + Place  ·  Subject + 在 + Place + Verb",
    summary:
      '在 (zài) alone means "to be at/in" a place. Put 在 + place before a verb to say where an action happens.',
    examples: [
      { hanzi: "我在家。", pinyin: "Wǒ zài jiā.", meaning: "I am at home." },
      {
        hanzi: "我在学校工作。",
        pinyin: "Wǒ zài xuéxiào gōngzuò.",
        meaning: "I work at school.",
      },
    ],
    vocab: [
      { unit: 1, words: ["在"] },
      { unit: 3, words: ["里", "家", "工作"] },
      { unit: 5, words: ["学校"] },
    ],
    resources: [
      {
        label: "YouTube — Use 在 (zài) for Location",
        url: "https://www.youtube.com/watch?v=GWF4-3W8QJI",
        type: "video",
      },
      {
        label:
          'Chinese Grammar Wiki — Indicating location with "zai" before verbs',
        url: 'https://resources.allsetlearning.com/chinese/grammar/Indicating_location_with_"zai"_before_verbs',
        type: "article",
      },
    ],
  },
  {
    id: "ye-dou",
    title: '也 and 都 — "also" and "all"',
    hanzi: "也 / 都",
    pattern: "Subject + 也/都 + Verb/Adj",
    summary:
      '也 (yě, "also") and 都 (dōu, "all") are adverbs that sit right before the verb or adjective, not the noun they refer to — the opposite order from English.',
    examples: [
      {
        hanzi: "他也喜欢。",
        pinyin: "Tā yě xǐhuan.",
        meaning: "He also likes it.",
      },
      {
        hanzi: "我们都是学生。",
        pinyin: "Wǒmen dōu shì xuésheng.",
        meaning: "We are all students.",
      },
    ],
    vocab: [{ unit: 2, words: ["都"] }],
    resources: [
      {
        label: "YouTube — Chinese lessons for beginners: Adverbs Ye/Dou",
        url: "https://www.youtube.com/watch?v=XSVMn_53rXg",
        type: "video",
      },
      {
        label: 'Chinese Grammar Wiki — Using "ye" and "dou" together',
        url: 'https://resources.allsetlearning.com/chinese/grammar/Using_"ye"_and_"dou"_together',
        type: "article",
      },
    ],
  },
  {
    id: "time-word-order",
    title: "Time words and word order",
    hanzi: "现在 / 今天 / 明天",
    pattern: "(Time) + Subject + (Time) + Verb + Object",
    summary:
      'Time words go before the subject or right after it — never at the end of the sentence like in English. "Yesterday I went" and "I yesterday went" are both correct in Chinese.',
    examples: [
      {
        hanzi: "我今天工作。",
        pinyin: "Wǒ jīntiān gōngzuò.",
        meaning: "I work today.",
      },
      {
        hanzi: "明天我们喝水。",
        pinyin: "Míngtiān wǒmen hē shuǐ.",
        meaning: "Tomorrow we'll drink water.",
      },
    ],
    vocab: [
      { unit: 3, words: ["现在", "时候"] },
      { unit: 4, words: ["今天"] },
      { unit: 5, words: ["明天"] },
    ],
    resources: [
      {
        label: "Yoyo Chinese — The Golden Rule of Chinese Word Order",
        url: "https://www.youtube.com/watch?v=2fFYObYJG1k",
        type: "video",
      },
      {
        label: "Chinese Grammar Wiki — Time words and word order",
        url: "https://resources.allsetlearning.com/chinese/grammar/Time_words_and_word_order",
        type: "article",
      },
    ],
  },
];
