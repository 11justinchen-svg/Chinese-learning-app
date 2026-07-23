import type { Metadata } from "next";
import { AssessmentHub } from "@/components/assessments/assessment-hub";

export const metadata: Metadata = {
  title: "HSK 1 Practice Tests | 默知 MoZhi",
  description:
    "Five cumulative HSK 1 chapter tests and two comprehensive mixed practice forms with targeted repair.",
};

export default async function PracticeTestsPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string }>;
}) {
  const params = await searchParams;
  return <AssessmentHub initialAssessmentId={params.test} />;
}
