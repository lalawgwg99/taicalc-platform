export const money = (value: number) => Math.round(Number.isFinite(value) ? value : 0);

export function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const rate = annualRate / 100 / 12;
  if (rate === 0) return principal / months;
  return principal * rate * (1 + rate) ** months / ((1 + rate) ** months - 1);
}

const LICENSE_TAX = [
  [500, 1620], [600, 2160], [1200, 4320], [1800, 7120], [2400, 11230],
  [3000, 15210], [4200, 28220], [5400, 46170], [6600, 69690],
  [7800, 117000], [Infinity, 151200],
] as const;

const FUEL_FEE = [
  [500, 2160, 1296], [600, 2880, 1728], [1200, 4320, 2592], [1800, 4800, 2880],
  [2400, 6180, 3708], [3000, 7200, 4320], [3600, 8640, 5184],
  [4200, 9810, 5886], [4800, 11220, 6732], [5400, 12180, 7308],
  [6000, 13080, 7848], [6600, 13950, 8370], [7200, 14910, 8946],
  [Infinity, 15720, 9432],
] as const;

export function vehicleTaxes(cc: number, fuel: 'gasoline' | 'diesel' | 'electric') {
  if (fuel === 'electric') return { licenseTax: 0, fuelFee: 0 };
  const licenseTax = LICENSE_TAX.find(([max]) => cc <= max)?.[1] ?? 0;
  const row = FUEL_FEE.find(([max]) => cc <= max);
  return { licenseTax, fuelFee: row ? row[fuel === 'diesel' ? 2 : 1] : 0 };
}

export function calculateCarCost(input: {
  price: number; downPayment: number; annualRate: number; loanYears: number;
  years: number; cc: number; fuel: 'gasoline' | 'diesel' | 'electric';
  annualKm: number; efficiency: number; energyPrice: number; insuranceAnnual: number;
  maintenanceAnnual: number; parkingMonthly: number; resaleRate: number;
}) {
  const principal = Math.max(0, input.price - input.downPayment);
  const loanMonths = Math.max(1, input.loanYears * 12);
  const payment = monthlyPayment(principal, input.annualRate, loanMonths);
  const loanInterest = amortizationInterest(principal, input.annualRate, payment, Math.min(loanMonths, input.years * 12));
  const taxes = vehicleTaxes(input.cc, input.fuel);
  const energyAnnual = input.efficiency > 0 ? input.annualKm / input.efficiency * input.energyPrice : 0;
  const runningAnnual = taxes.licenseTax + taxes.fuelFee + energyAnnual +
    input.insuranceAnnual + input.maintenanceAnnual + input.parkingMonthly * 12;
  const depreciation = input.price * (1 - input.resaleRate / 100);
  const total = depreciation + loanInterest + runningAnnual * input.years;
  return {
    ...taxes, payment: money(payment), loanInterest: money(loanInterest),
    energyAnnual: money(energyAnnual), runningAnnual: money(runningAnnual),
    depreciation: money(depreciation), total: money(total),
    monthlyTrueCost: money(total / Math.max(1, input.years * 12)),
  };
}

export function calculateSeparation(input: {
  averageMonthlyWage: number; regularMonthlyWage: number; serviceYears: number;
  noticeDaysGiven: number; unusedLeaveDays: number; workedDays: number;
}) {
  const severance = Math.min(input.averageMonthlyWage * input.serviceYears * 0.5, input.averageMonthlyWage * 6);
  const statutoryNoticeDays = input.serviceYears < 0.25 ? 0 : input.serviceYears < 1 ? 10 : input.serviceYears < 3 ? 20 : 30;
  const noticeDailyWage = Math.max(input.regularMonthlyWage / 30, input.averageMonthlyWage / 30);
  const noticePay = noticeDailyWage * Math.max(0, statutoryNoticeDays - input.noticeDaysGiven);
  const unusedLeavePay = input.regularMonthlyWage / 30 * input.unusedLeaveDays;
  const finalSalary = input.regularMonthlyWage / 30 * input.workedDays;
  return {
    severance: money(severance), statutoryNoticeDays, noticePay: money(noticePay),
    unusedLeavePay: money(unusedLeavePay), finalSalary: money(finalSalary),
    total: money(severance + noticePay + unusedLeavePay + finalSalary),
  };
}

