// Browser text-to-speech for Mandarin via window.speechSynthesis.
// Voice availability varies by OS/browser; callers must handle canSpeakChinese() === false.

let cachedVoice: SpeechSynthesisVoice | null | undefined;

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function getZhVoice(): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null;
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null; // not loaded yet — don't cache
  cachedVoice =
    voices.find((v) => v.lang.replace("_", "-").toLowerCase() === "zh-cn") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("zh")) ??
    null;
  return cachedVoice;
}

// Voice lists load asynchronously in some browsers; returns an unsubscribe.
export function onVoicesReady(cb: () => void): () => void {
  if (!speechSupported()) return () => {};
  if (window.speechSynthesis.getVoices().length > 0) {
    cb();
    return () => {};
  }
  const handler = () => {
    cachedVoice = undefined;
    cb();
  };
  window.speechSynthesis.addEventListener("voiceschanged", handler);
  return () =>
    window.speechSynthesis.removeEventListener("voiceschanged", handler);
}

export function canSpeakChinese(): boolean {
  return speechSupported() && getZhVoice() !== null;
}

// Speak Mandarin text. Must be called from a user gesture (autoplay policies).
// Returns false when speech is unavailable.
export function speak(text: string, opts?: { rate?: number }): boolean {
  const voice = getZhVoice();
  if (!voice) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = "zh-CN";
  u.rate = opts?.rate ?? 0.85;
  window.speechSynthesis.speak(u);
  return true;
}
