import type { Metadata } from "next";
import { RoleCallStudio } from "@/components/conversation/role-call-studio";

export const metadata: Metadata = {
  title: "Role calls | 默知 MoZhi",
  description:
    "Practice beginner Mandarin by speaking with an authored waiter, shopkeeper, taxi driver, hotel clerk, or teacher.",
};

export default function ConversationPage({
  searchParams,
}: {
  searchParams?: { grammar?: string };
}) {
  return <RoleCallStudio grammarLessonId={searchParams?.grammar} />;
}
