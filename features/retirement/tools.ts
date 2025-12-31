import { tool } from 'ai';
import { z } from 'zod';
import { calculateLaborPension, calculatePensionTaxSavings, calculatePensionGap } from './logic';

export const retirementTools = {
    calculateLaborPension: tool({
        description: '勞退試算。計算退休後可領多少勞工退休金。分析自提與否的差異。',
        parameters: z.object({
            monthlySalary: z.number().describe('月薪'),
            currentAge: z.number().describe('目前年齡'),
            retireAge: z.number().describe('預計退休年齡'),
            selfContributionRate: z.number().optional().default(0).describe('自提比例 (0-6)'),
            expectedReturn: z.number().optional().default(3).describe('勞退基金預期報酬率 (%)'),
        }),
        execute: async (args: any) => {
            return calculateLaborPension({
                monthlySalary: args.monthlySalary,
                currentAge: args.currentAge,
                retireAge: args.retireAge,
                selfContributionRate: args.selfContributionRate,
                expectedReturn: args.expectedReturn,
            });
        },
    } as any),

    calculatePensionTaxSavings: tool({
        description: '勞退自提節稅分析。計算自提 6% 能省多少所得稅。',
        parameters: z.object({
            monthlySalary: z.number().describe('月薪'),
            selfContributionRate: z.number().describe('自提比例 (通常為 6)'),
            annualIncome: z.number().describe('年收入 (用於判斷稅率)'),
        }),
        execute: async (args: any) => {
            return calculatePensionTaxSavings(
                args.monthlySalary,
                args.selfContributionRate,
                args.annualIncome,
            );
        },
    } as any),

    calculatePensionGap: tool({
        description: '退休金缺口試算。綜合勞保、勞退、國民年金，計算離理想退休生活還差多少錢。',
        parameters: z.object({
            monthlySalary: z.number().describe('月薪'),
            currentAge: z.number().describe('目前年齡'),
            retireAge: z.number().describe('預計退休年齡'),
            expectedMonthlyExpense: z.number().describe('退休後預計每月開銷'),
            laborPensionMonthly: z.number().optional().describe('預估勞保年金 (選填)'),
            nationalPensionMonthly: z.number().optional().describe('預估國民年金 (選填)'),
            expectedReturn: z.number().optional().default(5).describe('投資預期報酬率'),
        }),
        execute: async (args: any) => {
            return calculatePensionGap({
                monthlySalary: args.monthlySalary,
                currentAge: args.currentAge,
                retireAge: args.retireAge,
                expectedMonthlyExpense: args.expectedMonthlyExpense,
                laborPensionMonthly: args.laborPensionMonthly,
                nationalPensionMonthly: args.nationalPensionMonthly,
                expectedReturn: args.expectedReturn,
            });
        },
    } as any),
};
