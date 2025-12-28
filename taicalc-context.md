# TaiCalc 專案完整架構 (Source of Truth)

> **給其他 AI 的指引：** 請先閱讀此文件了解專案全貌，再進行任何開發工作

---

## 📌 專案基本資訊

| 項目 | 說明 |
| ------ | ------ |
| 品牌名稱 | TaiCalc 數策 |
| 定位 | 台灣在地化財務決策工具箱 |
| 語言 | 繁體中文（台灣用語）|
| 技術棧 | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| AI 模型 | **Gemini 2.5 Flash** (gemini-2.5-flash) |
| 部署平台 | Cloudflare Pages (Edge Runtime) |

---

## 🗂️ 目錄結構

```text
taicalc/
├── app/
│   ├── api/
│   │   ├── chat/route.ts         # AI Chat API (Gemini Tool Calling)
│   │   ├── public/
│   │   │   └── execute/route.ts  # Public Skill Execution API (No Key Required for Frontend)
│   │   ├── skills/route.ts       # 列出所有 Skill (Admin/Debug)
│   │   ├── skills/[skillId]/     # 執行單一 Skill (Admin/Debug)
│   │   └── ai/
│   │       ├── analyze/route.ts  # AI 分析 API
│   │       └── fortune/route.ts  # 財運命盤 AI API
│   ├── calculators/
│   │   └── [skillId]/page.tsx    # 通用計算機入口 (Dynamic Route)
│   ├── salary/                   # 薪資計算頁 (Uses Shell)
│   ├── tax/                      # 稅務計算頁 (Uses Shell)
│   ├── mortgage/                 # 房貸計算頁 (Uses Shell)
│   ├── retirement/               # 退休規劃頁
│   ├── fortune/                  # 財運命盤頁 (Uses Shell)
│   └── developers/               # 開發者文件頁
├── components/
│   ├── AI/
│   ├── calculators/
│   │   └── CalculatorPageShell.tsx # 核心計算機外殼 (Unified Layout)
│   └── skills/
│       └── SkillForm.tsx         # 通用表單 (Schema Driven)
├── lib/
│   ├── skills/
│   │   ├── registry.ts           # Skill 註冊中心
│   │   ├── uiCatalog.ts          # UI 元數據目錄 (Labels, Highlights, etc.)
│   │   ├── uiTypes.ts            # UI 類型定義
│   │   ├── getSkillUI.ts         # UI Helper
│   │   └── implementations/      # Skill 實作
│   ├── ga4.tsx                   # GA4 可以在這裡，但主要在 layout.tsx
│   ├── publicExecute.ts          # 前端呼叫 Public API 的 Helper
│   └── format.ts                 # 格式化工具
└── middleware.ts                 # API 安全層
```

---

## 🎨 UI 架構 2.0 (Schema-Driven)

為了解決頁面重複開發與風格不統一的問題，TaiCalc 2.0 採用 Schema-Driven UI 架構。

### 核心組件

1. **`CalculatorPageShell`**:
    - 統一的頁面外殼，包含標題、說明、表單區域、結果區域、AI 分析卡片。
    - 負責狀態管理 (Loading, Result, Error) 與 API 呼叫串接。
    - 自動整合 `SkillForm` 與結果展示。

2. **`SkillForm`**:
    - 完全由 Zod Schema 與 `uiCatalog` 驅動。
    - 支援文字、數字、下拉選單 (Select/Enum) 等輸入類型。
    - 支援 `inputMode` 與驗證。

3. **`uiCatalog.ts`**:
    - 定義所有 Skill 的 UI 元數據 (Meta Data)。
    - 包含：標題 (Title)、欄位標籤 (Label)、單位 (Unit)、佔位符 (Placeholder)、範例 (Examples)、結果亮點 (Highlights)。
    - 新增 Skill 時，只需在此設定 UI，不需寫新頁面。

### 開發流程

1. 定義 `skill.ts` (Zod Schema)。
2. 在 `uiCatalog.ts` 設定 UI Metadata。
3. 頁面直接使用 `<CalculatorPageShell skillId="..." />`。

---

## 🧠 Skill 系統 v2

### 概念

Skill = 可重用的計算單元，具有 Schema 定義、可被 API 調用、可被 AI 自動調用

### 已註冊的 16 個 Skill

