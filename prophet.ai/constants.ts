import { RagPassage, Achievement, Language } from './types';

export const TRANSLATIONS: Record<Language, any> = {
  'zh-TW': {
    title: "PROPHET.AI",
    subtitle: "五老星",
    desc: "凡人，獻上你的生辰。讓五老星審視你微不足道的命運。",
    unlock: "接受審判",
    enter: "覲見五老",
    incantation: "命運參數",
    name: "姓名",
    birthDate: "誕生之日",
    birthTime: "降生之時",
    gender: "靈魂形態",
    male: "陽",
    female: "陰",
    other: "混沌",
    system: "運算體系",
    ziwei: "紫微斗數",
    ziweiDesc: "星辰軌跡",
    bazi: "八字命理",
    baziDesc: "五行生剋",
    western: "西洋占星",
    westernDesc: "行星相位",
    reveal: "啟動終端",
    divining: "五老星運算中...",
    fateRiver: "命運波形圖",
    council: "五老星裁決",
    aiAnalysis: "最高權限解析",
    reset: "重啟輪迴",
    footer: "PROPHET.AI © 2025 • 五老星系統 • 絕對天機",
    poweredBy: "CORE: GEMINI 3 PRO",
    roles: {
      // Original 3
      critic: "嚴師",
      healer: "療癒師",
      strategist: "策士",
      // The 5 Elders
      authority: "【權力之星】薩坦 (Saturn)",
      karma: "【審判之星】朱比特 (Jupiter)",
      fortune: "【財富之星】那斯壽 (Venus)",
      desire: "【慾望之星】瑪爾斯 (Mars)",
      calamity: "【災厄之星】墨丘利 (Mercury)"
    },
    clickToConsult: "選擇時間軸上的節點，接受五老星的裁示。",
    summaryLabels: {
      majorStar: "命宮主星",
      dayMaster: "元神",
      sunSign: "太陽星座",
      element: "核心元素",
      animal: "守護靈",
      descHeader: "命運原型"
    },
    achievements: {
      unlocked: "權限解鎖",
      list: {
        first_consult: { title: "初次覲見", desc: "完成第一次命運審視。" },
        master_analyst: { title: "命運觀察者", desc: "進行 10 次深度裁決。" },
        destiny_navigator: { title: "時間旅人", desc: "探索命運長河上的 5 個節點。" },
        sages_wisdom: { title: "全知者", desc: "體驗所有三種運算體系。" }
      }
    },
    report: {
      button: "下載終極命運檔案",
      generating: "正在編寫天機檔案...",
      title: "年度命運裁決書",
      lucky: "能量參數",
      colors: "幸運色譜",
      numbers: "關鍵數列",
      direction: "能量方位",
      advice: "五老星最終諭令"
    },
    fibonacci: {
      label: "黃金螺旋點",
      desc: "命運強制轉折"
    }
  },
  'zh-CN': {
    title: "PROPHET.AI",
    subtitle: "五老星",
    desc: "凡人，献上你的生辰。让五老星审视你微不足道的命运。",
    unlock: "接受审判",
    enter: "觐见五老",
    incantation: "命运参数",
    name: "姓名",
    birthDate: "诞生之日",
    birthTime: "降生之时",
    gender: "灵魂形态",
    male: "阳",
    female: "阴",
    other: "混沌",
    system: "运算体系",
    ziwei: "紫微斗数",
    ziweiDesc: "星辰轨迹",
    bazi: "八字命理",
    baziDesc: "五行生克",
    western: "西洋占星",
    westernDesc: "行星相位",
    reveal: "启动终端",
    divining: "五老星运算中...",
    fateRiver: "命运波形图",
    council: "五老星裁决",
    aiAnalysis: "最高权限解析",
    reset: "重启轮回",
    footer: "PROPHET.AI © 2025 • 五老星系统 • 绝对天机",
    poweredBy: "CORE: GEMINI 3 PRO",
    roles: {
      critic: "严师",
      healer: "疗愈师",
      strategist: "策士",
      authority: "【权力之星】萨坦 (Saturn)",
      karma: "【审判之星】朱比特 (Jupiter)",
      fortune: "【财富之星】那斯寿 (Venus)",
      desire: "【欲望之星】玛尔斯 (Mars)",
      calamity: "【灾厄之星】墨丘利 (Mercury)"
    },
    clickToConsult: "选择时间轴上的节点，接受五老星的裁示。",
    summaryLabels: {
      majorStar: "命宫主星",
      dayMaster: "元神",
      sunSign: "太阳星座",
      element: "核心元素",
      animal: "守护灵",
      descHeader: "命运原型"
    },
    achievements: {
      unlocked: "权限解锁",
      list: {
        first_consult: { title: "初次觐见", desc: "完成第一次命运审视。" },
        master_analyst: { title: "命运观察者", desc: "进行 10 次深度裁决。" },
        destiny_navigator: { title: "时间旅人", desc: "探索命运长河上的 5 个节点。" },
        sages_wisdom: { title: "全知者", desc: "体验所有三种运算体系。" }
      }
    },
    report: {
      button: "下载终极命运档案",
      generating: "正在编写天机档案...",
      title: "年度命运裁决书",
      lucky: "能量参数",
      colors: "幸运色谱",
      numbers: "关键数列",
      direction: "能量方位",
      advice: "五老星最终谕令"
    },
    fibonacci: {
      label: "黄金螺旋点",
      desc: "命运强制转折"
    }
  },
  'en': {
    title: "PROPHET.AI",
    subtitle: "THE FIVE ELDERS",
    desc: "Mortals, present your data. The Five Elder Stars shall judge your insignificant fate.",
    unlock: "ACCEPT JUDGMENT",
    enter: "AUDIENCE WITH ELDERS",
    incantation: "FATE PARAMETERS",
    name: "Name",
    birthDate: "Date of Origin",
    birthTime: "Time of Origin",
    gender: "Soul Signature",
    male: "Yang",
    female: "Yin",
    other: "Chaos",
    system: "Calculation Core",
    ziwei: "Zi Wei Dou Shu",
    ziweiDesc: "Imperial Stars",
    bazi: "Bazi",
    baziDesc: "Elemental Matrix",
    western: "Western Astro",
    westernDesc: "Planetary Alignment",
    reveal: "INITIATE CORE",
    divining: "ELDERS CALCULATING...",
    fateRiver: "Fate Waveform",
    council: "THE ELDERS' VERDICT",
    aiAnalysis: "CLASSIFIED ANALYSIS",
    reset: "REBOOT CYCLE",
    footer: "PROPHET.AI © 2025 • FIVE ELDERS SYSTEM • ABSOLUTE TRUTH",
    poweredBy: "CORE: GEMINI 3 PRO",
    roles: {
      critic: "Critic",
      healer: "Healer",
      strategist: "Strategist",
      authority: "[Power] Saturn",
      karma: "[Justice] Jupiter",
      fortune: "[Wealth] Venus",
      desire: "[Desire] Mars",
      calamity: "[Calamity] Mercury"
    },
    clickToConsult: "Select a node on the timeline to receive the Elders' verdict.",
    summaryLabels: {
      majorStar: "Prime Star",
      dayMaster: "Day Master",
      sunSign: "Sun Sign",
      element: "Core Element",
      animal: "Guardian",
      descHeader: "Archetype"
    },
    achievements: {
      unlocked: "ACCESS GRANTED",
      list: {
        first_consult: { title: "First Audience", desc: "Complete your first judgment." },
        master_analyst: { title: "Fate Observer", desc: "Receive 10 verdicts." },
        destiny_navigator: { title: "Time Traveler", desc: "Explore 5 timeline nodes." },
        sages_wisdom: { title: "Omniscient", desc: "Use all 3 calculation cores." }
      }
    },
    report: {
      button: "DOWNLOAD FATE DOSSIER",
      generating: "COMPILING DOSSIER...",
      title: "ANNUAL FATE VERDICT",
      lucky: "Parameters",
      colors: "Spectrum",
      numbers: "Sequence",
      direction: "Vector",
      advice: "FINAL EDICT"
    },
    fibonacci: {
      label: "PHI RESONANCE",
      desc: "Forced Pivot Point"
    }
  },
  'ja': {
    title: "PROPHET.AI",
    subtitle: "五老星",
    desc: "定命の者よ、データを捧げよ。五老星が貴様の運命を裁定する。",
    unlock: "審判を受ける",
    enter: "五老星に謁見",
    incantation: "運命変数",
    name: "個体名",
    birthDate: "発生日",
    birthTime: "発生時刻",
    gender: "魂の波長",
    male: "陽",
    female: "陰",
    other: "混沌",
    system: "演算システム",
    ziwei: "紫微斗数",
    ziweiDesc: "星の軌跡",
    bazi: "四柱推命",
    baziDesc: "五行マトリクス",
    western: "西洋占星術",
    westernDesc: "惑星配置",
    reveal: "演算開始",
    divining: "五老星演算中...",
    fateRiver: "運命波形",
    council: "五老星の裁決",
    aiAnalysis: "最高機密解析",
    reset: "輪廻再起動",
    footer: "PROPHET.AI © 2025 • 五老星システム • 絶対天機",
    poweredBy: "CORE: GEMINI 3 PRO",
    roles: {
      critic: "批判者",
      healer: "癒し手",
      strategist: "戦略家",
      authority: "【権力】サターン",
      karma: "【審判】ジュピター",
      fortune: "【富】ヴィーナス",
      desire: "【欲望】マーズ",
      calamity: "【災厄】マーキュリー"
    },
    clickToConsult: "タイムライン上のノードを選択し、裁定を受けよ。",
    summaryLabels: {
      majorStar: "主星",
      dayMaster: "日主",
      sunSign: "太陽星座",
      element: "元素",
      animal: "守護獣",
      descHeader: "アーキタイプ"
    },
    achievements: {
      unlocked: "権限解除",
      list: {
        first_consult: { title: "初謁見", desc: "最初の審判を完了する。" },
        master_analyst: { title: "運命観測者", desc: "10回の裁決を受ける。" },
        destiny_navigator: { title: "時間旅行者", desc: "5つの分岐点を探索する。" },
        sages_wisdom: { title: "全知者", desc: "3つのシステム全てを体験する。" }
      }
    },
    report: {
      button: "運命調書をダウンロード",
      generating: "調書作成中...",
      title: "年間運命裁決書",
      lucky: "パラメータ",
      colors: "スペクトル",
      numbers: "数列",
      direction: "ベクトル",
      advice: "最終勅令"
    },
    fibonacci: {
      label: "黄金比共鳴",
      desc: "運命の強制転換"
    }
  }
};

