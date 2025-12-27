'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calculator, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function InflationImpactPage() {
    const [initialAmount, setInitialAmount] = useState(1000000);
    const [inflationRate, setInflationRate] = useState(2.5);
    const [years, setYears] = useState(30);

    const result = useMemo(() => {
        const yearlyData = [];
        for (let year = 0; year <= years; year += 5) {
            const realValue = initialAmount / Math.pow(1 + inflationRate / 100, year);
            const purchasingPowerLoss = initialAmount - realValue;
            yearlyData.push({
                year,
                realValue: Math.round(realValue),
                loss: Math.round(purchasingPowerLoss),
                lossPercent: Math.round((purchasingPowerLoss / initialAmount) * 100)
            });
        }
        return yearlyData;
    }, [initialAmount, inflationRate, years]);

    return (
        <div className="min-h-screen bg-brand-background font-sans pb-8">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
                    <Link href="/capital" className="flex items-center space-x-2 text-slate-600 hover:text-brand-primary">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-bold">資本決策計算器</span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        通膨會吃掉多少資產？
                    </h1>
                    <p className="text-lg text-slate-500">
                        100 萬放 30 年，實際購買力剩多少？
                    </p>
                </header>

                {/* 重點結論 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-red-500" />
                        通膨的隱形殺手
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 rounded-xl">
                            <p className="font-bold text-red-600 mb-1">台灣平均通膨約 2-3%</p>
                            <p className="text-sm text-slate-600">看似很小，但 30 年後購買力會剩不到一半</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-xl">
                            <p className="font-bold text-orange-600 mb-1">存款利率跑不贏通膨</p>
                            <p className="text-sm text-slate-600">定存利率 1-2%，扣除通膨後實質報酬為負</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                            <p className="font-bold text-green-600 mb-1">投資是對抗通膨的武器</p>
                            <p className="text-sm text-slate-600">長期投資報酬率 5-7% 可以跑贏通膨</p>
                        </div>
                    </div>
                </section>

                {/* 互動計算 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-brand-primary" />
                        通膨侵蝕試算
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">初始金額</label>
                            <input
                                type="range" min="100000" max="10000000" step="100000"
                                value={initialAmount} onChange={(e) => setInitialAmount(Number(e.target.value))}
                                className="w-full" aria-label="初始金額"
                            />
                            <p className="text-right font-bold text-brand-primary">${formatCurrency(initialAmount)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">年通膨率 (%)</label>
                            <input
                                type="range" min="1" max="5" step="0.5"
                                value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))}
                                className="w-full" aria-label="年通膨率"
                            />
                            <p className="text-right font-bold text-brand-primary">{inflationRate}%</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">經過年數</label>
                            <input
                                type="range" min="10" max="40" step="5"
                                value={years} onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full" aria-label="經過年數"
                            />
                            <p className="text-right font-bold text-brand-primary">{years} 年</p>
                        </div>
                    </div>

                    {/* 結果表格 */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 text-left font-bold text-slate-500">經過年數</th>
                                    <th className="py-3 text-right font-bold text-slate-500">名目金額</th>
                                    <th className="py-3 text-right font-bold text-slate-500">實質購買力</th>
                                    <th className="py-3 text-right font-bold text-slate-500">購買力損失</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((r, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        <td className="py-3 font-bold text-slate-900">{r.year} 年</td>
                                        <td className="py-3 text-right text-slate-600">${formatCurrency(initialAmount)}</td>
                                        <td className="py-3 text-right font-bold text-slate-900">${formatCurrency(r.realValue)}</td>
                                        <td className="py-3 text-right font-bold text-red-500">-{r.lossPercent}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 結論 */}
                    <div className="mt-6 p-6 bg-red-50 rounded-xl">
                        <p className="text-sm text-red-600 mb-1">經過 {years} 年後</p>
                        <p className="text-2xl font-black text-red-600">
                            ${formatCurrency(initialAmount)} → 實際購買力只剩 ${formatCurrency(result[result.length - 1]?.realValue || 0)}
                        </p>
                        <p className="text-sm text-slate-600 mt-2">
                            損失了 {result[result.length - 1]?.lossPercent}% 的購買力
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">常見問題</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 如何對抗通膨？</h3>
                            <p className="text-slate-600">投資股票、ETF、房地產等資產，長期報酬率可跑贏通膨。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 退休金要考慮通膨嗎？</h3>
                            <p className="text-slate-600">必須！如果 30 年後需要每月 5 萬生活費，現在要準備的金額要乘以 1.5-2 倍。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 定存能保值嗎？</h3>
                            <p className="text-slate-600">不能。目前定存利率約 1-2%，扣除 2-3% 通膨後，實質報酬為負。</p>
                        </div>
                    </div>
                </section>

                <div className="text-center">
                    <Link href="/capital" className="inline-flex items-center px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg">
                        <Calculator className="w-5 h-5 mr-2" />前往完整資本試算
                    </Link>
                </div>
            </main>
        </div>
    );
}
