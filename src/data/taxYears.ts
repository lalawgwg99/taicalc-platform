// TaiCalc 稅務年度速查資料
// 僅收錄已由財政部公告之年度；未公告年度不列入（避免臆測數字）。
// 115 年度數字對齊 src/data/calculators/taiwanIncomeTax.ts；114 年度對齊 2027 部落格公告對照表。

export interface TaxYearBracket {
  min: number;
  max: number;
  rate: number;
  subtract: number;
}

export interface TaxYearData {
  year: string;            // 民國年度
  incomeYear: string;      // 對應所得年度
  filingNote: string;      // 申報說明
  exemption: number;       // 一般免稅額
  exemption70: number;     // 70 歲以上免稅額
  stdSingle: number;       // 標準扣除額（單身）
  stdMarried: number;      // 標準扣除額（有配偶）
  salarySpecial: number;   // 薪資所得特別扣除額
  brackets?: TaxYearBracket[];
  isLatest: boolean;
  announced: boolean;
}

export const taxYears: TaxYearData[] = [
  {
    year: '115',
    incomeYear: '2026 年（民國 115 年）',
    filingNote: '2026 年全年所得，於 2027 年 5 月申報綜合所得稅。',
    exemption: 101000,
    exemption70: 151500,
    stdSingle: 136000,
    stdMarried: 272000,
    salarySpecial: 227000,
    brackets: [
      { min: 0, max: 610000, rate: 0.05, subtract: 0 },
      { min: 610000, max: 1380000, rate: 0.12, subtract: 42700 },
      { min: 1380000, max: 2770000, rate: 0.2, subtract: 153100 },
      { min: 2770000, max: 5190000, rate: 0.3, subtract: 430100 },
      { min: 5190000, max: Number.POSITIVE_INFINITY, rate: 0.4, subtract: 949100 },
    ],
    isLatest: true,
    announced: true,
  },
  {
    year: '114',
    incomeYear: '2025 年（民國 114 年）',
    filingNote: '2025 年全年所得，於 2026 年 5 月申報綜合所得稅（歷史年度）。',
    exemption: 97000,
    exemption70: 145500,
    stdSingle: 131000,
    stdMarried: 262000,
    salarySpecial: 218000,
    brackets: undefined,
    isLatest: false,
    announced: true,
  },
];

export const getTaxYear = (year: string): TaxYearData | undefined =>
  taxYears.find((entry) => entry.year === year);

export const latestTaxYear = taxYears.find((entry) => entry.isLatest) ?? taxYears[0];
