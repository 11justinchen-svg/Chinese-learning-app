import type { ProgressStore } from "@/lib/progression";
import type { SrsStore } from "@/lib/srs";

export interface CustomFlashcard {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface LearningSnapshot {
  schemaVersion: 1;
  progress: ProgressStore;
  srs: SrsStore;
  customCards: CustomFlashcard[];
  updatedAt: number;
}

export type SyncState =
  | "idle"
  | "syncing"
  | "synced"
  | "offline"
  | "error";
