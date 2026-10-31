import { describe, expect, it } from 'vitest';
import { calculateUnemploymentBenefit } from './unemploymentBenefit';

describe('失業給付', () => {
  it('月投保薪資 45,800、30 歲：每月 27,480、最長 6 個月、總額 164,880', () => {
    // 每月＝45,800 × 60%＝27,480；總額＝27,480 × 6＝164,880
    const r = calculateUnemploymentBenefit({ averageSalary: 45_800, age: 30, disabled: false });
    expect(r.monthly).toBe(27_480);
    expect(r.maxMonths).toBe(6);
    expect(r.maxTotal).toBe(164_880);
  });

  it('月投保薪資 45,800、50 歲：每月 27,480、最長 9 個月、總額 247,320', () => {
    // 每月＝45,800 × 60%＝27,480；總額＝27,480 × 9＝247,320
    const r = calculateUnemploymentBenefit({ averageSalary: 45_800, age: 50, disabled: false });
    expect(r.monthly).toBe(27_480);
    expect(r.maxMonths).toBe(9);
    expect(r.maxTotal).toBe(247_320);
  });

  it('月投保薪資 30,000、40 歲具身心障礙證明：每月 18,000、最長 9 個月、總額 162,000', () => {
    // 每月＝30,000 × 60%＝18,000；總額＝18,000 × 9＝162,000
    const r = calculateUnemploymentBenefit({ averageSalary: 30_000, age: 40, disabled: true });
    expect(r.monthly).toBe(18_000);
    expect(r.maxMonths).toBe(9);
    expect(r.maxTotal).toBe(162_000);
  });

  it('年齡邊界：44 歲 6 個月、滿 45 歲 9 個月', () => {
    expect(calculateUnemploymentBenefit({ averageSalary: 40_000, age: 44, disabled: false }).maxMonths).toBe(6);
    expect(calculateUnemploymentBenefit({ averageSalary: 40_000, age: 45, disabled: false }).maxMonths).toBe(9);
  });

  it('異常輸入：0、負數、空值歸零；極大值不溢出', () => {
    expect(calculateUnemploymentBenefit({ averageSalary: 0, age: 30, disabled: false }).monthly).toBe(0);
    expect(calculateUnemploymentBenefit({ averageSalary: -10_000, age: 30, disabled: false }).monthly).toBe(0);
    expect(calculateUnemploymentBenefit({ averageSalary: NaN, age: NaN, disabled: false }).monthly).toBe(0);
    // 極大值：200,000 × 60%＝120,000；6 個月＝720,000
    const huge = calculateUnemploymentBenefit({ averageSalary: 200_000, age: 30, disabled: false });
    expect(huge.monthly).toBe(120_000);
    expect(huge.maxTotal).toBe(720_000);
  });

  it('扶養加給：45,800、1 名：每月 32,060、6 個月 192,360、9 個月 288,540', () => {
    // 每月＝45,800 × 70%＝32,060；6 個月＝192,360；9 個月＝288,540
    const r6 = calculateUnemploymentBenefit({ averageSalary: 45_800, age: 30, disabled: false, dependents: 1 });
    expect(r6.monthly).toBe(32_060);
    expect(r6.maxTotal).toBe(192_360);
    const r9 = calculateUnemploymentBenefit({ averageSalary: 45_800, age: 50, disabled: false, dependents: 1 });
    expect(r9.maxTotal).toBe(288_540);
  });

  it('扶養加給：45,800、2 名：每月 36,640、6 個月 219,840、9 個月 329,760', () => {
    // 每月＝45,800 × 80%＝36,640；6 個月＝219,840；9 個月＝329,760
    const r6 = calculateUnemploymentBenefit({ averageSalary: 45_800, age: 30, disabled: false, dependents: 2 });
    expect(r6.monthly).toBe(36_640);
    expect(r6.maxTotal).toBe(219_840);
    const r9 = calculateUnemploymentBenefit({ averageSalary: 45_800, age: 50, disabled: false, dependents: 2 });
    expect(r9.maxTotal).toBe(329_760);
  });

  it('扶養人數上限與下限：3 名按 2 名計、負數按 0 名計', () => {
    expect(calculateUnemploymentBenefit({ averageSalary: 45_800, age: 30, disabled: false, dependents: 3 }).monthly).toBe(36_640);
    expect(calculateUnemploymentBenefit({ averageSalary: 45_800, age: 30, disabled: false, dependents: -1 }).monthly).toBe(27_480);
  });
});
