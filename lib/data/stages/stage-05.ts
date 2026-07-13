import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildAuthoredVocabulary } from "./authored-content";
import type { ExerciseBlock, Stage } from "./types";

const vocab = buildAuthoredVocabulary(5, STAGE_WORD_IDS[5], {
  "hsk1-011": { note: "吃 is the verb to eat; place the food after it.", example: { hanzi: "我中午吃米饭。", pinyin: "Wǒ zhōngwǔ chī mǐfàn.", english: "I eat rice at noon." } },
  "hsk1-037": { note: "喝 is used for drinking any beverage.", example: { hanzi: "我想喝茶。", pinyin: "Wǒ xiǎng hē chá.", english: "I would like tea." } },
  "hsk1-009": { note: "菜 can mean a prepared dish or vegetables, depending on context.", example: { hanzi: "我喜欢这个菜。", pinyin: "Wǒ xǐhuan zhè ge cài.", english: "I like this dish." } },
  "hsk1-010": { note: "茶 is tea; say 喝茶 for drink tea.", example: { hanzi: "妈妈喜欢喝茶。", pinyin: "Māma xǐhuan hē chá.", english: "Mom likes drinking tea." } },
  "hsk1-066": { note: "米饭 is cooked rice and a staple food.", example: { hanzi: "我想吃米饭。", pinyin: "Wǒ xiǎng chī mǐfàn.", english: "I would like to eat rice." } },
  "hsk1-099": { note: "水 is water; 喝水 is drink water.", example: { hanzi: "请喝水。", pinyin: "Qǐng hē shuǐ.", english: "Please have some water." } },
  "hsk1-100": { note: "水果 is fruit as a category.", example: { hanzi: "我喜欢水果。", pinyin: "Wǒ xǐhuan shuǐguǒ.", english: "I like fruit." } },
  "hsk1-078": { note: "苹果 is an apple; count it with 个.", example: { hanzi: "我想吃一个苹果。", pinyin: "Wǒ xiǎng chī yí ge píngguǒ.", english: "I would like an apple." } },
  "hsk1-004": { note: "杯子 is a cup as an object.", example: { hanzi: "这个杯子是我的。", pinyin: "Zhè ge bēizi shì wǒ de.", english: "This cup is mine." } },
  "hsk1-028": { note: "饭馆 is a restaurant; literally a place for meals.", example: { hanzi: "这是一个饭馆。", pinyin: "Zhè shì yí ge fànguǎn.", english: "This is a restaurant." } },
  "hsk1-121": { note: "想 before a verb means would like or want to.", example: { hanzi: "我想喝水。", pinyin: "Wǒ xiǎng hē shuǐ.", english: "I would like water." } },
  "hsk1-115": { note: "喜欢 expresses liking; the liked thing follows it.", example: { hanzi: "你喜欢茶吗？", pinyin: "Nǐ xǐhuan chá ma?", english: "Do you like tea?" } },
  "hsk1-001": { note: "爱 is strong affection or love; for ordinary preferences, 喜欢 is safer.", example: { hanzi: "我爱妈妈。", pinyin: "Wǒ ài māma.", english: "I love Mom." } },
  "hsk1-082": { note: "请 makes a request polite and can invite someone to do something.", example: { hanzi: "请喝茶。", pinyin: "Qǐng hē chá.", english: "Please have some tea." } },
  "hsk1-038": { note: "和 joins nouns: tea and water. Do not use it to join full sentences.", example: { hanzi: "我想吃米饭和菜。", pinyin: "Wǒ xiǎng chī mǐfàn hé cài.", english: "I would like rice and a dish." } },
});

