import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildAuthoredVocabulary } from "./authored-content";
import type { ExerciseBlock, Stage } from "./types";

const vocab = buildAuthoredVocabulary(10, STAGE_WORD_IDS[10], {
  "hsk1-013": { note: "打电话 is a separable verb-object phrase: make a phone call.", example: { hanzi: "我上午打电话。", pinyin: "Wǒ shàngwǔ dǎ diànhuà.", english: "I make a phone call in the morning." } },
  "hsk1-111": { note: "喂 is the standard way to answer a phone; pronounce it wèi here.", example: { hanzi: "喂，你好！", pinyin: "Wèi, nǐ hǎo!", english: "Hello?" } },
  "hsk1-018": { note: "电视 is television; 看电视 means watch TV and 开电视 means turn it on.", example: { hanzi: "我下午看电视。", pinyin: "Wǒ xiàwǔ kàn diànshì.", english: "I watch TV in the afternoon." } },
  "hsk1-019": { note: "电影 is a movie; 看电影 means watch a movie.", example: { hanzi: "我昨天看了电影。", pinyin: "Wǒ zuótiān kàn le diànyǐng.", english: "I watched a movie yesterday." } },
  "hsk1-050": { note: "看 is the intentional act of looking, watching, or reading.", example: { hanzi: "我想看电影。", pinyin: "Wǒ xiǎng kàn diànyǐng.", english: "I want to watch a movie." } },
  "hsk1-051": { note: "看见 emphasizes the result: actually see or catch sight of.", example: { hanzi: "我看见医生了。", pinyin: "Wǒ kànjian yīsheng le.", english: "I saw the doctor." } },
  "hsk1-049": { note: "开 means open or switch on in 开电视.", example: { hanzi: "请开电视。", pinyin: "Qǐng kāi diànshì.", english: "Please turn on the TV." } },
  "hsk1-101": { note: "睡觉 is to sleep or go to bed; the second syllable has fourth tone.", example: { hanzi: "我十点睡觉。", pinyin: "Wǒ shí diǎn shuìjiào.", english: "I go to bed at ten." } },
  "hsk1-150": { note: "做 is to do or make; 做什么 asks what someone does.", example: { hanzi: "你今天做了什么？", pinyin: "Nǐ jīntiān zuò le shénme?", english: "What did you do today?" } },
  "hsk1-133": { note: "医生 is a doctor.", example: { hanzi: "她是医生。", pinyin: "Tā shì yīsheng.", english: "She is a doctor." } },
  "hsk1-134": { note: "医院 is a hospital; 去医院 means go to the hospital.", example: { hanzi: "我下午去了医院。", pinyin: "Wǒ xiàwǔ qù le yīyuàn.", english: "I went to the hospital this afternoon." } },
});

