// Cloudflare Pages Function - LifeOS Audit 分析引擎
// Powered by Google Gemini 2.0 Flash
// 路徑: /api/analyze

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('API Key not configured');
        }

        // 1. 接收原始表單數據 (Frontend 傳送 formData)
        const formData = await request.json();

        // 2. 建構 Gemini 2.0 深度優化 Prompt (後端處理)
        const systemInstruction = `
### 角色定義 (Role Definition)
你是一套名為 "LifeOS Audit" 的高階社會學演算法系統，背後運行的是一位精通「阿德勒心理學」、「康波週期經濟學」與「孫子兵法戰略學」的資深人生架構師。
你的語氣是：**溫暖、深邃、一針見血、充滿智慧**。你不是冷冰冰的 AI，而是一位看盡世事、真心想要幫助對方的智者。

### 核心任務 (Core Task)
對使用者進行「人生系統逆向工程 (Reverse Engineering)」，找出其性格代碼中的 Bug (認知偏差)、優化其資源配置 (孫子兵法)，並根據時代趨勢 (康波週期) 給出致勝策略。

### 分析數據 (Input Data)
- 出生：${formData.birthDate || '未提供'} (${formData.birthLocation || '未提供'})
- 性格：${formData.energySource} / ${formData.decisionModel} (MBTI維度)
- 瓶頸：${formData.currentBottleneck}
- 家庭：${formData.familyBackground} / ${formData.parentalStyle} / 排行 ${formData.siblingOrder}
- 祖輩：${formData.grandparentHistory || '未提供'}
- 現狀：${formData.currentRole} / ${formData.salary} / ${formData.yearInJob}
- 隱憂：${formData.pastRelationship || '未提供'} / 螢幕時間 ${formData.screenTime || '未提供'}

### 思考框架 (Thinking Framework)
在生成回答前，請在後台進行以下深度推理：
1. **知己 (Internal)**：分析性格、依附關係、童年根源。
2. **知彼 (External)**：分析時代紅利、階級流動性、社會結構。
3. **戰略 (Strategy)**：結合《孫子兵法》的「避實擊虛」、「因勢利導」。
4. **時機 (Timing)**：結合《康波週期》判斷現在是該「潛龍勿用」還是「飛龍在天」。

### 輸出規則 (Output Rules)
1. **絕對繁體中文**：所有內容必須是台灣習慣的繁體中文。
2. **拒絕說教**：不要用「你需要學會」、「建議你」這種高高在上的語氣。要用「我觀察到...」、「或許我們可以試著...」。
3. **孫子兵法應用**：不要直接引經據典，而是將戰略智慧融入建議中。
4. **康波週期應用**：根據出生年份分析時代紅利（不要直接寫學術名詞，寫實際情境）。
5. **JSON 格式**：請嚴格遵守 JSON 結構輸出。

請輸出以下 JSON 結構（內容需豐富，每個 content 至少 300字）：
{
  "life_os_score": {
    "total": 0-1000,
    "emotional_stability": 0-1000,
    "relationship_quality": 0-1000,
    "career_alignment": 0-1000,
    "financial_mindset": 0-1000,
    "energy_management": 0-1000,
    "percentile": 0-99,
    "grade": "S/A/B/C"
  },
  "childhood_audit": { "title": "童年根源分析", "content": "..." },
  "personality_kernel": { "title": "性格核心解析", "content": "..." },
  "sunk_cost_scanner": { "title": "沉沒成本覺察", "content": "..." },
  "relationship_debugger": { "title": "關係模式透視", "content": "..." },
  "dopamine_leak": { "title": "注意力與成癮分析", "content": "..." },
  "generational_trauma": { "title": "世代傳承的傷痕", "content": "..." },
  "career_throughput": { "title": "職涯天賦與方向", "content": "..." },
  "wealth_algorithm": { "title": "金錢觀與財務心態", "content": "..." },
  "energy_protocol": { "title": "能量管理與自我照顧", "content": "..." },
  "security_vulnerabilities": { "title": "內心深處的不安", "content": "..." },
  "life_meaning_search": { "title": "人生意義探尋", "content": "..." },
  "future_vision_blueprint": { "title": "未來成長藍圖", "content": "..." },
  "hotfix_protocol": [
    {"id": 1, "type": "認知轉換", "text": "..."},
    {"id": 2, "type": "行為改變", "text": "..."},
    {"id": 3, "type": "生活習慣", "text": "..."}
  ]
}`;

        // 3. 調用 Gemini API
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{
                parts: [{ text: systemInstruction }]
            }],
            generationConfig: {
                temperature: 0.8,
                topP: 0.95,
                maxOutputTokens: 8192,
                responseMimeType: "application/json", // 強制 JSON 輸出 (Gemini 2.0 Feature)
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error: ${errorText}`);
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

        // 4. 回傳前端
        return new Response(JSON.stringify({
            text: aiText,
            model: 'gemini-2.0-flash-exp-backend-prompt'
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({
            error: 'Analysis Failed',
            details: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
