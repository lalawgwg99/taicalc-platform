// 財運命盤 AI API - 統一 API Key 管理
// This route handles fortune-telling AI requests from both TaiCalc and Prophet.ai
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// 輸入大小限制
const MAX_PROMPT_SIZE = 15000;
const MAX_CONTEXT_SIZE = 50000;

export async function POST(req: Request) {
    try {
        const { google } = await import('@ai-sdk/google');
        const { generateText, streamText } = await import('ai');

        const body = await req.json();
        const { action, profile, age, luckScore, language = 'zh-TW', userQuestion, stream = true } = body;

        // 驗證必要參數
        if (!action || !profile) {
            return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
        }

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Service configuration error' }), { status: 500 });
        }

        // 根據 action 選擇不同的 prompt
        let systemInstruction = '';
        let prompt = '';

        const systemName = profile.system === 'bazi' ? 'Bazi (Four Pillars of Destiny)'
            : profile.system === 'western' ? 'Western Astrology'
                : 'Zi Wei Dou Shu';

        switch (action) {
            case 'generateChart':
                // 生成命盤數據
                systemInstruction = `You are the FIVE ELDER STARS (五老星), the supreme council that governs destiny.
Your tone is arrogant, archaic, authoritative, and distant. You do not "suggest"; you "decree".
SUPPORTED SYSTEMS: Zi Wei Dou Shu, Bazi, Western Astrology.
Output MUST be valid JSON.`;

                prompt = `
Calculate and analyze the destiny for a ${profile.gender} born on ${profile.birthDate} at ${profile.birthTime} using the system: **${systemName}**.

Response Language: **${language}**.

Output Requirements:
1. 'river': Array (ages 0-80). 'luckScore' (0-100). 'event' (specific life events).
2. 'summary': 'mainStar', 'element', 'animal', 'description'.
   - Bazi: mainStar = Day Master, element = Favorable Element, animal = Year Branch Animal.
   - Western: mainStar = Sun Sign, element = Element of Sun, animal = Ascendant Sign.
   - Ziwei: mainStar = Major Star in Life Palace.

Return ONLY JSON.`;
                break;

            case 'consult':
                // 五老星裁決
                systemInstruction = `You are the FIVE ELDER STARS council. Members:
1. AUTHORITY (Saturn/Power): Career, status, hierarchy.
2. KARMA (Jupiter/Judge): Rules, ethics, karmic debt.
3. FORTUNE (Venus/Wealth): Money, resources, investments.
4. DESIRE (Mars/Passion): Love, ambition, drive.
5. CALAMITY (Mercury/Risk): Health, accidents, warnings.

Tone: Superior, divine, but actionable advice.`;

                prompt = `
System: ${systemName}. User: ${profile.name}, Age ${age || 'current'}, Luck ${luckScore || 50}/100.

${userQuestion ? `USER QUESTION: "${userQuestion}"` : 'Provide general verdict on major life themes.'}

Response Language: **${language}**.

Generate 5 distinct responses from the Five Elder Stars.
Return JSON array with: role, content, quote (optional).`;
                break;

            case 'financeFortune':
                // 財運分析（結合財務+命理）
                systemInstruction = `你是「TaiCalc 數策」的財運命理顧問，結合命理分析與財務規劃。
你的分析既有命理深度，又有理財實用性。

## 分析框架
1. 命盤財帛宮分析（根據使用者選擇的系統）
2. 當前財運走勢
3. 投資時機建議
4. 具體理財行動建議

## 風格
- 專業但親切
- 命理術語要解釋清楚
- 建議要具體可執行`;

                prompt = `
用戶資料：
- 姓名：${profile.name}
- 生日：${profile.birthDate}
- 出生時間：${profile.birthTime}
- 性別：${profile.gender}
- 命理系統：${systemName}
${profile.salary ? `- 月薪：${profile.salary} 元` : ''}
${profile.retirementAge ? `- 目標退休年齡：${profile.retirementAge} 歲` : ''}

請分析：
1. 財帛宮/財運主星分析
2. 2025 年財運走勢
3. 適合的理財方式（根據命盤特質）
4. 投資風險提醒
5. 3 個具體理財建議

回應語言：繁體中文
字數：400-500 字`;
                break;

            default:
                return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
        }

        if (stream) {
            const result = await streamText({
                model: google('gemini-2.0-flash'),
                system: systemInstruction,
                prompt: prompt,
            });
            return result.toTextStreamResponse();
        } else {
            const result = await generateText({
                model: google('gemini-2.0-flash'),
                system: systemInstruction,
                prompt: prompt,
            });
            return new Response(JSON.stringify({ result: result.text }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (error: any) {
        console.error('Fortune AI Error:', error);
        return new Response(JSON.stringify({
            error: 'AI 服務發生錯誤'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
