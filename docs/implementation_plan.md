# TaiCalc UI/UX 改版實作計畫

## 目標

將 TaiCalc 轉型為產品級平台，建立集中式的工具庫、優化資訊架構，並為計算機打造高品質的「Wow」視覺化體驗。

## 需要使用者審閱

- **資料模型變更**: 確認擴充 `SkillUIConfig` 的結構。
- **客戶端搜尋**: 確認目前先維持客戶端搜尋 (Client-side search) 的決策 (考量效能與實作複雜度)。

## 預計變更

### 1. 資料模型 (`lib/skills/uiTypes.ts`)

擴充既有的 `SkillUIContract` 或建立新的 `SkillUIConfig` 以支援新設計所需的豐富元數據。

```typescript
export type SkillCategory = 'salary' | 'tax' | 'capital' | 'mortgage' | 'fortune' | 'articles';
export type SkillKind = 'financial' | 'utility' | 'entertainment';
export type ChartType = 'line_assets' | 'line_fire' | 'pie_salary' | 'bar_compare' | 'stack_tax';

export type SkillUIConfig = {
    id: string;
    category: SkillCategory;
    kind: SkillKind;
    title: string;
    oneLiner: string; // 用於卡片的簡短描述
    tags: string[];
    estMinutes: number;
    isFeatured?: boolean;
    priority?: number; // 10, 20, 30... (數字越小排序越前)
    
    // 視覺化設定
    outputMode?: 'kpi+chart' | 'kpi+table' | 'text';
    primaryChart?: {
        type: ChartType;
        title: string;
        xLabel?: string;
        yLabel?: string;
    };
    
    // 預覽內容
    preview?: {
        inputs: string[];
        outputs: string[];
    };
    
    // 快速開始
    exampleValues?: Record<string, any>;
};
```

### 2. UI Catalog (`lib/skills/uiCatalog.ts`)

建立包含所有 16 個 Skill 的 Catalog，手動設定元數據以驅動 `featured` (精選) 排序與篩選邏輯。

### 3. 工具總覽頁 (`app/calculators/page.tsx`)

- **佈局**: 側邊欄 (篩選器) + 主內容 (網格)。
- **狀態**: 使用 Client-side state 管理 `searchQuery`, `selectedCategory`, `selectedTags`, `sortBy`。
- **元件**:
  - `SkillGrid`: 響應式網格佈局。
  - `SkillCard`: 包含標籤與主要 CTA 的豐富卡片。
  - `PreviewDrawer`: 用於快速預覽的 Sheet/Drawer 元件。

### 4. 計算機模板 (`components/calculators/CalculatorPageShell.tsx`)

重構以支援「永遠開啟 (Always Open)」的佈局。

- **左側面板 (輸入)**:
  - 桌面版 Sticky 側邊欄。
  - 表單立即渲染 (不需點擊「開始」)。
  - 「載入範例」按鈕，可預填動態表單。
- **右側面板 (結果)**:
  - **空狀態**: 列出「你將獲得什麼」清單 + 「試跑範例」CTA。
  - **結果狀態**:
    - KPI 卡片 (網格排列)。
    - 主要圖表 (Recharts)。
    - 詳細區塊 (可收合/列表)。

### 5. 視覺化 Adapters

建立通用模式，將各種 Skill 的輸出轉換為 UI 元件的標準格式。

```typescript
// types/visualization.ts
export type VisualizationData = {
    kpis: Array<{ key: string; label: string; value: string; unit?: string }>;
    chart?: {
        type: string;
        data: any[];
        config: any;
    };
    details: any;
};

// lib/adapters/index.ts
export function adaptSkillResult(skillId: string, rawResult: any): VisualizationData {
    // switch case 處理熱門 Skill 的特殊轉換
    // 其他 Skill 使用預設 Fallback
}
```

## 驗證計畫

### 自動化測試

- 確保 `uiCatalog` 包含所有已註冊的 Skill。
- 驗證 `schema-parser` 在新表單佈局下仍能正常運作。

### 手動驗證

- **導覽**: 驗證點擊 Top Nav 的分類能正確篩選列表。
- **搜尋**: 測試同義詞搜尋 (例如：「報稅」能找到 "tax.calculate")。
- **計算流程**: 驗證 `capital.growth` 的「載入範例」->「計算」->「圖表渲染」流程。
- **響應式**: 檢查手機版與桌面版的佈局呈現。
