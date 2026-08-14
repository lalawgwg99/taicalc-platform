export interface LifeProfile {
  startAge: number;
  targetAge: number;
  monthlyIncome: number;
  monthlyLivingCost: number;
  initialCash: number;
  initialInvestments: number;
  annualIncomeGrowth: number;
  annualInvestmentReturn: number;
  inflation: number;
  seed?: number;
}

export interface LifeChoice {
  id: string;
  label: string;
  cost: number;
  annualCost: number;
  incomeRateDelta?: number;
  happiness: number;
  stress: number;
  sellbackRate?: number;
  maxCount?: number;
}

export interface LifeSnapshot {
  age: number;
  cash: number;
  investments: number;
  netWorth: number;
  annualSurplus: number;
  happiness: number;
  stress: number;
}

export interface LifeEvent {
  label: string;
  detail: string;
  cashImpact: number;
}

export interface LifeState {
  age: number;
  targetAge: number;
  cash: number;
  investments: number;
  monthlyIncome: number;
  monthlyLivingCost: number;
  annualCommitments: number;
  incomeGrowth: number;
  investmentReturn: number;
  inflation: number;
  happiness: number;
  stress: number;
  owned: Record<string, number>;
  history: LifeSnapshot[];
  seed: number;
  latestEvent: LifeEvent | null;
}

const finite = (value: number, fallback = 0): number => Number.isFinite(value) ? value : fallback;
const rounded = (value: number): number => Math.round(finite(value));
const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, finite(value)));

export const getAnnualSurplus = (state: Pick<LifeState, 'monthlyIncome' | 'monthlyLivingCost' | 'annualCommitments'>): number => (
  state.monthlyIncome * 12 - state.monthlyLivingCost * 12 - state.annualCommitments
);

export const getNetWorth = (state: Pick<LifeState, 'cash' | 'investments'>): number => (
  rounded(state.cash + state.investments)
);

const snapshot = (state: Omit<LifeState, 'history'>): LifeSnapshot => ({
  age: state.age,
  cash: rounded(state.cash),
  investments: rounded(state.investments),
  netWorth: getNetWorth(state),
  annualSurplus: rounded(getAnnualSurplus(state)),
  happiness: rounded(state.happiness),
  stress: rounded(state.stress),
});

export function createLifeState(profile: LifeProfile): LifeState {
  const base: Omit<LifeState, 'history'> = {
    age: clamp(Math.round(profile.startAge), 18, 75),
    targetAge: clamp(Math.round(profile.targetAge), Math.round(profile.startAge) + 1, 90),
    cash: Math.max(0, finite(profile.initialCash)),
    investments: Math.max(0, finite(profile.initialInvestments)),
    monthlyIncome: Math.max(0, finite(profile.monthlyIncome)),
    monthlyLivingCost: Math.max(0, finite(profile.monthlyLivingCost)),
    annualCommitments: 0,
    incomeGrowth: clamp(profile.annualIncomeGrowth, -20, 30),
    investmentReturn: clamp(profile.annualInvestmentReturn, -50, 50),
    inflation: clamp(profile.inflation, -10, 20),
    happiness: 60,
    stress: 35,
    owned: {},
    seed: Math.abs(Math.round(profile.seed ?? 20260814)) || 20260814,
    latestEvent: null,
  };
  return { ...base, history: [snapshot(base)] };
}

export function canApplyChoice(state: LifeState, choice: LifeChoice): boolean {
  const count = state.owned[choice.id] ?? 0;
  return state.cash >= choice.cost && count < (choice.maxCount ?? 1);
}

export function applyLifeChoice(state: LifeState, choice: LifeChoice): LifeState {
  if (!canApplyChoice(state, choice)) {
    return state;
  }
  const count = state.owned[choice.id] ?? 0;
  const next = {
    ...state,
    cash: rounded(state.cash - choice.cost),
    annualCommitments: rounded(state.annualCommitments + choice.annualCost),
    monthlyIncome: rounded(state.monthlyIncome * (1 + (choice.incomeRateDelta ?? 0) / 100)),
    happiness: clamp(state.happiness + choice.happiness, 0, 100),
    stress: clamp(state.stress + choice.stress, 0, 100),
    owned: { ...state.owned, [choice.id]: count + 1 },
  };
  return { ...next, history: [...state.history] };
}

