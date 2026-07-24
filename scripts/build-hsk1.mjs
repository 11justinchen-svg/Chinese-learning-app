// Build a static, API-free HSK vocabulary dataset.
//
//   source word list : scripts/sources/hsk{level}-words.json
//                      (drkameleon/complete-hsk-vocabulary, exclusive old level)
//   decomposition    : the `hanzi` package (bundled CC-CEDICT + CJK decomposition, offline)
//   component glosses : curated COMPONENT map below, CC-CEDICT fallback otherwise
//
// Output: lib/data/hsk{level}.json, consumed directly by the app.
//
// Run with:  node scripts/build-hsk1.mjs 1
//            node scripts/build-hsk1.mjs 2
//            node scripts/build-hsk1.mjs 3.0

import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const hanzi = require("hanzi");
hanzi.start();

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const requested = process.argv[2] || "1";
const buildingHsk3 = requested === "3.0";
const level = buildingHsk3 ? null : Number(requested);
if (!buildingHsk3 && level !== 1 && level !== 2)
  throw new Error("Expected HSK level 1, 2, or 3.0");
const words = JSON.parse(
  readFileSync(
    join(
      root,
      buildingHsk3
        ? "scripts/sources/hsk3-2025-words.json"
        : `scripts/sources/hsk${level}-words.json`,
    ),
    "utf8",
  ),
);
const legacyWords = buildingHsk3
  ? [
      ...JSON.parse(readFileSync(join(root, "lib/data/hsk1.json"), "utf8")),
      ...JSON.parse(readFileSync(join(root, "lib/data/hsk2.json"), "utf8")),
    ]
  : [];
const claimedLegacyIds = new Set();

