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
    href: '/tools/life-simulator',
    label: '台灣人生模擬器',
    desc: '買房、買車、育兒、投資與退休，一次走完不同人生路線。',
    category: '人生規劃',
    isCore: true,
    scenario: '想先看看每個大選擇會把人生帶去哪裡',
    cta: '開始模擬另一種人生',
    icon: '<path d="M3 12h4l3-8 4 16 3-8h4"/><path d="M3 20h18"/>',
    tags: ['人生模擬器', '人生遊戲', '財務模擬器', '人生規劃', '退休', '買房', '買車'],
  },
  {
    href: '/tools/salary-calculator',
    label: '薪資實拿計算',
    desc: '月薪實拿、勞健保、可存金額。',
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
    desc: '先看補繳或退稅。',
    category: '薪資與稅務',
    isCore: true,
    scenario: '五月報稅前',
    cta: '先估今年稅額',
    icon: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    tags: ['所得稅', '報稅', '五月', '退稅', '補繳'],
  },
  {
    href: '/tools/mortgage-calculator',
    label: '2026 房貸試算 (新青安版)',
    desc: '40年期、5年寬限期、利率補貼與月付金壓力對照。',
    category: '居住與房產',
    isCore: true,
    scenario: '買房、新青安申請、換屋試算前',
    cta: '算每月新青安房貸',
    icon: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    tags: ['房貸', '新青安', '房貸試算', '新青安計算機', '40年房貸', '寬限期', '利率補貼'],
  },
  {
    href: '/tools/electricity-calculator',
    label: '電費計算機 | 冷氣電費試算',
    desc: '台電夏月/非夏月累進電價與冷氣噸數用電速算。',
    category: '居住與房產',
    isCore: true,
    scenario: '夏季用電、冷氣開整天、租屋電費核對前',
    cta: '速算冷氣與月電費',
    icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
    tags: ['電費', '電費計算機', '冷氣電費', '冷氣電費計算機', '台電', '夏月電價', '變頻冷氣'],
  },
  {
    href: '/tools/split-calculator',
    label: '分帳計算機 | AA制分錢速算',
    desc: '聚餐旅遊多人拆帳，自動產生最少轉帳次數與LINE複製文字。',
    category: '生活工具',
    isCore: true,
    scenario: '聚餐結帳、包車旅遊、團購分款時',
    cta: '速算誰轉給誰多少錢',
    icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    tags: ['分帳', '分帳計算機', '分錢', '分錢計算機', 'AA制', '聚餐拆帳', '旅遊分帳'],
  },
  {
    href: '/tools/delivery-income-calculator',
    label: '外送收入計算 (Foodpanda / UberEats)',
    desc: '扣除油錢、折舊與耗損後的跑單實拿淨薪資。',
    category: '工作與收入',
    tags: ['外送', '外送收入計算', 'foodpanda', 'ubereats', '外送員收入', '時薪淨利'],
  },
  {
    href: '/tools/car-cost-calculator',
    label: '買車總成本',
    desc: '車貸、牌照稅、公路養管費與折舊。',
    category: '交通與購車',
    isCore: true,
    scenario: '買車、換車前',
    cta: '算真正養車成本',
    tags: ['買車', '車貸', '牌照稅', '燃料費', '公路養管費', '油錢', '電動車', '折舊'],
  },
  {
    href: '/tools/severance-calculator',
    label: '離職結算',
    desc: '資遣費、預告工資、特休與薪資。',
    category: '工作與收入',
    isCore: true,
    scenario: '被資遣、離職交接前',
    cta: '核對應領金額',
    tags: ['離職', '資遣費', '預告工資', '特休', '勞基法'],
  },
  {
    href: '/tools/debt-consolidation-calculator',
    label: '信貸／債務整合',
    desc: '月付、總利息與提前清償比較。',
    category: '貸款與債務',
    tags: ['信貸', '債務整合', '貸款', '提前清償', '利息'],
  },
  {
    href: '/tools/labor-insurance-pension-calculator',
    label: '勞保老年年金',
    desc: '退休年齡、一次領與月領比較。',
    category: '投資與退休',
    tags: ['勞保', '老年年金', '退休', '一次領', '月領', '投保薪資'],
  },
  {
    href: '/tools/estate-gift-tax-calculator',
    label: '遺產稅／贈與稅',
    desc: '115 年免稅額、扣除額與累進稅率。',
    category: '薪資與稅務',
    tags: ['遺產稅', '贈與稅', '免稅額', '繼承', '傳承'],
  },
  {
    href: '/tools/parental-benefit-calculator',
    label: '育兒津貼與育嬰留停',
    desc: '雙親給付、補助與收入缺口。',
    category: '家庭與育兒',
    tags: ['育兒津貼', '育嬰留停', '育嬰假', '托育', '生育'],
  },
  {
    href: '/tools/home-ownership-cost-calculator',
    label: '買房持有成本',
    desc: '房貸、房屋稅、地價稅與維修。',
    category: '居住與房產',
    isCore: true,
    scenario: '看房、出價前',
    cta: '算每月養房成本',
    tags: ['買房', '房屋稅', '地價稅', '管理費', '維修', '房貸'],
  },
  {
    href: '/tools/real-return-calculator',
    label: '通膨後實質報酬',
    desc: '定存、債券、ETF 購買力比較。',
    category: '投資與退休',
    tags: ['定存', '債券', 'ETF', '通膨', '實質報酬', '複利'],
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
