import Decimal from 'decimal.js';

export interface MortgageCalculationInput {
  amountWan: number;
  years: number;
  graceYears: number;
  rate1: number;
  rate2: number;
  twoStageMode: boolean;
  stage1Months: number;
  prepaymentMode: boolean;
  extraMonthly: number;
  extraLump: number;
  lumpYear: number;
}

export interface MortgageCalculationResult {
  gracePay: number;
  afterGracePay: number;
  stage2Pay: number;
  basePay: number;
  totalInterest: number;
  totalPayment: number;
  interestSaved: number;
  monthsSaved: number;
  finalMonths: number;
}

export const calculatePayment = (
  rateYear: number,
  nMonths: number,
  presentValue: Decimal.Value
): Decimal => {
  const yearlyRate = new Decimal(rateYear);
  const months = new Decimal(nMonths);
  const principal = new Decimal(presentValue);

  if (yearlyRate.equals(0)) {
    return principal.div(months);
  }

  const monthlyRate = yearlyRate.div(100).div(12);
  const power = monthlyRate.plus(1).pow(months);
  return principal.mul(monthlyRate).mul(power).div(power.minus(1));
};

export const calculateMortgageResults = (
  input: MortgageCalculationInput
): MortgageCalculationResult => {
  const loan = new Decimal(input.amountWan || 0).mul(10000);
  const totalMonths = (input.years || 0) * 12;
  const graceMonths = (input.graceYears || 0) * 12;
  const changeMonth = input.twoStageMode ? input.stage1Months : Number.MAX_SAFE_INTEGER;

  if (totalMonths <= 0) {
    return {
      gracePay: 0,
      afterGracePay: 0,
      stage2Pay: 0,
      basePay: 0,
      totalInterest: 0,
      totalPayment: 0,
      interestSaved: 0,
      monthsSaved: 0,
      finalMonths: 0
    };
  }

  const getRate = (month: number): Decimal => {
    const rateValue = month <= changeMonth ? input.rate1 : (input.rate2 || input.rate1);
    return new Decimal(rateValue).div(100).div(12);
  };

  let standardBalance = loan;
  let totalInterest = new Decimal(0);
  let gracePay = new Decimal(0);
  let afterGracePay = new Decimal(0);
  let stage2Pay = new Decimal(0);
  let currentPayment = new Decimal(0);
  const scheduledPayments: Decimal[] = [];

  for (let month = 1; month <= totalMonths; month += 1) {
    const rate = getRate(month);
    const interest = standardBalance.mul(rate).round();
    totalInterest = totalInterest.plus(interest);

    let payment = new Decimal(0);
    if (month <= graceMonths) {
      payment = interest;
      if (month === 1) gracePay = payment;
    } else {
      if (month === graceMonths + 1 || month === changeMonth + 1) {
        const remainingMonths = totalMonths - month + 1;
        const stageRate = month <= changeMonth ? input.rate1 : (input.rate2 || input.rate1);
        currentPayment = standardBalance.gt(0)
          ? calculatePayment(stageRate, remainingMonths, standardBalance).round()
          : new Decimal(0);
      }

      payment = currentPayment;
      if (month === graceMonths + 1) afterGracePay = payment;
      if (month === changeMonth + 1) stage2Pay = payment;
    }

    scheduledPayments.push(payment);
    standardBalance = standardBalance.minus(payment.minus(interest));
  }

  let prepaymentInterest = totalInterest;
  let finalMonths = totalMonths;

  if (input.prepaymentMode && (input.extraMonthly > 0 || input.extraLump > 0)) {
    let prepaymentBalance = loan;
    prepaymentInterest = new Decimal(0);
    finalMonths = 0;
    const lumpMonth = input.lumpYear * 12;
    const extraMonthly = new Decimal(input.extraMonthly || 0);
    const extraLump = new Decimal(input.extraLump || 0).mul(10000);

    for (let month = 1; month <= totalMonths; month += 1) {
      if (prepaymentBalance.lte(10)) {
        if (!finalMonths) finalMonths = month - 1;
        break;
      }

      finalMonths = month;
      const rate = getRate(month);
      const interest = prepaymentBalance.mul(rate).round();
      prepaymentInterest = prepaymentInterest.plus(interest);

      const basePayment = scheduledPayments[month - 1] || new Decimal(0);
      const actualPayment = month <= graceMonths ? interest : basePayment;
      let extraPayment = extraMonthly;

      if (month === lumpMonth) {
        extraPayment = extraPayment.plus(extraLump);
      }

      let totalPayment = actualPayment.plus(extraPayment);
      if (totalPayment.gt(prepaymentBalance.plus(interest))) {
        totalPayment = prepaymentBalance.plus(interest);
      }

      prepaymentBalance = prepaymentBalance.minus(totalPayment.minus(interest));
    }
  }

  return {
    gracePay: gracePay.toNumber(),
    afterGracePay: afterGracePay.toNumber(),
    stage2Pay: (stage2Pay.gt(0) ? stage2Pay : afterGracePay).toNumber(),
    basePay: afterGracePay.toNumber(),
    totalInterest: totalInterest.toNumber(),
    totalPayment: loan.plus(totalInterest).toNumber(),
    interestSaved: totalInterest.minus(prepaymentInterest).toNumber(),
    monthsSaved: totalMonths - finalMonths,
    finalMonths
  };
};

