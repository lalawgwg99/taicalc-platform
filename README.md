# TaiCalc 數策 — 2025 薪資與財務戰略決策系統

![License](https://img.shields.io/badge/license-MIT-blue) ![Next.js](https://img.shields.io/badge/Next.js-15.1-black) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

**TaiCalc 數策** 是一個專為台灣職場與理財環境打造的現代化財務決策平台。整合了 **2024/2025 最新勞健保分級表**、**綜合所得稅制** 與 **新青安房貸模型**，將繁雜的法規數據轉化為可視化的戰略圖表，協助您做出最精準的財務決策。

## 🚀 核心戰略引擎

### 1. 薪資戰略系統 (Salary Intelligence)

- **逆向談薪 (Net-to-Gross)**：輸入理想實領金額，自動反推所需談判的稅前薪資（含勞健保精算）。
- **稅務雷達**：即時預測薪資所得稅級距與邊際稅率風險。
- **結構分析**：視覺化呈現 實領 vs. 隱形成本 (勞保/健保/勞退) 比例。

### 2. 房貸佈局 (Mortgage Strategy)

- **新青安與寬限期模擬**：精算 3~5 年寬限期對後期月付金的衝擊。
- **本息攤還壓力測試**：視覺化呈現長達 30~40 年的還款現金流壓力。
- **總利息分析**：比較不同利率與年期下的總體持有成本。

### 3. 税務優化 (Tax Optimization)

- **2025 新制模型**：內建最新免稅額 (9.7萬)、標準扣除額 (13.1萬) 與薪資特別扣除額參數。
- **基本生活費差額**：自動計算多口之家的基本生活費紅利，爭取最大節稅權益。
- **決策引導 (Tax Nudge)**：分析距離下一稅率級距的「安全空間」，優化獎金與加班費規劃。

### 4. 資本決策 (Capital Growth)

- **4% 法則模擬 (FIRE)**：基於蒙地卡羅概念的資產增長預測。
- **實質購買力分析**：納入通膨 (CPI) 變數，計算未來的真實財富價值。
- **本金永續指標**：計算在特定年報率下，能否達成「本金不減」的被動收入狀態。

## 🛠️ 技術架構

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Lucide React](https://lucide.dev/), Framer Motion
- **Visualization**: [Recharts](https://recharts.org/)
- **Deployment**: Vercel / Cloudflare Pages Ready
- **Accessibility**: WCAG Compliant (`aria-label`, `sr-only` support)
- **Privacy**: Local-First Computation (數據不離機)

## 📦 安裝與執行

```bash
# Clone repository
git clone https://github.com/your-username/taicalc-platform.git

# Install dependencies
npm install

# Run development server
npm run dev
# Open http://localhost:3000
```

## 📜 License

MIT License.
歡迎 Fork 與貢獻代碼，共同優化台灣的財務決策工具生態。
