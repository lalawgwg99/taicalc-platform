# TaiCalc 🇹🇼

**TaiCalc** (https://taicalc.com) is a Taiwan-focused financial calculator suite:
**25 interactive calculators** plus **50+ guides**, covering salary, tax, housing,
insurance, investing and retirement — all computed against current Taiwan regulations.

## 🧮 Calculators (25)

| 分類 | 工具 |
|---|---|
| 人生規劃 | 台灣人生模擬器 |
| 薪資與稅務 | 薪資實拿計算、綜合所得稅試算、遺產稅／贈與稅、勞健保計算 |
| 居住與房產 | 2026 房貸試算 (新青安版)、電費計算機、買房持有成本、租金解析 |
| 生活工具 | 分帳計算機 (AA制) |
| 工作與收入 | 外送收入計算、離職結算、加班費試算、年終獎金試算 |
| 交通與購車 | 買車總成本 |
| 貸款與債務 | 信貸／債務整合 |
| 投資與退休 | 勞保老年年金、通膨後實質報酬、長期投資與資產配置、股票損益試算、勞退試算、保險效益評估、FIRE 退休規劃、ETF 配息試算 |
| 家庭與育兒 | 育兒津貼與育嬰留停 |

Retirement flow: [/retirement-toolbox](https://taicalc.com/retirement-toolbox) chains
勞保老年年金 → 勞退試算 → FIRE 規劃, with head-to-head compare pages
(一次領 vs 月領， 勞退自提 0% vs 6%).

## 📚 Guides (50+)

Weekly SEO articles live in `src/content/blog` (Astro content collection),
each paired with FAQ schema and internal links to the relevant calculators.

## 🛠 Tech Stack

- **Framework**: Astro (static site generation) with Vue 3 + React islands for the interactive calculators
- **Styling**: Tailwind CSS
- **Precision**: `decimal.js` for money math (no float errors)
- **SEO**: sitemap, JSON-LD structured data (FAQ / Dataset / Article), per-tool FAQs
- **Deploy**: Cloudflare Pages + Functions — push to `main` auto-deploys

## 📏 Data governance

- [/data-sources](https://taicalc.com/data-sources) lists every dataset's official source
  （勞動部、勞保局、健保署、財政部、中央銀行、台電、投信…) with last-updated dates —
  see `src/data/regulatoryMetadata.ts`
- Key datasets are versioned in `src/data/`:
  `taxYears.ts` (綜所稅級距／扣除額), `mortgageRates.ts` (房貸利率),
  `etfFees.ts` (ETF 費用）, `cities.json` (生活成本）

## ✨ 2026 regulatory updates

- **勞健保**: 2026 投保薪資級距表；勞保上限 $45,800，健保上限 $313,000；輸入金額自動歸級
- **新青安房貸**: 補貼期 1.775%／補貼後 2.15% 兩段式利率；最長 40 年；5 年寬限期
- **股票損益**: 證交稅 一般 0.3%／當沖 0.15%／ETF 0.1%；券商折扣與低消自訂；損益兩平價分析
- **薪資實拿**: 串接 2026 勞健保級距邏輯，精算每月實拿

## 🚀 Development

```bash
npm install
npm run dev      # local dev server
npm run build    # astro build
npm run preview  # preview the build
npm run test     # vitest
```

Layout: `src/pages/tools/*.astro` (tool pages) · `src/components/calculators/` (Vue/React)
· `src/content/blog/` (articles) · `src/data/` (regulated datasets) · `functions/api/`
(Cloudflare Functions).
