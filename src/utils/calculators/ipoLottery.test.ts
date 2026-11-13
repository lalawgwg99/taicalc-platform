import { describe, expect, it } from 'vitest';

import {
  IPO_FIXED_FEE,
  calculateBreakEvenSellPrice,
  calculateExpectedValue,
  calculateIpoLottery,
  calculateLoseLoss,
  calculateOpportunityCost,
  calculatePrepaidAmount,
  calculateSpread,
  calculateWinProfit,
  getVerdict,
} from './ipoLottery';

// 手算驗算（node 逐筆核對，兩種期望值寫法皆一致）：
// 案例 1 熱門檔（漢測 9/22 首日，承銷價 2,250、收盤 4,730、中籤率 0.29%）：
//   預扣 2,250×1,000＋70＝2,250,070；機會成本 2,250,070×2%×5/365＝616.46→616；
//   價差 (4,730−2,250)×1,000＝2,480,000；中籤損益 2,480,000−70−616＝2,479,314；
//   未中籤損失 70＋616＝686；期望值 0.29%×2,479,314−99.71%×686＝7,190.01−684.01＝6,506
// 案例 2 破發檔（巨虹，承銷價 45.6、跌停 33.1、中籤率假設 10%）：
//   預扣 45.6×1,000＋70＝45,670；機會成本 45,670×2%×5/365＝12.51→13；
//   價差 (33.1−45.6)×1,000＝−12,500；中籤損益 −12,500−70−13＝−12,583；
//   未中籤損失 70＋13＝83；期望值 10%×(−12,583)−90%×83＝−1,258.3−74.7＝−1,333
// 案例 3 一般檔（承銷價 100、預期賣出 110、中籤率 3%）：
//   預扣 100,070；機會成本 100,070×2%×5/365＝27.42→27；價差 10,000；
//   中籤損益 10,000−70−27＝9,903；未中籤損失 97；
//   期望值 3%×9,903−97%×97＝297.09−94.09＝203
// 案例 4 邊際偏負（承銷價 100、預期賣出 101、中籤率 1%）：
//   價差 1,000；中籤損益 1,000−70−27＝903；未中籤損失 97；
//   期望值 1%×903−99%×97＝9.03−96.03＝−87
// 損益平衡賣出價＝承銷價＋(70＋機會成本)÷股數（中籤損益剛好為 0 的賣出價）：
//   案例 1：2,250＋686÷1,000＝2,250.69；案例 2：45.6＋83÷1,000＝45.68；
//   案例 3：100＋97÷1,000＝100.10
describe('calculatePrepaidAmount', () => {
  it('申購通知實例：90 元×1,000 股→90,070；252 元×1,000 股→252,070；35.15 元×3,000 股→105,520', () => {
    expect(calculatePrepaidAmount(90, 1000)).toBe(90070);
    expect(calculatePrepaidAmount(252, 1000)).toBe(252070);
    expect(calculatePrepaidAmount(35.15, 3000)).toBe(105520);
  });

  it('漢測一張：2,250 元×1,000 股→2,250,070', () => {
    expect(calculatePrepaidAmount(2250, 1000)).toBe(2250070);
  });

  it('手續費固定 70 元（20 元處理費＋50 元郵寄工本費）', () => {
    expect(IPO_FIXED_FEE).toBe(70);
  });

  it('0、負數、NaN 只剩 70 元手續費', () => {
    expect(calculatePrepaidAmount(0, 1000)).toBe(70);
    expect(calculatePrepaidAmount(-100, 1000)).toBe(70);
    expect(calculatePrepaidAmount(NaN, 1000)).toBe(70);
  });
});

describe('calculateSpread / calculateOpportunityCost', () => {
  it('案例 1：漢測價差 2,480,000；機會成本 616', () => {
    expect(calculateSpread(2250, 4730, 1000)).toBe(2480000);
    expect(calculateOpportunityCost(2250070, 5, 2)).toBe(616);
  });

  it('案例 2：巨虹價差 −12,500（破發）；機會成本 13', () => {
    expect(calculateSpread(45.6, 33.1, 1000)).toBe(-12500);
    expect(calculateOpportunityCost(45670, 5, 2)).toBe(13);
  });

  it('案例 3：價差 10,000；機會成本 27', () => {
    expect(calculateSpread(100, 110, 1000)).toBe(10000);
    expect(calculateOpportunityCost(100070, 5, 2)).toBe(27);
  });

  it('凍結 0 天或利率 0%，機會成本為 0', () => {
    expect(calculateOpportunityCost(100070, 0, 2)).toBe(0);
    expect(calculateOpportunityCost(100070, 5, 0)).toBe(0);
  });
});

describe('calculateWinProfit / calculateLoseLoss', () => {
  it('案例 1：中籤損益 2,479,314；未中籤損失 686', () => {
    expect(calculateWinProfit(2480000, 616)).toBe(2479314);
    expect(calculateLoseLoss(616)).toBe(686);
  });

  it('案例 2：中籤損益 −12,583（抽中反而賠）；未中籤損失 83', () => {
    expect(calculateWinProfit(-12500, 13)).toBe(-12583);
    expect(calculateLoseLoss(13)).toBe(83);
  });

  it('案例 3：中籤損益 9,903；未中籤損失 97', () => {
    expect(calculateWinProfit(10000, 27)).toBe(9903);
    expect(calculateLoseLoss(27)).toBe(97);
  });
});

