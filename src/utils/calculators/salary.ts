import Decimal from 'decimal.js';

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
  LABOR_INSURANCE_RATE,
  LABOR_PENSION_MAX,
  SUPPLEMENTARY_HEALTH_RATE,
  getInsuredSalary
} from '../../data/calculators/taiwanInsurance';

export interface SalaryCalculationInput {
  salary: number;
  bonusMonths: number;
  pensionRate: number;
}

export interface SalaryCalculationResult {
  labor: number;
  health: number;
  penS: number;
  mNet: number;
  tSave: number;
  yNet: number;
  employerLabor: number;
  employerHealth: number;
  employerPension: number;
  empCost: number;
  tCost: number;
  laborGrade: number;
  healthGrade: number;
  pensionBasis: number;
}

export const estimateAnnualSalaryIncome = (salary: number, bonusMonths: number): number => {
  const normalizedSalary = Number.isFinite(salary) ? Math.max(0, salary) : 0;
  const normalizedBonusMonths = Number.isFinite(bonusMonths) ? Math.max(0, bonusMonths) : 0;
  return Math.round(normalizedSalary * (12 + normalizedBonusMonths));
};

export const calculateSalaryBreakdown = (
  input: SalaryCalculationInput
): SalaryCalculationResult => {
  const salary = new Decimal(Number.isFinite(input.salary) ? Math.max(0, input.salary) : 0);
  const bonusMonths = new Decimal(Number.isFinite(input.bonusMonths) ? Math.max(0, input.bonusMonths) : 0);
  const pensionRate = new Decimal(Number.isFinite(input.pensionRate) ? Math.max(0, input.pensionRate) : 0);

  const laborGrade = new Decimal(
    getInsuredSalary(salary.toNumber(), LABOR_INSURANCE_GRADES, LABOR_INSURANCE_MAX)
  );
  const healthGrade = new Decimal(
    getInsuredSalary(salary.toNumber(), HEALTH_INSURANCE_GRADES, HEALTH_INSURANCE_MAX)
  );
  const pensionBasis = new Decimal(
    Math.min(
      getInsuredSalary(salary.toNumber(), HEALTH_INSURANCE_GRADES, LABOR_PENSION_MAX),
      LABOR_PENSION_MAX
    )
  );

  const labor = laborGrade.mul(LABOR_INSURANCE_RATE).mul(EMPLOYEE_LABOR_SHARE).round().toNumber();
  const health = healthGrade.mul(HEALTH_INSURANCE_RATE).mul(EMPLOYEE_HEALTH_SHARE).round().toNumber();
  const penS = pensionBasis.mul(pensionRate).div(100).round().toNumber();
  const mNet = salary.minus(labor).minus(health).minus(penS).toNumber();

  // Salary card keeps the existing quick estimate: pension self-contribution saves roughly 12% tax.
  const tSave = new Decimal(penS).mul(12).mul(0.12).round().toNumber();

  const bonusTotal = salary.mul(bonusMonths);
  const fourTimesInsured = healthGrade.mul(4);
  const suppHealthBonus = bonusTotal.gt(fourTimesInsured)
    ? bonusTotal.minus(fourTimesInsured).mul(SUPPLEMENTARY_HEALTH_RATE).round()
    : new Decimal(0);

  const employerLabor = laborGrade.mul(LABOR_INSURANCE_RATE).mul(EMPLOYER_LABOR_SHARE).round().toNumber();
  const employerHealth = healthGrade
    .mul(HEALTH_INSURANCE_RATE)
    .mul(EMPLOYER_HEALTH_SHARE)
    .mul(EMPLOYER_HEALTH_DEPENDENT_FACTOR)
    .round()
    .toNumber();
  const employerPension = pensionBasis.mul(EMPLOYER_PENSION_RATE).round().toNumber();
  const empCost = employerLabor + employerHealth + employerPension;
  const tCost = salary.plus(empCost).toNumber();

  const yNet = new Decimal(mNet)
    .mul(12)
    .plus(bonusTotal)
    .minus(suppHealthBonus)
    .plus(tSave)
    .round()
    .toNumber();

  return {
    labor,
    health,
    penS,
    mNet,
    tSave,
    yNet,
    employerLabor,
    employerHealth,
    employerPension,
    empCost,
    tCost,
    laborGrade: laborGrade.toNumber(),
    healthGrade: healthGrade.toNumber(),
    pensionBasis: pensionBasis.toNumber()
  };
};
