import { z } from 'zod';

export const capitalTools = {
    calculateCompoundInterest: {
        description: '計算複利投資成長。',
        parameters: z.object({
            principal: z.number().describe('本金'),
            rate: z.number().describe('年報酬率 (%)'),
            years: z.number().describe('投資年數'),
        }),
        execute: async ({ principal, rate, years }: { principal: number, rate: number, years: number }) => {
            const finalAmount = Math.round(principal * Math.pow(1 + rate / 100, years));
            return {
                summary: `投資 ${years} 年後總額：$${finalAmount.toLocaleString()}`,
                details: [`淨獲利：$${(finalAmount - principal).toLocaleString()}`]
            };
        },
    },
};
