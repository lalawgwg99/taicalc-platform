import { describe, expect, it } from 'vitest';
import {
  calculateDebtConsolidation, calculateEstateTax, calculateLaborPension, calculateParentalBenefits,
  calculateSeparation, estimateResaleRate, impliedAnnualRate, monthlyPayment, vehicleTaxes,
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

  it('returns zero when labor pension salary or years is empty/zero/negative', () => {
    // 0 年資或 0 薪資不應顯示 A 式的 3,000 元加給（曾經誤顯示月領 3,000）
    expect(calculateLaborPension(0, 0, 65, true).monthly).toBe(0);
    expect(calculateLaborPension(0, 30, 65, false).monthly).toBe(0);
    expect(calculateLaborPension(45_800, 0, 65, false).monthly).toBe(0);
    expect(calculateLaborPension(NaN, NaN, 65, true).monthly).toBe(0);
    expect(calculateLaborPension(-1000, -5, 65, false).monthly).toBe(0);
    expect(calculateLaborPension(0, 0, 65, true).annual).toBe(0);
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

  it('estimates car resale rate on a declining curve', () => {
    expect(estimateResaleRate(0)).toBe(88);
    expect(estimateResaleRate(1)).toBe(79);
    expect(estimateResaleRate(5)).toBe(51);
    expect(estimateResaleRate(8)).toBe(37);
    expect(estimateResaleRate(10)).toBe(29);
    expect(estimateResaleRate(-3)).toBe(88);
    expect(estimateResaleRate(30)).toBeGreaterThanOrEqual(5);
    expect(estimateResaleRate(3)).toBeGreaterThan(estimateResaleRate(8));
  });

  it('derives annual rate from balance, payment and months', () => {
    // 餘額 828,931、月付 17,385、剩 62 期 → 約 10.5%
    const r = impliedAnnualRate(828_931, 17_385, 62);
    expect(r).toBeGreaterThan(9);
    expect(r).toBeLessThan(12);
    expect(impliedAnnualRate(0, 100, 12)).toBe(0);
    expect(impliedAnnualRate(100_000, 1_000, 12)).toBe(0); // 月付連本金都不夠
  });

  it('compares debt consolidation with monthly and total view', () => {
    const res = calculateDebtConsolidation(
      [{ balance: 828_931, months: 62, payment: 17_385 }],
      6, 7, 0, 0, 0,
    );
    // 繼續繳總利息 = 17,385×62 − 828,931
    expect(res.currentInterest).toBe(17_385 * 62 - 828_931);
    expect(res.currentPayment).toBe(17_385);
    // 轉 7 年 6%：月付下降、總成本也變少（利率 10.5%→6% 的效果大過期限拉長）
    expect(res.monthlySavings).toBeGreaterThan(0);
    expect(res.totalCostDiff).toBeLessThan(0);
    expect(res.impliedRates[0]).toBeGreaterThan(9);
    // 同利率只拉長期限：月付降、總成本增
    const res2 = calculateDebtConsolidation(
      [{ balance: 828_931, months: 62, payment: 17_385 }],
      10.5, 7, 0, 0, 0,
    );
    expect(res2.monthlySavings).toBeGreaterThan(0);
    expect(res2.totalCostDiff).toBeGreaterThan(0);
  });
});
