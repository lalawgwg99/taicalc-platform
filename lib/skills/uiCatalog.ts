/**
 * UI Catalog - All calculator tools metadata
 */

export interface SkillMeta {
    id: string;
    title: string;
    oneLiner: string;
    category: 'salary' | 'tax' | 'investment' | 'mortgage' | 'lifestyle' | 'fortune';
    tags?: string[];
    priority?: number;
    isFeatured?: boolean;
    href: string;
    icon?: string;
}

export const uiCatalog: SkillMeta[] = [
    // Salary
    {
        id: 'salary-calculator',
        title: '薪資計算器',
        oneLiner: '計算實際到手薪資、勞健保、勞退',
        category: 'salary',
        tags: ['薪資', '勞保', '健保', '勞退'],
        priority: 1,
        isFeatured: true,
        href: '/salary',
    },
    // Tax
    {
        id: 'tax-calculator',
        title: '所得稅計算',
        oneLiner: '2025 年所得稅試算',
        category: 'tax',
        tags: ['稅', '報稅', '所得稅'],
        priority: 2,
        isFeatured: true,
        href: '/tax',
    },
    // Mortgage
    {
        id: 'mortgage-calculator',
        title: '房貸試算',
        oneLiner: '計算每月還款金額與利息',
        category: 'mortgage',
        tags: ['房貸', '貸款', '利率'],
        priority: 3,
        isFeatured: true,
        href: '/mortgage',
    },
    // Investment
    {
        id: 'capital-growth',
        title: '複利計算',
        oneLiner: '試算複利成長效果',
        category: 'investment',
        tags: ['複利', '投資', '理財'],
        priority: 4,
        isFeatured: true,
        href: '/capital',
    },
    // Retirement
    {
        id: 'retirement-planner',
        title: '退休規劃',
        oneLiner: '計算退休需要多少錢',
        category: 'lifestyle',
        tags: ['退休', '養老', '儲蓄'],
        priority: 5,
        isFeatured: false,
        href: '/retirement',
    },
    // Fortune
    {
        id: 'fortune-analysis',
        title: '財運命盤',
        oneLiner: 'AI 紫微斗數財運分析',
        category: 'fortune',
        tags: ['命理', '紫微', '財運'],
        priority: 6,
        isFeatured: false,
        href: '/fortune',
    },
];

export const categories = [
    { id: 'all', label: '全部' },
    { id: 'salary', label: '薪資相關' },
    { id: 'tax', label: '稅務' },
    { id: 'investment', label: '投資理財' },
    { id: 'mortgage', label: '房貸' },
    { id: 'lifestyle', label: '生活規劃' },
    { id: 'fortune', label: '運勢' },
];
