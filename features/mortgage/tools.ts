import { tool } from 'ai';
import { z } from 'zod';
import { calculateMonthlyPayment, calculateRefinance, calculateEarlyRepayment } from './logic';

export const mortgageTools = {
    calculateMortgage: tool({
        description: '計算房貸月付金、總利息。當用戶問「貸 X 萬，利率 Y%，繳幾年，月付多少」時使用。',
        parameters: z.object({
            loanAmount: z.number().describe('貸款金額'),
            annualRate: z.number().describe('年利率 (%)'),
            years: z.number().describe('貸款年限'),
            gracePeriod: z.number().optional().default(0).describe('寬限期 (年)'),
        }),
        execute: async (args: any) => {
            const monthlyRate = args.annualRate / 100 / 12;
            const totalMonths = args.years * 12;
            const graceMonths = args.gracePeriod * 12;
            const payMonths = totalMonths - graceMonths;

            // 寬限期月付 (僅利息)
            const gracePeriodPayment = Math.round(args.loanAmount * monthlyRate);

            // 寬限期後月付 (本息攤還)
            const monthlyPayment = calculateMonthlyPayment(args.loanAmount, args.annualRate, payMonths / 12);

            const totalPaymentGrace = gracePeriodPayment * graceMonths;
            const totalPaymentPost = monthlyPayment * payMonths;
            const totalPayment = totalPaymentGrace + totalPaymentPost;
            const totalInterest = totalPayment - args.loanAmount;

            return {
                monthlyPayment,
                gracePeriodPayment,
                totalPayment,
                totalInterest,
                interestRatio: (totalInterest / totalPayment) * 100,
                summary: {
                    perTenThousand: Math.round(monthlyPayment / (args.loanAmount / 10000)),
                    yearlyPayment: monthlyPayment * 12,
                },
            };
        },
    } as any),

    calculateRefinance: tool({
        description: '轉貸/借新還舊試算。評估轉貸是否划算。',
        parameters: z.object({
            currentLoan: z.object({
                balance: z.number().describe('現有貸款餘額'),
                rate: z.number().describe('現有利率 (%)'),
                remainingYears: z.number().describe('剩餘年限'),
            }),
            newLoan: z.object({
                amount: z.number().describe('新貸款金額 (通常等於餘額)'),
                rate: z.number().describe('新利率 (%)'),
                years: z.number().describe('新貸款年限'),
                fees: z.number().optional().default(0).describe('轉貸相關費用 (違約金+手續費)'),
            }),
        }),
        execute: async (args: any) => {
            return calculateRefinance(
                args.currentLoan.balance,
                args.currentLoan.rate,
                args.currentLoan.remainingYears,
                args.newLoan.rate,
                args.newLoan.years,
                args.newLoan.fees
            );
        },
    } as any),

    calculateEarlyRepayment: tool({
        description: '提前還款試算。分析提前還本金可以省多少利息、縮短多少年限。',
        parameters: z.object({
            currentBalance: z.number().describe('目前剩餘本金'),
            rate: z.number().describe('年利率 (%)'),
            remainingYears: z.number().describe('剩餘年限'),
            extraPayment: z.number().describe('提前還款金額'),
            isMonthly: z.boolean().optional().default(false).describe('是否為每月固定多還 (預設為單筆)'),
        }),
        execute: async (args: any) => {
            return calculateEarlyRepayment(
                args.currentBalance,
                args.rate,
                args.remainingYears,
                args.extraPayment,
                args.isMonthly
            );
        },
    } as any),
};

