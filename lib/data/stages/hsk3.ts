import { HSK1, HSK2, type HskLevel, type HskWord } from "@/lib/hsk";
import { GRAMMAR_LESSONS } from "@/lib/data/grammar";
import type {
  ChoiceExercise,
  ClozeExercise,
  DialogueLine,
  Exercise,
  ExerciseBlock,
  ListenExercise,
  MatchExercise,
  OrderExercise,
  ReplyExercise,
  Stage,
} from "./types";

interface Topic {
  key: string;
  title: string;
  hanziTitle: string;
  goal: string;
  description: string;
  words: string;
  meanings?: RegExp;
  grammarIds: string[];
  dialogue: DialogueLine[];
}

const CORE_DIALOGUES: Record<string, DialogueLine[]> = {
  people: [
    { speaker: "新同学", hanzi: "你好！你叫什么名字？", pinyin: "Nǐ hǎo! Nǐ jiào shénme míngzi?", english: "Hi! What is your name?" },
    { speaker: "你", hanzi: "我叫李明。你呢？", pinyin: "Wǒ jiào Lǐ Míng. Nǐ ne?", english: "My name is Li Ming. And you?" },
    { speaker: "新同学", hanzi: "我叫王月。那是你的朋友吗？", pinyin: "Wǒ jiào Wáng Yuè. Nà shì nǐ de péngyou ma?", english: "I’m Wang Yue. Is that your friend?" },
    { speaker: "你", hanzi: "是，他是我的同学。", pinyin: "Shì, tā shì wǒ de tóngxué.", english: "Yes, he is my classmate." },
    { speaker: "新同学", hanzi: "很高兴认识你们！", pinyin: "Hěn gāoxìng rènshi nǐmen!", english: "Nice to meet you both!" },
    { speaker: "你", hanzi: "我们也很高兴认识你。", pinyin: "Wǒmen yě hěn gāoxìng rènshi nǐ.", english: "We’re glad to meet you too." },
  ],
  time: [
    { speaker: "朋友", hanzi: "我们星期几见？", pinyin: "Wǒmen xīngqī jǐ jiàn?", english: "What day should we meet?" },
    { speaker: "你", hanzi: "星期六可以吗？", pinyin: "Xīngqīliù kěyǐ ma?", english: "Is Saturday okay?" },
    { speaker: "朋友", hanzi: "可以。几点？", pinyin: "Kěyǐ. Jǐ diǎn?", english: "Sure. What time?" },
    { speaker: "你", hanzi: "下午三点。", pinyin: "Xiàwǔ sān diǎn.", english: "Three in the afternoon." },
    { speaker: "朋友", hanzi: "好，三点见。", pinyin: "Hǎo, sān diǎn jiàn.", english: "Okay, see you at three." },
    { speaker: "你", hanzi: "好的，星期六见！", pinyin: "Hǎo de, xīngqīliù jiàn!", english: "Great, see you Saturday!" },
  ],
  food: [
    { speaker: "服务员", hanzi: "您好，您要吃什么？", pinyin: "Nín hǎo, nín yào chī shénme?", english: "Hello, what would you like to eat?" },
    { speaker: "你", hanzi: "我要饺子和一杯茶。", pinyin: "Wǒ yào jiǎozi hé yì bēi chá.", english: "I’d like dumplings and a cup of tea." },
    { speaker: "服务员", hanzi: "还要米饭吗？", pinyin: "Hái yào mǐfàn ma?", english: "Would you also like rice?" },
    { speaker: "你", hanzi: "不要米饭。请给我水。", pinyin: "Bú yào mǐfàn. Qǐng gěi wǒ shuǐ.", english: "No rice. Please give me water." },
    { speaker: "服务员", hanzi: "好，请等一下。", pinyin: "Hǎo, qǐng děng yíxià.", english: "Okay, please wait a moment." },
    { speaker: "你", hanzi: "谢谢。", pinyin: "Xièxie.", english: "Thank you." },
  ],
  shopping: [
    { speaker: "店员", hanzi: "您好，您要买什么？", pinyin: "Nín hǎo, nín yào mǎi shénme?", english: "Hello, what would you like to buy?" },
    { speaker: "你", hanzi: "这件衣服多少钱？", pinyin: "Zhè jiàn yīfu duōshao qián?", english: "How much is this piece of clothing?" },
    { speaker: "店员", hanzi: "八十元。", pinyin: "Bāshí yuán.", english: "Eighty yuan." },
    { speaker: "你", hanzi: "有便宜一点儿的吗？", pinyin: "Yǒu piányi yìdiǎnr de ma?", english: "Do you have a cheaper one?" },
    { speaker: "店员", hanzi: "这件五十元。", pinyin: "Zhè jiàn wǔshí yuán.", english: "This one is fifty yuan." },
    { speaker: "你", hanzi: "好，我买这件。", pinyin: "Hǎo, wǒ mǎi zhè jiàn.", english: "Okay, I’ll buy this one." },
  ],
  place: [
    { speaker: "你", hanzi: "请问，地铁站在哪儿？", pinyin: "Qǐngwèn, dìtiě zhàn zài nǎr?", english: "Excuse me, where is the subway station?" },
    { speaker: "路人", hanzi: "在商店旁边。", pinyin: "Zài shāngdiàn pángbiān.", english: "It’s beside the shop." },
    { speaker: "你", hanzi: "离这儿远吗？", pinyin: "Lí zhèr yuǎn ma?", english: "Is it far from here?" },
    { speaker: "路人", hanzi: "不远，往前走。", pinyin: "Bù yuǎn, wǎng qián zǒu.", english: "Not far. Walk straight ahead." },
    { speaker: "你", hanzi: "是在左边吗？", pinyin: "Shì zài zuǒbian ma?", english: "Is it on the left?" },
    { speaker: "路人", hanzi: "对，就在左边。", pinyin: "Duì, jiù zài zuǒbian.", english: "Yes, it’s right on the left." },
  ],
  health: [
    { speaker: "医生", hanzi: "你怎么了？", pinyin: "Nǐ zěnme le?", english: "What’s wrong?" },
    { speaker: "你", hanzi: "我生病了，身体不舒服。", pinyin: "Wǒ shēngbìng le, shēntǐ bù shūfu.", english: "I’m sick and don’t feel well." },
    { speaker: "医生", hanzi: "你吃药了吗？", pinyin: "Nǐ chī yào le ma?", english: "Have you taken medicine?" },
    { speaker: "你", hanzi: "还没有。", pinyin: "Hái méiyǒu.", english: "Not yet." },
    { speaker: "医生", hanzi: "要吃药，也要多休息。", pinyin: "Yào chī yào, yě yào duō xiūxi.", english: "Take medicine and get more rest." },
    { speaker: "你", hanzi: "好的，谢谢医生。", pinyin: "Hǎo de, xièxie yīshēng.", english: "Okay, thank you, doctor." },
  ],
  school: [
    { speaker: "老师", hanzi: "大家准备好了吗？", pinyin: "Dàjiā zhǔnbèi hǎo le ma?", english: "Is everyone ready?" },
    { speaker: "学生", hanzi: "老师，第一题是什么意思？", pinyin: "Lǎoshī, dì-yī tí shì shénme yìsi?", english: "Teacher, what does the first question mean?" },
    { speaker: "老师", hanzi: "请再读一次。", pinyin: "Qǐng zài dú yí cì.", english: "Please read it one more time." },
    { speaker: "学生", hanzi: "我还是不懂。", pinyin: "Wǒ háishi bù dǒng.", english: "I still don’t understand." },
    { speaker: "老师", hanzi: "没关系，我告诉你。", pinyin: "Méi guānxi, wǒ gàosu nǐ.", english: "That’s okay, I’ll tell you." },
    { speaker: "学生", hanzi: "谢谢老师，我懂了。", pinyin: "Xièxie lǎoshī, wǒ dǒng le.", english: "Thank you, teacher. I understand now." },
  ],
  activity: [
    { speaker: "朋友", hanzi: "你周末喜欢做什么？", pinyin: "Nǐ zhōumò xǐhuan zuò shénme?", english: "What do you like doing on weekends?" },
    { speaker: "你", hanzi: "我喜欢跑步和游泳。", pinyin: "Wǒ xǐhuan pǎobù hé yóuyǒng.", english: "I like running and swimming." },
    { speaker: "朋友", hanzi: "我们一起去运动吧。", pinyin: "Wǒmen yìqǐ qù yùndòng ba.", english: "Let’s go exercise together." },
    { speaker: "你", hanzi: "好，什么时候去？", pinyin: "Hǎo, shénme shíhou qù?", english: "Okay, when should we go?" },
    { speaker: "朋友", hanzi: "明天上午怎么样？", pinyin: "Míngtiān shàngwǔ zěnmeyàng?", english: "How about tomorrow morning?" },
    { speaker: "你", hanzi: "可以，明天见！", pinyin: "Kěyǐ, míngtiān jiàn!", english: "That works. See you tomorrow!" },
  ],
  daily: [
    { speaker: "朋友", hanzi: "你今天忙吗？", pinyin: "Nǐ jīntiān máng ma?", english: "Are you busy today?" },
    { speaker: "你", hanzi: "上午很忙，下午有时间。", pinyin: "Shàngwǔ hěn máng, xiàwǔ yǒu shíjiān.", english: "I’m busy in the morning but free in the afternoon." },
    { speaker: "朋友", hanzi: "下午一起喝咖啡吧。", pinyin: "Xiàwǔ yìqǐ hē kāfēi ba.", english: "Let’s have coffee this afternoon." },
    { speaker: "你", hanzi: "好，在哪儿见？", pinyin: "Hǎo, zài nǎr jiàn?", english: "Sure, where should we meet?" },
    { speaker: "朋友", hanzi: "在公司旁边的咖啡店。", pinyin: "Zài gōngsī pángbiān de kāfēidiàn.", english: "At the café next to the company." },
    { speaker: "你", hanzi: "好，一会儿见。", pinyin: "Hǎo, yíhuìr jiàn.", english: "Okay, see you soon." },
  ],
};

