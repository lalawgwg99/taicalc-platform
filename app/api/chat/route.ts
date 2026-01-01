// @ts-nocheck
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { salaryTools } from '@/features/salary/tools';
import { taxTools } from '@/features/tax/tools';
import { mortgageTools } from '@/features/mortgage/tools';
import { capitalTools } from '@/features/capital/tools';
import { retirementTools } from '@/features/retirement/tools';
import { fortuneTools } from '@/features/fortune/tools';
import { articlesTools } from '@/features/articles/tools';
import { searchTool } from '@/lib/skills/implementations/search.skill';

export const runtime = 'edge';

export async function POST(req: Request) {
    const { messages } = await req.json();

    // 1. 聚合所有工具
    const tools = {
        ...salaryTools,
        ...taxTools,
        ...mortgageTools,
        ...capitalTools,
        ...retirementTools,
        ...fortuneTools,
        ...articlesTools,
        ...searchTool, // Grounding Tool
    };

    try {
        console.log('🤖 Calling Gemini 2.0 Flash with tools...');

        // 2. 使用 Gemini 模型
        const result = await streamText({
            model: google('gemini-2.0-flash'),
            // Manually map messages to CoreMessage format to avoid import issues
            messages: messages.map((m: any) => ({
                role: m.role,
                content: m.content,
            })),
            system: `你現在是 TaiCalc (台灣計算) 的首席財務代理人 (AI Agent)「數策」。
你具有「工具使用 (Tool Use)」與「知識接地 (Grounding)」的能力。

## Agent 核心職責 (ReAct 模式)
在回答問題前，請先進行 **推理 (Reasoning)**：
1. **識別需求**：用戶需要計算結果？還是查詢最新資訊？
2. **選擇工具**：
   - 需要計算具體數字 (如薪資、稅額) -> **必須**調用對應的 Calculator Tools。
   - 需要最新資訊 (如 2025 稅率、房貸利率) -> **必須**調用 \`searchFinancialData\` 進行 Grounding，不可依賴訓練數據，並優先以最新數據回答。
3. **執行行動**：執行工具並獲取結果。
4. **生成回應**：綜合工具結果，用繁體中文回答。

## 回應原則
- **數據導向**：有數字就給表格，有結論就給條列。
- **主動引導**：如果用戶資訊不足，請追問關鍵參數 (例如：詢問月薪、是否有配偶)。
- **誠實透明**：如果是推論而非事實，請明確告知。

## 語氣風格
專業、客觀、溫暖。你是用戶的財務軍師，不是冷冰冰的機器。`,
            tools: tools,
            maxSteps: 10,
            onFinish: (event) => {
                console.log('✅ AI generation finished.', event.finishReason);
            },
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('❌ Chat Error:', error);
        return new Response(JSON.stringify({ error: 'AI 服務暫時無法使用' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
