/**
 * Navigation Configuration
 * 定義全站主導覽結構
 */

export const NAV_CATEGORIES = [
    { id: 'salary', label: '薪資', path: '/calculators?cat=salary' },
    { id: 'tax', label: '稅務', path: '/calculators?cat=tax' },
    { id: 'capital', label: '資本', path: '/calculators?cat=capital' },
    { id: 'mortgage', label: '房貸', path: '/calculators?cat=mortgage' },
    { id: 'fortune', label: '財運', path: '/calculators?cat=fortune' },
    { id: 'articles', label: '工具', path: '/calculators?cat=articles' },
];

export const MAIN_NAV_ITEMS = [
    ...NAV_CATEGORIES
];
