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
  level?: 1 | 2;
  title: string;
  hanzi: string;
  /** A token that appears in every example and can be removed for retrieval practice. */
  focus?: string;
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
        hanzi: "他是老师。",
        pinyin: "Tā shì lǎoshī.",
        meaning: "He is a teacher.",
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
      { hanzi: "他的猫。", pinyin: "Tā de māo.", meaning: "His cat." },
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
        hanzi: "他是老师吗？",
        pinyin: "Tā shì lǎoshī ma?",
        meaning: "Is he a teacher?",
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
        hanzi: "他不是老师。",
        pinyin: "Tā bú shì lǎoshī.",
        meaning: "He is not a teacher.",
      },
      {
        hanzi: "我没有狗。",
        pinyin: "Wǒ méiyǒu gǒu.",
        meaning: "I don't have a dog.",
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
        hanzi: "同学都喜欢汉语。",
        pinyin: "Tóngxué dōu xǐhuan Hànyǔ.",
        meaning: "The classmates all like Chinese.",
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
        hanzi: "我今天吃米饭。",
        pinyin: "Wǒ jīntiān chī mǐfàn.",
        meaning: "I eat rice today.",
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
  {
    id: "xiang-want",
    title: "Wanting to do something with 想",
    hanzi: "想",
    pattern: "Subject + 想 + Verb (+ Object)",
    summary:
      '想 (xiǎng) before a verb means "would like to / want to" — softer than a demand. Negate with 不想.',
    examples: [
      {
        hanzi: "我想喝茶。",
        pinyin: "Wǒ xiǎng hē chá.",
        meaning: "I'd like to drink tea.",
      },
      {
        hanzi: "你想吃什么？",
        pinyin: "Nǐ xiǎng chī shénme?",
        meaning: "What would you like to eat?",
      },
    ],
    vocab: [],
    resources: [
      {
        label: "YouTube — 12 Basic Chinese Grammar Points (HSK 1)",
        url: "https://www.youtube.com/watch?v=uSlZVM2VaFE",
        type: "video",
      },
      {
        label: 'Chinese Grammar Wiki — Expressing "would like to" with "xiang"',
        url: 'https://resources.allsetlearning.com/chinese/grammar/Expressing_"would_like_to"_with_"xiang"',
        type: "article",
      },
    ],
  },
  {
    id: "tai-le",
    title: '"Too…!" with 太…了',
    hanzi: "太",
    pattern: "太 + Adjective + 了",
    summary:
      '太 (tài) + adjective + 了 (le) means "too / so …" — excess or strong emotion. 太好了 is the everyday "great!"',
    examples: [
      { hanzi: "太好了！", pinyin: "Tài hǎo le!", meaning: "Great!" },
      {
        hanzi: "这个太大了。",
        pinyin: "Zhège tài dà le.",
        meaning: "This one is too big.",
      },
    ],
    vocab: [],
    resources: [
      {
        label: 'YouTube — Using 太…(了) to say "too" or "so"',
        url: "https://www.youtube.com/watch?v=9_9YcJqdDHo",
        type: "video",
      },
      {
        label: 'Chinese Grammar Wiki — Expressing "excessively" with "tai"',
        url: 'https://resources.allsetlearning.com/chinese/grammar/Expressing_"excessively"_with_"tai"',
        type: "article",
      },
    ],
  },
  {
    id: "hen-adjective",
    title: "Describing things with 很",
    hanzi: "很",
    pattern: "Subject + 很 + Adjective",
    summary:
      'Adjectives link to nouns with 很 (hěn), not 是 — 很 here is closer to "is" than "very". Saying 我是高兴 is the classic beginner mistake.',
    examples: [
      {
        hanzi: "我很高兴。",
        pinyin: "Wǒ hěn gāoxìng.",
        meaning: "I am happy.",
      },
      {
        hanzi: "今天天气很好。",
        pinyin: "Jīntiān tiānqì hěn hǎo.",
        meaning: "The weather is nice today.",
      },
    ],
    vocab: [],
    resources: [
      {
        label: "YouTube — How to use 很 + adjective correctly",
        url: "https://www.youtube.com/watch?v=IAHpFSiT5Gw",
        type: "video",
      },
      {
        label: 'Chinese Grammar Wiki — Simple "noun + adjective" sentences',
        url: 'https://resources.allsetlearning.com/chinese/grammar/Simple_"noun_+_adjective"_sentences',
        type: "article",
      },
    ],
  },
  {
    id: "le-completed",
    title: "Completed actions with 了",
    hanzi: "了",
    pattern: "Subject + Verb + 了 (+ Object)",
    summary:
      "了 (le) right after a verb marks the action as completed — Chinese has no past tense, so 了 does that work: 我看了电影 = I watched a movie.",
    examples: [
      {
        hanzi: "我看了电影。",
        pinyin: "Wǒ kàn le diànyǐng.",
        meaning: "I watched a movie.",
      },
      {
        hanzi: "他买了三本书。",
        pinyin: "Tā mǎi le sān běn shū.",
        meaning: "He bought three books.",
      },
    ],
    vocab: [],
    resources: [
      {
        label: 'YouTube — Chinese Grammar Point "了" (HSK 1), GoEast Mandarin',
        url: "https://www.youtube.com/watch?v=CXeUCVodWv0",
        type: "video",
      },
      {
        label: 'Chinese Grammar Wiki — Expressing completion with "le"',
        url: 'https://resources.allsetlearning.com/chinese/grammar/Expressing_completion_with_"le"',
        type: "article",
      },
    ],
  },
  {
    id: "date-word-order",
    level: 1,
    title: "Dates and clock time",
    hanzi: "年 · 月 · 日 · 点",
    focus: "月",
    pattern: "Year + Month + Day · Part of day + Clock time",
    summary:
      "Build dates from large units to small ones. Put 上午, 中午, or 下午 before the hour, and put the whole time phrase before what happens.",
    examples: [
      { hanzi: "今天三月五日。", pinyin: "Jīntiān sānyuè wǔ rì.", meaning: "Today is March fifth." },
      { hanzi: "现在是下午三点。", pinyin: "Xiànzài shì xiàwǔ sān diǎn.", meaning: "It is three p.m. now." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "cong-dao-route",
    level: 2,
    title: "Describe a route with 从…到…",
    hanzi: "从…到…",
    focus: "从",
    pattern: "Subject + 从 + Start + (Verb) + 到 + Destination",
    summary:
      "从 introduces the starting point and 到 introduces the destination. Keep the movement verb between them or after the destination, depending on what you want to emphasize.",
    examples: [
      { hanzi: "从这儿到机场怎么走？", pinyin: "Cóng zhèr dào jīchǎng zěnme zǒu?", meaning: "How do I get from here to the airport?" },
      { hanzi: "我从家走到公司。", pinyin: "Wǒ cóng jiā zǒu dào gōngsī.", meaning: "I walk from home to the company." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "li-distance",
    level: 2,
    title: "Ask about distance with 离",
    hanzi: "离",
    focus: "离",
    pattern: "Place A + 离 + Place B + 远/近",
    summary:
      "离 sets one place in relation to another. Finish with 远 or 近; do not use 是 before the distance adjective.",
    examples: [
      { hanzi: "机场离这儿远吗？", pinyin: "Jīchǎng lí zhèr yuǎn ma?", meaning: "Is the airport far from here?" },
      { hanzi: "公司离我家很近。", pinyin: "Gōngsī lí wǒ jiā hěn jìn.", meaning: "The company is close to my home." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "keyi-request",
    level: 2,
    title: "Ask permission with 可以…吗",
    hanzi: "可以…吗",
    focus: "可以",
    pattern: "可以 + Verb phrase + 吗？",
    summary:
      "Put 可以 before an action and 吗 at the end to ask whether that action is possible or permitted. It is a useful polite request frame.",
    examples: [
      { hanzi: "可以帮助我吗？", pinyin: "Kěyǐ bāngzhù wǒ ma?", meaning: "Can you help me?" },
      { hanzi: "我可以问一个问题吗？", pinyin: "Wǒ kěyǐ wèn yí ge wèntí ma?", meaning: "May I ask a question?" },
    ],
    vocab: [], resources: [],
  },
  {
    id: "qing-request",
    level: 2,
    title: "Make a polite request with 请",
    hanzi: "请",
    focus: "请",
    pattern: "请 + Verb phrase",
    summary:
      "请 before a verb turns an instruction into a polite request. Say exactly what you want the listener to do after 请.",
    examples: [
      { hanzi: "请告诉我房间在哪儿。", pinyin: "Qǐng gàosu wǒ fángjiān zài nǎr.", meaning: "Please tell me where the room is." },
      { hanzi: "请帮助我找房间。", pinyin: "Qǐng bāngzhù wǒ zhǎo fángjiān.", meaning: "Please help me find the room." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "adj-yidianr",
    level: 2,
    title: "Ask for a different degree with 一点儿",
    hanzi: "一点儿",
    focus: "一点儿",
    pattern: "Adjective + 一点儿",
    summary:
      "Put 一点儿 after an adjective to ask for a small change: cheaper, bigger, or slower. In a shop it softens the request.",
    examples: [
      { hanzi: "有便宜一点儿的吗？", pinyin: "Yǒu piányi yìdiǎnr de ma?", meaning: "Is there a slightly cheaper one?" },
      { hanzi: "我要大一点儿的。", pinyin: "Wǒ yào dà yìdiǎnr de.", meaning: "I want a slightly bigger one." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "de-nominalizer",
    level: 2,
    title: "Use 的 for ‘the … one’",
    hanzi: "的",
    focus: "的",
    pattern: "Description + 的",
    summary:
      "When the noun is already clear, a description plus 的 can stand in for it. 红的 means ‘the red one,’ not simply ‘red.’",
    examples: [
      { hanzi: "我要红的。", pinyin: "Wǒ yào hóng de.", meaning: "I want the red one." },
      { hanzi: "便宜的是哪件？", pinyin: "Piányi de shì nǎ jiàn?", meaning: "Which one is the inexpensive one?" },
    ],
    vocab: [], resources: [],
  },
  {
    id: "yao-order",
    level: 2,
    title: "Order directly with 要",
    hanzi: "要",
    focus: "要",
    pattern: "Subject + 要 + Quantity + Item",
    summary:
      "At a counter or restaurant, 要 states what you want. Add a quantity and measure word when needed, then use 谢谢 to keep the short request polite.",
    examples: [
      { hanzi: "我要一杯咖啡。", pinyin: "Wǒ yào yì bēi kāfēi.", meaning: "I would like one cup of coffee." },
      { hanzi: "我还要一个鸡蛋。", pinyin: "Wǒ hái yào yí ge jīdàn.", meaning: "I would also like one egg." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "ba-suggestion",
    level: 2,
    title: "Make a gentle suggestion with 吧",
    hanzi: "吧",
    focus: "吧",
    pattern: "Suggestion + 吧",
    summary:
      "Sentence-final 吧 turns a command or plan into a softer suggestion. It also appears in short acceptances such as 好吧.",
    examples: [
      { hanzi: "再吃一个鸡蛋吧。", pinyin: "Zài chī yí ge jīdàn ba.", meaning: "Have one more egg." },
      { hanzi: "我们一起吃饭吧。", pinyin: "Wǒmen yìqǐ chīfàn ba.", meaning: "Let’s eat together." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "song-gei",
    level: 2,
    title: "Give something to someone with 给",
    hanzi: "给",
    focus: "给",
    pattern: "Subject + Verb + Object + 给 + Person",
    summary:
      "With 送, the gift comes before 给 and the recipient comes after it. In a short response, 这个送给她 is complete and natural.",
    examples: [
      { hanzi: "这个送给她。", pinyin: "Zhège sòng gěi tā.", meaning: "This is a gift for her." },
      { hanzi: "我送一本书给妹妹。", pinyin: "Wǒ sòng yì běn shū gěi mèimei.", meaning: "I give my younger sister a book." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "ne-context-question",
    level: 2,
    title: "Ask ‘what about…?’ with 呢",
    hanzi: "呢",
    focus: "呢",
    pattern: "Topic + 呢？",
    summary:
      "When the context already supplies the full question, topic + 呢 asks about a new person or thing without repeating everything.",
    examples: [
      { hanzi: "旁边的女人呢？", pinyin: "Pángbiān de nǚrén ne?", meaning: "What about the woman beside him?" },
      { hanzi: "你哥哥呢？", pinyin: "Nǐ gēge ne?", meaning: "What about your older brother?" },
    ],
    vocab: [], resources: [],
  },
  {
    id: "zhengzai-progress",
    level: 2,
    title: "Show an action in progress with 正在",
    hanzi: "正在",
    focus: "正在",
    pattern: "Subject + 正在 + Verb (+ Object)",
    summary:
      "正在 marks an action happening right now. Put it directly before the action; do not add 是 between the subject and 正在.",
    examples: [
      { hanzi: "我正在准备工作。", pinyin: "Wǒ zhèngzài zhǔnbèi gōngzuò.", meaning: "I am preparing for work right now." },
      { hanzi: "他正在公司上班。", pinyin: "Tā zhèngzài gōngsī shàngbān.", meaning: "He is working at the company right now." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "yijing-completed",
    level: 2,
    title: "Say ‘already’ with 已经…了",
    hanzi: "已经…了",
    focus: "已经",
    pattern: "Subject + 已经 + Verb + 了",
    summary:
      "已经 makes ‘already’ explicit, while 了 presents the action as complete or the new state as relevant now.",
    examples: [
      { hanzi: "我已经做完了。", pinyin: "Wǒ yǐjīng zuò wán le.", meaning: "I have already finished." },
      { hanzi: "他已经到公司了。", pinyin: "Tā yǐjīng dào gōngsī le.", meaning: "He has already arrived at the company." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "bu-zhidao-zenme",
    level: 2,
    title: "Say you do not know how",
    hanzi: "不知道怎么…",
    focus: "怎么",
    pattern: "Subject + 不知道 + 怎么 + Verb",
    summary:
      "Use 不知道怎么 before an action when you do not know how to do it. The question word stays inside the statement.",
    examples: [
      { hanzi: "我不知道怎么回答。", pinyin: "Wǒ bù zhīdào zěnme huídá.", meaning: "I do not know how to answer." },
      { hanzi: "他不知道怎么做。", pinyin: "Tā bù zhīdào zěnme zuò.", meaning: "He does not know how to do it." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "zai-repeat",
    level: 2,
    title: "Repeat a future action with 再",
    hanzi: "再",
    focus: "再",
    pattern: "再 + Verb + Quantity",
    summary:
      "再 means ‘again’ for an action that will happen next. Put it before the verb, then add 次 when counting repetitions.",
    examples: [
      { hanzi: "请再看一次。", pinyin: "Qǐng zài kàn yí cì.", meaning: "Please look one more time." },
      { hanzi: "我再回答一次。", pinyin: "Wǒ zài huídá yí cì.", meaning: "I will answer one more time." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "yinwei-suoyi",
    level: 2,
    title: "Connect a reason and result",
    hanzi: "因为…所以…",
    focus: "因为",
    pattern: "因为 + Reason，所以 + Result",
    summary:
      "因为 introduces the reason and 所以 introduces the result. In short conversation one half can be omitted when the relationship is obvious.",
    examples: [
      { hanzi: "因为有雪，所以别出去。", pinyin: "Yīnwèi yǒu xuě, suǒyǐ bié chūqù.", meaning: "Because it is snowing, do not go out." },
      { hanzi: "因为我生病了，所以要休息。", pinyin: "Yīnwèi wǒ shēngbìng le, suǒyǐ yào xiūxi.", meaning: "Because I am sick, I need to rest." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "dei-advice",
    level: 2,
    title: "Say what someone needs to do with 得",
    hanzi: "得",
    focus: "得",
    pattern: "Subject + 得 + Verb",
    summary:
      "When pronounced děi, 得 means ‘need to’ or ‘must.’ Put it before the action that is necessary.",
    examples: [
      { hanzi: "你得休息。", pinyin: "Nǐ děi xiūxi.", meaning: "You need to rest." },
      { hanzi: "生病了得吃药。", pinyin: "Shēngbìng le děi chī yào.", meaning: "When you are sick, you need to take medicine." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "zui-superlative",
    level: 2,
    title: "Say what you like most with 最",
    hanzi: "最",
    focus: "最",
    pattern: "Subject + 最 + Adjective/Verb phrase",
    summary:
      "最 marks the highest degree: the most, the best, or a favorite. Put it immediately before what is ranked.",
    examples: [
      { hanzi: "我最喜欢游泳。", pinyin: "Wǒ zuì xǐhuan yóuyǒng.", meaning: "I like swimming best." },
      { hanzi: "篮球最有意思。", pinyin: "Lánqiú zuì yǒu yìsi.", meaning: "Basketball is the most interesting." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "hui-ability",
    level: 2,
    title: "Talk about learned ability with 会",
    hanzi: "会",
    focus: "会",
    pattern: "Subject + 会/不会 + Learned skill",
    summary:
      "会 expresses a skill you have learned. Use 不会 for a skill you have not learned; use 可以 instead for permission or possibility.",
    examples: [
      { hanzi: "我会打篮球。", pinyin: "Wǒ huì dǎ lánqiú.", meaning: "I can play basketball." },
      { hanzi: "我不会踢足球。", pinyin: "Wǒ bú huì tī zúqiú.", meaning: "I cannot play soccer." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "bi-comparison",
    level: 2,
    title: "Compare two people or things with 比",
    hanzi: "比",
    focus: "比",
    pattern: "A + 比 + B + Adjective",
    summary:
      "Put the reference after 比 and the result adjective at the end. Do not add 很 inside a basic 比 comparison.",
    examples: [
      { hanzi: "王明比哥哥高。", pinyin: "Wáng Míng bǐ gēge gāo.", meaning: "Wang Ming is taller than his older brother." },
      { hanzi: "今天比昨天热。", pinyin: "Jīntiān bǐ zuótiān rè.", meaning: "Today is hotter than yesterday." },
    ],
    vocab: [], resources: [],
  },
  {
    id: "juede-opinion",
    level: 2,
    title: "Give an opinion with 觉得",
    hanzi: "觉得",
    focus: "觉得",
    pattern: "Subject + 觉得 + Clause",
    summary:
      "觉得 introduces a personal judgment or impression. Follow it with a complete idea, not only a bare noun.",
    examples: [
      { hanzi: "我觉得他很高。", pinyin: "Wǒ juéde tā hěn gāo.", meaning: "I think he is tall." },
      { hanzi: "你觉得这个照片怎么样？", pinyin: "Nǐ juéde zhège zhàopiàn zěnmeyàng?", meaning: "What do you think of this photo?" },
    ],
    vocab: [], resources: [],
  },
];
