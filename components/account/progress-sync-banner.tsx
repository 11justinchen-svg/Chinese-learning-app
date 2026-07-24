"use client";

import Link from "next/link";
import { ArrowRight, Cloud, CloudOff, RefreshCw } from "lucide-react";
import { useAccount } from "@/components/account/account-provider";

export function ProgressSyncBanner() {
  const { status, syncState, syncError } = useAccount();
  if (status === "loading" || status === "unavailable") return null;

  if (status === "guest") {
    return (
      <aside className="mt-6 flex flex-col justify-between gap-4 border border-foreground bg-card px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <Cloud className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-bold">Keep this progress on every device</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Create an account or sign in. Your current guest evidence comes
              with you.
            </p>
          </div>
        </div>
        <Link
          href="/account"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Set up sync <ArrowRight className="h-4 w-4" />
        </Link>
      </aside>
    );
  }

  return (
    <aside className="mt-6 flex items-start gap-3 border border-foreground bg-card px-5 py-4">
      {syncState === "offline" || syncState === "error" ? (
        <CloudOff className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      ) : (
        <RefreshCw
          className={`mt-0.5 h-5 w-5 shrink-0 text-primary ${syncState === "syncing" ? "animate-spin" : ""}`}
        />
      )}
      <div>
        <p className="text-sm font-bold">
          {syncState === "syncing"
            ? "Syncing your learning evidence"
            : syncState === "offline" || syncState === "error"
              ? "Progress is saved on this device"
              : "Account sync is ready"}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {syncError ||
            "Lesson, Hanzi, test, and review evidence stays attached to your account."}
          {" "}
          <Link
            href="/account"
            className="font-bold text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Account
          </Link>
        </p>
      </div>
    </aside>
  );
}
