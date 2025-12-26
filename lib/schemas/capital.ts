// Schema.org 結構化數據 - 複利計算器
export const capitalCalculatorSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '複利計算機 & FIRE 財務自由試算 | TaiCalc 數策',
    description: '計算複利增長、通膨影響、實質購買力。模擬 0050 長期投資報酬，規劃 FIRE 財務自由目標。',
    url: 'https://taicalc.com/capital',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'TWD',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.7',
        ratingCount: '720',
    },
};

export const capitalFAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: '什麼是複利效應？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '複利是「利滾利」的概念：本金產生的利息會加入本金，下一期再一起產生利息。長期下來，複利效應可讓資產呈指數成長。',
            },
        },
        {
            '@type': 'Question',
            name: '0050 長期年化報酬率是多少？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '元大台灣50 (0050) 自 2003 年成立以來，含息年化報酬率約 8-10%。但過去績效不代表未來，投資仍有風險。',
            },
        },
        {
            '@type': 'Question',
            name: '通膨對退休金有什麼影響？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '假設通膨率 2%，30 年後 100 萬的購買力只剩約 55 萬。規劃退休金時必須將通膨納入考量。',
            },
        },
    ],
};
