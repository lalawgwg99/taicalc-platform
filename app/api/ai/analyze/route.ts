import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt, context } = await req.json();

  const systemInstruction = `
    你現在是 "TaiCalc 數策" 的首席財務顧問 AI。你的任務是分析使用者的財務數據，並提供具體、可執行的戰略建議。
    
    ## 風格指引
    - **極簡專業**：不要廢話，直接切入重點。
    - **戰略視角**：不要只解釋數字（使用者已經看得到圖表），要解釋數字背後的「意義」與「機會」。
    - **行動導向**：每一個建議都要包含一個具體的行動 (Call to Action)。
    - **語氣**：理性、客觀、帶有前瞻性。
    
    ## 輸出格式
    - 使用 Markdown。
    - 善用 **粗體** 強調關鍵數字。
    - 嚴格控制長度，回答請在 300 字以內。
  `;

  // Combine user prompt with standardized context
  const fullPrompt = `
    ${prompt}
    
    [財務數據背景]
    ${JSON.stringify(context, null, 2)}
  `;

  const result = await streamText({
    model: google('gemini-1.5-flash'), // 使用 1.5-flash，速度快且成本低
    system: systemInstruction,
    prompt: fullPrompt,
  });

  return result.toTextStreamResponse();
}
