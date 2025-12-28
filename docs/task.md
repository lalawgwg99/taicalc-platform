# TaiCalc UI/UX 改版路線圖

## 第一階段：基礎依賴 (資訊架構與資料)

- [x] 定義擴展 UI 型別 (`SkillUIConfig`, `ChartType`, `KPI`) <!-- id: 1 -->
- [x] 實作 `uiCatalog.ts` 並建立 16 個 Skill 的完整元數據 <!-- id: 2 -->
  - [x] 分類 (Categories)、類型 (Kinds)、一句話介紹 (One-liners)、標籤 (Tags)
  - [x] 推薦/權重設定 (Featured/Priority)
  - [x] 圖表設定
  - [x] 範例數值
- [x] 定義導覽結構 (`config/nav.ts`) <!-- id: 3 -->

## 第二階段：工具總覽頁 (`/calculators`)

- [x] UI 元件
  - [x] `SkillCard` (Grid/List 內容卡片) <!-- id: 4 -->
  - [x] `SkillGrid` (排版佈局) <!-- id: 5 -->
  - [x] `ClientFilter` (搜尋、分類、標籤邏輯) <!-- id: 6 -->
  - [x] `SortControls` (排序控制) <!-- id: 7 -->
  - [x] `PreviewDrawer` (快速預覽抽屜) <!-- id: 8 -->
- [x] 實作頁面 `/calculators/page.tsx` <!-- id: 9 -->

## 第三階段：統一計算機模板 (`/calculators/[skillId]`)

- [x] 重構 `CalculatorPageShell` <!-- id: 10 -->
  - [x] 雙欄佈局 (左側輸入固定 / 右側結果捲動)
  - [x] 表單永遠可見 (Always-visible form)
  - [x] "帶入範例" 與 "重置" 按鈕功能
- [x] 視覺化元件 <!-- id: 11 -->
  - [x] `KpiCards` (關鍵指標卡)
  - [x] `ResultCharts` (Recharts 圖表封裝)
  - [x] `ResultSections` (詳細數據表格)
- [x] 空狀態設計 (Skeleton + "你會得到什麼") <!-- id: 12 -->

## 第四階段：Wow 視覺化效果 (針對重點 Skills)

- [x] Adapter 模式實作 (Raw JSON -> UI Model 轉換層) <!-- id: 13 -->
- [x] `capital.growth` (複利成長) Adapter 與圖表 <!-- id: 14 -->
- [x] `mortgage.calculate` (房貸試算) Adapter 與圖表 <!-- id: 15 -->
- [x] `tax.calculate` (稅務試算) Adapter 與圖表 <!-- id: 16 -->
- [x] `salary.analyze` (薪資分析) Adapter 與圖表 <!-- id: 17 -->

## 第五階段：首頁與全域導覽 (下一步)

- [ ] 全域導覽列 (整合分類選單 + 搜尋觸發) <!-- id: 18 -->
- [ ] 首頁改版 (`/page.tsx`) <!-- id: 19 -->
  - [ ] Hero 區塊 (引導至 `/calculators`)
  - [ ] 精選工具 Grid
  - [ ] 情境式推薦