function dialogue(name: keyof typeof CORE_DIALOGUES): DialogueLine[] {
  return CORE_DIALOGUES[name];
}

const LEVEL_1_TOPICS: Topic[] = [
  {
    key: "people",
    title: "Meet people",
    hanziTitle: "认识人",
    goal: "Introduce yourself and identify the people around you.",
    description: "Names, pronouns, family, friends, and simple identity.",
    words: "爸爸 大家 大学生 弟弟 儿子 哥哥 孩子 家人 姐姐 妈妈 妹妹 男 男朋友 你 你好 你们 您 女 女儿 女朋友 女士 朋友 人 谁 他 它 她 他们 它们 她们 同学 我 我们 先生 小朋友 小学生 学生 中学生 老师",
    meanings: /person|people|family|friend|student|teacher|child|son|daughter|brother|sister|mother|father|woman|man|name/i,
    grammarIds: [
      "shi-sentences",
      "de-possession",
      "ma-questions",
      "a-not-a-questions",
      "you-possession-existence",
    ],
    dialogue: dialogue("people"),
  },
  {
    key: "time",
    title: "Numbers and time",
    hanziTitle: "数字时间",
    goal: "Give a date or time and arrange when to meet.",
    description: "Numbers, dates, clock time, days, and sequence.",
    words: "八 百 半 第 点 二 分 分钟 号 几 今年 今天 九 两 零 六 明年 明天 年 七 千 去年 日 三 上午 十 时候 时间 四 岁 天 晚 晚上 五 小时 星期 星期日 星期天 一 一半 月 早 早上 昨天 中午 下午",
    meanings: /year|month|day|week|hour|minute|morning|afternoon|evening|today|tomorrow|yesterday|eight|nine|seven|six|five|four|three|two|one|hundred|thousand|half/i,
    grammarIds: [
      "measure-words",
      "time-word-order",
      "date-word-order",
      "di-ordinal",
    ],
    dialogue: dialogue("time"),
  },
  {
    key: "food",
    title: "Eat and drink",
    hanziTitle: "吃饭喝茶",
    goal: "Order a simple meal and state what you like.",
    description: "Everyday food, drinks, meals, and restaurant language.",
    words: "包子 菜 茶 吃 饭 饭店 好吃 喝 鸡蛋 饺子 米饭 面包 面条儿 牛奶 苹果 水 水果 午饭 晚饭 早饭 做饭",
    meanings: /food|eat|drink|tea|coffee|milk|rice|bread|noodle|meal|restaurant|fruit|apple|egg|dumpling|bun/i,
    grammarIds: ["xiang-want", "yao-order", "question-words"],
    dialogue: dialogue("food"),
  },
  {
    key: "shopping",
    title: "Shop and choose",
    hanziTitle: "买东西",
    goal: "Ask for a price, compare options, and buy one item.",
    description: "Prices, quantities, clothing, and useful shop requests.",
    words: "杯子 本 便宜 穿 东西 个 贵 件 块 买 卖 钱 商店 商场 条 万 衣服 元 只",
    meanings: /buy|sell|price|money|yuan|cheap|expensive|clothes|wear|store|shop|measure word/i,
    grammarIds: ["tai-le", "adj-yidianr", "de-nominalizer", "money-expression"],
    dialogue: dialogue("shopping"),
  },
  {
    key: "place",
    title: "Find places",
    hanziTitle: "问路找地方",
    goal: "Ask where a place is and follow a short direction.",
    description: "Places, position, movement, transport, and directions.",
    words: "边 车 出租车 到 大学 店 电影院 东西 飞机 公司 国 后 火车 家 开车 课 来 里 前 去 商店 上 外 外边 下 现在 学校 医院 在 找 这边 这里 这儿 中国 中文 住 坐",
    meanings: /place|inside|outside|front|back|left|right|near|far|airport|station|hospital|school|store|cinema|company|train|plane|taxi|car|go|come|arrive/i,
    grammarIds: [
      "zai-location",
      "cong-dao-route",
      "li-distance",
      "serial-purpose",
    ],
    dialogue: dialogue("place"),
  },
  {
    key: "health",
    title: "Handle health",
    hanziTitle: "身体健康",
    goal: "Say you are sick and understand basic care advice.",
    description: "Illness, seeing a doctor, rest, and basic needs.",
    words: "病 看病 没事 生病 睡 睡觉 休息 医生 医院",
    meanings: /sick|illness|doctor|hospital|sleep|rest|medicine|pain|comfortable|body/i,
    grammarIds: ["bu-vs-mei", "le-completed"],
    dialogue: dialogue("health"),
  },
  {
    key: "school",
    title: "Learn and ask",
    hanziTitle: "上课学习",
    goal: "Ask a teacher for clarification and talk about study.",
    description: "School, classes, reading, writing, and learning.",
    words: "大学 大学生 电脑 读 读书 汉语 汉字 老师 课 上课 上学 手机 书 书店 写 学 学生 学习 学校 小学 小学生 中学 中学生 字",
    meanings: /learn|study|school|university|class|lesson|teacher|student|book|read|write|Chinese language|character|computer/i,
    grammarIds: [
      "hui-ability",
      "neng-ability",
      "qing-request",
      "keyi-request",
    ],
    dialogue: dialogue("school"),
  },
  {
    key: "activity",
    title: "Plans and activities",
    hanziTitle: "一起活动",
    goal: "Say what you enjoy and make a simple plan.",
    description: "Leisure, media, plans, and everyday activities.",
    words: "唱 电影 电视 歌 好看 好听 好玩儿 开 看 说 说话 听 玩 喜欢 想",
    meanings: /sing|song|movie|television|watch|listen|play|fun|like|want|activity/i,
    grammarIds: ["ba-suggestion", "ye-dou"],
    dialogue: dialogue("activity"),
  },
  {
    key: "weather",
    title: "Weather and comfort",
    hanziTitle: "天气冷热",
    goal: "Describe the weather and say how it feels.",
    description: "Heat, cold, rain, snow, and simple reactions.",
    words: "白天 冷 热 天气 下雨 雪 雨",
    meanings: /weather|rain|snow|hot|cold/i,
    grammarIds: ["hen-adjective", "juede-opinion"],
    dialogue: dialogue("daily"),
  },
  {
    key: "daily",
    title: "Everyday communication",
    hanziTitle: "日常交流",
    goal: "Keep a short everyday exchange moving naturally.",
    description: "Core actions, descriptions, questions, and social language.",
    words: "",
    grammarIds: ["ne-context-question", "zhengzai-progress"],
    dialogue: dialogue("daily"),
  },
];

