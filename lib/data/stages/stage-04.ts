import { STAGE_GRAMMAR, STAGE_WORD_IDS } from "./allocation";
import { buildAuthoredVocabulary } from "./authored-content";
import type { ExerciseBlock, Stage } from "./types";

const vocab = buildAuthoredVocabulary(4, STAGE_WORD_IDS[4], {
  "hsk1-047": { note: "今天 means today and normally appears before the action or description.", example: { hanzi: "今天星期三。", pinyin: "Jīntiān xīngqīsān.", english: "Today is Wednesday." } },
  "hsk1-068": { note: "明天 means tomorrow.", example: { hanzi: "明天星期四。", pinyin: "Míngtiān xīngqīsì.", english: "Tomorrow is Thursday." } },
  "hsk1-148": { note: "昨天 means yesterday.", example: { hanzi: "昨天星期二。", pinyin: "Zuótiān xīngqī'èr.", english: "Yesterday was Tuesday." } },
  "hsk1-120": { note: "现在 locates something at the present moment: now.", example: { hanzi: "现在三点。", pinyin: "Xiànzài sān diǎn.", english: "It is three o'clock now." } },
  "hsk1-095": { note: "时候 means a time or moment; 什么时候 asks when.", example: { hanzi: "什么时候？", pinyin: "Shénme shíhou?", english: "When?" } },
  "hsk1-091": { note: "上午 covers the morning before noon.", example: { hanzi: "现在是上午。", pinyin: "Xiànzài shì shàngwǔ.", english: "It is morning now." } },
  "hsk1-144": { note: "中午 is noon and the time around midday.", example: { hanzi: "现在是中午。", pinyin: "Xiànzài shì zhōngwǔ.", english: "It is noon now." } },
  "hsk1-117": { note: "下午 is the afternoon; put it before the clock time.", example: { hanzi: "现在是下午三点。", pinyin: "Xiànzài shì xiàwǔ sān diǎn.", english: "It is 3 p.m. now." } },
  "hsk1-127": { note: "星期 plus a number names weekdays: 星期一 through 星期六.", example: { hanzi: "今天星期一。", pinyin: "Jīntiān xīngqīyī.", english: "Today is Monday." } },
  "hsk1-074": { note: "年 follows a year number.", example: { hanzi: "二零二六年。", pinyin: "Èr líng èr liù nián.", english: "The year 2026." } },
  "hsk1-137": { note: "月 follows the month number: 三月 is March.", example: { hanzi: "三月。", pinyin: "Sānyuè.", english: "March." } },
  "hsk1-087": { note: "日 is the formal written word for the day of a date.", example: { hanzi: "三月五日。", pinyin: "Sānyuè wǔ rì.", english: "March fifth." } },
  "hsk1-090": { note: "上 means up, above, or previous; 上个星期 is last week.", example: { hanzi: "上个星期。", pinyin: "Shàng ge xīngqī.", english: "Last week." } },
  "hsk1-116": { note: "下 means down, below, or next; 下个星期 is next week.", example: { hanzi: "下个星期。", pinyin: "Xià ge xīngqī.", english: "Next week." } },
});

const calendarPractice: ExerciseBlock = {
  id: "s4-calendar-use", title: "Read the calendar and answer", kind: "vocab",
  exercises: [
    { id: "s4-calendar-order-0", kind: "order", wordIds: ["hsk1-047", "hsk1-127", "hsk1-088"], tiles: ["今天", "星期", "三"], translation: "Today is Wednesday.", pinyin: "Jīntiān xīngqīsān." },
    { id: "s4-calendar-cloze-0", kind: "cloze", wordIds: ["hsk1-117", "hsk1-120"], sentence: "现在是＿三点。", translation: "It is 3 p.m. now.", choices: ["下午", "上午", "中午"], answer: "下午", explain: "下午 before 三点 makes the time unambiguously p.m." },
    { id: "s4-calendar-order-1", kind: "order", wordIds: ["hsk1-137", "hsk1-087"], tiles: ["三", "月", "五", "日"], translation: "March fifth.", pinyin: "Sānyuè wǔ rì." },
    { id: "s4-calendar-cloze-1", kind: "cloze", wordIds: ["hsk1-090", "hsk1-127"], sentence: "＿个星期", translation: "last week", choices: ["上", "下", "现在"], answer: "上" },
    { id: "s4-calendar-reply-0", kind: "reply", wordIds: ["hsk1-047", "hsk1-127", "hsk1-131"], scene: "Someone asks what weekday it is. The calendar shows Monday.", line: { hanzi: "今天星期几？", pinyin: "Jīntiān xīngqījǐ?" }, choices: [{ hanzi: "今天星期一。", pinyin: "Jīntiān xīngqīyī." }, { hanzi: "现在一点。", pinyin: "Xiànzài yī diǎn." }, { hanzi: "明天星期一吗？", pinyin: "Míngtiān xīngqīyī ma?" }], answer: "今天星期一。", explain: "Answer the same time frame: 今天 + 星期 + number." },
    { id: "s4-calendar-reply-1", kind: "reply", wordIds: ["hsk1-120", "hsk1-091", "hsk1-048", "hsk1-016"], scene: "It is 9 a.m. Tell a friend the current time.", line: { hanzi: "现在几点？", pinyin: "Xiànzài jǐ diǎn?" }, choices: [{ hanzi: "现在上午九点。", pinyin: "Xiànzài shàngwǔ jiǔ diǎn." }, { hanzi: "今天九日。", pinyin: "Jīntiān jiǔ rì." }, { hanzi: "明天上午吗？", pinyin: "Míngtiān shàngwǔ ma?" }], answer: "现在上午九点。", explain: "Place 上午 before the clock time." },
  ],
};

