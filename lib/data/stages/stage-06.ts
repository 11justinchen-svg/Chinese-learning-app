import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildAuthoredVocabulary } from "./authored-content";
import type { ExerciseBlock, Stage } from "./types";

const vocab = buildAuthoredVocabulary(6, STAGE_WORD_IDS[6], {
  "hsk1-062": { note: "买 is to buy; put the item after it.", example: { hanzi: "我想买衣服。", pinyin: "Wǒ xiǎng mǎi yīfu.", english: "I want to buy clothes." } },
  "hsk1-081": { note: "钱 means money; 多少钱 asks the price.", example: { hanzi: "这个多少钱？", pinyin: "Zhè ge duōshao qián?", english: "How much is this?" } },
  "hsk1-052": { note: "块 is the everyday spoken unit for yuan.", example: { hanzi: "这个十块。", pinyin: "Zhè ge shí kuài.", english: "This is ten yuan." } },
  "hsk1-089": { note: "商店 is a shop or store.", example: { hanzi: "那是一个商店。", pinyin: "Nà shì yí ge shāngdiàn.", english: "That is a store." } },
  "hsk1-020": { note: "东西 is a general word for a thing or things; the second syllable is neutral.", example: { hanzi: "我想买东西。", pinyin: "Wǒ xiǎng mǎi dōngxi.", english: "I want to buy something." } },
  "hsk1-132": { note: "衣服 means clothing; the second syllable is neutral.", example: { hanzi: "这些衣服漂亮。", pinyin: "Zhèxiē yīfu piàoliang.", english: "These clothes are pretty." } },
  "hsk1-024": { note: "多 means many or much and appears in 多少.", example: { hanzi: "这个钱太多了。", pinyin: "Zhè ge qián tài duō le.", english: "This costs too much." } },
  "hsk1-092": { note: "少 means few or little, the opposite of 多.", example: { hanzi: "我的钱少。", pinyin: "Wǒ de qián shǎo.", english: "I have little money." } },
  "hsk1-107": { note: "太 before an adjective, with 了 after it, means too or so.", example: { hanzi: "这个太大了。", pinyin: "Zhè ge tài dà le.", english: "This one is too big." } },
  "hsk1-055": { note: "了 closes the 太…了 reaction here; later it will also mark completed actions.", example: { hanzi: "太好了！", pinyin: "Tài hǎo le!", english: "Great!" } },
  "hsk1-014": { note: "大 means big; do not link it to a noun with 是.", example: { hanzi: "这个大。", pinyin: "Zhè ge dà.", english: "This one is big." } },
  "hsk1-122": { note: "小 means small.", example: { hanzi: "那个太小了。", pinyin: "Nà ge tài xiǎo le.", english: "That one is too small." } },
  "hsk1-077": { note: "漂亮 describes something as pretty or attractive.", example: { hanzi: "这个衣服漂亮。", pinyin: "Zhè ge yīfu piàoliang.", english: "These clothes are pretty." } },
  "hsk1-124": { note: "些 means some; 这些 and 那些 point to plural things.", example: { hanzi: "我想买这些。", pinyin: "Wǒ xiǎng mǎi zhèxiē.", english: "I want to buy these." } },
  "hsk1-141": { note: "怎么样 asks how something is or what someone thinks of it.", example: { hanzi: "这些衣服怎么样？", pinyin: "Zhèxiē yīfu zěnmeyàng?", english: "How are these clothes?" } },
});

const grammar: ExerciseBlock = {
  id: "s6-grammar-tai-le", title: "React to the fit and price · 太…了", kind: "grammar", grammarLessonId: "tai-le",
  exercises: [
    { id: "s6-g-tai-le-order-0", kind: "order", wordIds: ["hsk1-107", "hsk1-014", "hsk1-055"], tiles: ["这个", "太", "大", "了"], translation: "This one is too big.", pinyin: "Zhè ge tài dà le." },
    { id: "s6-g-tai-le-cloze-0", kind: "cloze", wordIds: ["hsk1-107", "hsk1-122", "hsk1-055"], sentence: "那个太＿了。", translation: "That one is too small.", choices: ["小", "买", "钱"], answer: "小", explain: "Put the adjective between 太 and 了." },
    { id: "s6-g-tai-le-order-1", kind: "order", wordIds: ["hsk1-107", "hsk1-024", "hsk1-055", "hsk1-081"], tiles: ["这个", "钱", "太", "多", "了"], translation: "This costs too much.", pinyin: "Zhè ge qián tài duō le." },
    { id: "s6-g-tai-le-reply-0", kind: "reply", wordIds: ["hsk1-107", "hsk1-014", "hsk1-055"], scene: "A sales associate shows you an oversized item. Decline because it is too big.", line: { hanzi: "这个怎么样？", pinyin: "Zhè ge zěnmeyàng?" }, choices: [{ hanzi: "这个太大了。", pinyin: "Zhè ge tài dà le." }, { hanzi: "我没有大。", pinyin: "Wǒ méiyǒu dà." }, { hanzi: "这个是大。", pinyin: "Zhè ge shì dà." }], answer: "这个太大了。", explain: "React with 太 + 大 + 了; adjectives do not need 是." },
    { id: "s6-g-tai-le-reply-1", kind: "reply", wordIds: ["hsk1-107", "hsk1-077", "hsk1-055"], scene: "Another item looks wonderful. React that it is so pretty.", line: { hanzi: "这些衣服怎么样？", pinyin: "Zhèxiē yīfu zěnmeyàng?" }, choices: [{ hanzi: "太漂亮了！", pinyin: "Tài piàoliang le!" }, { hanzi: "漂亮是衣服。", pinyin: "Piàoliang shì yīfu." }, { hanzi: "我没有漂亮。", pinyin: "Wǒ méiyǒu piàoliang." }], answer: "太漂亮了！", explain: "太…了 can also express a strong positive reaction." },
  ],
};

