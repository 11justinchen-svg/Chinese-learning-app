import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { ArchitecturalFrame } from "@/components/architectural-frame";
import { display, hand, hanziDisplay } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "默知 MoZhi | Fast HSK 1 & 2 Chinese",
  description:
    "Practice the official 2025 HSK 3.0 Level 1 and Level 2 syllabus through open real-life lessons, flexible conversations, Hanzi stroke order, audio, and immediate tests.",
};

// Set the saved theme before paint to avoid a flash of the wrong palette.
const themeScript = `(function(){try{var t=localStorage.getItem('mozhi.theme');if(t==='dark'||(!t&&false)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${hand.variable} ${hanziDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <Nav />
        <ArchitecturalFrame />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
