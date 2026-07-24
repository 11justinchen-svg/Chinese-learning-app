"use client";

import type {
  CustomFlashcard,
  LearningSnapshot,
} from "@/lib/account/types";
import type { ProgressStore } from "@/lib/progression";
import type { SrsStore } from "@/lib/srs";
import {
  LOCAL_DATA_REFRESHED_EVENT,
  LOCAL_DATA_UPDATED_AT_KEY,
} from "@/lib/account/events";

const PROGRESS_KEY = "mozhi.progress.v1";
const SRS_KEY = "mozhi.srs.v1";
const CUSTOM_CARDS_KEY = "mozhi.cards.v1";
const GUEST_SNAPSHOT_KEY = "mozhi.guest.snapshot.v1";
const ACTIVE_USER_KEY = "mozhi.account.active-user.v1";

const EMPTY_PROGRESS: ProgressStore = { version: 1, words: {}, stages: {} };

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function readLearningSnapshot(): LearningSnapshot {
  if (typeof window === "undefined") {
    return {
      schemaVersion: 1,
      progress: EMPTY_PROGRESS,
      srs: {},
      customCards: [],
      updatedAt: 0,
    };
  }
  const progress = parseJson<ProgressStore>(
    localStorage.getItem(PROGRESS_KEY),
    EMPTY_PROGRESS,
  );
  return {
    schemaVersion: 1,
    progress:
      progress.version === 1 && progress.words && progress.stages
        ? progress
        : EMPTY_PROGRESS,
    srs: parseJson<SrsStore>(localStorage.getItem(SRS_KEY), {}),
    customCards: parseJson<CustomFlashcard[]>(
      localStorage.getItem(CUSTOM_CARDS_KEY),
      [],
    ).filter(
      (card): card is CustomFlashcard =>
        Boolean(
          card &&
            typeof card.id === "string" &&
            typeof card.hanzi === "string" &&
            typeof card.pinyin === "string" &&
            typeof card.meaning === "string",
        ),
    ),
    updatedAt:
      Number(localStorage.getItem(LOCAL_DATA_UPDATED_AT_KEY) ?? 0) || 0,
  };
}

export function writeLearningSnapshot(snapshot: LearningSnapshot) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(snapshot.progress));
  localStorage.setItem(SRS_KEY, JSON.stringify(snapshot.srs));
  localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(snapshot.customCards));
  localStorage.setItem(
    LOCAL_DATA_UPDATED_AT_KEY,
    String(snapshot.updatedAt),
  );
  window.dispatchEvent(new Event(LOCAL_DATA_REFRESHED_EVENT));
}

function saveGuestSnapshot(snapshot: LearningSnapshot) {
  localStorage.setItem(GUEST_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export function prepareLocalDataForUser(userId: string) {
  if (typeof window === "undefined") return readLearningSnapshot();
  const activeUserId = localStorage.getItem(ACTIVE_USER_KEY);

  if (activeUserId === userId) return readLearningSnapshot();
  if (activeUserId && activeUserId !== userId) restoreGuestLearningData();

  const guestSnapshot = readLearningSnapshot();
  saveGuestSnapshot(guestSnapshot);
  localStorage.setItem(ACTIVE_USER_KEY, userId);
  return guestSnapshot;
}

export function restoreGuestLearningData() {
  if (typeof window === "undefined") return;
  const snapshot = parseJson<LearningSnapshot | null>(
    localStorage.getItem(GUEST_SNAPSHOT_KEY),
    null,
  );
  if (snapshot?.schemaVersion === 1) writeLearningSnapshot(snapshot);
  else
    writeLearningSnapshot({
      schemaVersion: 1,
      progress: EMPTY_PROGRESS,
      srs: {},
      customCards: [],
      updatedAt: Date.now(),
    });
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export function restoreGuestIfAccountWasActive() {
  if (
    typeof window !== "undefined" &&
    localStorage.getItem(ACTIVE_USER_KEY)
  ) {
    restoreGuestLearningData();
    return true;
  }
  return false;
}