// Curated meanings for components — especially the bound "radical" forms that are
// not standalone characters (亻讠氵饣 …) and the high-frequency semantic radicals.
// role: "semantic" = contributes meaning; "form" = a written variant of another
// component; left undefined when the part is mainly structural/phonetic.
const COMPONENT = {
  // bound radical forms
  "亻": { meaning: "person", role: "semantic", variantOf: "人" },
  "讠": { meaning: "speech, words", role: "semantic", variantOf: "言" },
  "氵": { meaning: "water", role: "semantic", variantOf: "水" },
  "饣": { meaning: "food, eating", role: "semantic", variantOf: "食" },
  "扌": { meaning: "hand", role: "semantic", variantOf: "手" },
  "犭": { meaning: "animal, beast", role: "semantic", variantOf: "犬" },
  "钅": { meaning: "metal", role: "semantic", variantOf: "金" },
  "礻": { meaning: "spirit, ritual", role: "semantic", variantOf: "示" },
  "衤": { meaning: "clothing", role: "semantic", variantOf: "衣" },
  "纟": { meaning: "silk, thread", role: "semantic", variantOf: "糸" },
  "艹": { meaning: "grass, plant", role: "semantic", variantOf: "艸" },
  "宀": { meaning: "roof, house", role: "semantic" },
  "阝": { meaning: "place / mound", role: "semantic" },
  "辶": { meaning: "walking, movement", role: "semantic", variantOf: "辵" },
  "灬": { meaning: "fire", role: "semantic", variantOf: "火" },
  "刂": { meaning: "knife", role: "semantic", variantOf: "刀" },
  "冫": { meaning: "ice", role: "semantic" },
  "冖": { meaning: "cover", role: "semantic" },
  "宀": { meaning: "roof, house", role: "semantic" },
  "彳": { meaning: "step, to walk", role: "semantic" },
  "廾": { meaning: "two hands", role: "semantic" },
  "爫": { meaning: "claw, hand from above", role: "semantic", variantOf: "爪" },
  "⺮": { meaning: "bamboo", role: "semantic", variantOf: "竹" },
  "忄": { meaning: "heart, mind", role: "semantic", variantOf: "心" },
  "⻊": { meaning: "foot, movement", role: "semantic", variantOf: "足" },
  "覀": { meaning: "west / cover", role: "form", variantOf: "西" },
  "彐": { meaning: "snout / hand shape", role: "form" },
  "⺈": { meaning: "knife / bent stroke", role: "form", variantOf: "刀" },
  "仌": { meaning: "two people / ice shape", role: "form" },
  "龰": { meaning: "foot", role: "form", variantOf: "足" },
  "𣥂": { meaning: "foot", role: "form", variantOf: "足" },
  "𨈑": { meaning: "body", role: "form", variantOf: "身" },
  "𢎨": { meaning: "structural strokes", role: "form" },
  "龸": { meaning: "top strokes", role: "form" },
  "龷": { meaning: "joined strokes", role: "form" },
  "𠀐": { meaning: "structural strokes", role: "form" },
  "𠃓": { meaning: "hooked stroke", role: "form" },
  "⺙": { meaning: "wrapping stroke", role: "form" },
  "⺊": { meaning: "to divine", role: "semantic", variantOf: "卜" },
  "⺀": { meaning: "ice / split", role: "form" },
  "⺍": { meaning: "small", role: "form", variantOf: "小" },
  "⺧": { meaning: "ox", role: "semantic", variantOf: "牛" },
  "𠂇": { meaning: "left hand", role: "semantic" },
  "𠂉": { meaning: "stroke component", role: "form" },
  "龶": { meaning: "stroke component", role: "form" },
  "龵": { meaning: "hand", role: "form", variantOf: "手" },
  "龴": { meaning: "stroke component", role: "form" },
  // common standalone semantic components
  "人": { meaning: "person", role: "semantic" },
  "口": { meaning: "mouth", role: "semantic" },
  "女": { meaning: "woman", role: "semantic" },
  "子": { meaning: "child", role: "semantic" },
  "日": { meaning: "sun, day", role: "semantic" },
  "月": { meaning: "moon / flesh", role: "semantic" },
  "木": { meaning: "tree, wood", role: "semantic" },
  "水": { meaning: "water", role: "semantic" },
  "火": { meaning: "fire", role: "semantic" },
  "山": { meaning: "mountain", role: "semantic" },
  "土": { meaning: "earth, soil", role: "semantic" },
  "心": { meaning: "heart, mind", role: "semantic" },
  "手": { meaning: "hand", role: "semantic" },
  "目": { meaning: "eye", role: "semantic" },
  "田": { meaning: "field", role: "semantic" },
  "马": { meaning: "horse", role: "semantic" },
  "门": { meaning: "door, gate", role: "semantic" },
  "大": { meaning: "big", role: "semantic" },
  "小": { meaning: "small", role: "semantic" },
  "王": { meaning: "king / jade", role: "semantic" },
  "玉": { meaning: "jade", role: "semantic" },
  "雨": { meaning: "rain", role: "semantic" },
  "见": { meaning: "to see", role: "semantic" },
  "力": { meaning: "strength", role: "semantic" },
  "刀": { meaning: "knife", role: "semantic" },
  "米": { meaning: "rice", role: "semantic" },
  "衣": { meaning: "clothing", role: "semantic" },
  "羊": { meaning: "sheep", role: "semantic" },
  "矢": { meaning: "arrow", role: "semantic" },
  "戈": { meaning: "dagger-axe, spear", role: "semantic" },
  "斤": { meaning: "axe", role: "semantic" },
  "工": { meaning: "work", role: "semantic" },
  "文": { meaning: "script, writing", role: "semantic" },
  "立": { meaning: "to stand", role: "semantic" },
  "生": { meaning: "to grow, life", role: "semantic" },
  "走": { meaning: "to walk, run", role: "semantic" },
  "车": { meaning: "cart, vehicle", role: "semantic" },
  "白": { meaning: "white", role: "semantic" },
  "西": { meaning: "west", role: "semantic" },
  "面": { meaning: "face", role: "semantic" },
  "身": { meaning: "body", role: "semantic" },
  "高": { meaning: "tall, high", role: "semantic" },
  "气": { meaning: "air, breath", role: "semantic" },
  "父": { meaning: "father", role: "semantic" },
  "老": { meaning: "old", role: "semantic" },
  "耂": { meaning: "old", role: "form", variantOf: "老" },
  "里": { meaning: "inside / li (unit)", role: "semantic" },
  "又": { meaning: "again / right hand", role: "semantic" },
  "八": { meaning: "eight / divide", role: "semantic" },
  "十": { meaning: "ten", role: "semantic" },
  "二": { meaning: "two", role: "semantic" },
  "一": { meaning: "one / a line", role: "semantic" },
  "儿": { meaning: "legs, child", role: "semantic" },
  "夕": { meaning: "evening", role: "semantic" },
  "夂": { meaning: "to follow, go", role: "semantic" },
  "卜": { meaning: "to divine", role: "semantic" },
  "寸": { meaning: "inch, a little", role: "semantic" },
  "几": { meaning: "small table / how many", role: "semantic" },
  "巾": { meaning: "cloth", role: "semantic" },
  "尸": { meaning: "body, corpse", role: "semantic" },
  "干": { meaning: "dry / to do", role: "semantic" },
  "士": { meaning: "scholar", role: "semantic" },
  "匕": { meaning: "spoon, ladle", role: "semantic" },
  "厶": { meaning: "private, self", role: "semantic" },
  "卩": { meaning: "seal", role: "semantic" },
  "殳": { meaning: "weapon, to strike", role: "semantic" },
  "欠": { meaning: "to lack, yawn", role: "semantic" },
  "止": { meaning: "to stop, foot", role: "semantic" },
  "禾": { meaning: "grain, crop", role: "semantic" },
  "舌": { meaning: "tongue", role: "semantic" },
  "隹": { meaning: "short-tailed bird", role: "semantic" },
  "豕": { meaning: "pig", role: "semantic" },
  "彡": { meaning: "hair, decoration", role: "semantic" },
  "广": { meaning: "shelter, building", role: "semantic" },
  "囗": { meaning: "enclosure", role: "semantic" },
  "冂": { meaning: "borders, open box", role: "semantic" },
  "凵": { meaning: "open container", role: "semantic" },
  "匚": { meaning: "box", role: "semantic" },
  "勹": { meaning: "to wrap", role: "semantic" },
  "亠": { meaning: "lid, top", role: "form" },
  "丶": { meaning: "dot", role: "form" },
  "丿": { meaning: "slash stroke", role: "form" },
  "乚": { meaning: "hidden, hook stroke", role: "form" },
  "亅": { meaning: "hook stroke", role: "form" },
  "丨": { meaning: "vertical stroke", role: "form" },
  "丷": { meaning: "split, eight", role: "form" },
  "不": { meaning: "not, no", role: "semantic" },
  "了": { meaning: "completion, finished", role: "part" },
  "与": { meaning: "and, with", role: "part" },
  // rare components left over from imperfect splits — labelled honestly
  "冋": { meaning: "borders, distant", role: "form" },
  "⺁": { meaning: "cliff", role: "semantic" },
  "𠮛": { meaning: "to say", role: "semantic" },
  "囬": { meaning: "to return", role: "form", variantOf: "回" },
  "帀": { meaning: "to encircle", role: "form" },
  "䏍": { meaning: "newborn (inverted child)", role: "form" },
  "䒑": { meaning: "top strokes", role: "form" },
  "𤴓": { meaning: "foot", role: "form", variantOf: "足" },
  "𧘇": { meaning: "clothing", role: "form", variantOf: "衣" },
  "𠬝": { meaning: "to handle, to submit", role: "form" },
};

