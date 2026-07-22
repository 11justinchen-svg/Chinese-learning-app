import type { Metadata } from "next";
import { RoleCallStudio } from "@/components/conversation/role-call-studio";
import type { RoleCallPersonaId } from "@/lib/role-calls";

export const metadata: Metadata = {
  title: "Role calls | 默知 MoZhi",
  description:
    "Practice HSK 1 and HSK 2 Mandarin with phrase warm-ups, Hanzi or pinyin replies, authored correction, and optional AI wording feedback.",
};

export default function ConversationPage({
  searchParams,
}: {
  searchParams?: { grammar?: string; scenario?: string };
}) {
  return (
    <RoleCallStudio
      grammarLessonId={searchParams?.grammar}
      initialScenarioId={searchParams?.scenario as RoleCallPersonaId | undefined}
    />
  );
}
