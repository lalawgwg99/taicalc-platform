import { useMemo, useState } from "react";
import type { PlanningInput, ProjectionResult } from "../domain/types";
import { projectPlan } from "../engine/project";
import { summarizeResult } from "../engine/result-summary";
import { buildScenarioInput, type ScenarioParams } from "../engine/scenario-variants";
import { formatMoney } from "../lib/format";
import { useLocale } from "../i18n";
import { Field } from "./Field";

interface Props {
  input: PlanningInput;
}

interface ScenarioOutcome {
  result: ProjectionResult | null;
  error: string | null;
}

function runScenario(base: PlanningInput, params: ScenarioParams, warnings: Parameters<typeof projectPlan>[2]): ScenarioOutcome {
  try {
    return { result: projectPlan(buildScenarioInput(base, params), undefined, warnings), error: null };
  } catch (error) {
    return { result: null, error: error instanceof Error ? error.message.split("\n")[0] : String(error) };
  }
}

export function ScenarioCompare({ input }: Props) {
  const { t } = useLocale();
  const s = t.scenarioCompare;
  const baseRetirement = input.profile.retirementAge;
  const baseClaim = input.laborInsurance.claimAge;
  const longevity = input.profile.longevityAge;

  const [paramsB, setParamsB] = useState<ScenarioParams>(() => ({
    retirementAge: Math.min(baseRetirement + 5, Math.max(baseRetirement, longevity - 1)),
    extraMonthly: 5000,
    laborClaimAge: Math.min(baseClaim + 5, 70)
  }));
  const [paramsC, setParamsC] = useState<ScenarioParams>(() => ({
    retirementAge: baseRetirement,
    extraMonthly: 10000,
    laborClaimAge: baseClaim
  }));

  const paramsA: ScenarioParams = { retirementAge: baseRetirement, extraMonthly: 0, laborClaimAge: baseClaim };
  const allParams = [paramsA, paramsB, paramsC];
  const setters = [null, setParamsB, setParamsC] as const;
  const names = [s.nameA, s.nameB, s.nameC];

  const outcomes = useMemo(
    () => allParams.map((params) => runScenario(input, params, t.project.warnings)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input, paramsB, paramsC, t]
  );

  const outcomeText = (outcome: ScenarioOutcome): string => {
    if (!outcome.result) return s.invalid;
    const r = outcome.result;
    if (r.depletedMonth === null) return s.outcomeOk(r.input.profile.longevityAge);
    const age = r.records.find((record) => record.month === r.depletedMonth)?.age;
    return s.outcomeDepleted(age !== undefined ? age.toFixed(1) : "");
  };

  const gapText = (outcome: ScenarioOutcome): string => {
    if (!outcome.result) return "—";
    const summary = summarizeResult(outcome.result);
    return summary.meetsPlan ? `${s.over} ${formatMoney(summary.surplus)}` : `${s.short} ${formatMoney(summary.gap)}`;
  };

  const assetsText = (outcome: ScenarioOutcome): string => {
    if (!outcome.result) return "—";
    return formatMoney(summarizeResult(outcome.result).available);
  };

  return (
    <section className="plan-comparison scenario-compare" aria-label={s.label}>
      <div className="comparison-heading">
        <div>
          <strong>{s.title}</strong>
          <p>{s.intro}</p>
        </div>
      </div>

      <div className="scenario-compare-grid">
        {allParams.map((params, i) => (
          <div key={names[i]} className="scenario-compare-card">
            <h3>{names[i]}</h3>
            {setters[i] ? (
              <>
                <Field label={s.retirementAge} value={params.retirementAge} min={40} max={80} step={1}
                  onChange={(v) => setters[i]!((prev) => ({ ...prev, retirementAge: v }))} />
                <Field label={s.extraMonthly} value={params.extraMonthly} min={0} max={200000} step={1000}
                  onChange={(v) => setters[i]!((prev) => ({ ...prev, extraMonthly: v }))} />
                <Field label={s.laborClaimAge} value={params.laborClaimAge} min={60} max={70} step={1}
                  onChange={(v) => setters[i]!((prev) => ({ ...prev, laborClaimAge: v }))} />
              </>
            ) : (
              <dl className="scenario-compare-fixed">
                <div><dt>{s.retirementAge}</dt><dd>{params.retirementAge}</dd></div>
                <div><dt>{s.extraMonthly}</dt><dd>{params.extraMonthly}</dd></div>
                <div><dt>{s.laborClaimAge}</dt><dd>{params.laborClaimAge}</dd></div>
              </dl>
            )}
            {outcomes[i].error && <p className="scenario-compare-error" role="alert">{outcomes[i].error}</p>}
          </div>
        ))}
      </div>

      <div className="scenario-table-wrap">
        <table className="scenario-table">
          <caption className="sr-only">{s.caption}</caption>
          <thead>
            <tr><th>{s.colItem}</th>{names.map((name) => <th key={name}>{name}</th>)}</tr>
          </thead>
          <tbody>
            <tr><th>{s.rowAssets}</th>{outcomes.map((o, i) => <td key={i}>{assetsText(o)}</td>)}</tr>
            <tr><th>{s.rowGap}</th>{outcomes.map((o, i) => <td key={i}>{gapText(o)}</td>)}</tr>
            <tr>
              <th>{s.rowOutcome}</th>
              {outcomes.map((o, i) => (
                <td key={i} className={o.result ? (o.result.depletedMonth === null ? "ok" : "not-ok") : undefined}>{outcomeText(o)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="section-footnote">{s.footnote}</p>
    </section>
  );
}
