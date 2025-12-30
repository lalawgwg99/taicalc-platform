# TaiCalc 專案完整架構 (Source of Truth)

> **給其他 AI 的指引：** 請先閱讀此文件了解專案全貌，再進行任何開發工作

---

## 📌 專案基本資訊

| 項目 | 說明 |
| ------ | ------ |
| 品牌名稱 | TaiCalc 數策 |
| 定位 | 台灣在地化財務決策工具箱 |
| 語言 | 繁體中文（台灣用語）|
| 技術棧 | Next.js 15.1.9 (App Router), TypeScript, Tailwind CSS |
| AI 模型 | **Gemini 2.5 Flash** (gemini-2.5-flash) |
| 部署平台 | Cloudflare Pages (Edge Runtime) |
| 規則版本 | **2025-v1** |

---

## 🔐 安全與版本 (重要)

### CVE 修復歷史

| 日期 | CVE | 修復版本 | 說明 |
|------|-----|----------|------|
| 2024-12-30 | CVE-2025-66478 | Next.js 15.1.9 | RSC 協議遠端代碼執行漏洞 |

### 環境變數

```env
GEMINI_API_KEY=你的_Gemini_API_Key          # AI 服務用
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-J6BM5DCBNN  # Google Analytics
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=xxx          # Cloudflare Analytics (可選)
```

---

## 🗂️ 目錄結構

```text
taicalc/
├── app/
│   ├── api/
│   │   ├── chat/route.ts           # AI Chat API (Gemini Tool Calling)
│   │   └── public/
│   │       └── execute/route.ts    # Public API (僅限 Remote Skills) ⚠️
│   ├── salary/                     # 薪資計算器
│   │   └── scenarios/[salary]/     # SEO 情境頁 (SSG, 10 頁)
│   ├── mortgage/                   # 房貸計算器
│   │   └── scenarios/[amount]/     # SEO 情境頁 (SSG, 6 頁)
│   ├── tax/                        # 稅務計算器
│   ├── capital/                    # 複利計算器
│   ├── pro/                        # Pro 功能頁
│   │   ├── calculator/page.tsx     # 財務比較器
│   │   └── mortgage/page.tsx       # 房貸比較器
│   └── layout.tsx                  # 根佈局 (含 GA4 + CF Analytics)
├── components/
│   ├── shared/
│   │   ├── Disclaimer.tsx          # 免責聲明元件
│   │   └── ShareExport.tsx         # 分享/匯出元件 (用 hash fragment)
│   └── calculators/
│       └── CalculatorPageShell.tsx # 計算器外殼
├── lib/
│   ├── calculations/
│   │   └── tax.ts                  # 稅務版本化計算 (2025-v1)
│   ├── rateLimit.ts                # IP 速率限制 (AI 端點保護)
│   ├── analytics.ts                # GA4 事件追蹤
│   ├── skills/                     # Skill 系統
│   └── publicExecute.ts            # 前端呼叫 API Helper
└── middleware.ts                   # Edge Middleware
```

---

## 🔒 API 安全架構 (2024-12-30 更新)

### `/api/public/execute` - Remote-Only Skills

**重要：** 此 API 現在 **只允許 Remote Skills** (需後端/AI 的功能)

| 類型 | Skills | 狀態 |
|------|--------|------|
| **Remote** (允許) | `fortune.analyze`, `articles.generate`, `articles.trending` | ✅ 通過 API 執行 |
| **Local** (阻擋) | `salary.*`, `mortgage.*`, `tax.*`, `capital.*` | ❌ 返回 403 |

### API 錯誤格式 (標準化)

```json
{
  "ok": false,
  "error": {
    "code": "SKILL_LOCAL_ONLY",
    "message": "This skill must be executed on the client.",
    "details": { "skillId": "salary.analyze", "hint": "..." }
  }
}
```

### 錯誤碼對照

| Code | HTTP | 說明 |
|------|------|------|
| `VALIDATION_ERROR` | 400 | JSON 格式錯誤 / 缺少參數 |
| `SKILL_LOCAL_ONLY` | 403 | 嘗試呼叫 Local Skill（生產環境不暴露 allowed 清單）|
| `SKILL_NOT_FOUND` | 404 | 未知 skillId |
| `RATE_LIMITED` | 429 | 超過速率限制 (5 次/分鐘) |
| `INTERNAL_ERROR` | 500 | 執行失敗 |

---

## 🌐 SEO 情境頁 (Programmatic SEO)

### 薪資頁 (10 頁)

