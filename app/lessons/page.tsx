import type { Metadata } from "next";
import { LearningPath } from "@/components/path/learning-path";

export const metadata: Metadata = {
  title: "HSK 1 | 默知 MoZhi",
  description:
    "A ten-stage HSK-1 path built around real-life scenarios: dialogues, interactive vocabulary and grammar drills, and checkpoints that unlock the next stage.",
};

export default function LessonsPage() {
  return <LearningPath />;
}
