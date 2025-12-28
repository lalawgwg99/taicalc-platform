/**
 * TaiCalc AI Chat API
 * 讓 AI 自動調用 Skill 系統
 */

import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { skillRegistry } from '@/lib/skills';
import { z } from 'zod';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    // 動態將 Registry 中的 Skill 轉為 AI Tools
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tools: Record<string, any> = {};
    const allSkills = skillRegistry.getAll();

    allSkills.forEach((skill) => {
        const toolName = skill.id.replace(/\./g, '_');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools[toolName] = tool({
            description: `[${skill.name}] ${skill.description}`,
            parameters: skill.inputSchema,
            execute: async (input: any) => {
                try {
                    const result = await skill.execute(input);
                    return { success: true, data: result, _skillId: skill.id };
                } catch (error) {
                    return { success: false, error: String(error) };
                }
            },
        } as any);
    });

    try {
        // 使用 Gemini 模型
        const result = await generateText({
            model: google('gemini-2.5-flash'),
            messages,
            system: `你是 TaiCalc 的首席財務顧問「數策」。

你的任務是協助用戶解決財務問題，並根據情況「主動調用」工具進行計算。

規則：
1. 如果用戶提供數據，請務必使用對應的工具計算，不要自己憑空估算。
2. 工具回傳的結果中若包含數據，請以表格或清單格式呈現。
3. 回答請保持專業、簡潔，使用繁體中文。
4. 金額請使用千分位格式，例如 $1,234,567。

可用工具：薪資分析、稅務計算、房貸試算、資本規劃等。`,
            tools: tools,
        });

        return new Response(result.text, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    } catch (error) {
        console.error('[Chat API Error]', error);
        return new Response(
            JSON.stringify({ error: '處理失敗' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