| 分類 | Skill ID | 說明 | 類別 |
| ------ | ---------- | ------ | ------ |
| 薪資 | salary.analyze | 薪資結構分析 | financial |
| 薪資 | salary.reverse | 逆向推算期望薪資 | financial |
| 薪資 | salary.structure | 年薪結構優化 | financial |
| 稅務 | tax.calculate | 綜所稅計算 | financial |
| 稅務 | tax.optimize | 節稅策略 | financial |
| 資本 | capital.growth | 複利成長試算 | financial |
| 資本 | capital.fire | FIRE 獨立計算 | financial |
| 資本 | capital.goalReverse | 目標逆推 | financial |
| 資本 | capital.passiveIncome | 被動收入規劃 | financial |
| 資本 | capital.milestones | 財富里程碑 | financial |
| 房貸 | mortgage.calculate | 房貸試算 | financial |
| 房貸 | mortgage.refinance | 轉貸評估 | financial |
| 房貸 | mortgage.earlyRepayment | 提前還款分析 | financial |
| 財運 | fortune.analyze | 財運命盤分析 | entertainment |
| 文章 | articles.generate | AI 文章生成器 | utility |
| 文章 | articles.trending | 趨勢話題分析 | utility |

### API 端點

```bash
GET  /api/skills              # 列出所有 Skill
GET  /api/skills/{skillId}    # 取得 Skill Schema
POST /api/skills/{skillId}    # 執行 Skill
POST /api/skills/chain        # 鏈式執行（支援條件分支 DSL）
POST /api/chat                # AI 對話 (自動調用 Skill)
GET  /api/articles/generate   # 取得理財趨勢話題
POST /api/articles/generate   # 生成 SEO 優化文章
```

### Chain Decision DSL（v2 新功能）

支援 `$previous`、`$stepId.field` 引用和條件分支：

```json
{
  "steps": [
    { "stepId": "salary", "skillId": "salary.analyze", "input": { "monthlySalary": 60000 } },
    {
      "stepId": "tax",
      "skillId": "tax.calculate",
      "input": { "income": "$salary.data.annual.gross" },
      "condition": { "expression": "$salary.data.annual.gross > 500000", "skipIfFalse": true }
    }
  ]
}
```

---

## 📊 GA4 追蹤整合

已整合 Google Analytics 4，位於 `lib/ga4.tsx`：

- `GoogleAnalytics` - 載入 gtag.js
- `GATracker` - 自動追蹤頁面瀏覽
- `GA_EVENTS` - 預設事件追蹤
- 需設定 `NEXT_PUBLIC_GA_MEASUREMENT_ID`

---

## 🤖 AI 整合

### 環境變數

```env
GOOGLE_GENERATIVE_AI_API_KEY=你的_Gemini_API_Key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### AI Chat 流程

1. 用戶發送問題 → `/api/chat`
2. 所有 Financial Skill 動態轉為 AI Tool
3. Gemini 判斷並自動調用工具
4. 回傳計算結果 + AI 解釋

---

---

## 🔒 API 安全 (middleware.ts & Public API)

### Public API (`/api/public/execute`)

- 用途：供前端直接呼叫 Skill，不需 API Key。
- 安全機制：內建 `ALLOWLIST`，只允許特定的 Public Skill (如計算機類) 被執行。
- 實現：`lib/publicExecute.ts` 封裝了呼叫邏輯。

### Protected API (`/api/skills/*`)

- 用途：後台管理、除錯或特殊權限操作。
- 安全機制：
  - 攔截 `/api/skills/*` 請求。
  - 驗證 `x-api-key` Header。
  - 生產環境強制驗證 `API_SECRET_KEY`。

---

## 📊 GA4 追蹤整合

- **ID**: `G-J6BM5DCBNN`
- **實作方式**: 直接於 `app/layout.tsx` 注入 `gtag.js` 腳本 (方案 1)。
- **環境變數**: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (用於 Local 開發控制或 GATracker 元件，核心腳本已硬寫 ID)。
- **自定義事件**: 透過 `lib/ga4.tsx` 的 `GA_EVENTS` 發送。

## 📋 Cloudflare 部署注意事項

**所有 API 路由必須包含：**

```typescript
export const runtime = 'edge';
```

---

## 🎨 UI 開發規範

- 圓角: `rounded-xl` (12px)
- 品牌色: `brand-primary`, `brand-secondary`, `brand-accent`
- 金額: 千分位格式 (1,234,567)
- 手機版: 優先考慮響應式設計

---

## 📦 關鍵依賴

```json
{
  "next": "15.1.0",
  "@ai-sdk/google": "latest",
  "ai": "latest",
  "zod": "^3.x",
  "framer-motion": "^11.x"
}
```
