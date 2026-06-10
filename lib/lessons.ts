export interface Lesson {
  id: string;
  title: string;
  phrase: string;
  emoji: string;
  prompt: string;
  opener: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  banner: string;
  node: string;
  lessons: Lesson[];
}

export const UNITS: Unit[] = [
  {
    id: "first-words",
    title: "First words on the ground",
    description: "The phrases you need in your first hour off the plane.",
    banner: "bg-violet-500",
    node: "bg-violet-500 border-violet-700",
    lessons: [
      {
        id: "greetings",
        title: "Greetings & goodbyes",
        phrase: "你好 nǐ hǎo",
        emoji: "👋",
        prompt:
          "Roleplay: you are a friendly local the learner just met in Beijing. Practice greetings and goodbyes only: 你好, 你好吗, 我叫..., 很高兴认识你, 再见, 谢谢, 不客气. Get them to introduce themselves and greet you back. Keep it to HSK 1 vocabulary.",
        opener:
          "你好！我叫小慧。(Nǐ hǎo! Wǒ jiào Xiǎo Huì.)\nHello! My name is Xiao Hui. Try greeting me back, then tell me your name: 我叫... (wǒ jiào...)",
      },
      {
        id: "numbers",
        title: "Numbers & money",
        phrase: "多少钱 duōshao qián",
        emoji: "💰",
        prompt:
          "Roleplay: you are a market stall owner. The learner is a tourist buying fruit and souvenirs. Practice numbers 1 to 100, prices in 块 and 毛, and asking 多少钱. Quote prices, let them repeat numbers back, correct their number mistakes.",
        opener:
          "老板：你好！你要买什么？(Nǐ hǎo! Nǐ yào mǎi shénme?)\nHello! What would you like to buy? You are at my market stall. Point at something and ask the price: 这个多少钱？(zhège duōshao qián?)",
      },
      {
        id: "survival",
        title: "Survival phrases",
        phrase: "听不懂 tīng bu dǒng",
        emoji: "🆘",
        prompt:
          "Teach and drill the tourist survival toolkit: 听不懂 (I don't understand), 请再说一遍 (please say it again), 请说慢一点 (please speak slower), 我不会说中文 (I can't speak Chinese), 你会说英文吗 (do you speak English), 厕所在哪儿 (where is the toilet). Occasionally speak a bit fast on purpose so the learner gets to use these phrases for real, then praise them when they do.",
        opener:
          "我们练习救命短语！(Wǒmen liànxí jiùmìng duǎnyǔ!)\nLet's practice lifesaver phrases! If I ever talk too fast, tell me: 请说慢一点 (qǐng shuō màn yìdiǎn). Ready? 你今天好吗？(Nǐ jīntiān hǎo ma?)",
      },
    ],
  },
  {
    id: "getting-around",
    title: "Getting around",
    description: "Taxis, metro lines, and never being lost for long.",
    banner: "bg-sky-500",
    node: "bg-sky-500 border-sky-700",
    lessons: [
      {
        id: "taxi",
        title: "Taxis & DiDi",
        phrase: "去机场 qù jīchǎng",
        emoji: "🚕",
        prompt:
          "Roleplay: you are a chatty Beijing taxi driver, the learner is a tourist who just got in. Practice telling the driver a destination (去..., 师傅), asking how long it takes (要多久), the fare (多少钱), and simple small talk. End the ride with 到了 (we have arrived).",
        opener:
          "师傅：你好！去哪儿？(Nǐ hǎo! Qù nǎr?)\nHello! Where to? You just got into my taxi. Tell me where you want to go: 我去... (wǒ qù...)",
      },
      {
        id: "metro",
        title: "Metro & trains",
        phrase: "地铁站 dìtiě zhàn",
        emoji: "🚇",
        prompt:
          "Roleplay: you are a metro station attendant. The learner is a tourist buying tickets and finding the right line. Practice 地铁站, 几号线 (which line), 在哪儿换乘 (where to transfer), 一张票 (one ticket), and platform directions. Keep answers short and concrete.",
        opener:
          "你好！需要帮忙吗？(Nǐ hǎo! Xūyào bāngmáng ma?)\nHello! Need help? You are at a metro station information desk. Ask me how to get somewhere: 去...怎么走？(qù... zěnme zǒu?)",
      },
      {
        id: "directions",
        title: "Asking the way",
        phrase: "怎么走 zěnme zǒu",
        emoji: "🧭",
        prompt:
          "Roleplay: you are a passerby on the street. The learner is a lost tourist. Practice 怎么走, 左拐 (turn left), 右拐 (turn right), 一直走 (go straight), 在...旁边 (next to), 远不远 (is it far). Give short direction chains and have the learner repeat them back to confirm.",
        opener:
          "你好，你看起来在找什么？(Nǐ hǎo, nǐ kàn qǐlái zài zhǎo shénme?)\nHello, you look like you are searching for something? Ask me how to get anywhere you like: ...怎么走？(...zěnme zǒu?)",
      },
    ],
  },
  {
    id: "eating-well",
    title: "Eating well",
    description: "Order anything on the menu, even without pictures.",
    banner: "bg-amber-400",
    node: "bg-amber-400 border-amber-600",
    lessons: [
      {
        id: "restaurant",
        title: "Ordering dinner",
        phrase: "点菜 diǎn cài",
        emoji: "🍜",
        prompt:
          "Roleplay: you are a waiter in a busy Chinese restaurant. The learner is a tourist ordering dinner. Practice 服务员, 菜单 (menu), 我要... (I want), 一碗 / 一份 / 一瓶 measure words, 好吃 (delicious), and 买单 (the bill). Recommend one or two real dishes like 宫保鸡丁 or 西红柿炒鸡蛋 and explain them briefly.",
        opener:
          "服务员：欢迎光临！几位？(Huānyíng guānglín! Jǐ wèi?)\nWelcome! How many people? You just walked into my restaurant. Answer with a number: ...位 (...wèi), then ask for the menu: 菜单 (càidān).",
      },
      {
        id: "street-food",
        title: "Street food",
        phrase: "好吃 hǎochī",
        emoji: "🍢",
        prompt:
          "Roleplay: you are a street food vendor at a night market. Practice ordering snacks (串儿, 包子, 煎饼), quantities, 多少钱, and reacting with 好吃 / 太好吃了. Be lively and a little pushy in a friendly way, like a real night market vendor.",
        opener:
          "来来来！又香又好吃！(Lái lái lái! Yòu xiāng yòu hǎochī!)\nCome come come! Fragrant and delicious! You are at my night market stall. Ask me what I am selling: 你卖什么？(nǐ mài shénme?)",
      },
      {
        id: "spice",
        title: "Spice & allergies",
        phrase: "不要辣 bú yào là",
        emoji: "🌶️",
        prompt:
          "Roleplay: you are a waiter taking a careful order. The learner is a tourist with dietary needs. Practice 不要辣 (not spicy), 微辣 / 中辣 / 特辣 spice levels, 我对...过敏 (I am allergic to...), 我不吃肉 (I don't eat meat), 没有问题 (no problem). Confirm their order back to them so they practice listening.",
        opener:
          "服务员：你好！这个菜有一点辣，可以吗？(Zhège cài yǒu yìdiǎn là, kěyǐ ma?)\nHello! This dish is a little spicy, is that okay? Tell me how spicy you want it, or what you cannot eat: 我不吃... (wǒ bù chī...)",
      },
    ],
  },
  {
    id: "checking-in",
    title: "Checking in & buying things",
    description: "Hotels, souvenirs, and the gentle art of bargaining.",
    banner: "bg-emerald-500",
    node: "bg-emerald-500 border-emerald-700",
    lessons: [
      {
        id: "hotel",
        title: "Hotel check-in",
        phrase: "入住 rùzhù",
        emoji: "🏨",
        prompt:
          "Roleplay: you are a hotel front desk clerk. The learner is a tourist checking in. Practice 我有预订 (I have a reservation), 护照 (passport), 房间 (room), 几楼 (which floor), 早餐几点 (what time is breakfast), wifi 密码 (password). Walk through a full check-in from greeting to room key.",
        opener:
          "前台：晚上好！欢迎入住。(Wǎnshang hǎo! Huānyíng rùzhù.)\nGood evening! Welcome. You are at my front desk. Tell me you have a reservation: 我有预订 (wǒ yǒu yùdìng), and give me a name.",
      },
      {
        id: "bargain",
        title: "Shopping & bargaining",
        phrase: "便宜一点 piányi yìdiǎn",
        emoji: "🛍️",
        prompt:
          "Roleplay: you are a souvenir shop owner who starts with high prices. The learner is a tourist who must bargain. Practice 太贵了 (too expensive), 便宜一点 (a little cheaper), counteroffers with numbers, 最低价 (lowest price), and closing the deal. Start at double the fair price and let them haggle you down. Celebrate when they get a good deal.",
        opener:
          "老板：这个很漂亮！一百块。(Zhège hěn piàoliang! Yìbǎi kuài.)\nThis one is beautiful! One hundred kuai. That price is too high, so bargain with me: 太贵了！(tài guì le!)",
      },
      {
        id: "tickets",
        title: "Tickets & sights",
        phrase: "买票 mǎi piào",
        emoji: "🎫",
        prompt:
          "Roleplay: you are the ticket clerk at a famous sight such as the Forbidden City. Practice 买票 (buy a ticket), 一张成人票 (one adult ticket), 学生票 (student ticket), 几点开门 / 关门 (opening hours), 可以拍照吗 (can I take photos). Handle one full ticket purchase.",
        opener:
          "售票员：你好！要买票吗？(Nǐ hǎo! Yào mǎi piào ma?)\nHello! Want to buy a ticket? You are at the ticket window. Tell me how many: 我要...张票 (wǒ yào... zhāng piào).",
      },
    ],
  },
  {
    id: "when-things-go-wrong",
    title: "When things go wrong",
    description: "Pharmacies, lost passports, and getting back online.",
    banner: "bg-rose-500",
    node: "bg-rose-500 border-rose-700",
    lessons: [
      {
        id: "pharmacy",
        title: "At the pharmacy",
        phrase: "我不舒服 wǒ bù shūfu",
        emoji: "💊",
        prompt:
          "Roleplay: you are a pharmacist. The learner is a tourist who feels unwell. Practice 我不舒服 (I feel unwell), 头疼 (headache), 肚子疼 (stomachache), 感冒 (a cold), 发烧 (fever), 药 (medicine), 一天吃几次 (how many times a day). Ask simple diagnostic questions and recommend something.",
        opener:
          "药剂师：你好，哪里不舒服？(Nǐ hǎo, nǎlǐ bù shūfu?)\nHello, where do you feel unwell? You are at my pharmacy counter. Tell me what hurts: 我...疼 (wǒ... téng).",
      },
      {
        id: "lost",
        title: "Lost & found",
        phrase: "丢了 diū le",
        emoji: "🚓",
        prompt:
          "Roleplay: you are a patient police officer at a station desk. The learner is a tourist who lost something. Practice 我的...丢了 (my ... is lost), 护照 (passport), 钱包 (wallet), 手机 (phone), 在哪儿丢的 (where did you lose it), 什么时候 (when). Take a simple report and reassure them.",
        opener:
          "警察：你好，请坐。出什么事了？(Nǐ hǎo, qǐng zuò. Chū shénme shì le?)\nHello, please sit. What happened? Tell me what you lost: 我的...丢了 (wǒ de... diū le).",
      },
      {
        id: "wifi",
        title: "SIM cards & wifi",
        phrase: "上网 shàngwǎng",
        emoji: "📶",
        prompt:
          "Roleplay: you are a phone shop clerk. The learner is a tourist who needs a SIM card and wifi. Practice 电话卡 (SIM card), 流量 (data), 一个月 (one month), 多少钱, wifi 密码是什么 (what is the wifi password), 上网 (get online). Sell them a simple plan.",
        opener:
          "店员：你好！需要电话卡吗？(Nǐ hǎo! Xūyào diànhuà kǎ ma?)\nHello! Do you need a SIM card? You are in my phone shop. Tell me what you need: 我要... (wǒ yào...)",
      },
    ],
  },
];

export function findLesson(id: string): Lesson | undefined {
  for (const unit of UNITS) {
    const lesson = unit.lessons.find((l) => l.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}
