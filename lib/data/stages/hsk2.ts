import { HSK2, type HskWord } from "@/lib/hsk";
import { GRAMMAR_LESSONS } from "@/lib/data/grammar";
import type {
  ChoiceExercise,
  DialogueLine,
  Exercise,
  ExerciseBlock,
  ListenExercise,
  MatchExercise,
  OrderExercise,
  ReplyExercise,
  Stage,
} from "./types";

interface ReplySpec {
  scene: string;
  line: { hanzi: string; pinyin: string };
  choices: { hanzi: string; pinyin: string }[];
  answers: string[];
  explain: string;
}

interface StageSpec {
  title: string;
  hanziTitle: string;
  scenario: string;
  description: string;
  goal: string;
  words: string[];
  dialogue: DialogueLine[];
  replies: ReplySpec[];
}

const SPECS: StageSpec[] = [
  {
    title: "Get to the airport",
    hanziTitle: "去机场",
    scenario: "Ask for directions, choose transport, and buy a ticket.",
    description: "Handle the route from where you are to the airport without waiting for an earlier lesson.",
    goal: "Ask where to go and buy the right ticket.",
    words: ["出", "到", "从", "船", "公共汽车", "机场", "近", "进", "离", "路", "票", "向", "远", "自行车", "走", "左边", "右边", "旁边"],
    dialogue: [
      { speaker: "你", hanzi: "请问，去机场怎么走？", pinyin: "Qǐngwèn, qù jīchǎng zěnme zǒu?", english: "Excuse me, how do I get to the airport?" },
      { speaker: "路人", hanzi: "从这儿走，公共汽车在左边。", pinyin: "Cóng zhèr zǒu, gōnggòng qìchē zài zuǒbian.", english: "Go from here; the bus is on the left." },
      { speaker: "你", hanzi: "机场远吗？", pinyin: "Jīchǎng yuǎn ma?", english: "Is the airport far?" },
      { speaker: "路人", hanzi: "不远，坐公共汽车可以到。", pinyin: "Bù yuǎn, zuò gōnggòng qìchē kěyǐ dào.", english: "Not far. You can get there by bus." },
      { speaker: "你", hanzi: "我要两张票。", pinyin: "Wǒ yào liǎng zhāng piào.", english: "I want two tickets." },
      { speaker: "售票员", hanzi: "好，车到了。", pinyin: "Hǎo, chē dào le.", english: "Okay, the bus has arrived." },
    ],
    replies: [
      { scene: "A passerby says the airport is not far.", line: { hanzi: "你想怎么去？", pinyin: "Nǐ xiǎng zěnme qù?" }, choices: [{ hanzi: "我坐公共汽车去。", pinyin: "Wǒ zuò gōnggòng qìchē qù." }, { hanzi: "我想坐公共汽车。", pinyin: "Wǒ xiǎng zuò gōnggòng qìchē." }, { hanzi: "我喜欢咖啡。", pinyin: "Wǒ xǐhuan kāfēi." }, { hanzi: "今天很热。", pinyin: "Jīntiān hěn rè." }], answers: ["我坐公共汽车去。", "我想坐公共汽车。"], explain: "Both natural answers choose the bus and accomplish the goal." },
      { scene: "At the ticket window, buy two tickets.", line: { hanzi: "您要什么？", pinyin: "Nín yào shénme?" }, choices: [{ hanzi: "我要两张票。", pinyin: "Wǒ yào liǎng zhāng piào." }, { hanzi: "两张票，谢谢。", pinyin: "Liǎng zhāng piào, xièxie." }, { hanzi: "我没有弟弟。", pinyin: "Wǒ méiyǒu dìdi." }, { hanzi: "我在学校。", pinyin: "Wǒ zài xuéxiào." }], answers: ["我要两张票。", "两张票，谢谢。"], explain: "A full request or a polite short request both work at a ticket window." },
    ],
  },
  {
    title: "Check into a hotel",
    hanziTitle: "找房间",
    scenario: "Introduce yourself, find your room, and ask staff for help.",
    description: "Use names, room numbers, and service language at a hotel desk.",
    goal: "Give your name and get help finding your room.",
    words: ["帮助", "房间", "服务员", "欢迎", "介绍", "门", "外", "您", "问", "问题", "姓", "找", "可以", "告诉"],
    dialogue: [
      { speaker: "服务员", hanzi: "您好，欢迎！", pinyin: "Nín hǎo, huānyíng!", english: "Hello, welcome!" },
      { speaker: "你", hanzi: "您好，我姓李。我找我的房间。", pinyin: "Nín hǎo, wǒ xìng Lǐ. Wǒ zhǎo wǒ de fángjiān.", english: "Hello, my surname is Li. I am looking for my room." },
      { speaker: "服务员", hanzi: "您住几号房间？", pinyin: "Nín zhù jǐ hào fángjiān?", english: "What room number are you in?" },
      { speaker: "你", hanzi: "二零八号。", pinyin: "Èr líng bā hào.", english: "Room 208." },
      { speaker: "服务员", hanzi: "有问题可以问服务员。", pinyin: "Yǒu wèntí kěyǐ wèn fúwùyuán.", english: "If you have a problem, you can ask the staff." },
      { speaker: "你", hanzi: "谢谢您的帮助。", pinyin: "Xièxie nín de bāngzhù.", english: "Thank you for your help." },
    ],
    replies: [
      { scene: "The clerk asks your surname.", line: { hanzi: "您姓什么？", pinyin: "Nín xìng shénme?" }, choices: [{ hanzi: "我姓王。", pinyin: "Wǒ xìng Wáng." }, { hanzi: "我叫王明。", pinyin: "Wǒ jiào Wáng Míng." }, { hanzi: "房间在外。", pinyin: "Fángjiān zài wài." }, { hanzi: "我喝牛奶。", pinyin: "Wǒ hē niúnǎi." }], answers: ["我姓王。", "我叫王明。"], explain: "A surname or full-name introduction both answer the clerk naturally." },
      { scene: "Ask staff to help you find your room.", line: { hanzi: "您有问题吗？", pinyin: "Nín yǒu wèntí ma?" }, choices: [{ hanzi: "可以帮助我找房间吗？", pinyin: "Kěyǐ bāngzhù wǒ zhǎo fángjiān ma?" }, { hanzi: "请告诉我房间在哪儿。", pinyin: "Qǐng gàosu wǒ fángjiān zài nǎr." }, { hanzi: "我会唱歌。", pinyin: "Wǒ huì chànggē." }, { hanzi: "明天是星期三。", pinyin: "Míngtiān shì xīngqīsān." }], answers: ["可以帮助我找房间吗？", "请告诉我房间在哪儿。"], explain: "Both replies clearly ask for room directions." },
    ],
  },
  {
    title: "Buy clothes",
    hanziTitle: "买衣服",
    scenario: "Ask about size, color, weight, and price in a shop.",
    description: "Compare prices and choose something you can actually buy.",
    goal: "Choose an item and handle its price.",
    words: ["白", "百", "便宜", "穿", "公斤", "贵", "黑", "红", "件", "两", "卖", "千", "元", "张"],
    dialogue: [
      { speaker: "你", hanzi: "这件衣服多少钱？", pinyin: "Zhè jiàn yīfu duōshao qián?", english: "How much is this piece of clothing?" },
      { speaker: "店员", hanzi: "一百元。", pinyin: "Yì bǎi yuán.", english: "One hundred yuan." },
      { speaker: "你", hanzi: "太贵了。有便宜一点儿的吗？", pinyin: "Tài guì le. Yǒu piányi yìdiǎnr de ma?", english: "Too expensive. Is there a cheaper one?" },
      { speaker: "店员", hanzi: "这件八十元。", pinyin: "Zhè jiàn bāshí yuán.", english: "This one is eighty yuan." },
      { speaker: "你", hanzi: "我喜欢红的，也喜欢黑的。", pinyin: "Wǒ xǐhuan hóng de, yě xǐhuan hēi de.", english: "I like the red one and the black one." },
      { speaker: "店员", hanzi: "您穿这件吧。", pinyin: "Nín chuān zhè jiàn ba.", english: "Try this one." },
    ],
    replies: [
      { scene: "The price is higher than you want.", line: { hanzi: "这件一百元。", pinyin: "Zhè jiàn yì bǎi yuán." }, choices: [{ hanzi: "太贵了，有便宜的吗？", pinyin: "Tài guì le, yǒu piányi de ma?" }, { hanzi: "有便宜一点儿的吗？", pinyin: "Yǒu piányi yìdiǎnr de ma?" }, { hanzi: "机场在左边。", pinyin: "Jīchǎng zài zuǒbian." }, { hanzi: "我弟弟十岁。", pinyin: "Wǒ dìdi shí suì." }], answers: ["太贵了，有便宜的吗？", "有便宜一点儿的吗？"], explain: "Both replies ask for a cheaper option without requiring one fixed sentence." },
      { scene: "Choose between a red and black item.", line: { hanzi: "您喜欢哪件？", pinyin: "Nín xǐhuan nǎ jiàn?" }, choices: [{ hanzi: "我要红的。", pinyin: "Wǒ yào hóng de." }, { hanzi: "红的吧。", pinyin: "Hóng de ba." }, { hanzi: "我在教室。", pinyin: "Wǒ zài jiàoshì." }, { hanzi: "我没有票。", pinyin: "Wǒ méiyǒu piào." }], answers: ["我要红的。", "红的吧。"], explain: "A complete request or a short choice both select the red item." },
    ],
  },
  {
    title: "Order at a café",
    hanziTitle: "咖啡时间",
    scenario: "Order drinks, breakfast, fruit, and quantities.",
    description: "Make a flexible café order and respond to suggestions.",
    goal: "Order food and drink with a natural short reply.",
    words: ["吧", "非常", "给", "好吃", "鸡蛋", "咖啡", "牛奶", "让", "西瓜", "羊肉", "鱼", "要", "每"],
    dialogue: [
      { speaker: "服务员", hanzi: "您要什么？", pinyin: "Nín yào shénme?", english: "What would you like?" },
      { speaker: "你", hanzi: "我要一杯咖啡，也要牛奶。", pinyin: "Wǒ yào yì bēi kāfēi, yě yào niúnǎi.", english: "I want a coffee and milk too." },
      { speaker: "服务员", hanzi: "吃鸡蛋吗？", pinyin: "Chī jīdàn ma?", english: "Would you like eggs?" },
      { speaker: "你", hanzi: "好吧，再给我一个鸡蛋。", pinyin: "Hǎo ba, zài gěi wǒ yí ge jīdàn.", english: "Okay, give me one more egg." },
      { speaker: "服务员", hanzi: "这个西瓜非常好吃。", pinyin: "Zhège xīguā fēicháng hǎochī.", english: "This watermelon is very tasty." },
      { speaker: "你", hanzi: "那我要一公斤。", pinyin: "Nà wǒ yào yì gōngjīn.", english: "Then I will take one kilogram." },
    ],
    replies: [
      { scene: "Order a coffee when the server asks.", line: { hanzi: "您要喝什么？", pinyin: "Nín yào hē shénme?" }, choices: [{ hanzi: "我要一杯咖啡。", pinyin: "Wǒ yào yì bēi kāfēi." }, { hanzi: "一杯咖啡，谢谢。", pinyin: "Yì bēi kāfēi, xièxie." }, { hanzi: "我姓李。", pinyin: "Wǒ xìng Lǐ." }, { hanzi: "我坐公共汽车。", pinyin: "Wǒ zuò gōnggòng qìchē." }], answers: ["我要一杯咖啡。", "一杯咖啡，谢谢。"], explain: "Both replies place the same café order." },
      { scene: "Accept the server's egg suggestion.", line: { hanzi: "再吃一个鸡蛋吧？", pinyin: "Zài chī yí ge jīdàn ba?" }, choices: [{ hanzi: "好吧，给我一个。", pinyin: "Hǎo ba, gěi wǒ yí ge." }, { hanzi: "可以，谢谢。", pinyin: "Kěyǐ, xièxie." }, { hanzi: "机场很远。", pinyin: "Jīchǎng hěn yuǎn." }, { hanzi: "今天星期二。", pinyin: "Jīntiān xīngqī'èr." }], answers: ["好吧，给我一个。", "可以，谢谢。"], explain: "Both replies accept the suggestion politely." },
    ],
  },
  {
    title: "Join a birthday",
    hanziTitle: "生日快乐",
    scenario: "Meet a family, give a gift, and join the celebration.",
    description: "Use family words in a real social introduction.",
    goal: "Introduce people and wish someone a happy birthday.",
    words: ["大家", "弟弟", "哥哥", "孩子", "姐姐", "妹妹", "男人", "女人", "妻子", "丈夫", "它", "生日", "送", "快乐", "去年"],
    dialogue: [
      { speaker: "朋友", hanzi: "欢迎！今天是我妹妹的生日。", pinyin: "Huānyíng! Jīntiān shì wǒ mèimei de shēngrì.", english: "Welcome! Today is my younger sister's birthday." },
      { speaker: "你", hanzi: "生日快乐！这个送给她。", pinyin: "Shēngrì kuàilè! Zhège sòng gěi tā.", english: "Happy birthday! This is for her." },
      { speaker: "朋友", hanzi: "谢谢。那个男人是我哥哥。", pinyin: "Xièxie. Nàge nánrén shì wǒ gēge.", english: "Thanks. That man is my older brother." },
      { speaker: "你", hanzi: "旁边的女人呢？", pinyin: "Pángbiān de nǚrén ne?", english: "And the woman beside him?" },
      { speaker: "朋友", hanzi: "她是他的妻子。那个孩子是他们的。", pinyin: "Tā shì tā de qīzi. Nàge háizi shì tāmen de.", english: "She is his wife. That child is theirs." },
      { speaker: "你", hanzi: "大家一起吃饭吧。", pinyin: "Dàjiā yìqǐ chīfàn ba.", english: "Let us all eat together." },
    ],
    replies: [
      { scene: "Wish your friend's sister a happy birthday.", line: { hanzi: "今天是我妹妹的生日。", pinyin: "Jīntiān shì wǒ mèimei de shēngrì." }, choices: [{ hanzi: "生日快乐！", pinyin: "Shēngrì kuàilè!" }, { hanzi: "祝她生日快乐！", pinyin: "Zhù tā shēngrì kuàilè!" }, { hanzi: "这件太贵了。", pinyin: "Zhè jiàn tài guì le." }, { hanzi: "机场在右边。", pinyin: "Jīchǎng zài yòubian." }], answers: ["生日快乐！", "祝她生日快乐！"], explain: "Both forms express the birthday wish; the shorter one is completely natural." },
      { scene: "Ask who the woman is.", line: { hanzi: "那个男人是我哥哥。", pinyin: "Nàge nánrén shì wǒ gēge." }, choices: [{ hanzi: "旁边的女人是谁？", pinyin: "Pángbiān de nǚrén shì shéi?" }, { hanzi: "那个女人呢？", pinyin: "Nàge nǚrén ne?" }, { hanzi: "我想喝咖啡。", pinyin: "Wǒ xiǎng hē kāfēi." }, { hanzi: "我有两张票。", pinyin: "Wǒ yǒu liǎng zhāng piào." }], answers: ["旁边的女人是谁？", "那个女人呢？"], explain: "A full question or a contextual 呢 question both ask about the woman." },
    ],
  },
  {
    title: "Handle a busy day",
    hanziTitle: "忙一天",
    scenario: "Talk about waking up, work, timing, and rest.",
    description: "Describe what is happening now and what is already finished.",
    goal: "Explain your schedule and ask for a break.",
    words: ["公司", "开始", "累", "忙", "起床", "上班", "时间", "事情", "小时", "休息", "已经", "正在", "准备", "早上", "晚上", "完"],
    dialogue: [
      { speaker: "同事", hanzi: "你早上几点起床？", pinyin: "Nǐ zǎoshang jǐ diǎn qǐchuáng?", english: "What time do you get up in the morning?" },
      { speaker: "你", hanzi: "我七点起床，八点上班。", pinyin: "Wǒ qī diǎn qǐchuáng, bā diǎn shàngbān.", english: "I get up at seven and start work at eight." },
      { speaker: "同事", hanzi: "你正在准备什么？", pinyin: "Nǐ zhèngzài zhǔnbèi shénme?", english: "What are you preparing now?" },
      { speaker: "你", hanzi: "我正在准备公司的事情。", pinyin: "Wǒ zhèngzài zhǔnbèi gōngsī de shìqing.", english: "I am preparing company business." },
      { speaker: "同事", hanzi: "你已经做完了吗？", pinyin: "Nǐ yǐjīng zuò wán le ma?", english: "Have you finished already?" },
      { speaker: "你", hanzi: "还没有，我很累，想休息。", pinyin: "Hái méiyǒu, wǒ hěn lèi, xiǎng xiūxi.", english: "Not yet. I am tired and want to rest." },
    ],
    replies: [
      { scene: "Tell a colleague what you are doing now.", line: { hanzi: "你正在做什么？", pinyin: "Nǐ zhèngzài zuò shénme?" }, choices: [{ hanzi: "我正在准备公司的事情。", pinyin: "Wǒ zhèngzài zhǔnbèi gōngsī de shìqing." }, { hanzi: "我在准备工作。", pinyin: "Wǒ zài zhǔnbèi gōngzuò." }, { hanzi: "我妹妹十岁。", pinyin: "Wǒ mèimei shí suì." }, { hanzi: "这件衣服很便宜。", pinyin: "Zhè jiàn yīfu hěn piányi." }], answers: ["我正在准备公司的事情。", "我在准备工作。"], explain: "正在 and 在 can both describe the action in progress here." },
      { scene: "You are tired and need a break.", line: { hanzi: "你还要工作吗？", pinyin: "Nǐ hái yào gōngzuò ma?" }, choices: [{ hanzi: "我很累，想休息。", pinyin: "Wǒ hěn lèi, xiǎng xiūxi." }, { hanzi: "我想休息一下。", pinyin: "Wǒ xiǎng xiūxi yíxià." }, { hanzi: "我要一杯咖啡。", pinyin: "Wǒ yào yì bēi kāfēi." }, { hanzi: "机场不远。", pinyin: "Jīchǎng bù yuǎn." }], answers: ["我很累，想休息。", "我想休息一下。"], explain: "Both replies communicate the need for a break." },
    ],
  },
  {
    title: "Survive a test",
    hanziTitle: "考试问题",
    scenario: "Ask about a question, admit confusion, and answer in class.",
    description: "Use classroom language without pretending you understood.",
    goal: "Ask for clarification and answer a test question.",
    words: ["报纸", "次", "错", "第一", "懂", "回答", "教室", "考试", "课", "题", "意思", "知道", "手机", "手表"],
    dialogue: [
      { speaker: "老师", hanzi: "今天考试。手机放在外面。", pinyin: "Jīntiān kǎoshì. Shǒujī fàng zài wàimian.", english: "There is a test today. Leave phones outside." },
      { speaker: "你", hanzi: "老师，第一题是什么意思？", pinyin: "Lǎoshī, dì-yī tí shì shénme yìsi?", english: "Teacher, what does the first question mean?" },
      { speaker: "老师", hanzi: "你不懂吗？", pinyin: "Nǐ bù dǒng ma?", english: "Do you not understand?" },
      { speaker: "你", hanzi: "对不起，我不知道怎么回答。", pinyin: "Duìbuqǐ, wǒ bù zhīdào zěnme huídá.", english: "Sorry, I do not know how to answer." },
      { speaker: "老师", hanzi: "再看一次。", pinyin: "Zài kàn yí cì.", english: "Look one more time." },
      { speaker: "你", hanzi: "我懂了。刚才的回答错了。", pinyin: "Wǒ dǒng le. Gāngcái de huídá cuò le.", english: "I understand now. My previous answer was wrong." },
    ],
    replies: [
      { scene: "You do not understand the first question.", line: { hanzi: "可以开始回答吗？", pinyin: "Kěyǐ kāishǐ huídá ma?" }, choices: [{ hanzi: "第一题是什么意思？", pinyin: "Dì-yī tí shì shénme yìsi?" }, { hanzi: "我不懂第一题。", pinyin: "Wǒ bù dǒng dì-yī tí." }, { hanzi: "我想买衣服。", pinyin: "Wǒ xiǎng mǎi yīfu." }, { hanzi: "我坐船去。", pinyin: "Wǒ zuò chuán qù." }], answers: ["第一题是什么意思？", "我不懂第一题。"], explain: "Both replies honestly signal the same comprehension problem." },
      { scene: "You recognize your answer was wrong.", line: { hanzi: "这个回答对吗？", pinyin: "Zhège huídá duì ma?" }, choices: [{ hanzi: "不对，我回答错了。", pinyin: "Bú duì, wǒ huídá cuò le." }, { hanzi: "我觉得这个回答错了。", pinyin: "Wǒ juéde zhège huídá cuò le." }, { hanzi: "我姐姐很高。", pinyin: "Wǒ jiějie hěn gāo." }, { hanzi: "我要吃西瓜。", pinyin: "Wǒ yào chī xīguā." }], answers: ["不对，我回答错了。", "我觉得这个回答错了。"], explain: "Both replies identify the answer as wrong." },
    ],
  },
  {
    title: "Deal with illness",
    hanziTitle: "身体不好",
    scenario: "Explain that you are sick and respond to weather advice.",
    description: "Handle a simple health problem and one useful recommendation.",
    goal: "Say what is wrong and understand basic advice.",
    words: ["别", "得", "可能", "快", "慢", "晴", "身体", "生病", "所以", "希望", "雪", "药", "因为", "阴", "再"],
    dialogue: [
      { speaker: "朋友", hanzi: "你怎么了？", pinyin: "Nǐ zěnme le?", english: "What is wrong?" },
      { speaker: "你", hanzi: "我生病了，身体不好。", pinyin: "Wǒ shēngbìng le, shēntǐ bù hǎo.", english: "I am sick and do not feel well." },
      { speaker: "朋友", hanzi: "你得休息，也要吃药。", pinyin: "Nǐ děi xiūxi, yě yào chī yào.", english: "You have to rest and take medicine." },
      { speaker: "你", hanzi: "但是我今天要上班。", pinyin: "Dànshì wǒ jīntiān yào shàngbān.", english: "But I need to work today." },
      { speaker: "朋友", hanzi: "因为有雪，别出去吧。", pinyin: "Yīnwèi yǒu xuě, bié chūqù ba.", english: "Because it is snowing, do not go out." },
      { speaker: "你", hanzi: "好，我希望明天晴。", pinyin: "Hǎo, wǒ xīwàng míngtiān qíng.", english: "Okay. I hope tomorrow is clear." },
    ],
    replies: [
      { scene: "Tell a friend you are sick.", line: { hanzi: "你怎么了？", pinyin: "Nǐ zěnme le?" }, choices: [{ hanzi: "我生病了。", pinyin: "Wǒ shēngbìng le." }, { hanzi: "我身体不太好。", pinyin: "Wǒ shēntǐ bú tài hǎo." }, { hanzi: "我姓王。", pinyin: "Wǒ xìng Wáng." }, { hanzi: "我要两张票。", pinyin: "Wǒ yào liǎng zhāng piào." }], answers: ["我生病了。", "我身体不太好。"], explain: "Both replies clearly communicate the health problem." },
      { scene: "Agree to rest and take medicine.", line: { hanzi: "你得休息，也要吃药。", pinyin: "Nǐ děi xiūxi, yě yào chī yào." }, choices: [{ hanzi: "好，我休息一下。", pinyin: "Hǎo, wǒ xiūxi yíxià." }, { hanzi: "好的，我会吃药。", pinyin: "Hǎo de, wǒ huì chī yào." }, { hanzi: "红的太贵了。", pinyin: "Hóng de tài guì le." }, { hanzi: "我喜欢游泳。", pinyin: "Wǒ xǐhuan yóuyǒng." }], answers: ["好，我休息一下。", "好的，我会吃药。"], explain: "Either reply accepts the advice and keeps the conversation moving." },
    ],
  },
  {
    title: "Make weekend plans",
    hanziTitle: "一起运动",
    scenario: "Choose a sport, invite someone, and arrange when to go.",
    description: "Talk about leisure activities with flexible invitations.",
    goal: "Invite someone to a real activity and answer their invitation.",
    words: ["唱歌", "打篮球", "旅游", "跑步", "踢", "跳舞", "玩", "洗", "一起", "游泳", "运动", "最", "着"],
    dialogue: [
      { speaker: "朋友", hanzi: "你最喜欢什么运动？", pinyin: "Nǐ zuì xǐhuan shénme yùndòng?", english: "What sport do you like most?" },
      { speaker: "你", hanzi: "我最喜欢游泳，也喜欢跑步。", pinyin: "Wǒ zuì xǐhuan yóuyǒng, yě xǐhuan pǎobù.", english: "I like swimming most, and I also like running." },
      { speaker: "朋友", hanzi: "我们一起去游泳吧。", pinyin: "Wǒmen yìqǐ qù yóuyǒng ba.", english: "Let us go swimming together." },
      { speaker: "你", hanzi: "我现在很忙，晚上去可以吗？", pinyin: "Wǒ xiànzài hěn máng, wǎnshang qù kěyǐ ma?", english: "I am busy now. Can we go in the evening?" },
      { speaker: "朋友", hanzi: "可以。你会踢足球吗？", pinyin: "Kěyǐ. Nǐ huì tī zúqiú ma?", english: "Sure. Can you play football?" },
      { speaker: "你", hanzi: "不会，但是我会打篮球。", pinyin: "Bú huì, dànshì wǒ huì dǎ lánqiú.", english: "No, but I can play basketball." },
    ],
    replies: [
      { scene: "A friend invites you swimming.", line: { hanzi: "我们一起去游泳吧。", pinyin: "Wǒmen yìqǐ qù yóuyǒng ba." }, choices: [{ hanzi: "好，我们一起去。", pinyin: "Hǎo, wǒmen yìqǐ qù." }, { hanzi: "可以，晚上去吧。", pinyin: "Kěyǐ, wǎnshang qù ba." }, { hanzi: "我没有妹妹。", pinyin: "Wǒ méiyǒu mèimei." }, { hanzi: "这件八十元。", pinyin: "Zhè jiàn bāshí yuán." }], answers: ["好，我们一起去。", "可以，晚上去吧。"], explain: "Both replies accept the invitation and make a usable plan." },
      { scene: "Say which sport you prefer.", line: { hanzi: "你喜欢跑步还是游泳？", pinyin: "Nǐ xǐhuan pǎobù háishi yóuyǒng?" }, choices: [{ hanzi: "我最喜欢游泳。", pinyin: "Wǒ zuì xǐhuan yóuyǒng." }, { hanzi: "游泳吧。", pinyin: "Yóuyǒng ba." }, { hanzi: "我在公司上班。", pinyin: "Wǒ zài gōngsī shàngbān." }, { hanzi: "我身体不好。", pinyin: "Wǒ shēntǐ bù hǎo." }], answers: ["我最喜欢游泳。", "游泳吧。"], explain: "A full preference or a contextual short choice both work." },
    ],
  },
  {
    title: "Describe someone",
    hanziTitle: "他怎么样",
    scenario: "Describe appearance, compare people, and exchange a number.",
    description: "Use comparison and description in a natural introduction.",
    goal: "Describe a person and confirm who you mean.",
    words: ["但是", "高", "还", "号", "就", "为", "眼睛", "也", "长", "比", "颜色", "新", "真", "觉得", "笑"],
    dialogue: [
      { speaker: "朋友", hanzi: "你觉得王明怎么样？", pinyin: "Nǐ juéde Wáng Míng zěnmeyàng?", english: "What do you think of Wang Ming?" },
      { speaker: "你", hanzi: "他很高，眼睛也很大。", pinyin: "Tā hěn gāo, yǎnjing yě hěn dà.", english: "He is tall and his eyes are big too." },
      { speaker: "朋友", hanzi: "他比哥哥高吗？", pinyin: "Tā bǐ gēge gāo ma?", english: "Is he taller than his older brother?" },
      { speaker: "你", hanzi: "他比哥哥高，但是哥哥也很高。", pinyin: "Tā bǐ gēge gāo, dànshì gēge yě hěn gāo.", english: "He is taller, but his brother is also tall." },
      { speaker: "朋友", hanzi: "你为什么笑？", pinyin: "Nǐ wèishénme xiào?", english: "Why are you laughing?" },
      { speaker: "你", hanzi: "因为这个新照片真好看。", pinyin: "Yīnwèi zhège xīn zhàopiàn zhēn hǎokàn.", english: "Because this new photo looks really good." },
    ],
    replies: [
      { scene: "Describe Wang Ming from a photo.", line: { hanzi: "王明怎么样？", pinyin: "Wáng Míng zěnmeyàng?" }, choices: [{ hanzi: "他很高，眼睛很大。", pinyin: "Tā hěn gāo, yǎnjing hěn dà." }, { hanzi: "我觉得他很高。", pinyin: "Wǒ juéde tā hěn gāo." }, { hanzi: "我要一杯咖啡。", pinyin: "Wǒ yào yì bēi kāfēi." }, { hanzi: "机场在左边。", pinyin: "Jīchǎng zài zuǒbian." }], answers: ["他很高，眼睛很大。", "我觉得他很高。"], explain: "Both replies provide a relevant description." },
      { scene: "Compare Wang Ming with his brother.", line: { hanzi: "谁更高？", pinyin: "Shéi gèng gāo?" }, choices: [{ hanzi: "王明比哥哥高。", pinyin: "Wáng Míng bǐ gēge gāo." }, { hanzi: "王明高一点儿。", pinyin: "Wáng Míng gāo yìdiǎnr." }, { hanzi: "我最喜欢跑步。", pinyin: "Wǒ zuì xǐhuan pǎobù." }, { hanzi: "我生病了。", pinyin: "Wǒ shēngbìng le." }], answers: ["王明比哥哥高。", "王明高一点儿。"], explain: "Both replies identify Wang Ming as taller." },
    ],
  },
];

