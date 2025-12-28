/**
 * 稅務計算 Skill
 * 封裝所得稅計算邏輯
 */

import { z } from 'zod';
import { SkillDefinition } from '../types';
import { calculateIncomeTax } from '../../calculations';
import { TAIWAN_PARAMS } from '../../constants';

// ============================================
// 所得稅計算 Skill
// ============================================

const TaxCalculateInputSchema = z.object({
    annualIncome: z.number().min(0).describe('年收入'),
    exemptionCount: z.number().int().min(1).default(1).describe('免稅額人數'),
    householdSize: z.number().int().min(1).default(1).describe('申報戶人數'),
    isMarried: z.boolean().default(false).describe('是否已婚'),
    useStandardDeduction: z.boolean().default(true).describe('使用標準扣除額'),
});

const TaxCalculateOutputSchema = z.object({
    annualIncome: z.number(),
    taxAmount: z.number(),
    effectiveTaxRate: z.number(),
    taxBracket: z.string(),
    deductionDetails: z.object({
        exemption: z.number(),
        standardDeduction: z.number(),
        salarySpecial: z.number(),
        basicLiving: z.number(),
        totalDeductions: z.number(),
    }),
    taxableIncome: z.number(),
});

export type TaxCalculateInput = z.infer<typeof TaxCalculateInputSchema>;
export type TaxCalculateOutput = z.infer<typeof TaxCalculateOutputSchema>;

export const TaxCalculateSkill: SkillDefinition<TaxCalculateInput, TaxCalculateOutput> = {
    id: 'tax.calculate',
    name: '所得稅計算',
    description: '計算年度所得稅，支援免稅額、扣除額、基本生活費差額等參數',
    version: '1.0.0',
    inputSchema: TaxCalculateInputSchema,
    outputSchema: TaxCalculateOutputSchema,
    category: 'financial',
    tags: ['tax', 'low-risk', 'beginner'],
    parameterDescriptions: {
        annualIncome: '全年總收入（新台幣）',
        exemptionCount: '可申報的免稅額人數',
        householdSize: '申報戶總人數（用於計算基本生活費）',
        isMarried: '是否已婚（影響標準扣除額）',
        useStandardDeduction: '是否使用標準扣除額',
    },
    execute: async (input) => {
        const { EXEMPTION, STANDARD_SINGLE, STANDARD_MARRIED, SALARY_SPECIAL, BASIC_LIVING_EXPENSE } = TAIWAN_PARAMS.DEDUCTIONS;

        // 計算各項扣除額
        const exemption = input.exemptionCount * EXEMPTION;
        const standardDeduction = input.useStandardDeduction
            ? (input.isMarried ? STANDARD_MARRIED : STANDARD_SINGLE)
            : 0;
        const salarySpecial = Math.min(input.annualIncome, SALARY_SPECIAL);

        const basicLivingCheckSum = exemption + standardDeduction;
        const basicLivingTotal = input.householdSize * BASIC_LIVING_EXPENSE;
        const basicLiving = Math.max(0, basicLivingTotal - basicLivingCheckSum);

        const totalDeductions = exemption + standardDeduction + salarySpecial + basicLiving;
        const taxableIncome = Math.max(0, input.annualIncome - totalDeductions);

        // 計算稅額
        const taxAmount = calculateIncomeTax(input.annualIncome, {
            exemptionCount: input.exemptionCount,
            householdSize: input.householdSize,
            isMarried: input.isMarried,
            useStandardDeduction: input.useStandardDeduction,
        });

        // 判斷稅率級距
        let taxBracket = '免稅';
        for (const bracket of TAIWAN_PARAMS.INCOME_TAX_BRACKETS) {
            if (taxableIncome <= bracket.limit) {
                taxBracket = `${bracket.rate * 100}%`;
                break;
            }
        }

        return {
            annualIncome: input.annualIncome,
            taxAmount,
            effectiveTaxRate: input.annualIncome > 0 ? (taxAmount / input.annualIncome) * 100 : 0,
            taxBracket,
            deductionDetails: {
                exemption,
                standardDeduction,
                salarySpecial,
                basicLiving,
                totalDeductions,
            },
            taxableIncome,
        };
    },
};

// ============================================
// 稅務優化建議 Skill
// ============================================

const TaxOptimizeInputSchema = z.object({
    annualIncome: z.number().min(0).describe('年收入'),
    currentSelfContribution: z.number().min(0).max(6).default(0).describe('目前勞退自提比例'),
    isMarried: z.boolean().default(false).describe('是否已婚'),
});

const TaxOptimizeOutputSchema = z.object({
    currentTax: z.number(),
    optimizedTax: z.number(),
    savingsAmount: z.number(),
    recommendations: z.array(z.string()),
});

export type TaxOptimizeInput = z.infer<typeof TaxOptimizeInputSchema>;
export type TaxOptimizeOutput = z.infer<typeof TaxOptimizeOutputSchema>;

export const TaxOptimizeSkill: SkillDefinition<TaxOptimizeInput, TaxOptimizeOutput> = {
    id: 'tax.optimize',
    name: '稅務優化建議',
    description: '分析節稅空間，提供勞退自提、扣除額選擇等優化建議',
    version: '1.0.0',
    inputSchema: TaxOptimizeInputSchema,
    outputSchema: TaxOptimizeOutputSchema,
    category: 'financial',
    tags: ['tax', 'advanced'],
    parameterDescriptions: {
        annualIncome: '全年總收入',
        currentSelfContribution: '目前勞退自提比例',
        isMarried: '是否已婚',
    },
    execute: async (input) => {
        const recommendations: string[] = [];

        // 計算目前稅額
        const currentTax = calculateIncomeTax(input.annualIncome, { isMarried: input.isMarried });

        // 試算勞退自提 6% 的節稅效果
        const monthlySalary = input.annualIncome / 12;
        const maxSelfContribution = Math.min(monthlySalary, 150000) * 0.06 * 12;

        const taxWithSelfContribution = calculateIncomeTax(
            input.annualIncome - maxSelfContribution,
            { isMarried: input.isMarried }
        );

        const selfContributionSavings = currentTax - taxWithSelfContribution;

        if (input.currentSelfContribution < 6 && selfContributionSavings > 0) {
            recommendations.push(`建議提高勞退自提至 6%，每年可省稅約 ${Math.round(selfContributionSavings)} 元`);
        }

        // 高收入族群建議
        if (input.annualIncome > 2520000) {
            recommendations.push('您已達 40% 最高稅率級距，建議諮詢專業會計師進行稅務規劃');
        }

        // 婚姻狀態建議
        if (!input.isMarried && input.annualIncome > 1000000) {
            recommendations.push('若結婚可享有較高的標準扣除額 (24.8 萬 vs 13.1 萬)');
        }

        if (recommendations.length === 0) {
            recommendations.push('您的稅務配置已相當優化');
        }

        return {
            currentTax,
            optimizedTax: taxWithSelfContribution,
            savingsAmount: selfContributionSavings,
            recommendations,
        };
    },
};

// 導出所有稅務相關 Skill
export const taxSkills = [
    TaxCalculateSkill,
    TaxOptimizeSkill,
];
