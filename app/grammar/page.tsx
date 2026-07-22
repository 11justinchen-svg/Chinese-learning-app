import type { Metadata } from "next";
import { GrammarRepertoire } from "@/components/grammar-repertoire";

export const metadata: Metadata = {
  title: "Grammar repertoire | 默知 MoZhi",
  description:
    "Review every unlocked HSK 1 and HSK 2 Mandarin grammar pattern, hear examples, and return to retrieval and reply practice.",
};

export default function GrammarPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-11">
      <header className="eave-panel mb-10 overflow-hidden p-6 sm:p-8">
        <span aria-hidden="true" className="absolute -right-8 -top-12 font-[family-name:var(--font-hanzi-display)] text-[13rem] leading-none opacity-[0.055]">
          法
        </span>
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="seal h-10 w-10 text-xl">法</span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                默知 · Grammar repertoire
              </p>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Patterns you can use.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Review the form, hear it in context, then jump into sentence building and a real situation. Every HSK 1 and HSK 2 concept is open from the start.
          </p>
        </div>
      </header>
      <GrammarRepertoire />
    </main>
  );
}
