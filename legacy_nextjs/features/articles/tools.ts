import { z } from 'zod';

export const articlesTools = {
    searchArticles: {
        description: '搜尋站內理財文章',
        parameters: z.object({ keyword: z.string() }),
        execute: async () => ({ summary: '建議閱讀：2025 報稅全攻略' }),
    },
};
