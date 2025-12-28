/**
 * 資本計算 Skill
 * 封裝複利增長、FIRE、里程碑計算
 */

import { z } from 'zod';
import { SkillDefinition } from '../types';
import { calculateCapitalGrowth, analyzeFinancialFreedom, SimulationParams } from '../../financials';
import { calculateFIRE, calculateGoalReverse, calculatePassiveIncome, calculateMilestones } from '../../calculations/capital';

// ============================================
// 複利成長模擬 Skill
// ============================================

const CapitalGrowthInputSchema = z.object({
    initialCapital: z.number().min(0).describe('初始本金'),
    monthlyContribution: z.number().min(0).describe('每月投入'),
    annualReturnRate: z.number().min(-50).max(100).default(7).describe('年化報酬率 (%)'),
    inflationRate: z.number().min(0).max(20).default(2.5).describe('通膨率 (%)'),
    years: z.number().int().min(1).max(100).default(30).describe('投資年期'),
});

const CapitalGrowthOutputSchema = z.object({
    finalYear: z.object({
        year: z.number(),
        principal: z.number(),
        interest: z.number(),
        totalAssets: z.number(),
        realAssets: z.number(),
        optimisticAssets: z.number(),
        pessimisticAssets: z.number(),
    }),
    summary: z.object({
        totalContribution: z.number(),
        totalInterest: z.number(),
        totalAssets: z.number(),
        realAssets: z.number(),
        monthlyPassiveIncome: z.number(),
        realMonthlyPassiveIncome: z.number(),
    }),
    yearlyData: z.array(z.object({
        year: z.number(),
        totalAssets: z.number(),
        realAssets: z.number(),
    })),
});

export type CapitalGrowthInput = z.infer<typeof CapitalGrowthInputSchema>;
export type CapitalGrowthOutput = z.infer<typeof CapitalGrowthOutputSchema>;

export const CapitalGrowthSkill: SkillDefinition<CapitalGrowthInput, CapitalGrowthOutput> = {
    id: 'capital.growth',
    name: '資本成長模擬',
    description: '模擬複利增長，計算未來資產、被動收入，含通膨調整與樂觀/悲觀情境',
    version: '1.0.0',
    inputSchema: CapitalGrowthInputSchema,
    outputSchema: CapitalGrowthOutputSchema,
    tags: ['資本', '複利', '投資', '被動收入'],
    parameterDescriptions: {
        initialCapital: '目前已有的資產',
        monthlyContribution: '每月預計投入的金額',
        annualReturnRate: '預期年化報酬率（股市平均約 7%）',
        inflationRate: '預期通膨率（台灣平均約 2.5%）',
        years: '計畫投資的年數',
    },
    execute: async (input) => {
        const params: SimulationParams = {
            initialCapital: input.initialCapital,
            monthlyContribution: input.monthlyContribution,
            annualReturnRate: input.annualReturnRate,
            inflationRate: input.inflationRate,
            years: input.years,
        };

        const yearlyData = calculateCapitalGrowth(params);
        const finalData = yearlyData[yearlyData.length - 1];
        const freedomMetrics = analyzeFinancialFreedom(finalData);

        return {
            finalYear: finalData,
            summary: {
                totalContribution: finalData.principal,
                totalInterest: finalData.interest,
                totalAssets: finalData.totalAssets,
                realAssets: finalData.realAssets,
                monthlyPassiveIncome: freedomMetrics.monthlyPassiveIncome,
                realMonthlyPassiveIncome: freedomMetrics.realMonthlyPassiveIncome,
            },
            yearlyData: yearlyData.map(d => ({
                year: d.year,
                totalAssets: d.totalAssets,
                realAssets: d.realAssets,
            })),
        };
    },
};

// ============================================
// FIRE 財務自由 Skill
// ============================================

const FIREInputSchema = z.object({
    monthlyExpense: z.number().min(0).describe('每月生活開銷'),
    currentSavings: z.number().min(0).default(0).describe('目前存款'),
    monthlyInvestment: z.number().min(0).default(0).describe('每月投資金額'),
    expectedReturn: z.number().default(7).describe('預期年化報酬率 (%)'),
    safeWithdrawalRate: z.number().default(4).describe('安全提領率 (%)'),
});

const FIREOutputSchema = z.object({
    fireNumber: z.number(),
    monthlyExpense: z.number(),
    annualExpense: z.number(),
    safeWithdrawalRate: z.number(),
    yearsToFIRE: z.number(),
    monthlyInvestmentNeeded: z.number(),
    currentProgress: z.number(),
});

export type FIREInput = z.infer<typeof FIREInputSchema>;
export type FIREOutput = z.infer<typeof FIREOutputSchema>;

