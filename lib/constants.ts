/**
 * TaiCalc 核心參數庫 (2025 Version)
 * 包含台灣勞健保級距、稅務級距與相關費率
 * 
 * 資料來源基準：
 * - 基本工資：28,590 (2025/1/1 起實施)
 * - 勞保費率：12% (含就保 1%)
 * - 健保費率：5.17%
 * - 勞保個人負擔比例：20%
 * - 健保個人負擔比例：30%
 */

export const TAIWAN_PARAMS = {
  // 基礎費率
  RATES: {
    LABOR_INSURANCE: 0.12,      // 勞保費率 (含就保 1%)
    HEALTH_INSURANCE: 0.0517,   // 健保費率
    LABOR_SHARE: 0.2,           // 勞保個人負擔比例
    HEALTH_SHARE: 0.3,          // 健保個人負擔比例
    PENSION_EMPLOYER_MIN: 0.06, // 雇主勞退最低提撥率
  },

  // 2025 所得稅級距 (預估值，待財政部正式公告)
  INCOME_TAX_BRACKETS: [
    { limit: 590000, rate: 0.05, deduction: 0 },
    { limit: 1330000, rate: 0.12, deduction: 41300 },
    { limit: 2660000, rate: 0.20, deduction: 147700 },
    { limit: 4980000, rate: 0.30, deduction: 413700 },
    { limit: Infinity, rate: 0.40, deduction: 911700 },
  ],

  // 2025 扣除額與免稅額 (預估值)
  DEDUCTIONS: {
    EXEMPTION: 97000,              // 免稅額
    STANDARD_SINGLE: 131000,       // 標準扣除額 (單身)
    STANDARD_MARRIED: 262000,      // 標準扣除額 (已婚)
    SALARY_SPECIAL: 218000,        // 薪資特別扣除額
    BASIC_LIVING_EXPENSE: 202000,  // 基本生活費 (每人)
  },

  // 勞工保險投保薪資分級表 (2025，配合基本工資 28,590)
  // 勞保上限：45,800 元
  LABOR_INSURANCE_TABLE: [
    { level: 1, amount: 28590 },  // 基本工資
    { level: 2, amount: 29000 },
    { level: 3, amount: 30300 },
    { level: 4, amount: 31800 },
    { level: 5, amount: 33300 },
    { level: 6, amount: 34800 },
    { level: 7, amount: 36300 },
    { level: 8, amount: 38200 },
    { level: 9, amount: 40100 },
    { level: 10, amount: 42000 },
    { level: 11, amount: 43900 },
    { level: 12, amount: 45800 }, // 勞保上限
  ],

  // 全民健康保險投保金額分級表 (2025)
  // 健保上限：219,500 元
  HEALTH_INSURANCE_TABLE: [
    { level: 1, amount: 28590 },
    { level: 2, amount: 29000 },
    { level: 3, amount: 30300 },
    { level: 4, amount: 31800 },
    { level: 5, amount: 33300 },
    { level: 6, amount: 34800 },
    { level: 7, amount: 36300 },
    { level: 8, amount: 38200 },
    { level: 9, amount: 40100 },
    { level: 10, amount: 42000 },
    { level: 11, amount: 43900 },
    { level: 12, amount: 45800 },
    { level: 13, amount: 48200 },
    { level: 14, amount: 50600 },
    { level: 15, amount: 53000 },
    { level: 16, amount: 55400 },
    { level: 17, amount: 57800 },
    { level: 18, amount: 60800 },
    { level: 19, amount: 63800 },
    { level: 20, amount: 66800 },
    { level: 21, amount: 69800 },
    { level: 22, amount: 72800 },
    { level: 23, amount: 76500 },
    { level: 24, amount: 80200 },
    { level: 25, amount: 83900 },
    { level: 26, amount: 87600 },
    { level: 27, amount: 92100 },
    { level: 28, amount: 96600 },
    { level: 29, amount: 101100 },
    { level: 30, amount: 105600 },
    { level: 31, amount: 110100 },
    { level: 32, amount: 115500 },
    { level: 33, amount: 120900 },
    { level: 34, amount: 126300 },
    { level: 35, amount: 131700 },
    { level: 36, amount: 137100 },
    { level: 37, amount: 142500 },
    { level: 38, amount: 147900 },
    { level: 39, amount: 150000 }, // 勞退上限通常停在此
    { level: 40, amount: 156400 },
    { level: 41, amount: 162800 },
    { level: 42, amount: 169200 },
    { level: 43, amount: 175600 },
    { level: 44, amount: 182000 },
    { level: 45, amount: 189500 },
    { level: 46, amount: 197000 },
    { level: 47, amount: 204500 },
    { level: 48, amount: 212000 },
    { level: 49, amount: 219500 }, // 健保上限
  ],

  // 勞工退休金月提繳工資上限
  PENSION_TABLE_MAX: 150000,

  // 基本工資
  MINIMUM_WAGE: 28590,
} as const;
