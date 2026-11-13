// 新股抽籤期望值試算（公開申購）
// 申購機制（已由榮德本人 2026-11-05～11-11 的四檔申購通知核實）：
// 預扣金額＝承銷價×申購股數＋20 元處理費＋50 元郵寄工本費；
// 同種股票每人僅能向一家券商申購，重複申購即不合格；申購後不得撤回或更改；
// 中籤後不能放棄認購；交割戶餘額不足會變不合格件。
// 期望值定義：資金凍結不論中籤與否都會發生，所以機會成本兩種結果都要扣；
// 中籤損益＝價差 − 70 元手續費 − 機會成本；未中籤損失＝70 元手續費 ＋ 機會成本；
// 期望值＝中籤率×中籤損益 − (1−中籤率)×未中籤損失
//        ＝中籤率×價差 − 手續費 − 機會成本（兩種寫法等價，見測試「兩種寫法一致」）。

export const IPO_PROCESSING_FEE = 20;
export const IPO_MAILING_FEE = 50;
export const IPO_FIXED_FEE = IPO_PROCESSING_FEE + IPO_MAILING_FEE; // 70 元
export const IPO_DAYS_PER_YEAR = 365;

const normalize = (n: number): number =>
  Number.isFinite(n) ? Math.max(0, n) : 0;

/** 預扣總金額：承銷價×申購股數＋70 元（20 元處理費＋50 元郵寄工本費）。 */
export const calculatePrepaidAmount = (issuePrice: number, shares: number): number =>
  Math.round(normalize(issuePrice) * normalize(shares)) + IPO_FIXED_FEE;

/** 價差：(預期賣出價 − 承銷價)×申購股數，可為負（破發）。 */
export const calculateSpread = (
  issuePrice: number,
  sellPrice: number,
  shares: number,
): number =>
  Math.round((normalize(sellPrice) - normalize(issuePrice)) * normalize(shares));

/** 資金機會成本：預扣金額×年利率×凍結天數／365，四捨五入至元。 */
export const calculateOpportunityCost = (
  prepaidAmount: number,
  frozenDays: number,
  annualRatePct: number,
): number =>
  Math.round(
    (normalize(prepaidAmount) * normalize(annualRatePct)) / 100
      * normalize(frozenDays)
      / IPO_DAYS_PER_YEAR,
  );

/** 中籤時損益：價差 − 70 元手續費 − 機會成本（可為負，破發時就是賠錢）。 */
export const calculateWinProfit = (spread: number, opportunityCost: number): number =>
  spread - IPO_FIXED_FEE - normalize(opportunityCost);

/** 損益平衡賣出價（元／股）：中籤損益剛好為 0 的賣出價。
 * 中籤損益＝(賣出價−承銷價)×股數 − 70 元手續費 − 機會成本，
 * 令其為 0 得：賣出價＝承銷價＋(70＋機會成本)÷股數。
 * 機會成本只跟預扣金額、凍結天數、年利率有關，與賣出價無關，所以這個點是定值。 */
export const calculateBreakEvenSellPrice = (
  issuePrice: number,
  shares: number,
  opportunityCost: number,
): number => {
  const s = normalize(shares);
  if (s === 0) return Math.round(normalize(issuePrice) * 100) / 100;
  return Math.round((normalize(issuePrice) + (IPO_FIXED_FEE + normalize(opportunityCost)) / s) * 100) / 100;
};

/** 未中籤損失：70 元手續費 ＋ 機會成本。 */
export const calculateLoseLoss = (opportunityCost: number): number =>
  IPO_FIXED_FEE + normalize(opportunityCost);

/** 期望值：中籤率×中籤損益 − (1−中籤率)×未中籤損失。 */
export const calculateExpectedValue = (
  winRatePct: number,
  winProfit: number,
  loseLoss: number,
): number => {
  const p = Math.min(1, Math.max(0, normalize(winRatePct) / 100));
  return Math.round(p * winProfit - (1 - p) * loseLoss);
};

export type IpoVerdict = 'worth' | 'marginal' | 'not-worth';

/** 結論：期望值 > 0 值得抽；= 0 邊際；< 0 不值得抽。 */
export const getVerdict = (expectedValue: number): IpoVerdict =>
  expectedValue > 0 ? 'worth' : expectedValue < 0 ? 'not-worth' : 'marginal';

export interface IpoLotteryInput {
  issuePrice: number; // 承銷價（元）
  shares: number; // 申購股數（通常 1,000 股＝1 張）
  sellPrice: number; // 預期賣出價（元）
  winRatePct: number; // 中籤率（%）
  frozenDays: number; // 資金凍結天數
  annualRatePct: number; // 資金年利率（%，機會成本假設）
}

export interface IpoLotteryResult {
  prepaid: number; // 預扣總金額
  spread: number; // 價差
  opportunityCost: number; // 資金機會成本
  winProfit: number; // 中籤時損益
  loseLoss: number; // 未中籤損失
  expectedValue: number; // 期望值
  breakEvenSellPrice: number; // 損益平衡賣出價（元／股）
  verdict: IpoVerdict;
}

/** 一次算出全部輸出。 */
export const calculateIpoLottery = (input: IpoLotteryInput): IpoLotteryResult => {
  const prepaid = calculatePrepaidAmount(input.issuePrice, input.shares);
  const spread = calculateSpread(input.issuePrice, input.sellPrice, input.shares);
  const opportunityCost = calculateOpportunityCost(
    prepaid,
    input.frozenDays,
    input.annualRatePct,
  );
  const winProfit = calculateWinProfit(spread, opportunityCost);
  const loseLoss = calculateLoseLoss(opportunityCost);
  const expectedValue = calculateExpectedValue(input.winRatePct, winProfit, loseLoss);
  const breakEvenSellPrice = calculateBreakEvenSellPrice(input.issuePrice, input.shares, opportunityCost);
  return {
    prepaid,
    spread,
    opportunityCost,
    winProfit,
    loseLoss,
    expectedValue,
    breakEvenSellPrice,
    verdict: getVerdict(expectedValue),
  };
};
