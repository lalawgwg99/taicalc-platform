// 房地合一稅 2.0（個人）試算核心
// 來源：財政部房地合一稅 2.0 修法說明（所得稅法第 4-5、14-4 條）
// 適用範圍：105 年 1 月 1 日以後取得、110 年 7 月 1 日以後交易的個人房地（含預售屋）。
// 個人一般稅率（持有期間）：2 年以內 45%、超過 2 年未逾 5 年 35%、
// 超過 5 年未逾 10 年 20%、超過 10 年 15%。
// 自用住宅優惠：個人、配偶或未成年子女設籍並連續持有滿 6 年，
// 且 6 年內未出租、未供營業或執行業務使用者，課稅所得 400 萬元以下免稅，
// 超過部分按 10% 課稅。

export const SELF_USE_EXEMPTION = 4_000_000;
export const SELF_USE_MIN_MONTHS = 72;

export interface GainsTaxInput {
  salePrice: number;
  purchasePrice: number;
  costs: number;
  landIncrement: number;
  holdingMonths: number;
  selfUse: boolean;
}

export interface GainsTaxResult {
  taxableIncome: number;
  rate: number;
  tax: number;
  selfUseApplied: boolean;
  selfUseShortfallMonths: number;
  nextBracketMonths: number | null;
  nextBracketRate: number | null;
}

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export function generalRate(holdingMonths: number): number {
  const m = Math.floor(num(holdingMonths));
  if (m <= 24) return 0.45;
  if (m <= 60) return 0.35;
  if (m <= 120) return 0.2;
  return 0.15;
}

export function nextBracket(holdingMonths: number): { months: number; rate: number } | null {
  const m = Math.floor(num(holdingMonths));
  if (m <= 24) return { months: 24 - m, rate: 0.35 };
  if (m <= 60) return { months: 60 - m, rate: 0.2 };
  if (m <= 120) return { months: 120 - m, rate: 0.15 };
  return null;
}

export function calculateGainsTax(input: GainsTaxInput): GainsTaxResult {
  const sale = num(input.salePrice);
  const purchase = num(input.purchasePrice);
  const costs = num(input.costs);
  const land = num(input.landIncrement);
  const months = Math.floor(num(input.holdingMonths));
  const taxableIncome = Math.max(0, sale - purchase - costs - land);
  const selfUseEligible = input.selfUse === true && months >= SELF_USE_MIN_MONTHS;
  if (selfUseEligible) {
    const tax = Math.max(0, taxableIncome - SELF_USE_EXEMPTION) * 0.1;
    return {
      taxableIncome,
      rate: 0.1,
      tax: Math.round(tax),
      selfUseApplied: true,
      selfUseShortfallMonths: 0,
      nextBracketMonths: null,
      nextBracketRate: null,
    };
  }
  const rate = generalRate(months);
  const nb = nextBracket(months);
  return {
    taxableIncome,
    rate,
    tax: Math.round(taxableIncome * rate),
    selfUseApplied: false,
    selfUseShortfallMonths: input.selfUse === true ? Math.max(0, SELF_USE_MIN_MONTHS - months) : 0,
    nextBracketMonths: nb ? nb.months : null,
    nextBracketRate: nb ? nb.rate : null,
  };
}
