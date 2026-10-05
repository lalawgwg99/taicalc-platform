# 退休現金流引擎（Phase 1：純邏輯移植）

來源：`lalawgwg99/0050life`（榮德的個人退休規劃工具），2026-10-05 移植。
移植範圍：`src/domain`、`src/engine`、`src/modules`、`src/rules` —— 純 TypeScript，無框架依賴。

## 內容

- **domain/**：型別、時間序列、輸入驗證、利率數學
- **modules/**：勞保、國保、勞退、多筆投資各自投影為按月事件
- **engine/**：`projectPlan`（逐月現金流＋二分法求解所需本金）、`projectScenarios`（±2% 三情境）、`simulateRetirement`
- **rules/taiwan-2026.ts**：法規參數（版本 TW-2026.09，附勞保局來源連結）

## 驗證

- 70 個單元測試全過（含 611 元緩衝、延後請領、0%/50%/100% 再投入等邊界案例）
- 另以 21 組多樣輸入＋三情境掃描，與 0050life 原版逐筆對帳，結果 bit-for-bit 一致（對帳檔已刪，單元測試為常駐守衛）

## 注意

- `engine/monte-carlo.ts` 波動假設未經歷史資料校準（原作者於 CALCULATION.md 註明），**不可直接上線**，校準前僅供研究。
- UI 在 Phase 2（新設計語言定稿後）以 TaiCalc 元件重做，不搬 0050life 的 React 殼。
- 預設值（test-fixtures）為中性範例人物，非榮德本人資料。