| URL | 輸入 | 實領 |
|-----|------|------|
| `/salary/scenarios/35000` | 35,000 | 33,623 |
| `/salary/scenarios/40000` | 40,000 | 38,426 |
| `/salary/scenarios/45000` | 45,000 | 43,229 |
| `/salary/scenarios/50000` | 50,000 | 48,025 |
| `/salary/scenarios/55000` | 55,000 | 52,830 |
| `/salary/scenarios/60000` | 60,000 | 57,630 |
| `/salary/scenarios/70000` | 70,000 | 67,235 |
| `/salary/scenarios/80000` | 80,000 | 76,840 |
| `/salary/scenarios/100000` | 100,000 | 96,050 |
| `/salary/scenarios/120000` | 120,000 | 115,260 |

### 房貸頁 (6 頁)

| URL | 條件 | 月付 |
|-----|------|------|
| `/mortgage/scenarios/5000000` | 500萬/30年/2% 本息均攤 | 18,481 |
| `/mortgage/scenarios/8000000` | 800萬/30年/2% 本息均攤 | 29,570 |
| `/mortgage/scenarios/10000000` | 1000萬/30年/2% 本息均攤 | 36,962 |
| `/mortgage/scenarios/12000000` | 1200萬/30年/2% 本息均攤 | 44,354 |
| `/mortgage/scenarios/15000000` | 1500萬/30年/2% 本息均攤 | 55,443 |
| `/mortgage/scenarios/20000000` | 2000萬/30年/2% 本息均攤 | 73,923 |

### SEO Metadata 規則 (GPT 5.2 最終版)

**薪資頁 Title 模板：**

```
月薪 {X} 實領多少？扣勞健保/勞退自提後約 {NET}（2025 試算）｜TaiCalc
```

**房貸頁 Title 模板：**

```
房貸 {P} 萬月付多少？30 年 2% 本息均攤約 {PMT}｜TaiCalc
```

**Description 規則：**

- 薪資頁必含：`規則 2025-v1`、`未含所得稅/扣繳`、`可調眷屬與勞退自提 0-6%`
- 房貸頁必含：`本息均攤`、`新青安（1.775%/40 年）比較`

---

## 📤 分享功能 (ShareExport)

### URL 格式

```
https://taicalc.com/salary#share=base64(JSON)
```

### 特性

- 使用 **hash fragment** 避免 SEO 重複內容
- 支援原生分享 API (手機分享至 LINE/FB)
- 不含個資，僅數字參數

### 元件位置

`components/shared/ShareExport.tsx`

---

## 📊 稅務版本化 (Tax Versioning)

### 規則版本

```typescript
const CURRENT_TAX_YEAR = 2025;
const RULE_VERSION = '2025-v1';
```

### 計算結果包含

```typescript
{
  result: {...},
  meta: { taxYear: 2025, ruleVersion: '2025-v1' },
  assumptions: ['標準扣除額 124,000', '基本生活費 208,000', ...]
}
```

---

## ⚡ 速率限制 (Rate Limiting)

### 設定

```typescript
const AI_RATE_LIMIT = {
  windowMs: 60 * 1000,  // 1 分鐘
  maxRequests: 5,       // 每分鐘 5 次
  keyPrefix: 'ai',
};
```

### 實作位置

`lib/rateLimit.ts` - IP-based 限制器 (Edge Runtime 相容)

---

## 📈 Analytics 追蹤

### GA4 事件類型

```typescript
type AnalyticsEvent = 
  | 'calculator_view'      // 計算器頁面瀏覽
  | 'calculator_submit'    // 計算按鈕點擊
  | 'scenario_view'        // SEO 情境頁瀏覽
  | 'share_export_click'   // 分享按鈕點擊
  | 'pro_compare_add'      // Pro 新增比較方案
  | 'cta_click';           // CTA 點擊
```

### 實作位置

`lib/analytics.ts`

---

## 🎨 UI 設計規範

| 項目 | 規範 |
|------|------|
| 圓角 | `rounded-xl` (12px) |
| 品牌主色 | `brand-primary` (#3B82F6) |
| 金額格式 | 千分位 (1,234,567) |
| 響應式 | Mobile First |

---

## 📋 待辦事項

- [ ] 補稅務計算單元測試（3-5 個 case）
- [ ] 簡易 License Key 解鎖（Email only）
- [ ] 修復 Pro 頁面 linting 問題

---

## 📦 關鍵依賴

```json
{
  "next": "15.1.9",
  "@ai-sdk/google": "^3.0.1",
  "ai": "^6.0.3",
  "zod": "^4.2.1",
  "framer-motion": "^11.15.0",
  "recharts": "^2.15.0"
}
```

---

## 🚀 部署指令

```bash
npm run build              # 本地建構
npm run pages:build        # Cloudflare Pages 建構
git push                   # 推送後自動部署
```

---

**最後更新：2024-12-30 14:37 (CVE 修復 + SEO 最終版 + API 安全更新)**
