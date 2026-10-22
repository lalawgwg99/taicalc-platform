import type { PlanningInput } from "../domain/types";
import { birthSerial, monthAtAge, toSerial } from "../domain/time";

export interface ScenarioParams {
  retirementAge: number;
  /** 每月多存金額：加到各筆持倉的每月投入（按現有投入比例分配，全為 0 時加到第一筆） */
  extraMonthly: number;
  laborClaimAge: number;
}

/**
 * 從目前方案產生一個情境方案：只改退休年齡、每月多存、勞保請領年齡三個條件，
 * 其餘欄位原樣保留。為了讓引擎驗證能通過，會做三個連動調整（結果表下方有註明）：
 * 1. 勞退請領年齡若早於新退休年齡，延到退休年齡（引擎規定請領不得早於退休）。
 * 2. 兼職開始年齡、長照開始年齡若早於新退休年齡，延到退休年齡。
 * 3. 自訂年資模式下，未來年資若超過「到退休的年數」，截到退休當年。
 */
export function buildScenarioInput(base: PlanningInput, params: ScenarioParams): PlanningInput {
  const input: PlanningInput = structuredClone(base);
  const longevity = input.profile.longevityAge;
  const retirementAge = Math.min(Math.max(Math.round(params.retirementAge), 18), Math.max(19, longevity - 1));
  input.profile.retirementAge = retirementAge;
  input.laborInsurance.claimAge = Math.min(Math.max(Math.round(params.laborClaimAge), retirementAge), longevity);
  if (input.laborPension.claimAge < retirementAge) input.laborPension.claimAge = Math.min(retirementAge, longevity);
  if (input.partTime.enabled && input.partTime.startAge < retirementAge) {
    input.partTime.startAge = retirementAge;
    if (input.partTime.endAge < input.partTime.startAge) input.partTime.endAge = input.partTime.startAge;
  }
  if (input.spending.longTermCareEnabled && (input.spending.longTermCareStartAge ?? 80) < retirementAge) {
    input.spending.longTermCareStartAge = retirementAge;
  }

  const birth = birthSerial(input.profile.birthYearROC, input.profile.birthMonth);
  const monthsToRetirement = Math.max(0, monthAtAge(birth, retirementAge) - toSerial(input.asOf.year, input.asOf.month));
  const yearsToRetirement = monthsToRetirement / 12;
  if (input.laborInsurance.futureYearsMode === "custom") {
    input.laborInsurance.insuredYearsFuture = Math.min(input.laborInsurance.insuredYearsFuture, yearsToRetirement);
  }
  if (input.laborPension.futureYearsMode === "custom") {
    input.laborPension.seniorityYearsFuture = Math.min(input.laborPension.seniorityYearsFuture, yearsToRetirement);
  }

  const extra = Math.max(0, Math.round(params.extraMonthly));
  const holdings = input.investment.holdings;
  if (extra > 0 && holdings.length > 0) {
    const totalContribution = holdings.reduce((sum, h) => sum + Math.max(0, h.monthlyContributionToday), 0);
    if (totalContribution > 0) {
      holdings.forEach((h) => {
        h.monthlyContributionToday += Math.round(extra * (Math.max(0, h.monthlyContributionToday) / totalContribution));
      });
    } else {
      holdings[0].monthlyContributionToday += extra;
    }
  }
  return input;
}
