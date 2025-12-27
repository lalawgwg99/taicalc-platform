'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calculator, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function RateSensitivityPage() {
    const [loanAmount, setLoanAmount] = useState(10000000);
    const [currentRate, setCurrentRate] = useState(2.15);
    const [years, setYears] = useState(30);

    const result = useMemo(() => {
        const rates = [currentRate - 0.5, currentRate, currentRate + 0.5, currentRate + 1, currentRate + 1.5, currentRate + 2];

        return rates.map(rate => {
            const monthlyRate = rate / 100 / 12;
            const totalMonths = years * 12;
            const monthly = monthlyRate === 0
                ? loanAmount / totalMonths
                : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
            const total = monthly * totalMonths;
            const interest = total - loanAmount;

            return {
                rate,
                monthly: Math.round(monthly),
                interest: Math.round(interest)
            };
        });
    }, [loanAmount, currentRate, years]);

    const baseMonthly = result[1].monthly;
    const baseInterest = result[1].interest;

    return (
        <div className="min-h-screen bg-brand-background font-sans pb-8">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
                    <Link href="/mortgage" className="flex items-center space-x-2 text-slate-600 hover:text-brand-primary">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-bold">房貸計算器</span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        利率升 1% 你會多付多少？
                    </h1>
                    <p className="text-lg text-slate-500">
                        利率敏感度分析：模擬升息對你房貸的影響
                    </p>
                </header>

                {/* 警示 */}
                <section className="p-6 bg-orange-50 border border-orange-200 rounded-2xl mb-8 flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                        <p className="font-bold text-orange-700 mb-1">升息風險提醒</p>
                        <p className="text-sm text-orange-600">機動利率會隨央行政策調整。建議預留緩衝，確保升息後仍能負擔。</p>
                    </div>
                </section>

                {/* 互動計算 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-brand-primary" />
                        設定你的房貸條件
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">貸款金額</label>
                            <input
                                type="range"
                                min="1000000"
                                max="30000000"
                                step="500000"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="w-full"
                                aria-label="貸款金額"
                            />
                            <p className="text-right font-bold text-brand-primary">${formatCurrency(loanAmount)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">目前利率 (%)</label>
                            <input
                                type="range"
                                min="1"
                                max="4"
                                step="0.1"
                                value={currentRate}
                                onChange={(e) => setCurrentRate(Number(e.target.value))}
                                className="w-full"
                                aria-label="目前利率"
                            />
                            <p className="text-right font-bold text-brand-primary">{currentRate}%</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">貸款年限</label>
                            <input
                                type="range"
                                min="10"
                                max="40"
                                step="5"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full"
                                aria-label="貸款年限"
                            />
                            <p className="text-right font-bold text-brand-primary">{years} 年</p>
                        </div>
                    </div>

                    {/* 利率敏感度表格 */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 text-left font-bold text-slate-500">利率</th>
                                    <th className="py-3 text-right font-bold text-slate-500">月付金</th>
                                    <th className="py-3 text-right font-bold text-slate-500">月付變化</th>
                                    <th className="py-3 text-right font-bold text-slate-500">總利息</th>
                                    <th className="py-3 text-right font-bold text-slate-500">利息變化</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((r, i) => (
                                    <tr key={i} className={`border-b border-slate-100 ${i === 1 ? 'bg-blue-50' : ''}`}>
                                        <td className={`py-3 font-bold ${i === 1 ? 'text-brand-primary' : 'text-slate-900'}`}>
                                            {r.rate.toFixed(2)}% {i === 1 && '(目前)'}
                                        </td>
                                        <td className="py-3 text-right font-bold text-slate-900">${formatCurrency(r.monthly)}</td>
                                        <td className={`py-3 text-right font-bold ${r.monthly > baseMonthly ? 'text-red-500' : r.monthly < baseMonthly ? 'text-green-500' : 'text-slate-400'}`}>
                                            {r.monthly === baseMonthly ? '-' : (r.monthly > baseMonthly ? '+' : '') + formatCurrency(r.monthly - baseMonthly)}
                                        </td>
                                        <td className="py-3 text-right text-slate-600">${formatCurrency(r.interest)}</td>
                                        <td className={`py-3 text-right font-bold ${r.interest > baseInterest ? 'text-red-500' : r.interest < baseInterest ? 'text-green-500' : 'text-slate-400'}`}>
                                            {r.interest === baseInterest ? '-' : (r.interest > baseInterest ? '+' : '') + formatCurrency(r.interest - baseInterest)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 結論 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-primary" />
                        關鍵洞察
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-xl">
                            <p className="font-bold text-red-600 mb-1">利率 +1% 影響</p>
                            <p className="text-2xl font-black text-red-600">+${formatCurrency(result[3].monthly - baseMonthly)}/月</p>
                            <p className="text-sm text-slate-600 mt-1">總利息多付 ${formatCurrency(result[3].interest - baseInterest)}</p>
                        </div>
                        <div className="p-4 bg-red-100 rounded-xl">
                            <p className="font-bold text-red-700 mb-1">利率 +2% 影響</p>
                            <p className="text-2xl font-black text-red-700">+${formatCurrency(result[5].monthly - baseMonthly)}/月</p>
                            <p className="text-sm text-slate-600 mt-1">總利息多付 ${formatCurrency(result[5].interest - baseInterest)}</p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/mortgage"
                        className="inline-flex items-center px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg"
                    >
                        <Calculator className="w-5 h-5 mr-2" />
                        前往完整房貸試算
                    </Link>
                </div>
            </main>
        </div>
    );
}
