import { describe, expect, it } from "vitest";
import { defaultInput } from "../defaults";
import { projectPlan } from "./project";
import { summarizeResult } from "./result-summary";
import { buildScenarioInput } from "./scenario-variants";

describe("buildScenarioInput", () => {
  it("情境 A（條件與目前方案相同）的結果與單情境試算完全一致", () => {
    const base = projectPlan(structuredClone(defaultInput));
    const scenarioA = projectPlan(buildScenarioInput(defaultInput, {
      retirementAge: defaultInput.profile.retirementAge,
      extraMonthly: 0,
      laborClaimAge: defaultInput.laborInsurance.claimAge
    }));
    expect(scenarioA.depletedMonth).toBe(base.depletedMonth);
    expect(scenarioA.investmentGapAtRetirement).toBe(base.investmentGapAtRetirement);
    expect(scenarioA.projectedRetirementAssetsAtRetirement).toBe(base.projectedRetirementAssetsAtRetirement);
    expect(scenarioA.requiredRetirementAssetsAtRetirement).toBe(base.requiredRetirementAssetsAtRetirement);
  });

  it("晚 5 年退休＋每月多存 5,000＋勞保延到 70 歲請領：可試算且缺口不大於原方案", () => {
    const baseSummary = summarizeResult(projectPlan(structuredClone(defaultInput)));
    const variant = buildScenarioInput(defaultInput, { retirementAge: 70, extraMonthly: 5000, laborClaimAge: 70 });
    const result = projectPlan(variant);
    const summary = summarizeResult(result);
    expect(result.input.profile.retirementAge).toBe(70);
    expect(result.input.laborInsurance.claimAge).toBe(70);
    // 勞退請領年齡連動延到退休年齡（引擎驗證要求）
    expect(result.input.laborPension.claimAge).toBeGreaterThanOrEqual(70);
    // 每月多存有進到持倉投入
    const totalContribution = result.input.investment.holdings.reduce((s, h) => s + h.monthlyContributionToday, 0);
    const baseContribution = defaultInput.investment.holdings.reduce((s, h) => s + h.monthlyContributionToday, 0);
    expect(totalContribution).toBe(baseContribution + 5000);
    expect(summary.gap).toBeLessThanOrEqual(baseSummary.gap);
  });

  it("提早退休到 60 歲：勞保請領年齡低於退休年齡時會被抬到退休年齡", () => {
    const variant = buildScenarioInput(defaultInput, { retirementAge: 60, extraMonthly: 0, laborClaimAge: 60 });
    expect(variant.laborInsurance.claimAge).toBe(60);
    expect(() => projectPlan(variant)).not.toThrow();
  });
});
