import { HSK } from "@/lib/hsk";

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

export interface GrammarHanziRequirement {
  wordId: string;
  /** The job this written form performs in this grammar concept. */
  use: string;
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
    id: "di-ordinal",
    level: 2,
    title: "Put things in order with 第",
    hanzi: "第",
    focus: "第",
    pattern: "第 + Number + Noun/Measure phrase",
    summary:
      "第 before a number makes an ordinal: first, second, and so on. Keep the noun or counted event after the number.",
    examples: [
      { hanzi: "第一题是什么意思？", pinyin: "Dì-yī tí shì shénme yìsi?", meaning: "What does the first question mean?" },
      { hanzi: "这是第二次考试。", pinyin: "Zhè shì dì-èr cì kǎoshì.", meaning: "This is the second test." },
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
  {
    id: "neng-ability",
    level: 1,
    title: "Ability and circumstances with 能",
    hanzi: "能",
    focus: "能",
    pattern: "Subject + 能/不能 + Verb",
    summary:
      "能 expresses whether circumstances or personal ability make an action possible. Use 会 for a learned skill and 可以 for permission.",
    examples: [
      { hanzi: "你今天能来吗？", pinyin: "Nǐ jīntiān néng lái ma?", meaning: "Can you come today?" },
      { hanzi: "我不能去。", pinyin: "Wǒ bù néng qù.", meaning: "I cannot go." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "question-words",
    level: 1,
    title: "Ask for missing information",
    hanzi: "谁 / 什么 / 哪儿 / 怎么",
    focus: "什么",
    pattern: "Put the question word where the answer belongs",
    summary:
      "Mandarin question words stay in the answer position. Do not move them to the front as English does.",
    examples: [
      { hanzi: "你想吃什么？", pinyin: "Nǐ xiǎng chī shénme?", meaning: "What would you like to eat?" },
      { hanzi: "你住哪儿？", pinyin: "Nǐ zhù nǎr?", meaning: "Where do you live?" },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "a-not-a-questions",
    level: 1,
    title: "Confirm with an A-not-A question",
    hanzi: "是不是 / 有没有",
    focus: "是不是",
    pattern: "Verb + 不/没 + Verb (+ Object)?",
    summary:
      "Repeat the verb around 不 or 没 to ask for confirmation without 吗. Answer by repeating the positive or negative verb.",
    examples: [
      { hanzi: "他是不是老师？", pinyin: "Tā shì bú shì lǎoshī?", meaning: "Is he a teacher or not?" },
      { hanzi: "你有没有时间？", pinyin: "Nǐ yǒu méiyǒu shíjiān?", meaning: "Do you have time?" },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "you-possession-existence",
    level: 1,
    title: "Possession and existence with 有",
    hanzi: "有",
    focus: "有",
    pattern: "Owner/Place + 有 + Noun",
    summary:
      "有 says that someone has something or that something exists in a place. Negate it only with 没有.",
    examples: [
      { hanzi: "我有一个姐姐。", pinyin: "Wǒ yǒu yí ge jiějie.", meaning: "I have an older sister." },
      { hanzi: "商店里有水。", pinyin: "Shāngdiàn lǐ yǒu shuǐ.", meaning: "There is water in the shop." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "serial-purpose",
    level: 1,
    title: "Link an action to its purpose",
    hanzi: "去 / 来 + Verb",
    focus: "去",
    pattern: "Subject + 去/来 + Place + Verb",
    summary:
      "Put movement first and the purpose action second: go somewhere to do something.",
    examples: [
      { hanzi: "我去商店买水。", pinyin: "Wǒ qù shāngdiàn mǎi shuǐ.", meaning: "I’m going to the shop to buy water." },
      { hanzi: "他来学校学习。", pinyin: "Tā lái xuéxiào xuéxí.", meaning: "He comes to school to study." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "money-expression",
    level: 1,
    title: "Say prices naturally",
    hanzi: "元 / 块",
    focus: "元",
    pattern: "Number + 元/块",
    summary:
      "元 is the standard currency unit and 块 is the common spoken measure word. Put the number before it.",
    examples: [
      { hanzi: "这本书十元。", pinyin: "Zhè běn shū shí yuán.", meaning: "This book is ten yuan." },
      { hanzi: "一杯茶五块。", pinyin: "Yì bēi chá wǔ kuài.", meaning: "A cup of tea is five kuai." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "verb-reduplication",
    level: 2,
    title: "Soften a brief action",
    hanzi: "看看 / 想一想",
    focus: "看看",
    pattern: "AA · A一A · A了A · ABAB",
    summary:
      "Reduplicating a verb makes an action brief, tentative, or relaxed. It often sounds friendlier than a bare command.",
    examples: [
      { hanzi: "你看看这件衣服。", pinyin: "Nǐ kànkan zhè jiàn yīfu.", meaning: "Take a look at this piece of clothing." },
      { hanzi: "让我想一想。", pinyin: "Ràng wǒ xiǎng yi xiǎng.", meaning: "Let me think about it." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "adjective-reduplication",
    level: 2,
    title: "Make a vivid description",
    hanzi: "大大的 / 高高兴兴",
    focus: "大大的",
    pattern: "AA · AABB",
    summary:
      "Reduplicated adjectives sound descriptive and vivid. In attributive use they commonly take 的.",
    examples: [
      { hanzi: "他有大大的眼睛。", pinyin: "Tā yǒu dàdà de yǎnjing.", meaning: "He has big, expressive eyes." },
      { hanzi: "大家高高兴兴地回家。", pinyin: "Dàjiā gāogāoxìngxìng de huí jiā.", meaning: "Everyone happily returns home." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "result-complements",
    level: 2,
    title: "Say the result of an action",
    hanzi: "完 / 懂 / 好 / 错",
    focus: "完",
    pattern: "Verb + Result complement",
    summary:
      "A result complement says what the action achieved: finished, understood, done well, or done incorrectly.",
    examples: [
      { hanzi: "我看完了。", pinyin: "Wǒ kàn wán le.", meaning: "I finished reading or watching it." },
      { hanzi: "我听懂了。", pinyin: "Wǒ tīng dǒng le.", meaning: "I understood what I heard." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "directional-complements",
    level: 2,
    title: "Track movement toward or away",
    hanzi: "来 / 去",
    focus: "来",
    pattern: "Verb + Direction + 来/去",
    summary:
      "Directional complements show the path of movement and whether it comes toward the speaker or goes away.",
    examples: [
      { hanzi: "请进来。", pinyin: "Qǐng jìnlái.", meaning: "Please come in." },
      { hanzi: "他走出去了。", pinyin: "Tā zǒu chūqu le.", meaning: "He walked out." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "de-state-complement",
    level: 2,
    title: "Describe how an action is done",
    hanzi: "得",
    focus: "得",
    pattern: "Verb + 得 + Adjective phrase",
    summary:
      "The neutral-tone 得 after a verb introduces a description of the action’s degree or manner.",
    examples: [
      { hanzi: "他说得很好。", pinyin: "Tā shuō de hěn hǎo.", meaning: "He speaks very well." },
      { hanzi: "你跑得很快。", pinyin: "Nǐ pǎo de hěn kuài.", meaning: "You run very fast." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "zhe-continuing-state",
    level: 2,
    title: "Keep a state in view with 着",
    hanzi: "着",
    focus: "着",
    pattern: "Verb + 着",
    summary:
      "着 marks an action or resulting state that continues, often describing how something is positioned.",
    examples: [
      { hanzi: "门开着。", pinyin: "Mén kāizhe.", meaning: "The door is open." },
      { hanzi: "他拿着书。", pinyin: "Tā názhe shū.", meaning: "He is holding a book." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "guo-experience",
    level: 2,
    title: "Talk about past experience with 过",
    hanzi: "过",
    focus: "过",
    pattern: "Subject + Verb + 过 (+ Object)",
    summary:
      "The neutral-tone 过 says an experience has happened at least once, without locating one specific completed event.",
    examples: [
      { hanzi: "我去过中国。", pinyin: "Wǒ qùguo Zhōngguó.", meaning: "I have been to China." },
      { hanzi: "你吃过饺子吗？", pinyin: "Nǐ chīguo jiǎozi ma?", meaning: "Have you ever eaten dumplings?" },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "haishi-choice",
    level: 2,
    title: "Offer a choice with 还是",
    hanzi: "还是",
    focus: "还是",
    pattern: "A + 还是 + B？",
    summary:
      "Use 还是 between alternatives in a question. The listener chooses one of the offered options.",
    examples: [
      { hanzi: "你喝茶还是咖啡？", pinyin: "Nǐ hē chá háishi kāfēi?", meaning: "Do you drink tea or coffee?" },
      { hanzi: "坐地铁还是打车？", pinyin: "Zuò dìtiě háishi dǎchē?", meaning: "Take the subway or a taxi?" },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "bie-command",
    level: 2,
    title: "Tell someone not to with 别",
    hanzi: "别",
    focus: "别",
    pattern: "别 + Verb (+ 了)",
    summary:
      "别 before a verb is the natural everyday negative command. Add 了 when asking someone to stop an action or drop a plan.",
    examples: [
      { hanzi: "别走。", pinyin: "Bié zǒu.", meaning: "Don’t leave." },
      { hanzi: "别说话了。", pinyin: "Bié shuōhuà le.", meaning: "Stop talking." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "suiran-danshi",
    level: 2,
    title: "Contrast with 虽然…但是…",
    hanzi: "虽然 / 但是",
    focus: "虽然",
    pattern: "虽然 + Fact, 但是 + Contrast",
    summary:
      "虽然 introduces the fact you concede; 但是 introduces the contrasting result. In speech, 但是 may be omitted when the contrast is clear.",
    examples: [
      { hanzi: "虽然下雨，但是我去上班。", pinyin: "Suīrán xià yǔ, dànshì wǒ qù shàngbān.", meaning: "Although it is raining, I’m going to work." },
      { hanzi: "虽然很累，但是他很高兴。", pinyin: "Suīrán hěn lèi, dànshì tā hěn gāoxìng.", meaning: "Although he is tired, he is happy." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "yi-jiu",
    level: 2,
    title: "Say one event follows another",
    hanzi: "一…就…",
    focus: "就",
    pattern: "一 + Event 1 + 就 + Event 2",
    summary:
      "一…就… links events that happen in quick sequence or whenever the first condition occurs.",
    examples: [
      { hanzi: "我一下班就回家。", pinyin: "Wǒ yí xiàbān jiù huí jiā.", meaning: "I go home as soon as I get off work." },
      { hanzi: "他一来我就走。", pinyin: "Tā yì lái wǒ jiù zǒu.", meaning: "As soon as he comes, I leave." },
    ],
    vocab: [],
    resources: [],
  },
  {
    id: "shi-de-emphasis",
    level: 2,
    title: "Emphasize event details with 是…的",
    hanzi: "是…的",
    focus: "是",
    pattern: "Subject + 是 + Detail + Verb + 的",
    summary:
      "Use 是…的 to focus on when, where, how, or by whom a known past event happened.",
    examples: [
      { hanzi: "我是坐地铁来的。", pinyin: "Wǒ shì zuò dìtiě lái de.", meaning: "I came by subway." },
      { hanzi: "他是昨天来的。", pinyin: "Tā shì zuótiān lái de.", meaning: "He came yesterday." },
    ],
    vocab: [],
    resources: [],
  },
];

/**
 * A deliberately small written-form bridge into each grammar concept.
 * These are prerequisites for reading the pattern, not a claim that every
 * word in every example must be mastered before grammar practice begins.
 */
export const GRAMMAR_HANZI_REQUIREMENTS: Record<
  string,
  GrammarHanziRequirement[]
> = {
  "shi-sentences": [
    { wordId: "hsk1-096", use: "links one identity to another" },
  ],
  "ma-questions": [
    { wordId: "hsk1-096", use: "forms the statement before the question" },
    { wordId: "hsk1-061", use: "turns that statement into a yes/no question" },
  ],
  "de-possession": [
    { wordId: "hsk1-015", use: "links an owner or description to a thing" },
  ],
  "bu-vs-mei": [
    { wordId: "hsk1-007", use: "negates habits, states, and future actions" },
    { wordId: "hsk1-064", use: "negates possession and completed actions" },
    { wordId: "hsk1-136", use: "combines with 没 for ‘do not have’" },
  ],
  "measure-words": [
    { wordId: "hsk1-032", use: "the general measure word" },
    { wordId: "hsk1-104", use: "counts years of age" },
    { wordId: "hsk1-030", use: "counts minutes" },
  ],
  "date-word-order": [
    { wordId: "hsk1-137", use: "marks the month" },
    { wordId: "hsk1-087", use: "marks the day of the month" },
    { wordId: "hsk1-016", use: "marks the clock hour" },
  ],
  "time-word-order": [
    { wordId: "hsk1-120", use: "places the action in the present" },
    { wordId: "hsk1-047", use: "places the action today" },
    { wordId: "hsk1-068", use: "places the action tomorrow" },
  ],
  "xiang-want": [
    { wordId: "hsk1-121", use: "expresses wanting to do the next action" },
  ],
  "tai-le": [
    { wordId: "hsk1-107", use: "marks an excessive or strong degree" },
    { wordId: "hsk1-055", use: "closes the reaction as a new situation" },
  ],
  "zai-location": [
    { wordId: "hsk1-139", use: "places a person, thing, or action somewhere" },
  ],
  "ye-dou": [
    { wordId: "hsk2-121", use: "adds another matching person or action" },
    { wordId: "hsk1-021", use: "includes every member of the topic" },
  ],
  "hen-adjective": [
    { wordId: "hsk1-039", use: "connects a subject directly to an adjective" },
  ],
  "le-completed": [
    { wordId: "hsk1-055", use: "presents an action as completed" },
  ],
  "cong-dao-route": [
    { wordId: "hsk2-014", use: "introduces the starting point" },
    { wordId: "hsk2-019", use: "introduces the destination or arrival" },
  ],
  "li-distance": [
    { wordId: "hsk2-062", use: "sets one place relative to another" },
    { wordId: "hsk2-131", use: "describes a far distance" },
    { wordId: "hsk2-049", use: "describes a near distance" },
  ],
  "keyi-request": [
    { wordId: "hsk2-057", use: "asks whether an action is possible or allowed" },
    { wordId: "hsk1-061", use: "turns the request into a yes/no question" },
  ],
  "qing-request": [
    { wordId: "hsk1-082", use: "makes the following action a polite request" },
    { wordId: "hsk2-028", use: "asks someone to tell you information" },
  ],
  "adj-yidianr": [
    { wordId: "hsk2-007", use: "describes a lower price" },
    { wordId: "hsk1-014", use: "models an adjective before 一点儿" },
  ],
  "de-nominalizer": [
    { wordId: "hsk1-015", use: "replaces a noun already clear from context" },
    { wordId: "hsk2-040", use: "models ‘the red one’" },
  ],
  "yao-order": [
    { wordId: "hsk2-120", use: "states the item you want" },
    { wordId: "hsk1-032", use: "connects a quantity to a general item" },
  ],
  "ba-suggestion": [
    { wordId: "hsk2-001", use: "softens a plan or command into a suggestion" },
  ],
  "song-gei": [
    { wordId: "hsk2-093", use: "marks the act of giving or delivering" },
    { wordId: "hsk2-030", use: "introduces the recipient" },
  ],
  "ne-context-question": [
    { wordId: "hsk1-071", use: "asks ‘what about this topic?’ from context" },
  ],
  "zhengzai-progress": [
    { wordId: "hsk2-141", use: "marks an action happening right now" },
  ],
  "yijing-completed": [
    { wordId: "hsk2-123", use: "makes ‘already’ explicit" },
    { wordId: "hsk2-100", use: "shows the action reaches its endpoint" },
    { wordId: "hsk1-055", use: "presents the completion as relevant now" },
  ],
  "di-ordinal": [
    { wordId: "hsk2-022", use: "turns a number into first, second, and so on" },
    { wordId: "hsk2-013", use: "counts repeated events after the ordinal" },
  ],
  "bu-zhidao-zenme": [
    { wordId: "hsk1-007", use: "negates knowing" },
    { wordId: "hsk2-142", use: "expresses knowing or not knowing" },
    { wordId: "hsk1-140", use: "introduces how to perform the action" },
  ],
  "zai-repeat": [
    { wordId: "hsk2-133", use: "marks an action that will happen again" },
    { wordId: "hsk2-013", use: "counts the repetition" },
  ],
  "yinwei-suoyi": [
    { wordId: "hsk2-125", use: "introduces the reason" },
    { wordId: "hsk2-094", use: "introduces the result" },
  ],
  "dei-advice": [
    { wordId: "hsk2-020", use: "means ‘need to’ when pronounced děi" },
    { wordId: "hsk2-114", use: "models the necessary action ‘rest’" },
  ],
  "zui-superlative": [
    { wordId: "hsk2-146", use: "marks the highest degree or a favorite" },
  ],
  "hui-ability": [
    { wordId: "hsk1-042", use: "expresses a learned skill" },
    { wordId: "hsk1-007", use: "negates that learned skill" },
  ],
  "bi-comparison": [
    { wordId: "hsk2-006", use: "introduces the comparison reference" },
  ],
  "juede-opinion": [
    { wordId: "hsk2-052", use: "introduces a personal judgment or impression" },
  ],
};

const knownGrammarWordIds = new Set(HSK.map((word) => word.id));
for (const lesson of GRAMMAR_LESSONS) {
  const current = (GRAMMAR_HANZI_REQUIREMENTS[lesson.id] ?? []).filter(
    (requirement) => knownGrammarWordIds.has(requirement.wordId),
  );
  if (current.length > 0) {
    GRAMMAR_HANZI_REQUIREMENTS[lesson.id] = current;
    continue;
  }
  const searchable = [
    lesson.hanzi,
    lesson.pattern,
    ...lesson.examples.map((example) => example.hanzi),
  ].join(" ");
  const candidates = HSK.filter((word) => searchable.includes(word.hanzi))
    .sort((a, b) => b.hanzi.length - a.hanzi.length)
    .slice(0, 3);
  GRAMMAR_HANZI_REQUIREMENTS[lesson.id] = candidates.map((word) => ({
    wordId: word.id,
    use: `supports reading and using the ${lesson.hanzi} pattern`,
  }));
}

export function hanziRequirementsForGrammar(
  lessonId: string,
): GrammarHanziRequirement[] {
  return GRAMMAR_HANZI_REQUIREMENTS[lessonId] ?? [];
}