export const FIRESkill: SkillDefinition<FIREInput, FIREOutput> = {
    id: 'capital.fire',
    name: 'FIRE 財務自由計算',
    description: '計算財務自由目標金額、所需年數、每月投入建議',
    version: '1.0.0',
    inputSchema: FIREInputSchema,
    outputSchema: FIREOutputSchema,
    tags: ['FIRE', '財務自由', '退休', '被動收入'],
    parameterDescriptions: {
        monthlyExpense: '每月基本生活開銷',
        currentSavings: '目前已累積的存款/投資',
        monthlyInvestment: '目前每月投入投資的金額',
        expectedReturn: '預期年化報酬率',
        safeWithdrawalRate: '安全提領率（傳統使用 4%）',
    },
    execute: async (input) => {
        return calculateFIRE(
            input.monthlyExpense,
            input.currentSavings,
            input.monthlyInvestment,
            input.expectedReturn,
            input.safeWithdrawalRate
        );
    },
};

// ============================================
// 目標反推 Skill
// ============================================

const GoalReverseInputSchema = z.object({
    targetAmount: z.number().min(0).describe('目標金額'),
    years: z.number().int().min(1).max(100).describe('目標年數'),
    expectedReturn: z.number().default(7).describe('預期年化報酬率 (%)'),
    initialCapital: z.number().min(0).default(0).describe('目前資產'),
});

const GoalReverseOutputSchema = z.object({
    targetAmount: z.number(),
    years: z.number(),
    monthlyInvestment: z.number(),
    totalContribution: z.number(),
    totalInterest: z.number(),
    effectiveReturn: z.number(),
});

export type GoalReverseInput = z.infer<typeof GoalReverseInputSchema>;
export type GoalReverseOutput = z.infer<typeof GoalReverseOutputSchema>;

export const GoalReverseSkill: SkillDefinition<GoalReverseInput, GoalReverseOutput> = {
    id: 'capital.goalReverse',
    name: '目標反推計算',
    description: '根據目標金額和年限，計算每月需投入多少',
    version: '1.0.0',
    inputSchema: GoalReverseInputSchema,
    outputSchema: GoalReverseOutputSchema,
    tags: ['投資', '目標', '理財'],
    execute: async (input) => {
        return calculateGoalReverse(
            input.targetAmount,
            input.years,
            input.expectedReturn,
            input.initialCapital
        );
    },
};

// ============================================
// 被動收入計算 Skill
// ============================================

const PassiveIncomeInputSchema = z.object({
    targetMonthlyIncome: z.number().min(0).describe('目標月被動收入'),
    yieldRate: z.number().min(0.1).max(20).default(5).describe('殖利率 (%)'),
});

const PassiveIncomeOutputSchema = z.object({
    targetMonthlyIncome: z.number(),
    targetAnnualIncome: z.number(),
    requiredCapital: z.number(),
    yieldRate: z.number(),
    scenarios: z.array(z.object({
        yieldRate: z.number(),
        requiredCapital: z.number(),
    })),
});

export type PassiveIncomeInput = z.infer<typeof PassiveIncomeInputSchema>;
export type PassiveIncomeOutput = z.infer<typeof PassiveIncomeOutputSchema>;

export const PassiveIncomeSkill: SkillDefinition<PassiveIncomeInput, PassiveIncomeOutput> = {
    id: 'capital.passiveIncome',
    name: '被動收入計算',
    description: '計算達到目標被動收入所需的本金',
    version: '1.0.0',
    inputSchema: PassiveIncomeInputSchema,
    outputSchema: PassiveIncomeOutputSchema,
    tags: ['被動收入', '股息', '殖利率'],
    execute: async (input) => {
        return calculatePassiveIncome(input.targetMonthlyIncome, input.yieldRate);
    },
};

// ============================================
// 里程碑計算 Skill
// ============================================

const MilestonesInputSchema = z.object({
    initialCapital: z.number().min(0).describe('目前資產'),
    monthlyContribution: z.number().min(0).describe('每月投入'),
    annualReturnRate: z.number().default(7).describe('年化報酬率 (%)'),
});

const MilestonesOutputSchema = z.array(z.object({
    milestone: z.number(),
    label: z.string(),
    year: z.number(),
    monthsToReach: z.number(),
}));

export type MilestonesInput = z.infer<typeof MilestonesInputSchema>;
export type MilestonesOutput = z.infer<typeof MilestonesOutputSchema>;

export const MilestonesSkill: SkillDefinition<MilestonesInput, MilestonesOutput> = {
    id: 'capital.milestones',
    name: '財富里程碑計算',
    description: '計算達成 100萬、500萬、1000萬 等里程碑的時間',
    version: '1.0.0',
    inputSchema: MilestonesInputSchema,
    outputSchema: MilestonesOutputSchema,
    tags: ['里程碑', '目標', '複利'],
    execute: async (input) => {
        return calculateMilestones(
            input.initialCapital,
            input.monthlyContribution,
            input.annualReturnRate
        );
    },
};

// 導出所有資本相關 Skill
export const capitalSkills = [
    CapitalGrowthSkill,
    FIRESkill,
    GoalReverseSkill,
    PassiveIncomeSkill,
    MilestonesSkill,
];
