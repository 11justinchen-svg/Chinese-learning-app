import { STAGES } from "@/lib/data/stages";
import type {
  ChoiceExercise,
  ClozeExercise,
  DialogueLine,
  Exercise,
  ListenExercise,
  MatchExercise,
} from "@/lib/data/stages/types";
import { findWord, HSK, type HskWord } from "@/lib/hsk";

export type HanziTopicId =
  | "shopping"
  | "small-talk"
  | "food"
  | "getting-around"
  | "hotel";

export interface HanziTopicSet {
  id: HanziTopicId;
  title: string;
  hanziTitle: string;
  description: string;
  goal: string;
  wordIds: string[];
  scenarioId?: string;
}

export const HANZI_TOPIC_SETS: HanziTopicSet[] = [
  {
    id: "shopping",
    title: "Shopping",
    hanziTitle: "买东西",
    description: "Point, ask the price, choose a color, and buy it.",
    goal: "Handle a short shop exchange",
    scenarioId: "shopkeeper",
    wordIds: [
      "hsk1-142",
      "hsk1-062",
      "hsk2-066",
      "hsk1-089",
      "hsk1-020",
      "hsk1-025",
      "hsk1-081",
      "hsk1-052",
      "hsk1-132",
      "hsk2-045",
      "hsk2-116",
      "hsk2-040",
      "hsk2-002",
      "hsk2-039",
      "hsk2-007",
      "hsk2-034",
      "hsk2-120",
      "hsk2-030",
      "hsk2-138",
    ],
  },
  {
    id: "small-talk",
    title: "Small talk",
    hanziTitle: "聊一聊",
    description: "Meet someone, exchange names, and talk about today.",
    goal: "Keep a friendly first conversation moving",
    scenarioId: "teacher",
    wordIds: [
      "hsk1-073",
      "hsk1-036",
      "hsk1-046",
      "hsk1-067",
      "hsk1-086",
      "hsk1-031",
      "hsk1-076",
      "hsk1-047",
      "hsk1-108",
      "hsk1-033",
      "hsk2-068",
      "hsk1-115",
      "hsk1-045",
      "hsk1-069",
      "hsk1-141",
      "hsk2-041",
      "hsk2-047",
      "hsk1-102",
    ],
  },
  {
    id: "food",
    title: "Food and drink",
    hanziTitle: "吃什么",
    description: "Read a simple menu, order, and respond to the waiter.",
    goal: "Order a drink and a meal",
    scenarioId: "waiter",
    wordIds: [
      "hsk1-011",
      "hsk1-037",
      "hsk1-010",
      "hsk1-099",
      "hsk1-066",
      "hsk1-009",
      "hsk1-028",
      "hsk2-026",
      "hsk2-053",
      "hsk2-037",
      "hsk2-044",
      "hsk1-100",
      "hsk1-004",
      "hsk2-120",
    ],
  },
  {
    id: "getting-around",
    title: "Getting around",
    hanziTitle: "怎么去",
    description: "Name a destination, recognize transport, and ask where to go.",
    goal: "Reach the right place",
    scenarioId: "taxi-driver",
    wordIds: [
      "hsk1-083",
      "hsk1-053",
      "hsk1-012",
      "hsk1-043",
      "hsk2-043",
      "hsk2-031",
      "hsk2-078",
      "hsk2-064",
      "hsk1-080",
      "hsk1-040",
      "hsk2-019",
      "hsk2-131",
      "hsk2-049",
      "hsk1-069",
    ],
  },
  {
    id: "hotel",
    title: "Hotel check-in",
    hanziTitle: "住饭店",
    description: "Give your name, say how long you will stay, and find your room.",
    goal: "Complete a basic hotel check-in",
    scenarioId: "hotel-clerk",
    wordIds: [
      "hsk1-028",
      "hsk2-024",
      "hsk2-113",
      "hsk1-067",
      "hsk1-145",
      "hsk1-044",
      "hsk1-142",
      "hsk1-119",
      "hsk1-123",
      "hsk2-041",
      "hsk2-030",
      "hsk2-049",
    ],
  },
];

