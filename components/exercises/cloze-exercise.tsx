"use client";

import { useEffect, useMemo, useState } from "react";
import type { ClozeExercise } from "@/lib/data/stages/types";
import { cn } from "@/lib/utils";
import {
  hashSeed,
  optionClass,
  seededShuffle,
  type ExerciseChildProps,
} from "./utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";

export function ClozeExerciseView({
  exercise,
  phase,
  onAnswer,
}: ExerciseChildProps<ClozeExercise>) {
  const [selected, setSelected] = useState<string | null>(null);
  const choices = useMemo(
    () => seededShuffle(exercise.choices, hashSeed(exercise.id)),
    [exercise.id, exercise.choices],
  );
  const answering = phase === "answering";
  const filled = selected ?? (answering ? null : exercise.answer);

  useEffect(() => {
    if (!answering) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) {
        setSelected(choices[n - 1]);
        onAnswer(choices[n - 1] === exercise.answer);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answering, choices, exercise.answer, onAnswer]);

  const [before, after] = exercise.sentence.split("＿");

  return (
    <div>
      <p className="text-sm text-muted-foreground">Fill the blank</p>
      <p className={cn("mt-3 text-3xl leading-relaxed sm:text-4xl", hanziFont)}>
        {before}
        <span
          className={cn(
            "mx-1 inline-block min-w-[1.5em] rounded-md border-b-2 px-1 text-center align-baseline",
            filled
              ? answering || filled === exercise.answer
                ? "border-primary text-primary"
                : "border-red-600 text-red-600 line-through"
              : "border-muted-foreground/50 text-transparent",
          )}
        >
          {filled ?? "＿"}
        </span>
        {after}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {exercise.translation}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {choices.map((c, i) => {
          const state = answering
            ? selected === c
              ? "selected"
              : "idle"
            : c === exercise.answer
              ? "correct"
              : c === selected
                ? "wrong"
                : "idle";
          return (
            <button
              key={c}
              type="button"
              disabled={!answering}
              className={cn(
                optionClass(state),
                "w-auto px-5 text-xl",
                hanziFont,
              )}
              onClick={() => {
                setSelected(c);
                onAnswer(c === exercise.answer);
              }}
            >
              <span className="mr-2 align-middle text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
