import type { Metadata } from "next";
import { Flashcards } from "@/components/flashcards";

export const metadata: Metadata = {
  title: "Flashcards | 默知 MoZhi",
  description:
    "Optional HSK 1 and HSK 2 flashcards, lesson decks, and custom cards stored on your device.",
};

export default async function FlashcardsPage({
  searchParams,
}: {
  searchParams: Promise<{ unit?: string; stage?: string }>;
}) {
  const query = await searchParams;
  const unit = query.unit ? Number(query.unit) : undefined;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-2xl border-b border-foreground pb-7">
        <p className="font-[family-name:var(--font-hand)] text-xl text-primary">
          optional, never a gate
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Flashcards</h1>
        <p className="mt-3 text-muted-foreground">
          Use HSK 1, HSK 2, lesson, or custom decks when they help. Card
          scheduling never locks a lesson, level, or fast test.
        </p>
      </div>
      <Flashcards
        initialUnit={unit && !Number.isNaN(unit) ? unit : undefined}
        initialStageId={query.stage}
      />
    </main>
  );
}