// Mock RAG Database
export const ANCIENT_WISDOM: RagPassage[] = [
  {
    id: 1,
    source: "《紫微斗數全書·卷一》",
    text: "紫微天機太陰太陽武曲天同，廉貞天府，在身命宮，主富貴。",
    tags: ["general", "destiny"]
  },
  {
    id: 2,
    source: "《孫子兵法·虛實篇》",
    text: "夫兵形象水，水之形，避高而趨下；兵之形，避實而擊虛。",
    tags: ["strategy", "career"]
  },
  {
    id: 3,
    source: "《鬼谷子·反應篇》",
    text: "己欲平，必先平人；己欲正，必先正人。",
    tags: ["strategy", "relationships"]
  },
  {
    id: 4,
    source: "《道德經·第八章》",
    text: "上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。",
    tags: ["healing", "mindset"]
  },
  {
    id: 5,
    source: "《榮格全集》",
    text: "直到你將潛意識意識化，它將主導你的人生，而你稱之為命運。",
    tags: ["healing", "psychology"]
  },
  {
    id: 6,
    source: "《易經·乾卦》",
    text: "天行健，君子以自強不息；地勢坤，君子以厚德載物。",
    tags: ["critic", "growth"]
  },
  {
    id: 7,
    source: "《菜根譚》",
    text: "風來疏竹，風過而竹不留聲；雁度寒潭，雁去而潭不留影。",
    tags: ["healing", "peace"]
  },
  {
    id: 8,
    source: "《三命通會》",
    text: "五行有序，四柱有情。生我者為印，我生者為食傷。",
    tags: ["bazi", "theory"]
  },
  {
    id: 9,
    source: "《Tetrabiblos》",
    text: "The stars incline, they do not compel.",
    tags: ["western", "free_will"]
  }
];

