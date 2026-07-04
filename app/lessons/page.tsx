import type { Metadata } from "next";
import { HskPlan } from "@/components/hsk-plan";

export const metadata: Metadata = {
  title: "HSK 1 | 默知 MoZhi",
  description:
    "A ten-set plan through all 150 HSK-1 words, with spaced-repetition flashcards and a component breakdown for every character.",
};

export default function LessonsPage() {
  return <HskPlan />;
}
