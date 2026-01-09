import { z } from 'zod';
import { calculateSalary, calculateHistoricalComparison, calculateTrendAnalysis } from './logic';

export const salaryTools = {
    calculateSalary: {
        description: '計算薪資結構，包含勞健保、勞退扣除額與實領金額。使用 2025 年最新費率。',
        parameters: z.object({
            monthlySalary: z.number().describe('月薪 (新台幣)'),
            bonusMonths: z.number().optional().describe('年終獎金月數 (預設 1 個月)'),
            year: z.number().optional().describe('計算年度 (預設 2025)')
        }),
        execute: async (args: { monthlySalary: number; bonusMonths?: number; year?: number }) => {
            const result = calculateSalary(args);
            return {
                summary: `月薪 ${args.monthlySalary} 元 (年終 ${args.bonusMonths || 1} 個月) ${result.metadata.year} 年計算結果：`,
                details: [
                    `每月實領：${result.monthly.net.toLocaleString()}`,
                    `勞保費：${result.monthly.laborInsurance.toLocaleString()}`,
                    `健保費：${result.monthly.healthInsurance.toLocaleString()}`,
                    `勞退提撥：${result.monthly.laborPension.toLocaleString()}`,
                    `年薪總額：${result.yearly.gross.toLocaleString()}`,
                    `資料來源：${result.metadata.dataSource}`,
                    `更新日期：${result.metadata.lastUpdated}`
                ]
            };
        },
    },
    
    calculateHistoricalComparison: {
        description: '比較不同年度的薪資計算結果，分析年度變化。',
        parameters: z.object({
            monthlySalary: z.number().describe('月薪 (新台幣)'),
            bonusMonths: z.number().optional().describe('年終獎金月數 (預設 1 個月)')
        }),
        execute: async (args: { monthlySalary: number; bonusMonths?: number }) => {
            const comparison = calculateHistoricalComparison(args);
            const change = comparison.yearOverYearChange;
            
            return {
                summary: `薪資歷史比較分析 (2024 vs 2025)：`,
                details: [
                    `2025 年實領：${comparison.currentYear.monthly.net.toLocaleString()}`,
                    `2024 年實領：${comparison.previousYear?.monthly.net.toLocaleString()}`,
                    `實領變化：${change?.netIncome ? (change.netIncome > 0 ? '+' : '') + change.netIncome.toLocaleString() : '0'}`,
                    `勞保費變化：${change?.laborInsurance ? (change.laborInsurance > 0 ? '+' : '') + change.laborInsurance.toLocaleString() : '0'}`,
                    `健保費變化：${change?.healthInsurance ? (change.healthInsurance > 0 ? '+' : '') + change.healthInsurance.toLocaleString() : '0'}`,
                    `勞退變化：${change?.laborPension ? (change.laborPension > 0 ? '+' : '') + change.laborPension.toLocaleString() : '0'}`
                ]
            };
        },
    },
    
    calculateTrendAnalysis: {
        description: '分析薪資趨勢，包含通膨影響和實質收入變化分析。',
        parameters: z.object({
            monthlySalary: z.number().describe('月薪 (新台幣)'),
            bonusMonths: z.number().optional().describe('年終獎金月數 (預設 1 個月)')
        }),
        execute: async (args: { monthlySalary: number; bonusMonths?: number }) => {
            const analysis = calculateTrendAnalysis(args);
            
            return {
                summary: `薪資趨勢分析：`,
                details: [
                    `薪資成長率：${analysis.salaryGrowth.toFixed(2)}%`,
                    `通膨影響：-${analysis.inflationImpact.toLocaleString()} 元`,
                    `實質收入變化：${analysis.realIncomeChange.toFixed(2)}%`,
                    `建議事項：`,
                    ...analysis.recommendations.map(rec => `• ${rec}`)
                ]
            };
        },
    }
};