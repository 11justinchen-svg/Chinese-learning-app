import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { display } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "默知 MoZhi | HSK-1 Chinese",
  description:
    "Learn the 150 HSK-1 words the way characters actually work: every hanzi broken into the components that give it meaning, plus flashcards you can study and build yourself. No account, no API, works offline.",
};

// Set the saved theme before paint to avoid a flash of the wrong palette.
const themeScript = `(function(){try{var t=localStorage.getItem('mozhi.theme');if(t==='dark'||(!t&&false)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={display.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
