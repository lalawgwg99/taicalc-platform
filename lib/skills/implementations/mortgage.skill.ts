/**
 * 房貸計算 Skill
 * 封裝房貸試算、轉貸、提前還款計算
 */

import { z } from 'zod';
import { SkillDefinition } from '../types';
import { calculateMonthlyPayment, calculateRefinance, calculateEarlyRepayment, RefinanceResult, EarlyRepaymentResult } from '../../calculations/mortgage';

// ============================================
// 房貸月付金計算 Skill
// ============================================

const MortgageCalculateInputSchema = z.object({
    loanAmount: z.number().min(0).describe('貸款金額'),
    annualRate: z.number().min(0).max(30).describe('年利率 (%)'),
    years: z.number().int().min(1).max(50).describe('貸款年限'),
    gracePeriod: z.number().int().min(0).max(10).default(0).describe('寬限期 (年)'),
});

const MortgageCalculateOutputSchema = z.object({
    monthlyPayment: z.number(),
    gracePeriodPayment: z.number(),
    totalPayment: z.number(),
    totalInterest: z.number(),
    interestRatio: z.number(),
    summary: z.object({
        perTenThousand: z.number(),
        yearlyPayment: z.number(),
    }),
});

export type MortgageCalculateInput = z.infer<typeof MortgageCalculateInputSchema>;
export type MortgageCalculateOutput = z.infer<typeof MortgageCalculateOutputSchema>;

export const MortgageCalculateSkill: SkillDefinition<MortgageCalculateInput, MortgageCalculateOutput> = {
    id: 'mortgage.calculate',
    name: '房貸月付金計算',
    description: '計算房貸月付金、總利息、含寬限期影響分析',
    version: '1.0.0',
    inputSchema: MortgageCalculateInputSchema,
    outputSchema: MortgageCalculateOutputSchema,
    category: 'financial',
    tags: ['mortgage', 'long-term', 'beginner'],
    parameterDescriptions: {
        loanAmount: '房貸總金額',
        annualRate: '年利率百分比',
        years: '貸款年限',
        gracePeriod: '寬限期年數（僅付利息）',
    },
    execute: async (input) => {
        const monthlyRate = input.annualRate / 100 / 12;
        const totalMonths = input.years * 12;
        const graceMonths = input.gracePeriod * 12;
        const payMonths = totalMonths - graceMonths;

        // 寬限期月付 (僅利息)
        const gracePeriodPayment = Math.round(input.loanAmount * monthlyRate);

        // 寬限期後月付 (本息攤還)
        const monthlyPayment = calculateMonthlyPayment(input.loanAmount, input.annualRate, payMonths / 12);

        const totalPaymentGrace = gracePeriodPayment * graceMonths;
        const totalPaymentPost = monthlyPayment * payMonths;
        const totalPayment = totalPaymentGrace + totalPaymentPost;
        const totalInterest = totalPayment - input.loanAmount;

        return {
            monthlyPayment,
            gracePeriodPayment,
            totalPayment,
            totalInterest,
            interestRatio: (totalInterest / totalPayment) * 100,
            summary: {
                perTenThousand: Math.round(monthlyPayment / (input.loanAmount / 10000)),
                yearlyPayment: monthlyPayment * 12,
            },
        };
    },
};

// ============================================
// 轉貸試算 Skill
// ============================================

const RefinanceInputSchema = z.object({
    currentBalance: z.number().min(0).describe('現有貸款餘額'),
    currentRate: z.number().min(0).max(30).describe('現有利率 (%)'),
    remainingYears: z.number().int().min(1).max(50).describe('剩餘年限'),
    newRate: z.number().min(0).max(30).describe('新利率 (%)'),
    newYears: z.number().int().min(1).max(50).optional().describe('新貸款年限'),
    refinanceCost: z.number().min(0).default(30000).describe('轉貸成本'),
});

