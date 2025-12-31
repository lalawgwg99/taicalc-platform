import { tool } from 'ai';
import { z } from 'zod';
import { calculateTax } from './logic';

export const taxTools = {
    calculateIncomeTax: tool({
        description: '計算綜合所得稅。當用戶詢問「年收 X 萬要繳多少稅」或「報稅」相關問題時使用。',
        parameters: z.object({
            annualIncome: z.number().describe('年度總收入 (台幣元)'),
            isMarried: z.boolean().optional().default(false).describe('是否已婚'),
            exemptionCount: z.number().optional().default(1).describe('免稅額人數 (本人+扶養親屬)'),
            householdSize: z.number().optional().default(1).describe('申報戶總人數 (用於計算基本生活費差額)'),
        }),
        execute: async (args: any) => {
            return calculateTax({
                annualIncome: args.annualIncome,
                isMarried: args.isMarried,
                exemptionCount: args.exemptionCount,
                householdSize: args.householdSize,
            });
        },
    } as any),
};
