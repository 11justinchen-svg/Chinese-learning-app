import { HanziExplorer } from "@/components/hanzi-explorer";

export default function HanziPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold">Inside every character</h1>
        <p className="mt-2 text-muted-foreground">
          Most characters are built from smaller components: one part carries
          the meaning, another often carries the sound. Pick a character below
          or type any character and your tutor will break it apart for you.
        </p>
      </div>
      <HanziExplorer />
    </main>
  );
}
