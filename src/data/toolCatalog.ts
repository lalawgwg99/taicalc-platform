export interface ToolCatalogItem {
  href: string;
  label: string;
  desc: string;
  category: string;
  isCore?: boolean;
}

export const toolCatalog: ToolCatalogItem[] = [
  { href: '/tools/salary-calculator', label: '薪資實拿計算', desc: '輸入月薪後，快速看勞健保與可用現金。', category: '薪資與稅務', isCore: true },
  { href: '/tools/income-tax-calculator', label: '綜合所得稅試算', desc: '比較標準與列舉扣除，先知道補繳或退稅。', category: '薪資與稅務', isCore: true },
  { href: '/tools/mortgage-calculator', label: '房貸試算', desc: '評估寬限期、利率變化與長期月付壓力。', category: '居住與房產', isCore: true },
  { href: '/tools/insurance-calculator', label: '勞健保計算', desc: '保費級距與負擔比例。', category: '薪資與稅務' },
  { href: '/tools/overtime-calculator', label: '加班費試算', desc: '平日與休息日計算。', category: '薪資與稅務' },
  { href: '/tools/rent-cost-calculator', label: '租金解析', desc: '押金與真實月支出。', category: '居住與房產' },
  { href: '/tools/electricity-calculator', label: '電費試算', desc: '台電累進費率換算。', category: '居住與房產' },
  { href: '/tools/fire-calculator', label: 'FIRE 退休規劃', desc: '財務自由年限預估。', category: '投資與退休' },
  { href: '/tools/labor-pension-calculator', label: '勞退試算', desc: '提撥與滾存分析。', category: '投資與退休' },
  { href: '/tools/stock-calculator', label: '股票損益試算', desc: '手續費與損益估算。', category: '投資與退休' },
  { href: '/tools/insurance-assessment', label: '保險效益評估', desc: 'IRR 與需求檢視。', category: '投資與退休' },
  { href: '/tools/delivery-income-calculator', label: '外送收入計算', desc: '跑單淨收入分析。', category: '工作與收入' },
  { href: '/tools/split-calculator', label: '分帳計算', desc: '多人分攤快速拆帳。', category: '生活工具' },
];

export const toolCatalogMap = Object.fromEntries(
  toolCatalog.map(tool => [tool.href, tool])
);
