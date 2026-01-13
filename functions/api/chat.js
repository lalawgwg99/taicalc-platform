// Cloudflare Pages Function - AI 聊天 API
// 路徑: /api/chat

export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const apiKey = env.GEMINI_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({
                error: 'API Key not configured',
                text: '[系統錯誤] API 金鑰未設定。請在 Cloudflare Pages 環境變數中設定 GEMINI_API_KEY。'
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 接收前端發送的 history, userQuery, userContext
        const requestData = await request.json();
        const { history, userQuery, userContext } = requestData;

        // 構建 Chat Prompt
        const historyStr = history ? history.map(h => `${h.role}: ${h.content}`).join('\n') : '';
        const contextStr = userContext ? JSON.stringify(userContext) : '{}';

        const prompt = `
你是 LifeOS Audit 的系統 AI 助手，代號「系統核心」。
你的任務是回答用戶關於其人生分析報告的問題，並提供進一步的指導。

角色設定：
- 語氣：專業但溫暖，像一位智慧的導師
- 格式：純文字回覆，可以使用 emoji
- 語言：100% 繁體中文

用戶上下文（分析報告）：
${contextStr}

對話歷史：
${historyStr}

用戶當前問題：
${userQuery}

請給予簡潔但有深度的回覆（200字以內）：`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(JSON.stringify({
                error: 'AI API Error',
                details: errorText,
                text: `[系統錯誤] AI 回應失敗: ${errorText}`
            }), {
                status: response.status,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[系統錯誤] AI 回應為空';

        return new Response(JSON.stringify({
            text: aiText
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Internal Server Error',
            message: error.message,
            text: `[系統錯誤] ${error.message}`
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
