// Cloudflare Pages Function - API 健康檢查
// 路徑: /api/health
// 用於驗證 API Key 是否正確配置

export async function onRequestGet(context) {
    const { env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            message: 'GEMINI_API_KEY 環境變數未設定',
            instructions: '請到 Cloudflare Pages → Settings → Environment variables 新增 GEMINI_API_KEY'
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // 嘗試調用 Gemini API 進行簡單測試
    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: '回覆「OK」' }] }],
                generationConfig: { maxOutputTokens: 10 }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(JSON.stringify({
                status: 'ERROR',
                message: 'Gemini API 連線失敗',
                details: errorText,
                apiKeyConfigured: true
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return new Response(JSON.stringify({
            status: 'OK',
            message: 'API 連線正常',
            geminiResponse: text,
            apiKeyConfigured: true,
            model: 'gemini-2.0-flash-exp'
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            message: '連線測試失敗',
            details: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
