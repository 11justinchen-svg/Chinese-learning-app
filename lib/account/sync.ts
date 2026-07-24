"use client";

import { mergeLearningSnapshots } from "@/lib/account/merge";
import {
  prepareLocalDataForUser,
  readLearningSnapshot,
  writeLearningSnapshot,
} from "@/lib/account/local";
import type { LearningSnapshot } from "@/lib/account/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

function isLearningSnapshot(value: unknown): value is LearningSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<LearningSnapshot>;
  return (
    snapshot.schemaVersion === 1 &&
    snapshot.progress?.version === 1 &&
    Boolean(snapshot.progress.words && snapshot.progress.stages) &&
    Boolean(snapshot.srs && typeof snapshot.srs === "object") &&
    Array.isArray(snapshot.customCards)
  );
}

export async function syncLearningData(userId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Cloud accounts are not configured.");

  prepareLocalDataForUser(userId);
  const local = readLearningSnapshot();
  const { data, error } = await supabase
    .from("learning_progress")
    .select("payload")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;

  const remote = isLearningSnapshot(data?.payload) ? data.payload : null;
  const merged = remote
    ? mergeLearningSnapshots(remote, local)
    : { ...local, updatedAt: Math.max(local.updatedAt, Date.now()) };

  const { error: saveError } = await supabase
    .from("learning_progress")
    .upsert(
      {
        user_id: userId,
        payload: merged,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  if (saveError) throw saveError;

  writeLearningSnapshot(merged);
  return merged;
}
