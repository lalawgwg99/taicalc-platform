import { describe, expect, it } from 'vitest';

import { calculateMortgageResults, calculatePayment } from './mortgage';

describe('mortgage calculator rules', () => {
  it('calculates standard amortized monthly payment', () => {
    const payment = calculatePayment(2, 360, 10000000).toNumber();

    expect(Math.round(payment)).toBe(36962);
  });

  it('returns straight-line payment when yearly rate is zero', () => {
    const payment = calculatePayment(0, 120, 1200000).toNumber();

    expect(payment).toBe(10000);
  });

  it('reduces interest and loan term when prepayment is enabled', () => {
    const base = calculateMortgageResults({
      amountWan: 1000,
      years: 30,
      graceYears: 0,
      rate1: 2,
      rate2: 2,
      twoStageMode: false,
      stage1Months: 12,
      prepaymentMode: false,
      extraMonthly: 0,
      extraLump: 0,
      lumpYear: 3
    });

    const prepaid = calculateMortgageResults({
      amountWan: 1000,
      years: 30,
      graceYears: 0,
      rate1: 2,
      rate2: 2,
      twoStageMode: false,
      stage1Months: 12,
      prepaymentMode: true,
      extraMonthly: 5000,
      extraLump: 100,
      lumpYear: 3
    });

    expect(Math.round(base.basePay)).toBe(36962);
    expect(prepaid.interestSaved).toBeGreaterThan(0);
    expect(prepaid.monthsSaved).toBeGreaterThan(0);
    expect(prepaid.finalMonths).toBeLessThan(base.finalMonths);
  });
});
