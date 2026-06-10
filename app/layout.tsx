import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "默知 MoZhi | The Chinese Learning App",
  description:
    "Learn traveler's Chinese through real conversation with a robot tutor. Lesson scenarios cover taxis, restaurants, hotels, and bargaining, plus a hanzi system that explains the meaning inside every character.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
