import { fromSerial } from "../domain/time";
import type { ProjectionResult } from "../domain/types";

export interface YearlyRow {
  year: number;
  /** 該年 12 月底的年齡（小數 1 位） */
  age: number;
  /** 該年 12 月底的總資產（名目金額） */
  assetsNominal: number;
  /** 該年總支出（名目金額） */
  expenseNominal: number;
}

/**
 * 把月度試算紀錄彙整為逐年資產表：每年取 12 月底的總資產與年齡，
 * 支出為該年 12 個月的加總。輸入為同一套引擎算出的結果，不重算。
 */
export function buildYearlyTable(result: ProjectionResult): YearlyRow[] {
  const byYear = new Map<number, YearlyRow>();
  for (const record of result.records) {
    const { year } = fromSerial(record.month);
    const row = byYear.get(year) ?? { year, age: record.age, assetsNominal: 0, expenseNominal: 0 };
    row.age = record.age;
    row.assetsNominal = record.totalRetirementAssetsNominal;
    row.expenseNominal += record.expenseNominal;
    byYear.set(year, row);
  }
  return [...byYear.values()].sort((a, b) => a.year - b.year);
}
