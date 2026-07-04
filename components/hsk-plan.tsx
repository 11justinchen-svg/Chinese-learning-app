"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { HSK1, UNITS } from "@/lib/hsk";
import { deckStats, loadSrs, type SrsStore } from "@/lib/srs";
import { cn } from "@/lib/utils";
import { GrammarSection } from "@/components/grammar-section";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

const BANDS = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

export function HskPlan() {
  const [srs, setSrs] = useState<SrsStore>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSrs(loadSrs());
    setReady(true);
  }, []);

  const overall = deckStats(
    srs,
    HSK1.map((w) => w.id),
  );
  const pct = ready ? Math.round((overall.mastered / overall.total) * 100) : 0;
  const nextUnit =
    UNITS.find(
      (u) =>
        deckStats(
          srs,
          u.words.map((w) => w.id),
        ).mastered < u.words.length,
    ) ?? UNITS[0];

  return (
    <section className="min-h-screen bg-background pb-32 pt-14 text-foreground">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Masthead */}
        <header className="border-b border-border pb-10">
          <p
            className={cn(
              "text-xs uppercase tracking-[0.3em] text-muted-foreground",
              displayFont,
            )}
          >
            默知 · HSK 1
          </p>
          <h1
            className={cn(
              "mt-4 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl",
              displayFont,
            )}
          >
            The first 150 words,
            <br />
            taken apart and learned.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Ten short sets cover the whole HSK-1 vocabulary. Study each as
            flashcards, and see the components that give every character its
            meaning.
          </p>
        </header>

        <GrammarSection />

        {/* Resume */}
        <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p
              className={cn(
                "text-xs uppercase tracking-[0.2em] text-primary",
                displayFont,
              )}
            >
              {overall.mastered > 0 ? "Keep going" : "Start here"}
            </p>
            <p className="mt-1.5 text-lg font-semibold">
              {nextUnit.title}: {nextUnit.words[0].hanzi} …{" "}
              {nextUnit.words[nextUnit.words.length - 1].hanzi}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1 w-40 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {overall.mastered} / {overall.total} mastered
              </span>
            </div>
          </div>
          <Link
            href={`/flashcards?unit=${nextUnit.index}`}
            className={cn(
              "group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
              displayFont,
            )}
          >
            Study {nextUnit.title}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Sets */}
        <ol className="mt-4">
          {UNITS.map((unit, i) => {
            const stats = deckStats(
              srs,
              unit.words.map((w) => w.id),
            );
            const upct = ready
              ? Math.round((stats.mastered / stats.total) * 100)
              : 0;
            return (
              <li
                key={unit.index}
                className="lesson-in group relative border-b border-border"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Link
                  href={`/flashcards?unit=${unit.index}`}
                  aria-label={`Study ${unit.title}`}
                  className="absolute inset-0 z-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
                <div className="pointer-events-none relative z-10 flex items-center gap-5 py-6">
                  <span
                    className={cn(
                      "w-12 shrink-0 text-3xl tabular-nums text-muted-foreground/50",
                      displayFont,
                    )}
                  >
                    {String(unit.index).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "flex flex-wrap gap-x-2 text-2xl leading-tight",
                        hanziFont,
                      )}
                    >
                      {unit.words.map((w) => (
                        <span key={w.id}>{w.hanzi}</span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1 w-28 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${upct}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {ready
                          ? `${stats.mastered}/${stats.total} mastered`
                          : ""}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-foreground sm:block" />
                </div>
              </li>
            );
          })}
        </ol>

        {/* HSK ladder */}
        <div className="mt-20">
          <p
            className={cn(
              "mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground",
              displayFont,
            )}
          >
            The HSK ladder
          </p>
          <div className="flex flex-wrap gap-2">
            {BANDS.map((g, i) => (
              <div
                key={i}
                className={cn(
                  "flex h-16 w-16 flex-col items-center justify-center rounded-xl border",
                  i === 0
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground/50",
                )}
              >
                <span className={cn("text-2xl", hanziFont)}>{g}</span>
                <span className="text-[0.6rem] uppercase tracking-wide">
                  {i === 0 ? "now" : "soon"}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            HSK 1 is live. Levels 2–9 follow the same format.
          </p>
        </div>
      </div>
    </section>
  );
}