const AUTHORED_USE_EXAMPLES: Record<string, DialogueLine> = {
  "hsk2-002": { speaker: "A", hanzi: "这件衣服是白的。", pinyin: "Zhè jiàn yīfu shì bái de.", english: "This piece of clothing is white." },
  "hsk2-005": { speaker: "A", hanzi: "我在看报纸。", pinyin: "Wǒ zài kàn bàozhǐ.", english: "I am reading the newspaper." },
  "hsk2-009": { speaker: "A", hanzi: "她喜欢唱歌。", pinyin: "Tā xǐhuan chànggē.", english: "She likes singing." },
  "hsk2-010": { speaker: "A", hanzi: "我们出去吧。", pinyin: "Wǒmen chūqù ba.", english: "Let us go out." },
  "hsk2-012": { speaker: "A", hanzi: "我们坐船去。", pinyin: "Wǒmen zuò chuán qù.", english: "We are going by boat." },
  "hsk2-021": { speaker: "A", hanzi: "我弟弟十岁。", pinyin: "Wǒ dìdi shí suì.", english: "My younger brother is ten." },
  "hsk2-028": { speaker: "A", hanzi: "请告诉我。", pinyin: "Qǐng gàosu wǒ.", english: "Please tell me." },
  "hsk2-032": { speaker: "A", hanzi: "我要一公斤苹果。", pinyin: "Wǒ yào yì gōngjīn píngguǒ.", english: "I want one kilogram of apples." },
  "hsk2-035": { speaker: "A", hanzi: "我还想喝茶。", pinyin: "Wǒ hái xiǎng hē chá.", english: "I also want tea." },
  "hsk2-038": { speaker: "A", hanzi: "今天是三号。", pinyin: "Jīntiān shì sān hào.", english: "Today is the third." },
  "hsk2-046": { speaker: "A", hanzi: "老师在教室里。", pinyin: "Lǎoshī zài jiàoshì lǐ.", english: "The teacher is in the classroom." },
  "hsk2-047": { speaker: "A", hanzi: "我介绍朋友。", pinyin: "Wǒ jièshào péngyou.", english: "I am introducing a friend." },
  "hsk2-048": { speaker: "A", hanzi: "我姐姐是医生。", pinyin: "Wǒ jiějie shì yīshēng.", english: "My older sister is a doctor." },
  "hsk2-049": { speaker: "A", hanzi: "商店很近。", pinyin: "Shāngdiàn hěn jìn.", english: "The store is close." },
  "hsk2-050": { speaker: "A", hanzi: "请进。", pinyin: "Qǐng jìn.", english: "Please come in." },
  "hsk2-051": { speaker: "A", hanzi: "我现在就去。", pinyin: "Wǒ xiànzài jiù qù.", english: "I will go right now." },
  "hsk2-054": { speaker: "A", hanzi: "我们开始吧。", pinyin: "Wǒmen kāishǐ ba.", english: "Let us begin." },
  "hsk2-056": { speaker: "A", hanzi: "明天可能下雨。", pinyin: "Míngtiān kěnéng xiàyǔ.", english: "It may rain tomorrow." },
  "hsk2-058": { speaker: "A", hanzi: "我们有汉语课。", pinyin: "Wǒmen yǒu Hànyǔ kè.", english: "We have Chinese class." },
  "hsk2-059": { speaker: "A", hanzi: "他走得很快。", pinyin: "Tā zǒu de hěn kuài.", english: "He walks quickly." },
  "hsk2-062": { speaker: "A", hanzi: "商店离家很近。", pinyin: "Shāngdiàn lí jiā hěn jìn.", english: "The store is close to home." },
  "hsk2-063": { speaker: "A", hanzi: "我要两个苹果。", pinyin: "Wǒ yào liǎng ge píngguǒ.", english: "I want two apples." },
  "hsk2-064": { speaker: "A", hanzi: "路很长。", pinyin: "Lù hěn cháng.", english: "The road is long." },
  "hsk2-065": { speaker: "A", hanzi: "我想去中国旅游。", pinyin: "Wǒ xiǎng qù Zhōngguó lǚyóu.", english: "I want to travel to China." },
  "hsk2-066": { speaker: "A", hanzi: "商店卖水果。", pinyin: "Shāngdiàn mài shuǐguǒ.", english: "The store sells fruit." },
  "hsk2-067": { speaker: "A", hanzi: "请说慢一点。", pinyin: "Qǐng shuō màn yìdiǎn.", english: "Please speak a little slower." },
  "hsk2-068": { speaker: "A", hanzi: "我今天很忙。", pinyin: "Wǒ jīntiān hěn máng.", english: "I am busy today." },
  "hsk2-069": { speaker: "A", hanzi: "我每天学习汉语。", pinyin: "Wǒ měitiān xuéxí Hànyǔ.", english: "I study Chinese every day." },
  "hsk2-071": { speaker: "A", hanzi: "门开着。", pinyin: "Mén kāi zhe.", english: "The door is open." },
  "hsk2-076": { speaker: "A", hanzi: "商店在饭馆旁边。", pinyin: "Shāngdiàn zài fànguǎn pángbiān.", english: "The store is beside the restaurant." },
  "hsk2-081": { speaker: "A", hanzi: "一千块钱。", pinyin: "Yì qiān kuài qián.", english: "One thousand yuan." },
  "hsk2-083": { speaker: "A", hanzi: "我去年去北京了。", pinyin: "Wǒ qùnián qù Běijīng le.", english: "I went to Beijing last year." },
  "hsk2-084": { speaker: "A", hanzi: "让我看看。", pinyin: "Ràng wǒ kànkan.", english: "Let me take a look." },
  "hsk2-089": { speaker: "A", hanzi: "我没有时间。", pinyin: "Wǒ méiyǒu shíjiān.", english: "I do not have time." },
  "hsk2-091": { speaker: "A", hanzi: "这是我的手表。", pinyin: "Zhè shì wǒ de shǒubiǎo.", english: "This is my watch." },
  "hsk2-094": { speaker: "A", hanzi: "下雨了，所以我没去。", pinyin: "Xiàyǔ le, suǒyǐ wǒ méi qù.", english: "It rained, so I did not go." },
  "hsk2-095": { speaker: "A", hanzi: "它在桌子下面。", pinyin: "Tā zài zhuōzi xiàmiàn.", english: "It is under the table." },
  "hsk2-098": { speaker: "A", hanzi: "她会跳舞。", pinyin: "Tā huì tiàowǔ.", english: "She can dance." },
  "hsk2-099": { speaker: "A", hanzi: "他在门外。", pinyin: "Tā zài mén wài.", english: "He is outside the door." },
  "hsk2-101": { speaker: "A", hanzi: "我们一起玩吧。", pinyin: "Wǒmen yìqǐ wán ba.", english: "Let us play together." },
  "hsk2-102": { speaker: "A", hanzi: "我晚上看电影。", pinyin: "Wǒ wǎnshang kàn diànyǐng.", english: "I watch a movie in the evening." },
  "hsk2-107": { speaker: "A", hanzi: "我在洗衣服。", pinyin: "Wǒ zài xǐ yīfu.", english: "I am washing clothes." },
  "hsk2-109": { speaker: "A", hanzi: "向商店走。", pinyin: "Xiàng shāngdiàn zǒu.", english: "Walk toward the store." },
  "hsk2-110": { speaker: "A", hanzi: "我学习了两个小时。", pinyin: "Wǒ xuéxí le liǎng ge xiǎoshí.", english: "I studied for two hours." },
  "hsk2-116": { speaker: "A", hanzi: "你喜欢什么颜色？", pinyin: "Nǐ xǐhuan shénme yánsè?", english: "What color do you like?" },
  "hsk2-118": { speaker: "A", hanzi: "我想吃羊肉。", pinyin: "Wǒ xiǎng chī yángròu.", english: "I would like to eat lamb." },
  "hsk2-126": { speaker: "A", hanzi: "今天是阴天。", pinyin: "Jīntiān shì yīntiān.", english: "Today is overcast." },
  "hsk2-128": { speaker: "A", hanzi: "商店在右边。", pinyin: "Shāngdiàn zài yòubian.", english: "The store is on the right." },
  "hsk2-129": { speaker: "A", hanzi: "我喜欢吃鱼。", pinyin: "Wǒ xǐhuan chī yú.", english: "I like eating fish." },
  "hsk2-133": { speaker: "A", hanzi: "我明天再来。", pinyin: "Wǒ míngtiān zài lái.", english: "I will come again tomorrow." },
  "hsk2-135": { speaker: "A", hanzi: "我要一张票。", pinyin: "Wǒ yào yì zhāng piào.", english: "I want one ticket." },
  "hsk2-136": { speaker: "A", hanzi: "路很长。", pinyin: "Lù hěn cháng.", english: "The road is long." },
  "hsk2-137": { speaker: "A", hanzi: "她丈夫是医生。", pinyin: "Tā zhàngfu shì yīshēng.", english: "Her husband is a doctor." },
  "hsk2-139": { speaker: "A", hanzi: "门开着。", pinyin: "Mén kāi zhe.", english: "The door is open." },
  "hsk2-144": { speaker: "A", hanzi: "这是我的自行车。", pinyin: "Zhè shì wǒ de zìxíngchē.", english: "This is my bicycle." },
};

