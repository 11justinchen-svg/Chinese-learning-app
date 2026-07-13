export type RoleCallPersonaId =
  | "waiter"
  | "shopkeeper"
  | "taxi-driver"
  | "hotel-clerk"
  | "teacher";

export interface RoleCallLine {
  hanzi: string;
  pinyin: string;
  english: string;
}

export interface RoleCallStep {
  id: string;
  goal: string;
  acceptedAnswers: string[];
  /** Every group needs at least one match. Useful for personal answers. */
  requiredGroups?: string[][];
  minNormalizedLength?: number;
  target: RoleCallLine;
  response: RoleCallLine;
  hints: [string, string, string];
  correction: string;
}

export interface RoleCallScenario {
  id: RoleCallPersonaId;
  role: string;
  roleHanzi: string;
  setting: string;
  description: string;
  goal: string;
  accent: string;
  recommendedStage: number;
  /** Lets grammar blocks embed the same guided conversation without copying it. */
  grammarLessonIds: string[];
  opening: RoleCallLine;
  steps: RoleCallStep[];
}

export const ROLE_CALL_SCENARIOS: RoleCallScenario[] = [
  {
    id: "waiter",
    role: "Waiter",
    roleHanzi: "服务员",
    setting: "At a small restaurant",
    description: "Order a drink and food, then thank the waiter.",
    goal: "Order tea and rice",
    accent: "from-amber-500/20 to-orange-500/5",
    recommendedStage: 5,
    grammarLessonIds: ["xiang-want", "measure-words"],
    opening: {
      hanzi: "你好！你想喝什么？",
      pinyin: "Nǐ hǎo! Nǐ xiǎng hē shénme?",
      english: "Hello! What would you like to drink?",
    },
    steps: [
      {
        id: "waiter-order-tea",
        goal: "Say that you would like tea.",
        acceptedAnswers: ["我想喝茶", "想喝茶", "我要茶", "请给我茶"],
        target: {
          hanzi: "我想喝茶。",
          pinyin: "Wǒ xiǎng hē chá.",
          english: "I would like tea.",
        },
        response: {
          hanzi: "好的。一杯茶。你想吃什么？",
          pinyin: "Hǎo de. Yì bēi chá. Nǐ xiǎng chī shénme?",
          english: "Sure. One cup of tea. What would you like to eat?",
        },
        hints: [
          "Start with ‘I would like…’",
          "Use 我想 + drink + tea.",
          "Complete: 我想喝＿。",
        ],
        correction: "Use 想 before the action 喝 to say what you would like.",
      },
      {
        id: "waiter-order-rice",
        goal: "Order rice to eat.",
        acceptedAnswers: ["我想吃米饭", "想吃米饭", "我要米饭", "请给我米饭"],
        target: {
          hanzi: "我想吃米饭。",
          pinyin: "Wǒ xiǎng chī mǐfàn.",
          english: "I would like to eat rice.",
        },
        response: {
          hanzi: "好的。茶和米饭。",
          pinyin: "Hǎo de. Chá hé mǐfàn.",
          english: "Sure. Tea and rice.",
        },
        hints: [
          "Keep the same pattern, but use ‘eat.’",
          "Use 我想 + 吃 + 米饭.",
          "Complete: 我想吃＿。",
        ],
        correction: "For food, use 吃 rather than 喝 after 我想.",
      },
      {
        id: "waiter-thank",
        goal: "Thank the waiter.",
        acceptedAnswers: ["谢谢", "谢谢你", "好谢谢", "好的谢谢"],
        target: {
          hanzi: "谢谢！",
          pinyin: "Xièxie!",
          english: "Thank you!",
        },
        response: {
          hanzi: "不客气！",
          pinyin: "Bú kèqi!",
          english: "You’re welcome!",
        },
        hints: ["Use the common two-syllable thank-you.", "It begins 谢…", "Say: 谢谢。"],
        correction: "Close the order politely with 谢谢.",
      },
    ],
  },
  {
    id: "shopkeeper",
    role: "Sales associate",
    roleHanzi: "店员",
    setting: "In a clothing shop",
    description: "Ask about an item, its price, and buy it.",
    goal: "Ask the price and buy an item",
    accent: "from-rose-500/20 to-pink-500/5",
    recommendedStage: 6,
    grammarLessonIds: ["xiang-want", "measure-words"],
    opening: {
      hanzi: "你好！你想买什么？",
      pinyin: "Nǐ hǎo! Nǐ xiǎng mǎi shénme?",
      english: "Hello! What would you like to buy?",
    },
    steps: [
      {
        id: "shop-point-item",
        goal: "Say you would like to buy this one.",
        acceptedAnswers: ["我想买这个", "想买这个", "我要这个", "我买这个"],
        target: { hanzi: "我想买这个。", pinyin: "Wǒ xiǎng mǎi zhège.", english: "I would like to buy this one." },
        response: { hanzi: "好的。这个很好。", pinyin: "Hǎo de. Zhège hěn hǎo.", english: "Sure. This one is very good." },
        hints: ["Point to ‘this one.’", "Use 我想 + 买 + 这个.", "Complete: 我想买＿。"],
        correction: "Use 买 for ‘buy’ and 这个 for the item you are pointing to.",
      },
      {
        id: "shop-ask-price",
        goal: "Ask how much this one costs.",
        acceptedAnswers: ["这个多少钱", "多少钱", "这个几块钱"],
        target: { hanzi: "这个多少钱？", pinyin: "Zhège duōshao qián?", english: "How much is this?" },
        response: { hanzi: "三十块钱。", pinyin: "Sānshí kuài qián.", english: "Thirty yuan." },
        hints: ["Ask ‘this + how much money?’", "Use 这个 + 多少钱.", "Complete: 这个多少＿？"],
        correction: "Use 多少钱 as the price question; no 吗 is needed.",
      },
      {
        id: "shop-buy",
        goal: "Say you will buy it.",
        acceptedAnswers: ["我买这个", "我要这个", "好我买", "好我要这个"],
        target: { hanzi: "好，我买这个。", pinyin: "Hǎo, wǒ mǎi zhège.", english: "Okay, I’ll buy this one." },
        response: { hanzi: "谢谢！", pinyin: "Xièxie!", english: "Thank you!" },
        hints: ["Accept the price and name the item.", "Use 好 + 我买 + 这个.", "Say: 好，我买这个。"],
        correction: "Use 我买这个 to confirm the purchase.",
      },
    ],
  },
  {
    id: "taxi-driver",
    role: "Taxi driver",
    roleHanzi: "出租车司机",
    setting: "Inside a taxi",
    description: "Tell the driver where you are going and confirm the place.",
    goal: "Get to the hotel",
    accent: "from-sky-500/20 to-cyan-500/5",
    recommendedStage: 7,
    grammarLessonIds: ["zai-location"],
    opening: { hanzi: "你好！你去哪儿？", pinyin: "Nǐ hǎo! Nǐ qù nǎr?", english: "Hello! Where are you going?" },
    steps: [
      {
        id: "taxi-destination",
        goal: "Say you are going to the hotel.",
        acceptedAnswers: ["我去饭店", "去饭店", "请去饭店"],
        target: { hanzi: "我去饭店。", pinyin: "Wǒ qù fàndiàn.", english: "I’m going to the hotel." },
        response: { hanzi: "好。哪个饭店？", pinyin: "Hǎo. Nǎge fàndiàn?", english: "Okay. Which hotel?" },
        hints: ["Answer with ‘I go to…’", "Use 我 + 去 + 饭店.", "Complete: 我去＿。"],
        correction: "Put the destination directly after 去: 去饭店.",
      },
      {
        id: "taxi-beijing-hotel",
        goal: "Say it is the Beijing Hotel.",
        acceptedAnswers: ["北京饭店", "是北京饭店", "去北京饭店"],
        target: { hanzi: "北京饭店。", pinyin: "Běijīng Fàndiàn.", english: "The Beijing Hotel." },
        response: { hanzi: "好的。北京饭店在前面。", pinyin: "Hǎo de. Běijīng Fàndiàn zài qiánmiàn.", english: "All right. The Beijing Hotel is ahead." },
        hints: ["Name the hotel with the city first.", "Say 北京 + 饭店.", "Say: 北京饭店。"],
        correction: "Place 北京 before 饭店 to form the hotel name.",
      },
      {
        id: "taxi-confirm",
        goal: "Confirm and thank the driver.",
        acceptedAnswers: ["好谢谢", "好的谢谢", "谢谢", "谢谢你"],
        target: { hanzi: "好的，谢谢。", pinyin: "Hǎo de, xièxie.", english: "Okay, thank you." },
        response: { hanzi: "不客气。", pinyin: "Bú kèqi.", english: "You’re welcome." },
        hints: ["Confirm, then thank them.", "Use 好的 + 谢谢.", "Say: 好的，谢谢。"],
        correction: "好的 confirms that you understood; 谢谢 closes politely.",
      },
    ],
  },
  {
    id: "hotel-clerk",
    role: "Hotel clerk",
    roleHanzi: "饭店前台",
    setting: "Checking in at a hotel",
    description: "Give your name, say how many days, and receive your room.",
    goal: "Check in for three days",
    accent: "from-violet-500/20 to-indigo-500/5",
    recommendedStage: 7,
    grammarLessonIds: ["shi-sentences", "de-possession", "measure-words"],
    opening: { hanzi: "你好！你叫什么名字？", pinyin: "Nǐ hǎo! Nǐ jiào shénme míngzi?", english: "Hello! What is your name?" },
    steps: [
      {
        id: "hotel-name",
        goal: "Introduce yourself with 我叫 and your name.",
        acceptedAnswers: [],
        requiredGroups: [["我叫"]],
        minNormalizedLength: 3,
        target: { hanzi: "我叫小明。", pinyin: "Wǒ jiào Xiǎomíng.", english: "My name is Xiaoming. (Use your own name.)" },
        response: { hanzi: "你好！你住几天？", pinyin: "Nǐ hǎo! Nǐ zhù jǐ tiān?", english: "Hello! How many days are you staying?" },
        hints: ["Say ‘I’m called…’ and your name.", "Begin with 我叫.", "Complete with your name: 我叫＿。"],
        correction: "Introduce a name with 我叫, followed directly by the name.",
      },
      {
        id: "hotel-days",
        goal: "Say you are staying for three days.",
        acceptedAnswers: ["我住三天", "住三天", "三天"],
        target: { hanzi: "我住三天。", pinyin: "Wǒ zhù sān tiān.", english: "I’m staying for three days." },
        response: { hanzi: "好。这是你的房间。", pinyin: "Hǎo. Zhè shì nǐ de fángjiān.", english: "Okay. This is your room." },
        hints: ["Use ‘stay + three days.’", "Use 我住 + 三天.", "Complete: 我住＿天。"],
        correction: "The duration follows 住 directly: 住三天.",
      },
      {
        id: "hotel-thank",
        goal: "Thank the clerk.",
        acceptedAnswers: ["谢谢", "谢谢你", "好的谢谢"],
        target: { hanzi: "谢谢！", pinyin: "Xièxie!", english: "Thank you!" },
        response: { hanzi: "不客气！", pinyin: "Bú kèqi!", english: "You’re welcome!" },
        hints: ["Close politely.", "It begins 谢…", "Say: 谢谢。"],
        correction: "Use 谢谢 to thank the clerk.",
      },
    ],
  },
  {
    id: "teacher",
    role: "Teacher",
    roleHanzi: "老师",
    setting: "Your first Chinese class",
    description: "Introduce your Chinese level and ask the teacher a question.",
    goal: "Tell the teacher what you can say",
    accent: "from-emerald-500/20 to-teal-500/5",
    recommendedStage: 8,
    grammarLessonIds: ["ma-questions", "bu-vs-mei", "xiang-want", "ye-dou"],
    opening: { hanzi: "你好！你会说汉语吗？", pinyin: "Nǐ hǎo! Nǐ huì shuō Hànyǔ ma?", english: "Hello! Can you speak Chinese?" },
    steps: [
      {
        id: "teacher-ability",
        goal: "Say that you can speak a little Chinese.",
        acceptedAnswers: ["我会说一点汉语", "会说一点汉语", "我会说汉语", "会说汉语"],
        target: { hanzi: "我会说一点汉语。", pinyin: "Wǒ huì shuō yìdiǎn Hànyǔ.", english: "I can speak a little Chinese." },
        response: { hanzi: "很好！你会写汉字吗？", pinyin: "Hěn hǎo! Nǐ huì xiě Hànzì ma?", english: "Very good! Can you write Chinese characters?" },
        hints: ["Use 会 for a learned ability.", "Use 我会说 + 一点汉语.", "Complete: 我会说一点＿。"],
        correction: "Use 会 before 说 to express a learned ability.",
      },
      {
        id: "teacher-writing",
        goal: "Say that you cannot write Chinese characters.",
        acceptedAnswers: ["我不会写汉字", "不会写汉字", "我不会", "不会"],
        target: { hanzi: "我不会写汉字。", pinyin: "Wǒ bú huì xiě Hànzì.", english: "I can’t write Chinese characters." },
        response: { hanzi: "没关系。我们学习汉字。", pinyin: "Méi guānxi. Wǒmen xuéxí Hànzì.", english: "That’s okay. We’ll study Chinese characters." },
        hints: ["Negate the learned ability.", "Put 不 before 会.", "Complete: 我不＿写汉字。"],
        correction: "Negate 会 with 不: 不会. Do not use 没 here.",
      },
      {
        id: "teacher-ready",
        goal: "Say that you want to study.",
        acceptedAnswers: ["我想学习", "想学习", "我要学习", "我想学汉语"],
        target: { hanzi: "我想学习。", pinyin: "Wǒ xiǎng xuéxí.", english: "I want to study." },
        response: { hanzi: "好，我们开始吧！", pinyin: "Hǎo, wǒmen kāishǐ ba!", english: "Great, let’s begin!" },
        hints: ["Say what you want to do.", "Use 我想 + 学习.", "Say: 我想学习。"],
        correction: "Use 想 before 学习 to express what you want to do.",
      },
    ],
  },
];

export function findRoleCallScenario(id: string): RoleCallScenario | undefined {
  return ROLE_CALL_SCENARIOS.find((scenario) => scenario.id === id);
}

export function findRoleCallScenarioForGrammar(
  grammarLessonId: string,
): RoleCallScenario | undefined {
  return ROLE_CALL_SCENARIOS.find((scenario) =>
    scenario.grammarLessonIds.includes(grammarLessonId),
  );
}

export function normalizeMandarinAnswer(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s,.!?;:'"，。！？；：、“”‘’]/g, "")
    .replace(/兒/g, "儿")
    .trim();
}

export function evaluateRoleCallAnswer(
  step: RoleCallStep,
  learnerText: string,
): boolean {
  const answer = normalizeMandarinAnswer(learnerText);
  if (!answer) return false;
  if (step.minNormalizedLength && answer.length < step.minNormalizedLength)
    return false;

  if (
    step.acceptedAnswers.some(
      (candidate) => normalizeMandarinAnswer(candidate) === answer,
    )
  ) {
    return true;
  }

  return Boolean(
    step.requiredGroups?.every((group) =>
      group.some((part) => answer.includes(normalizeMandarinAnswer(part))),
    ),
  );
}
