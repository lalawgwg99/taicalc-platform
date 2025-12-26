import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json();

    // 檢查環境變數 (Debug Only)
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log('AI Request received. Has Proxy Key (Check 1):', !!apiKey);

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing API Key in Environment' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemInstruction = `
      你現在是 "TaiCalc 數策" 的首席財務顧問 AI。你的任務是分析使用者的財務數據，並提供具體、可執行的戰略建議。

      ## 風格指引
      - **極簡專業**：不要廢話，直接切入重點。
      - **戰略視角**：要解釋數字背後的「意義」與「機會」。
      - **行動導向**：每一個建議都要包含一個具體的行動 (Call to Action)。

      ## 輸出格式
      - 使用 Markdown。回答請在 300 字以內。
    `;

    const fullPrompt = `
      ${prompt}

      [財務數據背景]
      ${JSON.stringify(context, null, 2)}
    `;

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: systemInstruction,
      prompt: fullPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
