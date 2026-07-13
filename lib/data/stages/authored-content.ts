import { findWord, type HskWord } from "@/lib/hsk";
import type {
  ChoiceExercise,
  ExerciseBlock,
  ListenExercise,
  MatchExercise,
  TeachCard,
} from "./types";

export interface AuthoredTeaching {
  note: string;
  example: { hanzi: string; pinyin: string; english: string };
}

function meaning(word: HskWord): string {
  return word.meaning.split(";")[0].trim();
}

function words(ids: string[]): HskWord[] {
  return ids.map((id) => {
    const word = findWord(id);
    if (!word) throw new Error(`Unknown HSK word: ${id}`);
    return word;
  });
}

function groupsOfAtMostFive<T>(items: T[]): T[][] {
  const count = Math.ceil(items.length / 5);
  const base = Math.floor(items.length / count);
  let extra = items.length % count;
  const groups: T[][] = [];
  let cursor = 0;
  for (let i = 0; i < count; i++) {
    const size = base + (extra-- > 0 ? 1 : 0);
    groups.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  return groups;
}

function distractorsFor(word: HskWord, pool: HskWord[]): HskWord[] {
  const start = pool.findIndex((item) => item.id === word.id);
  const out: HskWord[] = [];
  for (let offset = 1; out.length < 3; offset++) {
    const candidate = pool[(start + offset) % pool.length];
    if (
      candidate.id !== word.id &&
      !out.some((item) => item.id === candidate.id) &&
      meaning(candidate) !== meaning(word) &&
      !out.some((item) => meaning(item) === meaning(candidate))
    ) {
      out.push(candidate);
    }
  }
  return out;
}

/**
 * Builds the stable vocabulary-drill shell around editorially authored teach
 * examples. IDs intentionally match the original foundation-stage drills so
 * saved first-attempt and SRS records continue to point at the same items.
 */
export function buildAuthoredVocabulary(
  stageIndex: number,
  wordIds: string[],
  teaching: Record<string, AuthoredTeaching>,
): { teach: TeachCard[]; blocks: ExerciseBlock[] } {
  const stageWords = words(wordIds);
  const teach = stageWords.map((word) => {
    const authored = teaching[word.id];
    if (!authored) throw new Error(`Stage ${stageIndex}: missing authored teaching for ${word.id}`);
    return { wordId: word.id, ...authored };
  });

  const blocks: ExerciseBlock[] = [];
  groupsOfAtMostFive(stageWords).forEach((group, groupIndex) => {
    const recognition: ChoiceExercise[] = group.map((word, itemIndex) => {
      const distractors = distractorsFor(word, stageWords);
      return {
        id: `s${stageIndex}-v${groupIndex}-rec-${itemIndex}`,
        kind: "choice",
        direction: "hanzi-en",
        wordIds: [word.id],
        question: word.hanzi,
        questionPinyin: word.pinyin,
        choices: [meaning(word), ...distractors.map(meaning)],
        answer: meaning(word),
        explain: `${word.hanzi} (${word.pinyin}) — ${teaching[word.id].note}`,
      };
    });
    const match: MatchExercise = {
      id: `s${stageIndex}-v${groupIndex}-match`,
      kind: "match",
      matchType: "pinyin",
      wordIds: group.map((word) => word.id),
      pairs: group.map((word) => ({ hanzi: word.hanzi, match: word.pinyin })),
    };
    blocks.push({
      id: `s${stageIndex}-vocab-${groupIndex + 1}a`,
      title: `Words in context ${groupIndex + 1} · notice`,
      kind: "vocab",
      exercises: [...recognition, match],
    });

    const recall: (ChoiceExercise | ListenExercise)[] = [];
    group.forEach((word, itemIndex) => {
      const distractors = distractorsFor(word, stageWords);
      recall.push({
        id: `s${stageIndex}-v${groupIndex}-pro-${itemIndex}`,
        kind: "choice",
        direction: "en-hanzi",
        wordIds: [word.id],
        question: meaning(word),
        choices: [word.hanzi, ...distractors.map((item) => item.hanzi)],
        answer: word.hanzi,
        explain: teaching[word.id].example.hanzi,
      });
      recall.push({
        id: `s${stageIndex}-v${groupIndex}-lis-${itemIndex}`,
        kind: "listen",
        wordIds: [word.id],
        text: word.hanzi,
        pinyin: word.pinyin,
        choices: [word.hanzi, ...distractors.map((item) => item.hanzi)],
        answer: word.hanzi,
        translation: meaning(word),
        explain: teaching[word.id].example.hanzi,
      });
    });
    blocks.push({
      id: `s${stageIndex}-vocab-${groupIndex + 1}b`,
      title: `Words in context ${groupIndex + 1} · retrieve`,
      kind: "vocab",
      exercises: recall,
    });
  });

  return { teach, blocks };
}