export const HSK2_GRAMMAR_BY_STAGE: Record<number, string[]> = {
  1: ["cong-dao-route", "li-distance"],
  2: ["keyi-request", "qing-request"],
  3: ["adj-yidianr", "de-nominalizer"],
  4: ["yao-order", "ba-suggestion"],
  5: ["song-gei", "ne-context-question"],
  6: ["zhengzai-progress", "yijing-completed"],
  7: ["bu-zhidao-zenme", "zai-repeat"],
  8: ["yinwei-suoyi", "dei-advice"],
  9: ["zui-superlative", "hui-ability"],
  10: ["bi-comparison", "juede-opinion"],
};

function shortMeaning(word: HskWord): string {
  return word.meaning.split(";")[0].trim();
}

function rotate<T>(items: T[], offset: number): T[] {
  const at = offset % items.length;
  return [...items.slice(at), ...items.slice(0, at)];
}

function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function balancedWordGroups<T>(items: T[]): T[][] {
  const groupCount = Math.ceil(items.length / 5);
  const baseSize = Math.floor(items.length / groupCount);
  const largerGroups = items.length % groupCount;
  const out: T[][] = [];
  let cursor = 0;
  for (let index = 0; index < groupCount; index += 1) {
    const size = baseSize + (index < largerGroups ? 1 : 0);
    out.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  return out;
}

function choiceFor(word: HskWord, pool: HskWord[], id: string, offset: number): ChoiceExercise {
  const distractors = rotate(pool.filter((item) => item.id !== word.id), offset).slice(0, 3);
  return {
    id,
    kind: "choice",
    direction: offset % 2 === 0 ? "hanzi-en" : "en-hanzi",
    wordIds: [word.id],
    question: offset % 2 === 0 ? word.hanzi : shortMeaning(word),
    questionPinyin: offset % 2 === 0 ? word.pinyin : undefined,
    choices: offset % 2 === 0
      ? [shortMeaning(word), ...distractors.map(shortMeaning)]
      : [word.hanzi, ...distractors.map((item) => item.hanzi)],
    answer: offset % 2 === 0 ? shortMeaning(word) : word.hanzi,
    explain: `${word.hanzi} (${word.pinyin}): ${shortMeaning(word)}`,
  };
}

function listenFor(word: HskWord, pool: HskWord[], id: string): ListenExercise {
  return {
    id,
    kind: "listen",
    wordIds: [word.id],
    text: word.hanzi,
    pinyin: word.pinyin,
    choices: [word.hanzi, ...pool.filter((item) => item.id !== word.id).slice(0, 3).map((item) => item.hanzi)],
    answer: word.hanzi,
    translation: shortMeaning(word),
    explain: `${word.hanzi} (${word.pinyin}): ${shortMeaning(word)}`,
  };
}

function matchFor(group: HskWord[], id: string): MatchExercise {
  return {
    id,
    kind: "match",
    matchType: "meaning",
    wordIds: group.map((word) => word.id),
    pairs: group.map((word) => ({ hanzi: word.hanzi, match: shortMeaning(word) })),
  };
}

function idsIn(text: string, words: HskWord[]): string[] {
  return words.filter((word) => text.includes(word.hanzi)).map((word) => word.id);
}

function orderTilesFor(text: string): string[] {
  const characters = Array.from(text.replace(/[，。？！,.!?\s]/g, ""));
  const size = characters.length <= 4 ? 1 : characters.length <= 8 ? 2 : 3;
  return chunks(characters, size).map((part) => part.join(""));
}

function replyFor(spec: ReplySpec, words: HskWord[], id: string): ReplyExercise {
  return {
    id,
    kind: "reply",
    scene: spec.scene,
    line: spec.line,
    choices: spec.choices,
    answer: spec.answers[0],
    answers: spec.answers,
    wordIds: [...new Set(spec.answers.flatMap((answer) => idsIn(answer, words)))],
    explain: spec.explain,
  };
}

const GRAMMAR_DISTRACTORS = [
  "的", "了", "在", "吗", "不", "很", "也", "都", "给", "吧", "再", "最", "比", "从",
];

function grammarBlockFor(
  lessonId: string,
  stageNumber: number,
  lessonIndex: number,
  words: HskWord[],
  reply: ReplySpec,
): ExerciseBlock {
  const lesson = GRAMMAR_LESSONS.find((item) => item.id === lessonId);
  if (!lesson) throw new Error(`Unknown HSK 2 grammar lesson: ${lessonId}`);
  const focus = lesson.focus;
  if (!focus)
    throw new Error(`HSK 2 grammar lesson ${lessonId} needs a retrieval focus`);

  const exercises: Exercise[] = lesson.examples.flatMap((example, exampleIndex) => {
    if (!example.hanzi.includes(focus))
      throw new Error(`${lessonId} example ${exampleIndex + 1} does not include ${focus}`);
    const choices = [
      focus,
      ...GRAMMAR_DISTRACTORS.filter(
        (choice) => choice !== focus && !example.hanzi.includes(choice),
      ),
    ].slice(0, 3);
    return [
      {
        id: `hsk2-s${stageNumber}-grammar-${lessonId}-order-${exampleIndex + 1}`,
        kind: "order" as const,
        wordIds: idsIn(example.hanzi, words),
        tiles: orderTilesFor(example.hanzi),
        translation: example.meaning,
        pinyin: example.pinyin,
        explain: lesson.pattern,
      },
      {
        id: `hsk2-s${stageNumber}-grammar-${lessonId}-cloze-${exampleIndex + 1}`,
        kind: "cloze" as const,
        wordIds: idsIn(example.hanzi, words),
        sentence: example.hanzi.replace(focus, "＿"),
        translation: example.meaning,
        choices,
        answer: focus,
        explain: lesson.summary,
      },
    ];
  });
  exercises.push(
    replyFor(
      reply,
      words,
      `hsk2-s${stageNumber}-grammar-${lessonId}-reply-${lessonIndex + 1}`,
    ),
  );

  return {
    id: `hsk2-s${stageNumber}-grammar-${lessonId}`,
    title: `${lesson.hanzi} · ${lesson.title}`,
    kind: "grammar",
    grammarLessonId: lessonId,
    exercises,
  };
}

function makeStage(spec: StageSpec, index: number): Stage {
  const stageNumber = index + 1;
  const words = spec.words.map((hanzi) => HSK2.find((word) => word.hanzi === hanzi)).filter((word): word is HskWord => Boolean(word));
  if (words.length !== spec.words.length) {
    const missing = spec.words.filter((hanzi) => !HSK2.some((word) => word.hanzi === hanzi));
    throw new Error(`HSK 2 stage ${stageNumber} missing: ${missing.join(", ")}`);
  }

  const blocks: ExerciseBlock[] = balancedWordGroups(words).map((group, groupIndex) => ({
    id: `hsk2-s${stageNumber}-words-${groupIndex + 1}`,
    title: `Word sprint ${groupIndex + 1}`,
    kind: "vocab",
    exercises: [
      matchFor(group, `hsk2-s${stageNumber}-match-${groupIndex + 1}`),
      choiceFor(
        group[groupIndex % group.length],
        words,
        `hsk2-s${stageNumber}-choice-${groupIndex + 1}`,
        groupIndex,
      ),
    ],
  }));

  const grammarLessonIds = HSK2_GRAMMAR_BY_STAGE[stageNumber] ?? [];
  blocks.push(
    ...grammarLessonIds.map((lessonId, lessonIndex) =>
      grammarBlockFor(
        lessonId,
        stageNumber,
        lessonIndex,
        words,
        spec.replies[lessonIndex % spec.replies.length],
      ),
    ),
  );

  const replies = spec.replies.map((reply, replyIndex) => replyFor(reply, words, `hsk2-s${stageNumber}-reply-${replyIndex + 1}`));
  blocks.push({
    id: `hsk2-s${stageNumber}-conversation`,
    title: "Say something useful",
    kind: "vocab",
    exercises: replies,
  });

  const orderAnswer = spec.replies[0].answers[0];
  const order: OrderExercise = {
    id: `hsk2-s${stageNumber}-order`,
    kind: "order",
    wordIds: idsIn(orderAnswer, words),
    tiles: orderTilesFor(orderAnswer),
    translation: spec.replies[0].explain,
    pinyin: spec.replies[0].choices.find((choice) => choice.hanzi === orderAnswer)?.pinyin,
  };
  blocks[blocks.length - 1].exercises.push(order);

  const fastReply = replyFor(
    spec.replies[0],
    words,
    `hsk2-s${stageNumber}-fast-4`,
  );
  const fastOrder: OrderExercise = {
    ...order,
    id: `hsk2-s${stageNumber}-fast-5`,
  };
  const checkpoint: Exercise[] = [
    choiceFor(words[0], words, `hsk2-s${stageNumber}-fast-1`, 0),
    choiceFor(words[Math.floor(words.length / 2)], words, `hsk2-s${stageNumber}-fast-2`, 1),
    listenFor(words[words.length - 1], words, `hsk2-s${stageNumber}-fast-3`),
    fastReply,
    fastOrder,
  ];

  return {
    id: `hsk2-stage-${String(stageNumber).padStart(2, "0")}`,
    level: 2,
    index: stageNumber,
    title: spec.title,
    hanziTitle: spec.hanziTitle,
    scenario: spec.scenario,
    description: spec.description,
    estimatedMinutes: 14,
    goal: spec.goal,
    wordIds: words.map((word) => word.id),
    grammarLessonIds,
    dialogue: spec.dialogue,
    teach: words.map((word) => ({ wordId: word.id })),
    blocks,
    checkpoint,
  };
}

export const HSK2_STAGES: Stage[] = SPECS.map(makeStage);

const allocated = HSK2_STAGES.flatMap((stage) => stage.wordIds);
if (allocated.length !== HSK2.length || new Set(allocated).size !== HSK2.length) {
  throw new Error(`HSK 2 stage allocation covers ${new Set(allocated).size}/${HSK2.length} unique words`);
}
