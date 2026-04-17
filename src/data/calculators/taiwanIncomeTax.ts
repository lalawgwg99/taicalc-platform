export type FilingStatus = 'single' | 'married';

export interface IncomeTaxBracket {
  min: number;
  max: number;
  rate: number;
  subtract: number;
}

export const EXEMPTION_PER_PERSON = 97000;
export const SALARY_SPECIAL_MAX = 218000;
export const STANDARD_DEDUCTION_SINGLE = 131000;
export const STANDARD_DEDUCTION_MARRIED = 262000;
export const SAVINGS_DEDUCTION_MAX = 270000;
export const LONG_TERM_CARE_PER_PERSON = 180000;
export const DISABILITY_DEDUCTION_PER_PERSON = 218000;
export const PRESCHOOL_DEDUCTION_PER_PERSON = 150000;
export const INSURANCE_DEDUCTION_PER_PERSON = 24000;
export const MORTGAGE_INTEREST_DEDUCTION_MAX = 300000;
export const RENT_DEDUCTION_MAX = 120000;
export const DIVIDEND_CREDIT_RATE = 0.085;
export const DIVIDEND_CREDIT_MAX = 80000;
export const SEPARATE_DIVIDEND_TAX_RATE = 0.28;

export const TAX_BRACKETS: readonly IncomeTaxBracket[] = [
  { min: 0, max: 590000, rate: 0.05, subtract: 0 },
  { min: 590000, max: 1330000, rate: 0.12, subtract: 41300 },
  { min: 1330000, max: 2660000, rate: 0.2, subtract: 147700 },
  { min: 2660000, max: 4980000, rate: 0.3, subtract: 413700 },
  { min: 4980000, max: Number.POSITIVE_INFINITY, rate: 0.4, subtract: 911700 }
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
