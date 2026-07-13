import type { Metadata } from "next";
import { Flashcards } from "@/components/flashcards";

export const metadata: Metadata = {
  title: "Flashcards | 默知 MoZhi",
  description:
    "Spaced-repetition flashcards for HSK-1: preset decks of all 150 words plus cards you build yourself. Everything is stored on your device.",
};

export default function FlashcardsPage({
  searchParams,
}: {
  searchParams: { unit?: string };
}) {
  const unit = searchParams?.unit ? Number(searchParams.unit) : undefined;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Flashcards</h1>
        <p className="mt-3 text-muted-foreground">
          Review by spaced repetition: cards you know come back less often,
          cards you miss come back soon. Progress is saved on this device, no
          account needed.
        </p>
      </div>
      <Flashcards
        initialUnit={unit && !Number.isNaN(unit) ? unit : undefined}
      />
    </main>
  );
}
