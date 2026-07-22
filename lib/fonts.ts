import { Kalam, Space_Grotesk, ZCOOL_KuaiLe } from "next/font/google";

// Latin display face for headings and pinyin: geometric, a little technical,
// nothing like the rounded friendliness of a gamified language app.
export const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const hand = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

// Expressive display face only. Sentence text and controls continue to use
// the Song/Ming and geometric sans stacks for legibility.
export const hanziDisplay = ZCOOL_KuaiLe({
  weight: "400",
  variable: "--font-hanzi-display",
  display: "swap",
  preload: false,
  fallback: ["Kaiti SC", "STKaiti", "Songti SC"],
});
