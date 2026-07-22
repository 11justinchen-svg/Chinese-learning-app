"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Volume2, X } from "lucide-react";
import type { Exercise } from "@/lib/data/stages/types";
import { findWord } from "@/lib/hsk";
import {
  hanziProficiency,
  loadProgress,
  recordAnswer,
  saveProgress,
} from "@/lib/progression";
import { grade, loadSrs, saveSrs } from "@/lib/srs";
import { speak } from "@/lib/speech";
import { useMandarinSpeech } from "@/lib/use-mandarin-speech";
import { cn } from "@/lib/utils";
import { ChoiceExerciseView } from "./choice-exercise";
import { ClozeExerciseView } from "./cloze-exercise";
import { OrderExerciseView } from "./order-exercise";
import { MatchExerciseView } from "./match-exercise";
import { ReplyExerciseView } from "./reply-exercise";
import { ListenExerciseView } from "./listen-exercise";
import type { Phase } from "./utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

const MAX_REASKS = 2;

export interface PlayerResults {
  total: number;
  firstTryCorrect: number;
}

// What the learner should hear again in the feedback bar.
function spokenText(ex: Exercise): string | null {
  switch (ex.kind) {
    case "choice":
      return ex.direction === "hanzi-en" ? ex.question : ex.answer;
    case "cloze":
      return ex.sentence.replace("＿", ex.answer);
    case "order":
      return ex.tiles.join("");
    case "reply":
      return (ex.answers ?? [ex.answer]).join(" / ");
    case "listen":
      return ex.text;
    default:
      return null;
  }
}

function correctAnswerText(ex: Exercise): string {
  switch (ex.kind) {
    case "choice":
    case "listen":
      return ex.answer;
    case "cloze":
      return ex.sentence.replace("＿", ex.answer);
    case "order":
      return ex.tiles.join("");
    case "reply":
      return ex.answer;
    case "match":
      return "";
  }
}