// Convert numeric pinyin (ni3) to tone-marked (nǐ) for any leftover cases.
const toneMap = {
  a: "āáǎà", e: "ēéěè", i: "īíǐì", o: "ōóǒò", u: "ūúǔù", "ü": "ǖǘǚǜ", v: "ǖǘǚǜ",
};
function numericToMarks(syllable) {
  const m = syllable.match(/^([a-zü:]+)([1-5])$/i);
  if (!m) return syllable;
  let [, base, tone] = m;
  base = base.replace(/u:/g, "ü").replace(/v/g, "ü");
  tone = Number(tone);
  if (tone === 5) return base;
  // tone goes on a/e, else o in ou, else last vowel
  let idx = -1;
  if (base.includes("a")) idx = base.indexOf("a");
  else if (base.includes("e")) idx = base.indexOf("e");
  else if (base.includes("ou")) idx = base.indexOf("o");
  else idx = Math.max(...["a", "e", "i", "o", "u", "ü"].map((v) => base.lastIndexOf(v)));
  if (idx < 0) return base;
  const ch = base[idx];
  const marked = toneMap[ch] ? toneMap[ch][tone - 1] : ch;
  return base.slice(0, idx) + marked + base.slice(idx + 1);
}

function barePinyin(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replaceAll("ü", "v")
    .replace(/[^a-zv]/gi, "")
    .toLowerCase();
}

