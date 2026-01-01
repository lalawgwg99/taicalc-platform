/**
 * TaiCalc Fortune AI API
 * 財運命盤 AI 分析端點
 */
import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 30;

interface FortuneProfile {
    name?: string;
    birthDate: string;
    birthTime: string;
    gender: 'male' | 'female';
    system: 'ziwei' | 'bazi' | 'western';
    salary?: number;
    retirementAge?: number;
}

interface FortuneRequest {
    action: 'generateChart' | 'consult' | 'financeFortune';
    profile: FortuneProfile;
    age?: number;
    luckScore?: number;
    language?: string;
    userQuestion?: string;
    stream?: boolean;
}

export async function POST(req: Request) {
    try {
        const body: FortuneRequest = await req.json();
        const { action, profile, age, luckScore, language = 'zh-TW', userQuestion, stream = true } = body;

        // Validate required params
        if (!action || !profile) {
            return new Response(
                JSON.stringify({ error: '缺少必要參數' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: '服務設定錯誤' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const systemName =
            profile.system === 'bazi'
                ? '八字 (四柱推命)'
                : profile.system === 'western'
                    ? '西洋占星'
                    : '紫微斗數';

        let systemInstruction = '';
        let prompt = '';

        switch (action) {
            case 'generateChart':
                systemInstruction = `你是五老星命理分析系統。根據用戶出生資料，使用 ${systemName} 系統進行命盤分析。輸出必須為有效 JSON 格式。`;
                prompt = `分析此人的命盤：
性別：${profile.gender === 'male' ? '男' : '女'}
生日：${profile.birthDate}
時辰：${profile.birthTime}
系統：${systemName}

輸出 JSON 格式：
{
  "summary": { "mainStar": "...", "element": "...", "description": "..." },
  "river": [{ "age": 0, "luckScore": 50, "event": "..." }, ...]
}`;
                break;

            case 'consult':
                systemInstruction = `你是五老星議會。用威嚴但實用的語氣回答命理問題。`;
                prompt = `用戶資料：${profile.name || '無名氏'}，${age || '未知'}歲，運勢分數 ${luckScore || 50}/100。
${userQuestion ? `問題：「${userQuestion}」` : '請給出整體運勢建議。'}

語言：${language}`;
                break;

            case 'financeFortune':
                systemInstruction = `你是 TaiCalc 數策的財運命理顧問。結合命理分析與實用理財建議。使用繁體中文。`;
                prompt = `用戶資料：
- 姓名：${profile.name || '未提供'}
- 生日：${profile.birthDate}
- 時辰：${profile.birthTime}
- 性別：${profile.gender === 'male' ? '男' : '女'}
- 命理系統：${systemName}
${profile.salary ? `- 月薪：${profile.salary} 元` : ''}
${profile.retirementAge ? `- 目標退休年齡：${profile.retirementAge} 歲` : ''}

請分析：
1. 財帛宮/財運主星分析
2. 2025 年財運走勢
3. 適合的理財方式
4. 投資風險提醒
5. 3 個具體理財建議`;
                break;

            default:
                return new Response(
                    JSON.stringify({ error: '未知操作類型' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
        }

        const model = google('gemini-2.0-flash');

        if (stream) {
            const result = streamText({
                model,
                system: systemInstruction,
                prompt,
            });
            return result.toTextStreamResponse();
        } else {
            const result = await generateText({
                model,
                system: systemInstruction,
                prompt,
            });
            return new Response(
                JSON.stringify({ result: result.text }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error('[Fortune API Error]', error);
        return new Response(
            JSON.stringify({ error: 'AI 服務發生錯誤' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
