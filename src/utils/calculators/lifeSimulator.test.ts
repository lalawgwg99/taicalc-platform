import { describe, expect, it } from 'vitest';
import {
  advanceLifeYear,
  applyLifeChoice,
  canApplyChoice,
  createLifeState,
  getLifeResult,
  investCash,
  sellLifeChoice,
  type LifeChoice,
} from './lifeSimulator';

const profile = {
  startAge: 30,
  targetAge: 65,
  monthlyIncome: 60_000,
  monthlyLivingCost: 30_000,
  initialCash: 500_000,
  initialInvestments: 200_000,
  annualIncomeGrowth: 2,
  annualInvestmentReturn: 5,
  inflation: 2,
  seed: 1,
};

const car: LifeChoice = {
  id: 'car', label: '買車', cost: 300_000, annualCost: 120_000,
  happiness: 8, stress: 6, sellbackRate: 0.6, maxCount: 1,
};

describe('life simulator', () => {
  it('creates a bounded initial state and snapshot', () => {
    const state = createLifeState(profile);
    expect(state.age).toBe(30);
    expect(state.history).toHaveLength(1);
    expect(getLifeResult(state).netWorth).toBe(700_000);
  });

  it('applies and sells a life choice', () => {
    const initial = createLifeState(profile);
    expect(canApplyChoice(initial, car)).toBe(true);
    const bought = applyLifeChoice(initial, car);
    expect(bought.cash).toBe(200_000);
    expect(bought.annualCommitments).toBe(120_000);
    expect(canApplyChoice(bought, car)).toBe(false);
    const sold = sellLifeChoice(bought, car);
    expect(sold.cash).toBe(380_000);
    expect(sold.annualCommitments).toBe(0);
  });

  it('moves cash into investments without changing net worth', () => {
    const initial = createLifeState(profile);
    const invested = investCash(initial, 100_000);
    expect(invested.cash).toBe(400_000);
    expect(invested.investments).toBe(300_000);
    expect(getLifeResult(invested).netWorth).toBe(700_000);
  });

  it('advances one year with cash flow, growth and a deterministic event', () => {
    const initial = createLifeState(profile);
    const next = advanceLifeYear(initial);
    expect(next.age).toBe(31);
    expect(next.monthlyIncome).toBe(61_200);
    expect(next.monthlyLivingCost).toBe(30_600);
    expect(next.investments).toBe(210_000);
    expect(next.history).toHaveLength(2);
    expect(next.latestEvent).not.toBeNull();
  });

  it('stops at the selected target age', () => {
    const initial = createLifeState({ ...profile, startAge: 64, targetAge: 65 });
    const finished = advanceLifeYear(initial);
    expect(advanceLifeYear(finished)).toBe(finished);
  });
});
