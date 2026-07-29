import { describe, expect, it } from 'vitest';

import { calculateProgressiveIncomeTax } from '../../data/calculators/taiwanIncomeTax';
import { calculateIncomeTax } from './incomeTax';
import { calculateInsurancePremiums } from './insurance';

describe('115-year Taiwan regulation values', () => {
  it('uses the announced 115-year income tax brackets', () => {
    expect(calculateProgressiveIncomeTax(610000)).toBe(30500);
    expect(calculateProgressiveIncomeTax(610001)).toBe(30500);
    expect(calculateProgressiveIncomeTax(1380000)).toBe(122900);
  });

  it('treats rent as a special deduction and applies the updated family deductions', () => {
    const result = calculateIncomeTax({
      salaryIncome: 1200000,
      filingStatus: 'single',
      deductionType: 'standard',
      preschoolCount: 2,
      disabilityCount: 1,
      rentDeduction: 200000
    });

    expect(result.standardDeduction).toBe(136000);
    expect(result.salarySpecialDeduction).toBe(227000);
    expect(result.disabilityDeduction).toBe(227000);
    expect(result.preschoolDeduction).toBe(375000);
    expect(result.rentSpecialDeduction).toBe(180000);
    expect(result.itemizedTotal).toBe(0);
  });

  it('uses the 115-year labor and NHI grades and contribution factors', () => {
    const employee = calculateInsurancePremiums({
      salary: 30000,
      role: 'employee',
      dependents: 0
    });
    const highIncome = calculateInsurancePremiums({
      salary: 228000,
      role: 'employee',
      dependents: 0
    });

    expect(employee.laborBracket).toBe(30300);
    expect(employee.healthBracket).toBe(30300);
    expect(employee.workerLabor).toBe(758);
    expect(employee.workerHealth).toBe(470);
    expect(employee.employerHealth).toBe(1466);
    expect(highIncome.healthBracket).toBe(228200);
  });
});
