import type { Metadata } from "next";
import { HanziExplorer } from "@/components/hanzi-explorer";

export const metadata: Metadata = {
  title: "Hanzi | 默知 MoZhi",
  description:
    "Browse and test the HSK 1 and HSK 2 written forms with pinyin, meanings, component notes, audio, and five-word checks.",
};

export default function HanziPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-3xl border-b border-foreground pb-7">
        <p className="font-[family-name:var(--font-hand)] text-xl text-primary">
          character field notes
        </p>
        <h1 className="mt-1 text-4xl font-bold sm:text-5xl">
          See it. Say it. Test it.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Explore all HSK 1 and HSK 2 written forms. Component labels describe
          visible structure; memory hooks are marked as mnemonics, and every
          level has an immediate five-word test.
        </p>
      </div>
      <HanziExplorer />
    </main>
  );
}
