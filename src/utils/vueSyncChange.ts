// v-sync-change：補上 Vue v-model 漏接的 change 事件。
// Vue 的 v-model（text input）只聽 input 事件；程式化填值／自動填入／部分
// 自動化操作只觸發 change 時，ref 停在舊值、欄位顯示新值，造成顯示與計算脫鉤
// （實測：房地合一稅持有月數只發 change 時，totalMonths 停在 18、再持有停在 7）。
// 用法：<input v-model.number="x" v-sync-change />
// 在 change 時若值與上次 input 事件不同，補發一個 input 事件讓 v-model 同步。
// 注意：不可用在 ThousandsInput（它自己同時處理 input 與 change）。
export const vSyncChange = {
  mounted(el: HTMLElement) {
    const handler = () => {
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    (el as HTMLElement & { __syncChangeHandler?: () => void }).__syncChangeHandler = handler;
    el.addEventListener('change', handler);
  },
  unmounted(el: HTMLElement) {
    const handler = (el as HTMLElement & { __syncChangeHandler?: () => void }).__syncChangeHandler;
    if (handler) el.removeEventListener('change', handler);
  },
};
