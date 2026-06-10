"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const DEFAULT_OPENER =
  "你好！我叫小慧。你叫什么名字？(Nǐ hǎo! Wǒ jiào Xiǎo Huì. Nǐ jiào shénme míngzi?)\nHello! My name is Xiao Hui. What is your name?";

const SUGGESTIONS = [
  "你好！我是初学者。(I am a beginner.)",
  "我们聊聊吃饭吧 (Let's talk about food)",
  "请帮我练习自我介绍 (Help me practice introducing myself)",
];

const SCENARIO_SUGGESTIONS = [
  "请说慢一点 (Please speak slower)",
  "听不懂，请再说一遍 (I don't understand, please say it again)",
  "这个用中文怎么说？(How do I say this in Chinese?)",
];

export interface ChatScenario {
  id: string;
  title: string;
  opener: string;
}

export function Chat({ scenario }: { scenario?: ChatScenario }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: scenario?.opener ?? DEFAULT_OPENER },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    setError(null);
    setInput("");
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, scenarioId: scenario?.id }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages([
          ...history,
          { role: "assistant", content: assistantText },
        ]);
      }
    } catch (e) {
      setMessages(history);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col rounded-lg border border-border/60 bg-card">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              m.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {m.content ||
                (loading && i === messages.length - 1 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null)}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="border-t border-border/60 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 border-t border-border/60 px-4 py-3">
          {(scenario ? SCENARIO_SUGGESTIONS : SUGGESTIONS).map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border/60 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type in Chinese, pinyin, or English..."
          className="flex-1 rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary/60"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label="Send"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
}