const JUNK = /^(surname|variant|old variant|CL:|abbr)/i;

function conciseGloss(def) {
  // CC-CEDICT defs are "/"-joined senses; take the first non-surname sense.
  const senses = def.split("/").map((s) => s.trim()).filter(Boolean);
  const good = senses.find((s) => !JUNK.test(s));
  return (good || senses[0] || "").replace(/\s*\(.*?\)\s*/g, " ").trim();
}

// Pick the most useful CEDICT entry: CC-CEDICT lists surnames / proper nouns
// (capitalised pinyin) and rare readings first, so down-rank those. The common
// reading carries the most senses, so more "/"-separated senses wins ties.
function bestDef(s) {
  const defs = hanzi.definitionLookup(s);
  if (!defs || !defs.length) return null;
  const score = (e) =>
    (/^[A-Z]/.test(e.pinyin) ? 8 : 0) +
    (JUNK.test(e.definition) ? 8 : 0) -
    e.definition.split("/").length;
  const best = [...defs].sort((a, b) => score(a) - score(b))[0];
  return { gloss: conciseGloss(best.definition), pinyin: best.pinyin };
}

// Final say for high-frequency words where the upstream list picked a rare
// reading or sense (没 "drowned", 那 "many", 年 "grain"). Hand-verified.
const WORD_OVERRIDE = {
  个: { pinyin: "gè", meaning: "(measure word); individual" },
  很: { pinyin: "hěn", meaning: "very" },
  了: { pinyin: "le", meaning: "(completed-action particle)" },
  吗: { pinyin: "ma", meaning: "(yes/no question particle)" },
  呢: { pinyin: "ne", meaning: "(question particle)" },
  没: { pinyin: "méi", meaning: "not; have not" },
  哪: { pinyin: "nǎ", meaning: "which" },
  那: { pinyin: "nà", meaning: "that" },
  年: { pinyin: "nián", meaning: "year" },
  热: { pinyin: "rè", meaning: "hot" },
  太: { pinyin: "tài", meaning: "too; excessively" },
  里: { pinyin: "lǐ", meaning: "inside; in" },
  回: { pinyin: "huí", meaning: "to return; to go back" },
  叫: { pinyin: "jiào", meaning: "to call; to be called" },
  钱: { pinyin: "qián", meaning: "money" },
  字: { pinyin: "zì", meaning: "character; word" },
  些: { pinyin: "xiē", meaning: "some; a few" },
  多少: { pinyin: "duō shǎo", meaning: "how many; how much" },
  同学: { pinyin: "tóng xué", meaning: "classmate" },
  先生: { pinyin: "xiān sheng", meaning: "Mr.; sir" },
  吧: { pinyin: "ba", meaning: "(suggestion particle); ...right?" },
  长: { pinyin: "cháng", meaning: "long" },
  得: { pinyin: "de / děi", meaning: "complement particle; must; have to" },
  还: { pinyin: "hái / huán", meaning: "still; also; to return" },
  过: { pinyin: "guo", meaning: "(past-experience particle); to pass" },
  着: { pinyin: "zhe", meaning: "(ongoing-state particle)" },
  第: { pinyin: "dì", meaning: "ordinal-number prefix" },
  爱好: {
    pinyin: "àihào",
    meaning: "hobby; interest; to be fond of an activity",
  },
};

