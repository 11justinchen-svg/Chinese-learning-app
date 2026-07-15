import type { Metadata } from "next";
import { LearningPath } from "@/components/path/learning-path";

export const metadata: Metadata = {
  title: "HSK 1 | 默知 MoZhi",
  description:
    "Ten open HSK-1 lessons built around real-life scenarios, interactive vocabulary, grammar drills, and productive checkpoints.",
};

export default function LessonsPage() {
  return <LearningPath />;
}
