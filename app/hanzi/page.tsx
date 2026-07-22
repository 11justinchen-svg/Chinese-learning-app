import type { Metadata } from "next";
import { HanziExplorer } from "@/components/hanzi-explorer";

export const metadata: Metadata = {
  title: "Hanzi | 默知 MoZhi",
  description:
    "Build and test HSK 1 and HSK 2 Hanzi sets with pinyin, audio, real-life topics, and visible proficiency evidence.",
};

export default function HanziPage({
  searchParams,
}: {
  searchParams?: { word?: string; set?: string };
}) {
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
          Pick one Hanzi, build your own set, or start with shopping, small
          talk, food, travel, or hotel language. Progress shows separate
          evidence for form and meaning, sound, and real use.
        </p>
      </div>
      <HanziExplorer
        initialWordId={searchParams?.word}
        initialSetId={searchParams?.set}
      />
    </main>
  );
}
