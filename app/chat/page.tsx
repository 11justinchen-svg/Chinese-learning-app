import { SplineScene } from "@/components/ui/splite";
import { Chat } from "@/components/chat";
import { findLesson } from "@/lib/lessons";

export default function ChatPage({
  searchParams,
}: {
  searchParams: { scenario?: string };
}) {
  const lesson = searchParams?.scenario
    ? findLesson(searchParams.scenario)
    : undefined;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* The robot tutor, present during the conversation */}
        <div className="relative hidden h-[calc(100vh-9rem)] overflow-hidden rounded-lg border border-border/60 bg-black/[0.96] lg:block">
          <div className="absolute left-0 top-0 z-10 p-6">
            <h1 className="text-2xl font-bold">
              {lesson ? `${lesson.emoji} ${lesson.title}` : "Talk with Xiao Hui 小慧"}
            </h1>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {lesson
                ? `Roleplay lesson: ${lesson.phrase}. Xiao Hui stays in character, answers in Mandarin with pinyin and a gloss, and corrects you as you go.`
                : "Say anything in Chinese, pinyin, or English. Xiao Hui answers in Mandarin with pinyin and a gloss, and corrects you as you go."}
            </p>
          </div>
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </div>

        <Chat
          key={lesson?.id ?? "free-talk"}
          scenario={
            lesson
              ? { id: lesson.id, title: lesson.title, opener: lesson.opener }
              : undefined
          }
        />
      </div>
    </main>
  );
}
