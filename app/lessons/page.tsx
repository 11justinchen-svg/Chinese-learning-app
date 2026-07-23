import type { Metadata } from "next";
import { LearningPath } from "@/components/path/learning-path";

export const metadata: Metadata = {
  title: "HSK 3.0 Level 1 & 2 Lessons | 默知 MoZhi",
  description:
    "Open lessons for all 500 words in the 2025 HSK 3.0 Level 1 and Level 2 syllabus, with grammar, Hanzi, stroke order, conversations, and practice tests.",
};

export default function LessonsPage() {
  return <LearningPath />;
}
