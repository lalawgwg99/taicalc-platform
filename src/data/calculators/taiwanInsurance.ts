import Decimal from 'decimal.js';

export type InsuranceRole = 'employee' | 'union' | 'employer';

export const MINIMUM_WAGE = 29500;
export const LABOR_INSURANCE_MAX = 45800;
export const HEALTH_INSURANCE_MAX = 313000;
export const LABOR_PENSION_MAX = 150000;
export const MAX_HEALTH_DEPENDENTS = 3;

// 115 年一般受僱勞工：勞保普通事故 11.5% + 就業保險 1%。
export const LABOR_INSURANCE_RATE = 0.125;
// 勞保普通事故費率（不含就業保險 1%）：115 年 11.5%。勞保局〈勞工保險普通事故
// 及就業保險合計之保險費分擔金額表〉將勞保與就保分開四捨五入再相加；合計費率
// 一次四捨五入會在 40,100 元級距差 1 元（勞工自付 1,002 vs 1,003），29,500 元
// 級距雇主負擔差 1 元（2,582 vs 2,581）。本站勞保費依勞保局分表方式計算。
export const LABOR_ORDINARY_INSURANCE_RATE = 0.115;
export const EMPLOYMENT_INSURANCE_RATE = 0.01;
export const NON_EMPLOYEE_LABOR_INSURANCE_RATE = 0.115;
export const HEALTH_INSURANCE_RATE = 0.0517;
export const SUPPLEMENTARY_HEALTH_RATE = 0.0211;

export const EMPLOYEE_LABOR_SHARE = 0.2;
export const EMPLOYEE_HEALTH_SHARE = 0.3;
export const EMPLOYER_LABOR_SHARE = 0.7;
export const EMPLOYER_HEALTH_SHARE = 0.6;
export const EMPLOYER_HEALTH_DEPENDENT_FACTOR = 1.56;
export const EMPLOYER_PENSION_RATE = 0.06;
export const UNION_LABOR_SHARE = 0.6;
export const UNION_HEALTH_SHARE = 0.6;

export const LABOR_INSURANCE_GRADES: readonly number[] = [
  29500, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800
];

export const HEALTH_INSURANCE_GRADES: readonly number[] = [
  29500, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800,
  48200, 50600, 53000, 55400, 57800, 60800, 63800, 66800, 69800, 72800,
  76500, 80200, 83900, 87600, 92100, 96600, 101100, 105600, 110100, 115500,
  120900, 126300, 131700, 137100, 142500, 147900, 150000, 156400, 162800,
  169200, 175600, 182000, 189500, 197000, 204500, 212000, 219500, 228200,
  236900, 245600, 254300, 263000, 273000, 283000, 293000, 303000, 313000
];

export const getInsuredSalary = (
  salary: number,
  table: readonly number[],
  max: number
): number => {
  const normalizedSalary = Math.max(0, salary);

  if (normalizedSalary < table[0]) {
    return table[0];
  }

  if (normalizedSalary >= max) {
    return max;
  }

  for (const grade of table) {
    if (grade >= normalizedSalary) {
      return grade;
    }
  }

  return max;
};

export const capHealthDependents = (dependents: number): number => {
  const normalizedDependents = Number.isFinite(dependents) ? Math.floor(dependents) : 0;
  return Math.min(MAX_HEALTH_DEPENDENTS, Math.max(0, normalizedDependents));
};

// 一般受僱勞工的勞保費（勞工自付或雇主負擔）：勞保普通事故費與就業保險費
// 各自四捨五入再相加，與勞保局分擔金額表一致。Decimal 十進位運算避免
// 浮點誤差踩到 .5 邊界（例如 29,500 元級距就保雇主負擔 206.5 應進為 207）。
export const calcSplitLaborPremium = (grade: number, share: number): number => {
  const g = new Decimal(grade);
  return g
    .mul(LABOR_ORDINARY_INSURANCE_RATE)
    .mul(share)
    .round()
    .plus(g.mul(EMPLOYMENT_INSURANCE_RATE).mul(share).round())
    .toNumber();
};