// Short usage contrasts for words whose bare dictionary gloss can lead a
// beginner to the wrong everyday choice. These fields are rendered by both
// lesson teach cards and the Hanzi explorer.
const WORD_GUIDANCE = {
  爱好: {
    usageNote:
      "As a noun, 爱好 means a hobby or interest. As a verb, it means to be fond of an activity or field. For an everyday “like,” use 喜欢. 爱 is the stronger “love,” often used for people, but also for things or activities.",
    examples: [
      {
        label: "hobby",
        hanzi: "我的爱好是游泳。",
        pinyin: "Wǒ de àihào shì yóuyǒng.",
        english: "My hobby is swimming.",
      },
      {
        label: "fond of",
        hanzi: "他爱好音乐。",
        pinyin: "Tā àihào yīnyuè.",
        english: "He is fond of music.",
      },
      {
        label: "contrast with 爱",
        hanzi: "我爱妈妈。",
        pinyin: "Wǒ ài māma.",
        english: "I love Mom.",
      },
    ],
  },
};

function componentInfo(comp) {
  if (COMPONENT[comp]) return { char: comp, ...COMPONENT[comp] };
  // CJK stroke characters (U+31C0–U+31EF): structural, not semantic.
  if (/[㇀-㇯]/.test(comp)) return { char: comp, meaning: "stroke", role: "form" };
  // Fall back to CEDICT for components that are themselves characters.
  const best = bestDef(comp);
  if (best && best.gloss) return { char: comp, meaning: best.gloss, role: "part" };
  return { char: comp, meaning: "(component)", role: "part" };
}

function charPinyin(ch) {
  const best = bestDef(ch);
  if (best && best.pinyin) return best.pinyin.split(" ").map(numericToMarks).join(" ");
  return "";
}

function breakdown(ch) {
  const d = hanzi.decompose(ch, 1);
  let parts = (d && d.components ? d.components : [])
    .filter((x) => x && x !== "No glyph available" && x !== ch);
  const infos = parts.map(componentInfo);
  // Atomic when there is no split, or when the split is only strokes/structure
  // (e.g. 生): show the character's own meaning instead of meaningless fragments.
  if (infos.length === 0 || infos.every((c) => c.role === "form")) {
    return { atomic: true, components: [componentInfo(ch)] };
  }
  return { atomic: false, components: infos };
}

// Some upstream entries list a rare reading first (读 dòu "comma", 都 "surname Du").
// Pick the form that is a common reading, non-junk, and matches CEDICT's main sense.
function pickForm(w) {
  const forms = w.forms || [];
  if (forms.length <= 1) return forms[0] || {};
  // Lower is better. The common reading (读 dú, 几 jǐ) carries the most CC-CEDICT
  // senses, so sense-count is the decisive tiebreak after dropping junk readings.
  const score = (f) => {
    let s = 0;
    if (/^[A-Z]/.test(f.transcriptions?.pinyin || "")) s += 8;
    if (JUNK.test(f.meanings?.[0] || "")) s += 8;
    s -= (f.meanings?.length || 0);
    return s;
  };
  return [...forms].sort((a, b) => score(a) - score(b))[0];
}