const grammar: ExerciseBlock = {
  id: "s10-grammar-le-completed", title: "Report what happened · completed 了", kind: "grammar", grammarLessonId: "le-completed",
  exercises: [
    { id: "s10-g-le-completed-order-0", kind: "order", wordIds: ["hsk1-050", "hsk1-019", "hsk1-055"], tiles: ["我", "昨天", "看", "了", "电影"], translation: "I watched a movie yesterday.", pinyin: "Wǒ zuótiān kàn le diànyǐng." },
    { id: "s10-g-le-completed-cloze-0", kind: "cloze", wordIds: ["hsk1-013", "hsk1-055"], sentence: "我上午打电话＿。", translation: "I made a phone call this morning.", choices: ["了", "的", "吗"], answer: "了", explain: "Sentence-final 了 presents the phone call as the completed news." },
    { id: "s10-g-le-completed-order-1", kind: "order", wordIds: ["hsk1-083", "hsk1-134", "hsk1-055"], tiles: ["我", "下午", "去", "了", "医院"], translation: "I went to the hospital this afternoon.", pinyin: "Wǒ xiàwǔ qù le yīyuàn." },
    { id: "s10-g-le-completed-cloze-1", kind: "cloze", wordIds: ["hsk1-051", "hsk1-133", "hsk1-055"], sentence: "我看见＿医生。", translation: "I saw the doctor.", choices: ["了", "吗", "的"], answer: "了" },
    { id: "s10-g-le-completed-reply-0", kind: "reply", wordIds: ["hsk1-150", "hsk1-050", "hsk1-019", "hsk1-055"], scene: "A friend asks what you did yesterday. Say you watched a movie.", line: { hanzi: "你昨天做了什么？", pinyin: "Nǐ zuótiān zuò le shénme?" }, choices: [{ hanzi: "我昨天看了电影。", pinyin: "Wǒ zuótiān kàn le diànyǐng." }, { hanzi: "我昨天想看电影。", pinyin: "Wǒ zuótiān xiǎng kàn diànyǐng." }, { hanzi: "我昨天看电影吗？", pinyin: "Wǒ zuótiān kàn diànyǐng ma?" }], answer: "我昨天看了电影。", explain: "The question asks for a completed event, so mark 看 with 了." },
    { id: "s10-g-le-completed-reply-1", kind: "reply", wordIds: ["hsk1-083", "hsk1-134", "hsk1-055"], scene: "Now report a different completed event: you went to the hospital.", line: { hanzi: "你下午做了什么？", pinyin: "Nǐ xiàwǔ zuò le shénme?" }, choices: [{ hanzi: "我下午去了医院。", pinyin: "Wǒ xiàwǔ qù le yīyuàn." }, { hanzi: "我下午想去医院。", pinyin: "Wǒ xiàwǔ xiǎng qù yīyuàn." }, { hanzi: "医院在下午。", pinyin: "Yīyuàn zài xiàwǔ." }], answer: "我下午去了医院。", explain: "去了 reports that the trip actually happened; 想去 only reports an intention." },
  ],
};

