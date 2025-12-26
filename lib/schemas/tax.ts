// Schema.org 結構化數據 - 所得稅計算器
export const taxCalculatorSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '2025 所得稅計算機 | TaiCalc 數策',
    description: '精準計算綜合所得稅、基本生活費差額、邊際稅率。支援 2025 最新免稅額與扣除額標準。',
    url: 'https://taicalc.com/tax',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'TWD',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '890',
    },
};

export const taxFAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: '2025 年基本生活費是多少？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '2025 年基本生活費為每人 20.2 萬元。若家戶基本生活費總額大於免稅額與扣除額合計，差額可再減除。',
            },
        },
        {
            '@type': 'Question',
            name: '如何計算邊際稅率？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '2025 年綜所稅稅率分為 5%、12%、20%、30%、40% 五個級距。邊際稅率取決於您的淨所得落在哪個級距。',
            },
        },
        {
            '@type': 'Question',
            name: '股利所得如何報稅最划算？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '股利所得可選擇「合併計稅」(享 8.5% 抵減，上限 8 萬) 或「分離課稅」(28% 分開計稅)。一般而言，年薪百萬內選合併較有利。',
            },
        },
    ],
};
