// Stage content validator — run with `npm run validate` (tsx).
//
// Enforces the content contract that keeps parallel-authored stages coherent:
// frozen word allocation, exercise well-formedness, reachable "learned"
// status, and strict vocabulary gating (a stage may only use words from
// itself or earlier stages). Exits non-zero on any error.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const { HSK1_STAGES: STAGES } = await import(path.join(root, "lib/data/stages/index.ts"));
const { GRAMMAR_LESSONS } = await import(path.join(root, "lib/data/grammar.ts"));
const words = JSON.parse(readFileSync(path.join(root, "lib/data/hsk1.json"), "utf8"));

// ---- Frozen allocation (independent copy — do NOT sync from allocation.ts;
// ---- this is what stops a worker from "fixing" gating by moving words).
const FROZEN = {
  1: ["hsk1-073", "hsk1-036", "hsk1-112", "hsk1-113", "hsk1-096", "hsk1-061", "hsk1-007", "hsk1-046", "hsk1-093", "hsk1-067", "hsk1-105", "hsk1-106", "hsk1-054", "hsk1-128", "hsk1-126", "hsk1-138"],
  2: ["hsk1-003", "hsk1-060", "hsk1-026", "hsk1-075", "hsk1-076", "hsk1-085", "hsk1-045", "hsk1-015", "hsk1-136", "hsk1-064", "hsk1-098", "hsk1-142", "hsk1-070", "hsk1-032", "hsk1-034", "hsk1-063"],
  3: ["hsk1-131", "hsk1-027", "hsk1-088", "hsk1-103", "hsk1-114", "hsk1-059", "hsk1-079", "hsk1-002", "hsk1-048", "hsk1-094", "hsk1-058", "hsk1-044", "hsk1-025", "hsk1-104", "hsk1-016", "hsk1-030"],
  4: ["hsk1-047", "hsk1-068", "hsk1-148", "hsk1-120", "hsk1-095", "hsk1-091", "hsk1-144", "hsk1-117", "hsk1-127", "hsk1-074", "hsk1-137", "hsk1-087", "hsk1-090", "hsk1-116"],
  5: ["hsk1-011", "hsk1-037", "hsk1-009", "hsk1-010", "hsk1-066", "hsk1-099", "hsk1-100", "hsk1-078", "hsk1-004", "hsk1-028", "hsk1-121", "hsk1-115", "hsk1-001", "hsk1-082", "hsk1-038"],
  6: ["hsk1-062", "hsk1-081", "hsk1-052", "hsk1-089", "hsk1-020", "hsk1-132", "hsk1-024", "hsk1-092", "hsk1-107", "hsk1-055", "hsk1-014", "hsk1-122", "hsk1-077", "hsk1-124", "hsk1-141"],
  7: ["hsk1-139", "hsk1-057", "hsk1-080", "hsk1-040", "hsk1-069", "hsk1-083", "hsk1-053", "hsk1-041", "hsk1-149", "hsk1-145", "hsk1-033", "hsk1-140", "hsk1-043", "hsk1-012", "hsk1-029", "hsk1-130"],
  8: ["hsk1-129", "hsk1-110", "hsk1-097", "hsk1-006", "hsk1-022", "hsk1-125", "hsk1-147", "hsk1-035", "hsk1-042", "hsk1-072", "hsk1-102", "hsk1-109", "hsk1-017", "hsk1-146", "hsk1-135", "hsk1-021"],
  9: ["hsk1-108", "hsk1-118", "hsk1-056", "hsk1-084", "hsk1-039", "hsk1-031", "hsk1-071", "hsk1-086", "hsk1-119", "hsk1-123", "hsk1-005", "hsk1-143", "hsk1-023", "hsk1-065", "hsk1-008"],
  10: ["hsk1-013", "hsk1-111", "hsk1-018", "hsk1-019", "hsk1-050", "hsk1-051", "hsk1-049", "hsk1-101", "hsk1-150", "hsk1-133", "hsk1-134"],
};
const FROZEN_GRAMMAR = {
  1: ["shi-sentences", "ma-questions"],
  2: ["de-possession", "bu-vs-mei"],
  3: ["measure-words"],
  4: [],
  5: ["time-word-order", "xiang-want"],
  6: ["tai-le"],
  7: ["zai-location"],
  8: ["ye-dou"],
  9: ["hen-adjective"],
  10: ["le-completed"],
};