export const stage06: Stage = {
  id: "hsk1-stage-06", index: 6, title: "Shopping & money", hanziTitle: "买东西", scenario: "Choosing clothes and negotiating fit and price in a shop.",
  description: "Ask prices, describe size and appearance, and react with 太 + adjective + 了.", wordIds: STAGE_WORD_IDS[6], grammarLessonIds: STAGE_GRAMMAR[6],
  dialogue: [
    { speaker: "店员", hanzi: "你好！你想买什么？", pinyin: "Nǐ hǎo! Nǐ xiǎng mǎi shénme?", english: "Hello! What would you like to buy?" },
    { speaker: "王明", hanzi: "我想买衣服。", pinyin: "Wǒ xiǎng mǎi yīfu.", english: "I would like to buy clothes." },
    { speaker: "店员", hanzi: "这些衣服怎么样？", pinyin: "Zhèxiē yīfu zěnmeyàng?", english: "How about these clothes?" },
    { speaker: "王明", hanzi: "漂亮。这个太大了。", pinyin: "Piàoliang. Zhè ge tài dà le.", english: "Pretty. This one is too big." },
    { speaker: "店员", hanzi: "那个小。", pinyin: "Nà ge xiǎo.", english: "That one is small." },
    { speaker: "王明", hanzi: "那个多少钱？", pinyin: "Nà ge duōshao qián?", english: "How much is that one?" },
    { speaker: "店员", hanzi: "二十块。", pinyin: "Èrshí kuài.", english: "Twenty yuan." },
    { speaker: "王明", hanzi: "太好了！我买那个。", pinyin: "Tài hǎo le! Wǒ mǎi nà ge.", english: "Great! I'll buy that one." },
  ], teach: vocab.teach, blocks: [...vocab.blocks, grammar],
  checkpoint: [
    { id: "s6-check-0", kind: "choice", direction: "hanzi-en", wordIds: ["hsk1-089"], question: "商店", questionPinyin: "shāngdiàn", choices: ["store", "restaurant", "clothes", "money"], answer: "store" },
    { id: "s6-check-1", kind: "listen", wordIds: ["hsk1-132"], text: "衣服", pinyin: "yīfu", choices: ["衣服", "东西", "商店", "漂亮"], answer: "衣服", translation: "clothes" },
    { id: "s6-check-2", kind: "match", matchType: "meaning", wordIds: ["hsk1-014", "hsk1-122", "hsk1-024", "hsk1-092"], pairs: [{ hanzi: "大", match: "big" }, { hanzi: "小", match: "small" }, { hanzi: "多", match: "many" }, { hanzi: "少", match: "few" }] },
    { id: "s6-check-3", kind: "cloze", wordIds: ["hsk1-052"], sentence: "这个十＿。", translation: "This is ten yuan.", choices: ["块", "个", "岁"], answer: "块" },
    { id: "s6-check-4", kind: "order", wordIds: ["hsk1-062", "hsk1-132"], tiles: ["我", "想", "买", "衣服"], translation: "I want to buy clothes.", pinyin: "Wǒ xiǎng mǎi yīfu." },
    { id: "s6-check-5", kind: "reply", wordIds: ["hsk1-107", "hsk1-122", "hsk1-055"], scene: "Say an item is too small.", line: { hanzi: "这个怎么样？", pinyin: "Zhè ge zěnmeyàng?" }, choices: [{ hanzi: "这个太小了。", pinyin: "Zhè ge tài xiǎo le." }, { hanzi: "这个是小。", pinyin: "Zhè ge shì xiǎo." }, { hanzi: "我没有小。", pinyin: "Wǒ méiyǒu xiǎo." }], answer: "这个太小了。" },
    { id: "s6-check-6", kind: "choice", direction: "en-hanzi", wordIds: ["hsk1-124"], question: "some / a few", choices: ["些", "多", "少", "钱"], answer: "些" },
    { id: "s6-check-7", kind: "reply", wordIds: ["hsk1-081", "hsk1-025"], scene: "Ask the price of this item.", line: { hanzi: "你想买吗？", pinyin: "Nǐ xiǎng mǎi ma?" }, choices: [{ hanzi: "这个多少钱？", pinyin: "Zhè ge duōshao qián?" }, { hanzi: "这个钱是谁？", pinyin: "Zhè ge qián shì shéi?" }, { hanzi: "我有多少？", pinyin: "Wǒ yǒu duōshao?" }], answer: "这个多少钱？" },
  ],
};
