import { describe, expect, it } from 'vitest';
import {
  calculateDebtConsolidation, calculateEstateTax, calculateGiftSplit, calculateLaborPension, calculateParentalBenefits,
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

  it('adds minor-child extra deduction and sibling deduction to estate tax', () => {
    // 扣除額＝2,000,000＋5,530,000＋1,120,000＋1,380,000＋5,600,000＝15,630,000
    // 淨額＝30,000,000－13,330,000－15,630,000＝1,040,000；稅額＝104,000
    const minor = calculateEstateTax({
      type: 'estate', gross: 30_000_000, debts: 2_000_000, spouse: true,
      children: 2, parents: 0, disabled: 0, otherDeductions: 0,
      minorChildren: 1, minorYears: 10, siblings: 0,
    });
    expect(minor.minorExtra).toBe(5_600_000);
    expect(minor.net).toBe(1_040_000);
    expect(minor.tax).toBe(104_000);
    // 扣除額＝1,380,000（喪葬費）＋1,120,000（兄弟姊妹 2 人）＝2,500,000
    // 淨額＝20,000,000－13,330,000－2,500,000＝4,170,000；稅額＝417,000
    const sib = calculateEstateTax({
      type: 'estate', gross: 20_000_000, debts: 0, spouse: false,
      children: 0, parents: 0, disabled: 0, otherDeductions: 0,
      minorChildren: 0, minorYears: 0, siblings: 2,
    });
    expect(sib.siblingDed).toBe(1_120_000);
    expect(sib.net).toBe(4_170_000);
    expect(sib.tax).toBe(417_000);
  });

  it('compares one-time gift vs split over two years', () => {
    // 一次給：淨額＝10,000,000－2,440,000＝7,560,000，稅＝756,000
    // 分兩年：每年淨額＝5,000,000－2,440,000＝2,560,000，稅＝256,000，合計 512,000，省 244,000
    const split = calculateGiftSplit({ gross: 10_000_000, debts: 0, otherDeductions: 0 });
    expect(split.once).toBe(756_000);
    expect(split.split).toBe(512_000);
    expect(split.saved).toBe(244_000);
    // 4,880,000 分兩年剛好每年都在免稅額內：一次給 244,000，分兩年 0
    const edge = calculateGiftSplit({ gross: 4_880_000, debts: 0, otherDeductions: 0 });
    expect(edge.once).toBe(244_000);
    expect(edge.split).toBe(0);
    expect(edge.saved).toBe(244_000);
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

  it('zeroes all outputs when debts are cleared (fee must not linger)', () => {
    const res = calculateDebtConsolidation(
      [{ balance: 0, months: 0, payment: 0 }],
      5, 5, 5_000, 0, 2_000,
    );
    expect(res.balance).toBe(0);
    expect(res.currentPayment).toBe(0);
    expect(res.currentInterest).toBe(0);
    expect(res.newPayment).toBe(0);
    expect(res.newInterest).toBe(0);
    expect(res.newCosts).toBe(0); // 開辦費不可在沒有債務時殘留
    expect(res.monthlySavings).toBe(0);
  });
});
