// 房貸三個分頁共用同一貸款總額（萬元）：主分頁、30年 vs 40年、青安 vs 一般。
// 三個是各自掛載的 Vue 島，沒有共用 state；以 localStorage ＋ window 自訂事件同步。
// 寫入時只有值真的變了才發事件，避免回寫迴圈。

export const SHARED_LOAN_AMOUNT_KEY = 'taicalc_mortgage_amount_wan';
export const SHARED_LOAN_AMOUNT_EVENT = 'taicalc:loan-amount';
export const MORTGAGE_TAB_EVENT = 'taicalc:mortgage-tab';

export function getSharedLoanAmountWan(): number | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SHARED_LOAN_AMOUNT_KEY);
    if (raw === null) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function setSharedLoanAmountWan(value: number): void {
  if (typeof localStorage === 'undefined' || typeof window === 'undefined') return;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return;
  try {
    const prev = getSharedLoanAmountWan();
    if (prev === n) return;
    localStorage.setItem(SHARED_LOAN_AMOUNT_KEY, String(n));
    window.dispatchEvent(new CustomEvent(SHARED_LOAN_AMOUNT_EVENT, { detail: { amountWan: n } }));
  } catch {
    // localStorage 不可用時靜默略過
  }
}

export function onSharedLoanAmountChange(cb: (amountWan: number) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail && typeof detail.amountWan === 'number') cb(detail.amountWan);
  };
  window.addEventListener(SHARED_LOAN_AMOUNT_EVENT, handler);
  return () => window.removeEventListener(SHARED_LOAN_AMOUNT_EVENT, handler);
}
