import { z } from 'zod';
import { calculateSalary } from './logic';

export const salaryTools = {
    calculateSalary: {
        description: '計算薪資結構，包含勞健保扣除額與實領金額。',
        parameters: z.object({
            monthlySalary: z.number().describe('月薪 (新台幣)'),
            bonusMonths: z.number().optional().describe('年終獎金月數 (預設 1 個月)'),
        }),
        execute: async (args: { monthlySalary: number; bonusMonths?: number }) => {
            const result = calculateSalary(args);
            return {
                summary: `月薪 ${args.monthlySalary} 元 (年終 ${args.bonusMonths || 1} 個月) 計算結果：`,
                details: [
                    `每月實領：$${result.monthly.net.toLocaleString()}`,
                    `勞保費：$${result.monthly.laborInsurance.toLocaleString()}`,
                    `健保費：$${result.monthly.healthInsurance.toLocaleString()}`,
                    `年薪總額：$${result.yearly.gross.toLocaleString()}`,
                ]
            };
        },
    },
};