const LEVEL_2_TOPICS: Topic[] = [
  {
    key: "people",
    title: "Describe people",
    hanziTitle: "人物介绍",
    goal: "Describe appearance, identity, and family relationships.",
    description: "More precise descriptions of people and relationships.",
    words: "爱好 个子 奶奶 男孩儿 女孩儿 妻子 身体 生日 外国 小孩儿 小时候 姓 姓名 眼睛 爷爷 丈夫 自己",
    meanings: /person|family|husband|wife|grand|boy|girl|child|name|surname|height|eye|birthday/i,
    grammarIds: [
      "bi-comparison",
      "juede-opinion",
      "adjective-reduplication",
    ],
    dialogue: dialogue("people"),
  },
  {
    key: "shopping",
    title: "Compare and buy",
    hanziTitle: "比较商品",
    goal: "Compare goods by color, price, and suitability.",
    description: "Colors, clothing, counters, tickets, and choices.",
    words: "白色 包 本子 笔 不错 长 黑色 红色 裤子 绿色 门票 奶茶 票 商场 手表 书包 条 颜色",
    meanings: /color|white|black|red|green|clothes|pants|bag|notebook|pen|ticket|shop|mall|buy/i,
    grammarIds: [
      "bi-comparison",
      "adj-yidianr",
      "de-nominalizer",
      "verb-reduplication",
    ],
    dialogue: dialogue("shopping"),
  },
  {
    key: "place",
    title: "Navigate farther",
    hanziTitle: "交通方向",
    goal: "Navigate transport, buildings, and directional movement.",
    description: "Routes, stations, tickets, floors, and direction complements.",
    words: "车站 出 出国 出来 出门 出去 打车 地铁 飞 高中 公交车 过来 过去 回来 回去 机场 机票 进 进来 进去 近 酒店 离 里面 楼 路 路上 旅游 门口 旁边 前面 上来 上面 上去 外面 往 下来 下面 下去 洗手间 右 右边 远 站 走 走路 左 左边",
    meanings: /station|airport|ticket|subway|bus|hotel|road|inside|outside|front|back|left|right|near|far|enter|exit|come|go|travel/i,
    grammarIds: [
      "cong-dao-route",
      "li-distance",
      "directional-complements",
      "shi-de-emphasis",
    ],
    dialogue: dialogue("place"),
  },
  {
    key: "food",
    title: "Order with detail",
    hanziTitle: "饭馆点餐",
    goal: "Order food and respond to a server’s follow-up.",
    description: "Restaurants, drinks, servings, and preferences.",
    words: "饭馆 红茶 咖啡 绿茶 奶茶 肉 鱼",
    meanings: /food|restaurant|tea|coffee|milk|meat|fish|drink|meal/i,
    grammarIds: ["yao-order", "song-gei"],
    dialogue: dialogue("food"),
  },
  {
    key: "health",
    title: "Explain a health problem",
    hanziTitle: "看病用药",
    goal: "Describe discomfort and respond to practical advice.",
    description: "Symptoms, medicine, comfort, and care.",
    words: "坏 累 没意思 舒服 疼 药 药店",
    meanings: /sick|pain|hurt|medicine|pharmacy|tired|comfortable|body/i,
    grammarIds: [
      "dei-advice",
      "yinwei-suoyi",
      "bie-command",
    ],
    dialogue: dialogue("health"),
  },
  {
    key: "school",
    title: "Study and clarify",
    hanziTitle: "学习考试",
    goal: "Handle classroom instructions and ask what something means.",
    description: "Classes, exams, questions, and learning routines.",
    words: "班 词 懂 高中 告诉 教 教室 开学 考 考试 题",
    meanings: /class|school|teach|study|exam|question|word|understand/i,
    grammarIds: [
      "bu-zhidao-zenme",
      "di-ordinal",
      "zai-repeat",
      "result-complements",
      "de-state-complement",
    ],
    dialogue: dialogue("school"),
  },
  {
    key: "activity",
    title: "Leisure and sport",
    hanziTitle: "运动休闲",
    goal: "Compare activities and arrange one with a friend.",
    description: "Exercise, sport, travel, and leisure plans.",
    words: "篮球 跑 跑步 球 上网 踢 跳舞 网上 游 游泳 运动 足球",
    meanings: /sport|ball|run|dance|swim|internet|travel|exercise|play/i,
    grammarIds: [
      "zui-superlative",
      "hui-ability",
      "ba-suggestion",
      "guo-experience",
    ],
    dialogue: dialogue("activity"),
  },
  {
    key: "time",
    title: "Sequence events",
    hanziTitle: "先后时间",
    goal: "Explain when something happened and what happens next.",
    description: "Frequency, duration, sequence, and completed experience.",
    words: "次 从小 过 过年 经常 开始 快 快要 每 时 有时 已经 一会儿 一起 周 最",
    meanings: /time|often|already|week|hour|begin|finish|soon|together|every|once/i,
    grammarIds: [
      "yijing-completed",
      "zhengzai-progress",
      "zhe-continuing-state",
      "yi-jiu",
    ],
    dialogue: dialogue("time"),
  },
  {
    key: "daily",
    title: "Connect ideas",
    hanziTitle: "表达原因",
    goal: "Give a reason, contrast two facts, and make a suggestion.",
    description: "High-value verbs, complements, connectors, and daily language.",
    words: "",
    grammarIds: [
      "yinwei-suoyi",
      "dei-advice",
      "zui-superlative",
      "haishi-choice",
      "suiran-danshi",
    ],
    dialogue: dialogue("daily"),
  },
];

