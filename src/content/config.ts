
import { defineCollection, z } from 'astro:content';

const toolsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string().default('工具'),
        order: z.number().optional(),
        icon: z.string().optional(),
    }),
});

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        excerpt: z.string(),
        date: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        coverImage: z.string().optional(),
        author: z.string().default('TaiCalc 編輯部'),
    }),
});

export const collections = {
    'tools': toolsCollection,
    'blog': blogCollection,
};
