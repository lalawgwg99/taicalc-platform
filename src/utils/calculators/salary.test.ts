import { describe, expect, it } from 'vitest';

import { calculateSalaryBreakdown, estimateAnnualSalaryIncome } from './salary';

describe('calculateSalaryBreakdown', () => {
  it('月薪 50000 時實拿為正數且等於月薪減去各項扣除', () => {
    const r = calculateSalaryBreakdown({ salary: 50000, bonusMonths: 1, pensionRate: 6 });
    expect(r.mNet).toBe(50000 - r.labor - r.health - r.penS);
    expect(r.mNet).toBeGreaterThan(0);
    expect(r.labor).toBeGreaterThan(0);
    expect(r.health).toBeGreaterThan(0);
  });

  it('月薪為 0 時全部歸零，不顯示負實拿（2026-10-08 bug）', () => {
    const r = calculateSalaryBreakdown({ salary: 0, bonusMonths: 1, pensionRate: 6 });
    expect(r).toEqual({
      labor: 0,
      health: 0,
      penS: 0,
      mNet: 0,
      tSave: 0,
      yNet: 0,
      employerLabor: 0,
      employerHealth: 0,
      employerPension: 0,
      empCost: 0,
      tCost: 0,
      laborGrade: 0,
      healthGrade: 0,
      pensionBasis: 0
    });
  });

  it('NaN 或負數輸入視同 0，不產生非有限值', () => {
    for (const salary of [NaN, -100]) {
      const r = calculateSalaryBreakdown({ salary, bonusMonths: 0, pensionRate: 0 });
      expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
      expect(r.mNet).toBe(0);
    }
  });

  it('高薪 120000 不超過投保上限且結果合理', () => {
    const r = calculateSalaryBreakdown({ salary: 120000, bonusMonths: 0, pensionRate: 6 });
    expect(r.mNet).toBeGreaterThan(0);
    expect(r.mNet).toBeLessThan(120000);
  });
});

describe('estimateAnnualSalaryIncome', () => {
  it('50000 月薪＋1 個月年終＝650000', () => {
    expect(estimateAnnualSalaryIncome(50000, 1)).toBe(650000);
  });

  it('NaN 輸入回傳 0', () => {
    expect(estimateAnnualSalaryIncome(NaN, 1)).toBe(0);
  });
});
