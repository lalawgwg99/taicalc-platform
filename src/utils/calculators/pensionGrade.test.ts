import { describe, expect, it } from 'vitest';
import { getPensionGrade } from './pensionGrade';

describe('getPensionGrade', () => {
  it('maps salary to the next grade up, not the raw salary', () => {
    // 月薪 45,000 元對應提繳工資 45,800 元（勞保局舉例）；自提 6% 為每月 2,748 元
    expect(getPensionGrade(45000)).toBe(45800);
    expect(getPensionGrade(50000)).toBe(50600);
    expect(getPensionGrade(29500)).toBe(29500);
    expect(getPensionGrade(45800)).toBe(45800);
    expect(getPensionGrade(45801)).toBe(48200);
  });

  it('clamps to the grade range', () => {
    expect(getPensionGrade(1000)).toBe(1500);
    expect(getPensionGrade(200000)).toBe(150000);
  });
});
