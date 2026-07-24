"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Cloud,
  CloudOff,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAccount } from "@/components/account/account-provider";
import { readLearningSnapshot } from "@/lib/account/local";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up" | "recover";

const displayFont = "font-[family-name:var(--font-display)]";
const hanziFont = "font-[family-name:var(--font-hanzi-display)]";
const inputClass =
  "min-h-12 w-full border border-input bg-background px-3 py-2 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60";
const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55";
const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 border border-foreground bg-background px-5 py-3 text-sm font-bold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55";

function friendlyAuthError(message: string) {
  if (/invalid login credentials/i.test(message))
    return "That email and password do not match.";
  if (/email not confirmed/i.test(message))
    return "Confirm your email first, then sign in.";
  if (/already registered|already been registered/i.test(message))
    return "An account already uses that email. Sign in instead.";
  if (/password/i.test(message) && /characters|length|weak/i.test(message))
    return "Use at least 8 characters for your password.";
  if (/fetch|network|connect/i.test(message))
    return "The secure account service could not be reached. Keep learning as a guest and try again.";
  return message || "The account request could not be completed.";
}

function syncDescription(state: ReturnType<typeof useAccount>["syncState"]) {
  if (state === "syncing") return "Syncing progress now";
  if (state === "synced") return "Progress is synced";
  if (state === "offline") return "Saved here, waiting for a connection";
  if (state === "error") return "Saved here, cloud sync needs attention";
  return "Ready to sync";
}

export function AccountPage() {
  const account = useAccount();

  return (
    <main className="min-h-screen overflow-hidden bg-background pb-28 pt-10 text-foreground sm:pt-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="poster-hero relative overflow-hidden border border-foreground bg-card">
          <span
            aria-hidden="true"
            className={cn(
              "absolute -right-8 -top-16 text-[17rem] leading-none opacity-[0.07]",
              hanziFont,
            )}
          >
            存
          </span>
          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="font-[family-name:var(--font-hand)] text-xl text-primary">
                keep your field notes
              </p>
              <h1
                className={cn(
                  "mt-2 max-w-3xl text-4xl font-bold sm:text-6xl",
                  displayFont,
                )}
              >
                Your Mandarin, on every device.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                An account syncs lesson evidence, Hanzi practice, tests,
                flashcards, and review timing. Every lesson stays open with or
                without one.
              </p>
            </div>
            <div className="border-t border-foreground bg-foreground p-7 text-background lg:border-l lg:border-t-0 lg:p-9">
              <ShieldCheck className="h-6 w-6 text-[oklch(var(--poster-yellow))]" />
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] opacity-70">
                local first
              </p>
              <p className="mt-2 text-2xl font-bold">
                Guest progress is never a login gate.
              </p>
              <p className="mt-3 text-sm leading-6 opacity-75">
                Sign in when you want cloud sync. Sign out and this device
                returns to its separate guest record.
              </p>
            </div>
          </div>
        </header>

        <section className="mt-9">
          {account.status === "loading" && <AccountLoading />}
          {account.status === "unavailable" && <AccountUnavailable />}
          {account.status === "guest" && <GuestAccount />}
          {account.status === "authenticated" && <SignedInAccount />}
        </section>
      </div>
    </main>
  );
}

function AccountLoading() {
  return (
    <div className="eave-panel p-7 sm:p-10" aria-live="polite">
      <div className="h-5 w-36 animate-pulse bg-muted" />
      <div className="mt-5 h-12 max-w-xl animate-pulse bg-muted" />
      <div className="mt-8 h-64 animate-pulse bg-muted/70" />
      <span className="sr-only">Checking account session</span>
    </div>
  );
}

