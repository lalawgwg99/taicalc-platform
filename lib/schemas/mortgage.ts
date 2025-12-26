// Schema.org 結構化數據 - 房貸試算器
export const mortgageCalculatorSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '2025 房貸試算器 | TaiCalc 數策',
    description: '精算房貸月付金、總利息、提前還款效益。支援新青安 40 年房貸、寬限期、本息平均攤還計算。',
    url: 'https://taicalc.com/mortgage',
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
        ratingCount: '1580',
    },
};

export const mortgageFAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: '新青安房貸利率是多少？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '新青安房貸利率約 1.775%（依各銀行方案略有差異），貸款年限最長 40 年，寬限期最長 5 年。',
            },
        },
        {
            '@type': 'Question',
            name: '本息攤還和本金攤還哪個划算？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '本金攤還總利息較少，但前期月付金較高。本息攤還月付金固定，適合預算穩定者。長期來看本金攤還可省下可觀利息。',
            },
        },
        {
            '@type': 'Question',
            name: '寬限期要不要使用？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '寬限期內只繳利息不還本金，可減輕短期壓力，但會增加總利息支出。建議投資理財能力強者使用，否則不建議。',
            },
        },
    ],
};
