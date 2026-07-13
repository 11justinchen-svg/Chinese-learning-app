import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildAuthoredVocabulary } from "./authored-content";
import type { ExerciseBlock, Stage } from "./types";

const vocab = buildAuthoredVocabulary(2, STAGE_WORD_IDS[2], {
  "hsk1-003": { note: "爸爸 is the everyday word for dad.", example: { hanzi: "他是我爸爸。", pinyin: "Tā shì wǒ bàba.", english: "He is my dad." } },
  "hsk1-060": { note: "妈妈 is the everyday word for mom.", example: { hanzi: "她是我妈妈。", pinyin: "Tā shì wǒ māma.", english: "She is my mom." } },
  "hsk1-026": { note: "儿子 means son; 儿 keeps its second tone here.", example: { hanzi: "他是我的儿子。", pinyin: "Tā shì wǒ de érzi.", english: "He is my son." } },
  "hsk1-075": { note: "女儿 means daughter and is one word.", example: { hanzi: "她是我的女儿。", pinyin: "Tā shì wǒ de nǚ'ér.", english: "She is my daughter." } },
  "hsk1-076": { note: "朋友 is a friend; 我的朋友 means my friend.", example: { hanzi: "她是我的朋友。", pinyin: "Tā shì wǒ de péngyou.", english: "She is my friend." } },
  "hsk1-085": { note: "人 can mean one person or people in general.", example: { hanzi: "那个人是谁？", pinyin: "Nà ge rén shì shéi?", english: "Who is that person?" } },
  "hsk1-045": { note: "家 means home or family, depending on context.", example: { hanzi: "这是我的家。", pinyin: "Zhè shì wǒ de jiā.", english: "This is my home." } },
  "hsk1-015": { note: "Put 的 after an owner: 我 + 的 + 猫.", example: { hanzi: "这是我的猫。", pinyin: "Zhè shì wǒ de māo.", english: "This is my cat." } },
  "hsk1-136": { note: "有 means to have or there is; do not negate it with 不.", example: { hanzi: "我有猫。", pinyin: "Wǒ yǒu māo.", english: "I have a cat." } },
  "hsk1-064": { note: "没 before 有 makes 没有: do not have.", example: { hanzi: "我没有狗。", pinyin: "Wǒ méiyǒu gǒu.", english: "I do not have a dog." } },
  "hsk1-098": { note: "谁 asks who; it stays where the answer would go.", example: { hanzi: "她是谁？", pinyin: "Tā shì shéi?", english: "Who is she?" } },
  "hsk1-142": { note: "这 points to something close: this.", example: { hanzi: "这是我的朋友。", pinyin: "Zhè shì wǒ de péngyou.", english: "This is my friend." } },
  "hsk1-070": { note: "那 points to something farther away: that.", example: { hanzi: "那是我妈妈。", pinyin: "Nà shì wǒ māma.", english: "That is my mom." } },
  "hsk1-032": { note: "个 is the general measure word: 这个人, 那个人.", example: { hanzi: "这个人是谁？", pinyin: "Zhè ge rén shì shéi?", english: "Who is this person?" } },
  "hsk1-034": { note: "狗 means dog. At this stage, say 我有狗 without counting it.", example: { hanzi: "我有狗。", pinyin: "Wǒ yǒu gǒu.", english: "I have a dog." } },
  "hsk1-063": { note: "猫 means cat. It can be the thing someone owns.", example: { hanzi: "那是她的猫。", pinyin: "Nà shì tā de māo.", english: "That is her cat." } },
});

