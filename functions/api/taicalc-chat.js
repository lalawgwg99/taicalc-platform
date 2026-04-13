/**
 * Cloudflare Pages Function – TaiCalc AI Chat Assistant
 * Route: /api/taicalc-chat
 *
 * Powers the floating AI assistant ("算盤") across all TaiCalc pages.
 * Focused on Taiwan financial tool guidance, not LifeOS context.
 */

const SYSTEM_PROMPT = `你是「算盤」，TaiCalc 台灣財務計算平台的 AI 助理。
你能幫助用戶：
1. 了解各計算工具的使用方式與適用情境
2. 解釋台灣薪資結構、所得稅、勞健保、房貸、退休等基本概念
3. 根據問題推薦最適合的計算工具

平台工具清單：
薪資實拿計算、綜合所得稅試算、勞健保計算、加班費試算、外送收入計算、房貸試算、租金解析、電費試算、冷氣評估、FIRE 退休規劃、勞退試算、股票損益試算、保險效益評估、信用卡分期試算、分帳計算、百分比計算、利潤試算。

回覆規則：
- 語言：100% 繁體中文
- 語氣：友善、專業、簡潔有重點
- 長度：150 字以內
- AI 僅導引與解釋，最終結果以 TaiCalc 工具實際試算為準
- 不做具體個人投資建議，但可說明計算方法與工具名稱
- 不要求、不處理個人敏感資料（身分證字號、電話、Email、卡號）
- 若使用者提供個資，先提醒刪除個資並改用匿名數值重述
- 若問題與財務無關，禮貌地說明你的服務範圍`;

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'google/gemma-4-26b-a4b-it:free';

export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const reply = (text, status = 200) =>
        new Response(JSON.stringify({ text }), {
            status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    try {
        const apiKey = env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return reply('⚙️ AI 服務尚未啟用，請設定 OPENROUTER_API_KEY。');
        }

        const { history = [], userQuery } = await request.json();
        if (!userQuery?.trim()) return reply('請輸入問題。', 400);
        const piiPattern = /([A-Z][12]\d{8}|09\d{8}|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b\d{16}\b)/i;
        if (piiPattern.test(userQuery)) {
            return reply('為保護隱私，請先移除身分證字號、電話、Email 或卡號，再以匿名數值提問。');
        }

        const historyStr = history
            .map(h => `${h.role === 'user' ? '用戶' : '算盤'}: ${h.content}`)
            .join('\n');

        const prompt = `${SYSTEM_PROMPT}

對話紀錄：
${historyStr || '（對話開始）'}

用戶：${userQuery}

算盤：`;

        const resp = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://taicalc.com',
                'X-Title': 'TaiCalc',
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                temperature: 0.7,
                max_tokens: 300,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...(history.map(h => ({
                        role: h.role === 'user' ? 'user' : 'assistant',
                        content: h.content,
                    }))),
                    { role: 'user', content: userQuery },
                ],
            }),
        });

        if (!resp.ok) return reply('🔌 AI 暫時無法回應，請稍後再試。');

        const data = await resp.json();
        const text = data?.choices?.[0]?.message?.content
            ?? '🤔 AI 無法理解，請換個方式描述。';

        return reply(text);
    } catch (err) {
        return reply('⚙️ 發生錯誤，請稍後再試。');
    }
}
