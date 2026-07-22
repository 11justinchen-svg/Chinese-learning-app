"use client";

import { Check, Languages } from "lucide-react";
import type { HskLevel } from "@/lib/hsk";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi-display)]";

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
    <section className="poster-panel mt-20 overflow-hidden" aria-labelledby="level-heading">
      <div className="grid lg:grid-cols-[0.7fr_1.3fr]">
        <div className="bg-foreground p-7 text-background sm:p-9">
          <Languages className="h-6 w-6" />
          <p className="mt-8 font-[family-name:var(--font-hand)] text-xl">
            two levels, no locked gates
          </p>
          <h2 id="level-heading" className="mt-2 text-3xl font-bold">
            Pick the Chinese you need now.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2">
          {([1, 2] as const).map((option) => {
            const selected = level === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(option)}
                className={cn(
                  "group relative min-h-48 overflow-hidden border-t border-foreground p-7 text-left transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:border-t-0 sm:border-l",
                  option === 1
                    ? "bg-[oklch(var(--poster-green))] text-[oklch(var(--poster-ink))]"
                    : "bg-[oklch(var(--poster-blue))] text-[oklch(var(--poster-paper))]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -bottom-10 -right-4 text-[10rem] leading-none opacity-20 transition-transform duration-200 group-hover:-translate-y-1",
                    hanziFont,
                  )}
                >
                  {option === 1 ? "一" : "二"}
                </span>
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">
                      HSK {option}
                    </p>
                    <p className="mt-3 text-2xl font-bold">
                      {option === 1 ? "Start speaking" : "Go further"}
                    </p>
                    <p className="mt-2 max-w-[22ch] text-sm opacity-80">
                      10 open scenes · {option === 1 ? 150 : 147} written forms
                    </p>
                  </div>
                  {selected && (
                    <span className="grid h-9 w-9 place-items-center border border-current" aria-label="Selected level">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <p className="relative mt-10 text-xs font-semibold">
                  {practiced[option]}% tried · open level
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
