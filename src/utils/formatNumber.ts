// 金額輸入框共用：千分位顯示／解析、數值夾限
// 規則：顯示用千分位（1,000,000），計算一律用解析後數值；解析不到數字回傳 null（留空／非法輸入），
// 由呼叫端顯示錯誤提示，不得靜默當成 0 計算。

export function formatThousands(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  const negative = n < 0;
  const abs = Math.abs(n);
  const [intPart, decPart] = String(abs).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (negative ? '-' : '') + grouped + (decPart !== undefined ? '.' + decPart : '');
}

export function parseThousands(input: string | null | undefined): number | null {
  if (input === null || input === undefined) return null;
  const raw = String(input).trim().replace(/[,，\s]/g, '').replace(/[NT$＄$]/g, '');
  if (raw === '' || raw === '-' || raw === '.' || raw === '-.') return null;
  if (!/^-?\d*\.?\d*$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  if (value === Infinity) return max;
  if (value === -Infinity) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
