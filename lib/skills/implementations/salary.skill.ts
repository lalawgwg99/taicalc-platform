/**
 * 薪資分析 Skill
 * 封裝 calculations.ts 的 analyzeSalary 函數
 */

import { z } from 'zod';
import { SkillDefinition } from '../types';
import { analyzeSalary, calculateGrossFromNet, analyzeSalaryStructure } from '../../calculations';

// ============================================
// 薪資分析 Skill
// ============================================

const SalaryAnalyzeInputSchema = z.object({
    monthlySalary: z.number().min(0).describe('月薪'),
    bonusMonths: z.number().min(0).max(12).default(0).describe('年終月數'),
    dependents: z.number().int().min(0).max(10).default(0).describe('眷屬人數'),
    selfContributionRate: z.number().min(0).max(6).default(0).describe('勞退自提比例 (%)'),
    isMarried: z.boolean().default(false).describe('是否已婚'),
});

const SalaryAnalyzeOutputSchema = z.object({
    monthly: z.object({
        gross: z.number(),
        insurance: z.number(),
        labor: z.number(),
        health: z.number(),
        pension: z.number(),
        pensionEmployer: z.number(),
        takeHome: z.number(),
    }),
    annual: z.object({
        gross: z.number(),
        insurance: z.number(),
        pension: z.number(),
        tax: z.number(),
        net: z.number(),
    }),
    chartData: z.array(z.object({
        name: z.string(),
        value: z.number(),
        color: z.string(),
    })),
    effectiveTaxRate: z.number(),
    insights: z.object({
        selfContributionSavings: z.number(),
        recommendation: z.string().nullable(),
    }),
});

export type SalaryAnalyzeInput = z.infer<typeof SalaryAnalyzeInputSchema>;
export type SalaryAnalyzeOutput = z.infer<typeof SalaryAnalyzeOutputSchema>;

export const SalaryAnalyzeSkill: SkillDefinition<SalaryAnalyzeInput, SalaryAnalyzeOutput> = {
    id: 'salary.analyze',
    name: '薪資分析',
    description: '計算月薪、年薪、實領金額、勞健保費用、所得稅，並提供節稅建議',
    version: '1.0.0',
    inputSchema: SalaryAnalyzeInputSchema,
    outputSchema: SalaryAnalyzeOutputSchema,
    tags: ['薪資', '勞健保', '稅務', '所得稅'],
    parameterDescriptions: {
        monthlySalary: '每月稅前薪資（新台幣）',
        bonusMonths: '年終獎金月數，例如 1.5 表示 1.5 個月',
        dependents: '健保眷屬人數（最多計 3 人）',
        selfContributionRate: '勞退自提比例，0-6%',
        isMarried: '是否已婚（影響標準扣除額）',
    },
    execute: async (input) => {
        const result = analyzeSalary(
            input.monthlySalary,
            input.bonusMonths,
            {
                dependents: input.dependents,
                selfContributionRate: input.selfContributionRate,
                isMarried: input.isMarried,
            }
        );
        return result as SalaryAnalyzeOutput;
    },
};

// ============================================
// 逆向推算 Skill
// ============================================

const SalaryReverseInputSchema = z.object({
    targetNetSalary: z.number().min(0).describe('目標實領薪資'),
    dependents: z.number().int().min(0).max(10).default(0).describe('眷屬人數'),
    selfContributionRate: z.number().min(0).max(6).default(0).describe('勞退自提比例 (%)'),
});

const SalaryReverseOutputSchema = z.object({
    grossSalary: z.number(),
    targetNetSalary: z.number(),
    difference: z.number(),
});

export type SalaryReverseInput = z.infer<typeof SalaryReverseInputSchema>;
export type SalaryReverseOutput = z.infer<typeof SalaryReverseOutputSchema>;

export const SalaryReverseSkill: SkillDefinition<SalaryReverseInput, SalaryReverseOutput> = {
    id: 'salary.reverse',
    name: '薪資逆向推算',
    description: '根據期望實領金額，反推所需的稅前月薪',
    version: '1.0.0',
    inputSchema: SalaryReverseInputSchema,
    outputSchema: SalaryReverseOutputSchema,
    tags: ['薪資', '逆向計算'],
    parameterDescriptions: {
        targetNetSalary: '期望每月實際領到的金額',
        dependents: '健保眷屬人數',
        selfContributionRate: '勞退自提比例',
    },
    execute: async (input) => {
        const grossSalary = calculateGrossFromNet(input.targetNetSalary, {
            dependents: input.dependents,
            selfContributionRate: input.selfContributionRate,
        });

        return {
            grossSalary,
            targetNetSalary: input.targetNetSalary,
            difference: grossSalary - input.targetNetSalary,
        };
    },
};

// ============================================
// 薪資結構分析 Skill
// ============================================

const SalaryStructureInputSchema = z.object({
    monthlySalary: z.number().min(0).describe('月薪'),
});

const SalaryStructureOutputSchema = z.object({
    級距: z.string(),
    勞保投保級距: z.number(),
    健保投保級距: z.number(),
    建議: z.array(z.string()),
});

export type SalaryStructureInput = z.infer<typeof SalaryStructureInputSchema>;
export type SalaryStructureOutput = z.infer<typeof SalaryStructureOutputSchema>;

export const SalaryStructureSkill: SkillDefinition<SalaryStructureInput, SalaryStructureOutput> = {
    id: 'salary.structure',
    name: '薪資結構分析',
    description: '分析薪資級距，提供投保級距資訊與決策建議',
    version: '1.0.0',
    inputSchema: SalaryStructureInputSchema,
    outputSchema: SalaryStructureOutputSchema,
    tags: ['薪資', '投保', '級距'],
    parameterDescriptions: {
        monthlySalary: '每月稅前薪資',
    },
    execute: async (input) => {
        return analyzeSalaryStructure(input.monthlySalary);
    },
};

// 導出所有薪資相關 Skill
export const salarySkills = [
    SalaryAnalyzeSkill,
    SalaryReverseSkill,
    SalaryStructureSkill,
];
