/**
 * Articles Logic - 知識庫文章生成邏輯
 */

export interface ArticleGenerateInput {
    topic: string;
    keywords?: string[];
    category: 'salary' | 'tax' | 'mortgage' | 'investment' | 'retirement' | 'insurance' | 'trend';
    targetLength?: 'short' | 'medium' | 'long';
}

const TAIWAN_FINANCE_TRENDS = [
    { topic: '2025 基本工資調漲', score: 95, category: 'salary', suggestedTitle: '2025 基本工資 28,590 元！勞健保級距全解析' },
    { topic: '新青安房貸', score: 90, category: 'mortgage', suggestedTitle: '新青安房貸 2025 最新規定：利率、年限、申請條件完整攻略' },
    { topic: 'ETF 配息', score: 88, category: 'investment', suggestedTitle: '0050 vs 0056：2025 年台股 ETF 配息大 PK' },
    { topic: '綜所稅申報', score: 85, category: 'tax', suggestedTitle: '2025 報稅懶人包：免稅額、扣除額一次看懂' },
    { topic: '勞退自提', score: 82, category: 'retirement', suggestedTitle: '勞退自提 6% 划算嗎？30 年複利試算給你看' },
    { topic: '股利所得稅', score: 80, category: 'tax', suggestedTitle: '股利所得稅 2025：合併計稅 vs 分離課稅怎麼選？' },
    { topic: 'FIRE 運動', score: 78, category: 'retirement', suggestedTitle: 'FIRE 財務自由：台灣版 4% 法則實戰攻略' },
    { topic: '升息房貸', score: 75, category: 'mortgage', suggestedTitle: '升息時代房貸怎麼省？固定利率 vs 浮動利率比較' },
];

export function generateArticleTemplate(input: ArticleGenerateInput) {
    const { topic, keywords = [], category, targetLength } = input;

    // 生成 slug
    const slug = topic
        .toLowerCase()
        .replace(/[^\u4e00-\u9fa5a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50);

    // 根據長度決定字數
    const wordCount = targetLength === 'short' ? 500 : targetLength === 'long' ? 1500 : 1000;
    const readTime = Math.ceil(wordCount / 400);

    // 生成 SEO 優化的標題和描述
    const seoKeywords = keywords.length > 0 ? keywords : [topic, category, '2025', '台灣', '理財'];

    // 模板化的文章結構
    const content = `# ${topic}

> 📅 更新時間：${new Date().toLocaleDateString('zh-TW')}
> 📖 預估閱讀時間：${readTime} 分鐘

## 前言

${topic} 是目前台灣理財圈最熱門的話題之一。本文將為您完整解析相關資訊。

## 重點整理

### 1. 基本概念

${topic} 的核心概念是...（待 AI 生成）

### 2. 實際應用

在實際操作上，您可以透過 TaiCalc 計算器進行精確試算...

### 3. 注意事項

⚠️ 提醒您注意以下幾點：
- 請諮詢專業理財顧問
- 本文僅供參考，不構成投資建議

## 延伸閱讀

- [薪資戰略計算器](/salary)
- [稅務優化計算器](/tax)
- [房貸試算器](/mortgage)

---

*本文由 TaiCalc 數策 AI 輔助生成*
`;

    return {
        title: topic,
        slug,
        excerpt: `完整解析 ${topic}，包含最新規定、計算方式與實用建議。`,
        content,
        seo: {
            metaTitle: `${topic} | TaiCalc 數策`,
            metaDescription: `${topic} 完整攻略。包含最新 2025 年規定、計算範例與專家建議。立即了解！`,
            keywords: seoKeywords,
        },
        estimatedReadTime: readTime,
        generatedAt: new Date().toISOString(),
    };
}

export function getTrendingTopics(category: string = 'all', limit: number = 5) {
    let trends = [...TAIWAN_FINANCE_TRENDS];

    if (category !== 'all') {
        trends = trends.filter(t => t.category === category);
    }

    return {
        trends: trends.slice(0, limit),
        lastUpdated: new Date().toISOString(),
    };
}
