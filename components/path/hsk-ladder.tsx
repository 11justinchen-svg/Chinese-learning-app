"use client";

import { Check } from "lucide-react";
import { stagesForLevel } from "@/lib/data/stages";
import { wordsForLevel, type HskLevel } from "@/lib/hsk";
import { cn } from "@/lib/utils";

export function HskLadder({
  level,
  practiced,
  onSelect,
}: {
  level: HskLevel;
  practiced: Record<HskLevel, number>;
  onSelect: (level: HskLevel) => void;
}) {
  return (
    <nav
      className="sticky top-16 z-30 -mx-5 mb-5 border-y border-foreground bg-background/95 px-5 py-3 sm:-mx-8 sm:px-8"
      aria-label="Choose HSK level"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground sm:inline">
            Study level
          </span>
          <div className="inline-flex border border-foreground" role="group">
            {([1, 2] as const).map((option) => {
              const selected = level === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(option)}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 px-4 text-sm font-bold focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    option === 2 && "border-l border-foreground",
                    selected
                      ? option === 1
                        ? "bg-[oklch(var(--poster-green))] text-[oklch(var(--poster-paper))]"
                        : "bg-[oklch(var(--poster-blue))] text-[oklch(var(--poster-paper))]"
                      : "bg-card hover:bg-secondary",
                  )}
                >
                  HSK {option}
                  {selected && (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <p className="text-xs font-semibold text-muted-foreground">
          HSK {level}: {wordsForLevel(level).length} new words ·{" "}
          {stagesForLevel(level).length} open lessons · {practiced[level]}% tried
        </p>
      </div>
    </nav>
  );
}