const grammarBlocks: ExerciseBlock[] = [
  { id: "s5-grammar-time-word-order", title: "Put time before the action", kind: "grammar", grammarLessonId: "time-word-order", exercises: [
    { id: "s5-g-time-word-order-order-0", kind: "order", wordIds: ["hsk1-011", "hsk1-066"], tiles: ["我", "中午", "吃", "米饭"], translation: "I eat rice at noon.", pinyin: "Wǒ zhōngwǔ chī mǐfàn.", explain: "Time goes before the verb: subject + time + action." },
    { id: "s5-g-time-word-order-order-1", kind: "order", wordIds: ["hsk1-037", "hsk1-010"], tiles: ["今天", "下午", "我", "喝", "茶"], translation: "I drink tea this afternoon.", pinyin: "Jīntiān xiàwǔ wǒ hē chá." },
    { id: "s5-g-time-word-order-cloze-0", kind: "cloze", wordIds: ["hsk1-011", "hsk1-078"], sentence: "我上午＿苹果。", translation: "I eat an apple in the morning.", choices: ["吃", "喝", "是"], answer: "吃" },
    { id: "s5-g-time-word-order-reply-0", kind: "reply", wordIds: ["hsk1-037", "hsk1-099"], scene: "Say what you drink at noon.", line: { hanzi: "你中午喝什么？", pinyin: "Nǐ zhōngwǔ hē shénme?" }, choices: [{ hanzi: "我中午喝水。", pinyin: "Wǒ zhōngwǔ hē shuǐ." }, { hanzi: "我喝水中午。", pinyin: "Wǒ hē shuǐ zhōngwǔ." }, { hanzi: "中午是什么？", pinyin: "Zhōngwǔ shì shénme?" }], answer: "我中午喝水。", explain: "Keep 中午 before 喝, not at the end." },
  ] },
  { id: "s5-grammar-xiang-want", title: "Order politely with 想", kind: "grammar", grammarLessonId: "xiang-want", exercises: [
    { id: "s5-g-xiang-want-order-0", kind: "order", wordIds: ["hsk1-121", "hsk1-037", "hsk1-010"], tiles: ["我", "想", "喝", "茶"], translation: "I would like tea.", pinyin: "Wǒ xiǎng hē chá." },
    { id: "s5-g-xiang-want-cloze-0", kind: "cloze", wordIds: ["hsk1-121", "hsk1-011", "hsk1-066"], sentence: "我＿吃米饭。", translation: "I would like to eat rice.", choices: ["想", "喜欢", "有"], answer: "想", explain: "想 + verb expresses what you would like to do." },
    { id: "s5-g-xiang-want-reply-0", kind: "reply", wordIds: ["hsk1-121", "hsk1-011", "hsk1-066", "hsk1-009"], scene: "A waiter asks for your food order. Request rice and a dish.", line: { hanzi: "你想吃什么？", pinyin: "Nǐ xiǎng chī shénme?" }, choices: [{ hanzi: "我想吃米饭和菜。", pinyin: "Wǒ xiǎng chī mǐfàn hé cài." }, { hanzi: "我喜欢饭馆。", pinyin: "Wǒ xǐhuan fànguǎn." }, { hanzi: "请喝水。", pinyin: "Qǐng hē shuǐ." }], answer: "我想吃米饭和菜。", explain: "Answer the order question with 我想 + 吃 + food." },
    { id: "s5-g-xiang-want-reply-1", kind: "reply", wordIds: ["hsk1-121", "hsk1-037", "hsk1-099"], scene: "Now order a drink with less support: choose water.", line: { hanzi: "你想喝什么？", pinyin: "Nǐ xiǎng hē shénme?" }, choices: [{ hanzi: "我想喝水。", pinyin: "Wǒ xiǎng hē shuǐ." }, { hanzi: "我想吃水。", pinyin: "Wǒ xiǎng chī shuǐ." }, { hanzi: "我有杯子。", pinyin: "Wǒ yǒu bēizi." }], answer: "我想喝水。", explain: "Water takes 喝, so the useful order is 我想喝水." },
  ] },
];

