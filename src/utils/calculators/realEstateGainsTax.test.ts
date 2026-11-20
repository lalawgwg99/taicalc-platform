import { describe, expect, it } from 'vitest';
import { calculateGainsTax, generalRate, nextBracket, normalizeHoldingPeriod } from './realEstateGainsTax';

describe('房地合一稅 2.0（個人）', () => {
  it('持有 18 個月：課稅所得 330 萬 × 45%＝1,485,000，再持有 7 個月降一級', () => {
    // 課稅所得＝12,000,000－8,000,000－200,000－500,000＝3,300,000
    const r = calculateGainsTax({
      salePrice: 12_000_000, purchasePrice: 8_000_000, costs: 200_000,
      landIncrement: 500_000, holdingMonths: 18, selfUse: false,
    });
    expect(r.taxableIncome).toBe(3_300_000);
    expect(r.rate).toBe(0.45);
    expect(r.tax).toBe(1_485_000);
    expect(r.nextBracketMonths).toBe(7);
    expect(r.nextBracketRate).toBe(0.35);
  });

  it('持有 84 個月：課稅所得 670 萬 × 20%＝1,340,000，再持有 37 個月降至 15%', () => {
    // 課稅所得＝20,000,000－12,000,000－300,000－1,000,000＝6,700,000
    const r = calculateGainsTax({
      salePrice: 20_000_000, purchasePrice: 12_000_000, costs: 300_000,
      landIncrement: 1_000_000, holdingMonths: 84, selfUse: false,
    });
    expect(r.taxableIncome).toBe(6_700_000);
    expect(r.rate).toBe(0.2);
    expect(r.tax).toBe(1_340_000);
    expect(r.nextBracketMonths).toBe(37);
    expect(r.nextBracketRate).toBe(0.15);
  });

  it('自用滿 6 年：課稅所得 900 萬，超過 400 萬部分 500 萬 × 10%＝500,000', () => {
    // 課稅所得＝25,000,000－15,000,000－200,000－800,000＝9,000,000
    const r = calculateGainsTax({
      salePrice: 25_000_000, purchasePrice: 15_000_000, costs: 200_000,
      landIncrement: 800_000, holdingMonths: 84, selfUse: true,
    });
    expect(r.taxableIncome).toBe(9_000_000);
    expect(r.selfUseApplied).toBe(true);
    expect(r.tax).toBe(500_000);
  });

  it('自用但未滿 6 年：不適用優惠，改按一般稅率 35%，距優惠還差 12 個月', () => {
    // 課稅所得＝15,000,000－10,000,000－100,000－0＝4,900,000；4,900,000 × 35%＝1,715,000
    const r = calculateGainsTax({
      salePrice: 15_000_000, purchasePrice: 10_000_000, costs: 100_000,
      landIncrement: 0, holdingMonths: 60, selfUse: true,
    });
    expect(r.selfUseApplied).toBe(false);
    expect(r.rate).toBe(0.35);
    expect(r.tax).toBe(1_715_000);
    expect(r.selfUseShortfallMonths).toBe(12);
  });

  it('級距邊界：24 個月 45%、25 個月 35%、60 個月 35%、61 個月 20%、120 個月 20%、121 個月 15%', () => {
    expect(generalRate(24)).toBe(0.45);
    expect(generalRate(25)).toBe(0.35);
    expect(generalRate(60)).toBe(0.35);
    expect(generalRate(61)).toBe(0.2);
    expect(generalRate(120)).toBe(0.2);
    expect(generalRate(121)).toBe(0.15);
    expect(nextBracket(121)).toBeNull();
  });

  it('虧損與異常輸入：課稅所得歸零、稅額歸零、極大值不溢出', () => {
    const loss = calculateGainsTax({
      salePrice: 8_000_000, purchasePrice: 10_000_000, costs: 0,
      landIncrement: 0, holdingMonths: 12, selfUse: false,
    });
    expect(loss.taxableIncome).toBe(0);
    expect(loss.tax).toBe(0);
    const zero = calculateGainsTax({
      salePrice: 0, purchasePrice: 0, costs: 0,
      landIncrement: 0, holdingMonths: 0, selfUse: false,
    });
    expect(zero.tax).toBe(0);
    const neg = calculateGainsTax({
      salePrice: -5_000_000, purchasePrice: -1_000_000, costs: -100,
      landIncrement: -50, holdingMonths: -3, selfUse: false,
    });
    expect(neg.tax).toBe(0);
    const nan = calculateGainsTax({
      salePrice: NaN, purchasePrice: NaN, costs: NaN,
      landIncrement: NaN, holdingMonths: NaN, selfUse: false,
    });
    expect(nan.tax).toBe(0);
    // 極大值：課稅所得 9 億 × 15%＝1 億 3,500 萬
    const huge = calculateGainsTax({
      salePrice: 1_000_000_000, purchasePrice: 100_000_000, costs: 0,
      landIncrement: 0, holdingMonths: 200, selfUse: false,
    });
    expect(huge.taxableIncome).toBe(900_000_000);
    expect(huge.tax).toBe(135_000_000);
  });

  it('臨界點再持有月數：24／60／120 個月整都要再 1 個月才降級（2026-11-16 稽核）', () => {
    // 24 個月整仍屬「2 年以內」45%，要到第 25 個月才降至 35%；舊版回傳 0 個月
    expect(nextBracket(24)).toEqual({ months: 1, rate: 0.35 });
    expect(nextBracket(60)).toEqual({ months: 1, rate: 0.2 });
    expect(nextBracket(120)).toEqual({ months: 1, rate: 0.15 });
    expect(nextBracket(23)).toEqual({ months: 2, rate: 0.35 });
    expect(nextBracket(121)).toBeNull();
  });

  it('持有期間正規化：1 年 12 個月＝2 年 0 個月＝24 個月（不是 23）', () => {
    expect(normalizeHoldingPeriod(1, 12)).toEqual({ years: 2, months: 0, totalMonths: 24 });
    expect(normalizeHoldingPeriod(1, 6)).toEqual({ years: 1, months: 6, totalMonths: 18 });
    expect(normalizeHoldingPeriod(1, 23)).toEqual({ years: 2, months: 11, totalMonths: 35 });
    expect(normalizeHoldingPeriod(2, -3)).toEqual({ years: 2, months: 0, totalMonths: 24 });
  });

  it('臨界點驗算：1 年 1 個月（13 個月）再持有 12 個月、1 年 6 個月（18 個月）再持有 7 個月', () => {
    const base = {
      salePrice: 12_000_000, purchasePrice: 8_000_000, costs: 200_000,
      landIncrement: 0, selfUse: false,
    };
    const r13 = calculateGainsTax({ ...base, holdingMonths: 13 });
    expect(r13.rate).toBe(0.45);
    expect(r13.nextBracketMonths).toBe(12);
    const r18 = calculateGainsTax({ ...base, holdingMonths: 18 });
    expect(r18.nextBracketMonths).toBe(7);
  });
});
