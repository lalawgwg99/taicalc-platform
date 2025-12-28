export type DivinationSystem = 'ziwei' | 'bazi' | 'western';

export type Language = 'zh-TW' | 'zh-CN' | 'en' | 'ja';

export type Theme = 'default' | 'void';

export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  gender: 'male' | 'female' | 'other';
  system: DivinationSystem;
}

export interface FatePoint {
  age: number;
  luckScore: number; // 0-100
  event?: string;
  type?: 'career' | 'love' | 'health' | 'wealth';
}

export interface ChartSummary {
  mainStar: string; // Or "Day Master" for Bazi, "Sun Sign" for Western
  element: string; // e.g., "Wood", "Fire"
  animal: string; // Or "Ascendant" for Western
  description: string;
  systemSpecifics?: Record<string, string>; // Extra data like "Moon Sign", "Year Pillar"
}

// Updated to generic string to support dynamic roles (3 masters or 5 elders)
export type MasterRole = 'critic' | 'healer' | 'strategist' | 'authority' | 'karma' | 'fortune' | 'desire' | 'calamity';

export interface ConsultationResponse {
  role: MasterRole;
  content: string;
  quote?: {
    source: string;
    text: string;
  };
}

export interface RagPassage {
  id: number;
  source: string;
  text: string;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export interface DetailedReportData {
  aspects: {
    key: string; // career, wealth, love, health, spirit
    label: string;
    score: number;
    description: string;
  }[];
  lucky: {
    colors: string[];
    numbers: string[];
    direction: string;
  };
  advice: string;
}