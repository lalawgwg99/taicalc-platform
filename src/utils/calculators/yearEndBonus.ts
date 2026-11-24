// 年終獎金扣稅邏輯（115 年度，2026 年適用）
// 法源：財政部 11404675280 號函 115 年度薪資所得扣繳稅額表（起扣點 90,501 元）、
// 《薪資所得扣繳辦法》第 6 條（非每月給付之薪資按給付額扣 5%）、
// 全民健康保險法第 31 條（全年累計獎金超過當月投保金額 4 倍部分扣補充保費）、
// 健保署二代健保補充保險費簡介 115.01.05 版（費率 2.11%）。
// 注意：補充保費看的是「全年累計獎金」。健保署官方公式（nhi.gov.tw 獎金實例說明）：
// 累計超過 4 倍投保金額之獎金＝給付時當年度累計獎金金額－給付時投保金額×4；
// 以單次給付獎金金額與累計超過 4 倍投保金額之獎金比較，以較小之金額為獎金的費基。

export const WITHHOLD_THRESHOLD = 90501;
export const WITHHOLD_RATE = 0.05;
export const SUPP_RATE = 0.0211;
export const SUPP_MULTIPLE = 4;

const normalize = (n: number): number =>
  Number.isFinite(n) ? Math.max(0, n) : 0;

/** 預扣所得稅：單次給付達 90,501 元，按給付「總額」扣 5%；未達免預扣。 */
export const calculateWithholdingTax = (bonus: number): number => {
  const b = normalize(bonus);
  return b >= WITHHOLD_THRESHOLD ? Math.round(b * WITHHOLD_RATE) : 0;
};

/** 補充保費門檻：當月投保金額 × 4 倍。 */
export const calculateSuppThreshold = (insuredAmount: number): number =>
  normalize(insuredAmount) * SUPP_MULTIPLE;

/** 補充保費：全年累計獎金（本次年終＋今年已領其他獎金）超過投保金額 4 倍的部分 × 2.11%；
 *  費基不超過本次給付金額（健保署官方公式：取單次給付與累計超過部分較小者）；未超過為 0。 */
export const calculateSuppFee = (bonus: number, insuredAmount: number, otherBonus = 0): number => {
  const cumulative = normalize(bonus) + normalize(otherBonus);
  const over = cumulative - calculateSuppThreshold(insuredAmount);
  if (over <= 0) return 0;
  const base = Math.min(normalize(bonus), over);
  return Math.round(base * SUPP_RATE);
};

/** 實拿年終：總額 − 預扣所得稅 − 補充保費（補充保費按全年累計計算）。 */
export const calculateNetBonus = (bonus: number, insuredAmount: number, otherBonus = 0): number =>
  normalize(bonus) - calculateWithholdingTax(bonus) - calculateSuppFee(bonus, insuredAmount, otherBonus);