function AccountUnavailable() {
  return (
    <div className="eave-panel grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Guest mode is ready
        </p>
        <h2 className={cn("mt-2 text-3xl font-bold", displayFont)}>
          Cloud accounts are not enabled yet.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          You can use every MoZhi lesson now. Progress remains on this browser
          until the site owner finishes connecting secure cloud accounts.
        </p>
      </div>
      <Link href="/lessons" className={primaryButton}>
        Keep learning <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function GuestAccount() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const client = getSupabaseBrowserClient();

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("error");
    if (reason === "confirmation-failed")
      setError(
        "That confirmation link is invalid or expired. Request a new link and try again.",
      );
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "recover") {
        const callback = new URL("/auth/callback", window.location.origin);
        callback.searchParams.set("next", "/account?mode=update-password");
        const { error: recoverError } =
          await client.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: callback.toString(),
          });
        if (recoverError) throw recoverError;
        setNotice("Check your email for a secure password-reset link.");
      } else if (mode === "sign-up") {
        if (password.length < 8)
          throw new Error("Use at least 8 characters for your password.");
        const callback = new URL("/auth/callback", window.location.origin);
        callback.searchParams.set("next", "/account?confirmed=1");
        const { data, error: signUpError } = await client.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: callback.toString(),
            data: { display_name: name.trim() },
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) setNotice("Account created. Your progress is syncing.");
        else setNotice("Check your email to confirm your account.");
      } else {
        const { error: signInError } =
          await client.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
        if (signInError) throw signInError;
        setNotice("Signed in. Merging this device’s progress safely.");
      }
    } catch (requestError) {
      setError(
        friendlyAuthError(
          requestError instanceof Error ? requestError.message : "",
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
      <aside className="border border-foreground bg-foreground p-7 text-background sm:p-9">
        <Cloud className="h-6 w-6 text-[oklch(var(--poster-cyan))]" />
        <h2 className={cn("mt-8 text-3xl font-bold", displayFont)}>
          Continue anywhere.
        </h2>
        <ul className="mt-7 space-y-5 text-sm">
          {[
            "Lesson and test evidence",
            "Hanzi form, sound, and use",
            "Flashcard review timing",
            "Your custom flashcards",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(var(--poster-yellow))]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-9 border-t border-background/25 pt-5 text-xs leading-5 opacity-70">
          Existing guest progress is merged into your account. Signing up never
          changes lesson access or awards mastery.
        </p>
      </aside>

      <div className="eave-panel p-7 sm:p-10">
        {mode !== "recover" ? (
          <div
            role="tablist"
            aria-label="Account action"
            className="inline-flex border border-foreground"
          >
            {(["sign-in", "sign-up"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                onClick={() => {
                  setMode(value);
                  setError("");
                  setNotice("");
                }}
                className={cn(
                  "min-h-11 px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  mode === value
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-secondary",
                )}
              >
                {value === "sign-in" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className="text-sm font-bold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Back to sign in
          </button>
        )}

        <h2 className={cn("mt-7 text-3xl font-bold", displayFont)}>
          {mode === "sign-in" && "Welcome back"}
          {mode === "sign-up" && "Save your progress"}
          {mode === "recover" && "Reset your password"}
        </h2>

        <form className="mt-7 max-w-xl space-y-5" onSubmit={submit}>
          {mode === "sign-up" && (
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Display name</span>
              <input
                className={inputClass}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={60}
                required
                disabled={busy}
              />
            </label>
          )}
          <label className="block">
            <span className="mb-2 block text-sm font-bold">Email</span>
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={busy}
            />
          </label>
          {mode !== "recover" && (
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Password</span>
              <input
                className={inputClass}
                type="password"
                autoComplete={
                  mode === "sign-up" ? "new-password" : "current-password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
                disabled={busy}
              />
              {mode === "sign-up" && (
                <span className="mt-2 block text-xs text-muted-foreground">
                  At least 8 characters.
                </span>
              )}
            </label>
          )}

          {error && (
            <p
              role="alert"
              className="border border-primary bg-primary/10 px-4 py-3 text-sm"
            >
              {error}
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="border border-[oklch(var(--poster-green))] bg-[oklch(var(--poster-green)/0.1)] px-4 py-3 text-sm"
            >
              {notice}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={busy} className={primaryButton}>
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "recover" ? (
                <KeyRound className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {busy
                ? "Working…"
                : mode === "sign-in"
                  ? "Sign in"
                  : mode === "sign-up"
                    ? "Create account"
                    : "Send reset link"}
            </button>
            {mode === "sign-in" && (
              <button
                type="button"
                onClick={() => {
                  setMode("recover");
                  setError("");
                  setNotice("");
                }}
                className="min-h-11 text-sm font-bold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Forgot password?
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function SignedInAccount() {
  const account = useAccount();
  const client = getSupabaseBrowserClient();
  const [name, setName] = useState(
    (account.user?.user_metadata?.display_name as string | undefined) ?? "",
  );
  const [password, setPassword] = useState("");
  const [profileBusy, setProfileBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const localSummary = useMemo(() => {
    const snapshot = readLearningSnapshot();
    return {
      words: Object.keys(snapshot.progress.words).length,
      lessons: Object.values(snapshot.progress.stages).filter(
        (stage) => stage.completedAt,
      ).length,
      tests: Object.keys(snapshot.progress.assessments ?? {}).length,
    };
  }, [account.lastSyncedAt]);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setProfileBusy(true);
    setError("");
    setNotice("");
    const { error: updateError } = await client.auth.updateUser({
      data: { display_name: name.trim() },
    });
    if (updateError) setError(friendlyAuthError(updateError.message));
    else setNotice("Display name updated.");
    setProfileBusy(false);
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    setPasswordBusy(true);
    setError("");
    setNotice("");
    const { error: updateError } = await client.auth.updateUser({ password });
    if (updateError) setError(friendlyAuthError(updateError.message));
    else {
      setPassword("");
      setNotice("Password updated.");
    }
    setPasswordBusy(false);
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
      <aside className="border border-foreground bg-foreground p-7 text-background sm:p-9">
        <div className="flex items-center justify-between gap-4">
          <span className="grid h-14 w-14 place-items-center border border-background/40 text-xl font-bold uppercase">
            {name?.[0] ?? account.user?.email?.[0] ?? "M"}
          </span>
          {account.syncState === "offline" ||
          account.syncState === "error" ? (
            <CloudOff className="h-5 w-5 text-[oklch(var(--poster-yellow))]" />
          ) : (
            <Cloud className="h-5 w-5 text-[oklch(var(--poster-cyan))]" />
          )}
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] opacity-65">
          signed in
        </p>
        <h2 className={cn("mt-2 break-words text-3xl font-bold", displayFont)}>
          {name || "MoZhi learner"}
        </h2>
        <p className="mt-2 break-all text-sm opacity-70">
          {account.user?.email}
        </p>

        <div className="mt-8 border-y border-background/25 py-5">
          <p className="text-sm font-bold">
            {syncDescription(account.syncState)}
          </p>
          {account.lastSyncedAt && (
            <p className="mt-1 text-xs opacity-65">
              Last synced{" "}
              {new Date(account.lastSyncedAt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          )}
          {account.syncError && (
            <p className="mt-3 text-xs leading-5 text-[oklch(var(--poster-yellow))]">
              {account.syncError}
            </p>
          )}
          <button
            type="button"
            onClick={() => void account.syncNow()}
            disabled={account.syncState === "syncing"}
            className="mt-4 inline-flex min-h-11 items-center gap-2 border border-background px-3 py-2 text-sm font-bold hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background disabled:opacity-55"
          >
            {account.syncState === "syncing" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sync now
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div>
            <dt className="text-[0.65rem] uppercase tracking-wide opacity-60">
              Words
            </dt>
            <dd className="mt-1 text-xl font-bold">{localSummary.words}</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] uppercase tracking-wide opacity-60">
              Lessons
            </dt>
            <dd className="mt-1 text-xl font-bold">{localSummary.lessons}</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] uppercase tracking-wide opacity-60">
              Tests
            </dt>
            <dd className="mt-1 text-xl font-bold">{localSummary.tests}</dd>
          </div>
        </dl>
      </aside>

      <div className="space-y-7">
        <section className="eave-panel p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-primary" />
            <h2 className={cn("text-2xl font-bold", displayFont)}>Profile</h2>
          </div>
          <form className="mt-6 max-w-xl" onSubmit={updateProfile}>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Display name</span>
              <input
                className={inputClass}
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={60}
                required
                disabled={profileBusy}
              />
            </label>
            <button
              type="submit"
              disabled={profileBusy}
              className={cn(primaryButton, "mt-4")}
            >
              {profileBusy && <Loader2 className="h-4 w-4 animate-spin" />}
              Save profile
            </button>
          </form>
        </section>

        <section className="border border-foreground bg-card p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-primary" />
            <h2 className={cn("text-2xl font-bold", displayFont)}>Password</h2>
          </div>
          <form className="mt-6 max-w-xl" onSubmit={updatePassword}>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">New password</span>
              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
                disabled={passwordBusy}
              />
            </label>
            <button
              type="submit"
              disabled={passwordBusy}
              className={cn(secondaryButton, "mt-4")}
            >
              {passwordBusy && <Loader2 className="h-4 w-4 animate-spin" />}
              Update password
            </button>
          </form>
        </section>

        {(notice || error) && (
          <p
            role={error ? "alert" : "status"}
            className={cn(
              "border px-4 py-3 text-sm",
              error
                ? "border-primary bg-primary/10"
                : "border-[oklch(var(--poster-green))] bg-[oklch(var(--poster-green)/0.1)]",
            )}
          >
            {error || notice}
          </p>
        )}

        <button
          type="button"
          onClick={() => void account.signOut()}
          className={secondaryButton}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
