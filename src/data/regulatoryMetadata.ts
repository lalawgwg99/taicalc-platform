export interface SourceLink {
  label: string;
  href: string;
}

export interface GovernanceMeta {
  version: string;
  dataYear: string;
  updatedAt: string;
  sources: SourceLink[];
}

export const platformGovernance: GovernanceMeta = {
  version: 'TW-2026.04',
  dataYear: '2026 年度',
  updatedAt: '2026-04-13',
  sources: [
    { label: '勞動部勞工保險局（勞保級距與費率）', href: 'https://www.bli.gov.tw/' },
    { label: '衛生福利部中央健康保險署（健保費率）', href: 'https://www.nhi.gov.tw/' },
    { label: '財政部稅務入口網（綜所稅與申報）', href: 'https://www.etax.nat.gov.tw/' },
    { label: '財政部（政策與稅制公告）', href: 'https://www.mof.gov.tw/' },
    { label: '金融監督管理委員會銀行局（房貸與銀行資訊）', href: 'https://www.banking.gov.tw/' },
  ],
};

export const coreToolGovernance: Record<'salary' | 'incomeTax' | 'mortgage', GovernanceMeta> = {
  salary: {
    version: 'SALARY-2026.04',
    dataYear: '2026 年度',
    updatedAt: '2026-04-13',
    sources: [
      { label: '勞動部勞工保險局（投保薪資分級表）', href: 'https://www.bli.gov.tw/' },
      { label: '衛生福利部中央健康保險署（投保金額分級表）', href: 'https://www.nhi.gov.tw/' },
      { label: '勞動部（勞工退休金制度）', href: 'https://www.mol.gov.tw/' },
    ],
  },
  incomeTax: {
    version: 'TAX-2026.04',
    dataYear: '2026 報稅年度',
    updatedAt: '2026-04-13',
    sources: [
      { label: '財政部稅務入口網（綜合所得稅）', href: 'https://www.etax.nat.gov.tw/' },
      { label: '財政部電子申報繳稅服務', href: 'https://tax.nat.gov.tw/' },
      { label: '財政部（最新稅制公告）', href: 'https://www.mof.gov.tw/' },
    ],
  },
  mortgage: {
    version: 'MORTGAGE-2026.04',
    dataYear: '2026 年度',
    updatedAt: '2026-04-13',
    sources: [
      { label: '金融監督管理委員會銀行局', href: 'https://www.banking.gov.tw/' },
      { label: '財政部（青年安心成家政策資訊）', href: 'https://www.mof.gov.tw/' },
      { label: '內政部不動產資訊平台', href: 'https://pip.moi.gov.tw/' },
    ],
  },
};
