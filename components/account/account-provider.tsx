"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { LOCAL_DATA_CHANGED_EVENT } from "@/lib/account/events";
import {
  prepareLocalDataForUser,
  restoreGuestIfAccountWasActive,
  restoreGuestLearningData,
} from "@/lib/account/local";
import { syncLearningData } from "@/lib/account/sync";
import type { SyncState } from "@/lib/account/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AccountStatus =
  | "loading"
  | "guest"
  | "authenticated"
  | "unavailable";

interface AccountContextValue {
  status: AccountStatus;
  user: User | null;
  syncState: SyncState;
  syncError: string;
  lastSyncedAt: number | null;
  syncNow: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AccountContext = createContext<AccountContextValue | null>(null);

function friendlySyncError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (/network|fetch|offline/i.test(message))
    return "Progress is safe on this device. Cloud sync will retry when you are online.";
  if (/learning_progress|relation/i.test(message))
    return "Account access works, but the progress table still needs to be installed.";
  return "Progress is safe on this device. Cloud sync could not finish yet.";
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<AccountStatus>(
    isSupabaseConfigured ? "loading" : "unavailable",
  );
  const [user, setUser] = useState<User | null>(null);
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [syncError, setSyncError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const userRef = useRef<User | null>(null);
  const syncingRef = useRef<Promise<void> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSync = useCallback(async (activeUser?: User | null) => {
    const target = activeUser ?? userRef.current;
    if (!target) return;
    if (syncingRef.current) return syncingRef.current;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setSyncState("offline");
      return;
    }

    const operation = (async () => {
      setSyncState("syncing");
      setSyncError("");
      try {
        await syncLearningData(target.id);
        setLastSyncedAt(Date.now());
        setSyncState("synced");
      } catch (error) {
        setSyncState(
          typeof navigator !== "undefined" && !navigator.onLine
            ? "offline"
            : "error",
        );
        setSyncError(friendlySyncError(error));
      } finally {
        syncingRef.current = null;
      }
    })();
    syncingRef.current = operation;
    return operation;
  }, []);

  useEffect(() => {
    if (!client) {
      restoreGuestIfAccountWasActive();
      setStatus("unavailable");
      return;
    }

    let mounted = true;
    void client.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return;
        const nextUser = data.user;
        userRef.current = nextUser;
        setUser(nextUser);
        if (nextUser) {
          prepareLocalDataForUser(nextUser.id);
          setStatus("authenticated");
          void performSync(nextUser);
        } else {
          restoreGuestIfAccountWasActive();
          setStatus("guest");
        }
      })
      .catch(() => {
        if (!mounted) return;
        restoreGuestIfAccountWasActive();
        setStatus("guest");
        setSyncState(
          typeof navigator !== "undefined" && !navigator.onLine
            ? "offline"
            : "error",
        );
        setSyncError(
          "Account service is unavailable. Progress remains safe on this device.",
        );
      });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null;
      userRef.current = nextUser;
      setUser(nextUser);
      if (nextUser) {
        prepareLocalDataForUser(nextUser.id);
        setStatus("authenticated");
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")
          window.setTimeout(() => void performSync(nextUser), 0);
      } else {
        restoreGuestIfAccountWasActive();
        setStatus("guest");
        setSyncState("idle");
        setLastSyncedAt(null);
      }
    });

    const queueSync = () => {
      if (!userRef.current) return;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => void performSync(), 900);
    };
    const handleOnline = () => void performSync();
    const handleOffline = () => setSyncState("offline");
    window.addEventListener(LOCAL_DATA_CHANGED_EVENT, queueSync);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      window.removeEventListener(LOCAL_DATA_CHANGED_EVENT, queueSync);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [client, performSync]);

  const signOut = useCallback(async () => {
    if (!client) return;
    await performSync();
    await client.auth.signOut();
    restoreGuestLearningData();
    userRef.current = null;
    setUser(null);
    setStatus("guest");
    window.location.assign("/lessons");
  }, [client, performSync]);

  const value = useMemo<AccountContextValue>(
    () => ({
      status,
      user,
      syncState,
      syncError,
      lastSyncedAt,
      syncNow: () => performSync(),
      signOut,
    }),
    [
      lastSyncedAt,
      performSync,
      signOut,
      status,
      syncError,
      syncState,
      user,
    ],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const value = useContext(AccountContext);
  if (!value)
    throw new Error("useAccount must be used inside AccountProvider.");
  return value;
}