function simulateDebt(balance: number, annualRate: number, payment: number, extra = 0) {
  let remaining = Math.max(0, balance);
  let interest = 0;
  let months = 0;
  const monthlyRate = annualRate / 100 / 12;
  const monthlyOutflow = payment + extra;
  while (remaining > 0.01 && months < 1200) {
    const monthInterest = remaining * monthlyRate;
    if (monthlyOutflow <= monthInterest) return { months: Infinity, interest: Infinity };
    interest += monthInterest;
    remaining -= Math.min(remaining, monthlyOutflow - monthInterest);
    months++;
  }
  return { months, interest };
}

export interface DebtInput { balance: number; rate: number; payment: number }

export function calculateDebtConsolidation(
  debts: DebtInput[], newRate: number, newYears: number, fee: number, penalty: number, extra: number
) {
  const valid = debts.filter(d => d.balance > 0);
  const balance = valid.reduce((sum, d) => sum + d.balance, 0);
  const currentPayment = valid.reduce((sum, d) => sum + d.payment, 0);
  const currentPlans = valid.map(d => simulateDebt(d.balance, d.rate, d.payment));
  const currentPayoffPossible = currentPlans.every(plan => Number.isFinite(plan.interest));
  const currentInterest = currentPayoffPossible
    ? currentPlans.reduce((sum, plan) => sum + plan.interest, 0)
    : 0;
  const currentMonths = currentPayoffPossible ? Math.max(0, ...currentPlans.map(plan => plan.months)) : Infinity;
  const newPayment = monthlyPayment(balance, newRate, newYears * 12);
  const newInterest = newPayment * newYears * 12 - balance;
  const extraPlan = simulateDebt(balance, newRate, newPayment, extra);
  const newCosts = newInterest + fee + penalty;
  return {
    balance: money(balance), currentPayment: money(currentPayment),
    currentInterest: money(currentInterest), currentMonths, currentPayoffPossible,
    newPayment: money(newPayment), newInterest: money(newInterest),
    newCosts: money(newCosts), savings: currentPayoffPossible ? money(currentInterest - newCosts) : 0,
    extraMonths: extraPlan.months, extraInterest: money(extraPlan.interest),
    extraSavings: money(newInterest - extraPlan.interest),
  };
}

export function calculateLaborPension(
  averageInsuredSalary: number, insuredYears: number, claimAge: number, lumpSumEligible: boolean
) {
  const formulaA = averageInsuredSalary * insuredYears * 0.00775 + 3000;
  const formulaB = averageInsuredSalary * insuredYears * 0.0155;
  const ageAdjustment = claimAge < 65
    ? Math.max(-0.2, (claimAge - 65) * 0.04)
    : Math.min(0.2, (claimAge - 65) * 0.04);
  const monthly = Math.max(formulaA, formulaB) * (1 + ageAdjustment);
  const monthsOfSalary = insuredYears <= 15 ? insuredYears : 15 + (insuredYears - 15) * 2;
  const lumpSum = lumpSumEligible ? averageInsuredSalary * Math.min(45, monthsOfSalary) : 0;
  return {
    formula: formulaA >= formulaB ? 'A 式' : 'B 式',
    ageAdjustment, monthly: money(monthly), annual: money(monthly * 12),
    lumpSum: money(lumpSum),
    breakEvenYears: lumpSum > 0 && monthly > 0 ? lumpSum / monthly / 12 : 0,
  };
}

function progressiveTax(net: number, first: number, second: number) {
  const taxable = Math.max(0, net);
  return money(Math.min(taxable, first) * 0.1 +
    Math.min(Math.max(taxable - first, 0), second - first) * 0.15 +
    Math.max(taxable - second, 0) * 0.2);
}

