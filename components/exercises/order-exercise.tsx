"use client";

import { useMemo, useState } from "react";
import type { OrderExercise } from "@/lib/data/stages/types";
import { cn } from "@/lib/utils";
import { hashSeed, seededShuffle, type ExerciseChildProps } from "./utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

interface Tile {
  key: number;
  text: string;
}

export function OrderExerciseView({
  exercise,
  phase,
  onAnswer,
}: ExerciseChildProps<OrderExercise>) {
  const bank = useMemo<Tile[]>(
    () =>
      seededShuffle(
        exercise.tiles.map((text, key) => ({ key, text })),
        hashSeed(exercise.id),
      ),
    [exercise.id, exercise.tiles],
  );
  const [placed, setPlaced] = useState<Tile[]>([]);
  const answering = phase === "answering";
  const remaining = bank.filter((t) => !placed.some((p) => p.key === t.key));
  const correct =
    placed.map((t) => t.text).join("") === exercise.tiles.join("");

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Build the sentence:{" "}
        <span className="text-foreground">{exercise.translation}</span>
      </p>

      {/* Answer row */}
      <div
        className={cn(
          "mt-4 flex min-h-[3.5rem] flex-wrap items-center gap-2 rounded-xl border border-dashed px-3 py-2",
          answering
            ? "border-border"
            : correct
              ? "border-green-600/60 bg-green-600/5"
              : "border-red-600/60 bg-red-600/5",
        )}
      >
        {placed.length === 0 && (
          <span className="text-sm text-muted-foreground">
            Tap the tiles below in order…
          </span>
        )}
        {placed.map((t) => (
          <button
            key={t.key}
            type="button"
            disabled={!answering}
            className={cn(
              "ex-pop rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xl",
              hanziFont,
              answering && "hover:bg-primary/20",
            )}
            onClick={() => setPlaced((p) => p.filter((x) => x.key !== t.key))}
          >
            {t.text}
          </button>
        ))}
      </div>

      {/* Tile bank */}
      <div className="mt-4 flex flex-wrap gap-2">
        {remaining.map((t) => (
          <button
            key={t.key}
            type="button"
            disabled={!answering}
            className={cn(
              "rounded-lg border border-border bg-card px-3 py-1.5 text-xl transition-colors hover:border-primary/50",
              hanziFont,
            )}
            onClick={() => setPlaced((p) => [...p, t])}
          >
            {t.text}
          </button>
        ))}
      </div>

      {!answering && (
        <p className={cn("mt-4 text-sm text-muted-foreground", displayFont)}>
          {exercise.tiles.join(" ")}
          {exercise.pinyin ? ` · ${exercise.pinyin}` : ""}
        </p>
      )}

      {answering && (
        <button
          type="button"
          disabled={remaining.length > 0}
          className={cn(
            "mt-5 rounded-xl px-6 py-3 text-sm font-semibold transition-colors",
            displayFont,
            remaining.length > 0
              ? "bg-secondary text-muted-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
          onClick={() => onAnswer(correct)}
        >
          Check
        </button>
      )}
    </div>
  );
}