export function ExercisePlayer({
  title,
  exercises,
  mode,
  onFinish,
}: {
  title: string;
  exercises: Exercise[];
  mode: "practice" | "quiz";
  onFinish: (results: PlayerResults) => void;
}) {
  const [queue, setQueue] = useState<Exercise[]>(exercises);
  const [pos, setPos] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [lastCorrect, setLastCorrect] = useState(false);
  const [done, setDone] = useState(false);
  const speech = useMandarinSpeech();
  const tts = speech === "ready";
  const firstTry = useRef<Record<string, boolean>>({});
  const reasks = useRef<Record<string, number>>({});
  const graded = useRef(false);

  const current = queue[pos];

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (phase !== "answering" || !current) return;
      setLastCorrect(correct);
      setPhase("checked");
      // First encounter of this exercise id → record the attempt.
      if (!(current.id in firstTry.current)) {
        firstTry.current[current.id] = correct;
        if (current.wordIds.length > 0) {
          const p = recordAnswer(
            loadProgress(),
            current.wordIds,
            current.kind,
            correct,
          );
          saveProgress(p);
        }
      }
      // Practice mode re-queues misses (bounded) so the session ends clean.
      if (!correct && mode === "practice") {
        const n = reasks.current[current.id] ?? 0;
        if (n < MAX_REASKS) {
          reasks.current[current.id] = n + 1;
          setQueue((q) => [...q, current]);
        }
      }
    },
    [phase, current, mode],
  );

  const advance = useCallback(() => {
    if (pos + 1 < queue.length) {
      setPos((p) => p + 1);
      setPhase("answering");
    } else {
      setDone(true);
    }
  }, [pos, queue.length]);

  // Enter advances from the feedback bar.
  useEffect(() => {
    if (phase !== "checked" || done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, done, advance]);

  // Session complete: fold first-attempt verdicts into the SRS exactly once
  // per word — a word is "good" only if no crediting exercise missed first try.
  useEffect(() => {
    if (!done || graded.current) return;
    graded.current = true;
    const verdicts = new Map<string, boolean>();
    for (const ex of exercises) {
      const ok = firstTry.current[ex.id] ?? false;
      for (const id of ex.wordIds)
        verdicts.set(id, (verdicts.get(id) ?? true) && ok);
    }
    let srs = loadSrs();
    for (const [id, good] of verdicts) srs = grade(srs, id, good);
    saveSrs(srs);
  }, [done, exercises]);

  if (done) {
    const total = exercises.length;
    const good = exercises.filter((e) => firstTry.current[e.id]).length;
    const progress = loadProgress();
    const wordIds = [...new Set(exercises.flatMap((e) => e.wordIds))];
    return (
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p
          className={cn(
            "text-xs uppercase tracking-[0.2em] text-primary",
            displayFont,
          )}
        >
          {title} · done
        </p>
        <p className={cn("mt-2 text-3xl font-bold", displayFont)}>
          {good} / {total} first try
        </p>
        {wordIds.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {wordIds.map((id) => {
              const w = findWord(id);
              if (!w) return null;
              const proficiency = hanziProficiency(id, progress);
              return (
                <span
                  key={id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm",
                    proficiency.status === "proficient"
                      ? "border-green-600/50 bg-green-600/10"
                      : "border-border bg-background",
                  )}
                >
                  <span className={cn("text-base", hanziFont)}>{w.hanzi}</span>
                  <span className="text-xs text-muted-foreground">
                    {proficiency.status} · {proficiency.score}%
                  </span>
                </span>
              );
            })}
          </div>
        )}
        <button
          type="button"
          className={cn(
            "mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
            displayFont,
          )}
          onClick={() => onFinish({ total, firstTryCorrect: good })}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (!current) return null;
  const speakable = tts ? spokenText(current) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Progress header */}
      <div className="flex items-center justify-between gap-4">
        <p
          className={cn(
            "truncate text-xs uppercase tracking-[0.2em] text-muted-foreground",
            displayFont,
          )}
        >
          {title}
        </p>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {Math.min(pos + 1, queue.length)} / {queue.length}
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${(pos / queue.length) * 100}%` }}
        />
      </div>

      <div className="mt-6">
        {current.kind === "choice" && (
          <ChoiceExerciseView
            key={`${current.id}-${pos}`}
            exercise={current}
            phase={phase}
            onAnswer={handleAnswer}
          />
        )}
        {current.kind === "cloze" && (
          <ClozeExerciseView
            key={`${current.id}-${pos}`}
            exercise={current}
            phase={phase}
            onAnswer={handleAnswer}
          />
        )}
        {current.kind === "order" && (
          <OrderExerciseView
            key={`${current.id}-${pos}`}
            exercise={current}
            phase={phase}
            onAnswer={handleAnswer}
          />
        )}
        {current.kind === "match" && (
          <MatchExerciseView
            key={`${current.id}-${pos}`}
            exercise={current}
            phase={phase}
            onAnswer={handleAnswer}
          />
        )}
        {current.kind === "reply" && (
          <ReplyExerciseView
            key={`${current.id}-${pos}`}
            exercise={current}
            phase={phase}
            onAnswer={handleAnswer}
          />
        )}
        {current.kind === "listen" && (
          <ListenExerciseView
            key={`${current.id}-${pos}`}
            exercise={current}
            phase={phase}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      {/* Feedback bar */}
      {phase === "checked" && (
        <div
          className={cn(
            "ex-feedback mt-6 flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3",
            lastCorrect
              ? "border-green-600/50 bg-green-600/10"
              : "border-red-600/50 bg-red-600/10",
          )}
        >
          {lastCorrect ? (
            <Check className="h-5 w-5 shrink-0 text-green-700 dark:text-green-500" />
          ) : (
            <X className="h-5 w-5 shrink-0 text-red-700 dark:text-red-500" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              {lastCorrect ? "Correct!" : "Not quite."}
            </p>
            {!lastCorrect && correctAnswerText(current) && (
              <p className="mt-0.5 text-sm">
                <span className="text-muted-foreground">Answer: </span>
                <span className={cn(hanziFont)}>
                  {correctAnswerText(current)}
                </span>
              </p>
            )}
            {current.explain && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {current.explain}
              </p>
            )}
          </div>
          {speakable && (
            <button
              type="button"
              aria-label="Hear it"
              className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => speak(speakable)}
            >
              <Volume2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            className={cn(
              "shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
              displayFont,
            )}
            onClick={advance}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
