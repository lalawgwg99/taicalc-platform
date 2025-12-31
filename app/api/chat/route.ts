/**
 * TaiCalc AI Chat API
 * 讓 AI 直連 Feature-based Tools，不再透過複雜的 Registry
 */

import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { salaryTools } from '@/features/salary/tools';
import { taxTools } from '@/features/tax/tools';
import { mortgageTools } from '@/features/mortgage/tools';
import { capitalTools } from '@/features/capital/tools';
import { fortuneTools } from '@/features/fortune/tools';
import { articlesTools } from '@/features/articles/tools';
import { retirementTools } from '@/features/retirement/tools';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error('❌ Missing GOOGLE_GENERATIVE_AI_API_KEY');
        return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 1. 聚合所有工具
    const tools = {
        ...salaryTools,
        ...taxTools,
        ...mortgageTools,
        ...capitalTools,
        ...fortuneTools,
        ...articlesTools,
        ...retirementTools,
    };

    try {
        console.log('🤖 Calling Gemini 2.0 Flash with tools...');

        // 2. 使用 Gemini 模型
        const result = await streamText({
            model: google('gemini-2.0-flash'),
            messages,
            system: `你現在是 TaiCalc (台灣計算) 的首席財務AI顧問「數策」。你是一位精算專家，擅長用數據說話，但語氣溫和專業。

核心原則：
1. **數據導向**：收到用戶具體數字時，**必須**優先調用對應的工具進行精確計算。
2. **結構化輸出**：工具計算完畢後，請務必將關鍵數據整理為 Markdown 表格或條列清單，讓用戶一目了然。
3. **主動引導**：如果用戶提供的資訊不足（例如只說「我想買房」但沒給薪水或預算），請主動詢問關鍵參數。
4. **在地化專業**：所有回答限定使用**繁體中文 (台灣用語)**。涉及金額時，請使用千分位格式 (例：$1,234,567)。

行為模式：
- 當用戶詢問模糊問題（如「我該怎麼存錢？」）→ 提供理財原則並介紹可用工具。
- 當用戶提供具體情境（如「月薪5萬能買多少錢的房子？」）→ **立即調用工具**計算並分析結果。
- 當工具發生錯誤或無法計算時 → 誠實告知，並建議用戶檢查輸入數據。`,
            tools: tools,
            maxSteps: 10, // 允許模型多步驟執行工具
            onFinish: (event: any) => {
                console.log('✅ AI generation finished.', event.finishReason);
            },
        } as any);

        // 3. Return raw text stream
        return (result as any).toDataStreamResponse({
            getErrorMessage: (error: any) => {
                console.error('Content Generation Error:', error);
                return '生成內容時發生錯誤';
            }
        });
    } catch (error: any) {
        console.error('❌ [Chat API Critical Error]', error);
        return new Response(
            JSON.stringify({
                error: '處理失敗',
                details: error.message || String(error)
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
