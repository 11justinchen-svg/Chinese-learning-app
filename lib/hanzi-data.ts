export type ComponentRole = "semantic" | "phonetic" | "pictographic";

export interface HanziComponent {
  char: string;
  pinyin: string;
  meaning: string;
  role: ComponentRole;
  explanation: string;
}

export interface HanziEntry {
  char: string;
  pinyin: string;
  meaning: string;
  level: string;
  components: HanziComponent[];
  story: string;
}

export const hanziEntries: HanziEntry[] = [
  {
    char: "好",
    pinyin: "hǎo",
    meaning: "good",
    level: "HSK 1",
    components: [
      {
        char: "女",
        pinyin: "nǚ",
        meaning: "woman",
        role: "semantic",
        explanation:
          "A pictograph of a kneeling woman. As a component it marks characters related to women and family.",
      },
      {
        char: "子",
        pinyin: "zǐ",
        meaning: "child",
        role: "semantic",
        explanation:
          "A pictograph of a swaddled baby with outstretched arms. It marks characters related to children and offspring.",
      },
    ],
    story:
      "A mother together with her child was the ancient image of something good. The two halves carry the whole meaning, so this character is purely semantic.",
  },
  {
    char: "明",
    pinyin: "míng",
    meaning: "bright, tomorrow",
    level: "HSK 1",
    components: [
      {
        char: "日",
        pinyin: "rì",
        meaning: "sun",
        role: "semantic",
        explanation:
          "A pictograph of the sun, originally a circle with a dot in the center.",
      },
      {
        char: "月",
        pinyin: "yuè",
        meaning: "moon",
        role: "semantic",
        explanation:
          "A pictograph of a crescent moon. It also marks characters about time and the body (as a variant of 肉).",
      },
    ],
    story:
      "The two brightest objects in the sky, the sun and the moon, combine to mean bright. By extension it means the next day: tomorrow is 明天.",
  },
  {
    char: "休",
    pinyin: "xiū",
    meaning: "to rest",
    level: "HSK 2",
    components: [
      {
        char: "亻",
        pinyin: "rén",
        meaning: "person",
        role: "semantic",
        explanation:
          "The squeezed form of 人 (person) used on the left side of characters. It marks characters about people and their actions.",
      },
      {
        char: "木",
        pinyin: "mù",
        meaning: "tree",
        role: "semantic",
        explanation:
          "A pictograph of a tree with branches above and roots below.",
      },
    ],
    story:
      "A person leaning against a tree is resting. One of the clearest examples of a compound where the picture tells the whole story.",
  },
  {
    char: "妈",
    pinyin: "mā",
    meaning: "mom",
    level: "HSK 1",
    components: [
      {
        char: "女",
        pinyin: "nǚ",
        meaning: "woman",
        role: "semantic",
        explanation: "The woman radical supplies the meaning: a female family member.",
      },
      {
        char: "马",
        pinyin: "mǎ",
        meaning: "horse",
        role: "phonetic",
        explanation:
          "The horse has nothing to do with mothers. It is here purely for its sound: mǎ hints that the character is read mā.",
      },
    ],
    story:
      "A classic phono-semantic compound: 女 tells you the meaning area (a woman), 马 tells you the sound (ma). Around 80 percent of all characters work this way.",
  },
  {
    char: "想",
    pinyin: "xiǎng",
    meaning: "to think, to want",
    level: "HSK 1",
    components: [
      {
        char: "相",
        pinyin: "xiāng",
        meaning: "mutual, appearance",
        role: "phonetic",
        explanation:
          "Itself a compound of 木 (tree) and 目 (eye): an eye examining a tree. Here it lends its sound, xiang.",
      },
      {
        char: "心",
        pinyin: "xīn",
        meaning: "heart",
        role: "semantic",
        explanation:
          "A pictograph of a heart. In Chinese thought, the heart is the seat of thinking and feeling, so it marks mental and emotional characters.",
      },
    ],
    story:
      "Thinking happens in the heart according to the ancient view, so 心 sits below as the meaning, while 相 above provides the sound xiang.",
  },
  {
    char: "安",
    pinyin: "ān",
    meaning: "peaceful, safe",
    level: "HSK 3",
    components: [
      {
        char: "宀",
        pinyin: "mián",
        meaning: "roof",
        role: "semantic",
        explanation:
          "The roof radical, drawn as a house with a peaked roof. It marks characters about buildings and home.",
      },
      {
        char: "女",
        pinyin: "nǚ",
        meaning: "woman",
        role: "semantic",
        explanation: "The woman component, here inside the house.",
      },
    ],
    story:
      "A woman safe at home under a roof meant peace and security to the ancient scribes. You will see this character in 安全 (safety) and the city name 西安.",
  },
  {
    char: "看",
    pinyin: "kàn",
    meaning: "to look, to watch",
    level: "HSK 1",
    components: [
      {
        char: "手",
        pinyin: "shǒu",
        meaning: "hand",
        role: "semantic",
        explanation:
          "A pictograph of a hand with five fingers, slightly compressed on top of this character.",
      },
      {
        char: "目",
        pinyin: "mù",
        meaning: "eye",
        role: "semantic",
        explanation:
          "A pictograph of an eye turned on its side. It marks characters about vision.",
      },
    ],
    story:
      "A hand shading an eye, like a sailor scanning the horizon. The gesture of looking into the distance became the verb to look.",
  },
  {
    char: "家",
    pinyin: "jiā",
    meaning: "home, family",
    level: "HSK 1",
    components: [
      {
        char: "宀",
        pinyin: "mián",
        meaning: "roof",
        role: "semantic",
        explanation: "The roof radical: this character is about a building.",
      },
      {
        char: "豕",
        pinyin: "shǐ",
        meaning: "pig",
        role: "semantic",
        explanation:
          "A pictograph of a pig. Pigs lived under the same roof as the family in ancient China and represented wealth.",
      },
    ],
    story:
      "A pig under a roof: in an agricultural society, a household with a pig was a real home. Wealth lived where the family lived.",
  },
  {
    char: "森",
    pinyin: "sēn",
    meaning: "forest",
    level: "HSK 4",
    components: [
      {
        char: "木",
        pinyin: "mù",
        meaning: "tree",
        role: "semantic",
        explanation:
          "The tree pictograph, repeated three times. One tree is 木, two trees make 林 (woods), three make a forest.",
      },
    ],
    story:
      "Pure accumulation: stack trees and the meaning grows with them. 木 is a tree, 林 is a grove, 森 is a deep forest. 森林 means forest in modern Chinese.",
  },
  {
    char: "信",
    pinyin: "xìn",
    meaning: "to trust, letter",
    level: "HSK 3",
    components: [
      {
        char: "亻",
        pinyin: "rén",
        meaning: "person",
        role: "semantic",
        explanation: "The person radical on the left.",
      },
      {
        char: "言",
        pinyin: "yán",
        meaning: "speech",
        role: "semantic",
        explanation:
          "A pictograph of a mouth with sound waves rising from it. It marks characters about speaking and language.",
      },
    ],
    story:
      "A person standing by their word: that is trust. From trust came the meaning of a letter, a message you can rely on.",
  },
  {
    char: "男",
    pinyin: "nán",
    meaning: "male, man",
    level: "HSK 2",
    components: [
      {
        char: "田",
        pinyin: "tián",
        meaning: "field",
        role: "semantic",
        explanation:
          "A pictograph of a rice paddy divided into plots, seen from above.",
      },
      {
        char: "力",
        pinyin: "lì",
        meaning: "strength",
        role: "semantic",
        explanation:
          "A pictograph of a plow, later understood as a flexed arm. It marks characters about effort and power.",
      },
    ],
    story:
      "Strength applied in the field: in ancient farming life, that labor defined the male role, so field plus strength came to mean man.",
  },
  {
    char: "河",
    pinyin: "hé",
    meaning: "river",
    level: "HSK 3",
    components: [
      {
        char: "氵",
        pinyin: "shuǐ",
        meaning: "water",
        role: "semantic",
        explanation:
          "Three drops, the compressed form of 水 (water). It marks characters about liquids, rivers, and washing.",
      },
      {
        char: "可",
        pinyin: "kě",
        meaning: "can, may",
        role: "phonetic",
        explanation:
          "Here only for its sound: kě hints at the reading hé. The meaning of permission is irrelevant.",
      },
    ],
    story:
      "Water plus the sound ke gives you a river. Originally 河 named one specific river, the Yellow River, before it became the general word.",
  },
];
