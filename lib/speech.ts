// Browser text-to-speech for standard Mandarin via the Web Speech API.
// Voice quality and availability vary by OS/browser, so callers must retain a
// visible text/pinyin fallback.

export type SpeechAvailability =
  | "unsupported"
  | "loading"
  | "unavailable"
  | "ready";

export interface VoiceDescriptor {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
}

export interface SpeakOptions {
  /** Web Speech rate. MoZhi clamps this to a clear beginner-safe range. */
  rate?: number;
  pitch?: number;
  volume?: number;
  /** Replace current speech by default; append only for an authored sequence. */
  queue?: "replace" | "append";
}

const DEFAULT_RATE = 0.86;
const DEFAULT_PITCH = 1;
const DEFAULT_VOLUME = 1;

// Keep utterances referenced until completion. Safari can otherwise stop an
// utterance early after it is garbage-collected.
const activeUtterances = new Set<SpeechSynthesisUtterance>();

export function speechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined"
  );
}

function normalizedLang(lang: string): string {
  return lang.trim().replaceAll("_", "-").toLowerCase();
}

function voiceScore(voice: VoiceDescriptor): number {
  const lang = normalizedLang(voice.lang);
  const name = voice.name.toLowerCase();

  // Standard Mainland Mandarin first, then Singapore/Hans, then other
  // Mandarin voices. zh-HK voices are normally Cantonese and are excluded
  // unless the provider explicitly labels the voice Mandarin/Putonghua.
  let score = 0;
  if (lang === "zh-cn" || lang === "cmn-cn") score += 600;
  else if (lang === "zh-sg" || lang === "cmn-sg") score += 540;
  else if (lang === "zh-hans" || lang.startsWith("zh-hans-")) score += 520;
  else if (lang === "zh-tw" || lang === "cmn-tw") score += 380;
  else if (lang === "zh" || lang === "cmn") score += 340;
  else if (
    lang.startsWith("zh-hk") &&
    /mandarin|putonghua|普通话/.test(name)
  )
    score += 280;
  else return Number.NEGATIVE_INFINITY;

  if (/cantonese|yue|粤|廣東|广东/.test(name))
    return Number.NEGATIVE_INFINITY;

  // Providers expose quality through names rather than a standard field.
  // Quality markers outweigh local/remote status; a neural remote Mandarin
  // voice is usually clearer than a basic local synthesizer.
  if (/natural|neural|premium|enhanced/.test(name)) score += 120;
  if (/xiaoxiao|yunxi|yunyang|xiaoyi|晓晓|云希|云扬/.test(name)) score += 65;
  if (/ting[- ]?ting|meijia|sinji|普通话|mandarin/.test(name)) score += 45;
  if (/google/.test(name)) score += 30;
  if (/compact|espeak/.test(name)) score -= 35;
  if (voice.localService) score += 18;
  if (voice.default) score += 4;
  return score;
}

/** Select the clearest likely standard-Mandarin voice deterministically. */
export function selectMandarinVoice<T extends VoiceDescriptor>(
  voices: readonly T[],
): T | null {
  let best: T | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const voice of voices) {
    const score = voiceScore(voice);
    // Stable input-order tie breaking respects the browser's preference.
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  }
  return Number.isFinite(bestScore) ? best : null;
}

export function getZhVoice(): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null;
  return selectMandarinVoice(window.speechSynthesis.getVoices());
}

export function getSpeechAvailability(): SpeechAvailability {
  if (!speechSupported()) return "unsupported";
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return "loading";
  return selectMandarinVoice(voices) ? "ready" : "unavailable";
}

// Browser voice lists often arrive after hydration. Subscribe even when some
// voices already exist because a Chinese voice can arrive in a later batch.
// Timed refreshes cover WebKit versions that omit voiceschanged.
export function onVoicesReady(
  cb: (availability: SpeechAvailability) => void,
): () => void {
  if (!speechSupported()) {
    cb("unsupported");
    return () => {};
  }

  let stopped = false;
  let settled = false;
  let last: SpeechAvailability | undefined;
  const refresh = (finishLoading = false) => {
    if (stopped) return;
    if (finishLoading) settled = true;
    const detected = getSpeechAvailability();
    const next = settled && detected === "loading" ? "unavailable" : detected;
    if (next !== last) {
      last = next;
      cb(next);
    }
  };
  const synthesis = window.speechSynthesis;
  const handleVoicesChanged = () => refresh();
  synthesis.addEventListener("voiceschanged", handleVoicesChanged);
  const timers = [100, 500, 1500, 3000].map((delay) =>
    window.setTimeout(() => refresh(delay === 3000), delay),
  );
  refresh();

  return () => {
    stopped = true;
    synthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}

export function canSpeakChinese(): boolean {
  return getSpeechAvailability() === "ready";
}

/** Normalize pauses and punctuation without changing the Mandarin content. */
export function normalizeMandarinText(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/gu, "")
    .replace(/\s+/gu, " ")
    .replace(/\s*([，。！？；：])\s*/gu, "$1")
    .replace(/,/gu, "，")
    .replace(/\?/gu, "？")
    .replace(/!/gu, "！")
    .replace(/;/gu, "；")
    .replace(/:{1}(?!\d)/gu, "：")
    .replace(/\s*([，。！？；：])\s*/gu, "$1")
    .trim();
}

function clamp(value: number | undefined, fallback: number, min: number, max: number) {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function cancelSpeech(): void {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
  activeUtterances.clear();
}

// Must be called from a user gesture in browsers with autoplay restrictions.
// Returns false when there is no usable Mandarin voice or no speakable text.
export function speak(text: string, opts: SpeakOptions = {}): boolean {
  if (!speechSupported()) return false;
  const voice = getZhVoice();
  const normalizedText = normalizeMandarinText(text);
  if (!voice || !normalizedText) return false;

  const synthesis = window.speechSynthesis;
  if (opts.queue !== "append") {
    synthesis.cancel();
    activeUtterances.clear();
  }

  const utterance = new SpeechSynthesisUtterance(normalizedText);
  utterance.voice = voice;
  utterance.lang = voice.lang || "zh-CN";
  utterance.rate = clamp(opts.rate, DEFAULT_RATE, 0.55, 1.15);
  utterance.pitch = clamp(opts.pitch, DEFAULT_PITCH, 0.8, 1.2);
  utterance.volume = clamp(opts.volume, DEFAULT_VOLUME, 0.25, 1);

  const release = () => activeUtterances.delete(utterance);
  utterance.addEventListener("end", release, { once: true });
  utterance.addEventListener("error", release, { once: true });
  activeUtterances.add(utterance);
  // A previously paused synthesis queue otherwise stays silent in Safari.
  synthesis.resume();
  synthesis.speak(utterance);
  return true;
}