describe('calculateExpectedValue', () => {
  it('案例 1：漢測期望值 6,506（中籤率 0.29% 仍為正，因為價差夠大）', () => {
    expect(calculateExpectedValue(0.29, 2479314, 686)).toBe(6506);
  });

  it('案例 2：巨虹期望值 −1,333', () => {
    expect(calculateExpectedValue(10, -12583, 83)).toBe(-1333);
  });

  it('案例 3：一般檔期望值 203', () => {
    expect(calculateExpectedValue(3, 9903, 97)).toBe(203);
  });

  it('案例 4：邊際偏負期望值 −87', () => {
    expect(calculateExpectedValue(1, 903, 97)).toBe(-87);
  });

  it('邊界：中籤率 0% 期望值＝−未中籤損失；100% 期望值＝中籤損益', () => {
    expect(calculateExpectedValue(0, 9903, 97)).toBe(-97);
    expect(calculateExpectedValue(100, 9903, 97)).toBe(9903);
  });

  it('中籤率超過 100% 以 100% 計、負數以 0% 計', () => {
    expect(calculateExpectedValue(150, 9903, 97)).toBe(9903);
    expect(calculateExpectedValue(-5, 9903, 97)).toBe(-97);
  });
});

describe('兩種期望值寫法等價：中籤率×中籤損益 − (1−中籤率)×未中籤損失 ＝ 中籤率×價差 − 70 − 機會成本', () => {
  it.each([
    [0.29, 2480000, 616],
    [10, -12500, 13],
    [3, 10000, 27],
    [1, 1000, 27],
  ])('中籤率 %s%%、價差 %s、機會成本 %s', (winRatePct, spread, oppCost) => {
    const winProfit = calculateWinProfit(spread, oppCost);
    const loseLoss = calculateLoseLoss(oppCost);
    const byOutcomes = calculateExpectedValue(winRatePct, winProfit, loseLoss);
    const byFormula = Math.round((winRatePct / 100) * spread - IPO_FIXED_FEE - oppCost);
    expect(byOutcomes).toBe(byFormula);
  });
});

describe('calculateIpoLottery 整合', () => {
  it('案例 1 漢測：期望值 6,506，結論值得抽', () => {
    const r = calculateIpoLottery({
      issuePrice: 2250, shares: 1000, sellPrice: 4730,
      winRatePct: 0.29, frozenDays: 5, annualRatePct: 2,
    });
    expect(r).toEqual({
      prepaid: 2250070,
      spread: 2480000,
      opportunityCost: 616,
      winProfit: 2479314,
      loseLoss: 686,
      expectedValue: 6506,
      breakEvenSellPrice: 2250.69,
      verdict: 'worth',
    });
  });

  it('案例 2 巨虹：期望值 −1,333，結論不值得抽', () => {
    const r = calculateIpoLottery({
      issuePrice: 45.6, shares: 1000, sellPrice: 33.1,
      winRatePct: 10, frozenDays: 5, annualRatePct: 2,
    });
    expect(r).toEqual({
      prepaid: 45670,
      spread: -12500,
      opportunityCost: 13,
      winProfit: -12583,
      loseLoss: 83,
      expectedValue: -1333,
      breakEvenSellPrice: 45.68,
      verdict: 'not-worth',
    });
  });

  it('案例 3 一般檔：期望值 203，結論值得抽', () => {
    const r = calculateIpoLottery({
      issuePrice: 100, shares: 1000, sellPrice: 110,
      winRatePct: 3, frozenDays: 5, annualRatePct: 2,
    });
    expect(r.expectedValue).toBe(203);
    expect(r.verdict).toBe('worth');
  });

  it('案例 4 邊際偏負：期望值 −87，結論不值得抽', () => {
    const r = calculateIpoLottery({
      issuePrice: 100, shares: 1000, sellPrice: 101,
      winRatePct: 1, frozenDays: 5, annualRatePct: 2,
    });
    expect(r.expectedValue).toBe(-87);
    expect(r.verdict).toBe('not-worth');
  });
});

describe('calculateBreakEvenSellPrice', () => {
  it('案例 1 漢測：2,250.69 元／股；案例 2 巨虹：45.68 元／股；案例 3：100.10 元／股', () => {
    expect(calculateBreakEvenSellPrice(2250, 1000, 616)).toBe(2250.69);
    expect(calculateBreakEvenSellPrice(45.6, 1000, 13)).toBe(45.68);
    expect(calculateBreakEvenSellPrice(100, 1000, 27)).toBe(100.1);
  });

  it('賣在損益平衡價時中籤損益約為 0（只差四捨五入不到 1 元×股數的零頭）', () => {
    const be = calculateBreakEvenSellPrice(2250, 1000, 616);
    const winProfit = calculateWinProfit(calculateSpread(2250, be, 1000), 616);
    expect(Math.abs(winProfit)).toBeLessThanOrEqual(10);
  });

  it('股數為 0 時回傳承銷價（無意義的邊界，不報錯）', () => {
    expect(calculateBreakEvenSellPrice(100, 0, 27)).toBe(100);
  });
});

describe('getVerdict', () => {
  it('大於 0 值得抽、等於 0 邊際、小於 0 不值得抽', () => {
    expect(getVerdict(1)).toBe('worth');
    expect(getVerdict(0)).toBe('marginal');
    expect(getVerdict(-1)).toBe('not-worth');
  });
});
