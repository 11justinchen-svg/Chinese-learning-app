"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Headphones, Search, Volume2 } from "lucide-react";
import { GRAMMAR_LESSONS } from "@/lib/data/grammar";
import { stagesForLevel } from "@/lib/data/stages";
import { findRoleCallScenarioForGrammar } from "@/lib/role-calls";
import { speak } from "@/lib/speech";
import { useMandarinSpeech } from "@/lib/use-mandarin-speech";
import { cn } from "@/lib/utils";

const hanziFont = "font-[family-name:var(--font-hanzi-display)]";

export function GrammarRepertoire() {
  const [level, setLevel] = useState<1 | 2>(1);
  const [query, setQuery] = useState("");
  const speech = useMandarinSpeech();
  const stages = stagesForLevel(level);
  const needle = query.trim().toLocaleLowerCase();

  const groups = useMemo(
    () =>
      stages
        .map((stage) => ({
          stage,
          lessons: stage.grammarLessonIds
            .map((id) => GRAMMAR_LESSONS.find((lesson) => lesson.id === id))
            .filter((lesson): lesson is (typeof GRAMMAR_LESSONS)[number] => Boolean(lesson))
            .filter((lesson) =>
              !needle ||
              [lesson.title, lesson.hanzi, lesson.pattern, lesson.summary, stage.title]
                .join(" ")
                .toLocaleLowerCase()
                .includes(needle),
            ),
        }))
        .filter((group) => group.lessons.length > 0),
    [level, needle, stages],
  );

  const conceptCount = stages.reduce(
    (total, stage) => total + stage.grammarLessonIds.length,
    0,
  );

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-border bg-card/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit border border-border bg-background p-1" role="tablist" aria-label="HSK grammar level">
          {[1, 2].map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={level === value}
              onClick={() => setLevel(value as 1 | 2)}
              className={cn(
                "min-h-11 px-5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                level === value ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
              )}
            >
              HSK {value}
            </button>
          ))}
        </div>
        <label className="flex min-h-11 w-full items-center gap-2 border border-border bg-background px-3 sm:max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Search grammar concepts</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search patterns, concepts, or Hanzi"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        {conceptCount} concepts across 10 open HSK {level} lessons. Every card links back to its full retrieval and reply practice.
      </p>

      <div className="mt-8 space-y-12">
        {groups.map(({ stage, lessons }) => (
          <section key={stage.id} aria-labelledby={`${stage.id}-grammar-title`}>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-foreground pb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  HSK {level} · Lesson {stage.index}
                </p>
                <h2 id={`${stage.id}-grammar-title`} className="mt-1 text-xl font-bold">
                  {stage.title}
                </h2>
              </div>
              <Link
                href={`/lessons/${stage.id}`}
                className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Practice this lesson <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {lessons.map((lesson) => {
                const role = findRoleCallScenarioForGrammar(lesson.id);
                return (
                  <article
                    id={lesson.id}
                    key={lesson.id}
                    className="eave-panel scroll-mt-24 overflow-hidden p-5 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={cn("text-4xl leading-none text-primary", hanziFont)}>{lesson.hanzi}</p>
                        <h3 className="mt-3 text-lg font-bold">{lesson.title}</h3>
                      </div>
                      <span className="border border-border bg-background px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Open
                      </span>
                    </div>
                    <p className="mt-3 border-l-2 border-primary pl-3 font-[family-name:var(--font-display)] text-sm font-semibold text-primary">
                      {lesson.pattern}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{lesson.summary}</p>

                    <div className="mt-5 space-y-3 border-t border-border pt-4">
                      {lesson.examples.map((example) => (
                        <div key={example.hanzi} className="grid grid-cols-[1fr_auto] gap-3">
                          <div>
                            <p className={cn("text-lg", hanziFont)}>{example.hanzi}</p>
                            <p className="text-xs text-primary">{example.pinyin}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{example.meaning}</p>
                          </div>
                          {speech === "ready" && (
                            <button
                              type="button"
                              onClick={() => speak(example.hanzi)}
                              aria-label={`Play ${example.hanzi}`}
                              className="flex h-11 w-11 items-center justify-center border border-border bg-background transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Volume2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        href={`/lessons/${stage.id}`}
                        className="inline-flex min-h-11 items-center gap-2 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Drill the pattern <ArrowRight className="h-4 w-4" />
                      </Link>
                      {role && (
                        <Link
                          href={`/conversation?grammar=${encodeURIComponent(lesson.id)}`}
                          className="inline-flex min-h-11 items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-bold transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Headphones className="h-4 w-4" /> Speak it
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="mt-10 border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No grammar concepts match “{query}”.
        </div>
      )}
    </div>
  );
}
