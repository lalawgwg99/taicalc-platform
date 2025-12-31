import { tool } from 'ai';
import { z } from 'zod';
import { generateArticleTemplate, getTrendingTopics } from './logic';

export const articlesTools = {
    generateArticle: tool({
        description: '生成理財文章模板。當用戶要求寫一篇關於某主題的文章時使用。',
        parameters: z.object({
            topic: z.string().describe('文章主題'),
            category: z.enum(['salary', 'tax', 'mortgage', 'investment', 'retirement', 'insurance', 'trend']).describe('文章分類'),
            keywords: z.array(z.string()).optional().describe('SEO 關鍵字'),
            targetLength: z.enum(['short', 'medium', 'long']).optional().default('medium'),
        }),
        execute: async (args: any) => {
            return generateArticleTemplate({
                topic: args.topic,
                category: args.category as any,
                keywords: args.keywords,
                targetLength: args.targetLength as any,
            });
        },
    } as any),

    getTrendingTopics: tool({
        description: '取得熱門理財話題。',
        parameters: z.object({
            category: z.enum(['all', 'salary', 'tax', 'mortgage', 'investment']).optional().default('all'),
            limit: z.number().optional().default(5),
        }),
        execute: async (args: any) => {
            return getTrendingTopics(args.category, args.limit);
        },
    } as any),
};
