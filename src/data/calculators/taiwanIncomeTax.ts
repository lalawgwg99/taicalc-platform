export type FilingStatus = 'single' | 'married';

export interface IncomeTaxBracket {
  min: number;
  max: number;
  rate: number;
  subtract: number;
}

// 115 年度（2026 所得，2027 年 5 月申報）財政部公告金額。
export const EXEMPTION_PER_PERSON = 101000;
export const SALARY_SPECIAL_MAX = 227000;
export const STANDARD_DEDUCTION_SINGLE = 136000;
export const STANDARD_DEDUCTION_MARRIED = 272000;
export const SAVINGS_DEDUCTION_MAX = 270000;
export const LONG_TERM_CARE_PER_PERSON = 180000;
export const DISABILITY_DEDUCTION_PER_PERSON = 227000;
export const PRESCHOOL_FIRST_CHILD = 150000;
export const PRESCHOOL_ADDITIONAL_CHILD = 225000;
export const INSURANCE_DEDUCTION_PER_PERSON = 24000;
export const MORTGAGE_INTEREST_DEDUCTION_MAX = 300000;
export const RENT_DEDUCTION_MAX = 180000;
export const DIVIDEND_CREDIT_RATE = 0.085;
export const DIVIDEND_CREDIT_MAX = 80000;
export const SEPARATE_DIVIDEND_TAX_RATE = 0.28;

export const TAX_BRACKETS: readonly IncomeTaxBracket[] = [
  { min: 0, max: 610000, rate: 0.05, subtract: 0 },
  { min: 610000, max: 1380000, rate: 0.12, subtract: 42700 },
  { min: 1380000, max: 2770000, rate: 0.2, subtract: 153100 },
  { min: 2770000, max: 5190000, rate: 0.3, subtract: 430100 },
  { min: 5190000, max: Number.POSITIVE_INFINITY, rate: 0.4, subtract: 949100 }
];

export const getStandardDeduction = (filingStatus: FilingStatus): number => (
  filingStatus === 'married' ? STANDARD_DEDUCTION_MARRIED : STANDARD_DEDUCTION_SINGLE
);

export const getIncomeTaxBracket = (taxableIncome: number): IncomeTaxBracket => {
  const normalizedIncome = Math.max(0, taxableIncome);
  return TAX_BRACKETS.find((bracket) => normalizedIncome <= bracket.max)
    ?? TAX_BRACKETS[TAX_BRACKETS.length - 1];
};

export const calculateProgressiveIncomeTax = (taxableIncome: number): number => {
  if (taxableIncome <= 0) {
    return 0;
  }

  const bracket = getIncomeTaxBracket(taxableIncome);
  return Math.max(0, Math.round(taxableIncome * bracket.rate - bracket.subtract));
};
