import { tool } from 'ai';
import { z } from 'zod';
import { calculateCapitalGrowth, analyzeFinancialFreedom, calculateFIRE, calculateGoalReverse, calculatePassiveIncome, calculateMilestones, SimulationParams } from './logic';

export const capitalTools = {
    calculateCapitalGrowth: tool({
        description: '主要工具。資本複利成長模擬。計算未來資產、被動收入，適用於一般存股、投資試算。',
        parameters: z.object({
            initialCapital: z.number().describe('初始本金'),
            monthlyContribution: z.number().describe('每月投入'),
            annualReturnRate: z.number().optional().default(7).describe('年化報酬率 (%)'),
            inflationRate: z.number().optional().default(2.5).describe('通膨率 (%)'),
            years: z.number().optional().default(30).describe('投資年期'),
        }),
        execute: async (args: any) => {
            const params: SimulationParams = {
                initialCapital: args.initialCapital,
                monthlyContribution: args.monthlyContribution,
                annualReturnRate: args.annualReturnRate,
                inflationRate: args.inflationRate,
                years: args.years,
            };
            return calculateCapitalGrowth(params);
        },
    } as any),

    calculateFIRE: tool({
        description: 'FIRE 財務自由計算。評估何時可以退休、退休金是否足夠。',
        parameters: z.object({
            currentAge: z.number().describe('目前年齡'),
            currentCapital: z.number().describe('目前資產'),
            annualExpense: z.number().describe('每年開銷'),
            safeWithdrawalRate: z.number().optional().default(4).describe('安全提領率 (%)'),
            rateOfReturn: z.number().optional().default(5).describe('投資報酬率 (%)'),
            inflationRate: z.number().optional().default(2).describe('通膨率 (%)'),
        }),
        execute: async (args: any) => {
            const result = calculateFIRE(
                args.annualExpense / 12, // monthlyExpense
                args.currentCapital,     // currentSavings
                0,                       // monthlyInvestment (assume 0 for now as it wasn't in params)
                args.rateOfReturn,       // expectedReturn
                args.safeWithdrawalRate, // safeWithdrawalRate
                args.inflationRate       // inflationRate
            );
            return {
                ...result,
                currentAge: args.currentAge,
                fireAge: args.currentAge + result.yearsToFIRE,
            };
        },
    } as any),

    calculateGoalReverse: tool({
        description: '理財目標逆向推算。計算要達成目標（如買房、存到一千萬）每個月需要存多少錢。',
        parameters: z.object({
            targetAmount: z.number().describe('目標金額'),
            years: z.number().describe('幾年後達成'),
            rateOfReturn: z.number().optional().default(7).describe('預期年化報酬率 (%)'),
            currentCapital: z.number().optional().default(0).describe('現有本金'),
        }),
        execute: async (args: any) => {
            return calculateGoalReverse(args.targetAmount, args.years, args.rateOfReturn, args.currentCapital);
        },
    } as any),

    calculatePassiveIncome: tool({
        description: '被動收入試算。計算累積多少本金才能產生足夠的被動收入。',
        parameters: z.object({
            targetMonthlyIncome: z.number().describe('目標每月被動收入'),
            yieldRate: z.number().describe('殖利率/配息率 (%)'),
        }),
        execute: async (args: any) => {
            return calculatePassiveIncome(args.targetMonthlyIncome, args.yieldRate);
        },
    } as any),

    calculateMilestones: tool({
        description: '資產里程碑計算。預估賺到第一桶金、一千萬、一億需要多久。',
        parameters: z.object({
            initialCapital: z.number().describe('初始本金'),
            monthlyContribution: z.number().describe('每月投入'),
            rateOfReturn: z.number().describe('年化報酬率 (%)'),
        }),
        execute: async (args: any) => {
            return calculateMilestones(
                args.initialCapital,
                args.monthlyContribution,
                args.rateOfReturn
            );
        },
    } as any),
};
