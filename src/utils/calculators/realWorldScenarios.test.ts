import { describe, expect, it } from 'vitest';

import { NON_SUMMER_ELECTRICITY_RATES, calcElectricityCostSummary } from './electricity';
import { calculateIncomeTax } from './incomeTax';
import { calculateInsurancePremiums } from './insurance';
import { calculateMortgageResults } from './mortgage';
import { calculateSalaryBreakdown, estimateAnnualSalaryIncome } from './salary';

describe('real-world calculator scenarios', () => {
  it('keeps core Taiwan calculation scenarios stable', () => {
    const salary = calculateSalaryBreakdown({
      salary: 50000,
      bonusMonths: 0,
      pensionRate: 0
    });

    const incomeTax = calculateIncomeTax({
      salaryIncome: 1000000,
      filingStatus: 'single',
      deductionType: 'standard',
      dividendTaxMode: 'combined'
    });

    const insurance = calculateInsurancePremiums({
      salary: 50000,
      role: 'employee',
      dependents: 0
    });

    const electricity = calcElectricityCostSummary(300, NON_SUMMER_ELECTRICITY_RATES);

    const mortgage = calculateMortgageResults({
      amountWan: 1000,
      years: 30,
      graceYears: 0,
      rate1: 2,
      rate2: 2,
      twoStageMode: false,
      stage1Months: 12,
      prepaymentMode: false,
      extraMonthly: 0,
      extraLump: 0,
      lumpYear: 3
    });

    expect({
      salary: {
        annualSalaryIncome: estimateAnnualSalaryIncome(50000, 0),
        monthlyNet: salary.mNet,
        labor: salary.labor,
        health: salary.health,
        employerCost: salary.empCost,
        yearlyNet: salary.yNet
      },
      incomeTax: {
        taxableIncome: incomeTax.taxableIncome,
        totalTax: incomeTax.totalTax,
        effectiveRate: incomeTax.effectiveRate,
        afterTaxIncome: incomeTax.afterTaxIncome,
        taxBracketLabel: incomeTax.taxBracketLabel
      },
      insurance: {
        laborBracket: insurance.laborBracket,
        healthBracket: insurance.healthBracket,
        workerTotal: insurance.workerTotal,
        employerTotal: insurance.employerTotal
      },
      electricity: {
        totalCost: electricity.totalCost,
        energyCharge: electricity.energyCharge,
        tierCount: electricity.tiers.length
      },
      mortgage: {
        basePay: Math.round(mortgage.basePay),
        afterGracePay: Math.round(mortgage.afterGracePay),
        finalMonths: mortgage.finalMonths,
        monthsSaved: mortgage.monthsSaved
      }
    }).toMatchInlineSnapshot(`
      {
        "electricity": {
          "energyCharge": 591,
          "tierCount": 2,
          "totalCost": 591,
        },
        "incomeTax": {
          "afterTaxIncome": 972300,
          "effectiveRate": 2.8,
          "taxBracketLabel": "5%",
          "taxableIncome": 554000,
          "totalTax": 27700,
        },
        "insurance": {
          "employerTotal": 9363,
          "healthBracket": 50600,
          "laborBracket": 45800,
          "workerTotal": 1884,
        },
        "mortgage": {
          "afterGracePay": 36962,
          "basePay": 36962,
          "finalMonths": 360,
          "monthsSaved": 0,
        },
        "salary": {
          "annualSalaryIncome": 600000,
          "employerCost": 9363,
          "health": 785,
          "labor": 1099,
          "monthlyNet": 48116,
          "yearlyNet": 577392,
        },
      }
    `);
  });
});