const RefinanceOutputSchema = z.object({
    currentMonthly: z.number(),
    currentTotalPayment: z.number(),
    currentTotalInterest: z.number(),
    newMonthly: z.number(),
    newTotalPayment: z.number(),
    newTotalInterest: z.number(),
    monthlySavings: z.number(),
    totalSavings: z.number(),
    refinanceCost: z.number(),
    netSavings: z.number(),
    breakEvenMonths: z.number(),
    isWorthIt: z.boolean(),
});

export type RefinanceInput = z.infer<typeof RefinanceInputSchema>;
export type RefinanceOutput = z.infer<typeof RefinanceOutputSchema>;

export const RefinanceSkill: SkillDefinition<RefinanceInput, RefinanceOutput> = {
    id: 'mortgage.refinance',
    name: '轉貸試算',
    description: '評估轉貸是否划算，計算節省金額與回本期',
    version: '1.0.0',
    inputSchema: RefinanceInputSchema,
    outputSchema: RefinanceOutputSchema,
    category: 'financial',
    tags: ['mortgage', 'advanced'],
    parameterDescriptions: {
        currentBalance: '目前貸款餘額',
        currentRate: '目前年利率',
        remainingYears: '剩餘還款年數',
        newRate: '新銀行提供的年利率',
        newYears: '新貸款年限（可選）',
        refinanceCost: '轉貸手續費與違約金總計',
    },
    execute: async (input) => {
        return calculateRefinance(
            input.currentBalance,
            input.currentRate,
            input.remainingYears,
            input.newRate,
            input.newYears || input.remainingYears,
            input.refinanceCost
        );
    },
};

// ============================================
// 提前還款試算 Skill
// ============================================

const EarlyRepaymentInputSchema = z.object({
    loanBalance: z.number().min(0).describe('貸款餘額'),
    annualRate: z.number().min(0).max(30).describe('年利率 (%)'),
    remainingYears: z.number().int().min(1).max(50).describe('剩餘年限'),
    extraPayment: z.number().min(0).describe('額外還款金額'),
    isMonthly: z.boolean().default(false).describe('是否每月額外還款'),
});

const EarlyRepaymentOutputSchema = z.object({
    originalMonthly: z.number(),
    originalTotalMonths: z.number(),
    originalTotalInterest: z.number(),
    shortenMonths: z.number(),
    shortenTotalInterest: z.number(),
    shortenSavedInterest: z.number(),
    shortenSavedYears: z.number(),
    reducedMonthly: z.number(),
    reducedTotalInterest: z.number(),
    reducedMonthlySavings: z.number(),
    reducedSavedInterest: z.number(),
});

export type EarlyRepaymentInput = z.infer<typeof EarlyRepaymentInputSchema>;
export type EarlyRepaymentOutput = z.infer<typeof EarlyRepaymentOutputSchema>;

export const EarlyRepaymentSkill: SkillDefinition<EarlyRepaymentInput, EarlyRepaymentOutput> = {
    id: 'mortgage.earlyRepayment',
    name: '提前還款試算',
    description: '計算提前還款對縮短期限或降低月付的影響',
    version: '1.0.0',
    inputSchema: EarlyRepaymentInputSchema,
    outputSchema: EarlyRepaymentOutputSchema,
    category: 'financial',
    tags: ['mortgage', 'advanced'],
    parameterDescriptions: {
        loanBalance: '目前貸款餘額',
        annualRate: '年利率',
        remainingYears: '剩餘還款年數',
        extraPayment: '打算提前還款的金額',
        isMonthly: '是單筆還款還是每月額外還款',
    },
    execute: async (input) => {
        return calculateEarlyRepayment(
            input.loanBalance,
            input.annualRate,
            input.remainingYears,
            input.extraPayment,
            input.isMonthly
        );
    },
};

// 導出所有房貸相關 Skill
export const mortgageSkills = [
    MortgageCalculateSkill,
    RefinanceSkill,
    EarlyRepaymentSkill,
];
