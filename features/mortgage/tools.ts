import { z } from 'zod';

export const mortgageTools = {
    calculateMortgage: {
        description: '試算房貸月付金。',
        parameters: z.object({
            totalLoan: z.number().describe('貸款總額'),
            rate: z.number().describe('年利率 (%)'),
            years: z.number().describe('貸款年限'),
        }),
        execute: async ({ totalLoan, rate, years }: { totalLoan: number, rate: number, years: number }) => {
            const r = rate / 100 / 12;
            const n = years * 12;
            const monthlyPayment = Math.round(totalLoan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
            return {
                summary: `每月應繳：$${monthlyPayment.toLocaleString()}`,
                details: [`總利息：$${(monthlyPayment * n - totalLoan).toLocaleString()}`]
            };
        },
    },
};
