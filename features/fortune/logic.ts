/**
 * Fortune Logic - 財運命盤分析
 */

export interface FortuneInput {
    name: string;
    birthDate: string;
    birthTime?: string;
    gender: 'male' | 'female' | 'other';
    system: 'ziwei' | 'bazi' | 'western';
    salary?: number;
    retirementAge?: number;
}

const SYSTEM_NAMES: Record<string, string> = {
    ziwei: '紫微斗數',
    bazi: '八字命理',
    western: '西洋占星',
};

// 根據命盤特質產生理財建議（簡化版）
export function analyzeFortuneProfile(input: FortuneInput) {
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