export function calculateEstateTax(input: {
  type: 'estate' | 'gift'; gross: number; debts: number; spouse: boolean;
  children: number; parents: number; disabled: number; otherDeductions: number;
}) {
  if (input.type === 'gift') {
    const exemption = 2_440_000;
    const net = Math.max(0, input.gross - input.debts - exemption - input.otherDeductions);
    return { exemption, deductions: input.debts + input.otherDeductions, net, tax: progressiveTax(net, 28_110_000, 56_210_000) };
  }
  const exemption = 13_330_000;
  const deductions = input.debts + (input.spouse ? 5_530_000 : 0) + input.children * 560_000 +
    input.parents * 1_380_000 + input.disabled * 6_930_000 + 1_380_000 + input.otherDeductions;
  const net = Math.max(0, input.gross - exemption - deductions);
  return { exemption, deductions, net, tax: progressiveTax(net, 56_210_000, 112_420_000) };
}

export function calculateParentalBenefits(input: {
  insuredSalary: number; parent1Months: number; parent2Months: number;
  childOrder: number; allowanceMonths: number; publicCare: boolean;
}) {
  const p1 = Math.min(6, Math.max(0, input.parent1Months));
  const p2 = Math.min(6, Math.max(0, input.parent2Months));
  const leaveBenefit = input.insuredSalary * 0.8 * (p1 + p2);
  const allowanceMonthly = input.publicCare ? 0 : input.childOrder <= 1 ? 5000 : input.childOrder === 2 ? 6000 : 7000;
  return {
    leaveBenefit: money(leaveBenefit), allowanceMonthly,
    allowanceTotal: money(allowanceMonthly * input.allowanceMonths),
    total: money(leaveBenefit + allowanceMonthly * input.allowanceMonths),
    incomeGap: money(input.insuredSalary * 0.2 * (p1 + p2)),
  };
}

export function calculateHomeCost(input: {
  assessedHouseValue: number; houseTaxRate: number; declaredLandValue: number; landTaxRate: number;
  mortgageBalance: number; mortgageRate: number; mortgageYears: number;
  managementMonthly: number; repairAnnual: number; insuranceAnnual: number;
}) {
  const houseTax = input.assessedHouseValue * input.houseTaxRate / 100;
  const landTax = input.declaredLandValue * input.landTaxRate / 100;
  const mortgagePayment = monthlyPayment(input.mortgageBalance, input.mortgageRate, input.mortgageYears * 12);
  const firstYearInterest = amortizationInterest(input.mortgageBalance, input.mortgageRate, mortgagePayment, 12);
  const annualCost = houseTax + landTax + input.managementMonthly * 12 + input.repairAnnual + input.insuranceAnnual + firstYearInterest;
  const annualCashOutflow = houseTax + landTax + input.managementMonthly * 12 + input.repairAnnual + input.insuranceAnnual + mortgagePayment * 12;
  return {
    houseTax: money(houseTax), landTax: money(landTax), mortgagePayment: money(mortgagePayment),
    firstYearInterest: money(firstYearInterest), annualCost: money(annualCost),
    monthlyCost: money(annualCost / 12), annualCashOutflow: money(annualCashOutflow),
  };
}

function amortizationInterest(principal: number, annualRate: number, payment: number, months: number) {
  let remaining = Math.max(0, principal);
  let interest = 0;
  const rate = annualRate / 100 / 12;
  for (let month = 0; month < months && remaining > 0.01; month++) {
    const charge = remaining * rate;
    interest += charge;
    remaining -= Math.min(remaining, Math.max(0, payment - charge));
  }
  return interest;
}

export interface ReturnScenario { name: string; nominalRate: number; feeRate: number; taxDrag: number }

export function calculateRealReturns(
  principal: number, years: number, inflation: number, monthlyContribution: number, scenarios: ReturnScenario[]
) {
  return scenarios.map(scenario => {
    const netNominalRate = (scenario.nominalRate - scenario.feeRate - scenario.taxDrag) / 100;
    const monthlyRate = netNominalRate / 12;
    const months = years * 12;
    const principalFuture = principal * (1 + monthlyRate) ** months;
    const contributionFuture = monthlyRate === 0
      ? monthlyContribution * months
      : monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate);
    const nominalValue = principalFuture + contributionFuture;
    const realValue = nominalValue / (1 + inflation / 100) ** years;
    const realAnnualRate = (1 + netNominalRate) / (1 + inflation / 100) - 1;
    return { ...scenario, nominalValue: money(nominalValue), realValue: money(realValue), realAnnualRate };
  });
}
