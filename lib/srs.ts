"use client";

// Tiny Leitner spaced-repetition store, persisted in localStorage. No backend.

export interface CardState {
  box: number; // 0 = new/lapsed … 5 = mastered
  due: number; // epoch ms when the card is next due
  reps: number;
}

export type SrsStore = Record<string, CardState>;

const KEY = "mozhi.srs.v1";
const DAY = 24 * 60 * 60 * 1000;
// Days until a card in each box comes back.
const INTERVALS = [0, 1, 2, 4, 8, 16];
export const MASTERED_BOX = 4;

export function loadSrs(): SrsStore {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as SrsStore;
  } catch {
    return {};
  }
}

export function saveSrs(store: SrsStore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // ignore storage failures
  }
}

export function isDue(state: CardState | undefined, now = Date.now()): boolean {
  return !state || state.due <= now;
}

export function grade(
  store: SrsStore,
  id: string,
  good: boolean,
  now = Date.now(),
): SrsStore {
  const cur = store[id] ?? { box: 0, due: 0, reps: 0 };
  const box = good ? Math.min(cur.box + 1, INTERVALS.length - 1) : 0;
  const due = good ? now + INTERVALS[box] * DAY : now; // "again" stays due this session
  return { ...store, [id]: { box, due, reps: cur.reps + 1 } };
}

export function deckStats(store: SrsStore, ids: string[], now = Date.now()) {
  let due = 0;
  let mastered = 0;
  let seen = 0;
  for (const id of ids) {
    const s = store[id];
    if (s) seen += 1;
    if (s && s.box >= MASTERED_BOX) mastered += 1;
    // New cards belong in "Study all". "Due" is reserved for cards the
    // learner has already encountered and now needs to retrieve again.
    if (s && isDue(s, now)) due += 1;
  }
  return { total: ids.length, due, mastered, seen, new: ids.length - seen };
}
