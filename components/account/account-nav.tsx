"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useAccount } from "@/components/account/account-provider";
import { cn } from "@/lib/utils";

export function AccountNav({ current }: { current: boolean }) {
  const { status, user, syncState } = useAccount();
  const signedIn = status === "authenticated";
  const name =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Account";
  const syncLabel =
    syncState === "syncing"
      ? "syncing"
      : syncState === "error" || syncState === "offline"
        ? "saved locally"
        : "synced";

  return (
    <Link
      href="/account"
      aria-current={current ? "page" : undefined}
      aria-label={
        signedIn
          ? `Account for ${name}, progress ${syncLabel}`
          : "Account, currently learning as a guest"
      }
      className={cn(
        "group relative flex min-h-11 items-center gap-2 px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:px-3",
        current
          ? "text-foreground after:absolute after:inset-x-2 after:-bottom-[0.65rem] after:h-0.5 after:bg-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span className="relative">
        <UserRound className="h-4 w-4" />
        {signedIn && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute -right-1 -top-1 h-2 w-2 border border-background",
              syncState === "error" || syncState === "offline"
                ? "bg-[oklch(var(--poster-yellow))]"
                : "bg-[oklch(var(--poster-green))]",
            )}
          />
        )}
      </span>
      <span className="hidden xl:inline">{signedIn ? name : "Account"}</span>
    </Link>
  );
}
