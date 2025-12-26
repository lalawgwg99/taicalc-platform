TaiCalc Project Context (Source of Truth)

1. 專案基本資訊

品牌名稱: TaiCalc (台算)

定位: 台灣在地化決策工具箱 (薪資、稅務、貸款、投資)

核心語彙: 繁體中文 (台灣在地化用語)

技術棧: Next.js (App Router), Tailwind CSS, Lucide React, Recharts

1. 目錄結構與程式碼 (File Structure)

[Root] /package.json

{
  "name": "taicalc-platform",
  "dependencies": {
    "next": "15.1.0",
    "react": "^19.0.0",
    "lucide-react": "^0.468.0",
    "recharts": "^2.15.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "framer-motion": "^11.15.0"
  }
}

[Root] /tailwind.config.ts

// 品牌色定義：primary (#0F172A), secondary (#3B82F6), accent (#10B981)

/lib/constants.ts

// 內含：2024-2025 台灣所得稅級距、勞健保費率、二代健保門檻
export const TAIWAN_PARAMS = {
  INCOME_TAX_BRACKETS: [...],
  INSURANCE: { LABOR_RATE: 0.12, HEALTH_RATE: 0.0517 }
} as const;

/lib/utils.ts

// 工具函數：格式化金額、合併 className
export function formatCurrency(amount: number): string;
export function cn(...inputs: ClassValue[]): string;

/lib/calculations.ts

// 核心業務邏輯：薪資、稅務計算
export function calculateInsurance(monthlySalary: number): number;
export function calculateIncomeTax(annualIncome: number, options?): number;
export function analyzeSalary(monthlySalary: number): SalaryAnalysis;

/components/CalculatorWrapper.tsx

// 通用佈局組件：左側輸入區，右側結果區 (Responsive Layout)
interface CalculatorWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
  category?: string;
}

/app/layout.tsx

// 根佈局，設定全站字體與背景顏色 (Slate-50)

1. 開發規範 (Dev Rules)

必須符合台灣現行法規。

計算結果需搭配圖表可視化。

UI 圓角統一為 12px (rounded-taicalc)。

所有的金額輸出需包含千分位符號 (e.g., 1,000,000)。

1. 完整使用範例 (Usage Examples)

範例 1: 創建新的計算器頁面

'use client';
import { useState } from 'react';
import CalculatorWrapper from '@/components/CalculatorWrapper';
import { formatCurrency } from '@/lib/utils';

export default function MyCalculator() {
  const [input, setInput] = useState(0);
  
  return (
    <CalculatorWrapper
      title="我的計算器"
      description="計算說明"
    >
      {/*左側：輸入區 (lg:col-span-5)*/}
      <div className="lg:col-span-5">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(Number(e.target.value))}
          className="w-full px-4 py-3 border rounded-lg"
        />
      </div>

      {/* 右側：結果區 (lg:col-span-7) */}
      <div className="lg:col-span-7">
        <div className="bg-brand-secondary text-white p-6 rounded-taicalc">
          <p className="text-4xl font-bold">
            NT$ {formatCurrency(input)}
          </p>
        </div>
      </div>
    </CalculatorWrapper>
  );
}

範例 2: 使用計算函數

import { analyzeSalary } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';

const result = analyzeSalary(40000);
// {
//   monthly: { gross: 40000, insurance: 2068, takeHome: 37932 },
//   annual: { gross: 480000, tax: 0, net: 455184 }
// }

console.log(formatCurrency(result.monthly.takeHome)); // "37,932"

範例 3: 客製化品牌色

// 在 JSX 中使用品牌色
<div className="bg-brand-primary text-white">主色</div>
<div className="bg-brand-secondary text-white">次要色</div>
<div className="bg-brand-accent text-white">強調色</div>

1. API 參考 (Quick Reference)

計算函數:

- calculateInsurance(monthlySalary) → 勞健保個人負擔
- calculatePension(monthlySalary) → 雇主勞退提撥
- calculateIncomeTax(annual, options) → 年度所得稅
- analyzeSalary(monthlySalary) → 完整薪資分析

工具函數:

- formatCurrency(number) → "1,234,567"
- cn(...classes) → 合併 Tailwind classes

常數:

- TAIWAN_PARAMS.INCOME_TAX_BRACKETS → 稅級距
- TAIWAN_PARAMS.DEDUCTIONS → 扣除額
- TAIWAN_PARAMS.INSURANCE → 保險費率