export const stage04: Stage = {
  id: "hsk1-stage-04", index: 4, title: "Days, dates & your week", hanziTitle: "日期",
  scenario: "Checking a calendar together before making plans.",
  description: "Name days, dates, parts of the day, and answer calendar questions without translating English word order.",
  wordIds: STAGE_WORD_IDS[4], grammarLessonIds: STAGE_GRAMMAR[4],
  dialogue: [
    { speaker: "李华", hanzi: "今天星期几？", pinyin: "Jīntiān xīngqījǐ?", english: "What day is it today?" },
    { speaker: "王明", hanzi: "今天星期三。", pinyin: "Jīntiān xīngqīsān.", english: "Today is Wednesday." },
    { speaker: "李华", hanzi: "今天几月几日？", pinyin: "Jīntiān jǐ yuè jǐ rì?", english: "What is today's date?" },
    { speaker: "王明", hanzi: "今天三月五日。", pinyin: "Jīntiān sānyuè wǔ rì.", english: "Today is March fifth." },
    { speaker: "李华", hanzi: "明天几月几日？", pinyin: "Míngtiān jǐ yuè jǐ rì?", english: "What date is tomorrow?" },
    { speaker: "王明", hanzi: "明天三月六日，星期四。", pinyin: "Míngtiān sānyuè liù rì, xīngqīsì.", english: "Tomorrow is Thursday, March sixth." },
    { speaker: "李华", hanzi: "现在几点？", pinyin: "Xiànzài jǐ diǎn?", english: "What time is it now?" },
    { speaker: "王明", hanzi: "现在是下午三点。", pinyin: "Xiànzài shì xiàwǔ sān diǎn.", english: "It is 3 p.m. now." },
  ],
  teach: vocab.teach, blocks: [...vocab.blocks, calendarPractice],
  checkpoint: [
    { id: "s4-check-0", kind: "choice", direction: "hanzi-en", wordIds: ["hsk1-148"], question: "昨天", questionPinyin: "zuótiān", choices: ["yesterday", "today", "tomorrow", "now"], answer: "yesterday" },
    { id: "s4-check-1", kind: "listen", wordIds: ["hsk1-144"], text: "中午", pinyin: "zhōngwǔ", choices: ["中午", "上午", "下午", "现在"], answer: "中午", translation: "noon" },
    { id: "s4-check-2", kind: "match", matchType: "meaning", wordIds: ["hsk1-047", "hsk1-068", "hsk1-148", "hsk1-120"], pairs: [{ hanzi: "今天", match: "today" }, { hanzi: "明天", match: "tomorrow" }, { hanzi: "昨天", match: "yesterday" }, { hanzi: "现在", match: "now" }] },
    { id: "s4-check-3", kind: "cloze", wordIds: ["hsk1-137", "hsk1-087"], sentence: "三月五＿。", translation: "March fifth.", choices: ["日", "年", "星期"], answer: "日" },
    { id: "s4-check-4", kind: "order", wordIds: ["hsk1-068", "hsk1-127", "hsk1-103"], tiles: ["明天", "星期", "四"], translation: "Tomorrow is Thursday.", pinyin: "Míngtiān xīngqīsì." },
    { id: "s4-check-5", kind: "reply", wordIds: ["hsk1-047", "hsk1-127", "hsk1-088"], scene: "The calendar shows Wednesday.", line: { hanzi: "今天星期几？", pinyin: "Jīntiān xīngqījǐ?" }, choices: [{ hanzi: "今天星期三。", pinyin: "Jīntiān xīngqīsān." }, { hanzi: "现在三点。", pinyin: "Xiànzài sān diǎn." }, { hanzi: "今天三月。", pinyin: "Jīntiān sānyuè." }], answer: "今天星期三。" },
    { id: "s4-check-6", kind: "choice", direction: "en-hanzi", wordIds: ["hsk1-095"], question: "time / moment", choices: ["时候", "星期", "现在", "下午"], answer: "时候" },
    { id: "s4-check-7", kind: "reply", wordIds: ["hsk1-120", "hsk1-117", "hsk1-088", "hsk1-016"], scene: "Tell someone it is 3 p.m.", line: { hanzi: "现在几点？", pinyin: "Xiànzài jǐ diǎn?" }, choices: [{ hanzi: "现在下午三点。", pinyin: "Xiànzài xiàwǔ sān diǎn." }, { hanzi: "今天三日。", pinyin: "Jīntiān sān rì." }, { hanzi: "下午星期三。", pinyin: "Xiàwǔ xīngqīsān." }], answer: "现在下午三点。" },
  ],
};
