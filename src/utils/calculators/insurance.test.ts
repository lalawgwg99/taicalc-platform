import { describe, expect, it } from 'vitest';

import { calculateInsurancePremiums } from './insurance';

// 2026-11-17 逐元手算核實：月薪 35,000 對應勞保／健保級距皆 36,300。
// 勞保費率 12.5%（11.5%＋就保 1%）、健保 5.17%、雇主健保按平均眷口 1.56 人計（健保署自 113 年起 0.56 人）。
describe('calculateInsurancePremiums', () => {
  it('月薪 35000：勞工 908＋563＝1471，雇主 3176＋1757＋2178＝7111', () => {
    const r = calculateInsurancePremiums({ salary: 35000, role: 'employee', dependents: 0 });
    expect(r.laborBracket).toBe(36300);
    expect(r.healthBracket).toBe(36300);
    expect(r.pensionBasis).toBe(36300);
    expect(r.workerLabor).toBe(908);
    expect(r.workerHealth).toBe(563);
    expect(r.workerTotal).toBe(1471);
    expect(r.employerLabor).toBe(3176);
    expect(r.employerHealth).toBe(1757);
    expect(r.employerPension).toBe(2178);
    expect(r.employerTotal).toBe(7111);
  });

  it('月薪 29500（基本工資）：勞工 738＋458＝1196，雇主 2581＋1428＋1770＝5779', () => {
    const r = calculateInsurancePremiums({ salary: 29500, role: 'employee', dependents: 0 });
    expect(r.laborBracket).toBe(29500);
    expect(r.healthBracket).toBe(29500);
    expect(r.workerLabor).toBe(738);
    expect(r.workerHealth).toBe(458);
    expect(r.workerTotal).toBe(1196);
    expect(r.employerLabor).toBe(2581);
    expect(r.employerHealth).toBe(1428);
    expect(r.employerPension).toBe(1770);
    expect(r.employerTotal).toBe(5779);
  });
});
