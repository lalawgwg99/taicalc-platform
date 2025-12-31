import { tool } from 'ai';
import { z } from 'zod';
import { analyzeSalary, calculateGrossFromNet, analyzeSalaryStructure } from './logic';

export const salaryTools = {
    calculateSalary: tool({
        description: '計算詳細的薪資分析，包含實領金額、勞健保費用、所得稅估算。當用戶詢問「月薪 X 萬實領多少」或「薪水扣除額」時使用。',
        parameters: z.object({
            monthlySalary: z.number().describe('每月稅前薪資（台幣元）'),
            bonusMonths: z.number().optional().default(0).describe('年終獎金月數'),
            dependents: z.number().optional().default(0).describe('扶養親屬人數 (健保依附人數)'),
            selfContributionRate: z.number().optional().default(0).describe('勞退自提比例 (0-6)'),
            isMarried: z.boolean().optional().default(false).describe('是否已婚'),
        }),
        execute: async (args: any) => {
            return analyzeSalary(
                args.monthlySalary,
                args.bonusMonths,
                {
                    dependents: args.dependents,
                    selfContributionRate: args.selfContributionRate,
                    isMarried: args.isMarried,
                }
            );
        },
    } as any),

    calculateReverseSalary: tool({
        description: '逆向薪資推算。已知「實領金額」反推「稅前薪資」。',
        parameters: z.object({
            targetNetSalary: z.number().describe('每月實領金額'),
            dependents: z.number().optional().default(0).describe('撫養人數'),
            selfContributionRate: z.number().optional().default(0).describe('自提比例'),
        }),
        execute: async (args: any) => {
            const gross = calculateGrossFromNet(
                args.targetNetSalary,
                {
                    dependents: args.dependents,
                    selfContributionRate: args.selfContributionRate,
                }
            );
            return {
                targetNet: args.targetNetSalary,
                estimatedGross: gross,
            };
        },
    } as any),

    analyzeStructure: tool({
        description: '薪資結構分析。判斷是否低於基本工資、高薪族群建議。',
        parameters: z.object({
            monthlySalary: z.number().describe('月薪'),
        }),
        execute: async (args: any) => {
            return analyzeSalaryStructure(args.monthlySalary);
        },
    } as any),
};
