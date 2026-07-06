import type { Metadata } from "next";
import { STAGES, findStage } from "@/lib/data/stages";
import { StageView } from "@/components/stage/stage-view";

export function generateStaticParams() {
  return STAGES.map((s) => ({ stage: s.id }));
}

export function generateMetadata({
  params,
}: {
  params: { stage: string };
}): Metadata {
  const stage = findStage(params.stage);
  return {
    title: stage
      ? `Stage ${stage.index}: ${stage.title} | 默知 MoZhi`
      : "Stage | 默知 MoZhi",
    description: stage?.description,
  };
}

export default function StagePage({ params }: { params: { stage: string } }) {
  return <StageView stageId={params.stage} />;
}
