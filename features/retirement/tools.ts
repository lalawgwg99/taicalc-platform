import { z } from 'zod';

export const retirementTools = {
    calculateRetirement: {
        description: '退休金試算。',
        parameters: z.object({
            currentAge: z.number(),
            retireAge: z.number(),
            currentSavings: z.number(),
        }),
        execute: async () => {
            return { summary: '退休試算功能建設中，請諮詢專業顧問。' };
        },
    },
};
