"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Check,
  Headphones,
  MessageSquareText,
  Shapes,
} from "lucide-react";
import type { Stage } from "@/lib/data/stages/types";
import {
  GRAMMAR_LESSONS,
  hanziRequirementsForGrammar,
} from "@/lib/data/grammar";
import { findWord, type HskWord } from "@/lib/hsk";
import {
  makeHanziLessonMatchPractice,
  makeHanziLessonSoundPractice,
  makeHanziLessonUsePractice,
} from "@/lib/hanzi-practice";
import { hanziLessonStats, loadProgress } from "@/lib/progression";
import {
  ExercisePlayer,
  type PlayerResults,
} from "@/components/exercises/exercise-player";
import { cn } from "@/lib/utils";

type Phase = "overview" | "form" | "sound" | "use" | "done";

const hanziFont = "font-[family-name:var(--font-hanzi-display)]";
const displayFont = "font-[family-name:var(--font-display)]";

const PHASES = [
  { id: "form", label: "Form + meaning", icon: Shapes },
  { id: "sound", label: "Sound", icon: Headphones },
  { id: "use", label: "Use in context", icon: MessageSquareText },
] as const;

export function HanziLab({
  stage,
  onDone,
}: {
  stage: Stage;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("overview");
  const [results, setResults] = useState<Partial<Record<Phase, PlayerResults>>>({});
  const seed = (stage.level ?? 1) * 100 + stage.index;
  const words = stage.wordIds
    .map(findWord)
    .filter((word): word is HskWord => Boolean(word));
  const grammarLessons = stage.grammarLessonIds
    .map((id) => GRAMMAR_LESSONS.find((lesson) => lesson.id === id))
    .filter((lesson): lesson is (typeof GRAMMAR_LESSONS)[number] => Boolean(lesson));
  const grammarWordIds = new Set(
    grammarLessons.flatMap((lesson) =>
      hanziRequirementsForGrammar(lesson.id).map(
        (requirement) => requirement.wordId,
      ),
    ),
  );
  const exercises = useMemo(
    () => ({
      form: makeHanziLessonMatchPractice(stage.wordIds, seed),
      sound: makeHanziLessonSoundPractice(stage.wordIds, seed),
      use: makeHanziLessonUsePractice(stage.id, seed),
    }),
    [seed, stage.id, stage.wordIds],
  );

  function finishPhase(current: "form" | "sound" | "use", result: PlayerResults) {
    setResults((value) => ({ ...value, [current]: result }));
    setPhase(current === "form" ? "sound" : current === "sound" ? "use" : "done");
  }

  if (phase === "overview") {
    return (
      <div>
        <div className="grid gap-5 border border-foreground bg-[oklch(var(--poster-yellow)/0.15)] p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">
              Full-coverage Hanzi lab
            </p>
            <h3 className={cn("mt-2 text-2xl font-bold", displayFont)}>
              Test every form before grammar
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              This lesson tests all {words.length} allocated forms: connect each
              form to meaning and pinyin, retrieve every form from audio, then
              use every form in a sentence or reply.
            </p>
          </div>
          <Link
            href={`/hanzi?lesson=${stage.id}`}
            className="inline-flex min-h-11 items-center gap-2 border border-foreground bg-card px-4 py-2 text-sm font-bold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BookOpenText className="h-4 w-4" /> Open Hanzi courtyard
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {words.map((word) => (
            <div
              key={word.id}
              className={cn(
                "min-h-24 border bg-card p-3",
                grammarWordIds.has(word.id)
                  ? "border-primary bg-primary/5"
                  : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={cn("text-3xl leading-none", hanziFont)}>
                  {word.hanzi}
                </span>
                {grammarWordIds.has(word.id) && (
                  <span className="border border-primary/40 px-1.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-wide text-primary">
                    grammar key
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs font-semibold text-primary">{word.pinyin}</p>
              <p className="mt-0.5 line-clamp-2 text-[0.68rem] text-muted-foreground">
                {word.meaning}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {PHASES.map(({ id, label, icon: Icon }) => (
            <div key={id} className="flex min-h-16 items-center gap-3 border border-border bg-background px-3 py-2">
              <Icon className="h-4 w-4 text-primary" />
              <span>
                <strong className="block text-xs">{label}</strong>
                <small className="text-[0.68rem] text-muted-foreground">
                  {exercises[id].length} exercises
                </small>
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setPhase("form")}
          className="mt-6 inline-flex min-h-12 items-center gap-2 bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Start all-form Hanzi lab <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const stats = hanziLessonStats(stage.wordIds, loadProgress());
    const totals = Object.values(results).reduce(
      (summary, result) => ({
        total: summary.total + (result?.total ?? 0),
        correct: summary.correct + (result?.firstTryCorrect ?? 0),
      }),
      { total: 0, correct: 0 },
    );
    return (
      <div className="border border-green-700/40 bg-green-700/5 p-6 sm:p-8">
        <Check className="h-7 w-7 text-green-700 dark:text-green-500" />
        <h3 className={cn("mt-3 text-2xl font-bold", displayFont)}>
          Hanzi lab complete
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {totals.correct} / {totals.total} exercises correct on the first try.
          You now have {stats.evidence.formMeaning}% form evidence, {stats.evidence.sound}%
          sound evidence, and {stats.evidence.use}% contextual-use evidence across
          this lesson’s {stats.total} forms.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-6 inline-flex min-h-12 items-center gap-2 bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Continue to vocabulary and grammar <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const active = PHASES.find((item) => item.id === phase);
  return (
    <div>
      <div className="mb-4 grid grid-cols-3 border border-foreground" aria-label="Hanzi lab progress">
        {PHASES.map(({ id, label, icon: Icon }, index) => {
          const activeIndex = PHASES.findIndex((item) => item.id === phase);
          const done = index < activeIndex;
          return (
            <div
              key={id}
              className={cn(
                "flex min-h-14 items-center justify-center gap-2 px-2 text-center text-xs font-bold",
                index > 0 && "border-l border-foreground",
                id === phase
                  ? "bg-primary text-primary-foreground"
                  : done
                    ? "bg-green-700/10 text-green-800 dark:text-green-400"
                    : "bg-card text-muted-foreground",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              <span className="hidden sm:inline">{label}</span>
            </div>
          );
        })}
      </div>
      <ExercisePlayer
        key={`${stage.id}-${phase}`}
        title={`${stage.title} · ${active?.label ?? "Hanzi"}`}
        exercises={exercises[phase]}
        mode="practice"
        onFinish={(result) => finishPhase(phase, result)}
      />
    </div>
  );
}
