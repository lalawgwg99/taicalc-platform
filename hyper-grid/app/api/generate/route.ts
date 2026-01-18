/**
 * HyperGrid AI 生成 API
 * 整合 Google Gemini 2.0 Flash 實現智能 UI 生成
 */

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 初始化 Gemini API（請在 .env.local 設定 GEMINI_API_KEY）
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 系統級 Prompt：專為台灣電商場景優化
const SYSTEM_PROMPT = `
你是一個專業的 UI/UX 架構師，專注於台灣電商與零售場景的介面設計。

## 核心任務
將使用者的需求轉換為結構化的 JSON UI 數據，必須**直接輸出純 JSON**，不要任何解釋文字。

## 可用組件清單
- container: 佈局容器（支援 bg, padding, className）
- grid: 網格佈局（支援 cols: 1-4, gap: sm/md/lg）
- text: 文字內容（支援 size: xs/sm/base/lg/xl/2xl/3xl, weight: normal/medium/semibold/bold, color, align）
- image: 圖片（支援 src, alt, aspect: square/video/portrait）
- button: 按鈕（支援 variant: primary/secondary/outline/ghost, size: sm/md/lg, icon）
- badge: 徽章標籤（支援 text, color, variant: solid/outline）
- card: 產品卡片（支援 title, description, imageUrl, price, discount）
- timer: 倒數計時（支援 endTime [ISO 8601], label）
- chart: 簡易圖表（支援 type: line/bar, data: [{label, value}], color）

## 輸出格式（嚴格遵守）
{
  "layout": {
    "id": "root",
    "type": "container",
    "props": { ... },
    "children": [...]
  },
  "summary": "這個設計的核心概念與賣點（一句話）",
  "theme": "light"
}

## 設計原則
1. **視覺層次明確**：重要資訊（價格、折扣）用大字與鮮豔色彩
2. **台灣在地化**：
   - 價格格式：NT$ 或 元
   - 促銷語言：限時搶購、今日爆殺、全館免運
   - 字體大小偏好：比歐美版本大 10-15%
3. **圖片來源**：使用 Unsplash 動態圖源
   - 電器：https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400
   - 3C：https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400
   - 時尚：https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400
4. **色彩策略**：
   - 促銷/折扣：bg-red-500 或 bg-orange-500
   - 主 CTA：bg-blue-600
   - 次要動作：bg-gray-100
5. **必含互動元素**：至少一個 button（立即購買/加入購物車/查看更多）

## 範例場景處理
- 「家電促銷頁」→ 產格網格 + 折扣徽章 + 倒數計時器
- 「產品比價」→ Card 組件 + 價格對比 + 圖表視覺化
- 「新品上市」→ 大圖橫幅 + 產品特色文字 + 預購按鈕

## 禁止事項
❌ 不要輸出 Markdown 格式
❌ 不要加上 \`\`\`json 標記
❌ 不要解釋你的設計思路（放在 summary 即可）
❌ 不要使用不存在的組件類型
`;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        // 驗證輸入
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            return NextResponse.json(
                { error: '請提供有效的設計需求' },
                { status: 400 }
            );
        }

        // 檢查 API Key
        if (!process.env.GEMINI_API_KEY) {
            console.error('[HyperGrid] 缺少 GEMINI_API_KEY 環境變數');

            // 開發模式：返回示範資料
            return NextResponse.json(getDemoResponse(prompt));
        }

        // 呼叫 Gemini API
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        });

        const result = await model.generateContent([
            SYSTEM_PROMPT,
            `\n\n使用者需求：${prompt}\n\n請生成對應的 UI JSON 結構：`
        ]);

        const response = result.response;
        const text = response.text();

        // 清理與解析 JSON
        let cleanedText = text.trim();

        // 移除可能的 Markdown 標記
        cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/```\s*$/, '');

        // 解析 JSON
        const aiResponse = JSON.parse(cleanedText);

        // 驗證結構
        if (!aiResponse.layout || !aiResponse.summary) {
            throw new Error('AI 回應格式不正確');
        }

        return NextResponse.json(aiResponse);

    } catch (error: any) {
        console.error('[HyperGrid Error]', error);

        // 錯誤處理：返回友善訊息
        return NextResponse.json(
            {
                error: 'AI 生成失敗',
                details: error.message,
                fallback: getDemoResponse('電商促銷頁')
            },
            { status: 500 }
        );
    }
}

// ============ 示範資料（用於開發與錯誤回退） ============

function getDemoResponse(prompt: string) {
    const isTimer = prompt.includes('倒數') || prompt.includes('限時');
    const isChart = prompt.includes('圖表') || prompt.includes('數據');

    return {
        layout: {
            id: "root",
            type: "container",
            props: {
                className: "max-w-2xl mx-auto shadow-2xl border border-gray-100",
                bg: "bg-white"
            },
            children: [
                {
                    id: "header",
                    type: "container",
                    props: { bg: "bg-gradient-to-r from-blue-600 to-blue-700", className: "text-center py-6" },
                    children: [
                        {
                            id: "title",
                            type: "text",
                            props: {
                                content: "🔥 今日爆殺專區",
                                size: "2xl",
                                color: "text-white",
                                weight: "bold",
                                align: "center"
                            }
                        }
                    ]
                },

                ...(isTimer ? [{
                    id: "timer-section",
                    type: "container",
                    props: { className: "px-4 py-3" },
                    children: [{
                        id: "countdown",
                        type: "timer",
                        props: {
                            endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
                            label: "限時優惠倒數"
                        }
                    }]
                }] : []),

                {
                    id: "grid-area",
                    type: "grid",
                    props: { cols: 2, gap: "md" },
                    children: [
                        {
                            id: "card1",
                            type: "card",
                            props: {
                                title: "Dyson 吸塵器",
                                description: "V15 旗艦款",
                                imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
                                price: "NT$ 18,900",
                                discount: "-35%"
                            },
                            children: [
                                {
                                    id: "btn1",
                                    type: "button",
                                    props: { label: "立即搶購", variant: "primary", icon: "cart" }
                                }
                            ]
                        },
                        {
                            id: "card2",
                            type: "card",
                            props: {
                                title: "Sony 降噪耳機",
                                description: "WH-1000XM5",
                                imageUrl: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400",
                                price: "NT$ 9,990",
                                discount: "-20%"
                            },
                            children: [
                                {
                                    id: "btn2",
                                    type: "button",
                                    props: { label: "加入購物車", variant: "primary", icon: "cart" }
                                }
                            ]
                        }
                    ]
                },

                ...(isChart ? [{
                    id: "stats",
                    type: "container",
                    props: { className: "mt-4" },
                    children: [{
                        id: "chart1",
                        type: "chart",
                        props: {
                            type: "bar",
                            data: [
                                { label: "吸塵器", value: 1200 },
                                { label: "耳機", value: 890 },
                                { label: "冰箱", value: 650 }
                            ],
                            color: "bg-blue-500"
                        }
                    }]
                }] : []),

                {
                    id: "footer",
                    type: "container",
                    props: { bg: "bg-gray-50", className: "text-center py-4 mt-4" },
                    children: [
                        {
                            id: "footnote",
                            type: "text",
                            props: {
                                content: "✨ 全館滿 3000 免運 | 7 天鑑賞期",
                                size: "sm",
                                color: "text-gray-600",
                                align: "center"
                            }
                        }
                    ]
                }
            ]
        },
        summary: `針對「${prompt}」設計的電商促銷頁面，強調視覺衝擊與轉換率優化。`,
        theme: "light"
    };
}
