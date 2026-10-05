import { describe, expect, it } from "vitest";
import { applyMonthlyInvestment, calculateInvestment, solveMonthlyInvestment, type InvestmentPlan } from "./investment-tool";
import { makeInput } from "../test-fixtures";
import { projectInvestmentAtRetirement } from "../modules/investment";
import { birthSerial, monthAtAge, toSerial } from "../domain/time";
import { projectPlan } from "./project";
import { simulateRetirement } from "./simulate";

const base: InvestmentPlan = { holdings: [{ id: "one", name: "投資", valueNow: 100000, monthlyContributionToday: 1000, grossReturnRate: 0, feeRate: 0 }], months: 12, inflation: 0, contributionGrowth: 0, lumpMonth: 6, lumpAmount: 10000, withdrawal: 0 };
describe("independent investment tool", () => {
  it("applies a total suggestion, preserving weights and never mutating principal", () => {
    const holdings = [base.holdings[0], { ...base.holdings[0], id: "two", monthlyContributionToday: 3000 }];
    const applied = applyMonthlyInvestment(holdings, 10000);
    expect(applied.map(h => h.monthlyContributionToday)).toEqual([2500, 7500]);
    expect(applied.map(h => h.valueNow)).toEqual([100000, 100000]);
    expect(holdings[0].monthlyContributionToday).toBe(1000);
    expect(applyMonthlyInvestment(holdings.map(h => ({ ...h, monthlyContributionToday: 0 })), 500).map(h => h.monthlyContributionToday)).toEqual([500, 0]);
    expect(applyMonthlyInvestment(holdings, 0).map(h => h.monthlyContributionToday)).toEqual([0, 0]);
  });
  it("rounded multi-asset suggestions still achieve the solved target", () => {
    const plan = { ...base, months: 120, inflation: 0.02, contributionGrowth: 0.02, holdings: [base.holdings[0], { ...base.holdings[0], id: "two", monthlyContributionToday: 3000, grossReturnRate: 0.06 }] };
    const suggested = applyMonthlyInvestment(plan.holdings, solveMonthlyInvestment(plan, 2000000));
    expect(calculateInvestment({ ...plan, holdings: suggested }).final.today).toBeGreaterThanOrEqual(2000000);
  });
  it("has exact zero-return cash accounting", () => {
    const result = calculateInvestment(base);
    expect(result.final.nominal).toBe(122000);
    expect(result.final.gain).toBe(0);
    expect(result.records[4].nominal).toBe(105000);
    expect(result.records[5].nominal).toBe(116000);
  });
  it("matches retirement accumulation with the same settings, including fees", () => {
    const input = makeInput();
    const months = monthAtAge(birthSerial(input.profile.birthYearROC, input.profile.birthMonth), input.profile.retirementAge) - toSerial(input.asOf.year, input.asOf.month);
    expect(calculateInvestment({ ...base, holdings: input.investment.holdings, months, contributionGrowth: input.investment.contributionGrowthRate, lumpAmount: 0 }).final.nominal).toBeCloseTo(projectInvestmentAtRetirement(input), 6);
  });
  it("inverts the target and counts withdrawals without negative balances", () => {
    expect(solveMonthlyInvestment({ ...base, lumpAmount: 0 }, 124000)).toBe(2000);
    const result = calculateInvestment({ ...base, lumpAmount: 0, withdrawal: 11000 });
    expect(result.depletedMonth).toBe(11);
    expect(result.final.nominal).toBe(0);
    expect(result.final.principal + result.final.gain - result.withdrawn).toBeCloseTo(0);
  });
  it("discounts future money and supports negative returns", () => {
    const result = calculateInvestment({ ...base, inflation: 0.02 }, -0.02);
    expect(result.final.today).toBeCloseTo(result.final.nominal / 1.02);
    expect(result.final.gain).toBeLessThan(0);
  });
  it("rejects invalid months and non-finite or negative input", () => {
    for (const patch of [{ months: 0 }, { months: 1201 }, { lumpMonth: 13 }, { withdrawal: -1 }, { inflation: NaN }]) expect(() => calculateInvestment({ ...base, ...patch })).toThrow();
  });
});

describe("retirement report regressions", () => {
  it("does not count a later pension in the retirement opening withdrawal base", () => {
    const result = projectPlan(makeInput({ laborPension: { claimAge: 67, lumpReinvestRate: 1 } }));
    expect(result.lumpPensionReinvestedAtRetirement).toBe(0);
  });
  for (const reinvest of [0, 0.5, 1]) it(`uses invested pension only for withdrawal reference (${reinvest})`, () => {
    const input = makeInput({ economy: { inflationRate: 0 }, laborPension: { lumpReinvestRate: reinvest }, investment: { withdrawalRule: { enabled: true, annualRate: 0.04 } } });
    const result = projectPlan(input);
    // 只有再投入的那一份一次領勞退，才計入提領參考基數；現金保留部分不計入
    expect(result.lumpPensionReinvestedAtRetirement).toBeCloseTo(result.lumpPensionAmountAtRetirement * reinvest, 6);
    expect(result.lumpPensionCashAtRetirement).toBeCloseTo(result.lumpPensionAmountAtRetirement * (1 - reinvest), 6);
    const investedBase = result.projectedInvestmentAtRetirement + result.lumpPensionReinvestedAtRetirement;
    const monthlyReference = investedBase * 0.04 / 12;
    expect(monthlyReference).toBeGreaterThan(0);
    expect(investedBase).toBeLessThanOrEqual(result.projectedRetirementAssetsAtRetirement);
  });
  it("uses the same forward engine to solve the minimum starting capital", () => {
    const input = makeInput({ economy: { inflationRate: 0.02 } });
    const result = projectPlan(input);
    const run = (amount: number) => simulateRetirement(input, result.laborInsurance, result.nationalPension, result.laborPension, amount);
    expect(run(result.requiredInvestmentAtRetirement).depletedMonth).toBeNull();
    expect(run(result.requiredInvestmentAtRetirement - 100).depletedMonth).not.toBeNull();
    expect(run(result.requiredInvestmentAtRetirement + 100000).endingPortfolioReal).toBeGreaterThan(run(result.requiredInvestmentAtRetirement).endingPortfolioReal);
  });
});
