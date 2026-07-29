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
  version: 'TW-2026.07',
  dataYear: '2026 年度',
  updatedAt: '2026-07-29',
  sources: [
    { label: '勞動部（115 年最低工資）', href: 'https://www.mol.gov.tw/1607/28162/28652/28922/28931/28937/28940/34586/post' },
    { label: '勞保局（115 年勞保投保薪資）', href: 'https://www.bli.gov.tw/0108700.html' },
    { label: '健保署（115 年投保金額分級表）', href: 'https://www.nhi.gov.tw/ch/cp-19421-f9533-2569-1.html' },
    { label: '財政部（115 年綜所稅免稅額與扣除額）', href: 'https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=34b463dc8f1b49f29d440d92a6fd5139' },
    { label: '中央銀行（五大銀行新承做房貸利率）', href: 'https://www.cbc.gov.tw/tw/cp-302-192614-192cb-1.html' },
  ],
};

export const coreToolGovernance: Record<'salary' | 'incomeTax' | 'mortgage' | 'insurance', GovernanceMeta> = {
  salary: {
    version: 'SALARY-2026.07',
    dataYear: '2026 年度',
    updatedAt: '2026-07-29',
    sources: [
      { label: '勞動部（115 年最低工資）', href: 'https://www.mol.gov.tw/1607/28162/28652/28922/28931/28937/28940/34586/post' },
      { label: '勞保局（115 年勞保費率與投保薪資）', href: 'https://www.bli.gov.tw/0108700.html' },
      { label: '健保署（115 年投保金額分級表）', href: 'https://www.nhi.gov.tw/ch/cp-19421-f9533-2569-1.html' },
    ],
  },
  incomeTax: {
    version: 'TAX-115.07',
    dataYear: '115 年度所得（2027 年 5 月申報）',
    updatedAt: '2026-07-29',
    sources: [
      { label: '財政部（115 年綜所稅免稅額與扣除額）', href: 'https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=34b463dc8f1b49f29d440d92a6fd5139' },
      { label: '財政部（房屋租金支出特別扣除額）', href: 'https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-saving-secret/ZJ1Zn0P' },
      { label: '臺北國稅局（115 年累進稅率級距）', href: 'https://www.ntbt.gov.tw/multiplehtml/1b82b380e1a34de9afd204d39b007db2' },
    ],
  },
  mortgage: {
    version: 'MORTGAGE-2026.07',
    dataYear: '2026 年度',
    updatedAt: '2026-07-29',
    sources: [
      { label: '財政部（新青安 3.0）', href: 'https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=2bc35b71dbd04bfaba2d2c88640042c4' },
      { label: '中央銀行（115 年 6 月五大銀行利率）', href: 'https://www.cbc.gov.tw/tw/cp-302-192614-192cb-1.html' },
    ],
  },
  insurance: {
    version: 'INSURANCE-2026.07',
    dataYear: '2026 年度',
    updatedAt: '2026-07-29',
    sources: [
      { label: '勞保局（115 年勞保費率與投保薪資）', href: 'https://www.bli.gov.tw/0108700.html' },
      { label: '健保署（115 年投保金額分級表）', href: 'https://www.nhi.gov.tw/ch/cp-19421-f9533-2569-1.html' },
      { label: '健保署（一般保險費計算）', href: 'https://www.nhi.gov.tw/ch/cp-3277-6c895-2588-1.html' },
    ],
  },
};
