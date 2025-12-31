---
description: TaiCalc UI 開發規範 - 所有 AI 必讀
---

# TaiCalc Frontend Design Skill (UI/UX 專家規範)

> **"能用和好用，中間隔著的是十年工程經驗的積累。"**
> 此文件為 TaiCalc 的「前端設計技能包」，包含視覺審美、互動體驗與工程規範。

## 💎 Visual Aesthetics (視覺美學)

### 1. Glassmorphism System (毛玻璃系統)

我們不使用平面的白色背景，而是創建有層次感的深度介面。

- **Surface (基底)**: `bg-slate-50/50 backdrop-blur-xl`
- **Cards (卡片)**: `bg-white/70 backdrop-blur-md border border-white/20 shadow-xl shadow-indigo-500/5`
- **Highlight (高光)**: 使用 `linear-gradient` 添加微妙的光澤感，而非純色。

### 2. Color Palette (色彩策略)

拒絕「工程師配色」。使用精心設計的層次色彩：

- **Primary**: `from-indigo-500 to-purple-600` (用於漸層按鈕/重點文字)
- **Secondary**: `from-pink-500 to-rose-500` (用於強調/Action)
- **Neutral**: `slate-600` (內文), `slate-900` (標題)
- **Success**: `emerald-500` | **Error**: `rose-500`

### 3. Typography (排版細節)

- **Headings**: `font-bold tracking-tight text-slate-900`
- **Numbers**: 使用 `font-mono` 或 `tabular-nums` 確保數字對齊 (財務報表關鍵)。
- **Label**: `text-xs font-semibold uppercase tracking-wider text-slate-400`

---

## 🌊 Motion & Interaction (動效與互動)

靜止的介面是死板的。所有互動元素必須對用戶的操作有「物理反饋」。

### 1. Micro-interactions (微互動)

- **Hover**: 所有可點擊元素 Hover 時必須有位移 (`-translate-y-0.5`) 和陰影加深 (`shadow-lg`)。
- **Active**: 點擊時必須有縮放 (`scale-95`)。
- **Transition**: 所有變化必須平滑 (`transition-all duration-300 ease-out`)。

### 2. Layout Transitions (佈局過渡)

- 使用 `framer-motion` 處理頁面切換和元素掛載。
- 列表項目應使用 `staggerChildren` 依序進場。

---

## 📱 Responsive & Engineering (響應式工程規範)

## 🚨 強制規則（違反即錯誤）

### 1. 手機優先響應式設計

- 所有 nav 元素必須使用 `hidden md:block` 或 `hidden md:inline` 隱藏手機上的文字
- 按鈕在手機上只顯示 icon，桌面顯示 icon + 文字
- 範例：

```tsx
// ✅ 正確
<span className="hidden md:inline">下載報表</span>

// ❌ 錯誤
<span>下載報表</span>
```

### 2. 下載按鈕位置

- **資本頁面**：在 header 區域與標題並排（正確位置）
- **其他頁面**：在 nav 右側，手機只顯示 icon

### 3. 尺寸響應式

- 所有尺寸必須使用 `md:` 前綴
- 範例：`h-14 md:h-20`、`px-4 md:px-6`、`w-8 h-8 md:w-10 md:h-10`

### 4. 文字不換行

- Tab 按鈕使用 `whitespace-nowrap`
- 統計數字使用簡短格式，避免 "Top 1%" 這種會換行的文字
- 考慮使用縮寫或調整排版

### 5. 卡片樣式統一

```tsx
// 標準卡片
className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md"
```

### 6. 按鈕樣式

```tsx
// 主要按鈕（白底灰框）
className="flex items-center space-x-1 md:space-x-2 px-3 md:px-6 py-2 md:py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-all shadow-sm active:scale-95"
```

## 📱 手機適配檢查清單

創建或修改頁面時，必須檢查：

- [ ] Nav 文字在手機隱藏？
- [ ] 按鈕在手機只顯示 icon？
- [ ] 高度使用 `h-14 md:h-20`？
- [ ] Tab 按鈕使用 `whitespace-nowrap`？
- [ ] 統計卡片數字不會換行？
- [ ] padding 使用 `px-4 md:px-6`？

## 🎨 設計美學標準

1. **極簡主義**：移除多餘元素
2. **呼吸感**：充足的 padding 和 margin
3. **一致性**：所有頁面風格統一
4. **細膩度**：注意每個像素細節

## ⚠️ 常見錯誤

1. 忘記 `hidden md:block` 導致手機文字換行
2. 按鈕位置不一致（有的在 nav，有的在 header）
3. 統計數字太長導致換行
4. Tab 按鈕文字太長（應縮短為「正向推算」而非「正向推算 (已知月薪)」）
