"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import type { TeachCard } from "@/lib/data/stages/types";
import { findWord } from "@/lib/hsk";
import { canSpeakChinese, onVoicesReady, speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

export function TeachCards({
  cards,
  onWordSeen,
  onDone,
}: {
  cards: TeachCard[];
  onWordSeen: (wordId: string) => void;
  onDone: () => void;
}) {
  const [pos, setPos] = useState(0);
  const [tts, setTts] = useState(false);

  useEffect(() => {
    setTts(canSpeakChinese());
    return onVoicesReady(() => setTts(canSpeakChinese()));
  }, []);

  const card = cards[pos];
  const word = card ? findWord(card.wordId) : undefined;

  // Viewing a card marks the word as seen.
  useEffect(() => {
    if (card) onWordSeen(card.wordId);
  }, [card, onWordSeen]);

  if (!card || !word) return null;
  const last = pos === cards.length - 1;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          New words, one at a time.
        </p>
        <span className="text-xs tabular-nums text-muted-foreground">
          {pos + 1} / {cards.length}
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${((pos + 1) / cards.length) * 100}%` }}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-background p-6 text-center sm:p-8">
        <div className="flex items-center justify-center gap-3">
          <p className={cn("text-6xl sm:text-7xl", hanziFont)}>{word.hanzi}</p>
          {tts && (
            <button
              type="button"
              aria-label="Play word"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => speak(word.hanzi)}
            >
              <Volume2 className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className={cn("mt-3 text-xl text-muted-foreground", displayFont)}>
          {word.pinyin}
        </p>
        <p className="mt-1 text-lg font-semibold">{word.meaning}</p>
        {card.note && (
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            {card.note}
          </p>
        )}
        {card.example && (
          <div className="mx-auto mt-4 max-w-md rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <p className={cn("text-xl", hanziFont)}>{card.example.hanzi}</p>
              {tts && (
                <button
                  type="button"
                  aria-label="Play example"
                  className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  onClick={() => speak(card.example!.hanzi)}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p
              className={cn("mt-1 text-xs text-muted-foreground", displayFont)}
            >
              {card.example.pinyin}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {card.example.english}
            </p>
          </div>
        )}

        {/* Component breakdown, reusing the hanzi dataset */}
        {word.characters.some((c) => !c.atomic && c.components.length > 0) && (
          <div className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-2">
            {word.characters.flatMap((c, ci) =>
              c.atomic
                ? []
                : c.components
                    .filter((k) => k.role !== "form")
                    .map((k) => (
                      <span
                        key={`${ci}-${c.char}-${k.char}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        <span
                          className={cn("text-sm text-foreground", hanziFont)}
                        >
                          {k.char}
                        </span>
                        {k.meaning}
                      </span>
                    )),
            )}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          disabled={pos === 0}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors",
            displayFont,
            pos === 0 ? "text-muted-foreground/50" : "hover:border-primary/50",
          )}
          onClick={() => setPos((p) => Math.max(0, p - 1))}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
            displayFont,
          )}
          onClick={() => (last ? onDone() : setPos((p) => p + 1))}
        >
          {last ? "Start practicing" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
