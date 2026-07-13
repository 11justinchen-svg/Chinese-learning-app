import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildAuthoredVocabulary } from "./authored-content";
import type { ExerciseBlock, Stage } from "./types";

const vocab = buildAuthoredVocabulary(3, STAGE_WORD_IDS[3], {
  "hsk1-131": { note: "一 is one; before some tones its spoken tone changes, but the dictionary form is yī.", example: { hanzi: "我有一个朋友。", pinyin: "Wǒ yǒu yí ge péngyou.", english: "I have one friend." } },
  "hsk1-027": { note: "二 is the number two in counting and dates.", example: { hanzi: "她二十岁。", pinyin: "Tā èrshí suì.", english: "She is twenty years old." } },
  "hsk1-088": { note: "三 is three; combine it with 十 to make thirty.", example: { hanzi: "我家有三个人。", pinyin: "Wǒ jiā yǒu sān ge rén.", english: "There are three people in my family." } },
  "hsk1-103": { note: "四 is four; keep the falling fourth tone distinct from 十.", example: { hanzi: "四点。", pinyin: "Sì diǎn.", english: "Four o'clock." } },
  "hsk1-114": { note: "五 is five.", example: { hanzi: "她五岁。", pinyin: "Tā wǔ suì.", english: "She is five years old." } },
  "hsk1-059": { note: "六 is six.", example: { hanzi: "六点。", pinyin: "Liù diǎn.", english: "Six o'clock." } },
  "hsk1-079": { note: "七 is seven.", example: { hanzi: "他七岁。", pinyin: "Tā qī suì.", english: "He is seven years old." } },
  "hsk1-002": { note: "八 is eight.", example: { hanzi: "八点。", pinyin: "Bā diǎn.", english: "Eight o'clock." } },
  "hsk1-048": { note: "九 is nine.", example: { hanzi: "九点。", pinyin: "Jiǔ diǎn.", english: "Nine o'clock." } },
  "hsk1-094": { note: "十 is ten and forms the tens: 二十, 三十.", example: { hanzi: "我十岁。", pinyin: "Wǒ shí suì.", english: "I am ten years old." } },
  "hsk1-058": { note: "零 is zero and fills a missing place in a number.", example: { hanzi: "零。", pinyin: "Líng.", english: "Zero." } },
  "hsk1-044": { note: "几 asks a small, expected number: 几岁, 几点.", example: { hanzi: "你几岁？", pinyin: "Nǐ jǐ suì?", english: "How old are you?" } },
  "hsk1-025": { note: "多少 asks how many or how much when the range is open.", example: { hanzi: "你有多少朋友？", pinyin: "Nǐ yǒu duōshao péngyou?", english: "How many friends do you have?" } },
  "hsk1-104": { note: "岁 follows a number to state age; no 是 is needed.", example: { hanzi: "我十八岁。", pinyin: "Wǒ shíbā suì.", english: "I am eighteen years old." } },
  "hsk1-016": { note: "点 follows the hour number: 八点 means eight o'clock.", example: { hanzi: "几点？", pinyin: "Jǐ diǎn?", english: "What time?" } },
  "hsk1-030": { note: "分钟 counts minutes of duration; 分 is used when reading clock minutes.", example: { hanzi: "十分钟。", pinyin: "Shí fēnzhōng.", english: "Ten minutes." } },
});

const grammar: ExerciseBlock = {
  id: "s3-grammar-measure-words", title: "Count naturally · 个 / 岁 / 分钟", kind: "grammar", grammarLessonId: "measure-words",
  exercises: [
    { id: "s3-g-measure-words-order-0", kind: "order", wordIds: ["hsk1-088", "hsk1-032", "hsk1-076"], tiles: ["我", "有", "三", "个", "朋友"], translation: "I have three friends.", pinyin: "Wǒ yǒu sān ge péngyou." },
    { id: "s3-g-measure-words-cloze-0", kind: "cloze", wordIds: ["hsk1-104"], sentence: "她五＿。", translation: "She is five years old.", choices: ["岁", "个", "点"], answer: "岁", explain: "Age uses number + 岁, without 是." },
    { id: "s3-g-measure-words-cloze-1", kind: "cloze", wordIds: ["hsk1-030", "hsk1-094"], sentence: "十＿。", translation: "Ten minutes.", choices: ["分钟", "岁", "个"], answer: "分钟" },
    { id: "s3-g-measure-words-order-1", kind: "order", wordIds: ["hsk1-044", "hsk1-016"], tiles: ["几", "点"], translation: "What time?", pinyin: "Jǐ diǎn?" },
    { id: "s3-g-measure-words-reply-0", kind: "reply", wordIds: ["hsk1-044", "hsk1-104", "hsk1-094", "hsk1-002"], scene: "Someone asks your age. Choose to say you are eighteen.", line: { hanzi: "你几岁？", pinyin: "Nǐ jǐ suì?" }, choices: [{ hanzi: "我十八岁。", pinyin: "Wǒ shíbā suì." }, { hanzi: "八点。", pinyin: "Bā diǎn." }, { hanzi: "我有八个朋友。", pinyin: "Wǒ yǒu bā ge péngyou." }], answer: "我十八岁。", explain: "An age answer is number + 岁; do not add 是." },
    { id: "s3-g-measure-words-reply-1", kind: "reply", wordIds: ["hsk1-044", "hsk1-016", "hsk1-048"], scene: "A friend asks the time. Say it is nine o'clock.", line: { hanzi: "几点？", pinyin: "Jǐ diǎn?" }, choices: [{ hanzi: "九点。", pinyin: "Jiǔ diǎn." }, { hanzi: "我九岁。", pinyin: "Wǒ jiǔ suì." }, { hanzi: "九分钟。", pinyin: "Jiǔ fēnzhōng." }], answer: "九点。", explain: "Answer a clock-time question with number + 点." },
  ],
};

