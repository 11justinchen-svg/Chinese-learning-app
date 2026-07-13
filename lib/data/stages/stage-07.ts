import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildAuthoredVocabulary } from "./authored-content";
import type { ExerciseBlock, Stage } from "./types";

const vocab = buildAuthoredVocabulary(7, STAGE_WORD_IDS[7], {
  "hsk1-139": { note: "在 locates a person or thing; 在 + place also goes before an action.", example: { hanzi: "我在学校。", pinyin: "Wǒ zài xuéxiào.", english: "I am at school." } },
  "hsk1-057": { note: "里 means inside; place it after the container noun.", example: { hanzi: "我在家里。", pinyin: "Wǒ zài jiālǐ.", english: "I am at home." } },
  "hsk1-080": { note: "前面 means in front; place it after the reference place.", example: { hanzi: "商店在学校前面。", pinyin: "Shāngdiàn zài xuéxiào qiánmiàn.", english: "The store is in front of the school." } },
  "hsk1-040": { note: "后面 means behind or at the back.", example: { hanzi: "我家在学校后面。", pinyin: "Wǒ jiā zài xuéxiào hòumian.", english: "My home is behind the school." } },
  "hsk1-069": { note: "哪 asks which; 哪儿 asks where.", example: { hanzi: "你在哪儿？", pinyin: "Nǐ zài nǎr?", english: "Where are you?" } },
  "hsk1-083": { note: "去 means to go, moving away from the speaker.", example: { hanzi: "我去学校。", pinyin: "Wǒ qù xuéxiào.", english: "I am going to school." } },
  "hsk1-053": { note: "来 means to come, moving toward the speaker.", example: { hanzi: "请来我家。", pinyin: "Qǐng lái wǒ jiā.", english: "Please come to my home." } },
  "hsk1-041": { note: "回 means to return; 回家 is go home.", example: { hanzi: "我下午回家。", pinyin: "Wǒ xiàwǔ huí jiā.", english: "I go home in the afternoon." } },
  "hsk1-149": { note: "坐 means to sit or to travel by a vehicle.", example: { hanzi: "我坐出租车去。", pinyin: "Wǒ zuò chūzūchē qù.", english: "I go by taxi." } },
  "hsk1-145": { note: "住 means to live or stay somewhere; follow it with 在 + place.", example: { hanzi: "我住在学校后面。", pinyin: "Wǒ zhù zài xuéxiào hòumian.", english: "I live behind the school." } },
  "hsk1-033": { note: "工作 is to work or a job; 在 + place comes before it.", example: { hanzi: "我在学校工作。", pinyin: "Wǒ zài xuéxiào gōngzuò.", english: "I work at a school." } },
  "hsk1-140": { note: "怎么 asks how or by what method.", example: { hanzi: "你怎么去？", pinyin: "Nǐ zěnme qù?", english: "How are you going?" } },
  "hsk1-043": { note: "火车站 is a train station.", example: { hanzi: "火车站在哪儿？", pinyin: "Huǒchēzhàn zài nǎr?", english: "Where is the train station?" } },
  "hsk1-012": { note: "出租车 is a taxi; use 坐 before it for travel.", example: { hanzi: "我坐出租车回家。", pinyin: "Wǒ zuò chūzūchē huí jiā.", english: "I take a taxi home." } },
  "hsk1-029": { note: "飞机 is an airplane; 坐飞机 means travel by air.", example: { hanzi: "他坐飞机来。", pinyin: "Tā zuò fēijī lái.", english: "He comes by plane." } },
  "hsk1-130": { note: "学校 is school; it can be a destination or location.", example: { hanzi: "学生在学校。", pinyin: "Xuésheng zài xuéxiào.", english: "The students are at school." } },
});

const grammar: ExerciseBlock = {
  id: "s7-grammar-zai-location", title: "Locate and move · 在", kind: "grammar", grammarLessonId: "zai-location",
  exercises: [
    { id: "s7-g-zai-location-order-0", kind: "order", wordIds: ["hsk1-139", "hsk1-130", "hsk1-033"], tiles: ["我", "在", "学校", "工作"], translation: "I work at school.", pinyin: "Wǒ zài xuéxiào gōngzuò." },
    { id: "s7-g-zai-location-cloze-0", kind: "cloze", wordIds: ["hsk1-139", "hsk1-145", "hsk1-040"], sentence: "我住＿学校后面。", translation: "I live behind the school.", choices: ["在", "去", "来"], answer: "在", explain: "住 takes 在 + location." },
    { id: "s7-g-zai-location-order-1", kind: "order", wordIds: ["hsk1-139", "hsk1-043", "hsk1-069"], tiles: ["火车站", "在", "哪儿"], translation: "Where is the train station?", pinyin: "Huǒchēzhàn zài nǎr?" },
    { id: "s7-g-zai-location-reply-0", kind: "reply", wordIds: ["hsk1-139", "hsk1-145", "hsk1-130", "hsk1-040"], scene: "A classmate asks where you live. Say you live behind the school.", line: { hanzi: "你住在哪儿？", pinyin: "Nǐ zhù zài nǎr?" }, choices: [{ hanzi: "我住在学校后面。", pinyin: "Wǒ zhù zài xuéxiào hòumian." }, { hanzi: "我去学校后面。", pinyin: "Wǒ qù xuéxiào hòumian." }, { hanzi: "我坐学校。", pinyin: "Wǒ zuò xuéxiào." }], answer: "我住在学校后面。", explain: "A home location uses 住在 + place." },
    { id: "s7-g-zai-location-reply-1", kind: "reply", wordIds: ["hsk1-140", "hsk1-083", "hsk1-043", "hsk1-149", "hsk1-012"], scene: "Someone asks how you will reach the station. Say you will go by taxi.", line: { hanzi: "你怎么去火车站？", pinyin: "Nǐ zěnme qù huǒchēzhàn?" }, choices: [{ hanzi: "我坐出租车去。", pinyin: "Wǒ zuò chūzūchē qù." }, { hanzi: "我在出租车。", pinyin: "Wǒ zài chūzūchē." }, { hanzi: "出租车住在学校。", pinyin: "Chūzūchē zhù zài xuéxiào." }], answer: "我坐出租车去。", explain: "Use 坐 + vehicle to give the travel method." },
  ],
};

