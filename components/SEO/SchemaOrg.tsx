'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

// 各頁面的 Schema 數據
const pageSchemas: Record<string, object[]> = {
    '/salary': [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: '2025 薪資計算機 | TaiCalc 數策',
            description: '精準計算月薪、年薪、實領金額。整合 2025 最新勞健保分級表。',
            url: 'https://taicalc.com/salary',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web Browser',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                { '@type': 'Question', name: '2025 年基本工資是多少？', acceptedAnswer: { '@type': 'Answer', text: '2025 年基本工資為月薪 28,590 元，時薪 190 元。' } },
                { '@type': 'Question', name: '勞健保怎麼計算？', acceptedAnswer: { '@type': 'Answer', text: '勞保費 = 投保薪資 × 12% × 20%，健保費 = 投保薪資 × 5.17% × 30%。' } },
            ],
        },
    ],
    '/tax': [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: '2025 所得稅計算機 | TaiCalc 數策',
            description: '精準計算綜合所得稅、基本生活費差額、邊際稅率。',
            url: 'https://taicalc.com/tax',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web Browser',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                { '@type': 'Question', name: '2025 年基本生活費是多少？', acceptedAnswer: { '@type': 'Answer', text: '2025 年基本生活費為每人 20.2 萬元。' } },
                { '@type': 'Question', name: '股利所得如何報稅最划算？', acceptedAnswer: { '@type': 'Answer', text: '年薪百萬內選「合併計稅」較有利，可享 8.5% 抵減。' } },
            ],
        },
    ],
    '/mortgage': [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: '2025 房貸試算器 | TaiCalc 數策',
            description: '精算房貸月付金、總利息。支援新青安 40 年房貸、寬限期計算。',
            url: 'https://taicalc.com/mortgage',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web Browser',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                { '@type': 'Question', name: '新青安房貸利率是多少？', acceptedAnswer: { '@type': 'Answer', text: '新青安房貸利率約 1.775%，貸款年限最長 40 年。' } },
                { '@type': 'Question', name: '本息攤還和本金攤還哪個划算？', acceptedAnswer: { '@type': 'Answer', text: '本金攤還總利息較少，但前期月付金較高。' } },
            ],
        },
    ],
    '/capital': [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: '複利計算機 | TaiCalc 數策',
            description: '計算複利增長、通膨影響、實質購買力。模擬 0050 長期投資報酬。',
            url: 'https://taicalc.com/capital',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web Browser',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                { '@type': 'Question', name: '什麼是複利效應？', acceptedAnswer: { '@type': 'Answer', text: '複利是「利滾利」的概念，長期下來資產可呈指數成長。' } },
                { '@type': 'Question', name: '0050 長期年化報酬率是多少？', acceptedAnswer: { '@type': 'Answer', text: '0050 自 2003 年成立以來，含息年化報酬率約 8-10%。' } },
            ],
        },
    ],
};

export default function SchemaOrg() {
    const pathname = usePathname();
    const schemas = pageSchemas[pathname];

    if (!schemas) return null;

    return (
        <>
            {schemas.map((schema, index) => (
                <Script
                    key={index}
                    id={`schema-${pathname}-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
}
