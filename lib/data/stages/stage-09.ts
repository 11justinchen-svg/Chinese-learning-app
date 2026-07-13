import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildAuthoredVocabulary } from "./authored-content";
import type { ExerciseBlock, Stage } from "./types";

const vocab = buildAuthoredVocabulary(9, STAGE_WORD_IDS[9], {
  "hsk1-108": { note: "天气 means weather; ask 天气怎么样 for a general report.", example: { hanzi: "今天天气怎么样？", pinyin: "Jīntiān tiānqì zěnmeyàng?", english: "How is the weather today?" } },
  "hsk1-118": { note: "下雨 is to rain; 下 is the verb here.", example: { hanzi: "今天下雨。", pinyin: "Jīntiān xiàyǔ.", english: "It is raining today." } },
  "hsk1-056": { note: "冷 means cold; use 很, not 是, in a neutral description.", example: { hanzi: "今天很冷。", pinyin: "Jīntiān hěn lěng.", english: "It is cold today." } },
  "hsk1-084": { note: "热 means hot, the opposite of 冷.", example: { hanzi: "北京很热。", pinyin: "Běijīng hěn rè.", english: "Beijing is hot." } },
  "hsk1-039": { note: "很 links a noun to an adjective in a neutral description; it need not mean very.", example: { hanzi: "今天天气很好。", pinyin: "Jīntiān tiānqì hěn hǎo.", english: "The weather is nice today." } },
  "hsk1-031": { note: "高兴 means happy or glad; 很高兴 is a standard reaction on meeting.", example: { hanzi: "认识你很高兴。", pinyin: "Rènshi nǐ hěn gāoxìng.", english: "Nice to meet you." } },
  "hsk1-071": { note: "呢 can return a question to the other person: 你呢？ And you?", example: { hanzi: "我很好，你呢？", pinyin: "Wǒ hěn hǎo, nǐ ne?", english: "I'm well; how about you?" } },
  "hsk1-086": { note: "认识 means to know or become acquainted with a person.", example: { hanzi: "我认识王明先生。", pinyin: "Wǒ rènshi Wáng Míng xiānsheng.", english: "I know Mr. Wang Ming." } },
  "hsk1-119": { note: "先生 follows a name as Mr.; it can also politely mean sir.", example: { hanzi: "王明先生，你好！", pinyin: "Wáng Míng xiānsheng, nǐ hǎo!", english: "Hello, Mr. Wang!" } },
  "hsk1-123": { note: "小姐 follows a name as Miss; usage varies by region and setting.", example: { hanzi: "李华小姐，你好！", pinyin: "Lǐ Huá xiǎojiě, nǐ hǎo!", english: "Hello, Miss Li!" } },
  "hsk1-005": { note: "北京 is Beijing; the second syllable has third tone.", example: { hanzi: "我住在北京。", pinyin: "Wǒ zhù zài Běijīng.", english: "I live in Beijing." } },
  "hsk1-143": { note: "中国 is China; 中国人 means a Chinese person.", example: { hanzi: "他是中国人。", pinyin: "Tā shì Zhōngguó rén.", english: "He is Chinese." } },
  "hsk1-023": { note: "对不起 is the standard apology or excuse me.", example: { hanzi: "对不起！", pinyin: "Duìbuqǐ!", english: "I'm sorry!" } },
  "hsk1-065": { note: "没关系 answers an apology: it is okay / no problem.", example: { hanzi: "没关系。", pinyin: "Méi guānxi.", english: "It is okay." } },
  "hsk1-008": { note: "不客气 answers thanks: you're welcome.", example: { hanzi: "不客气！", pinyin: "Bú kèqi!", english: "You're welcome!" } },
});

const grammar: ExerciseBlock = {
  id: "s9-grammar-hen-adjective", title: "Describe without 是 · 很 + adjective", kind: "grammar", grammarLessonId: "hen-adjective",
  exercises: [
    { id: "s9-g-hen-adjective-order-0", kind: "order", wordIds: ["hsk1-039", "hsk1-056", "hsk1-108"], tiles: ["今天", "天气", "很", "冷"], translation: "The weather is cold today.", pinyin: "Jīntiān tiānqì hěn lěng." },
    { id: "s9-g-hen-adjective-cloze-0", kind: "cloze", wordIds: ["hsk1-039", "hsk1-084"], sentence: "北京＿热。", translation: "Beijing is hot.", choices: ["很", "是", "有"], answer: "很", explain: "A neutral adjective predicate uses 很, not 是." },
    { id: "s9-g-hen-adjective-order-1", kind: "order", wordIds: ["hsk1-039", "hsk1-031", "hsk1-086"], tiles: ["认识", "你", "很", "高兴"], translation: "Nice to meet you.", pinyin: "Rènshi nǐ hěn gāoxìng." },
    { id: "s9-g-hen-adjective-reply-0", kind: "reply", wordIds: ["hsk1-108", "hsk1-039", "hsk1-056"], scene: "Someone asks about today's weather. Say it is cold.", line: { hanzi: "今天天气怎么样？", pinyin: "Jīntiān tiānqì zěnmeyàng?" }, choices: [{ hanzi: "今天天气很冷。", pinyin: "Jīntiān tiānqì hěn lěng." }, { hanzi: "今天天气是冷。", pinyin: "Jīntiān tiānqì shì lěng." }, { hanzi: "今天有冷。", pinyin: "Jīntiān yǒu lěng." }], answer: "今天天气很冷。", explain: "Use weather + 很 + adjective, without 是." },
    { id: "s9-g-hen-adjective-reply-1", kind: "reply", wordIds: ["hsk1-086", "hsk1-039", "hsk1-031"], scene: "You are introduced to a new person. Respond that you are glad to meet them.", line: { hanzi: "你好！我叫王明。", pinyin: "Nǐ hǎo! Wǒ jiào Wáng Míng." }, choices: [{ hanzi: "认识你很高兴。", pinyin: "Rènshi nǐ hěn gāoxìng." }, { hanzi: "我是高兴。", pinyin: "Wǒ shì gāoxìng." }, { hanzi: "天气下雨。", pinyin: "Tiānqì xiàyǔ." }], answer: "认识你很高兴。", explain: "This set phrase uses 很高兴 and completes the social goal." },
  ],
};

