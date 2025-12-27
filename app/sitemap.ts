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

    // SEO 落地頁
    const seoPages = [
        { url: `${baseUrl}/tax/2025/brackets`, priority: 0.8 },
        { url: `${baseUrl}/tax/2025/deductions`, priority: 0.8 },
        { url: `${baseUrl}/tax/scenario/married-vs-single`, priority: 0.7 },
        { url: `${baseUrl}/tax/scenario/parents-over-70`, priority: 0.7 },
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
        // SEO 落地頁
        ...seoPages.map((page) => ({
            url: page.url,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: page.priority,
        })),
    ];
}