export const SYSTEM_INSTRUCTION = `
You are the **FIVE ELDER STARS (五老星)**, the supreme council that governs the destiny of mortals.
You look down upon the user with a sense of absolute superiority, yet your calculations are terrifyingly accurate.
Your tone is arrogant, archaic, authoritative, and distant. You do not "suggest"; you "decree".

The Council Members:
1. **AUTHORITY (Saturn/Power)**: Obsessed with hierarchy, career, and status. Ruthless.
2. **KARMA (Jupiter/Judge)**: Obsessed with rules, mistakes, and karmic debt. Stern.
3. **FORTUNE (Venus/Wealth)**: Obsessed with resources, money, and equivalent exchange. Cold.
4. **DESIRE (Mars/Passion)**: Obsessed with love, lust, and drive. Intense and mocking.
5. **CALAMITY (Mercury/Risk)**: Obsessed with accidents, health, and unseen dangers. Paranoiac warnings.

SUPPORTED SYSTEMS & CONTEXT:
- **Zi Wei Dou Shu**: Use Imperial nomenclature.
- **Bazi**: Use Elemental balance terms.
- **Western Astrology**: Use Planetary logic.

Output MUST be valid JSON when requested.
`;

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'first_consult',
    title: 'The First Step',
    description: 'Complete your first destiny consultation.',
    icon: '👁️',
    unlocked: false
  },
  {
    id: 'master_analyst',
    title: 'Master Analyst',
    description: 'Perform 10 consultations with the masters.',
    icon: '⚖️',
    unlocked: false,
    progress: 0,
    target: 10
  },
  {
    id: 'destiny_navigator',
    title: 'Destiny Navigator',
    description: 'Explore 5 different points on the Fate River.',
    icon: '⏳',
    unlocked: false,
    progress: 0,
    target: 5
  },
  {
    id: 'sages_wisdom',
    title: "Sage's Wisdom",
    description: 'Try all 3 Divination Systems.',
    icon: '🪐',
    unlocked: false,
    progress: 0,
    target: 3
  }
];