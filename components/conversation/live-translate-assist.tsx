"use client";

import { Languages, LoaderCircle, Mic, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TranslateState = "idle" | "connecting" | "listening" | "error";

interface LiveTranslateAssistProps {
  available: boolean;
  disabled?: boolean;
  onMandarinTranscript: (text: string) => void;
}

function pcm16Base64(input: Float32Array, inputRate: number): string {
  const ratio = inputRate / 16_000;
  const outputLength = Math.max(1, Math.floor(input.length / ratio));
  const bytes = new Uint8Array(outputLength * 2);
  const view = new DataView(bytes.buffer);
  for (let index = 0; index < outputLength; index += 1) {
    const start = Math.floor(index * ratio);
    const end = Math.min(input.length, Math.floor((index + 1) * ratio));
    let sum = 0;
    for (let source = start; source < end; source += 1) sum += input[source];
    const sample = Math.max(-1, Math.min(1, sum / Math.max(1, end - start)));
    view.setInt16(index * 2, sample < 0 ? sample * 32768 : sample * 32767, true);
  }
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary);
}

function decodePcm16(chunks: readonly string[]): Float32Array {
  const decoded = chunks.map((chunk) => {
    const binary = window.atob(chunk);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1)
      bytes[index] = binary.charCodeAt(index);
    return bytes;
  });
  const byteLength = decoded.reduce((sum, bytes) => sum + bytes.length, 0);
  const merged = new Uint8Array(byteLength);
  let offset = 0;
  for (const bytes of decoded) {
    merged.set(bytes, offset);
    offset += bytes.length;
  }
  const view = new DataView(merged.buffer);
  const samples = new Float32Array(Math.floor(merged.length / 2));
  for (let index = 0; index < samples.length; index += 1)
    samples[index] = view.getInt16(index * 2, true) / 32768;
  return samples;
}

export function LiveTranslateAssist({
  available,
  disabled = false,
  onMandarinTranscript,
}: LiveTranslateAssistProps) {
  const [state, setState] = useState<TranslateState>("idle");
  const [mandarin, setMandarin] = useState("");
  const [english, setEnglish] = useState("");
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const translatedAudioRef = useRef<string[]>([]);
  const manualStopRef = useRef(false);

  function stop() {
    manualStopRef.current = true;
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    void contextRef.current?.close();
    socketRef.current?.close(1000, "Learner stopped translation");
    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    contextRef.current = null;
    socketRef.current = null;
    setState("idle");
  }

  useEffect(() => stop, []);

  async function startCapture(socket: WebSocket) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(4096, 1, 1);
    processor.onaudioprocess = (audioEvent) => {
      if (socket.readyState !== WebSocket.OPEN) return;
      const data = pcm16Base64(
        audioEvent.inputBuffer.getChannelData(0),
        context.sampleRate,
      );
      socket.send(
        JSON.stringify({
          realtimeInput: {
            audio: { data, mimeType: "audio/pcm;rate=16000" },
          },
        }),
      );
    };
    source.connect(processor);
    processor.connect(context.destination);
    streamRef.current = stream;
    contextRef.current = context;
    sourceRef.current = source;
    processorRef.current = processor;
    setState("listening");
  }

  async function start() {
    if (!available || disabled || state !== "idle") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Live microphone translation is unavailable in this browser.");
      setState("error");
      return;
    }
    setError(null);
    setMandarin("");
    setEnglish("");
    translatedAudioRef.current = [];
    manualStopRef.current = false;
    setState("connecting");
    try {
      const tokenResponse = await fetch("/api/conversation/live-token", {
        method: "POST",
      });
      if (!tokenResponse.ok) throw new Error("token");
      const tokenData = (await tokenResponse.json()) as {
        token?: string;
        model?: string;
      };
      if (!tokenData.token || !tokenData.model) throw new Error("token");
      const socket = new WebSocket(
        `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(tokenData.token)}`,
      );
      socketRef.current = socket;
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            setup: {
              model: `models/${tokenData.model}`,
              generationConfig: {
                responseModalities: ["AUDIO"],
                translationConfig: {
                  targetLanguageCode: "en",
                  echoTargetLanguage: false,
                },
              },
              inputAudioTranscription: {},
              outputAudioTranscription: {},
            },
          }),
        );
      };
      socket.onmessage = (message) => {
        let payload: {
          setupComplete?: unknown;
          serverContent?: {
            inputTranscription?: { text?: string };
            outputTranscription?: { text?: string };
            modelTurn?: { parts?: Array<{ inlineData?: { data?: string } }> };
          };
        };
        try {
          payload = JSON.parse(String(message.data));
        } catch {
          return;
        }
        if (payload.setupComplete) {
          void startCapture(socket).catch(() => {
            setError("Microphone access was blocked. Typed Mandarin still works.");
            setState("error");
            socket.close();
          });
        }
        const input = payload.serverContent?.inputTranscription?.text?.trim();
        if (input) {
          setMandarin(input);
          onMandarinTranscript(input);
        }
        const output = payload.serverContent?.outputTranscription?.text?.trim();
        if (output) setEnglish(output);
        for (const part of payload.serverContent?.modelTurn?.parts ?? []) {
          const audio = part.inlineData?.data;
          if (audio) translatedAudioRef.current.push(audio);
        }
      };
      socket.onerror = () => {
        if (manualStopRef.current) return;
        setError("Live translation disconnected. Your typed reply still works.");
        setState("error");
      };
      socket.onclose = () => {
        if (!manualStopRef.current) setState("idle");
      };
    } catch {
      setError("Live translation could not start. Your API key stays on the server.");
      setState("error");
    }
  }

  async function playTranslation() {
    if (translatedAudioRef.current.length === 0) return;
    const samples = decodePcm16(translatedAudioRef.current);
    const context = new AudioContext();
    const buffer = context.createBuffer(1, samples.length, 24_000);
    buffer.getChannelData(0).set(samples);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.addEventListener("ended", () => void context.close(), { once: true });
    source.start();
  }

  if (!available) return null;

  return (
    <div className="mt-3 border border-foreground bg-[oklch(var(--poster-yellow)/0.28)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold">
            <Languages className="h-3.5 w-3.5" /> Gemini translation ear
          </p>
          <p className="mt-1 text-[0.68rem] text-muted-foreground">
            Speak Mandarin; it fills your reply and checks the English meaning.
          </p>
        </div>
        {state === "listening" ? (
          <button
            type="button"
            onClick={stop}
            className="inline-flex min-h-10 items-center gap-2 border border-foreground bg-foreground px-3 py-2 text-xs font-bold text-background"
          >
            <Square className="h-3.5 w-3.5" /> Stop
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled || state === "connecting"}
            onClick={state === "error" ? () => setState("idle") : start}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 border border-foreground bg-card px-3 py-2 text-xs font-bold disabled:opacity-50",
              state === "error" && "border-red-600 text-red-700",
            )}
          >
            {state === "connecting" ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Mic className="h-3.5 w-3.5" />
            )}
            {state === "error" ? "Reset" : state === "connecting" ? "Connecting" : "Translate mic"}
          </button>
        )}
      </div>
      {mandarin && <p className="mt-3 font-[family-name:var(--font-hanzi)] text-lg">{mandarin}</p>}
      {english && (
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{english}</span>
          {translatedAudioRef.current.length > 0 && (
            <button
              type="button"
              onClick={playTranslation}
              className="inline-flex min-h-9 shrink-0 items-center gap-1.5 border border-border bg-card px-2 py-1 font-bold text-foreground"
            >
              <Volume2 className="h-3.5 w-3.5" /> Hear
            </button>
          )}
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