const grammarBlocks: ExerciseBlock[] = [
  {
    id: "s2-grammar-de-possession", title: "Whose is it? · 的", kind: "grammar", grammarLessonId: "de-possession",
    exercises: [
      { id: "s2-g-de-order-0", kind: "order", wordIds: ["hsk1-015", "hsk1-063"], tiles: ["这是", "我的", "猫"], translation: "This is my cat.", pinyin: "Zhè shì wǒ de māo?", explain: "Owner + 的 + thing." },
      { id: "s2-g-de-cloze-0", kind: "cloze", wordIds: ["hsk1-015", "hsk1-076"], sentence: "她是我＿朋友。", translation: "She is my friend.", choices: ["的", "吗", "不"], answer: "的", explain: "的 marks 我 as the owner/relationship holder." },
      { id: "s2-g-de-reply-0", kind: "reply", wordIds: ["hsk1-015", "hsk1-098", "hsk1-034"], scene: "A friend points to a dog and asks whose it is. Say it is yours.", line: { hanzi: "这是谁的狗？", pinyin: "Zhè shì shéi de gǒu?" }, choices: [{ hanzi: "这是我的狗。", pinyin: "Zhè shì wǒ de gǒu." }, { hanzi: "我没有狗。", pinyin: "Wǒ méiyǒu gǒu." }, { hanzi: "那个人是谁？", pinyin: "Nà ge rén shì shéi?" }], answer: "这是我的狗。", explain: "Answer the ownership question with 我的 + 狗." },
      { id: "s2-g-de-reply-1", kind: "reply", wordIds: ["hsk1-015", "hsk1-075"], scene: "Someone asks who the girl is. Say she is your daughter.", line: { hanzi: "她是谁？", pinyin: "Tā shì shéi?" }, choices: [{ hanzi: "她是我的女儿。", pinyin: "Tā shì wǒ de nǚ'ér." }, { hanzi: "她是我妈妈吗？", pinyin: "Tā shì wǒ māma ma?" }, { hanzi: "这是她的猫。", pinyin: "Zhè shì tā de māo." }], answer: "她是我的女儿。", explain: "Use 我的 before 女儿 to identify your relationship." },
    ],
  },
  {
    id: "s2-grammar-bu-vs-mei", title: "Not vs. do not have · 不 / 没", kind: "grammar", grammarLessonId: "bu-vs-mei",
    exercises: [
      { id: "s2-g-bumei-cloze-0", kind: "cloze", wordIds: ["hsk1-064", "hsk1-136"], sentence: "我＿有猫。", translation: "I do not have a cat.", choices: ["没", "不", "吗"], answer: "没", explain: "Negate 有 with 没: 没有, never 不有." },
      { id: "s2-g-bumei-cloze-1", kind: "cloze", wordIds: ["hsk1-007"], sentence: "他＿是我爸爸。", translation: "He is not my dad.", choices: ["不", "没", "的"], answer: "不", explain: "Negate an identity with 不是." },
      { id: "s2-g-bumei-order-0", kind: "order", wordIds: ["hsk1-064", "hsk1-136", "hsk1-034"], tiles: ["我", "没有", "狗"], translation: "I do not have a dog.", pinyin: "Wǒ méiyǒu gǒu." },
      { id: "s2-g-bumei-reply-0", kind: "reply", wordIds: ["hsk1-064", "hsk1-136", "hsk1-063"], scene: "A classmate asks whether you have a cat. Say no.", line: { hanzi: "你有猫吗？", pinyin: "Nǐ yǒu māo ma?" }, choices: [{ hanzi: "我没有猫。", pinyin: "Wǒ méiyǒu māo." }, { hanzi: "我不是猫。", pinyin: "Wǒ bú shì māo." }, { hanzi: "这是我的猫。", pinyin: "Zhè shì wǒ de māo." }], answer: "我没有猫。", explain: "The communicative goal is lack of possession, so use 没有." },
    ],
  },
];

