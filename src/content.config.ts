
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const toolsCollection = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string().default('工具'),
        order: z.number().optional(),
        icon: z.string().optional(),
    }),
});

const blogCollection = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
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
