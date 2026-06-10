import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { LessonPath } from "@/components/lesson-path";

export default function HomePage() {
  return (
    <main className="bg-white">
      <Hero />
      <LessonPath />

      {/* Hanzi teaser */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16 text-neutral-900">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 md:flex-row">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border-b-4 border-violet-700 bg-violet-500 text-7xl text-white shadow-md">
            想
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">
              Characters that make sense
            </h2>
            <p className="mt-2 max-w-xl text-neutral-600">
              默知 teaches the meaning inside every character, not just its
              strokes. 想 (to think) is the sound of 相 sitting on top of a
              heart 心, because thinking lives in the heart. Once you see the
              components, new characters start reading themselves.
            </p>
            <Link
              href="/hanzi"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:underline"
            >
              Break down a character <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
