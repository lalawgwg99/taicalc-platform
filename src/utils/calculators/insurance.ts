import {
  EMPLOYEE_HEALTH_SHARE,
  EMPLOYEE_LABOR_SHARE,
  EMPLOYER_HEALTH_DEPENDENT_FACTOR,
  EMPLOYER_HEALTH_SHARE,
  EMPLOYER_LABOR_SHARE,
  EMPLOYER_PENSION_RATE,
  HEALTH_INSURANCE_GRADES,
  HEALTH_INSURANCE_MAX,
  HEALTH_INSURANCE_RATE,
  LABOR_INSURANCE_GRADES,
  LABOR_INSURANCE_MAX,
  LABOR_PENSION_MAX,
  NON_EMPLOYEE_LABOR_INSURANCE_RATE,
  UNION_HEALTH_SHARE,
  UNION_LABOR_SHARE,
  calcSplitLaborPremium,
  capHealthDependents,
  getInsuredSalary,
  type InsuranceRole
} from '../../data/calculators/taiwanInsurance';

export interface InsuranceCalculationInput {
  salary: number;
  role: InsuranceRole;
  dependents?: number;
}

export interface InsuranceCalculationResult {
  workerLabor: number;
  workerHealth: number;
  workerTotal: number;
  employerLabor: number;
  employerHealth: number;
  employerPension: number;
  employerTotal: number;
  laborBracket: number;
  healthBracket: number;
  pensionBasis: number;
  effectiveDependents: number;
}

const normalizeSalary = (salary: number): number => (Number.isFinite(salary) ? Math.max(0, salary) : 0);

export const calculateInsurancePremiums = (
  input: InsuranceCalculationInput
): InsuranceCalculationResult => {
  const salary = normalizeSalary(input.salary);
  const effectiveDependents = capHealthDependents(input.dependents ?? 0);
  const laborBracket = getInsuredSalary(salary, LABOR_INSURANCE_GRADES, LABOR_INSURANCE_MAX);
  const healthBracket = getInsuredSalary(salary, HEALTH_INSURANCE_GRADES, HEALTH_INSURANCE_MAX);
  const pensionBasis = Math.min(
    getInsuredSalary(salary, HEALTH_INSURANCE_GRADES, LABOR_PENSION_MAX),
    LABOR_PENSION_MAX
  );

  let workerLabor = 0;
  let workerHealth = 0;
  let employerLabor = 0;
  let employerHealth = 0;
  let employerPension = 0;

  if (input.role === 'employee') {
    // 勞保費＝勞保普通事故費＋就業保險費，各自四捨五入再相加（勞保局分擔表算法）
    workerLabor = calcSplitLaborPremium(laborBracket, EMPLOYEE_LABOR_SHARE);
    workerHealth = Math.round(
      healthBracket * HEALTH_INSURANCE_RATE * EMPLOYEE_HEALTH_SHARE * (1 + effectiveDependents)
    );
    employerLabor = calcSplitLaborPremium(laborBracket, EMPLOYER_LABOR_SHARE);
    employerHealth = Math.round(
      healthBracket * HEALTH_INSURANCE_RATE * EMPLOYER_HEALTH_SHARE * EMPLOYER_HEALTH_DEPENDENT_FACTOR
    );
    employerPension = Math.round(pensionBasis * EMPLOYER_PENSION_RATE);
  } else if (input.role === 'union') {
    workerLabor = Math.round(laborBracket * NON_EMPLOYEE_LABOR_INSURANCE_RATE * UNION_LABOR_SHARE);
    workerHealth = Math.round(
      healthBracket * HEALTH_INSURANCE_RATE * UNION_HEALTH_SHARE * (1 + effectiveDependents)
    );
  } else {
    workerLabor = Math.round(laborBracket * NON_EMPLOYEE_LABOR_INSURANCE_RATE);
    workerHealth = Math.round(healthBracket * HEALTH_INSURANCE_RATE * (1 + effectiveDependents));
  }

  return {
    workerLabor,
    workerHealth,
    workerTotal: workerLabor + workerHealth,
    employerLabor,
    employerHealth,
    employerPension,
    employerTotal: employerLabor + employerHealth + employerPension,
    laborBracket,
    healthBracket,
    pensionBasis,
    effectiveDependents
  };
};