const out = words.map((w, i) => {
  const hanziStr = buildingHsk3 ? w.hanzi : w.simplified;
  const form = buildingHsk3 ? {} : pickForm(w);
  let pinyin = buildingHsk3 ? w.pinyin : form.transcriptions?.pinyin || "";
  let meanings = buildingHsk3
    ? []
    : (form.meanings || []).map((m) =>
        m.replace(/\s*\(.*?\)\s*/g, " ").trim(),
      );

  const legacy = buildingHsk3
    ? legacyWords.find(
        (candidate) =>
          candidate.hanzi === hanziStr &&
          !claimedLegacyIds.has(candidate.id) &&
          (barePinyin(candidate.pinyin).includes(barePinyin(pinyin)) ||
            barePinyin(pinyin).includes(barePinyin(candidate.pinyin))),
      ) ??
      legacyWords.find(
        (candidate) =>
          candidate.hanzi === hanziStr &&
          !claimedLegacyIds.has(candidate.id),
      )
    : null;
  if (legacy) {
    claimedLegacyIds.add(legacy.id);
    meanings = legacy.meanings;
  }
  // If the best sense is still junk (水 "surname Shui", 和 "old variant"), pull the
  // common gloss AND its reading from CEDICT, but keep real proper nouns.
  if (!meanings.length || JUNK.test(meanings[0])) {
    const best = bestDef(hanziStr);
    if (best && best.gloss && !JUNK.test(best.gloss)) {
      meanings = [best.gloss, ...meanings];
      if (!buildingHsk3 && best.pinyin)
        pinyin = best.pinyin.split(" ").map(numericToMarks).join(" ");
    }
  }
  // Hand-verified final say for tricky high-frequency words.
  if (WORD_OVERRIDE[hanziStr]) {
    pinyin = WORD_OVERRIDE[hanziStr].pinyin;
    meanings = [WORD_OVERRIDE[hanziStr].meaning];
  }
  const legacyCharactersComplete = legacy?.characters?.every((character) =>
    character.components.every(
      (component) => component.meaning && component.meaning !== "(component)",
    ),
  );
  const characters =
    (legacyCharactersComplete ? legacy.characters : null) ??
    [...hanziStr]
      .filter((c) => /[一-鿿]/.test(c))
      .map((c) => ({ char: c, pinyin: charPinyin(c), ...breakdown(c) }));
  return {
    id:
      legacy?.id ??
      (buildingHsk3
        ? `hsk3-2025-${String(w.index).padStart(3, "0")}`
        : `hsk${level}-${String(i + 1).padStart(3, "0")}`),
    hanzi: hanziStr,
    pinyin,
    meaning: meanings[0] || "",
    meanings,
    ...(WORD_GUIDANCE[hanziStr] ?? {}),
    pos: buildingHsk3
      ? w.pos
          .replace(/[（）]/g, "")
          .split("、")
          .filter(Boolean)
      : w.pos || [],
    frequency: legacy?.frequency ?? w.frequency ?? null,
    characters,
    ...(buildingHsk3
      ? {
          syllabus: "HSK 3.0 (2025)",
          syllabusIndex: w.index,
          syllabusLevel: w.level,
        }
      : {}),
  };
});

const destinations = buildingHsk3
  ? [
      [join(root, "lib/data/hsk1.json"), out.filter((word) => word.syllabusLevel === 1)],
      [join(root, "lib/data/hsk2.json"), out.filter((word) => word.syllabusLevel === 2)],
    ]
  : [[join(root, `lib/data/hsk${level}.json`), out]];
for (const [dest, rows] of destinations)
  writeFileSync(dest, JSON.stringify(rows, null, 2) + "\n", "utf8");

// Coverage report so component-gloss gaps are visible, not silent.
const fallbacks = new Map();
for (const w of out)
  for (const c of w.characters)
    for (const comp of c.components)
      if (comp.role === "part" && comp.meaning === "(component)")
        fallbacks.set(comp.char, (fallbacks.get(comp.char) || 0) + 1);

console.log(
  buildingHsk3
    ? `Wrote ${out.length} official HSK 3.0 words -> ${destinations
        .map(([dest, rows]) => `${dest} (${rows.length})`)
        .join(", ")}`
    : `Wrote ${out.length} words -> ${destinations[0][0]}`,
);
if (buildingHsk3)
  console.log(
    `Preserved ${claimedLegacyIds.size} legacy word IDs; created ${
      out.length - claimedLegacyIds.size
    } deterministic HSK 3.0 IDs.`,
  );
console.log(`Distinct components glossed from curated map: ${Object.keys(COMPONENT).length}`);
if (fallbacks.size) {
  console.log(`\nComponents with no meaning (add to COMPONENT map): ${fallbacks.size}`);
  console.log([...fallbacks.entries()].map(([c, n]) => `${c}(${n})`).join(" "));
} else {
  console.log("Every component has a meaning. ✅");
}
