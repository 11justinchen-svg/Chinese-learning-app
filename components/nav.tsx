"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpenText, Headphones, Layers, Library, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/lessons", label: "Lessons", hanzi: "课", icon: Route },
  { href: "/grammar", label: "Grammar", hanzi: "法", icon: BookOpenText },
  { href: "/conversation", label: "Role calls", hanzi: "说", icon: Headphones },
  { href: "/progress", label: "Progress", hanzi: "进", icon: BarChart3 },
  { href: "/flashcards", label: "Flashcards", hanzi: "习", icon: Layers },
  { href: "/hanzi", label: "Hanzi", hanzi: "字", icon: Library },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/lessons"
          aria-label="MoZhi lessons"
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="seal h-9 w-9 text-lg transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            默
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight">MoZhi</span>
            <span className="hidden text-[0.62rem] tracking-[0.22em] text-muted-foreground sm:block">
              默知 · LEARN BY SPEAKING
            </span>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-0.5 sm:gap-1">
          {links.map(({ href, label, hanzi, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
              className={cn(
                "group relative flex min-h-11 items-center gap-2 px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3",
                pathname.startsWith(href)
                  ? "text-foreground after:absolute after:inset-x-2 after:-bottom-[0.65rem] after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="font-[family-name:var(--font-hanzi)] text-lg sm:hidden">
                {hanzi}
              </span>
              <Icon className="hidden h-4 w-4 sm:block" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <div className="ml-1 border-l border-border pl-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
