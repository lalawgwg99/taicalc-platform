// Schema.org 結構化數據 - 薪資計算器
export const salaryCalculatorSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '2025 薪資計算機 | TaiCalc 數策',
    description: '精準計算月薪、年薪、實領金額。整合 2025 最新勞健保分級表，支援逆向推算稅前薪資。',
    url: 'https://taicalc.com/salary',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'TWD',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1250',
    },
};

export const salaryFAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: '2025 年基本工資是多少？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '2025 年基本工資為月薪 28,590 元，時薪 190 元。自 2025 年 1 月 1 日起生效。',
            },
        },
        {
            '@type': 'Question',
            name: '勞健保怎麼計算？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '勞保費用 = 投保薪資 × 12% × 20%（個人負擔），健保費用 = 投保薪資 × 5.17% × 30%。實際金額依投保級距而定。',
            },
        },
        {
            '@type': 'Question',
            name: '如何用實領金額反推稅前薪資？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '使用 TaiCalc 的「逆向計算」功能，輸入您期望的實領金額，系統會自動計算出對應的稅前月薪。',
            },
        },
    ],
};
