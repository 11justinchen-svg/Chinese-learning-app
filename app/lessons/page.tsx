import type { Metadata } from "next";
import { LearningPath } from "@/components/path/learning-path";

export const metadata: Metadata = {
  title: "HSK 1 & 2 Lessons | 默知 MoZhi",
  description:
    "Twenty open HSK 1 and HSK 2 real-life lessons organized into five practical chapters with cumulative HSK 1 practice tests.",
};

export default function LessonsPage() {
  return <LearningPath />;
}