export const stage07: Stage = {
  id: "hsk1-stage-07", index: 7, title: "Getting around: where things are", hanziTitle: "在哪儿", scenario: "Finding the station and explaining how to get there.",
  description: "Ask where people and places are, say where an action happens, and choose a way to travel.", wordIds: STAGE_WORD_IDS[7], grammarLessonIds: STAGE_GRAMMAR[7],
  dialogue: [
    { speaker: "李华", hanzi: "你住在哪儿？", pinyin: "Nǐ zhù zài nǎr?", english: "Where do you live?" },
    { speaker: "王明", hanzi: "我住在学校后面。你住在哪儿？", pinyin: "Wǒ zhù zài xuéxiào hòumian. Nǐ zhù zài nǎr?", english: "I live behind the school. Where do you live?" },
    { speaker: "李华", hanzi: "我家在商店前面。", pinyin: "Wǒ jiā zài shāngdiàn qiánmiàn.", english: "My home is in front of the store." },
    { speaker: "王明", hanzi: "火车站在哪儿？", pinyin: "Huǒchēzhàn zài nǎr?", english: "Where is the train station?" },
    { speaker: "李华", hanzi: "火车站在学校前面。", pinyin: "Huǒchēzhàn zài xuéxiào qiánmiàn.", english: "The station is in front of the school." },
    { speaker: "王明", hanzi: "怎么去？", pinyin: "Zěnme qù?", english: "How do I get there?" },
    { speaker: "李华", hanzi: "坐出租车去。", pinyin: "Zuò chūzūchē qù.", english: "Go by taxi." },
    { speaker: "王明", hanzi: "好，我下午回家。", pinyin: "Hǎo, wǒ xiàwǔ huí jiā.", english: "Okay, I'll go home this afternoon." },
  ], teach: vocab.teach, blocks: [...vocab.blocks, grammar],
  checkpoint: [
    { id: "s7-check-0", kind: "choice", direction: "hanzi-en", wordIds: ["hsk1-043"], question: "火车站", questionPinyin: "huǒchēzhàn", choices: ["train station", "school", "taxi", "airplane"], answer: "train station" },
    { id: "s7-check-1", kind: "listen", wordIds: ["hsk1-012"], text: "出租车", pinyin: "chūzūchē", choices: ["出租车", "火车站", "飞机", "学校"], answer: "出租车", translation: "taxi" },
    { id: "s7-check-2", kind: "match", matchType: "meaning", wordIds: ["hsk1-083", "hsk1-053", "hsk1-041", "hsk1-149"], pairs: [{ hanzi: "去", match: "go" }, { hanzi: "来", match: "come" }, { hanzi: "回", match: "return" }, { hanzi: "坐", match: "sit / ride" }] },
    { id: "s7-check-3", kind: "cloze", wordIds: ["hsk1-139", "hsk1-145"], sentence: "我住＿学校后面。", translation: "I live behind the school.", choices: ["在", "去", "回"], answer: "在" },
    { id: "s7-check-4", kind: "order", wordIds: ["hsk1-140", "hsk1-083", "hsk1-043"], tiles: ["你", "怎么", "去", "火车站"], translation: "How do you get to the station?", pinyin: "Nǐ zěnme qù huǒchēzhàn?" },
    { id: "s7-check-5", kind: "reply", wordIds: ["hsk1-139", "hsk1-033", "hsk1-130"], scene: "Say where you work.", line: { hanzi: "你在哪儿工作？", pinyin: "Nǐ zài nǎr gōngzuò?" }, choices: [{ hanzi: "我在学校工作。", pinyin: "Wǒ zài xuéxiào gōngzuò." }, { hanzi: "我去工作学校。", pinyin: "Wǒ qù gōngzuò xuéxiào." }, { hanzi: "学校在工作。", pinyin: "Xuéxiào zài gōngzuò." }], answer: "我在学校工作。" },
    { id: "s7-check-6", kind: "choice", direction: "en-hanzi", wordIds: ["hsk1-029"], question: "airplane", choices: ["飞机", "出租车", "火车站", "学校"], answer: "飞机" },
    { id: "s7-check-7", kind: "reply", wordIds: ["hsk1-149", "hsk1-012", "hsk1-083"], scene: "Say you go by taxi.", line: { hanzi: "你怎么去？", pinyin: "Nǐ zěnme qù?" }, choices: [{ hanzi: "我坐出租车去。", pinyin: "Wǒ zuò chūzūchē qù." }, { hanzi: "我住出租车。", pinyin: "Wǒ zhù chūzūchē." }, { hanzi: "出租车在我。", pinyin: "Chūzūchē zài wǒ." }], answer: "我坐出租车去。" },
  ],
};
