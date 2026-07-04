"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, PlayCircle, FileText, ArrowRight } from "lucide-react";
import { GRAMMAR_LESSONS } from "@/lib/data/grammar";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi)]";
const displayFont = "font-[family-name:var(--font-display)]";

export function GrammarSection() {
  const [openId, setOpenId] = useState<string | null>(
    GRAMMAR_LESSONS[0]?.id ?? null,
  );

  return (
    <section className="mt-10">
      <p
        className={cn(
          "text-xs uppercase tracking-[0.25em] text-muted-foreground",
          displayFont,
        )}
      >
        Grammar
      </p>
      <h2 className={cn("mt-2 text-2xl font-bold sm:text-3xl", displayFont)}>
        Eight patterns that unlock HSK 1
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Each lesson lists the vocab it assumes and where to drill it, plus a
        video and an article to actually learn the pattern.
      </p>

      <ol className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
        {GRAMMAR_LESSONS.map((lesson) => {
          const open = openId === lesson.id;
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : lesson.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/40 sm:px-6"
              >
                <span className={cn("w-16 shrink-0 text-2xl", hanziFont)}>
                  {lesson.hanzi}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold sm:text-base">
                    {lesson.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {lesson.pattern}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              </button>

              {open && (
                <div className="border-t border-border/60 px-5 pb-6 pt-4 sm:px-6">
                  {/* Vocab requirement */}
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <p
                      className={cn(
                        "text-[0.65rem] uppercase tracking-[0.2em] text-primary",
                        displayFont,
                      )}
                    >
                      Vocab needed first
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
                      {lesson.vocab.map((req) => (
                        <div key={req.unit} className="flex items-center gap-3">
                          <span className={cn("text-lg", hanziFont)}>
                            {req.words.join(" ")}
                          </span>
                          <Link
                            href={`/flashcards?unit=${req.unit}`}
                            className="group inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            Practice Set {req.unit}
                            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {lesson.summary}
                  </p>

                  <div className="mt-4 space-y-2">
                    {lesson.examples.map((ex) => (
                      <div key={ex.hanzi} className="text-sm">
                        <span className={cn(hanziFont, "text-base")}>
                          {ex.hanzi}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          — {ex.pinyin} · {ex.meaning}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* External resources */}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {lesson.resources.map((r) => (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        {r.type === "video" ? (
                          <PlayCircle className="h-3.5 w-3.5" />
                        ) : (
                          <FileText className="h-3.5 w-3.5" />
                        )}
                        {r.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
