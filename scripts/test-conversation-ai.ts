import assert from "node:assert/strict";
import {
  conversationAiProviderOrder,
  parseCoachPayload,
  parseOpenCoachPayload,
  runConversationAiProviders,
  toneMarkedPinyinForHanzi,
  type ConversationAiProvider,
} from "../lib/conversation-ai";

const target = {
  hanzi: "我想买这个。",
  pinyin: "Wǒ xiǎng mǎi zhège.",
  english: "I would like to buy this.",
};
const response = {
  hanzi: "好的。您要几个？",
  pinyin: "Hǎo de. Nín yào jǐ ge?",
  english: "Okay. How many would you like?",
};

assert.deepEqual(
  conversationAiProviderOrder({
    hasAnthropicKey: true,
    hasGeminiKey: true,
    ollamaAvailable: true,
  }),
  ["gemini", "ollama", "anthropic"],
  "Gemini Flash-Lite should be the default character and feedback provider",
);
assert.deepEqual(
  conversationAiProviderOrder({
    hasAnthropicKey: true,
    hasGeminiKey: true,
    ollamaAvailable: true,
    preferred: "anthropic",
  }),
  ["anthropic", "gemini", "ollama"],
  "An explicit cloud preference should still retain local fallback",
);

const open = parseOpenCoachPayload(
  JSON.stringify({
    accepted: true,
    feedback: {
      note: "Your meaning is clear. Use 请 for a polite request.",
      betterHanzi: "请给我一杯茶。",
      betterPinyin: "Qǐng gěi wǒ yì bēi chá.",
    },
    turn: {
      hanzi: "好的。您还要什么？",
      pinyin: "Hǎo de. Nín hái yào shénme?",
      english: "Okay. What else would you like?",
    },
  }),
);
assert.equal(open.accepted, true);
assert.equal(open.turn?.hanzi, "好的。您还要什么？");
assert.equal(
  open.turn?.pinyin,
  "hǎo de. nín hái yào shén me?",
  "Dynamic role lines should use deterministic tone-marked pinyin",
);
assert.equal(
  toneMarkedPinyinForHanzi("我们今天有一点忙。"),
  "wǒ men jīn tiān yǒu yì diǎn máng.",
);

const valid = parseCoachPayload(
  JSON.stringify({
    feedback: {
      note: "Your request is clear. Add 想 to make it sound less abrupt.",
      betterHanzi: target.hanzi,
      betterPinyin: target.pinyin,
    },
    turn: response,
  }),
  target,
  response,
  true,
);
assert.equal(valid.feedback.betterHanzi, target.hanzi);
assert.deepEqual(valid.turn, {
  ...response,
  pinyin: "hǎo de. nín yào jǐ gè?",
});

const preservedPath = parseCoachPayload(
  JSON.stringify({
    feedback: {
      note: "The intended purchase is understandable.",
      betterHanzi: target.hanzi,
      betterPinyin: target.pinyin,
    },
    turn: {
      hanzi: "好的。",
      pinyin: "Hǎo de.",
      english: "Okay.",
    },
  }),
  target,
  response,
  true,
);
assert.deepEqual(
  preservedPath.turn,
  response,
  "A generated line that loses the authored question must fall back to canon",
);

const acousticClaim = parseCoachPayload(
  JSON.stringify({
    feedback: {
      note: "Your pronunciation and tones sound correct.",
      betterHanzi: "未经验证",
      betterPinyin: "\\u4f60 \\u597d",
    },
    turn: null,
  }),
  target,
  response,
  false,
);
assert.equal(
  acousticClaim.feedback.note,
  "The recognized words do not yet complete this turn’s goal.",
);
assert.equal(acousticClaim.feedback.betterHanzi, target.hanzi);
assert.equal(acousticClaim.feedback.betterPinyin, target.pinyin);

assert.throws(
  () => parseCoachPayload('{"feedback":{"note":""}}', target, response, false),
  /malformed coaching feedback/,
);

async function testProviderFallback() {
  const attempts: ConversationAiProvider[] = [];
  const fallback = await runConversationAiProviders(
    ["anthropic", "ollama"],
    async (provider) => {
      attempts.push(provider);
      if (provider === "anthropic") throw new Error("credits unavailable");
      return "local feedback";
    },
  );
  assert.deepEqual(attempts, ["anthropic", "ollama"]);
  assert.equal(fallback.provider, "ollama");
  assert.equal(fallback.value, "local feedback");
  assert.match(fallback.failures[0] ?? "", /credits unavailable/);
}

testProviderFallback()
  .then(() =>
    console.log("conversation AI helpers: provider fallback and safety passed"),
  )
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