const byId = new Map(words.map((w) => [w.id, w]));
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// ---- 1+2: stage identity and frozen allocation
if (STAGES.length !== 10) err(`expected 10 stages, got ${STAGES.length}`);
const seenWordIds = new Set();
for (const s of STAGES) {
  const nn = String(s.index).padStart(2, "0");
  if (s.id !== `hsk1-stage-${nn}`) err(`${s.id}: id should be hsk1-stage-${nn}`);
  const frozen = FROZEN[s.index] ?? [];
  if (JSON.stringify(s.wordIds) !== JSON.stringify(frozen))
    err(`${s.id}: wordIds differ from the frozen allocation`);
  if (JSON.stringify(s.grammarLessonIds) !== JSON.stringify(FROZEN_GRAMMAR[s.index] ?? []))
    err(`${s.id}: grammarLessonIds differ from the frozen map`);
  for (const id of s.wordIds) {
    if (!byId.has(id)) err(`${s.id}: unknown word id ${id}`);
    if (seenWordIds.has(id)) err(`${s.id}: word ${id} allocated twice`);
    seenWordIds.add(id);
  }
}
if (seenWordIds.size !== words.length)
  err(`allocation covers ${seenWordIds.size}/${words.length} words`);

// ---- Vocabulary gating helpers
const PUNCT = /[。，？！、：；.,?! 　"'“”‘’…～~]/;
const EXTRAS = new Set(["们", "儿"]);
const NAMES = ["王明", "李华"];
const hasCJK = (s) => /[一-鿿]/.test(s);

function segments(text, vocab) {
  const sorted = [...new Set([...vocab, ...NAMES])].sort((a, b) => b.length - a.length);
  let i = 0;
  const misses = new Set();
  while (i < text.length) {
    const ch = text[i];
    if (PUNCT.test(ch) || /[a-zA-Z0-9＿]/.test(ch) || !hasCJK(ch)) {
      i++;
      continue;
    }
    const hit = sorted.find((v) => text.startsWith(v, i));
    if (hit) i += hit.length;
    else if (EXTRAS.has(ch)) i++;
    else {
      misses.add(ch);
      i++;
    }
  }
  return misses;
}

const allowedByStage = new Map();
{
  let acc = [];
  for (let i = 1; i <= 10; i++) {
    acc = [...acc, ...(FROZEN[i] ?? []).map((id) => byId.get(id)?.hanzi).filter(Boolean)];
    allowedByStage.set(i, acc);
  }
}

// Learner-facing Chinese that must be gated, per exercise kind.
function gatedStrings(ex) {
  switch (ex.kind) {
    case "choice":
      return ex.direction === "hanzi-en" ? [ex.question] : [...ex.choices, ex.answer];
    case "cloze":
      return [ex.sentence, ...ex.choices, ex.answer];
    case "order":
      return ex.tiles;
    case "match":
      return ex.pairs.flatMap((p) => [p.hanzi, ...(hasCJK(p.match) ? [p.match] : [])]);
    case "reply":
      return [ex.line.hanzi, ...ex.choices.map((c) => c.hanzi)];
    case "listen":
      return [ex.text, ...ex.choices];
    default:
      return [];
  }
}

function checkGating(stage, where, text) {
  if (!hasCJK(text)) return;
  const misses = segments(text, allowedByStage.get(stage.index));
  if (misses.size > 0) {
    const chars = [...misses].join(" ");
    const firstOk = [...misses].map((ch) => {
      for (let i = 1; i <= 10; i++)
        if (allowedByStage.get(i).some((v) => v.includes(ch))) return `${ch}→stage ${i}`;
      return `${ch}→not HSK-1`;
    });
    err(`${stage.id} ${where}: "${text}" uses out-of-stage characters: ${chars} (${firstOk.join(", ")})`);
  }
}

// ---- 3+4+5: exercises
const exIds = new Set();
for (const s of STAGES) {
  const stageWordSet = new Set(s.wordIds);
  const priorWords = new Set(allowedByStage.get(s.index));
  const credits = new Map(); // wordId -> Set(kind) and count
  const credit = (ex) => {
    for (const id of ex.wordIds) {
      if (!byId.has(id)) err(`${s.id} ${ex.id}: credits unknown word ${id}`);
      else if (!priorWords.has(byId.get(id).hanzi))
        err(`${s.id} ${ex.id}: credits word ${id} from a later stage`);
      if (!stageWordSet.has(id)) continue;
      const c = credits.get(id) ?? { n: 0, kinds: new Set() };
      c.n += 1;
      c.kinds.add(ex.kind);
      credits.set(id, c);
    }
  };

  const allExercises = [
    ...s.blocks.flatMap((b) => b.exercises.map((e) => ({ e, where: `block ${b.id}` }))),
    ...s.checkpoint.map((e) => ({ e, where: "checkpoint" })),
  ];

  for (const b of s.blocks) {
    if (b.exercises.length < 4 || b.exercises.length > 10)
      err(`${s.id} block ${b.id}: ${b.exercises.length} exercises (must be 4–10)`);
    if (b.kind === "grammar" && !b.grammarLessonId)
      err(`${s.id} block ${b.id}: grammar block without grammarLessonId`);
    if (b.grammarLessonId && !s.grammarLessonIds.includes(b.grammarLessonId))
      err(`${s.id} block ${b.id}: grammarLessonId ${b.grammarLessonId} not in stage's lessons`);
  }
  if (s.checkpoint.length < 8 || s.checkpoint.length > 12)
    err(`${s.id}: checkpoint has ${s.checkpoint.length} exercises (must be 8–12)`);

  for (const { e: ex, where } of allExercises) {
    if (exIds.has(ex.id)) err(`duplicate exercise id ${ex.id}`);
    exIds.add(ex.id);
    credit(ex);

    switch (ex.kind) {
      case "choice":
      case "listen":
        if (!ex.choices.includes(ex.answer))
          err(`${s.id} ${ex.id}: answer not among choices`);
        if (new Set(ex.choices).size !== ex.choices.length)
          err(`${s.id} ${ex.id}: duplicate choices`);
        break;
      case "cloze": {
        const gaps = (ex.sentence.match(/＿/g) ?? []).length;
        if (gaps !== 1) err(`${s.id} ${ex.id}: cloze needs exactly one ＿ (has ${gaps})`);
        if (!ex.choices.includes(ex.answer))
          err(`${s.id} ${ex.id}: answer not among choices`);
        break;
      }
      case "order":
        if (ex.tiles.length < 2) err(`${s.id} ${ex.id}: order needs ≥2 tiles`);
        break;
      case "match": {
        if (ex.pairs.length < 3 || ex.pairs.length > 6)
          err(`${s.id} ${ex.id}: match needs 3–6 pairs`);
        const l = ex.pairs.map((p) => p.hanzi);
        const r = ex.pairs.map((p) => p.match);
        if (new Set(l).size !== l.length || new Set(r).size !== r.length)
          err(`${s.id} ${ex.id}: match sides must be unique`);
        break;
      }
      case "reply":
        if (!ex.choices.some((c) => c.hanzi === ex.answer))
          err(`${s.id} ${ex.id}: answer not among choices`);
        if ((ex.answers?.length ?? 1) < 2)
          err(`${s.id} ${ex.id}: reply needs at least two accepted natural forms`);
        for (const answer of ex.answers ?? [ex.answer])
          if (!ex.choices.some((choice) => choice.hanzi === answer))
            err(`${s.id} ${ex.id}: accepted reply is not among choices: ${answer}`);
        break;
      default:
        err(`${s.id} ${ex.id}: unknown kind ${ex.kind}`);
    }

    for (const text of gatedStrings(ex)) checkGating(s, `${where} ${ex.id}`, text);

    // Soft check: credited words should actually appear in the exercise.
    const allText = gatedStrings(ex).join("");
    for (const id of ex.wordIds) {
      const h = byId.get(id)?.hanzi;
      if (h && !allText.includes(h) && !(ex.explain ?? "").includes(h))
        warn(`${s.id} ${ex.id}: credits ${id} (${h}) but the text never shows it`);
    }
  }

  // Reachability: every stage word needs ≥3 credits across ≥2 kinds.
  for (const id of s.wordIds) {
    const c = credits.get(id);
    if (!c || c.n < 3 || c.kinds.size < 2)
      err(
        `${s.id}: word ${id} (${byId.get(id)?.hanzi}) credited ${c?.n ?? 0}× across ${c?.kinds.size ?? 0} kinds — needs ≥3 across ≥2 or "learned" is unreachable`,
      );
  }

  // Dialogue + teach gating
  s.dialogue.forEach((l, i) => checkGating(s, `dialogue[${i}]`, l.hanzi));
  s.teach.forEach((t) => {
    if (!stageWordSet.has(t.wordId))
      err(`${s.id} teach: ${t.wordId} is not a stage word`);
    if (t.example) checkGating(s, `teach ${t.wordId} example`, t.example.hanzi);
  });
}

// ---- 6: grammar lessons
const lessonIds = new Set(GRAMMAR_LESSONS.map((l) => l.id));
for (const [idx, ids] of Object.entries(FROZEN_GRAMMAR))
  for (const id of ids)
    if (!lessonIds.has(id)) err(`stage ${idx}: grammar lesson ${id} missing from GRAMMAR_LESSONS`);
for (const s of STAGES)
  for (const lessonId of s.grammarLessonIds) {
    const lesson = GRAMMAR_LESSONS.find((l) => l.id === lessonId);
    if (!lesson) continue;
    for (const ex of lesson.examples) {
      const misses = segments(ex.hanzi, allowedByStage.get(s.index));
      if (misses.size > 0)
        warn(`grammar ${lessonId} (stage ${s.index}) intro example "${ex.hanzi}" previews later words: ${[...misses].join(" ")}`);
    }
  }

// ---- report
for (const w of warnings) console.log(`⚠ ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(
  `✓ ${STAGES.length} stages, ${seenWordIds.size} words, ${exIds.size} exercises — all checks passed (${warnings.length} warning(s)).`,
);