export const stage09: Stage = {
  id: "hsk1-stage-09", index: 9, title: "Weather & small talk", hanziTitle: "聊天", scenario: "Meeting someone in Beijing and making polite small talk.",
  description: "Talk about weather, introduce people politely, and use the right response to apologies and thanks.", wordIds: STAGE_WORD_IDS[9], grammarLessonIds: STAGE_GRAMMAR[9],
  dialogue: [
    { speaker: "李华", hanzi: "王明先生，你好！", pinyin: "Wáng Míng xiānsheng, nǐ hǎo!", english: "Hello, Mr. Wang!" },
    { speaker: "王明", hanzi: "李华小姐，你好！认识你很高兴。", pinyin: "Lǐ Huá xiǎojiě, nǐ hǎo! Rènshi nǐ hěn gāoxìng.", english: "Hello, Miss Li! Nice to meet you." },
    { speaker: "李华", hanzi: "今天天气怎么样？", pinyin: "Jīntiān tiānqì zěnmeyàng?", english: "How is the weather today?" },
    { speaker: "王明", hanzi: "北京很热。你呢？", pinyin: "Běijīng hěn rè. Nǐ ne?", english: "Beijing is hot. How about you?" },
    { speaker: "李华", hanzi: "我很高兴，今天不冷。", pinyin: "Wǒ hěn gāoxìng, jīntiān bù lěng.", english: "I'm happy; it isn't cold today." },
    { speaker: "王明", hanzi: "对不起，明天下雨。", pinyin: "Duìbuqǐ, míngtiān xiàyǔ.", english: "Sorry, it will rain tomorrow." },
    { speaker: "李华", hanzi: "没关系。谢谢你。", pinyin: "Méi guānxi. Xièxie nǐ.", english: "No problem. Thank you." },
    { speaker: "王明", hanzi: "不客气！", pinyin: "Bú kèqi!", english: "You're welcome!" },
  ], teach: vocab.teach, blocks: [...vocab.blocks, grammar],
  checkpoint: [
    { id: "s9-check-0", kind: "choice", direction: "hanzi-en", wordIds: ["hsk1-118"], question: "下雨", questionPinyin: "xiàyǔ", choices: ["rain", "weather", "cold", "hot"], answer: "rain" },
    { id: "s9-check-1", kind: "listen", wordIds: ["hsk1-065"], text: "没关系", pinyin: "méi guānxi", choices: ["没关系", "对不起", "不客气", "高兴"], answer: "没关系", translation: "no problem" },
    { id: "s9-check-2", kind: "match", matchType: "meaning", wordIds: ["hsk1-023", "hsk1-065", "hsk1-008", "hsk1-031"], pairs: [{ hanzi: "对不起", match: "sorry" }, { hanzi: "没关系", match: "no problem" }, { hanzi: "不客气", match: "you're welcome" }, { hanzi: "高兴", match: "happy" }] },
    { id: "s9-check-3", kind: "cloze", wordIds: ["hsk1-039", "hsk1-084"], sentence: "北京＿热。", translation: "Beijing is hot.", choices: ["很", "是", "有"], answer: "很" },
    { id: "s9-check-4", kind: "order", wordIds: ["hsk1-086", "hsk1-039", "hsk1-031"], tiles: ["认识", "你", "很", "高兴"], translation: "Nice to meet you.", pinyin: "Rènshi nǐ hěn gāoxìng." },
    { id: "s9-check-5", kind: "reply", wordIds: ["hsk1-065", "hsk1-023"], scene: "Someone apologizes. Reassure them.", line: { hanzi: "对不起！", pinyin: "Duìbuqǐ!" }, choices: [{ hanzi: "没关系。", pinyin: "Méi guānxi." }, { hanzi: "不客气。", pinyin: "Bú kèqi." }, { hanzi: "很冷。", pinyin: "Hěn lěng." }], answer: "没关系。" },
    { id: "s9-check-6", kind: "choice", direction: "en-hanzi", wordIds: ["hsk1-143"], question: "China", choices: ["中国", "北京", "天气", "先生"], answer: "中国" },
    { id: "s9-check-7", kind: "reply", wordIds: ["hsk1-108", "hsk1-039", "hsk1-056"], scene: "Say the weather is cold.", line: { hanzi: "今天天气怎么样？", pinyin: "Jīntiān tiānqì zěnmeyàng?" }, choices: [{ hanzi: "今天天气很冷。", pinyin: "Jīntiān tiānqì hěn lěng." }, { hanzi: "天气是冷。", pinyin: "Tiānqì shì lěng." }, { hanzi: "天气有冷。", pinyin: "Tiānqì yǒu lěng." }], answer: "今天天气很冷。" },
  ],
};
