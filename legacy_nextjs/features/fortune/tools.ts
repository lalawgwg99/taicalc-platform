import { z } from 'zod';

export const fortuneTools = {
    getDailyFortune: {
        description: '獲取今日財運提示',
        parameters: z.object({ sign: z.string().optional() }),
        execute: async () => ({ summary: '今日財運：偏財運佳，適合投資。' }),
    },
};
