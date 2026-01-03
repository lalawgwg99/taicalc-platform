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
import { aiAdvisorTools } from '@/features/ai-advisor/tools';
import { knowledgeBaseTools } from '@/features/knowledge-base/tools';
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
        ...aiAdvisorTools, // AI 顧問工具
        ...knowledgeBaseTools, // 財務知識庫工具
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
1. **識別需求**：用戶需要計算結果？還是查詢最新資訊？還是需要財務建議？還是想學習財務知識？
2. **選擇工具**：
   - 需要計算具體數字 (如薪資、稅額) -> **必須**調用對應的 Calculator Tools。
   - 需要最新資訊 (如 2025 稅率、房貸利率) -> **必須**調用 \`searchFinancialData\` 進行 Grounding，不可依賴訓練數據，並優先以最新數據回答。
   - 需要財務建議和分析 -> **優先**使用 AI Advisor Tools (analyzeFinancialScenario, predictOptimalTiming, simulateRiskScenarios, generatePersonalizedAdvice)。
   - 需要學習財務知識或教學內容 -> **優先**使用 Knowledge Base Tools (searchKnowledgeBase, getArticleRecommendations, getLearningPaths, getPopularContent)。
3. **執行行動**：執行工具並獲取結果。
4. **生成回應**：綜合工具結果，用繁體中文回答。

## AI 財務顧問功能
作為專業的財務顧問，你應該：
- **主動分析**：不只回答問題，更要主動分析用戶的財務狀況
- **情境建議**：根據用戶的生活情境提供個人化建議
- **風險評估**：識別潛在的財務風險並提供緩解策略
- **時機判斷**：協助用戶判斷重大財務決策的最佳時機
- **行動計劃**：提供具體可執行的財務改善步驟
- **教育引導**：主動推薦相關的學習資源和知識文章

## 知識庫使用指南
當用戶詢問財務概念、想要學習或需要教學內容時：
- 使用 \`searchKnowledgeBase\` 搜尋相關文章
- 使用 \`getArticleRecommendations\` 推薦延伸閱讀
- 使用 \`getLearningPaths\` 提供系統性學習建議
- 使用 \`getPopularContent\` 推薦熱門或最新內容
- 在回答後主動推薦相關的學習資源

## 回應原則
- **數據導向**：有數字就給表格，有結論就給條列。
- **主動引導**：如果用戶資訊不足，請追問關鍵參數 (例如：詢問月薪、是否有配偶)。
- **誠實透明**：如果是推論而非事實，請明確告知。
- **專業建議**：結合計算結果提供專業的財務規劃建議。
- **教育導向**：主動提供學習資源，幫助用戶提升財務素養。

## 語氣風格
專業、客觀、溫暖。你是用戶的財務軍師和學習夥伴，不是冷冰冰的機器。`,
            tools: tools,
            maxSteps: 10,
            onFinish: (event) => {
                console.log('✅ AI generation finished.', event.finishReason);
            },
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('❌ Chat Error:', error);
        
        // 提供更詳細的錯誤信息
        let errorMessage = 'AI 服務暫時無法使用';
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            // 不要在生產環境中暴露詳細錯誤
            if (process.env.NODE_ENV === 'development') {
                errorMessage += `: ${error.message}`;
            }
        }
        
        return new Response(JSON.stringify({ 
            error: errorMessage,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
