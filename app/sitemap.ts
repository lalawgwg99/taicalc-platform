import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://taicalc.com';

    // 薪資級距頁面
    const salaryLevels = [35000, 40000, 45000, 50000, 55000, 60000, 70000, 80000, 100000, 120000];
    const salaryPages: MetadataRoute.Sitemap = salaryLevels.map(salary => ({
        url: `${baseUrl}/salary/scenarios/${salary}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // 房貸金額頁面
    const loanAmounts = [5000000, 8000000, 10000000, 12000000, 15000000, 20000000];
    const mortgagePages: MetadataRoute.Sitemap = loanAmounts.map(amount => ({
        url: `${baseUrl}/mortgage/scenarios/${amount}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [
        // 核心頁面
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/salary`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/mortgage`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tax`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/capital`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/retirement`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        // Pro 功能
        {
            url: `${baseUrl}/pro`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/pro/calculator`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/pro/mortgage`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        // 知識庫
        {
            url: `${baseUrl}/articles`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        // 情境頁面
        {
            url: `${baseUrl}/salary/scenarios/fresh-graduate`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/mortgage/scenarios/new-youth-loan`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/tax/scenarios/year-end-bonus`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7,
        },
        // 數字情境頁面 (Programmatic SEO)
        ...salaryPages,
        ...mortgagePages,
    ];
}