export const stage05: Stage = {
  id: "hsk1-stage-05", index: 5, title: "Ordering food & drink", hanziTitle: "吃饭",
  scenario: "Ordering lunch for two at a restaurant.", description: "Order food and drink with 想, state preferences, and keep time words before the action.",
  wordIds: STAGE_WORD_IDS[5], grammarLessonIds: STAGE_GRAMMAR[5],
  dialogue: [
    { speaker: "服务员", hanzi: "你好！你想吃什么？", pinyin: "Nǐ hǎo! Nǐ xiǎng chī shénme?", english: "Hello! What would you like to eat?" },
    { speaker: "王明", hanzi: "我想吃米饭和菜。", pinyin: "Wǒ xiǎng chī mǐfàn hé cài.", english: "I would like rice and a dish." },
    { speaker: "服务员", hanzi: "你想喝什么？", pinyin: "Nǐ xiǎng hē shénme?", english: "What would you like to drink?" },
    { speaker: "王明", hanzi: "我想喝茶。她想喝水。", pinyin: "Wǒ xiǎng hē chá. Tā xiǎng hē shuǐ.", english: "I would like tea. She would like water." },
    { speaker: "服务员", hanzi: "你们喜欢水果吗？", pinyin: "Nǐmen xǐhuan shuǐguǒ ma?", english: "Do you like fruit?" },
    { speaker: "李华", hanzi: "喜欢。我们想吃苹果。", pinyin: "Xǐhuan. Wǒmen xiǎng chī píngguǒ.", english: "Yes. We would like apples." },
    { speaker: "服务员", hanzi: "好，请喝茶和水。", pinyin: "Hǎo, qǐng hē chá hé shuǐ.", english: "Okay. Please have tea and water." },
    { speaker: "王明", hanzi: "谢谢！", pinyin: "Xièxie!", english: "Thank you!" },
  ], teach: vocab.teach, blocks: [...vocab.blocks, ...grammarBlocks],
  checkpoint: [
    { id: "s5-check-0", kind: "choice", direction: "hanzi-en", wordIds: ["hsk1-028"], question: "饭馆", questionPinyin: "fànguǎn", choices: ["restaurant", "cup", "fruit", "dish"], answer: "restaurant" },
    { id: "s5-check-1", kind: "listen", wordIds: ["hsk1-066"], text: "米饭", pinyin: "mǐfàn", choices: ["米饭", "水果", "苹果", "菜"], answer: "米饭", translation: "rice" },
    { id: "s5-check-2", kind: "match", matchType: "meaning", wordIds: ["hsk1-010", "hsk1-099", "hsk1-100", "hsk1-078"], pairs: [{ hanzi: "茶", match: "tea" }, { hanzi: "水", match: "water" }, { hanzi: "水果", match: "fruit" }, { hanzi: "苹果", match: "apple" }] },
    { id: "s5-check-3", kind: "cloze", wordIds: ["hsk1-121", "hsk1-037"], sentence: "我＿喝茶。", translation: "I would like tea.", choices: ["想", "吃", "是"], answer: "想" },
    { id: "s5-check-4", kind: "order", wordIds: ["hsk1-011", "hsk1-066"], tiles: ["我", "中午", "吃", "米饭"], translation: "I eat rice at noon.", pinyin: "Wǒ zhōngwǔ chī mǐfàn." },
    { id: "s5-check-5", kind: "reply", wordIds: ["hsk1-121", "hsk1-037", "hsk1-010"], scene: "Order tea.", line: { hanzi: "你想喝什么？", pinyin: "Nǐ xiǎng hē shénme?" }, choices: [{ hanzi: "我想喝茶。", pinyin: "Wǒ xiǎng hē chá." }, { hanzi: "我想吃茶。", pinyin: "Wǒ xiǎng chī chá." }, { hanzi: "我喜欢杯子。", pinyin: "Wǒ xǐhuan bēizi." }], answer: "我想喝茶。" },
    { id: "s5-check-6", kind: "choice", direction: "en-hanzi", wordIds: ["hsk1-082"], question: "please / invite", choices: ["请", "想", "爱", "和"], answer: "请" },
    { id: "s5-check-7", kind: "reply", wordIds: ["hsk1-121", "hsk1-011", "hsk1-078"], scene: "Order an apple.", line: { hanzi: "你想吃什么？", pinyin: "Nǐ xiǎng chī shénme?" }, choices: [{ hanzi: "我想吃苹果。", pinyin: "Wǒ xiǎng chī píngguǒ." }, { hanzi: "我想喝苹果。", pinyin: "Wǒ xiǎng hē píngguǒ." }, { hanzi: "苹果是饭馆。", pinyin: "Píngguǒ shì fànguǎn." }], answer: "我想吃苹果。" },
  ],
};
