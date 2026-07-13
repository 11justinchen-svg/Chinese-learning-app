"use client";

import { useEffect, useState } from "react";
import {
  cancelSpeech,
  onVoicesReady,
  type SpeechAvailability,
} from "./speech";

/** Reactive Web Speech readiness, including asynchronously loaded voices. */
export function useMandarinSpeech(): SpeechAvailability {
  // A stable server/client initial value avoids hydration differences and,
  // crucially, prevents a listening prompt from briefly exposing pinyin.
  const [availability, setAvailability] =
    useState<SpeechAvailability>("loading");

  useEffect(() => {
    const unsubscribe = onVoicesReady(setAvailability);
    return () => {
      unsubscribe();
      // Do not let a lesson line keep speaking after its screen is gone.
      cancelSpeech();
    };
  }, []);
  return availability;
}

export function speechFallbackMessage(
  availability: SpeechAvailability,
): string | null {
  if (availability === "unsupported")
    return "Speech is not supported in this browser. Use the pinyin guide.";
  if (availability === "unavailable")
    return "No Mandarin voice is installed. Use the pinyin guide or add a Chinese (Mainland) system voice.";
  return null;
}
