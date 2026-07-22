import type { Metadata } from "next";
import { STAGES, findStage } from "@/lib/data/stages";
import { StageView } from "@/components/stage/stage-view";

export function generateStaticParams() {
  return STAGES.map((s) => ({ stage: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stage: string }>;
}): Promise<Metadata> {
  const { stage: stageId } = await params;
  const stage = findStage(stageId);
  return {
    title: stage
      ? `Stage ${stage.index}: ${stage.title} | 默知 MoZhi`
      : "Stage | 默知 MoZhi",
    description: stage?.description,
  };
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage } = await params;
  return <StageView stageId={stage} />;
}