export const stage02: Stage = {
  id: "hsk1-stage-02", index: 2, title: "Family, friends & pets", hanziTitle: "我的家",
  scenario: "Showing a friend family photos and talking about pets.",
  description: "Identify family and friends, say who owns something with 的, and contrast 不是 with 没有.",
  wordIds: STAGE_WORD_IDS[2], grammarLessonIds: STAGE_GRAMMAR[2],
  dialogue: [
    { speaker: "李华", hanzi: "这是我的家。", pinyin: "Zhè shì wǒ de jiā.", english: "This is my family." },
    { speaker: "王明", hanzi: "这个人是谁？", pinyin: "Zhè ge rén shì shéi?", english: "Who is this person?" },
    { speaker: "李华", hanzi: "他是我爸爸。她是我妈妈。", pinyin: "Tā shì wǒ bàba. Tā shì wǒ māma.", english: "He is my dad. She is my mom." },
    { speaker: "王明", hanzi: "那是你的朋友吗？", pinyin: "Nà shì nǐ de péngyou ma?", english: "Is that your friend?" },
    { speaker: "李华", hanzi: "不是，她是我的女儿。", pinyin: "Bú shì, tā shì wǒ de nǚ'ér.", english: "No, she is my daughter." },
    { speaker: "王明", hanzi: "这是她的猫吗？", pinyin: "Zhè shì tā de māo ma?", english: "Is this her cat?" },
    { speaker: "李华", hanzi: "是。她有猫，我儿子有狗。", pinyin: "Shì. Tā yǒu māo, wǒ érzi yǒu gǒu.", english: "Yes. She has a cat, and my son has a dog." },
    { speaker: "王明", hanzi: "我没有猫。我没有狗。", pinyin: "Wǒ méiyǒu māo. Wǒ méiyǒu gǒu.", english: "I do not have a cat. I do not have a dog." },
  ],
  teach: vocab.teach,
  blocks: [...vocab.blocks, ...grammarBlocks],
  checkpoint: [
    { id: "s2-check-0", kind: "choice", direction: "hanzi-en", wordIds: ["hsk1-076"], question: "朋友", questionPinyin: "péngyou", choices: ["friend", "father", "daughter", "person"], answer: "friend" },
    { id: "s2-check-1", kind: "listen", wordIds: ["hsk1-060"], text: "妈妈", pinyin: "māma", choices: ["妈妈", "爸爸", "朋友", "女儿"], answer: "妈妈", translation: "mom" },
    { id: "s2-check-2", kind: "cloze", wordIds: ["hsk1-015", "hsk1-034"], sentence: "这是我＿狗。", translation: "This is my dog.", choices: ["的", "吗", "没"], answer: "的" },
    { id: "s2-check-3", kind: "order", wordIds: ["hsk1-098", "hsk1-070", "hsk1-032", "hsk1-085"], tiles: ["那", "个", "人", "是", "谁"], translation: "Who is that person?", pinyin: "Nà ge rén shì shéi?" },
    { id: "s2-check-4", kind: "reply", wordIds: ["hsk1-064", "hsk1-136", "hsk1-034"], scene: "Say you do not have a dog.", line: { hanzi: "你有狗吗？", pinyin: "Nǐ yǒu gǒu ma?" }, choices: [{ hanzi: "我没有狗。", pinyin: "Wǒ méiyǒu gǒu." }, { hanzi: "我是狗。", pinyin: "Wǒ shì gǒu." }, { hanzi: "这是你的狗。", pinyin: "Zhè shì nǐ de gǒu." }], answer: "我没有狗。" },
    { id: "s2-check-5", kind: "match", matchType: "meaning", wordIds: ["hsk1-003", "hsk1-060", "hsk1-026", "hsk1-075"], pairs: [{ hanzi: "爸爸", match: "dad" }, { hanzi: "妈妈", match: "mom" }, { hanzi: "儿子", match: "son" }, { hanzi: "女儿", match: "daughter" }] },
    { id: "s2-check-6", kind: "choice", direction: "en-hanzi", wordIds: ["hsk1-045"], question: "home / family", choices: ["家", "人", "朋友", "猫"], answer: "家" },
    { id: "s2-check-7", kind: "reply", wordIds: ["hsk1-015", "hsk1-075"], scene: "Identify the girl as your daughter.", line: { hanzi: "她是谁？", pinyin: "Tā shì shéi?" }, choices: [{ hanzi: "她是我的女儿。", pinyin: "Tā shì wǒ de nǚ'ér." }, { hanzi: "她有猫吗？", pinyin: "Tā yǒu māo ma?" }, { hanzi: "她不是朋友。", pinyin: "Tā bú shì péngyou." }], answer: "她是我的女儿。" },
  ],
};
