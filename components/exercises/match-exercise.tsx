"use client";

import { useMemo, useRef, useState } from "react";
import type { MatchExercise } from "@/lib/data/stages/types";
import { cn } from "@/lib/utils";
import { hashSeed, seededShuffle, type ExerciseChildProps } from "./utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";

export function MatchExerciseView({
  exercise,
  phase,
  onAnswer,
}: ExerciseChildProps<MatchExercise>) {
  const left = useMemo(
    () =>
      seededShuffle(
        exercise.pairs.map((p) => p.hanzi),
        hashSeed(exercise.id),
      ),
    [exercise.id, exercise.pairs],
  );
  const right = useMemo(
    () =>
      seededShuffle(
        exercise.pairs.map((p) => p.match),
        hashSeed(exercise.id) ^ 0x9e3779b9,
      ),
    [exercise.id, exercise.pairs],
  );
  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [selRight, setSelRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<{ l: string; r: string } | null>(
    null,
  );
  const mistakes = useRef(0);
  const answering = phase === "answering";

  function matchOf(hanzi: string): string {
    return exercise.pairs.find((p) => p.hanzi === hanzi)!.match;
  }

  function trySelect(l: string | null, r: string | null) {
    setSelLeft(l);
    setSelRight(r);
    if (!l || !r) return;
    if (matchOf(l) === r) {
      const next = new Set(matched).add(l);
      setMatched(next);
      setSelLeft(null);
      setSelRight(null);
      if (next.size === exercise.pairs.length) onAnswer(mistakes.current === 0);
    } else {
      mistakes.current += 1;
      setWrongFlash({ l, r });
      setTimeout(() => {
        setWrongFlash(null);
        setSelLeft(null);
        setSelRight(null);
      }, 450);
    }
  }

  const btn = (
    text: string,
    side: "l" | "r",
    isMatched: boolean,
    isSelected: boolean,
    isWrong: boolean,
  ) => (
    <button
      key={text}
      type="button"
      disabled={!answering || isMatched || wrongFlash !== null}
      className={cn(
        "w-full rounded-xl border px-3 py-2.5 text-center transition-colors",
        side === "l" ? cn("text-2xl", hanziFont) : "text-sm",
        isMatched
          ? "border-green-600/40 bg-green-600/10 text-muted-foreground"
          : isWrong
            ? "border-red-600/60 bg-red-600/10 ex-shake"
            : isSelected
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:border-primary/50",
      )}
      onClick={() =>
        side === "l" ? trySelect(text, selRight) : trySelect(selLeft, text)
      }
    >
      {text}
    </button>
  );

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Match each word to its{" "}
        {exercise.matchType === "pinyin" ? "pinyin" : "meaning"}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
        <div className="space-y-2">
          {left.map((h) =>
            btn(h, "l", matched.has(h), selLeft === h, wrongFlash?.l === h),
          )}
        </div>
        <div className="space-y-2">
          {right.map((m) => {
            const isMatched = [...matched].some((h) => matchOf(h) === m);
            return btn(m, "r", isMatched, selRight === m, wrongFlash?.r === m);
          })}
        </div>
      </div>
      {!answering && mistakes.current > 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          {mistakes.current} wrong tap{mistakes.current === 1 ? "" : "s"} — try
          to clear the board clean for credit.
        </p>
      )}
    </div>
  );
}
