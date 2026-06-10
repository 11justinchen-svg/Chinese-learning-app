"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { SplineScene } from "@/components/ui/splite";
import { cn } from "@/lib/utils";

const HANZI_TEXT = Array(14).fill("默知").join("　");
const LATIN_TEXT = Array(6).fill("The Chinese Learning App").join("  ·  ");

interface RowSpec {
  kind: "hanzi" | "latin";
  className: string;
  reverse?: boolean;
  duration: number;
}

const ROWS: RowSpec[] = [
  { kind: "hanzi", className: "text-neutral-900", duration: 58 },
  { kind: "latin", className: "text-hollow-black", reverse: true, duration: 46 },
  { kind: "hanzi", className: "text-violet-600", duration: 52 },
  { kind: "latin", className: "text-neutral-900", reverse: true, duration: 60 },
  { kind: "hanzi", className: "text-hollow-violet", duration: 44 },
  { kind: "latin", className: "text-neutral-900", duration: 54 },
  { kind: "hanzi", className: "text-neutral-900", reverse: true, duration: 50 },
];

function BackdropRow({ kind, className, reverse, duration }: RowSpec) {
  const text = kind === "hanzi" ? HANZI_TEXT : LATIN_TEXT;
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className={cn("marquee-row", reverse && "marquee-reverse")}
        style={{ animationDuration: `${duration}s` }}
      >
        <span
          className={cn(
            "pr-16 font-black leading-[1.04]",
            kind === "hanzi"
              ? "text-[4.5rem] tracking-[0.08em] md:text-[5.5rem]"
              : "text-[3.6rem] tracking-[0.02em] md:text-[4.4rem]",
            className,
          )}
        >
          {text}
        </span>
        <span
          aria-hidden
          className={cn(
            "pr-16 font-black leading-[1.04]",
            kind === "hanzi"
              ? "text-[4.5rem] tracking-[0.08em] md:text-[5.5rem]"
              : "text-[3.6rem] tracking-[0.02em] md:text-[4.4rem]",
            className,
          )}
        >
          {text}
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  const splineRef = useRef<any>(null);

  // The public robot scene ships with its baked-in states. We look for a
  // greeting object and fire its interaction events so the robot waves on
  // load and keeps waving periodically instead of sitting in its idle loop.
  const wave = useCallback(() => {
    const app = splineRef.current;
    if (!app) return;
    const candidates = [
      "wave",
      "Wave",
      "hello",
      "Hello",
      "greeting",
      "Robot",
      "robot",
      "Nexbot",
      "bot",
      "Character",
    ];
    for (const name of candidates) {
      let obj: any = null;
      try {
        obj = app.findObjectByName?.(name);
      } catch {
        obj = null;
      }
      if (!obj) continue;
      for (const event of ["mouseDown", "mouseUp", "keyDown"]) {
        try {
          obj.emitEvent?.(event);
        } catch {}
        try {
          app.emitEvent?.(event, obj.name);
        } catch {}
      }
      break;
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(wave, 9000);
    return () => clearInterval(timer);
  }, [wave]);

  const handleLoad = useCallback(
    (app: any) => {
      splineRef.current = app;
      setTimeout(wave, 800);
    },
    [wave],
  );

  return (
    <section className="relative h-[600px] overflow-hidden bg-white text-neutral-900 md:h-[680px]">
      {/* Marquee text backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 flex select-none flex-col justify-center gap-1"
      >
        {ROWS.map((row, i) => (
          <BackdropRow key={i} {...row} />
        ))}
      </div>

      {/* Soft veil so the foreground reads against the type */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />

      {/* The robot, stage right */}
      <div className="absolute inset-y-0 right-0 z-10 hidden w-[52%] md:block">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="h-full w-full"
          onLoad={handleLoad}
        />
      </div>

      {/* Logo ring */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 md:left-[24%]">
        <div className="relative h-[300px] w-[300px] md:h-[350px] md:w-[350px]">
          <div className="absolute inset-0 rounded-full border-[26px] border-violet-500 blur-[3px]" />
          <div className="absolute inset-[26px] flex flex-col items-center justify-center rounded-full bg-white shadow-xl">
            <span className="text-7xl font-black tracking-tight md:text-8xl">
              默知
            </span>
            <span className="mt-1 text-sm font-bold uppercase tracking-[0.22em] text-neutral-500">
              MòZhī
            </span>
            <span className="text-[11px] font-medium text-neutral-400">
              The Chinese Learning App
            </span>
            <Link
              href="/chat?scenario=greetings"
              className="mt-4 rounded-2xl border-b-4 border-violet-700 bg-violet-500 px-6 py-2.5 text-sm font-extrabold uppercase tracking-wide text-white transition-transform hover:scale-105 active:translate-y-0.5 active:border-b-2"
            >
              Start
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
