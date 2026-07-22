"use client";

import {
  ArrowLeft,
  Check,
  CircleStop,
  Headphones,
  Lightbulb,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  RotateCcw,
  Send,
  Signal,
  Sparkles,
  Volume2,
  WifiOff,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  assessRoleCallAnswer,
  findRoleCallScenario,
  findRoleCallScenarioForGrammar,
  ROLE_CALL_SCENARIOS,
  type RoleCallLine,
  type RoleCallPersonaId,
} from "@/lib/role-calls";
import { canSpeakChinese, onVoicesReady, speak } from "@/lib/speech";
import {
  loadProgress,
  recordAnswer,
  saveProgress,
} from "@/lib/progression";
import { cn } from "@/lib/utils";

type SupportLevel = "guided" | "standard" | "challenge";
type CallState = "idle" | "connecting" | "active" | "thinking" | "complete";
type AiProvider = "anthropic" | "ollama";

const ROLE_SPANS = [
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

const ROLE_FIELDS = [
  "bg-[oklch(var(--poster-yellow)/0.7)]",
  "bg-[oklch(var(--poster-pink)/0.22)]",
  "bg-[oklch(var(--poster-cyan)/0.42)]",
  "bg-[oklch(var(--poster-blue)/0.16)]",
  "bg-[oklch(var(--poster-green)/0.28)]",
];

interface TranscriptTurn extends RoleCallLine {
  id: string;
  speaker: "persona" | "learner";
}

interface AiCoachFeedback {
  note: string;
  betterHanzi: string;
  betterPinyin: string;
}

interface AiRoleResponse {
  turn: RoleCallLine | null;
  feedback: AiCoachFeedback | null;
  provider: AiProvider | null;
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly 0: { transcript: string };
}

interface SpeechRecognitionEventLike {
  readonly results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorLike {
  readonly error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface RoleCallStudioProps {
  initialScenarioId?: RoleCallPersonaId;
  grammarLessonId?: string;
  embedded?: boolean;
  onComplete?: (result: {
    scenarioId: RoleCallPersonaId;
    firstAttemptCorrect: number;
    totalSteps: number;
  }) => void;
}

function recognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const speechWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return (
    speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null
  );
}

function speechErrorMessage(error: string): string {
  if (error === "not-allowed" || error === "service-not-allowed")
    return "Microphone access was blocked. You can keep the call going by typing.";
  if (error === "no-speech")
    return "I didn’t hear anything. Try again or type your reply.";
  if (error === "audio-capture")
    return "No microphone was found. Type your reply instead.";
  return "Speech recognition stopped. Your typed reply still works.";
}

async function readAiResponse(
  scenarioId: RoleCallPersonaId,
  stepId: string,
  learnerText: string,
  supportLevel: SupportLevel,
  signal: AbortSignal,
): Promise<AiRoleResponse> {
  const response = await fetch("/api/conversation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId, stepId, learnerText, supportLevel }),
    signal,
  });
  if (!response.ok || !response.body)
    return { turn: null, feedback: null, provider: null };

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let line: RoleCallLine | null = null;
  let feedback: AiCoachFeedback | null = null;
  let provider: AiProvider | null = null;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const records = buffer.split("\n");
    buffer = records.pop() ?? "";
    for (const record of records) {
      if (!record.trim()) continue;
      try {
        const event = JSON.parse(record) as {
          type: string;
          turn?: RoleCallLine;
          feedback?: AiCoachFeedback;
          provider?: string;
        };
        if (event.type === "turn" && event.turn) line = event.turn;
        if (event.type === "feedback" && event.feedback) {
          feedback = event.feedback;
          if (event.provider === "anthropic" || event.provider === "ollama")
            provider = event.provider;
        }
      } catch {
        // An incomplete optional AI event never blocks the authored call.
      }
    }
  }
  return { turn: line, feedback, provider };
}

function formatAiFeedback(feedback: AiCoachFeedback): string {
  return `${feedback.note} Better: ${feedback.betterHanzi} (${feedback.betterPinyin})`;
}

