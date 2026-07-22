export type ExerciseKind =
  | "choice"
  | "cloze"
  | "order"
  | "match"
  | "reply"
  | "listen";

interface ExerciseBase {
  /** Globally unique, e.g. "s3-num-choice-2". */
  id: string;
  kind: ExerciseKind;
  /** Words credited when this exercise is answered correctly on the first try. */
  wordIds: string[];
  /** Shown in the feedback bar after checking. */
  explain?: string;
}

export interface ChoiceExercise extends ExerciseBase {
  kind: "choice";
  direction: "hanzi-en" | "en-hanzi";
  question: string;
  questionPinyin?: string;
  choices: string[];
  answer: string;
}

export interface ClozeExercise extends ExerciseBase {
  kind: "cloze";
  /** Uses "＿" (U+FF3F) as the single gap: "你是老师＿？" */
  sentence: string;
  translation: string;
  choices: string[];
  answer: string;
}

export interface OrderExercise extends ExerciseBase {
  kind: "order";
  /** Stored in correct order; the component shuffles them for display. */
  tiles: string[];
  translation: string;
  pinyin?: string;
}

export interface MatchExercise extends ExerciseBase {
  kind: "match";
  matchType: "pinyin" | "meaning";
  /** 3–6 pairs; both sides unique. */
  pairs: { hanzi: string; match: string }[];
}

export interface ReplyExercise extends ExerciseBase {
  kind: "reply";
  /** English scene context: "A shopkeeper greets you." */
  scene: string;
  line: { hanzi: string; pinyin: string };
  choices: { hanzi: string; pinyin: string }[];
  /** Hanzi of the correct choice. */
  answer: string;
  /** Other natural choices that accomplish the same communicative goal. */
  answers?: string[];
}

export interface ListenExercise extends ExerciseBase {
  kind: "listen";
  /** Spoken via zh-CN TTS; shown as pinyin when no Chinese voice exists. */
  text: string;
  pinyin: string;
  choices: string[];
  answer: string;
  translation?: string;
}

export type Exercise =
  | ChoiceExercise
  | ClozeExercise
  | OrderExercise
  | MatchExercise
  | ReplyExercise
  | ListenExercise;

export interface DialogueLine {
  speaker: string;
  hanzi: string;
  pinyin: string;
  english: string;
}

export interface TeachCard {
  wordId: string;
  note?: string;
  example?: { hanzi: string; pinyin: string; english: string };
}

export interface ExerciseBlock {
  id: string;
  title: string;
  kind: "vocab" | "grammar";
  /** Links into GRAMMAR_LESSONS when kind === "grammar". */
  grammarLessonId?: string;
  exercises: Exercise[];
}

export interface Stage {
  id: string; // "hsk1-stage-03"
  level?: 1 | 2;
  index: number; // 1..10
  title: string;
  hanziTitle: string;
  scenario: string;
  description: string;
  estimatedMinutes?: number;
  goal?: string;
  wordIds: string[];
  grammarLessonIds: string[];
  dialogue: DialogueLine[];
  teach: TeachCard[];
  blocks: ExerciseBlock[];
  /** 8–12 mixed exercises, run in quiz mode (no re-queue). */
  checkpoint: Exercise[];
}
