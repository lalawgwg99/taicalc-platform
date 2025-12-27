import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://taicalc.com';
    const currentDate = new Date().toISOString();

    // 核心計算器頁面
    const calculatorPages = [
        { url: `${baseUrl}/salary`, priority: 0.9 },
        { url: `${baseUrl}/tax`, priority: 0.9 },
        { url: `${baseUrl}/mortgage`, priority: 0.9 },
        { url: `${baseUrl}/capital`, priority: 0.9 },
    ];

    // SEO 落地頁 - 稅務群集
    const taxSeoPages = [
        { url: `${baseUrl}/tax/2025/brackets`, priority: 0.8 },
        { url: `${baseUrl}/tax/2025/deductions`, priority: 0.8 },
        { url: `${baseUrl}/tax/scenario/married-vs-single`, priority: 0.7 },
        { url: `${baseUrl}/tax/scenario/parents-over-70`, priority: 0.7 },
    ];

    // SEO 落地頁 - 房貸群集
    const mortgageSeoPages = [
        { url: `${baseUrl}/mortgage/scenario/grace-period`, priority: 0.8 },
        { url: `${baseUrl}/mortgage/scenario/early-repayment`, priority: 0.8 },
        { url: `${baseUrl}/mortgage/scenario/rate-sensitivity`, priority: 0.8 },
        { url: `${baseUrl}/mortgage/scenario/term-comparison`, priority: 0.8 },
        { url: `${baseUrl}/mortgage/scenario/budget-reverse`, priority: 0.8 },
    ];

    // SEO 落地頁 - 資本群集
    const capitalSeoPages = [
        { url: `${baseUrl}/capital/scenario/compound-interest`, priority: 0.8 },
        { url: `${baseUrl}/capital/scenario/inflation-impact`, priority: 0.8 },
        { url: `${baseUrl}/capital/scenario/retirement-reverse`, priority: 0.8 },
    ];

    return [
        // 首頁
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 1,
        },
        // 計算器頁面
        ...calculatorPages.map((page) => ({
            url: page.url,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: page.priority,
        })),
        // 稅務 SEO 落地頁
        ...taxSeoPages.map((page) => ({
            url: page.url,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: page.priority,
        })),
        // 房貸 SEO 落地頁
        ...mortgageSeoPages.map((page) => ({
            url: page.url,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: page.priority,
        })),
        // 資本 SEO 落地頁
        ...capitalSeoPages.map((page) => ({
            url: page.url,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: page.priority,
        })),
    ];
}
