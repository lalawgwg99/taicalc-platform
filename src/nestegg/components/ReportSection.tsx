import { useMemo } from "react";
import type { PlanningInput } from "../domain/types";
import { ageAtMonth, birthSerial, toSerial } from "../domain/time";
import { buildYearlyTable } from "../engine/report";
import { summarizeResult } from "../engine/result-summary";
import type { ScenarioOutcome, ScenarioParams } from "../engine/scenario-variants";
import { formatMoney, formatPercent } from "../lib/format";
import { useLocale } from "../i18n";

interface Props {
  input: PlanningInput;
  params: [ScenarioParams, ScenarioParams, ScenarioParams];
  outcomes: ScenarioOutcome[];
}

function yearsText(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function ReportSection({ input, params, outcomes }: Props) {
  const { t, locale } = useLocale();
  const r = t.report;
  const s = t.scenarioCompare;
  const names = [s.nameA, s.nameB, s.nameC];

  const generatedOn = useMemo(
    () => new Date().toLocaleDateString(locale === "en" ? "en-US" : "zh-TW"),
    [locale]
  );
  const yearlyRows = useMemo(
    () => (outcomes[0]?.result ? buildYearlyTable(outcomes[0].result) : []),
    [outcomes]
  );

  const outcomeText = (outcome: ScenarioOutcome): string => {
    if (!outcome.result) return r.invalid;
    const result = outcome.result;
    if (result.depletedMonth === null) return r.outcomeOk(result.input.profile.longevityAge);
    const age = result.records.find((record) => record.month === result.depletedMonth)?.age;
    return r.outcomeDepleted(age !== undefined ? age.toFixed(1) : "");
  };
  const gapText = (outcome: ScenarioOutcome): string => {
    if (!outcome.result) return "—";
    const summary = summarizeResult(outcome.result);
    return summary.meetsPlan ? `${r.over} ${formatMoney(summary.surplus)}` : `${r.short} ${formatMoney(summary.gap)}`;
  };
  const assetsText = (outcome: ScenarioOutcome): string => {
    if (!outcome.result) return "—";
    return formatMoney(summarizeResult(outcome.result).available);
  };

  const birth = birthSerial(input.profile.birthYearROC, input.profile.birthMonth);
  const currentAge = Math.floor(ageAtMonth(birth, toSerial(input.asOf.year, input.asOf.month)));
  const birthText = input.profile.calendar === "roc"
    ? r.birthRoc(input.profile.birthYearROC, input.profile.birthMonth)
    : r.birthCe(input.profile.birthYearROC + 1911, input.profile.birthMonth);
  const labor = input.laborInsurance.enabled
    ? (outcomes[0]?.result?.laborInsurance.eligibleForAnnuity
      ? r.laborOn(
        yearsText(outcomes[0].result.laborInsurance.insuredYearsAtClaim),
        formatMoney(input.laborInsurance.averageSalaryToday),
        input.laborInsurance.claimAge,
        formatMoney(outcomes[0].result.laborInsurance.initialMonthlyNominal)
      )
      : r.laborLump(formatMoney(outcomes[0]?.result?.laborInsurance.lumpSumNominal ?? 0)))
    : r.laborOff;
  const pension = input.laborPension.enabled
    ? r.pensionOn(
      formatMoney(input.laborPension.balanceNow),
      input.laborPension.claimAge,
      input.laborPension.mode === "lump" ? r.modeLump : r.modeMonthly
    )
    : r.pensionOff;

  return (
    <section id="nestegg-report" className="plan-comparison nestegg-report" aria-label={r.label}>
      <div className="comparison-heading">
        <div>
          <strong>{r.title}</strong>
          <p>{r.generatedOn(generatedOn)} · {r.freeBadge}</p>
        </div>
        <div className="report-download">
          <button type="button" className="step-button primary" onClick={() => window.print()}>{r.download}</button>
          <p>{r.downloadHint}</p>
        </div>
      </div>

      <h3>{r.scenarioTitle}</h3>
      <p>{r.scenarioIntro}</p>
      <div className="scenario-table-wrap">
        <table className="scenario-table">
          <caption className="sr-only">{r.scenarioTitle}</caption>
          <thead>
            <tr><th>{r.colItem}</th>{names.map((name) => <th key={name}>{name}</th>)}</tr>
          </thead>
          <tbody>
            <tr><th>{r.rowRetirementAge}</th>{params.map((p, i) => <td key={i}>{p.retirementAge}</td>)}</tr>
            <tr><th>{r.rowExtraMonthly}</th>{params.map((p, i) => <td key={i}>{formatMoney(p.extraMonthly)}</td>)}</tr>
            <tr><th>{r.rowClaimAge}</th>{params.map((p, i) => <td key={i}>{p.laborClaimAge}</td>)}</tr>
            <tr><th>{r.rowAssets}</th>{outcomes.map((o, i) => <td key={i}>{assetsText(o)}</td>)}</tr>
            <tr><th>{r.rowGap}</th>{outcomes.map((o, i) => <td key={i}>{gapText(o)}</td>)}</tr>
            <tr>
              <th>{r.rowOutcome}</th>
              {outcomes.map((o, i) => (
                <td key={i} className={o.result ? (o.result.depletedMonth === null ? "ok" : "not-ok") : undefined}>{outcomeText(o)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <h3>{r.yearlyTitle}</h3>
      <p>{r.yearlyIntro}</p>
      {yearlyRows.length > 0 ? (
        <div className="scenario-table-wrap">
          <table className="scenario-table report-yearly-table">
            <thead>
              <tr><th>{r.colYear}</th><th>{r.colAge}</th><th>{r.colAssets}</th><th>{r.colExpense}</th></tr>
            </thead>
            <tbody>
              {yearlyRows.map((row) => (
                <tr key={row.year}>
                  <th>{row.year}</th>
                  <td>{row.age.toFixed(1)}</td>
                  <td>{formatMoney(row.assetsNominal)}</td>
                  <td>{formatMoney(row.expenseNominal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>{r.invalid}</p>
      )}

      <h3>{r.assumptionsTitle}</h3>
      <dl className="report-assumptions">
        <div><dt>{r.aBirth}</dt><dd>{birthText}</dd></div>
        <div><dt>{r.aCurrentAge}</dt><dd>{r.yearsUnit(String(currentAge))}</dd></div>
        <div><dt>{r.aRetirementAge}</dt><dd>{r.yearsUnit(String(input.profile.retirementAge))}</dd></div>
        <div><dt>{r.aLongevity}</dt><dd>{r.yearsUnit(String(input.profile.longevityAge))}</dd></div>
        <div><dt>{r.aSpending}</dt><dd>{formatMoney(input.spending.monthlyToday)}</dd></div>
        <div><dt>{r.aInflation}</dt><dd>{formatPercent(input.economy.inflationRate)}</dd></div>
        <div><dt>{r.aLabor}</dt><dd>{labor}</dd></div>
        <div><dt>{r.aPension}</dt><dd>{pension}</dd></div>
        <div>
          <dt>{r.aInvestment}</dt>
          <dd>{input.investment.holdings.map((h) => (
            <span key={h.id} className="report-holding">
              {r.holdingLine(h.name, formatMoney(h.valueNow), formatMoney(h.monthlyContributionToday), formatPercent(h.grossReturnRate), formatPercent(h.feeRate))}
            </span>
          ))}</dd>
        </div>
        <div>
          <dt>{r.aPartTime}</dt>
          <dd>{input.partTime.enabled ? r.partTimeOn(formatMoney(input.partTime.monthlyToday), input.partTime.startAge, input.partTime.endAge) : r.partTimeOff}</dd>
        </div>
      </dl>

      <h3>{r.disclaimerTitle}</h3>
      <p className="section-footnote">{r.disclaimerBody}</p>
      <p className="section-footnote">{s.footnote}</p>
    </section>
  );
}
