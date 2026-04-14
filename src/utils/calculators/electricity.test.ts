import { describe, expect, it } from 'vitest';

import {
  NON_SUMMER_ELECTRICITY_RATES,
  SUMMER_ELECTRICITY_RATES,
  calcElectricityCostSummary,
  estimateAcInputKw,
  estimateAcMonthlyKwh
} from './electricity';

describe('electricity calculator rules', () => {
  it('applies current non-summer tier pricing for 300 kWh', () => {
    const summary = calcElectricityCostSummary(300, NON_SUMMER_ELECTRICITY_RATES);

    expect(summary.energyCharge).toBe(591);
    expect(summary.minimumChargeApplied).toBe(0);
    expect(summary.totalCost).toBe(591);
  });

  it('applies current summer tier pricing for 300 kWh', () => {
    const summary = calcElectricityCostSummary(300, SUMMER_ELECTRICITY_RATES);

    expect(summary.totalCost).toBe(643);
  });

  it('enforces the monthly minimum charge for low usage', () => {
    const summary = calcElectricityCostSummary(30, NON_SUMMER_ELECTRICITY_RATES);

    expect(summary.energyCharge).toBe(50);
    expect(summary.minimumChargeApplied).toBe(50);
    expect(summary.totalCost).toBe(100);
  });

  it('converts BTU/h and COP to estimated input power', () => {
    const inputKw = estimateAcInputKw({
      mode: 'btu',
      btuPerHour: 12000,
      efficiencyValue: 4
    });

    expect(inputKw).toBeCloseTo(0.879, 3);
    expect(estimateAcMonthlyKwh(inputKw, 8)).toBe(211);
  });
});