export const stage03: Stage = {
  id: "hsk1-stage-03", index: 3, title: "Counting, age & the clock", hanziTitle: "数字",
  scenario: "Meeting a family and checking the time before leaving.",
  description: "Count from zero to ten, ask ages and quantities, and choose 个, 岁, 点, or 分钟 by meaning.",
  wordIds: STAGE_WORD_IDS[3], grammarLessonIds: STAGE_GRAMMAR[3],
  dialogue: [
    { speaker: "王明", hanzi: "这是我的女儿。", pinyin: "Zhè shì wǒ de nǚ'ér.", english: "This is my daughter." },
    { speaker: "李华", hanzi: "她几岁？", pinyin: "Tā jǐ suì?", english: "How old is she?" },
    { speaker: "王明", hanzi: "她五岁。", pinyin: "Tā wǔ suì.", english: "She is five." },
    { speaker: "李华", hanzi: "你有几个女儿？", pinyin: "Nǐ yǒu jǐ ge nǚ'ér?", english: "How many daughters do you have?" },
    { speaker: "王明", hanzi: "我有一个女儿、一个儿子。", pinyin: "Wǒ yǒu yí ge nǚ'ér, yí ge érzi.", english: "I have one daughter and one son." },
    { speaker: "李华", hanzi: "几点？", pinyin: "Jǐ diǎn?", english: "What time is it?" },
    { speaker: "王明", hanzi: "八点。", pinyin: "Bā diǎn.", english: "Eight o'clock." },
    { speaker: "李华", hanzi: "好。我们有十分钟。", pinyin: "Hǎo. Wǒmen yǒu shí fēnzhōng.", english: "Okay. We have ten minutes." },
  ],
  teach: vocab.teach, blocks: [...vocab.blocks, grammar],
  checkpoint: [
    { id: "s3-check-0", kind: "listen", wordIds: ["hsk1-079"], text: "七", pinyin: "qī", choices: ["七", "九", "十", "四"], answer: "七", translation: "seven" },
    { id: "s3-check-1", kind: "choice", direction: "en-hanzi", wordIds: ["hsk1-058"], question: "zero", choices: ["零", "一", "二", "十"], answer: "零" },
    { id: "s3-check-2", kind: "match", matchType: "meaning", wordIds: ["hsk1-131", "hsk1-027", "hsk1-088", "hsk1-103"], pairs: [{ hanzi: "一", match: "one" }, { hanzi: "二", match: "two" }, { hanzi: "三", match: "three" }, { hanzi: "四", match: "four" }] },
    { id: "s3-check-3", kind: "cloze", wordIds: ["hsk1-104", "hsk1-114"], sentence: "她五＿。", translation: "She is five years old.", choices: ["岁", "点", "个"], answer: "岁" },
    { id: "s3-check-4", kind: "order", wordIds: ["hsk1-025", "hsk1-076"], tiles: ["你", "有", "多少", "朋友"], translation: "How many friends do you have?", pinyin: "Nǐ yǒu duōshao péngyou?" },
    { id: "s3-check-5", kind: "reply", wordIds: ["hsk1-044", "hsk1-016", "hsk1-059"], scene: "Say that it is six o'clock.", line: { hanzi: "几点？", pinyin: "Jǐ diǎn?" }, choices: [{ hanzi: "六点。", pinyin: "Liù diǎn." }, { hanzi: "我六岁。", pinyin: "Wǒ liù suì." }, { hanzi: "六分钟。", pinyin: "Liù fēnzhōng." }], answer: "六点。" },
    { id: "s3-check-6", kind: "choice", direction: "hanzi-en", wordIds: ["hsk1-030"], question: "分钟", questionPinyin: "fēnzhōng", choices: ["minute", "o'clock", "year of age", "how many"], answer: "minute" },
    { id: "s3-check-7", kind: "reply", wordIds: ["hsk1-104", "hsk1-094"], scene: "Say you are ten years old.", line: { hanzi: "你几岁？", pinyin: "Nǐ jǐ suì?" }, choices: [{ hanzi: "我十岁。", pinyin: "Wǒ shí suì." }, { hanzi: "十点。", pinyin: "Shí diǎn." }, { hanzi: "十分钟。", pinyin: "Shí fēnzhōng." }], answer: "我十岁。" },
  ],
};
