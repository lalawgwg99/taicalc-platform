export const TAIWAN_PARAMS = {
  // 所得稅級距 (2024-2025 適用)
  INCOME_TAX_BRACKETS: [
    { limit: 560000, rate: 0.05, deduction: 0 },
    { limit: 1260000, rate: 0.12, deduction: 39200 },
    { limit: 2520000, rate: 0.20, deduction: 140000 },
    { limit: 4720000, rate: 0.30, deduction: 392000 },
    { limit: Infinity, rate: 0.40, deduction: 864000 },
  ],
  DEDUCTIONS: {
    EXEMPTION: 97000,        // 免稅額
    STANDARD: 131000,       // 標準扣除額
    SALARY_SPECIAL: 218000, // 薪資特別扣除額
    BASIC_LIVING_EXPENSE: 202000, // 基本生活費 (2024/2025)
  },
  INSURANCE: {
    LABOR_RATE: 0.12,           // 勞保
    HEALTH_RATE: 0.0517,        // 健保
    PENSION_MIN_RATE: 0.06      // 勞退
  }
} as const;
