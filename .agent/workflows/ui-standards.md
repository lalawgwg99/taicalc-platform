---
description: TaiCalc UI 開發規範 - 所有 AI 必讀
---

# TaiCalc UI 開發規範

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
