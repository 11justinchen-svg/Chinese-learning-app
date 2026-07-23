/**
 * Import the official 2025 HSK 3.0 vocabulary table from a text extraction.
 *
 * The source PDF is published by Chinese Tests Service at:
 * https://www.chinesetest.cn/syllabus
 *
 * Usage:
 *   pdftotext -f 80 -l 92 -raw HSK3-syllabus.pdf /tmp/hsk3-vocab.txt
 *   node scripts/import-hsk3-syllabus.mjs /tmp/hsk3-vocab.txt
 *
 * The checked-in JSON is the canonical, reviewable input to the offline build.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error("Pass the raw pdftotext vocabulary extraction.");
}

const rows = [];
for (const rawLine of readFileSync(sourcePath, "utf8").split(/\r?\n/)) {
  const line = rawLine.trim();
  const match = line.match(
    /^(\d{1,3})\s+(1|2)(?:（[^）]+）)*\s+(\S+)\s+(\S+)(?:\s+(.+))?$/u,
  );
  if (!match) continue;

  const index = Number(match[1]);
  if (index > 500) continue;
  rows.push({
    index,
    level: Number(match[2]),
    // Superscript-like numbers distinguish dictionary senses in the PDF, not
    // the written form a learner should see.
    hanzi: match[3].replace(/[123]$/u, ""),
    pinyin: match[4].replaceAll("//", ""),
    pos: match[5] ?? "",
  });
}

const byIndex = new Map(rows.map((row) => [row.index, row]));
const missing = Array.from({ length: 500 }, (_, index) => index + 1).filter(
  (index) => !byIndex.has(index),
);

if (missing.length > 0) {
  throw new Error(`Missing official vocabulary rows: ${missing.join(", ")}`);
}

const ordered = [...byIndex.values()].sort((a, b) => a.index - b.index);
if (
  ordered.filter((row) => row.level === 1).length !== 300 ||
  ordered.filter((row) => row.level === 2).length !== 200
) {
  throw new Error("Expected 300 Level 1 rows and 200 additional Level 2 rows.");
}

const destination = join(root, "scripts/sources/hsk3-2025-words.json");
writeFileSync(destination, `${JSON.stringify(ordered, null, 2)}\n`, "utf8");
console.log(`Wrote ${ordered.length} official rows -> ${destination}`);
