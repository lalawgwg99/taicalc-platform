---
description: TaiCalc API & Architecture Skill - 所有的後端/邏輯開發必須遵循
---

# TaiCalc API Design & Architecture Skill

> **"好的 API 設計，需要十年經驗的積累。"**
> 此文件為 TaiCalc 的「架構設計技能包」，確保代碼的可維護性、擴展性與模組化。

## 🏗️ Modular Architecture (模組化架構)

我們採用 **Feature-First** (功能優先) 架構，拒絕將所有邏輯堆在 `lib/` 或 `utils/`。

### Directory Structure (目錄結構)

每個功能模組 (Feature) 必須是一個獨立的「膠囊」，包含自己的邏輯、工具與介面。

```
features/
  ├── [feature-name]/       # e.g., features/tax/
  │   ├── logic.ts          # 🧠 CORE LOGIC (Pure Functions)
  │   ├── tools.ts          # 🤖 AI TOOL DEFINITIONS (Zod Schema)
  │   └── types.ts          # 📦 TYPES (Shared Interfaces)
```

### Rules (鐵律)

1. **Logic Purity**: `logic.ts` 內的函數必須是 **Pure Function** (純函數)。不依賴外部狀態、不進行 API 呼叫、不讀寫資料庫。只負責 `Input -> Calculation -> Output`。
2. **Tool Isolation**: `tools.ts` 負責將 `logic.ts` 包裝成 AI 可理解的工具。它處理 `as any` 轉型 (如果需要) 並定義 Zod Schema。
3. **No Cross-Feature Coupling**: 盡量避免 Feature 之間的直接耦合。

---

## 🔌 API Design Principles (API 設計原則)

雖然我們主要使用 Server Actions / Local Logic，但在設計 Tool Interface 時同樣適用 API 原則。

### 1. Explicit Inputs (明確輸入)

不要依賴隱式上下文。工具的參數必須完整描述所需的資訊。

- ❌ `calculateTax(userId)` (依賴外部狀態)
- ✅ `calculateTax(annualIncome, exemptions, dependents)` (明確輸入)

### 2. Rich Outputs (豐富輸出)

回傳的結果不應只是一個數字。應包含「解釋性」數據，讓 AI 能說出「為什麼」。

- ❌ `return 5000;`
- ✅ `return { taxAmount: 5000, effectiveRate: 0.05, bracket: '5%', deductionUsed: 120000 };`

### 3. Error Handling (錯誤處理)

不要讓整個 App 崩潰。邏輯層應捕捉邊界情況並回傳「安全」的預設值或明確的錯誤訊息。

---

## 🛡️ Coding Standards (編碼規範)

1. **Type Safety**: 優先使用 TypeScript 的類型系統。
2. **Naming**:
   - Function: 動詞開頭 (`calculate...`, `analyze...`, `get...`)
   - Boolean: `is...`, `has...`, `should...`
3. **Comments**: 複雜邏輯必須有 JSDoc 註釋，解釋「業務規則」而非代碼本身 (e.g., "依據 2024 所得稅法第 X 條" vs "相乘這兩個數")。
