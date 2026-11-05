import { describe, expect, it } from "vitest";
import { defaultInput } from "../defaults";
import type { ProjectionResult } from "../domain/types";
import { projectPlan } from "./project";
import { buildYearlyTable } from "./report";

describe("buildYearlyTable", () => {
  it("彙整規則：每年取 12 月底總資產與年齡，支出為全年加總", () => {
    const fake = {
      records: [
        { month: 2026 * 12 + 0, age: 35.0, expenseNominal: 100, totalRetirementAssetsNominal: 1000 },
        { month: 2026 * 12 + 11, age: 35.9, expenseNominal: 200, totalRetirementAssetsNominal: 1200 },
        { month: 2027 * 12 + 5, age: 36.4, expenseNominal: 300, totalRetirementAssetsNominal: 900 }
      ]
    } as unknown as ProjectionResult;
    const rows = buildYearlyTable(fake);
    expect(rows).toEqual([
      { year: 2026, age: 35.9, assetsNominal: 1200, expenseNominal: 300 },
      { year: 2027, age: 36.4, assetsNominal: 900, expenseNominal: 300 }
    ]);
  });

  it("以預設輸入實算：年度連續、由退休當年一路到預期壽命年", () => {
    const result = projectPlan(structuredClone(defaultInput));
    const rows = buildYearlyTable(result);
    expect(rows.length).toBeGreaterThan(0);
    // 引擎月度紀錄只覆蓋退休後：首年為退休年（1991 出生＋65 歲退休＝2056）
    expect(rows[0].year).toBe(defaultInput.profile.birthYearROC + 1911 + defaultInput.profile.retirementAge);
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].year).toBe(rows[i - 1].year + 1);
    }
    const lastYear = defaultInput.profile.birthYearROC + 1911 + defaultInput.profile.longevityAge;
    expect(rows[rows.length - 1].year).toBe(lastYear);
    for (const row of rows) {
      expect(Number.isFinite(row.assetsNominal)).toBe(true);
      expect(row.expenseNominal).toBeGreaterThanOrEqual(0);
    }
  });
});
