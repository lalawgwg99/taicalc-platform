export type InsuranceRole = 'employee' | 'union' | 'employer';

export const MINIMUM_WAGE = 29500;
export const LABOR_INSURANCE_MAX = 45800;
export const HEALTH_INSURANCE_MAX = 313000;
export const LABOR_PENSION_MAX = 150000;
export const MAX_HEALTH_DEPENDENTS = 3;

export const LABOR_INSURANCE_RATE = 0.12;
export const NON_EMPLOYEE_LABOR_INSURANCE_RATE = 0.11;
export const HEALTH_INSURANCE_RATE = 0.0517;
export const SUPPLEMENTARY_HEALTH_RATE = 0.0211;

export const EMPLOYEE_LABOR_SHARE = 0.2;
export const EMPLOYEE_HEALTH_SHARE = 0.3;
export const EMPLOYER_LABOR_SHARE = 0.7;
export const EMPLOYER_HEALTH_SHARE = 0.6;
export const EMPLOYER_HEALTH_DEPENDENT_FACTOR = 1.58;
export const EMPLOYER_PENSION_RATE = 0.06;
export const UNION_LABOR_SHARE = 0.6;
export const UNION_HEALTH_SHARE = 0.6;

export const LABOR_INSURANCE_GRADES: readonly number[] = [
  29500, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800
];

export const HEALTH_INSURANCE_GRADES: readonly number[] = [
  29500, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800,
  48200, 50600, 53000, 55400, 57800, 60800, 63800, 66800, 69800, 72800,
  76500, 80200, 83900, 87600, 92100, 96600, 101100, 105600, 110100, 115500,
  120900, 126300, 131700, 137100, 142500, 147900, 150000, 156400, 162800,
  169200, 175600, 182000, 189500, 197000, 204500, 212000, 219500, 313000
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
