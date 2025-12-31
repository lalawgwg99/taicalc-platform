// Set the runtime to edge for best performance
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  return new Response(JSON.stringify({
    status: "API Route is Alive",
    env_detected: !!apiKey,
    message: apiKey ? "Key detected successfully" : "Warning: Key NOT detected"
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// 輸入大小限制
const MAX_PROMPT_SIZE = 10000;
const MAX_CONTEXT_SIZE = 50000;

export async function POST(req: Request) {
  try {
    const { google } = await import('@ai-sdk/google');
    const { streamText } = await import('ai');

    const { prompt, context } = await req.json();

    // 1. 安全性檢查：輸入驗證
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid prompt format' }), { status: 400 });
    }

    if (prompt.length > MAX_PROMPT_SIZE) {
      return new Response(JSON.stringify({ error: 'Prompt too long' }), { status: 400 });
    }

    if (context && JSON.stringify(context).length > MAX_CONTEXT_SIZE) {
      return new Response(JSON.stringify({ error: 'Context too large' }), { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      console.error('API Key missing');
      return new Response(JSON.stringify({
        error: 'Service configuration error' // 不暴露具體是缺 Key
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemInstruction = `
      你現在是 "TaiCalc 數策" 的首席財務顧問 AI。你的任務是分析使用者的財務數據，並提供具體、可執行的戰略建議。
      
      ## 風格指引
      - **極簡專業**：不要廢話，直接切入重點。
      - **戰略視角**：要解釋數字背後的「意義」與「機會」。
      - **行動導向**：每一個建議都要包含一個具體的行動。

      ## 輸出格式
      - 使用 Markdown。回答請在 300 字以內。
    `;

    const fullPrompt = `
      ${prompt}

      [財務數據背景]
      ${JSON.stringify(context, null, 2)}
    `;

    const result = await streamText({
      model: google('gemini-2.0-flash-exp'),
      system: systemInstruction,
      prompt: fullPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return new Response(JSON.stringify({
      error: 'AI 服務發生錯誤', // 模糊化錯誤訊息
      // details: error.message // 移除詳細錯誤資訊以防洩漏
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