export const stage10: Stage = {
  id: "hsk1-stage-10", index: 10, title: "A day in your life", hanziTitle: "生活", scenario: "A phone call recapping a busy day.",
  description: "Handle a basic phone call, distinguish looking from seeing, and report completed actions with 了.", wordIds: STAGE_WORD_IDS[10], grammarLessonIds: STAGE_GRAMMAR[10],
  dialogue: [
    { speaker: "李华", hanzi: "喂，你好！你今天做了什么？", pinyin: "Wèi, nǐ hǎo! Nǐ jīntiān zuò le shénme?", english: "Hello? What did you do today?" },
    { speaker: "王明", hanzi: "上午我打电话了。", pinyin: "Shàngwǔ wǒ dǎ diànhuà le.", english: "I made a phone call this morning." },
    { speaker: "李华", hanzi: "下午呢？", pinyin: "Xiàwǔ ne?", english: "How about the afternoon?" },
    { speaker: "王明", hanzi: "下午我看了电影。", pinyin: "Xiàwǔ wǒ kàn le diànyǐng.", english: "I watched a movie this afternoon." },
    { speaker: "李华", hanzi: "你看电视了吗？", pinyin: "Nǐ kàn diànshì le ma?", english: "Did you watch TV?" },
    { speaker: "王明", hanzi: "没有，我去了医院。", pinyin: "Méiyǒu, wǒ qù le yīyuàn.", english: "No, I went to the hospital." },
    { speaker: "李华", hanzi: "你看见医生了吗？", pinyin: "Nǐ kànjian yīsheng le ma?", english: "Did you see the doctor?" },
    { speaker: "王明", hanzi: "看见了。现在十点，我想睡觉。", pinyin: "Kànjian le. Xiànzài shí diǎn, wǒ xiǎng shuìjiào.", english: "Yes. It is ten now, and I want to sleep." },
  ], teach: vocab.teach, blocks: [...vocab.blocks, grammar],
  checkpoint: [
    { id: "s10-check-0", kind: "choice", direction: "hanzi-en", wordIds: ["hsk1-013"], question: "打电话", questionPinyin: "dǎ diànhuà", choices: ["make a call", "watch TV", "see a doctor", "go to sleep"], answer: "make a call" },
    { id: "s10-check-1", kind: "listen", wordIds: ["hsk1-134"], text: "医院", pinyin: "yīyuàn", choices: ["医院", "医生", "电影", "电视"], answer: "医院", translation: "hospital" },
    { id: "s10-check-2", kind: "match", matchType: "meaning", wordIds: ["hsk1-018", "hsk1-019", "hsk1-133", "hsk1-134"], pairs: [{ hanzi: "电视", match: "television" }, { hanzi: "电影", match: "movie" }, { hanzi: "医生", match: "doctor" }, { hanzi: "医院", match: "hospital" }] },
    { id: "s10-check-3", kind: "cloze", wordIds: ["hsk1-055", "hsk1-050", "hsk1-019"], sentence: "我昨天看＿电影。", translation: "I watched a movie yesterday.", choices: ["了", "吗", "的"], answer: "了" },
    { id: "s10-check-4", kind: "order", wordIds: ["hsk1-037", "hsk1-010"], tiles: ["我", "中午", "喝", "茶"], translation: "I drink tea at noon.", pinyin: "Wǒ zhōngwǔ hē chá." },
    { id: "s10-check-5", kind: "reply", wordIds: ["hsk1-140", "hsk1-083", "hsk1-043", "hsk1-149", "hsk1-012"], scene: "Review travel: say you go to the station by taxi.", line: { hanzi: "你怎么去火车站？", pinyin: "Nǐ zěnme qù huǒchēzhàn?" }, choices: [{ hanzi: "我坐出租车去。", pinyin: "Wǒ zuò chūzūchē qù." }, { hanzi: "我在出租车去。", pinyin: "Wǒ zài chūzūchē qù." }, { hanzi: "出租车是火车站。", pinyin: "Chūzūchē shì huǒchēzhàn." }], answer: "我坐出租车去。" },
    { id: "s10-check-6", kind: "reply", wordIds: ["hsk1-121", "hsk1-011", "hsk1-066"], scene: "Review ordering: request rice.", line: { hanzi: "你想吃什么？", pinyin: "Nǐ xiǎng chī shénme?" }, choices: [{ hanzi: "我想吃米饭。", pinyin: "Wǒ xiǎng chī mǐfàn." }, { hanzi: "我想喝米饭。", pinyin: "Wǒ xiǎng hē mǐfàn." }, { hanzi: "米饭是我。", pinyin: "Mǐfàn shì wǒ." }], answer: "我想吃米饭。" },
    { id: "s10-check-7", kind: "cloze", wordIds: ["hsk1-039", "hsk1-056", "hsk1-108"], sentence: "今天天气＿冷。", translation: "The weather is cold today.", choices: ["很", "是", "有"], answer: "很" },
    { id: "s10-check-8", kind: "order", wordIds: ["hsk1-050", "hsk1-019", "hsk1-055"], tiles: ["我", "昨天", "看", "了", "电影"], translation: "I watched a movie yesterday.", pinyin: "Wǒ zuótiān kàn le diànyǐng." },
    { id: "s10-check-9", kind: "reply", wordIds: ["hsk1-051", "hsk1-133", "hsk1-055"], scene: "Confirm that you saw the doctor.", line: { hanzi: "你看见医生了吗？", pinyin: "Nǐ kànjian yīsheng le ma?" }, choices: [{ hanzi: "看见了。", pinyin: "Kànjian le." }, { hanzi: "想看医生。", pinyin: "Xiǎng kàn yīsheng." }, { hanzi: "医生看见吗？", pinyin: "Yīsheng kànjian ma?" }], answer: "看见了。" },
  ],
};
