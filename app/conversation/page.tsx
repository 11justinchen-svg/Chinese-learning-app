import type { Metadata } from "next";
import { RoleCallStudio } from "@/components/conversation/role-call-studio";
import type { RoleCallPersonaId } from "@/lib/role-calls";

export const metadata: Metadata = {
  title: "Role calls | 默知 MoZhi",
  description:
    "Practice HSK 3.0 Level 1 and Level 2 Mandarin with phrase warm-ups, Hanzi or pinyin replies, authored correction, and optional AI wording feedback.",
};

export default async function ConversationPage({
  searchParams,
}: {
  searchParams?: Promise<{ grammar?: string; scenario?: string }>;
}) {
  const query = (await searchParams) ?? {};
  return (
    <RoleCallStudio
      grammarLessonId={query.grammar}
      initialScenarioId={query.scenario as RoleCallPersonaId | undefined}
    />
  );
}
