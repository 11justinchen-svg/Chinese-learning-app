// Stage registry — owned by the foundation. Content workers rewrite their own
// stage-NN.ts file and never touch this one.
import type { Exercise, ReplyExercise, Stage } from "./types";
import { stage01 } from "./stage-01";
import { stage02 } from "./stage-02";
import { stage03 } from "./stage-03";
import { stage04 } from "./stage-04";
import { stage05 } from "./stage-05";
import { stage06 } from "./stage-06";
import { stage07 } from "./stage-07";
import { stage08 } from "./stage-08";
import { stage09 } from "./stage-09";
import { stage10 } from "./stage-10";
import { HSK2_STAGES } from "./hsk2";

const HSK1_SOURCE_STAGES: Stage[] = [
  stage01,
  stage02,
  stage03,
  stage04,
  stage05,
  stage06,
  stage07,
  stage08,
  stage09,
  stage10,
];

const REPLY_OVERRIDES: Record<string, { hanzi: string; pinyin: string }> = {
  "老师好！": { hanzi: "你好，老师！", pinyin: "Nǐ hǎo, lǎoshī!" },
  "这是我的狗。": { hanzi: "我的狗。", pinyin: "Wǒ de gǒu." },
  "九点。": { hanzi: "九点", pinyin: "Jiǔ diǎn" },
  "六点。": { hanzi: "六点", pinyin: "Liù diǎn" },
  "太漂亮了！": { hanzi: "衣服太漂亮了！", pinyin: "Yīfu tài piàoliang le!" },
  "在椅子上。": { hanzi: "椅子上。", pinyin: "Yǐzi shàng." },
  "没关系。": { hanzi: "没关系！", pinyin: "Méi guānxi!" },
  "认识你很高兴。": {
    hanzi: "很高兴认识你。",
    pinyin: "Hěn gāoxìng rènshi nǐ.",
  },
  "看见了。": { hanzi: "我看见了。", pinyin: "Wǒ kànjian le." },
};

const SHORTENABLE_PREFIXES = [
  { hanzi: "是，", pinyin: /^Shì,?\s*/i },
  { hanzi: "我们", pinyin: /^Wǒmen\s*/i },
  { hanzi: "我", pinyin: /^Wǒ\s*/i },
  { hanzi: "今天", pinyin: /^Jīntiān\s*/i },
  { hanzi: "现在", pinyin: /^Xiànzài\s*/i },
  { hanzi: "这些", pinyin: /^Zhèxiē\s*/i },
  { hanzi: "这个", pinyin: /^Zhè\s*ge\s*|^Zhège\s*/i },
  { hanzi: "她", pinyin: /^Tā\s*/i },
];

function flexibleReply(exercise: ReplyExercise): ReplyExercise {
  if ((exercise.answers?.length ?? 0) >= 2) return exercise;
  const authored = exercise.choices.find((choice) => choice.hanzi === exercise.answer);
  if (!authored) return exercise;
  let alternative = REPLY_OVERRIDES[exercise.answer];
  if (!alternative) {
    const prefix = SHORTENABLE_PREFIXES.find((item) => exercise.answer.startsWith(item.hanzi));
    if (prefix) {
      alternative = {
        hanzi: exercise.answer.slice(prefix.hanzi.length),
        pinyin: authored.pinyin.replace(prefix.pinyin, ""),
      };
    }
  }
  if (!alternative || alternative.hanzi === exercise.answer) return exercise;
  return {
    ...exercise,
    choices: [...exercise.choices, alternative],
    answers: [exercise.answer, alternative.hanzi],
  };
}

function flexibleExercise(exercise: Exercise): Exercise {
  return exercise.kind === "reply" ? flexibleReply(exercise) : exercise;
}

function openFastStage(stage: Stage): Stage {
  return {
    ...stage,
    level: 1 as const,
    estimatedMinutes:
      24 + Math.ceil(stage.wordIds.length / 2) + stage.grammarLessonIds.length * 3,
    goal: stage.goal ?? stage.scenario,
    blocks: stage.blocks.map((block) => ({
      ...block,
      exercises: block.exercises.map(flexibleExercise),
    })),
    checkpoint: stage.checkpoint.map(flexibleExercise),
  };
}

export const HSK1_STAGES: Stage[] = HSK1_SOURCE_STAGES.map(openFastStage);

export { HSK2_STAGES };

export const STAGES: Stage[] = [...HSK1_STAGES, ...HSK2_STAGES];

export function stagesForLevel(level: 1 | 2): Stage[] {
  return level === 1 ? HSK1_STAGES : HSK2_STAGES;
}

export function findStage(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}

export function stageForWord(wordId: string): Stage | undefined {
  return STAGES.find((s) => s.wordIds.includes(wordId));
}
