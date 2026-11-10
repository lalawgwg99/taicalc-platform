import { describe, expect, it } from 'vitest';

import {
  calculateNetBonus,
  calculateSuppFee,
  calculateSuppThreshold,
  calculateWithholdingTax
} from './yearEndBonus';

// 手算驗算（投保金額皆以 45,800 元為例，補充保費門檻 45,800 × 4 = 183,200 元）：
// 案例 1：年終 80,000（未達起扣點）→ 預扣 0、補充保費 0、實拿 80,000
// 案例 2：年終 100,000 → 預扣 100,000 × 5% = 5,000、補充保費 0、實拿 95,000
// 案例 3：年終 250,000 → 預扣 12,500、補充保費 (250,000 − 183,200) × 2.11% = 66,800 × 2.11% = 1,409.48 → 1,409、實拿 236,091
describe('calculateWithholdingTax', () => {
  it('案例 1：年終 80,000 未達起扣點，免預扣', () => {
    expect(calculateWithholdingTax(80000)).toBe(0);
  });

  it('案例 2：年終 100,000 預扣 5,000', () => {
    expect(calculateWithholdingTax(100000)).toBe(5000);
  });

  it('案例 3：年終 250,000 預扣 12,500', () => {
    expect(calculateWithholdingTax(250000)).toBe(12500);
  });

  it('邊界：90,500 免扣、90,501 扣 4,525（90,501 × 5% = 4,525.05 四捨五入）', () => {
    expect(calculateWithholdingTax(90500)).toBe(0);
    expect(calculateWithholdingTax(90501)).toBe(4525);
  });

  it('0、負數、NaN 一律回 0', () => {
    expect(calculateWithholdingTax(0)).toBe(0);
    expect(calculateWithholdingTax(-1000)).toBe(0);
    expect(calculateWithholdingTax(NaN)).toBe(0);
  });
});

describe('calculateSuppFee', () => {
  it('補充保費門檻：投保金額 45,800 × 4 = 183,200', () => {
    expect(calculateSuppThreshold(45800)).toBe(183200);
  });

  it('案例 1、2：年終未超過門檻，補充保費為 0', () => {
    expect(calculateSuppFee(80000, 45800)).toBe(0);
    expect(calculateSuppFee(100000, 45800)).toBe(0);
  });

  it('案例 3：年終 250,000 超過 66,800，補充保費 1,409', () => {
    expect(calculateSuppFee(250000, 45800)).toBe(1409);
  });

  it('邊界：剛好等於門檻不扣；年終 200,000 超過 16,800，補充保費 354', () => {
    expect(calculateSuppFee(183200, 45800)).toBe(0);
    expect(calculateSuppFee(200000, 45800)).toBe(354);
  });

  it('0、負數、NaN 獎金一律回 0；投保金額為 0 時門檻為 0，全額計費（與舊元件行為一致）', () => {
    expect(calculateSuppFee(0, 45800)).toBe(0);
    expect(calculateSuppFee(250000, 0)).toBe(5275);
    expect(calculateSuppFee(NaN, 45800)).toBe(0);
  });
});

describe('calculateNetBonus', () => {
  it('案例 1：80,000 全拿', () => {
    expect(calculateNetBonus(80000, 45800)).toBe(80000);
  });

  it('案例 2：100,000 − 5,000 = 95,000', () => {
    expect(calculateNetBonus(100000, 45800)).toBe(95000);
  });

  it('案例 3：250,000 − 12,500 − 1,409 = 236,091', () => {
    expect(calculateNetBonus(250000, 45800)).toBe(236091);
  });

  it('90,501 魔咒：實拿 85,976，比 90,500 全拿少 4,524', () => {
    expect(calculateNetBonus(90501, 45800)).toBe(85976);
    expect(calculateNetBonus(90500, 45800)).toBe(90500);
  });
});
