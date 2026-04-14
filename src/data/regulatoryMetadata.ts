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
  updatedAt: '2026-04-14',
  sources: [
    { label: '勞動部勞工保險局（投保薪資與費率）', href: 'https://www.bli.gov.tw/0100409.html' },
    { label: '衛生福利部中央健康保險署（投保金額與費率）', href: 'https://www.nhi.gov.tw/ch/cp-3278-6dd5d-1191.html' },
    { label: '財政部稅務入口網（綜所稅與申報）', href: 'https://www.etax.nat.gov.tw/etwmain/front/ETW158W/VIEW/2894' },
    { label: '財政部（綜所稅扣除額公告）', href: 'https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=e6bfc8840d2c4b6483a5d0d3b8439478' },
    { label: '金融監督管理委員會銀行局（房貸與銀行資訊）', href: 'https://www.banking.gov.tw/' },
  ],
};

export const coreToolGovernance: Record<'salary' | 'incomeTax' | 'mortgage' | 'insurance', GovernanceMeta> = {
  salary: {
    version: 'SALARY-2026.04',
    dataYear: '2026 年度',
    updatedAt: '2026-04-14',
    sources: [
      { label: '勞動部勞工保險局（投保薪資分級表）', href: 'https://www.bli.gov.tw/0100409.html' },
      { label: '衛生福利部中央健康保險署（投保金額分級表）', href: 'https://www.nhi.gov.tw/ch/cp-3278-6dd5d-1191.html' },
      { label: '勞動部（勞工退休金制度）', href: 'https://www.mol.gov.tw/' },
    ],
  },
  incomeTax: {
    version: 'TAX-2026.04',
    dataYear: '2026 報稅年度',
    updatedAt: '2026-04-14',
    sources: [
      { label: '財政部稅務入口網（綜合所得稅）', href: 'https://www.etax.nat.gov.tw/etwmain/front/ETW158W/VIEW/2894' },
      { label: '財政部電子申報繳稅服務', href: 'https://tax.nat.gov.tw/' },
      { label: '財政部（綜所稅扣除額公告）', href: 'https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=e6bfc8840d2c4b6483a5d0d3b8439478' },
    ],
  },
  mortgage: {
    version: 'MORTGAGE-2026.04',
    dataYear: '2026 年度',
    updatedAt: '2026-04-14',
    sources: [
      { label: '金融監督管理委員會銀行局', href: 'https://www.banking.gov.tw/' },
      { label: '財政部（青年安心成家政策資訊）', href: 'https://www.mof.gov.tw/' },
      { label: '內政部不動產資訊平台', href: 'https://pip.moi.gov.tw/' },
    ],
  },
  insurance: {
    version: 'INSURANCE-2026.04',
    dataYear: '2026 年度',
    updatedAt: '2026-04-14',
    sources: [
      { label: '勞動部勞工保險局（投保薪資分級表）', href: 'https://www.bli.gov.tw/0100409.html' },
      { label: '衛生福利部中央健康保險署（投保金額分級表）', href: 'https://www.nhi.gov.tw/ch/cp-3278-6dd5d-1191.html' },
      { label: '勞動部（勞工退休金制度）', href: 'https://www.mol.gov.tw/' },
    ],
  },
};
