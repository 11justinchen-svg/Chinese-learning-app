import type { Metadata } from "next";
import { HanziExplorer } from "@/components/hanzi-explorer";
import { HanziScrollProgress } from "@/components/hanzi/scroll-progress";

export const metadata: Metadata = {
  title: "Hanzi | 默知 MoZhi",
  description:
    "Learn HSK 3.0 Level 1 and Level 2 Hanzi in open lesson chunks with stroke order, flashcards, audio, matching, sentence building, replies, and visible proficiency evidence.",
};

export default async function HanziPage({
  searchParams,
}: {
  searchParams?: Promise<{
    word?: string;
    set?: string;
    lesson?: string;
    grammar?: string;
  }>;
}) {
  const query = (await searchParams) ?? {};
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 sm:pt-11">
      <HanziScrollProgress />
      <header className="eave-panel mb-10 overflow-hidden p-6 sm:p-8">
        <span aria-hidden="true" className="absolute -right-8 -top-12 font-[family-name:var(--font-hanzi-display)] text-[13rem] leading-none opacity-[0.055]">字</span>
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="seal h-10 w-10 text-xl">习</span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">默知 · Hanzi courtyards</p>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Hanzi, built for use.</h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Preview the form. Hear it. Retrieve it. Build a sentence. Give a useful reply. Every lesson is open; progress follows evidence.
          </p>
        </div>
      </header>
      <HanziExplorer
        initialWordId={query.word}
        initialSetId={query.set}
        initialLessonId={query.lesson}
        initialGrammarId={query.grammar}
      />
    </main>
  );
}