export function sellLifeChoice(state: LifeState, choice: LifeChoice): LifeState {
  const count = state.owned[choice.id] ?? 0;
  if (count <= 0 || !choice.sellbackRate) {
    return state;
  }
  const nextOwned = { ...state.owned, [choice.id]: count - 1 };
  const next = {
    ...state,
    cash: rounded(state.cash + choice.cost * choice.sellbackRate),
    annualCommitments: Math.max(0, rounded(state.annualCommitments - choice.annualCost)),
    happiness: clamp(state.happiness - Math.max(0, choice.happiness / 2), 0, 100),
    stress: clamp(state.stress - Math.max(0, choice.stress / 2), 0, 100),
    owned: nextOwned,
  };
  return { ...next, history: [...state.history] };
}

export function investCash(state: LifeState, amount: number): LifeState {
  const transfer = Math.min(state.cash, Math.max(0, rounded(amount)));
  if (transfer <= 0) {
    return state;
  }
  return {
    ...state,
    cash: rounded(state.cash - transfer),
    investments: rounded(state.investments + transfer),
    history: [...state.history],
  };
}

const nextRandom = (seed: number): { seed: number; value: number } => {
  const nextSeed = (seed * 1664525 + 1013904223) >>> 0;
  return { seed: nextSeed, value: nextSeed / 4294967296 };
};

const yearlyEvent = (seed: number): { seed: number; event: LifeEvent } => {
  const random = nextRandom(seed);
  const events: LifeEvent[] = [
    { label: '平穩的一年', detail: '沒有額外的大筆收入或支出。', cashImpact: 0 },
    { label: '工作獎金', detail: '專案完成，獲得一筆情境獎金。', cashImpact: 60_000 },
    { label: '設備維修', detail: '家電與交通工具臨時維修。', cashImpact: -35_000 },
    { label: '健康休養', detail: '安排檢查與休息，支出增加。', cashImpact: -50_000 },
    { label: '斜槓收入', detail: '額外完成一個小型專案。', cashImpact: 90_000 },
  ];
  const index = Math.min(events.length - 1, Math.floor(random.value * events.length));
  return { seed: random.seed, event: events[index] };
};

export function advanceLifeYear(state: LifeState): LifeState {
  if (state.age >= state.targetAge) {
    return state;
  }
  const annualSurplus = getAnnualSurplus(state);
  const investmentGain = state.investments * state.investmentReturn / 100;
  const eventResult = yearlyEvent(state.seed);
  const nextAge = state.age + 1;
  const cashBeforeCoverage = state.cash + annualSurplus + eventResult.event.cashImpact;
  const investmentsWithReturn = Math.max(0, state.investments + investmentGain);
  const coverage = cashBeforeCoverage < 0 ? Math.min(investmentsWithReturn, -cashBeforeCoverage) : 0;
  const nextBase: Omit<LifeState, 'history'> = {
    ...state,
    age: nextAge,
    cash: rounded(cashBeforeCoverage + coverage),
    investments: rounded(investmentsWithReturn - coverage),
    monthlyIncome: rounded(state.monthlyIncome * (1 + state.incomeGrowth / 100)),
    monthlyLivingCost: rounded(state.monthlyLivingCost * (1 + state.inflation / 100)),
    annualCommitments: rounded(state.annualCommitments * (1 + state.inflation / 100)),
    happiness: clamp(state.happiness - 1 + (eventResult.event.cashImpact > 0 ? 2 : eventResult.event.cashImpact < 0 ? -2 : 0), 0, 100),
    stress: clamp(state.stress + (annualSurplus < 0 ? 5 : -2) + (eventResult.event.cashImpact < 0 ? 3 : 0), 0, 100),
    owned: { ...state.owned },
    seed: eventResult.seed,
    latestEvent: eventResult.event,
  };
  return { ...nextBase, history: [...state.history, snapshot(nextBase)] };
}

export function getLifeResult(state: LifeState) {
  const netWorth = getNetWorth(state);
  const annualExpenses = state.monthlyLivingCost * 12 + state.annualCommitments;
  const retirementTarget = rounded(annualExpenses * 25);
  const retirementProgress = retirementTarget > 0 ? clamp(netWorth / retirementTarget * 100, 0, 999) : 100;
  const financeScore = clamp(retirementProgress, 0, 100) * 0.5;
  const wellbeingScore = state.happiness * 0.3 + (100 - state.stress) * 0.2;
  const score = rounded(financeScore + wellbeingScore);
  const rank = score >= 85 ? '人生設計師' : score >= 70 ? '穩健實踐家' : score >= 50 ? '彈性生存者' : '重新規劃中';
  return { netWorth, annualExpenses: rounded(annualExpenses), retirementTarget, retirementProgress, score, rank };
}
