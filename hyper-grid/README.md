# HyperGrid - 動態商用渲染引擎

> 類似 Vercel v0 的 AI 驅動 UI 生成系統，專為台灣電商場景優化

## 🎯 專案概述

HyperGrid 是一個基於 Next.js 14 + Gemini AI 的智能 UI 生成平台，能將自然語言需求轉換為生產級別的 React 組件。

### 核心特色

- ⚡ **即時生成**：輸入需求 → AI 解析 → 即刻預覽
- 🎨 **9 種原子組件**：Container、Grid、Text、Image、Button、Badge、Card、Timer、Chart
- 🇹🇼 **在地化優化**：針對台灣電商語境與視覺偏好設計
- 📦 **開箱即用**：零配置啟動，支援匯出 JSON/HTML

## 🚀 快速開始

### 前置需求

- Node.js 18+
- Gemini API Key（可選，無 Key 時使用示範模式）

### 安裝與啟動

```bash
# 1. 安裝依賴
npm install

# 2. 設定環境變數（可選）
# 建立 .env.local 並加入：
# GEMINI_API_KEY=your_api_key_here

# 3. 啟動開發伺服器
npm run dev
```

開啟瀏覽器訪問：<http://localhost:3000>

## 📂 專案結構

```
hyper-grid/
├── app/
│   ├── api/generate/route.ts   # Gemini API 整合
│   └── page.tsx                 # 主控制台
├── components/
│   └── Engine.tsx               # 遞迴渲染引擎
├── types/
│   └── schema.ts                # TypeScript 型別定義
└── package.json
```

## 🎮 使用範例

### 範例一：電商促銷頁

**輸入需求：**

```
設計一個家電促銷頁，包含 3 個產品卡片、折扣標籤、倒數計時器與搶購按鈕
```

**AI 自動生成：**

- Grid 佈局（3 欄）
- 每個產品包含圖片、價格、折扣徽章
- 頂部倒數計時器
- 底部 CTA 按鈕

### 範例二：產品比價表

**輸入需求：**

```
建立一個比價介面，顯示 Sony、Dyson、Panasonic 三個品牌的價格圖表
```

**AI 自動生成：**

- 橫向 Bar Chart
- 品牌 Logo + 價格標籤
- 視覺化數據對比

## 🛠 技術棧

| 技術 | 用途 |
|------|------|
| Next.js 14 | App Router + API Routes |
| TypeScript | 型別安全 |
| Tailwind CSS | 原子化樣式 |
| Gemini 2.0 Flash | AI UI 生成 |
| Lucide React | 圖標庫 |

## 💼 商業應用場景

1. **內部工具**：快速生成產品促銷頁面，提升業務效率
2. **B2B SaaS**：為小商家提供無程式碼 Landing Page 生成服務
3. **接案加速**：30 秒生成多版本設計稿供客戶選擇

## 🔧 進階配置

### 自訂組件

在 `components/Engine.tsx` 中加入新組件：

```typescript
const Atoms = {
  // ...existing components
  newComponent: ({ prop1, prop2 }: any) => (
    <div className="...">
      {/* 你的組件邏輯 */}
    </div>
  )
};
```

### 調整 AI Prompt

編輯 `app/api/generate/route.ts` 中的 `SYSTEM_PROMPT` 變數：

```typescript
const SYSTEM_PROMPT = `
  自訂你的設計原則與風格指南...
`;
```

## 📝 授權

MIT License

## 🙏 致謝

靈感來源：[vercel-labs/json-render](https://github.com/vercel-labs/json-render)
