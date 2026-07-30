import { describe, expect, it } from 'vitest';
import {
  calculateEstateTax, calculateLaborPension, calculateParentalBenefits,
  calculateSeparation, monthlyPayment, vehicleTaxes,
} from './decisionTools';

describe('decision calculators', () => {
  it('calculates standard amortized payments', () => {
    expect(Math.round(monthlyPayment(1_000_000, 2, 360))).toBe(3696);
    expect(monthlyPayment(120_000, 0, 12)).toBe(10_000);
  });

  it('uses Taiwan vehicle tax tables and EV exemption', () => {
    expect(vehicleTaxes(500, 'gasoline')).toEqual({ licenseTax: 1620, fuelFee: 2160 });
    expect(vehicleTaxes(1800, 'gasoline')).toEqual({ licenseTax: 7120, fuelFee: 4800 });
    expect(vehicleTaxes(1800, 'hybrid')).toEqual({ licenseTax: 7120, fuelFee: 4800 });
    expect(vehicleTaxes(2000, 'diesel')).toEqual({ licenseTax: 11230, fuelFee: 3708 });
    expect(vehicleTaxes(0, 'electric')).toEqual({ licenseTax: 0, fuelFee: 0 });
  });

  it('caps new-system severance at six months and applies notice days', () => {
    const result = calculateSeparation({
      averageMonthlyWage: 60_000, regularMonthlyWage: 60_000, serviceYears: 15,
      noticeDaysGiven: 10, unusedLeaveDays: 5, workedDays: 15,
    });
    expect(result.severance).toBe(360_000);
    expect(result.noticePay).toBe(40_000);
    expect(result.total).toBe(440_000);
  });

  it('selects the higher labor insurance pension formula and early reduction', () => {
    const result = calculateLaborPension(45_800, 30, 60, true);
    expect(result.formula).toBe('B 式');
    expect(result.ageAdjustment).toBeCloseTo(-0.2);
    expect(result.monthly).toBe(17_038);
  });

  it('applies 2026 estate and gift exemptions progressively', () => {
    expect(calculateEstateTax({
      type: 'gift', gross: 3_000_000, debts: 0, spouse: false,
      children: 0, parents: 0, disabled: 0, otherDeductions: 0,
    }).tax).toBe(56_000);
    expect(calculateEstateTax({
      type: 'estate', gross: 20_000_000, debts: 0, spouse: false,
      children: 0, parents: 0, disabled: 0, otherDeductions: 0,
    }).tax).toBe(529_000);
  });

  it('limits parental leave benefit to six months per parent', () => {
    const result = calculateParentalBenefits({
      insuredSalary: 40_000, parent1Months: 8, parent2Months: 6,
      childOrder: 2, allowanceMonths: 12, publicCare: false,
    });
    expect(result.leaveBenefit).toBe(384_000);
    expect(result.allowanceMonthly).toBe(6000);
  });
});