export function findHanziTopic(id: string): HanziTopicSet | undefined {
  return HANZI_TOPIC_SETS.find((topic) => topic.id === id);
}

export function wordsForTopic(topic: HanziTopicSet): HskWord[] {
  return topic.wordIds.map(findWord).filter((word): word is HskWord => Boolean(word));
}

function shortMeaning(word: HskWord): string {
  return word.meaning.split(";")[0].trim();
}

function sampleWords(wordIds: string[], seed: number, count: number): HskWord[] {
  const pool = wordIds.map(findWord).filter((word): word is HskWord => Boolean(word));
  if (pool.length === 0) return [];
  const start = (seed * 17) % pool.length;
  return Array.from(
    { length: Math.min(count, pool.length) },
    (_, index) => pool[(start + index) % pool.length],
  );
}

function distractors(word: HskWord, value: (candidate: HskWord) => string): string[] {
  const answer = value(word);
  const result: string[] = [];
  const start = HSK.findIndex((candidate) => candidate.id === word.id);
  for (let offset = 1; result.length < 3; offset += 1) {
    const candidate = HSK[(start + offset * 19) % HSK.length];
    const candidateValue = value(candidate);
    if (candidateValue !== answer && !result.includes(candidateValue)) result.push(candidateValue);
  }
  return result;
}

