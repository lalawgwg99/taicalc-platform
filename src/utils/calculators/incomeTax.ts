import {
  DISABILITY_DEDUCTION_PER_PERSON,
  DIVIDEND_CREDIT_MAX,
  DIVIDEND_CREDIT_RATE,
  EXEMPTION_PER_PERSON,
  INSURANCE_DEDUCTION_PER_PERSON,
  LONG_TERM_CARE_PER_PERSON,
  MORTGAGE_INTEREST_DEDUCTION_MAX,
  PRESCHOOL_DEDUCTION_PER_PERSON,
  RENT_DEDUCTION_MAX,
  SALARY_SPECIAL_MAX,
  SAVINGS_DEDUCTION_MAX,
  SEPARATE_DIVIDEND_TAX_RATE,
  calculateProgressiveIncomeTax,
  getIncomeTaxBracket,
  getStandardDeduction,
  type FilingStatus,
  type IncomeTaxBracket
} from '../../data/calculators/taiwanIncomeTax';

export type DeductionType = 'standard' | 'itemized';
export type DividendTaxMode = 'combined' | 'separate';

export interface IncomeTaxCalculationInput {
  salaryIncome?: number;
  spouseSalary?: number;
  dividendIncome?: number;
  interestIncome?: number;
  rentalIncome?: number;
  otherIncome?: number;
  filingStatus?: FilingStatus;
  dependents?: number;
  longTermCareEligibleCount?: number;
  disabilityCount?: number;
  preschoolCount?: number;
  deductionType?: DeductionType;
  dividendTaxMode?: DividendTaxMode;
  laborPensionSelfContribution?: number;
  donationDeduction?: number;
  insuranceDeduction?: number;
  medicalDeduction?: number;
  mortgageDeduction?: number;
  rentDeduction?: number;
  politicalDeduction?: number;
  withholdingTax?: number;
}

export interface IncomeTaxCalculationResult {
  grossIncome: number;
  salarySpecialDeduction: number;
  totalExemptions: number;
  exemptionAmount: number;
  standardDeduction: number;
  savingsDeduction: number;
  longTermCareDeduction: number;
  disabilityDeduction: number;
  preschoolDeduction: number;
  laborPensionSelfContribution: number;
  itemizedTotal: number;
  recommendation: DeductionType;
  taxableIncome: number;
  baseTax: number;
  dividendCredit: number;
  dividendSeparateTax: number;
  totalTax: number;
  currentBracket: IncomeTaxBracket;
  taxBracketLabel: string;
  totalIncomeForDisplay: number;
  afterTaxIncome: number;
  effectiveRate: number;
  afterTaxRate: number;
  netTax: number;
}

const normalizeAmount = (value: number | undefined): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value ?? 0);
};

const normalizeCount = (value: number | undefined): number => Math.floor(normalizeAmount(value));

const calculateSalarySpecialDeduction = (
  salaryIncome: number,
  spouseSalary: number,
  filingStatus: FilingStatus
): number => {
  if (filingStatus === 'married' && spouseSalary > 0) {
    return Math.min(salaryIncome, SALARY_SPECIAL_MAX) + Math.min(spouseSalary, SALARY_SPECIAL_MAX);
  }

  return Math.min(salaryIncome, SALARY_SPECIAL_MAX);
};

