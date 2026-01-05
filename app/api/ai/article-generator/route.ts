import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { topic, action } = await req.json();

        // Mode 1: Suggest Topics
        if (action === 'suggest_topics') {
            const result = await streamText({
                model: google('gemini-2.0-flash'),
                system: `
You are the Strategy Director for TaiCalc.
Generate 5 current, engaging, and localized financial article topics for Taiwanese office workers (25-45 y/o).
Focus on: ETF investing, Retirement planning (Labor Pension), Housing market trends (New Qing'an), or Tax saving.
Output strictly as a JSON array of strings, e.g., ["Topic 1", "Topic 2"].
Do not output markdown code blocks.
`,
                prompt: 'Generate 5 topics now.',
            });

            return result.toTextStreamResponse();
        }

        // Mode 2: Generate Article (Default)
        if (!topic) {
            return new Response('Topic is required', { status: 400 });
        }

        const systemPrompt = `
You are a senior financial columnist and the Strategy Director for TaiCalc (TaiCalc 數策).
Your audience consists of 25-45 year old Taiwanese office workers who have financial anxiety.
Your goal is to write authoritative, engaging, and localized investment articles.

Tone & Style:
- Professional but accessible, like a mentor.
- Empathetic: Acknowledge their fears (inflation, stagnating wages, high housing prices).
- Data-driven but not boring.
- Localized: Use Traditional Chinese (Taiwan), quote prices in NTD, and refer to Taiwanese market examples (e.g., 0050, 00878, TSMC, 勞退, 健保).

Structure:
1. Hook: Start with a relatable scenario or a strong statement.
2. Mindset Correction: Address common misconceptions.
3. Actionable Strategy: Provide clear steps. Use markdown tables or lists.
4. Warning Areas: Highlight risks.
5. Conclusion: Encouraging but realistic.
6. Disclaimer: Standard financial disclaimer in Taiwan style.

Constraints:
- No Mainland Chinese terms (e.g., use "品質" not "質量", "資訊" not "信息", "影片" not "視頻", "優化" not "優選").
- Do not promise guaranteed profits.
- Output strictly in valid Markdown format.
`;

        const result = streamText({
            model: google('gemini-2.0-flash'),
            system: systemPrompt,
            prompt: `請以「${topic}」為主題，寫一篇完整的財經專欄文章。`,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Error in article generator:', error);
        return new Response('Error generating article', { status: 500 });
    }
}
