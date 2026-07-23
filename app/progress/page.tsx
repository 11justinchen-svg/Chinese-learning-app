import type { Metadata } from "next";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";

export const metadata: Metadata = {
  title: "Progress | 默知 MoZhi",
  description:
    "Follow five grouped HSK 1 or HSK 2 chapters, resume one recommended lesson, and open detailed learning evidence when needed.",
};

export default function ProgressPage() {
  return <ProgressDashboard />;
}
