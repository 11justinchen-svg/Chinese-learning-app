import Link from "next/link";
import { UNITS } from "@/lib/lessons";
import { cn } from "@/lib/utils";

// Snake offsets so the path of lesson nodes winds back and forth like a trail.
const OFFSETS = [0, 56, 88, 56, 0, -56, -88, -56];

export function LessonPath() {
  let globalIndex = 0;

  return (
    <section className="bg-white pb-24 pt-16 text-neutral-900">
      <div className="mx-auto max-w-xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold">
            Speak like a traveler, not a textbook
          </h2>
          <p className="mt-2 text-neutral-500">
            Every lesson is a live conversation with Xiao Hui. She plays the
            taxi driver, the waiter, the shop owner, and you do the talking.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {UNITS.map((unit, unitIndex) => (
            <div key={unit.id}>
              {/* Unit banner */}
              <div
                className={cn(
                  "flex items-center justify-between rounded-2xl p-5 text-white shadow-md",
                  unit.banner,
                )}
              >
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider opacity-90">
                    Unit {unitIndex + 1}
                  </p>
                  <h3 className="text-xl font-extrabold">{unit.title}</h3>
                  <p className="mt-0.5 text-sm opacity-90">
                    {unit.description}
                  </p>
                </div>
              </div>

              {/* Lesson nodes */}
              <div className="mt-8 flex flex-col items-center gap-9">
                {unit.lessons.map((lesson) => {
                  const offset = OFFSETS[globalIndex % OFFSETS.length];
                  const isFirst = globalIndex === 0;
                  globalIndex += 1;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/chat?scenario=${lesson.id}`}
                      className="group relative flex flex-col items-center"
                      style={{ transform: `translateX(${offset}px)` }}
                    >
                      {isFirst && (
                        <span className="absolute -top-11 animate-bounce rounded-xl border-2 border-violet-200 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-violet-600 shadow-sm">
                          Start
                        </span>
                      )}
                      <span
                        className={cn(
                          "flex h-[74px] w-[74px] items-center justify-center rounded-full border-b-[6px] text-3xl shadow-sm transition-transform group-hover:scale-105 group-active:translate-y-1 group-active:border-b-2",
                          unit.node,
                        )}
                      >
                        {lesson.emoji}
                      </span>
                      <span className="mt-2 text-sm font-bold">
                        {lesson.title}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {lesson.phrase}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
