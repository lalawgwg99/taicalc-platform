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
  eventIntensity?: 'steady' | 'balanced' | 'dynamic';
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
  incomeRateDelta?: number;
  monthlyCostDelta?: number;
  happinessDelta?: number;
  stressDelta?: number;
  icon?: string;
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
  eventIntensity: 'steady' | 'balanced' | 'dynamic';
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
    eventIntensity: profile.eventIntensity ?? 'balanced',
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

const yearlyEvent = (state: LifeState): { seed: number; event: LifeEvent | null } => {
  const occurrence = nextRandom(state.seed);
  const probability = state.eventIntensity === 'steady' ? 0.35 : state.eventIntensity === 'dynamic' ? 0.85 : 0.6;
  if (occurrence.value > probability) {
    return { seed: occurrence.seed, event: null };
  }

  const draw = nextRandom(occurrence.seed);
  const monthlyBase = Math.max(20_000, state.monthlyLivingCost);
  const events: LifeEvent[] = [
    { label: '工作獎金', detail: '專案告一段落，多了一筆獎金。', cashImpact: rounded(state.monthlyIncome * 1.2), happinessDelta: 3, stressDelta: -2, icon: 'workspace_premium' },
    { label: '轉職機會', detail: '換到新的工作環境，收入與壓力都改變了。', cashImpact: -rounded(monthlyBase * 0.5), incomeRateDelta: 12, happinessDelta: 5, stressDelta: 5, icon: 'work_history' },
    { label: '短暫待業', detail: '工作出現空窗，靠準備金度過這段時間。', cashImpact: -rounded(state.monthlyIncome * 2.5), incomeRateDelta: -4, happinessDelta: -5, stressDelta: 12, icon: 'work_off' },
    { label: '家中需要你', detail: '家人需要照顧，時間與支出一起增加。', cashImpact: -rounded(monthlyBase * 1.5), monthlyCostDelta: 3_000, happinessDelta: 2, stressDelta: 9, icon: 'family_restroom' },
    { label: '健康休養', detail: '暫時放慢腳步，支付檢查與休養費用。', cashImpact: -rounded(monthlyBase * 1.8), happinessDelta: -2, stressDelta: -4, icon: 'health_and_safety' },
    { label: '住處變動', detail: '搬家或租約變動，生活成本重新調整。', cashImpact: -rounded(monthlyBase), monthlyCostDelta: draw.value > 0.5 ? 2_500 : -2_000, happinessDelta: 3, stressDelta: 4, icon: 'moving' },
    { label: '斜槓開始有收入', detail: '長期累積的能力，帶來新的收入來源。', cashImpact: rounded(state.monthlyIncome), incomeRateDelta: 6, happinessDelta: 5, stressDelta: 4, icon: 'add_business' },
    { label: '市場回檔', detail: '投資價格波動，帳面資產暫時下降。', cashImpact: 0, happinessDelta: -3, stressDelta: 8, icon: 'trending_down' },
    { label: '生活設備更新', detail: '必要設備故障，臨時支出增加。', cashImpact: -rounded(monthlyBase * 0.9), stressDelta: 4, icon: 'build' },
    { label: '意外的小確幸', detail: '生活出現一件沒有財務代價的好事。', cashImpact: 0, happinessDelta: 8, stressDelta: -5, icon: 'celebration' },
  ];
  const index = Math.min(events.length - 1, Math.floor(draw.value * events.length));
  return { seed: draw.seed, event: events[index] };
};

export function advanceLifeYear(state: LifeState): LifeState {
  if (state.age >= state.targetAge) {
    return state;
  }
  const annualSurplus = getAnnualSurplus(state);
  const investmentGain = state.investments * state.investmentReturn / 100;
  const eventResult = yearlyEvent(state);
  const event = eventResult.event;
  const nextAge = state.age + 1;
  const cashBeforeCoverage = state.cash + annualSurplus + (event?.cashImpact ?? 0);
  const marketMultiplier = event?.label === '市場回檔' ? 0.88 : 1;
  const investmentsWithReturn = Math.max(0, (state.investments + investmentGain) * marketMultiplier);
  const coverage = cashBeforeCoverage < 0 ? Math.min(investmentsWithReturn, -cashBeforeCoverage) : 0;
  const nextBase: Omit<LifeState, 'history'> = {
    ...state,
    age: nextAge,
    cash: rounded(cashBeforeCoverage + coverage),
    investments: rounded(investmentsWithReturn - coverage),
    monthlyIncome: rounded(state.monthlyIncome * (1 + state.incomeGrowth / 100) * (1 + (event?.incomeRateDelta ?? 0) / 100)),
    monthlyLivingCost: Math.max(0, rounded(state.monthlyLivingCost * (1 + state.inflation / 100) + (event?.monthlyCostDelta ?? 0))),
    annualCommitments: rounded(state.annualCommitments * (1 + state.inflation / 100)),
    happiness: clamp(state.happiness - 1 + (event?.happinessDelta ?? 0), 0, 100),
    stress: clamp(state.stress + (annualSurplus < 0 ? 5 : -2) + (event?.stressDelta ?? 0), 0, 100),
    owned: { ...state.owned },
    seed: eventResult.seed,
    latestEvent: event,
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