export const calculateIncomeTax = (
  input: IncomeTaxCalculationInput
): IncomeTaxCalculationResult => {
  const filingStatus = input.filingStatus ?? 'single';
  const deductionType = input.deductionType ?? 'standard';
  const dividendTaxMode = input.dividendTaxMode ?? 'combined';

  const salaryIncome = normalizeAmount(input.salaryIncome);
  const spouseSalary = filingStatus === 'married' ? normalizeAmount(input.spouseSalary) : 0;
  const dividendIncome = normalizeAmount(input.dividendIncome);
  const interestIncome = normalizeAmount(input.interestIncome);
  const rentalIncome = normalizeAmount(input.rentalIncome);
  const otherIncome = normalizeAmount(input.otherIncome);
  const laborPensionSelfContribution = normalizeAmount(input.laborPensionSelfContribution);

  const grossIncome = salaryIncome
    + (dividendTaxMode === 'combined' ? dividendIncome : 0)
    + interestIncome
    + rentalIncome
    + otherIncome
    + spouseSalary;

  const totalExemptions = 1 + (filingStatus === 'married' ? 1 : 0) + normalizeCount(input.dependents);
  const exemptionAmount = totalExemptions * EXEMPTION_PER_PERSON;
  const standardDeduction = getStandardDeduction(filingStatus);
  const salarySpecialDeduction = calculateSalarySpecialDeduction(salaryIncome, spouseSalary, filingStatus);
  const savingsDeduction = Math.min(interestIncome, SAVINGS_DEDUCTION_MAX);
  const longTermCareDeduction = normalizeCount(input.longTermCareEligibleCount) * LONG_TERM_CARE_PER_PERSON;
  const disabilityDeduction = normalizeCount(input.disabilityCount) * DISABILITY_DEDUCTION_PER_PERSON;
  const preschoolDeduction = normalizeCount(input.preschoolCount) * PRESCHOOL_DEDUCTION_PER_PERSON;

  const itemizedInsuranceCap = INSURANCE_DEDUCTION_PER_PERSON * totalExemptions;
  const itemizedTotal = normalizeAmount(input.donationDeduction)
    + Math.min(normalizeAmount(input.insuranceDeduction), itemizedInsuranceCap)
    + normalizeAmount(input.medicalDeduction)
    + Math.min(normalizeAmount(input.mortgageDeduction), MORTGAGE_INTEREST_DEDUCTION_MAX)
    + Math.min(normalizeAmount(input.rentDeduction), RENT_DEDUCTION_MAX)
    + normalizeAmount(input.politicalDeduction);

  const recommendation: DeductionType = itemizedTotal > standardDeduction ? 'itemized' : 'standard';
  const deductionAmount = deductionType === 'itemized' ? itemizedTotal : standardDeduction;

  const taxableIncome = Math.max(
    0,
    grossIncome
      - salarySpecialDeduction
      - exemptionAmount
      - deductionAmount
      - savingsDeduction
      - longTermCareDeduction
      - disabilityDeduction
      - preschoolDeduction
      - laborPensionSelfContribution
  );

  const baseTax = calculateProgressiveIncomeTax(taxableIncome);
  const dividendCredit = dividendTaxMode === 'combined'
    ? Math.min(DIVIDEND_CREDIT_MAX, Math.round(dividendIncome * DIVIDEND_CREDIT_RATE))
    : 0;
  const dividendSeparateTax = dividendTaxMode === 'separate'
    ? Math.round(dividendIncome * SEPARATE_DIVIDEND_TAX_RATE)
    : 0;
  const totalTax = dividendTaxMode === 'separate'
    ? Math.max(0, baseTax + dividendSeparateTax)
    : Math.max(0, baseTax - dividendCredit);

  const currentBracket = getIncomeTaxBracket(taxableIncome);
  const taxBracketLabel = taxableIncome > 0 ? `${currentBracket.rate * 100}%` : '0%（免稅）';
  const totalIncomeForDisplay = grossIncome + (dividendTaxMode === 'separate' ? dividendIncome : 0);
  const afterTaxIncome = Math.max(0, totalIncomeForDisplay - totalTax);
  const effectiveRate = totalIncomeForDisplay > 0
    ? Number(((totalTax / totalIncomeForDisplay) * 100).toFixed(1))
    : 0;
  const afterTaxRate = totalIncomeForDisplay > 0
    ? Number(((1 - totalTax / totalIncomeForDisplay) * 100).toFixed(1))
    : 100;
  const netTax = Math.round(totalTax - normalizeAmount(input.withholdingTax));

  return {
    grossIncome,
    salarySpecialDeduction,
    totalExemptions,
    exemptionAmount,
    standardDeduction,
    savingsDeduction,
    longTermCareDeduction,
    disabilityDeduction,
    preschoolDeduction,
    laborPensionSelfContribution,
    itemizedTotal,
    recommendation,
    taxableIncome,
    baseTax,
    dividendCredit,
    dividendSeparateTax,
    totalTax,
    currentBracket,
    taxBracketLabel,
    totalIncomeForDisplay,
    afterTaxIncome,
    effectiveRate,
    afterTaxRate,
    netTax
  };
};
