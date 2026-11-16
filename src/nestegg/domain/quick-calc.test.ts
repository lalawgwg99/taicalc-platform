import { describe, expect, it } from 'vitest';

import { defaultInput } from '../defaults';
import { quickInputToPlanning, type QuickInput } from './quick-calc';

const baseQuick: QuickInput = {
  currentAge: 40,
  retirementAge: 65,
  savings: 1_000_000,
  monthlyInvestment: 20_000,
  monthlySpending: 30_000,
  returnRatePercent: 5,
};

describe('quickInputToPlanning 邊界箝制（2026-11-16 稽核）', () => {
  it('報酬率 −50% 箝制為 −20%（與 Field min 一致），不再讓引擎拋難懂錯誤', () => {
    const r = quickInputToPlanning({ ...baseQuick, returnRatePercent: -50 }, defaultInput, '快算');
    expect(r.investment.holdings[0].grossReturnRate).toBe(-0.2);
    expect(r.investment.retirementGrossReturnRate).toBe(-0.2);
  });

  it('報酬率 100% 箝制為 30%（與 Field max 一致）', () => {
    const r = quickInputToPlanning({ ...baseQuick, returnRatePercent: 100 }, defaultInput, '快算');
    expect(r.investment.holdings[0].grossReturnRate).toBe(0.3);
  });

  it('退休階段費率固定 0.3%，不沿用完整模式自訂費率', () => {
    const base = {
      ...defaultInput,
      investment: { ...defaultInput.investment, retirementFeeRate: 0.01 },
    };
    const r = quickInputToPlanning(baseQuick, base, '快算');
    expect(r.investment.retirementFeeRate).toBe(0.003);
    expect(r.investment.holdings[0].feeRate).toBe(0.003);
  });

  it('退休年齡不晚於現年時，改為現年＋1 歲', () => {
    const r = quickInputToPlanning({ ...baseQuick, retirementAge: 17 }, defaultInput, '快算');
    expect(r.profile.retirementAge).toBe(41);
  });
});
