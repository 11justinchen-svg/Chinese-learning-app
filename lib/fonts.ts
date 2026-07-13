import { Space_Grotesk } from "next/font/google";

// Latin display face for headings and pinyin: geometric, a little technical,
// nothing like the rounded friendliness of a gamified language app.
export const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
