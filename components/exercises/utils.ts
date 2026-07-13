// Shared helpers for exercise components. Shuffles are seeded by exercise id
// so server and client render the same order (no hydration mismatch).

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  let a = seed >>> 0;
  const rand = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export type Phase = "answering" | "checked";

export interface ExerciseChildProps<E> {
  exercise: E;
  phase: Phase;
  onAnswer: (correct: boolean) => void;
}

// Option button styling for the four answer states.
export function optionClass(
  state: "idle" | "selected" | "correct" | "wrong",
): string {
  const base =
    "w-full rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default";
  switch (state) {
    case "correct":
      return `${base} border-green-600/60 bg-green-600/10 text-foreground`;
    case "wrong":
      return `${base} border-red-600/60 bg-red-600/10 text-foreground ex-shake`;
    case "selected":
      return `${base} border-primary bg-primary/10`;
    default:
      return `${base} border-border bg-card hover:border-primary/50`;
  }
}
