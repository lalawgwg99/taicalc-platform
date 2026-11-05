import { summarizeResult } from "../engine/result-summary";
import type { ScenarioOutcome, ScenarioParams } from "../engine/scenario-variants";
import { formatMoney } from "../lib/format";
import { useLocale } from "../i18n";
import { Field } from "./Field";

interface Props {
  params: [ScenarioParams, ScenarioParams, ScenarioParams];
  outcomes: ScenarioOutcome[];
  onParamsChange: (index: 1 | 2, params: ScenarioParams) => void;
}

export function ScenarioCompare({ params, outcomes, onParamsChange }: Props) {
  const { t } = useLocale();
  const s = t.scenarioCompare;
  const names = [s.nameA, s.nameB, s.nameC];

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
        {params.map((param, i) => (
          <div key={names[i]} className="scenario-compare-card">
            <h3>{names[i]}</h3>
            {i === 0 ? (
              <dl className="scenario-compare-fixed">
                <div><dt>{s.retirementAge}</dt><dd>{param.retirementAge}</dd></div>
                <div><dt>{s.extraMonthly}</dt><dd>{param.extraMonthly}</dd></div>
                <div><dt>{s.laborClaimAge}</dt><dd>{param.laborClaimAge}</dd></div>
              </dl>
            ) : (
              <>
                <Field label={s.retirementAge} value={param.retirementAge} min={40} max={80} step={1}
                  onChange={(v) => onParamsChange(i as 1 | 2, { ...param, retirementAge: v })} />
                <Field label={s.extraMonthly} value={param.extraMonthly} min={0} max={200000} step={1000}
                  onChange={(v) => onParamsChange(i as 1 | 2, { ...param, extraMonthly: v })} />
                <Field label={s.laborClaimAge} value={param.laborClaimAge} min={60} max={70} step={1}
                  onChange={(v) => onParamsChange(i as 1 | 2, { ...param, laborClaimAge: v })} />
              </>
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
