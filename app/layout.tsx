import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { ArchitecturalFrame } from "@/components/architectural-frame";
import { display, hand, hanziDisplay } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "默知 MoZhi | Fast HSK 1 & 2 Chinese",
  description:
    "Practice HSK 1 and HSK 2 through open real-life lessons, flexible conversations, Hanzi memory notes, audio, and immediate tests.",
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
