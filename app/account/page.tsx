import type { Metadata } from "next";
import { AccountPage } from "@/components/account/account-page";

export const metadata: Metadata = {
  title: "Account | 默知 MoZhi",
  description:
    "Sign in to sync MoZhi lesson, Hanzi, test, flashcard, and review progress across devices.",
};

export default function Page() {
  return <AccountPage />;
}
