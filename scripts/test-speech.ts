import assert from "node:assert/strict";
import {
  normalizeMandarinText,
  selectMandarinVoice,
  type VoiceDescriptor,
} from "../lib/speech";

function voice(
  name: string,
  lang: string,
  localService = true,
): VoiceDescriptor {
  return { default: false, lang, localService, name, voiceURI: name };
}

assert.equal(
  selectMandarinVoice([
    voice("Basic Taiwan", "zh-TW"),
    voice("Microsoft Xiaoxiao Online (Natural)", "zh-CN", false),
    voice("Basic Mainland", "zh-CN"),
  ])?.name,
  "Microsoft Xiaoxiao Online (Natural)",
);

assert.equal(
  selectMandarinVoice([
    voice("Cantonese", "zh-HK"),
    voice("English", "en-US"),
  ]),
  null,
);

assert.equal(
  selectMandarinVoice([
    voice("Taiwan Mandarin", "zh-TW"),
    voice("Generic Chinese", "zh"),
  ])?.name,
  "Taiwan Mandarin",
);

assert.equal(
  normalizeMandarinText("  你 好 ,  老师?\u200B  "),
  "你 好，老师？",
);
assert.equal(normalizeMandarinText("１２:30 !"), "12:30！");
assert.equal(normalizeMandarinText(" \n\t "), "");

console.log("speech helpers: all tests passed");
