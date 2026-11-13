import Decimal from 'decimal.js';
import { describe, expect, it } from 'vitest';

import { getInsuredSalary } from '../../data/calculators/taiwanInsurance';
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

  it('自提 6% 時整年總共不含節稅概估，避免與稅務區實算稅額重複計算（2026-11-03 bug）', () => {
    const r = calculateSalaryBreakdown({ salary: 45000, bonusMonths: 0, pensionRate: 6 });
    expect(r.mNet).toBe(40397);
    expect(r.penS).toBe(2748);
    // 稅前整年實拿＝月實拿×12，不再加自提×12% 的概估省稅（舊值 488721 多算 3957）
    expect(r.yNet).toBe(r.mNet * 12);
    expect(r.yNet).toBe(484764);
  });

  // 勞保與健保／勞退是四張不同的分級表，上限各異（115 年：勞保 45,800、
  // 職保 72,800、健保 313,000、勞退 150,000）。月薪 50,000 時勞保投保薪資
  // 封頂 45,800（勞保費 1,145），健保投保金額才走到 50,600（健保費 785），
  // 實拿 48,070。2026-11-08 手機檢查稽核曾誤把勞退／健保級距 50,600 當成
  // 勞保級距、要求改成 1,265／47,950，經勞動部勞保投保薪資分級表核實為誤判，
  // 本測試釘住正確值，防止日後被「修正」成錯誤數字。
  it('勞保 11 級邊界：每級上限取該級、超過 1 元取下一級、超過 45,800 封頂', () => {
    const grades = [29500, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800];
    for (let i = 0; i < grades.length; i++) {
      const g = grades[i];
      expect(calculateSalaryBreakdown({ salary: g, bonusMonths: 0, pensionRate: 0 }).laborGrade).toBe(g);
      if (i < grades.length - 1) {
        expect(calculateSalaryBreakdown({ salary: g + 1, bonusMonths: 0, pensionRate: 0 }).laborGrade).toBe(grades[i + 1]);
      }
    }
    expect(calculateSalaryBreakdown({ salary: 45801, bonusMonths: 0, pensionRate: 0 }).laborGrade).toBe(45800);
    expect(calculateSalaryBreakdown({ salary: 300000, bonusMonths: 0, pensionRate: 0 }).laborGrade).toBe(45800);
  });

  it('月薪 50,000：勞保 1,145（上限 45,800）、健保 785（50,600）、實拿 48,070', () => {
    const r = calculateSalaryBreakdown({ salary: 50000, bonusMonths: 0, pensionRate: 0 });
    expect(r.laborGrade).toBe(45800);
    expect(r.healthGrade).toBe(50600);
    expect(r.labor).toBe(1145);
    expect(r.health).toBe(785);
    expect(r.mNet).toBe(48070);
    const s6 = calculateSalaryBreakdown({ salary: 50000, bonusMonths: 0, pensionRate: 6 });
    expect(s6.penS).toBe(3036);
    expect(s6.mNet).toBe(45034);
  });

  it('月薪 60,000：勞保仍 1,145、健保 943（60,800）、實拿 57,912', () => {
    const r = calculateSalaryBreakdown({ salary: 60000, bonusMonths: 0, pensionRate: 0 });
    expect(r.laborGrade).toBe(45800);
    expect(r.healthGrade).toBe(60800);
    expect(r.labor).toBe(1145);
    expect(r.health).toBe(943);
    expect(r.mNet).toBe(57912);
    const s6 = calculateSalaryBreakdown({ salary: 60000, bonusMonths: 0, pensionRate: 6 });
    expect(s6.penS).toBe(3648);
    expect(s6.mNet).toBe(54264);
  });

  it('對照表其餘兩列：30,000 與 40,000 與頁面數字一致', () => {
    const r30 = calculateSalaryBreakdown({ salary: 30000, bonusMonths: 0, pensionRate: 0 });
    expect([r30.laborGrade, r30.healthGrade, r30.labor, r30.health, r30.mNet]).toEqual([30300, 30300, 758, 470, 28772]);
    const r30s = calculateSalaryBreakdown({ salary: 30000, bonusMonths: 0, pensionRate: 6 });
    expect([r30s.penS, r30s.mNet]).toEqual([1818, 26954]);
    const r40 = calculateSalaryBreakdown({ salary: 40000, bonusMonths: 0, pensionRate: 0 });
    expect([r40.laborGrade, r40.healthGrade, r40.labor, r40.health, r40.mNet]).toEqual([40100, 40100, 1003, 622, 38375]);
    const r40s = calculateSalaryBreakdown({ salary: 40000, bonusMonths: 0, pensionRate: 6 });
    expect([r40s.penS, r40s.mNet]).toEqual([2406, 35969]);
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

// 2027 年三級距實拿對照表（薪資頁 2027/1/1 生效預估表，2026-11-14 第 15 輪）：
// 勞保費率預估 13%（勞工負擔 20%）、健保 5.17%（勞工負擔 30%）。2027 年級距表
// 依最低工資調整推估：第 1 級 30,900 元（30,300 級隨最低工資超過而刪除，其餘不變），
// 正式數字以勞保局、健保署公告為準。關鍵邊界：月薪剛好等於級距值取該級（30,900→30,900，
// 不是 31,800）——2027 最低工資指南文曾誤寫 31,800／勞保 827／實拿 29,580，經勞保局
// 「勞工保險投保薪資分級表」（第 1 級「29,500 元以下」→29,500 元）核實為誤，本測試釘住正確值。
describe('2027 年實拿對照表（預估）', () => {
  const LABOR_GRADES_2027 = [30900, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800];
  const HEALTH_GRADES_2027 = [
    30900, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800, 48200, 50600, 53000,
    55400, 57800, 60800
  ];

  const calc2027 = (salary: number, pensionRate: number) => {
    const laborGrade = getInsuredSalary(salary, LABOR_GRADES_2027, 45800);
    const healthGrade = getInsuredSalary(salary, HEALTH_GRADES_2027, 313000);
    const labor = new Decimal(laborGrade).mul(0.13).mul(0.2).round().toNumber();
    const health = new Decimal(healthGrade).mul(0.0517).mul(0.3).round().toNumber();
    const penS = new Decimal(Math.min(healthGrade, 150000)).mul(pensionRate).div(100).round().toNumber();
    return { laborGrade, healthGrade, labor, health, penS, mNet: salary - labor - health - penS };
  };

  it('月薪剛好等於級距值取該級：30,900→30,900（不是 31,800）', () => {
    expect(getInsuredSalary(30900, LABOR_GRADES_2027, 45800)).toBe(30900);
    expect(getInsuredSalary(30900, HEALTH_GRADES_2027, 313000)).toBe(30900);
  });

  it('月薪 30,900：勞保 803、健保 479、實拿 29,618、自提 6% 後 27,764', () => {
    const r = calc2027(30900, 0);
    expect([r.laborGrade, r.healthGrade, r.labor, r.health, r.mNet]).toEqual([30900, 30900, 803, 479, 29618]);
    expect(calc2027(30900, 6).mNet).toBe(27764);
    expect(calc2027(30900, 6).penS).toBe(1854);
  });

  it('月薪 45,000：勞保 1,191（上限 45,800）、健保 710、實拿 43,099、自提 6% 後 40,351', () => {
    const r = calc2027(45000, 0);
    expect([r.laborGrade, r.healthGrade, r.labor, r.health, r.mNet]).toEqual([45800, 45800, 1191, 710, 43099]);
    expect(calc2027(45000, 6).mNet).toBe(40351);
    expect(calc2027(45000, 6).penS).toBe(2748);
  });

  it('月薪 60,000：勞保 1,191、健保 943（60,800）、實拿 57,866、自提 6% 後 54,218', () => {
    const r = calc2027(60000, 0);
    expect([r.laborGrade, r.healthGrade, r.labor, r.health, r.mNet]).toEqual([45800, 60800, 1191, 943, 57866]);
    expect(calc2027(60000, 6).mNet).toBe(54218);
    expect(calc2027(60000, 6).penS).toBe(3648);
  });
});