function normalizedList(source: string): Set<string> {
  return new Set(source.split(/\s+/u).filter(Boolean));
}

function assignTopics(words: HskWord[], topics: Topic[]): Map<string, HskWord[]> {
  const buckets = new Map(topics.map((topic) => [topic.key, [] as HskWord[]]));
  const explicit = topics.map((topic) => ({
    topic,
    words: normalizedList(topic.words),
  }));

  for (const word of words) {
    const match =
      explicit.find((candidate) => candidate.words.has(word.hanzi)) ??
      explicit.find((candidate) => candidate.topic.meanings?.test(word.meaning));
    const topic = match?.topic ?? topics[topics.length - 1];
    buckets.get(topic.key)!.push(word);
  }
  return buckets;
}

function chunks<T>(items: T[], maxSize: number): T[][] {
  if (items.length === 0) return [];
  const count = Math.ceil(items.length / maxSize);
  const base = Math.floor(items.length / count);
  let extra = items.length % count;
  const output: T[][] = [];
  let cursor = 0;
  for (let index = 0; index < count; index += 1) {
    const size = base + (extra-- > 0 ? 1 : 0);
    output.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  return output;
}

function rotate<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return [];
  const start = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function shortMeaning(word: HskWord): string {
  return word.meaning.split(/[;/]/u)[0].trim();
}

function distractors(word: HskWord, pool: HskWord[], offset: number): HskWord[] {
  const candidates = rotate(
    pool.filter(
      (candidate) =>
        candidate.id !== word.id &&
        candidate.hanzi !== word.hanzi &&
        shortMeaning(candidate) !== shortMeaning(word),
    ),
    offset,
  );
  const seenHanzi = new Set<string>();
  const seenMeanings = new Set<string>();
  return candidates
    .filter((candidate) => {
      const meaning = shortMeaning(candidate);
      if (seenHanzi.has(candidate.hanzi) || seenMeanings.has(meaning))
        return false;
      seenHanzi.add(candidate.hanzi);
      seenMeanings.add(meaning);
      return true;
    })
    .slice(0, 3);
}

function choice(
  word: HskWord,
  pool: HskWord[],
  id: string,
  direction: "hanzi-en" | "en-hanzi",
  offset: number,
): ChoiceExercise {
  const other = distractors(word, pool, offset);
  const answer = direction === "hanzi-en" ? shortMeaning(word) : word.hanzi;
  const choices =
    direction === "hanzi-en"
      ? [answer, ...other.map(shortMeaning)]
      : [answer, ...other.map((candidate) => candidate.hanzi)];
  return {
    id,
    kind: "choice",
    direction,
    wordIds: [word.id],
    question: direction === "hanzi-en" ? word.hanzi : shortMeaning(word),
    questionPinyin: direction === "hanzi-en" ? word.pinyin : undefined,
    choices: rotate(choices, offset),
    answer,
    explain: `${word.hanzi} (${word.pinyin}) — ${shortMeaning(word)}`,
  };
}

function listen(
  word: HskWord,
  pool: HskWord[],
  id: string,
  offset: number,
): ListenExercise {
  return {
    id,
    kind: "listen",
    wordIds: [word.id],
    text: word.hanzi,
    pinyin: word.pinyin,
    choices: rotate(
      [
        word.hanzi,
        ...distractors(word, pool, offset).map((candidate) => candidate.hanzi),
      ],
      offset,
    ),
    answer: word.hanzi,
    translation: shortMeaning(word),
    explain: `${word.hanzi} (${word.pinyin}) — ${shortMeaning(word)}`,
  };
}

function match(
  words: HskWord[],
  id: string,
  matchType: "pinyin" | "meaning",
): MatchExercise {
  const duplicateHanzi = new Set(
    words
      .filter(
        (word, index, all) =>
          all.findIndex((candidate) => candidate.hanzi === word.hanzi) !== index,
      )
      .map((word) => word.hanzi),
  );
  const rawMatches = words.map((word) =>
    matchType === "pinyin" ? word.pinyin : shortMeaning(word),
  );
  return {
    id,
    kind: "match",
    matchType,
    wordIds: words.map((word) => word.id),
    pairs: words.map((word) => ({
      hanzi: duplicateHanzi.has(word.hanzi)
        ? `${word.hanzi} · ${shortMeaning(word)} · ${word.syllabusIndex}`
        : word.hanzi,
      match:
        rawMatches.filter(
          (candidate) =>
            candidate ===
            (matchType === "pinyin" ? word.pinyin : shortMeaning(word)),
        ).length > 1
          ? `${matchType === "pinyin" ? word.pinyin : shortMeaning(word)} · ${
              matchType === "pinyin" ? shortMeaning(word) : word.pinyin
            } · ${word.syllabusIndex}`
          : matchType === "pinyin"
            ? word.pinyin
            : shortMeaning(word),
    })),
  };
}

function cloze(word: HskWord, pool: HskWord[], id: string, offset: number): ClozeExercise {
  const other = distractors(word, pool, offset).slice(0, 2);
  return {
    id,
    kind: "cloze",
    wordIds: [word.id],
    sentence: "这是＿。",
    translation: `This is ${shortMeaning(word)}.`,
    choices: rotate([word.hanzi, ...other.map((candidate) => candidate.hanzi)], offset),
    answer: word.hanzi,
    explain: `${word.hanzi} (${word.pinyin}) — ${shortMeaning(word)}`,
  };
}

function order(word: HskWord, id: string): OrderExercise {
  return {
    id,
    kind: "order",
    wordIds: [word.id],
    tiles: ["我", "知道", word.hanzi],
    translation: `I know “${shortMeaning(word)}.”`,
    explain: `${word.hanzi} (${word.pinyin}) — ${shortMeaning(word)}`,
  };
}

function reply(word: HskWord, pool: HskWord[], id: string, offset: number): ReplyExercise {
  const other = distractors(word, pool, offset)[0] ?? word;
  return {
    id,
    kind: "reply",
    wordIds: [word.id],
    scene: `A classmate asks which word means “${shortMeaning(word)}.”`,
    line: { hanzi: `“${shortMeaning(word)}”怎么说？`, pinyin: `“${shortMeaning(word)}” zěnme shuō?` },
    choices: [
      { hanzi: `${word.hanzi}。`, pinyin: `${word.pinyin}.` },
      { hanzi: `是${word.hanzi}。`, pinyin: `Shì ${word.pinyin}.` },
      { hanzi: `${other.hanzi}。`, pinyin: `${other.pinyin}.` },
    ],
    answer: `${word.hanzi}。`,
    answers: [`${word.hanzi}。`, `是${word.hanzi}。`],
    explain: `Both the short answer and 是 + ${word.hanzi} communicate the target word.`,
  };
}

function grammarExercises(
  lessonId: string,
  stageId: string,
  stageWords: HskWord[],
): Exercise[] {
  const lesson = GRAMMAR_LESSONS.find((candidate) => candidate.id === lessonId);
  if (!lesson) return [];
  const focus = lesson.focus ?? lesson.hanzi.split(/[ /／]/u)[0];
  return lesson.examples.flatMap((example, index) => {
    const exercises: Exercise[] = [
      {
        id: `${stageId}-grammar-${lessonId}-order-${index + 1}`,
        kind: "order",
        wordIds: stageWords
          .filter((word) => example.hanzi.includes(word.hanzi))
          .map((word) => word.id),
        tiles: Array.from(example.hanzi.replace(/[，。？！]/gu, "")),
        translation: example.meaning,
        pinyin: example.pinyin,
        explain: lesson.pattern,
      },
    ];
    if (example.hanzi.includes(focus)) {
      exercises.push({
        id: `${stageId}-grammar-${lessonId}-cloze-${index + 1}`,
        kind: "cloze",
        wordIds: stageWords
          .filter((word) => example.hanzi.includes(word.hanzi))
          .map((word) => word.id),
        sentence: example.hanzi.replace(focus, "＿"),
        translation: example.meaning,
        choices: [focus, "的", "了"].filter(
          (item, itemIndex, all) => all.indexOf(item) === itemIndex,
        ),
        answer: focus,
        explain: lesson.summary,
      });
    }
    return exercises;
  });
}

function buildStage(
  level: HskLevel,
  index: number,
  topic: Topic,
  part: number,
  partCount: number,
  words: HskWord[],
  grammarIds: string[],
): Stage {
  const id = `hsk3-l${level}-stage-${String(index).padStart(2, "0")}`;
  const label = partCount > 1 ? ` · ${part}` : "";
  const vocabBlocks: ExerciseBlock[] = chunks(words, 5).flatMap((group, groupIndex) => [
    {
      id: `${id}-forms-${groupIndex + 1}`,
      title: `Word lab ${groupIndex + 1} · form and sound`,
      kind: "vocab",
      exercises: [
        match(group, `${id}-match-meaning-${groupIndex + 1}`, "meaning"),
        match(group, `${id}-match-pinyin-${groupIndex + 1}`, "pinyin"),
        ...group.map((word, wordIndex) =>
          choice(
            word,
            words,
            `${id}-recognize-${groupIndex + 1}-${wordIndex + 1}`,
            wordIndex % 2 === 0 ? "hanzi-en" : "en-hanzi",
            index + wordIndex,
          ),
        ),
      ],
    },
    {
      id: `${id}-context-${groupIndex + 1}`,
      title: `Word lab ${groupIndex + 1} · retrieve and use`,
      kind: "vocab",
      exercises: group.flatMap((word, wordIndex): Exercise[] => {
        const mode = (wordIndex + index) % 3;
        const productive =
          mode === 0
            ? cloze(
                word,
                words,
                `${id}-cloze-${groupIndex + 1}-${wordIndex + 1}`,
                wordIndex,
              )
            : mode === 1
              ? order(
                  word,
                  `${id}-order-${groupIndex + 1}-${wordIndex + 1}`,
                )
              : reply(
                  word,
                  words,
                  `${id}-reply-${groupIndex + 1}-${wordIndex + 1}`,
                  wordIndex,
                );
        return [
          listen(
            word,
            words,
            `${id}-listen-${groupIndex + 1}-${wordIndex + 1}`,
            wordIndex,
          ),
          productive,
        ];
      }),
    },
  ]);

  const grammarBlocks = grammarIds
    .map((grammarId) => ({
      grammarId,
      exercises: grammarExercises(grammarId, id, words),
    }))
    .filter((item) => item.exercises.length > 0)
    .map(({ grammarId, exercises }) => {
      const lesson = GRAMMAR_LESSONS.find((candidate) => candidate.id === grammarId)!;
      return {
        id: `${id}-grammar-${grammarId}`,
        title: `${lesson.hanzi} · ${lesson.title}`,
        kind: "grammar" as const,
        grammarLessonId: grammarId,
        exercises,
      };
    });

  const checkpoint = words.slice(0, 10).map((word, wordIndex): Exercise => {
    const mode = (wordIndex + index) % 6;
    if (mode === 0)
      return listen(word, words, `${id}-checkpoint-${wordIndex + 1}`, wordIndex);
    if (mode === 1)
      return cloze(word, words, `${id}-checkpoint-${wordIndex + 1}`, wordIndex);
    if (mode === 2)
      return order(word, `${id}-checkpoint-${wordIndex + 1}`);
    if (mode === 3)
      return reply(word, words, `${id}-checkpoint-${wordIndex + 1}`, wordIndex);
    return choice(
      word,
      words,
      `${id}-checkpoint-${wordIndex + 1}`,
      mode === 4 ? "hanzi-en" : "en-hanzi",
      wordIndex,
    );
  });

  return {
    id,
    level,
    index,
    title: `${topic.title}${label}`,
    hanziTitle: topic.hanziTitle,
    scenario: topic.description,
    description: `${topic.description} Learn the new HSK 3.0 words before opening the conversation.`,
    estimatedMinutes: 12,
    goal: topic.goal,
    wordIds: words.map((word) => word.id),
    grammarLessonIds: grammarIds,
    dialogue: topic.dialogue,
    teach: words.map((word) => ({ wordId: word.id })),
    blocks: [...vocabBlocks, ...grammarBlocks],
    checkpoint,
  };
}

function buildLevel(level: HskLevel, words: HskWord[], topics: Topic[]): Stage[] {
  const buckets = assignTopics(words, topics);
  const stages: Stage[] = [];
  let stageIndex = 1;
  for (const topic of topics) {
    const groups = chunks(buckets.get(topic.key) ?? [], 10);
    groups.forEach((group, partIndex) => {
      const grammarIds =
        partIndex === 0
          ? topic.grammarIds.filter((grammarId) =>
              GRAMMAR_LESSONS.some((lesson) => lesson.id === grammarId),
            )
          : [];
      stages.push(
        buildStage(
          level,
          stageIndex++,
          topic,
          partIndex + 1,
          groups.length,
          group,
          grammarIds,
        ),
      );
    });
  }
  return stages;
}

export const HSK3_LEVEL_1_STAGES = buildLevel(1, HSK1, LEVEL_1_TOPICS);
export const HSK3_LEVEL_2_STAGES = buildLevel(2, HSK2, LEVEL_2_TOPICS);
