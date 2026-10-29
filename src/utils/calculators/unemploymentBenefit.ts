// 失業給付試算核心
// 來源：就業保險法第 16 條、勞保局失業給付試算說明。
// 給付＝離職退保前 6 個月平均月投保薪資 × 60%，最長 6 個月；
// 離職時年滿 45 歲或領有身心障礙證明者，最長 9 個月。
// 注意：扶養眷屬加給（勞保局：每名受扶養眷屬加給平均月投保薪資 10%、
// 最多 2 名）本版未納入計算，實際金額以勞保局核定為準。

export interface UnemploymentInput {
  averageSalary: number;
  age: number;
  disabled: boolean;
}

export interface UnemploymentResult {
  monthly: number;
  maxMonths: number;
  maxTotal: number;
}

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export function calculateUnemploymentBenefit(input: UnemploymentInput): UnemploymentResult {
  const salary = num(input.averageSalary);
  const age = Math.floor(num(input.age));
  const maxMonths = age >= 45 || input.disabled === true ? 9 : 6;
  const monthly = Math.round(salary * 0.6);
  return { monthly, maxMonths, maxTotal: monthly * maxMonths };
}
