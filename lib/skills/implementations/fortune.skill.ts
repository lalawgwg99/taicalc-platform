/**
 * Fortune Skill - 財運命盤分析
 * 整合命理系統（紫微斗數、八字、西洋占星）與財務規劃
 */

import { z } from 'zod';
import { SkillDefinition, SkillCategory, SkillTag } from '../types';

// 輸入 Schema
const fortuneInputSchema = z.object({
    name: z.string().min(1).describe('姓名'),
    birthDate: z.string().describe('出生日期 (YYYY-MM-DD)'),
    birthTime: z.string().optional().default('12:00').describe('出生時間 (HH:mm)'),
    gender: z.enum(['male', 'female', 'other']).describe('性別'),
    system: z.enum(['ziwei', 'bazi', 'western']).describe('命理系統'),
    salary: z.number().optional().describe('月薪（選填）'),
    retirementAge: z.number().optional().describe('目標退休年齡'),
});

// 輸出 Schema
const fortuneOutputSchema = z.object({
    profile: z.object({
        name: z.string(),
        birthDate: z.string(),
        system: z.string(),
        systemName: z.string(),
    }),
    analysis: z.object({
        mainStar: z.string().describe('主星/日主'),
        element: z.string().describe('五行/元素'),
        wealthPalace: z.string().describe('財帛宮分析'),
    }),
    forecast: z.object({
        year2025: z.string().describe('2025 財運走勢'),
        investmentStyle: z.string().describe('適合的投資風格'),
        riskWarning: z.string().describe('風險提醒'),
    }),
    actionItems: z.array(z.string()).describe('具體理財建議'),
    confidence: z.number().describe('信心度'),
});

type FortuneInput = z.infer<typeof fortuneInputSchema>;
type FortuneOutput = z.infer<typeof fortuneOutputSchema>;

const SYSTEM_NAMES: Record<string, string> = {
    ziwei: '紫微斗數',
    bazi: '八字命理',
    western: '西洋占星',
};

// 根據命盤特質產生理財建議（簡化版，實際應整合 AI）
function analyzeFortuneProfile(input: FortuneInput): FortuneOutput {
    const birthYear = new Date(input.birthDate).getFullYear();
    const zodiacIndex = (birthYear - 4) % 12;
    const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
    const elementos = ['金', '木', '水', '火', '土'];

    // 簡化的命盤分析
    const mainStar = input.system === 'ziwei' ? '紫微星' :
        input.system === 'bazi' ? '日主' : '太陽星座';

    const element = elementos[zodiacIndex % 5];
    const animal = zodiacAnimals[zodiacIndex];

    // 根據五行推算財運特質
    const wealthStyle = {
        '金': { style: '穩健型', advice: '適合定存、債券、藍籌股' },
        '木': { style: '成長型', advice: '適合成長股、創業投資' },
        '水': { style: '靈活型', advice: '適合多元配置、國際佈局' },
        '火': { style: '積極型', advice: '適合高風險高報酬、短線操作' },
        '土': { style: '保守型', advice: '適合不動產、ETF 長期持有' },
    }[element] || { style: '均衡型', advice: '適合多元配置' };

    // 生成建議
    const actionItems = [
        `根據您的${element}行特質，建議採用${wealthStyle.style}投資策略`,
        input.salary ? `月薪 ${input.salary.toLocaleString()} 元，建議儲蓄率至少 20%（${Math.round(input.salary * 0.2).toLocaleString()} 元/月）` : '建議建立緊急預備金，至少 6 個月生活費',
        `2025 年財運走勢：${animal}年生人宜穩紮穩打，避免投機`,
    ];

    return {
        profile: {
            name: input.name,
            birthDate: input.birthDate,
            system: input.system,
            systemName: SYSTEM_NAMES[input.system] || input.system,
        },
        analysis: {
            mainStar,
            element: `${element}行`,
            wealthPalace: `${animal}年生人，財帛宮${wealthStyle.style}，${wealthStyle.advice}`,
        },
        forecast: {
            year2025: `2025 年為乙巳蛇年，${element}行人財運${zodiacIndex % 3 === 0 ? '大吉' : zodiacIndex % 3 === 1 ? '中平' : '小心'}`,
            investmentStyle: wealthStyle.style,
            riskWarning: element === '火' ? '火行人容易衝動投資，建議設定停損點' : '整體穩定，但需注意流動性風險',
        },
        actionItems,
        confidence: 0.6, // 命理分析信心度較低，純屬娛樂參考
    };
}

export const fortuneSkill: SkillDefinition<FortuneInput, FortuneOutput> = {
    id: 'fortune.analyze',
    name: '財運命盤分析',
    description: '結合命理系統與財務規劃，分析個人財運特質與理財建議',
    version: '1.0.0',
    category: 'entertainment' as SkillCategory,
    tags: ['fortune', 'long-term', 'beginner'] as SkillTag[],
    inputSchema: fortuneInputSchema,
    outputSchema: fortuneOutputSchema,
    parameterDescriptions: {
        name: '使用者姓名',
        birthDate: '出生日期，格式 YYYY-MM-DD',
        birthTime: '出生時間，格式 HH:mm',
        gender: '性別：male/female/other',
        system: '命理系統：ziwei（紫微）/bazi（八字）/western（西洋占星）',
        salary: '月薪（選填），用於產生更精準的理財建議',
        retirementAge: '目標退休年齡（選填）',
    },
    defaultAssumptions: {
        disclaimer: '此分析純屬娛樂性質，不構成專業理財建議',
    },
    execute: async (input: FortuneInput): Promise<FortuneOutput> => {
        return analyzeFortuneProfile(input);
    },
};