function meaningDistractors(word: HskWord): string[] {
  const targetSenses = new Set(
    word.meaning.toLowerCase().split(";").map((sense) => sense.trim()),
  );
  const result: string[] = [];
  const start = HSK.findIndex((candidate) => candidate.id === word.id);
  for (let offset = 1; result.length < 3; offset += 1) {
    const candidate = HSK[(start + offset * 19) % HSK.length];
    const candidateSenses = candidate.meaning
      .toLowerCase()
      .split(";")
      .map((sense) => sense.trim());
    const value = shortMeaning(candidate);
    if (
      !candidateSenses.some((sense) => targetSenses.has(sense)) &&
      value !== shortMeaning(word) &&
      !result.includes(value)
    )
      result.push(value);
  }
  return result;
}

function meaningExercise(word: HskWord, id: string): ChoiceExercise {
  const answer = shortMeaning(word);
  return {
    id,
    kind: "choice",
    direction: "hanzi-en",
    wordIds: [word.id],
    question: word.hanzi,
    choices: [answer, ...meaningDistractors(word)],
    answer,
    explain: `${word.hanzi} (${word.pinyin}): ${answer}`,
  };
}

function formExercise(word: HskWord, id: string): ChoiceExercise {
  return {
    id,
    kind: "choice",
    direction: "en-hanzi",
    wordIds: [word.id],
    question: shortMeaning(word),
    choices: [word.hanzi, ...distractors(word, (candidate) => candidate.hanzi)],
    answer: word.hanzi,
    explain: `${word.hanzi} (${word.pinyin}): ${shortMeaning(word)}`,
  };
}

