/**
 * Bundle only the character data needed by the supported HSK 3.0 Levels 1–2.
 * Hanzi Writer then loads from our own `/hanzi-data` route with no CDN call.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const words = [
  ...JSON.parse(readFileSync(join(root, "lib/data/hsk1.json"), "utf8")),
  ...JSON.parse(readFileSync(join(root, "lib/data/hsk2.json"), "utf8")),
];
const characters = [
  ...new Set(
    words.flatMap((word) =>
      Array.from(word.hanzi).filter((character) => /\p{Script=Han}/u.test(character)),
    ),
  ),
].sort();
const source = join(root, "node_modules/hanzi-writer-data");
const destination = join(root, "public/hanzi-data");

rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });

const missing = [];
for (const character of characters) {
  const input = join(source, `${character}.json`);
  if (!existsSync(input)) {
    missing.push(character);
    continue;
  }
  copyFileSync(input, join(destination, `${character}.json`));
}

if (missing.length > 0)
  throw new Error(`Missing stroke data for: ${missing.join(" ")}`);
console.log(`Bundled stroke data for ${characters.length} HSK 3.0 characters.`);
