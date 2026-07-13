import type { Metadata } from "next";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";

export const metadata: Metadata = {
  title: "Progress | 默知 MoZhi",
  description:
    "See HSK-1 vocabulary, stage completion, and spaced-repetition reviews in one place.",
};

export default function ProgressPage() {
  return <ProgressDashboard />;
}
