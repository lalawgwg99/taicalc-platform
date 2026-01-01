/**
 * TaiCalc Article Generation API
 * 文章生成端點
 */
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 30;

interface ArticleRequest {
    topic: string;
    keywords?: string[];
    category: string;
    targetLength?: 'short' | 'medium' | 'long';
    style?: 'educational' | 'news' | 'analysis' | 'guide';
    useAI?: boolean;
}

export async function POST(req: Request) {
    try {
        const body: ArticleRequest = await req.json();
        const {
            topic,
            keywords = [],
            category,
            targetLength = 'medium',
            style = 'educational',
            useAI = false,
        } = body;

        if (!topic || !category) {
            return new Response(
                JSON.stringify({ error: '必須提供 topic 和 category' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate template content
        const template = {
            title: `${topic} - TaiCalc 理財知識庫`,
            slug: topic.toLowerCase().replace(/\s+/g, '-'),
            category,
            keywords: keywords.length > 0 ? keywords : [topic],
            generatedAt: new Date().toISOString(),
        };

        // AI enhancement
        if (useAI) {
            const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
            if (!apiKey) {
                return new Response(
                    JSON.stringify({
                        ...template,
                        content: `# ${topic}\n\n此文章正在撰寫中...`,
                        aiEnhanced: false,
                        note: 'AI 未設定，使用模板內容',
                    }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            }

            const lengthGuide =
                targetLength === 'short' ? '500' : targetLength === 'long' ? '1500' : '1000';

            const styleGuide =
                style === 'news'
                    ? '新聞報導'
                    : style === 'analysis'
                        ? '深度分析'
                        : style === 'guide'
                            ? '實用指南'
                            : '教育科普';

            const prompt = `你是 TaiCalc 數策的財經編輯，請撰寫一篇關於「${topic}」的理財文章。

要求：
1. 使用繁體中文（台灣用語）
2. 字數約 ${lengthGuide} 字
3. 風格：${styleGuide}
4. 加入 SEO 關鍵字：${(keywords.length > 0 ? keywords : [topic]).join('、')}
5. 使用 Markdown 格式
6. 包含前言、重點整理（2-3 個小節）、注意事項、結論
7. 適時提及可使用 TaiCalc 計算器做試算

請直接輸出文章內容：`;

            try {
                const result = await generateText({
                    model: google('gemini-2.0-flash'),
                    prompt,
                });

                return new Response(
                    JSON.stringify({
                        ...template,
                        content: result.text,
                        aiEnhanced: true,
                    }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            } catch (aiError) {
                console.error('[Article AI Error]', aiError);
                return new Response(
                    JSON.stringify({
                        ...template,
                        content: `# ${topic}\n\n此文章正在撰寫中...`,
                        aiEnhanced: false,
                        note: 'AI 生成失敗，使用模板內容',
                    }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        return new Response(
            JSON.stringify({
                ...template,
                content: `# ${topic}\n\n此文章正在撰寫中...`,
                aiEnhanced: false,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('[Article Generation Error]', error);
        return new Response(
            JSON.stringify({ error: '文章生成失敗' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
