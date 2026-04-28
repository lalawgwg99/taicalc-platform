export interface ToolCatalogItem {
  href: string;
  label: string;
  desc: string;
  category: string;
  isCore?: boolean;
  scenario?: string;
  cta?: string;
  icon?: string;
  tags?: string[];
}

export const toolCatalog: ToolCatalogItem[] = [
  {
    href: '/tools/salary-calculator',
    label: '薪資實拿計算',
    desc: '輸入月薪後，快速看勞健保與可用現金。',
    category: '薪資與稅務',
    isCore: true,
    scenario: '拿到 Offer、談加薪前',
    cta: '先算薪資實拿',
    icon: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
    tags: ['薪資', '月薪', '勞保', '健保', 'offer'],
  },
  {
    href: '/tools/income-tax-calculator',
    label: '綜合所得稅試算',
    desc: '比較標準與列舉扣除，先知道補繳或退稅。',
    category: '薪資與稅務',
    isCore: true,
    scenario: '五月報稅前',
    cta: '先估今年稅額',
    icon: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    tags: ['所得稅', '報稅', '五月', '退稅', '補繳'],
  },
  {
    href: '/tools/mortgage-calculator',
    label: '房貸試算',
    desc: '評估寬限期、利率變化與長期月付壓力。',
    category: '居住與房產',
    isCore: true,
    scenario: '準備買房、換屋前',
    cta: '先算每月房貸',
    icon: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    tags: ['房貸', '買房', '新青安', '利率', '貸款'],
  },
  {
    href: '/tools/insurance-calculator',
    label: '勞健保計算',
    desc: '保費級距與負擔比例。',
    category: '薪資與稅務',
    tags: ['勞保', '健保', '保費', '投保'],
  },
  {
    href: '/tools/overtime-calculator',
    label: '加班費試算',
    desc: '平日與休息日計算。',
    category: '薪資與稅務',
    tags: ['加班', '加班費', '休假', '假日'],
  },
  {
    href: '/tools/rent-cost-calculator',
    label: '租金解析',
    desc: '押金與真實月支出。',
    category: '居住與房產',
    tags: ['租金', '租屋', '房租', '押金'],
  },
  {
    href: '/tools/electricity-calculator',
    label: '電費試算',
    desc: '台電累進費率換算。',
    category: '居住與房產',
    tags: ['電費', '台電', '電力', '用電'],
  },
  {
    href: '/tools/fire-calculator',
    label: 'FIRE 退休規劃',
    desc: '財務自由年限預估。',
    category: '投資與退休',
    tags: ['退休', 'FIRE', '財務自由', '複利'],
  },
  {
    href: '/tools/labor-pension-calculator',
    label: '勞退試算',
    desc: '提撥與滾存分析。',
    category: '投資與退休',
    tags: ['勞退', '勞工退休金', '提撥', '退休'],
  },
  {
    href: '/tools/stock-calculator',
    label: '股票損益試算',
    desc: '手續費與損益估算。',
    category: '投資與退休',
    tags: ['股票', 'ETF', '手續費', '損益', '當沖'],
  },
  {
    href: '/tools/insurance-assessment',
    label: '保險效益評估',
    desc: 'IRR 與需求檢視。',
    category: '投資與退休',
    tags: ['保險', '儲蓄險', '壽險', 'IRR'],
  },
  {
    href: '/tools/delivery-income-calculator',
    label: '外送收入計算',
    desc: '跑單淨收入分析。',
    category: '工作與收入',
    tags: ['外送', 'foodpanda', 'ubereats', '外賣'],
  },
  {
    href: '/tools/split-calculator',
    label: '分帳計算',
    desc: '多人分攤快速拆帳。',
    category: '生活工具',
    tags: ['分帳', 'AA', '聚餐'],
  },
];

export const toolCatalogMap = Object.fromEntries(
  toolCatalog.map(tool => [tool.href, tool])
) as Record<string, ToolCatalogItem>;

export const normalizeToolPath = (path: string): string => {
  const withoutTrailingSlash = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return withoutTrailingSlash.endsWith('.html')
    ? withoutTrailingSlash.slice(0, -5)
    : withoutTrailingSlash;
};

export const getToolByHref = (href: string): ToolCatalogItem | undefined => {
  return toolCatalogMap[normalizeToolPath(href)];
};

export const getCoreTools = (): ToolCatalogItem[] => {
  return toolCatalog.filter(tool => tool.isCore);
};

export const getSupportTools = (): ToolCatalogItem[] => {
  return toolCatalog.filter(tool => !tool.isCore);
};

export const getRelatedTools = (currentHref: string, limit = 4): ToolCatalogItem[] => {
  const currentTool = getToolByHref(currentHref);
  const currentPath = normalizeToolPath(currentHref);

  const sameCategoryTools = currentTool
    ? toolCatalog.filter(
        tool => tool.href !== currentPath && tool.category === currentTool.category
      )
    : [];
  const remainingTools = toolCatalog.filter(
    tool =>
      tool.href !== currentPath &&
      !sameCategoryTools.some(relatedTool => relatedTool.href === tool.href)
  );

  return [...sameCategoryTools, ...remainingTools].slice(0, limit);
};
