/**
 * 文章生成 API - 使用 AI 生成 SEO 優化的理財文章
 */
export const runtime = 'edge';

import { executeSkill } from '@/lib/skills';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { topic, keywords, category, targetLength, style, useAI = false } = body;

        if (!topic || !category) {
            return new Response(JSON.stringify({ error: '必須提供 topic 和 category' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 先用 Skill 生成模板
        const templateResult = await executeSkill('articles.generate', {
            topic,
            keywords: keywords || [],
            category,
            targetLength: targetLength || 'medium',
            style: style || 'educational',
        });

        if (!templateResult.success) {
            return new Response(JSON.stringify({ error: templateResult.error }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 如果要用 AI 增強內容
        if (useAI) {
            const { google } = await import('@ai-sdk/google');
            const { generateText } = await import('ai');

            const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
            if (!apiKey) {
                return new Response(JSON.stringify({
                    ...(templateResult.data as object),
                    aiEnhanced: false,
                    note: 'AI 未設定，使用模板內容',
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            const prompt = `你是 TaiCalc 數策的財經編輯，請撰寫一篇關於「${topic}」的理財文章。

要求：
1. 使用繁體中文（台灣用語）
2. 字數約 ${targetLength === 'short' ? '500' : targetLength === 'long' ? '1500' : '1000'} 字
3. 風格：${style === 'news' ? '新聞報導' : style === 'analysis' ? '深度分析' : style === 'guide' ? '實用指南' : '教育科普'}
4. 加入 SEO 關鍵字：${(keywords || [topic]).join('、')}
5. 使用 Markdown 格式
6. 包含前言、重點整理（2-3 個小節）、注意事項、結論
7. 適時提及可使用 TaiCalc 計算器做試算

請直接輸出文章內容：`;

            try {
                const result = await generateText({
                    model: google('gemini-2.5-flash'),
                    prompt,
                });

                return new Response(JSON.stringify({
                    ...(templateResult.data as object),
                    content: result.text,
                    aiEnhanced: true,
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (aiError) {
                console.error('AI generation failed:', aiError);
                return new Response(JSON.stringify({
                    ...(templateResult.data as object),
                    aiEnhanced: false,
                    note: 'AI 生成失敗，使用模板內容',
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        return new Response(JSON.stringify({
            ...(templateResult.data as object),
            aiEnhanced: false,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Article generation error:', error);
        return new Response(JSON.stringify({ error: '文章生成失敗' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// GET - 取得趨勢話題
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const category = url.searchParams.get('category') || 'all';
        const limit = parseInt(url.searchParams.get('limit') || '5', 10);

        const result = await executeSkill('articles.trending', {
            category,
            limit: Math.min(limit, 10),
        });

        if (!result.success) {
            return new Response(JSON.stringify({ error: result.error }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(result.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Trending topics error:', error);
        return new Response(JSON.stringify({ error: '取得趨勢失敗' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
