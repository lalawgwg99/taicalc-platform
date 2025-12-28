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
│   │   ├── skills/route.ts       # 列出所有 Skill
│   │   ├── skills/[skillId]/     # 執行單一 Skill
│   │   ├── skills/chain/         # 鏈式執行 Skill（支援條件分支）
│   │   └── ai/
│   │       ├── analyze/route.ts  # AI 分析 API
│   │       └── fortune/route.ts  # 財運命盤 AI API
│   ├── salary/                   # 薪資計算頁
│   ├── tax/                      # 稅務計算頁
│   ├── mortgage/                 # 房貸計算頁
│   ├── retirement/               # 退休規劃頁
│   ├── fortune/                  # 財運命盤頁
│   ├── developers/               # 開發者文件頁
│   └── home-assessment/          # 買房全能評估頁
├── components/
│   ├── AI/
│   │   ├── TaiCalcChat.tsx       # 浮動 AI 對話按鈕
│   │   └── AIInsightCard.tsx     # AI 洞察卡片
│   └── skills/
│       └── SkillForm.tsx         # 根據 Schema 自動生成表單
├── lib/
│   ├── skills/
│   │   ├── registry.ts           # Skill 註冊中心
│   │   ├── executor.ts           # Skill 執行器（含條件分支 DSL）
│   │   ├── types.ts              # 類型定義 v2
│   │   └── implementations/      # Skill 實作
│   │       ├── salary.skill.ts   # 3 個薪資 Skill
│   │       ├── tax.skill.ts      # 2 個稅務 Skill
│   │       ├── capital.skill.ts  # 5 個資本 Skill
│   │       ├── mortgage.skill.ts # 3 個房貸 Skill
│   │       └── fortune.skill.ts  # 1 個財運 Skill（娛樂類）
│   ├── ga4.tsx                   # GA4 追蹤整合
│   ├── db/
│   │   └── logger.ts             # 執行日誌系統
│   └── calculations.ts           # 核心計算邏輯
└── middleware.ts                 # API 安全層
```

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

## 🔒 API 安全 (middleware.ts)

- 攔截 `/api/skills/*` 請求
- 驗證 `x-api-key` Header
- 生產環境強制驗證

---

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
