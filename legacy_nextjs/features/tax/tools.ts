import { z } from 'zod';
import { calculateTax } from './logic';

export const taxTools = {
    calculateTax: {
        description: '試算 2025 年綜合所得稅。',
        parameters: z.object({
            income: z.number().describe('年度總收入'),
            isMarried: z.boolean().optional().describe('是否已婚'),
            spouseIncome: z.number().optional().describe('配偶收入'),
            children: z.number().optional().describe('扶養親屬/子女人數'),
        }),
        execute: async (args: { income: number; isMarried?: boolean; spouseIncome?: number; children?: number }) => {
            const tax = calculateTax(args);
            return {
                summary: `預估稅額：$${tax.toLocaleString()}`,
                details: [
                    `總收入：$${(args.income + (args.spouseIncome || 0)).toLocaleString()}`,
                    `計算基礎：2025 年免稅額標準`,
                    `建議：這只是粗略試算，實際報稅請依國稅局試算為準。`
                ]
            };
        },
    },
};