export function RoleCallStudio({
  initialScenarioId,
  grammarLessonId,
  embedded = false,
  onComplete,
}: RoleCallStudioProps) {
  const mappedScenario = grammarLessonId
    ? findRoleCallScenarioForGrammar(grammarLessonId)
    : undefined;
  const firstScenario =
    findRoleCallScenario(initialScenarioId ?? "") ??
    mappedScenario ??
    ROLE_CALL_SCENARIOS[0];
  const [selectedId, setSelectedId] = useState<RoleCallPersonaId>(
    firstScenario.id,
  );
  const [supportLevel, setSupportLevel] = useState<SupportLevel>("guided");
  const [callState, setCallState] = useState<CallState>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);
  const [learnerText, setLearnerText] = useState("");
  const [hintLevel, setHintLevel] = useState(-1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackSource, setFeedbackSource] = useState<"authored" | "ai">("authored");
  const [feedbackProvider, setFeedbackProvider] = useState<AiProvider | null>(null);
  const [warmupOpen, setWarmupOpen] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiProvider, setAiProvider] = useState<AiProvider | null>(null);
  const [aiFallback, setAiFallback] = useState(false);
  const [attemptedSteps, setAttemptedSteps] = useState<Set<string>>(new Set());
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const callGenerationRef = useRef(0);
  const aiAbortRef = useRef<AbortController | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const scenario = findRoleCallScenario(selectedId) ?? ROLE_CALL_SCENARIOS[0];
  const currentStep = scenario.steps[stepIndex];

  useEffect(() => {
    setRecognitionSupported(Boolean(recognitionConstructor()));
    setTtsSupported(canSpeakChinese());
    const stopListeningForVoices = onVoicesReady(() =>
      setTtsSupported(canSpeakChinese()),
    );
    fetch("/api/conversation", { method: "GET" })
      .then((response) => (response.ok ? response.json() : null))
      .then(
        (data: {
          aiAvailable?: boolean;
          preferredProvider?: AiProvider | null;
        } | null) => {
          setAiAvailable(Boolean(data?.aiAvailable));
          setAiProvider(data?.preferredProvider ?? null);
        },
      )
      .catch(() => {
        setAiAvailable(false);
        setAiProvider(null);
      });
    return () => {
      callGenerationRef.current += 1;
      aiAbortRef.current?.abort();
      stopListeningForVoices();
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, feedback]);

  const progress = useMemo(
    () => (scenario.steps.length ? stepIndex / scenario.steps.length : 0),
    [scenario.steps.length, stepIndex],
  );

  function resetCall(nextState: CallState = "idle") {
    callGenerationRef.current += 1;
    aiAbortRef.current?.abort();
    aiAbortRef.current = null;
    recognitionRef.current?.stop();
    setCallState(nextState);
    setStepIndex(0);
    setTranscript([]);
    setLearnerText("");
    setHintLevel(-1);
    setFeedback(null);
    setFeedbackSource("authored");
    setFeedbackProvider(null);
    setMicError(null);
    setIsListening(false);
    setAiFallback(false);
    setAttemptedSteps(new Set());
    setFirstAttemptCorrect(0);
  }

  function startCall() {
    resetCall("connecting");
    const generation = callGenerationRef.current;
    window.setTimeout(() => {
      if (generation !== callGenerationRef.current) return;
      setTranscript([
        { ...scenario.opening, id: `${scenario.id}-opening`, speaker: "persona" },
      ]);
      setCallState("active");
      speak(scenario.opening.hanzi, { rate: 0.78 });
    }, 450);
  }

  function endCall() {
    window.speechSynthesis?.cancel();
    resetCall("idle");
  }

  function startListening() {
    setMicError(null);
    const Recognition = recognitionConstructor();
    if (!Recognition) {
      setMicError("Live speech recognition isn’t available here. Type your reply below.");
      return;
    }
    recognitionRef.current?.stop();
    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      setIsListening(false);
      setMicError(speechErrorMessage(event.error));
    };
    recognition.onresult = (event) => {
      let heard = "";
      for (let i = 0; i < event.results.length; i += 1)
        heard += event.results[i][0]?.transcript ?? "";
      if (heard) setLearnerText(heard.trim());
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setMicError("The microphone is already busy. Type your reply or try once more.");
    }
  }

  async function submitReply(event: FormEvent) {
    event.preventDefault();
    const text = learnerText.trim();
    if (!text || !currentStep || callState !== "active") return;
    setFeedback(null);

    const wasAttempted = attemptedSteps.has(currentStep.id);
    setAttemptedSteps((previous) => new Set(previous).add(currentStep.id));
    setTranscript((previous) => [
      ...previous,
      {
        id: `${currentStep.id}-learner-${Date.now()}`,
        speaker: "learner",
        hanzi: text,
        pinyin: "",
        english: "Your reply",
      },
    ]);
    setLearnerText("");

    const evaluation = assessRoleCallAnswer(currentStep, text);
    if (!wasAttempted && currentStep.wordIds.length > 0) {
      const nextProgress = recordAnswer(
        loadProgress(),
        currentStep.wordIds,
        "reply",
        evaluation.accepted,
      );
      saveProgress(nextProgress);
    }
    if (!evaluation.accepted) {
      const nextHint = Math.min(hintLevel + 1, currentStep.hints.length - 1);
      setHintLevel(nextHint);
      setFeedback(`${currentStep.correction} ${currentStep.hints[nextHint]}`);
      setFeedbackSource("authored");
      if (aiAvailable) {
        const generation = callGenerationRef.current;
        const controller = new AbortController();
        aiAbortRef.current?.abort();
        aiAbortRef.current = controller;
        readAiResponse(
          scenario.id,
          currentStep.id,
          text,
          supportLevel,
          controller.signal,
        )
          .then((response) => {
            if (generation !== callGenerationRef.current) return;
            aiAbortRef.current = null;
            if (response.feedback) {
              setFeedback(formatAiFeedback(response.feedback));
              setFeedbackSource("ai");
              setFeedbackProvider(response.provider);
            } else {
              setAiFallback(true);
              setAiAvailable(false);
            }
          })
          .catch(() => {
            if (generation !== callGenerationRef.current) return;
            aiAbortRef.current = null;
            setAiFallback(true);
            setAiAvailable(false);
          });
      }
      return;
    }

    if (!wasAttempted) setFirstAttemptCorrect((value) => value + 1);
    setFeedback(
      [
        evaluation.correction ?? "Meaning understood. The call keeps moving.",
        evaluation.variation
          ? `Another natural reply: ${evaluation.variation}`
          : null,
      ]
        .filter(Boolean)
        .join(" "),
    );
    setFeedbackSource("authored");
    setHintLevel(-1);
    setCallState("thinking");
    const generation = callGenerationRef.current;

    let responseLine = currentStep.response;
    if (aiAvailable) {
      try {
        const controller = new AbortController();
        aiAbortRef.current?.abort();
        aiAbortRef.current = controller;
        const generated = await readAiResponse(
          scenario.id,
          currentStep.id,
          text,
          supportLevel,
          controller.signal,
        );
        if (generation !== callGenerationRef.current) return;
        aiAbortRef.current = null;
        if (generated.feedback) {
          setFeedback(formatAiFeedback(generated.feedback));
          setFeedbackSource("ai");
          setFeedbackProvider(generated.provider);
        }
        if (generated.turn) {
          responseLine = generated.turn;
        } else {
          setAiFallback(true);
          setAiAvailable(false);
        }
      } catch {
        if (generation !== callGenerationRef.current) return;
        aiAbortRef.current = null;
        setAiFallback(true);
        setAiAvailable(false);
      }
    }

    window.setTimeout(() => {
      if (generation !== callGenerationRef.current) return;
      setTranscript((previous) => [
        ...previous,
        {
          ...responseLine,
          id: `${currentStep.id}-persona`,
          speaker: "persona",
        },
      ]);
      speak(responseLine.hanzi, { rate: 0.78 });
      const nextStep = stepIndex + 1;
      if (nextStep >= scenario.steps.length) {
        setStepIndex(nextStep);
        setCallState("complete");
        onComplete?.({
          scenarioId: scenario.id,
          firstAttemptCorrect: firstAttemptCorrect + (wasAttempted ? 0 : 1),
          totalSteps: scenario.steps.length,
        });
      } else {
        setStepIndex(nextStep);
        setCallState("active");
      }
    }, 350);
  }

  const showPinyin = supportLevel !== "challenge";
  const showEnglish = supportLevel === "guided";

  if (callState === "idle") {
    return (
      <main className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:py-12", embedded && "px-0 py-0")}>
        <div className="max-w-3xl border-b border-foreground pb-8">
          <div className="inline-flex items-center gap-2 border border-foreground bg-[oklch(var(--poster-cyan))] px-3 py-1 text-xs font-semibold text-foreground">
            <Headphones className="h-3.5 w-3.5" />
            HSK 1 + 2 ROLE CALLS
          </div>
          <p className="mt-5 font-[family-name:var(--font-hand)] text-xl text-primary">meaning first, one useful correction</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Use your Mandarin with someone who stays in character.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Speak, type Hanzi, or type pinyin. Natural variants are welcome. If
            your meaning works, the call continues and gives one useful note.
          </p>
        </div>

        <section aria-labelledby="role-heading" className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="role-heading" className="text-lg font-semibold">Choose who answers</h2>
              <p className="mt-1 text-sm text-muted-foreground">Five everyday calls, about two minutes each.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {aiAvailable ? <Sparkles className="h-3.5 w-3.5 text-primary" /> : <WifiOff className="h-3.5 w-3.5" />}
              {aiAvailable
                ? aiProvider === "ollama"
                  ? "Private local AI feedback ready"
                  : "Cloud AI feedback ready"
                : "Authored offline feedback"}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
            {ROLE_CALL_SCENARIOS.map((option, index) => {
              const selected = option.id === selectedId;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedId(option.id);
                    setWarmupOpen(false);
                  }}
                  className={cn(
                    "group min-h-48 border border-foreground p-5 text-left shadow-[3px_3px_0_oklch(var(--foreground))] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    ROLE_SPANS[index],
                    ROLE_FIELDS[index],
                    selected ? "-translate-x-0.5 -translate-y-0.5 shadow-[5px_5px_0_oklch(var(--foreground))]" : "hover:-translate-y-0.5",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-[family-name:var(--font-hanzi-display)] text-4xl">{option.roleHanzi}</span>
                    {selected && <span className="grid h-8 w-8 place-items-center border border-foreground bg-card"><Check className="h-3.5 w-3.5" /></span>}
                  </div>
                  <p className="mt-4 font-semibold">{option.role}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{option.description}</p>
                  <p className="mt-3 text-[0.68rem] font-bold uppercase tracking-wide text-muted-foreground">Open now · {option.steps.length} turns</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="poster-panel mt-8 grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-7">
          <div>
            <label htmlFor="call-support" className="text-sm font-semibold">Choose your support</label>
            <select
              id="call-support"
              value={supportLevel}
              onChange={(event) => setSupportLevel(event.target.value as SupportLevel)}
              className="mt-2 block min-h-11 w-full max-w-sm border border-foreground bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="guided">Guided: pinyin, English, and model</option>
              <option value="standard">Standard: pinyin and hints on request</option>
              <option value="challenge">Challenge: hide pinyin and model</option>
            </select>
            <p className="mt-3 text-sm text-muted-foreground">
              Goal: <span className="font-medium text-foreground">{scenario.goal}</span> · {scenario.setting}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button type="button" aria-expanded={warmupOpen} onClick={() => setWarmupOpen((value) => !value)} className="inline-flex min-h-12 items-center gap-2 border border-foreground bg-card px-4 py-2 text-sm font-bold hover:bg-secondary">
              <Volume2 className="h-4 w-4" /> Warm up phrases
            </button>
            <button
              type="button"
              onClick={startCall}
              className="stamp-button min-h-12"
            >
              <Phone className="h-4 w-4" /> Call {scenario.role}
            </button>
          </div>
        </section>

        {warmupOpen && (
          <section className="mt-5 border border-foreground bg-card p-5 sm:p-6" aria-labelledby="warmup-heading">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="font-[family-name:var(--font-hand)] text-lg text-primary">listen, echo, then answer freely</p>
                <h2 id="warmup-heading" className="mt-1 text-xl font-bold">{scenario.role} phrase warm-up</h2>
              </div>
              <p className="text-xs text-muted-foreground">Pinyin stays visible here</p>
            </div>
            <div className="divide-y divide-border">
              {scenario.steps.map((step, index) => (
                <div key={step.id} className="grid gap-3 py-4 sm:grid-cols-[2rem_1fr_auto] sm:items-center">
                  <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                  <div>
                    <p className="font-[family-name:var(--font-hanzi)] text-2xl">{step.target.hanzi}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{step.target.pinyin}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{step.target.english}</p>
                  </div>
                  <button type="button" onClick={() => speak(step.target.hanzi, { rate: 0.72 })} className="inline-flex min-h-11 items-center justify-center gap-2 border border-foreground bg-[oklch(var(--poster-cyan)/0.35)] px-3 py-2 text-xs font-bold hover:bg-[oklch(var(--poster-cyan)/0.55)]" aria-label={`Hear ${step.target.hanzi}`}>
                    <Volume2 className="h-4 w-4" /> Hear
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    );
  }

  return (
    <main className={cn("mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-5xl flex-col px-4 py-5", embedded && "min-h-[42rem] px-0 py-0")}>
      <div className="poster-panel overflow-hidden">
        <header className="border-b border-foreground bg-[oklch(var(--poster-cyan)/0.38)] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={endCall} aria-label="Back to role selection" className="rounded-full p-2 text-muted-foreground hover:bg-background/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background/70 font-[family-name:var(--font-hanzi)] text-lg">{scenario.roleHanzi.slice(0, 1)}</div>
              <div className="min-w-0">
                <h1 className="truncate font-semibold">{scenario.role} · {scenario.roleHanzi}</h1>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Signal className="h-3 w-3" />
                  {callState === "connecting" ? "Connecting…" : callState === "thinking" ? "Thinking…" : callState === "complete" ? "Call complete" : "On the call"}
                </div>
              </div>
            </div>
            <button type="button" onClick={endCall} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label="End call">
              <PhoneOff className="h-4 w-4" /><span className="hidden sm:inline">End</span>
            </button>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-background/60" aria-label={`${Math.round(progress * 100)}% complete`}>
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
          </div>
        </header>

        <div className="grid min-h-[34rem] lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section aria-label="Call transcript" aria-live="polite" className="flex min-h-[34rem] flex-col border-border lg:border-r">
            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:max-h-[32rem] sm:p-6">
              {callState === "connecting" && (
                <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"><Phone className="h-7 w-7 animate-pulse text-primary" /></div>
                  <p className="mt-4 text-sm">Calling {scenario.role}…</p>
                </div>
              )}
              {transcript.map((turn) => {
                const learner = turn.speaker === "learner";
                return (
                  <div key={turn.id} className={cn("flex", learner ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[88%] rounded-2xl border px-4 py-3 sm:max-w-[75%]", learner ? "rounded-tr-sm border-primary/25 bg-primary/10" : "rounded-tl-sm border-border bg-background")}>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">{learner ? "You" : scenario.role}</p>
                      <div className="mt-1 flex items-start gap-2">
                        <p className="font-[family-name:var(--font-hanzi)] text-xl leading-relaxed sm:text-2xl">{turn.hanzi}</p>
                        {!learner && ttsSupported && <button type="button" onClick={() => speak(turn.hanzi, { rate: 0.78 })} aria-label={`Replay ${scenario.role} line`} className="mt-1 shrink-0 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"><Volume2 className="h-4 w-4" /></button>}
                      </div>
                      {!learner && showPinyin && <p className="mt-1 text-xs text-muted-foreground">{turn.pinyin}</p>}
                      {!learner && showEnglish && <p className="mt-1 text-sm text-muted-foreground">{turn.english}</p>}
                    </div>
                  </div>
                );
              })}
              {callState === "thinking" && <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" />{scenario.role} is replying…</div>}
              <div ref={transcriptEndRef} />
            </div>

            {callState === "complete" ? (
              <div className="border-t border-border bg-secondary/30 p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"><Check className="h-6 w-6" /></div>
                <h2 className="mt-3 text-lg font-semibold">Call goal complete</h2>
                <p className="mt-1 text-sm text-muted-foreground">First-try replies: {firstAttemptCorrect} of {scenario.steps.length}. Call again only if it is useful now.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={startCall} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary/50"><RotateCcw className="h-4 w-4" />Call again</button>
                  <button type="button" onClick={endCall} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><CircleStop className="h-4 w-4" />Choose another role</button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitReply} className="border-t border-border bg-secondary/20 p-3 sm:p-4">
                {micError && <p role="alert" className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-foreground">{micError}</p>}
                {feedback && (
                  <div role="status" className="mb-2 border border-primary/30 bg-primary/10 px-3 py-2 text-sm">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">
                      {feedbackSource === "ai"
                        ? feedbackProvider === "ollama"
                          ? "Local AI wording feedback"
                          : "AI wording feedback"
                        : "Authored feedback"}
                    </p>
                    <p className="mt-1">{feedback}</p>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <button type="button" disabled={callState !== "active"} onClick={isListening ? () => recognitionRef.current?.stop() : startListening} aria-label={isListening ? "Stop listening" : "Speak your reply"} className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40", isListening ? "border-red-500 bg-red-500 text-white" : "border-border bg-card hover:border-primary/50")}>
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <label htmlFor="learner-reply" className="sr-only">Your Mandarin reply</label>
                    <input id="learner-reply" value={learnerText} onChange={(event) => setLearnerText(event.target.value)} disabled={callState !== "active"} autoComplete="off" placeholder={isListening ? "Listening in Mandarin…" : "Hanzi or pinyin…"} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60" />
                  </div>
                  <button type="submit" disabled={!learnerText.trim() || callState !== "active"} aria-label="Send reply" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"><Send className="h-4 w-4" /></button>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">{recognitionSupported ? <Mic className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}{recognitionSupported ? "Speak, or type Hanzi or pinyin. Review recognized text before sending." : "Type Hanzi or pinyin; voice recognition is unavailable here."}</p>
              </form>
            )}
          </section>

          <aside className="border-t border-border bg-secondary/20 p-5 lg:border-t-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground">Your mission</p>
            <p className="mt-2 text-sm font-medium">{scenario.goal}</p>
            {currentStep && callState !== "complete" && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-primary">Step {stepIndex + 1} of {scenario.steps.length}</p>
                {(supportLevel === "guided" || hintLevel >= 0) && <p className="mt-2 text-sm">{currentStep.goal}</p>}
                {supportLevel === "guided" && hintLevel < 0 && (
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Useful model</p>
                    <p className="mt-1 font-[family-name:var(--font-hanzi)] text-lg">{currentStep.target.hanzi}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{currentStep.target.pinyin}</p>
                    {ttsSupported && (
                      <button type="button" onClick={() => speak(currentStep.target.hanzi, { rate: 0.72 })} className="mt-3 inline-flex min-h-11 items-center gap-2 border border-border bg-background px-3 py-2 text-xs font-bold hover:border-primary">
                        <Volume2 className="h-4 w-4" /> Hear model
                      </button>
                    )}
                  </div>
                )}
                {hintLevel >= 0 && (
                  <div className="mt-4 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-sm">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span>{currentStep.hints[hintLevel]}</span>
                  </div>
                )}
                {supportLevel !== "challenge" && (
                  <button type="button" onClick={() => setHintLevel((level) => Math.min(level + 1, 2))} className="mt-3 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Need a hint?</button>
                )}
              </div>
            )}
            <div className="mt-5 space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">{ttsSupported ? <Volume2 className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 opacity-40" />}{ttsSupported ? "Mandarin voice on" : "Text and pinyin fallback"}</p>
              <p className="flex items-center gap-2">
                {aiAvailable && !aiFallback ? <Sparkles className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                {aiAvailable && !aiFallback
                  ? aiProvider === "ollama"
                    ? "Private local AI ready"
                    : "Cloud AI feedback ready"
                  : "Authored feedback active"}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
