import { describe, it, expect } from 'vitest';
import { calculateIncomeTax } from './incomeTax';

const base = {
  filingStatus: 'single' as const,
  deductionType: 'standard' as const,
  dividendTaxMode: 'combined' as const,
  salaryIncome: 1_000_000,
  spouseSalary: 0,
  dividendIncome: 0,
  interestIncome: 0,
  rentalIncome: 0,
  otherIncome: 0,
  laborPensionSelfContribution: 0,
  dependents: 0,
  longTermCareEligibleCount: 0,
  disabilityCount: 0,
  preschoolCount: 0,
  rentDeduction: 0,
  donationDeduction: 0,
  insuranceDeduction: 0,
  medicalDeduction: 0,
  mortgageDeduction: 0,
  politicalDeduction: 0,
};

describe('incomeTax 115 年度新制', () => {
  it('單身年薪 100 萬、無扶養 → 應納稅額 26,800（免稅額 101,000＋標扣 136,000＋薪扣 227,000）', () => {
    const r = calculateIncomeTax(base);
    expect(r.exemptionAmount).toBe(101_000);
    expect(r.taxableIncome).toBe(536_000);
    expect(r.netTax).toBe(26_800);
  });

  it('未成年子女 2 人 → 免稅額 101,000＋2×151,500＝404,000，稅額 11,650', () => {
    const r = calculateIncomeTax({ ...base, dependents: 2, minorChildren: 2 });
    expect(r.exemptionAmount).toBe(404_000);
    expect(r.taxableIncome).toBe(233_000);
    expect(r.netTax).toBe(11_650);
  });

  it('未成年子女數超過扶養人數時只算到扶養人數（clamp）', () => {
    const r = calculateIncomeTax({ ...base, dependents: 1, minorChildren: 5 });
    expect(r.exemptionAmount).toBe(101_000 + 151_500);
  });

  it('minorChildren 為 NaN／未填 → 視為 0，不影響結果', () => {
    const r = calculateIncomeTax({ ...base, dependents: 1, minorChildren: NaN });
    expect(r.exemptionAmount).toBe(202_000);
  });

  it('已婚＋1 名未成年子女 → 免稅額 2×101,000＋151,500', () => {
    const r = calculateIncomeTax({ ...base, filingStatus: 'married', dependents: 1, minorChildren: 1 });
    expect(r.totalExemptions).toBe(3);
    expect(r.exemptionAmount).toBe(202_000 + 151_500);
  });
});
