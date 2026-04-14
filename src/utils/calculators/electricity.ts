export interface ElectricityRateTier {
  limit: number;
  rate: number;
}

export interface ElectricityBreakdownTier {
  label: string;
  kwh: number;
  rate: number;
  cost: number;
}

export interface ElectricityCostSummary {
  tiers: ElectricityBreakdownTier[];
  energyCharge: number;
  minimumChargeApplied: number;
  totalCost: number;
}

export type AcInputMode = 'kw' | 'btu' | 'capacity';
export type AcEfficiencyType = 'cop' | 'cspf';

export const MINIMUM_MONTHLY_CHARGE = 100;
export const BTU_PER_KW = 3412.142;

export const SUMMER_ELECTRICITY_RATES: ElectricityRateTier[] = [
  { limit: 120, rate: 1.68 },
  { limit: 330, rate: 2.45 },
  { limit: 500, rate: 3.7 },
  { limit: 700, rate: 5.04 },
  { limit: 1000, rate: 6.24 },
  { limit: Infinity, rate: 8.46 }
];

export const NON_SUMMER_ELECTRICITY_RATES: ElectricityRateTier[] = [
  { limit: 120, rate: 1.68 },
  { limit: 330, rate: 2.16 },
  { limit: 500, rate: 3.03 },
  { limit: 700, rate: 4.14 },
  { limit: 1000, rate: 5.66 },
  { limit: Infinity, rate: 6.71 }
];

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export const calcElectricityBreakdown = (
  rawKwh: number,
  rates: ElectricityRateTier[]
): ElectricityBreakdownTier[] => {
  let remain = Math.max(0, rawKwh);
  let previousLimit = 0;
  const result: ElectricityBreakdownTier[] = [];

  rates.forEach((tier) => {
    if (remain <= 0) return;
    const use = Math.min(remain, tier.limit - previousLimit);
    if (use > 0) {
      result.push({
        label: `${previousLimit + 1}~${tier.limit === Infinity ? '以上' : tier.limit}度`,
        kwh: use,
        rate: tier.rate,
        cost: Math.round(use * tier.rate)
      });
    }
    remain -= use;
    previousLimit = tier.limit;
  });

  return result;
};

export const calcElectricityCostSummary = (
  rawKwh: number,
  rates: ElectricityRateTier[]
): ElectricityCostSummary => {
  const tiers = calcElectricityBreakdown(rawKwh, rates);
  const energyCharge = tiers.reduce((sum, tier) => sum + tier.cost, 0);
  const minimumChargeApplied = rawKwh > 0 && energyCharge < MINIMUM_MONTHLY_CHARGE
    ? MINIMUM_MONTHLY_CHARGE - energyCharge
    : 0;

  return {
    tiers,
    energyCharge,
    minimumChargeApplied,
    totalCost: energyCharge + minimumChargeApplied
  };
};

export const convertBtuToKw = (btuPerHour: number): number => Math.max(0, btuPerHour) / BTU_PER_KW;

export const convertKwToBtu = (coolingCapacityKw: number): number => Math.round(Math.max(0, coolingCapacityKw) * BTU_PER_KW);

export const estimateAcInputKw = (options: {
  mode: AcInputMode;
  powerKw?: number;
  btuPerHour?: number;
  coolingCapacityKw?: number;
  efficiencyValue?: number;
}): number => {
  if (options.mode === 'kw') {
    return clamp(Number(options.powerKw) || 0, 0.1, 20);
  }

  const efficiencyValue = clamp(Number(options.efficiencyValue) || 0, 1, 8);
  const coolingCapacityKw = options.mode === 'btu'
    ? convertBtuToKw(Number(options.btuPerHour) || 0)
    : clamp(Number(options.coolingCapacityKw) || 0, 0.8, 35);

  return clamp(coolingCapacityKw / efficiencyValue, 0.1, 20);
};

export const estimateAcMonthlyKwh = (inputKw: number, hoursPerDay: number): number => {
  const normalizedHours = clamp(Number(hoursPerDay) || 0, 0, 24);
  return Math.round(Math.max(0, inputKw) * normalizedHours * 30);
};

