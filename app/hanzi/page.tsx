import type { Metadata } from "next";
import { HanziExplorer } from "@/components/hanzi-explorer";

export const metadata: Metadata = {
  title: "Hanzi | 默知 MoZhi",
  description:
    "Every HSK-1 character broken into the components that give it meaning: the meaning part, the sound part, the strokes.",
};

export default function HanziPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Inside every character
        </h1>
        <p className="mt-3 text-muted-foreground">
          Characters are built from smaller parts: one carries the meaning, one
          often carries the sound. Pick any of the 150 HSK-1 words to take it
          apart.
        </p>
      </div>
      <HanziExplorer />
    </main>
  );
}