function soundExercise(word: HskWord, id: string): ListenExercise {
  return {
    id,
    kind: "listen",
    wordIds: [word.id],
    text: word.hanzi,
    pinyin: word.pinyin,
    choices: [word.hanzi, ...distractors(word, (candidate) => candidate.hanzi)],
    answer: word.hanzi,
    translation: shortMeaning(word),
    explain: `${word.hanzi} (${word.pinyin}): ${shortMeaning(word)}`,
  };
}

function contextualExercise(wordId: string, id: string): Exercise | null {
  const exercise = STAGES.flatMap((stage) => [
    ...stage.blocks.flatMap((block) => block.exercises),
    ...stage.checkpoint,
  ]).find(
    (candidate) =>
      candidate.wordIds.includes(wordId) &&
      ["cloze", "order", "reply"].includes(candidate.kind),
  );
  if (exercise) return { ...exercise, id, wordIds: [wordId] };

  const word = findWord(wordId);
  const owner = STAGES.find((stage) => stage.wordIds.includes(wordId));
  const ownerLines = owner
    ? [
        ...owner.dialogue,
        ...owner.teach.flatMap((card) => (card.example ? [card.example] : [])),
      ]
    : [];
  const line =
    (word && ownerLines.find((candidate) => candidate.hanzi.includes(word.hanzi))) ??
    AUTHORED_USE_EXAMPLES[wordId];
  if (!word || !line) return null;
  const cloze: ClozeExercise = {
    id,
    kind: "cloze",
    wordIds: [wordId],
    sentence: line.hanzi.replace(word.hanzi, "＿"),
    translation: line.english,
    choices: [word.hanzi, ...distractors(word, (candidate) => candidate.hanzi)],
    answer: word.hanzi,
    explain: `${line.hanzi} (${line.pinyin})`,
  };
  return cloze;
}

function matchExercise(words: HskWord[], id: string): MatchExercise {
  return {
    id,
    kind: "match",
    matchType: "pinyin",
    wordIds: words.map((word) => word.id),
    pairs: words.map((word) => ({ hanzi: word.hanzi, match: word.pinyin })),
    explain: "Connect each written form to its sound.",
  };
}

export function makeHanziWordTest(wordId: string, seed: number): Exercise[] {
  const word = findWord(wordId);
  if (!word) return [];
  const prefix = `hanzi-word-${word.id}-${seed}`;
  const contextual = contextualExercise(word.id, `${prefix}-use`);
  return [
    meaningExercise(word, `${prefix}-meaning`),
    formExercise(word, `${prefix}-form`),
    soundExercise(word, `${prefix}-sound`),
    ...(contextual ? [contextual] : []),
  ];
}

export function makeHanziSetTest(
  wordIds: string[],
  seed: number,
  count = 6,
): Exercise[] {
  const words = sampleWords(wordIds, seed, count);
  if (words.length === 1) return makeHanziWordTest(words[0].id, seed);
  if (words.length === 2)
    return words.flatMap((word, index) =>
      makeHanziWordTest(word.id, seed * 10 + index),
    );
  const prefix = `hanzi-set-${seed}`;
  const exercises: Exercise[] = words.map((word, index) => {
    if (index % 3 === 0) return meaningExercise(word, `${prefix}-${index}-meaning`);
    if (index % 3 === 1) return formExercise(word, `${prefix}-${index}-form`);
    return soundExercise(word, `${prefix}-${index}-sound`);
  });
  const useWord = words.find((word) => contextualExercise(word.id, "probe"));
  if (useWord) {
    const use = contextualExercise(useWord.id, `${prefix}-use`);
    if (use) exercises.push(use);
  }
  if (words.length >= 3)
    exercises.push(matchExercise(words.slice(0, Math.min(5, words.length)), `${prefix}-match`));
  return exercises;
}
