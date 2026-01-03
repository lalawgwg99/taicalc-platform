/**
 * UI Catalog - All calculator tools metadata
 */

export interface SkillMeta {
    id: string;
    title: string;
    oneLiner: string;
    category: 'salary' | 'tax' | 'investment' | 'mortgage' | 'lifestyle' | 'tools';
    tags?: string[];
    priority?: number;
    isFeatured?: boolean;
    href: string;
    icon?: string;
}

export const uiCatalog: SkillMeta[] = [
    // 金錢與決策
    {
        id: 'cost-calculator',
        title: '成本計算器',
        oneLiner: '快速計算產品或服務的實際成本',
        category: 'tools',
        tags: ['成本', '定價', '利潤'],
        priority: 1,
        isFeatured: true,
        href: '/tools/cost-calculator',
    },
    {
        id: 'profit-calculator',
        title: '利潤計算器',
        oneLiner: '計算銷售利潤與利潤率',
        category: 'tools',
        tags: ['利潤', '毛利', '營收'],
        priority: 2,
        isFeatured: true,
        href: '/tools/profit-calculator',
    },
    {
        id: 'credit-card-calculator',
        title: '信用卡分期計算器',
        oneLiner: '銀行不告訴你的真實利息',
        category: 'tools',
        tags: ['信用卡', '分期', '利息'],
        priority: 3,
        isFeatured: true,
        href: '/tools/credit-card-calculator',
    },
    // 工作效率
    {
        id: 'overtime-calculator',
        title: '加班費計算器',
        oneLiner: '依勞基法計算合法加班費',
        category: 'salary',
        tags: ['加班', '薪資', '勞基法'],
        priority: 4,
        isFeatured: true,
        href: '/tools/overtime-calculator',
    },
    {
        id: 'work-hours-calculator',
        title: '工時計算器',
        oneLiner: '計算上班時數與薪資',
        category: 'salary',
        tags: ['工時', '薪資', '時薪'],
        priority: 5,
        isFeatured: false,
        href: '/tools/work-hours-calculator',
    },
    {
        id: 'delivery-income-calculator',
        title: '外送收入計算器',
        oneLiner: '估算外送員日、週、月收入',
        category: 'salary',
        tags: ['外送', '收入', '兼職'],
        priority: 6,
        isFeatured: false,
        href: '/tools/delivery-income-calculator',
    },
    // 生活開銷
    {
        id: 'electricity-calculator',
        title: '電費計算器',
        oneLiner: '依台電級距試算每月電費',
        category: 'lifestyle',
        tags: ['電費', '台電', '級距'],
        priority: 7,
        isFeatured: true,
        href: '/tools/electricity-calculator',
    },
    {
        id: 'rent-cost-calculator',
        title: '租屋成本計算器',
        oneLiner: '計算租屋真實每月支出',
        category: 'lifestyle',
        tags: ['租屋', '房租', '生活費'],
        priority: 8,
        isFeatured: false,
        href: '/tools/rent-cost-calculator',
    },
    {
        id: 'split-calculator',
        title: '分攤計算器',
        oneLiner: '快速平分聚餐、合租費用',
        category: 'lifestyle',
        tags: ['分攤', '聚餐', 'AA制'],
        priority: 9,
        isFeatured: false,
        href: '/tools/split-calculator',
    },
    // 理財規劃
    {
        id: 'labor-pension-calculator',
        title: '勞保退休金計算器',
        oneLiner: '估算退休後每月可領多少',
        category: 'lifestyle',
        tags: ['退休', '勞保', '勞退'],
        priority: 10,
        isFeatured: true,
        href: '/tools/labor-pension-calculator',
    },
    {
        id: 'percentage-calculator',
        title: '百分比計算器',
        oneLiner: '計算百分比、變化率、原值',
        category: 'tools',
        tags: ['百分比', '折扣', '變化率'],
        priority: 11,
        isFeatured: false,
        href: '/tools/percentage-calculator',
    },
    {
        id: 'mortgage-calculator',
        title: '房貸計算器',
        oneLiner: '計算每月還款金額與利息',
        category: 'mortgage',
        tags: ['房貸', '貸款', '利率'],
        priority: 12,
        isFeatured: true,
        href: '/mortgage',
    },
    {
        id: 'capital-growth',
        title: '複利計算器',
        oneLiner: '試算複利成長效果',
        category: 'investment',
        tags: ['複利', '投資', '理財'],
        priority: 13,
        isFeatured: false,
        href: '/capital',
    },
];

export const categories = [
    { id: 'all', label: '全部' },
    { id: 'tools', label: '金錢決策' },
    { id: 'salary', label: '薪資相關' },
    { id: 'lifestyle', label: '生活開銷' },
    { id: 'investment', label: '投資理財' },
    { id: 'mortgage', label: '房貸' },
];

