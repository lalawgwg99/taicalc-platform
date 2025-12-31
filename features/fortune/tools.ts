import { tool } from 'ai';
import { z } from 'zod';
import { analyzeFortuneProfile } from './logic';

export const fortuneTools = {
    calculateFortune: tool({
        description: '財運命盤分析。結合紫微、八字或星座分析個人投資屬性與財運。',
        parameters: z.object({
            name: z.string().describe('姓名'),
            birthDate: z.string().describe('出生日期 (YYYY-MM-DD)'),
            gender: z.enum(['male', 'female', 'other']).describe('性別'),
            system: z.enum(['ziwei', 'bazi', 'western']).describe('命理系統 (預設 ziwei)'),
            salary: z.number().optional().describe('月薪（選填）'),
        }),
        execute: async (args: any) => {
            return analyzeFortuneProfile({
                name: args.name,
                birthDate: args.birthDate,
                gender: args.gender,
                system: args.system || 'ziwei',
                salary: args.salary,
            });
        },
    } as any),
};
