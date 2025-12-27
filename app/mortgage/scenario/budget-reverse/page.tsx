'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calculator, TrendingUp, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function BudgetReversePage() {
    const [monthlyBudget, setMonthlyBudget] = useState(40000);
    const [rate, setRate] = useState(2.15);
    const [years, setYears] = useState(30);
    const [downPaymentRatio, setDownPaymentRatio] = useState(20);

    const result = useMemo(() => {
        const monthlyRate = rate / 100 / 12;
        const totalMonths = years * 12;

        // 從月付反推可貸金額
        const loanAmount = monthlyRate === 0
            ? monthlyBudget * totalMonths
            : monthlyBudget * (Math.pow(1 + monthlyRate, totalMonths) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));

        // 計算可負擔總價
        const totalPrice = loanAmount / (1 - downPaymentRatio / 100);
        const downPayment = totalPrice * (downPaymentRatio / 100);
        const totalInterest = monthlyBudget * totalMonths - loanAmount;

        return {
            loanAmount: Math.round(loanAmount),
            totalPrice: Math.round(totalPrice),
            downPayment: Math.round(downPayment),
            totalInterest: Math.round(totalInterest)
        };
    }, [monthlyBudget, rate, years, downPaymentRatio]);

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
                        買房預算怎麼抓？月付反推總價
                    </h1>
                    <p className="text-lg text-slate-500">
                        用你能負擔的月付金，算出適合的房價範圍
                    </p>
                </header>

                {/* 重點提示 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-primary" />
                        購屋預算原則
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <p className="font-bold text-brand-primary mb-1">1/3 原則</p>
                            <p className="text-sm text-slate-600">月付不超過月收入的 1/3</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                            <p className="font-bold text-green-600 mb-1">自備款 20-30%</p>
                            <p className="text-sm text-slate-600">包含頭期款、稅費、裝潢</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-xl">
                            <p className="font-bold text-orange-600 mb-1">預留緩衝</p>
                            <p className="text-sm text-slate-600">考慮升息、失業風險</p>
                        </div>
                    </div>
                </section>

                {/* 互動計算 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-brand-primary" />
                        反推你的購屋預算
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">每月可負擔月付</label>
                            <input
                                type="range" min="10000" max="100000" step="5000"
                                value={monthlyBudget} onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                                className="w-full" aria-label="每月可負擔月付"
                            />
                            <p className="text-right font-bold text-brand-primary">${formatCurrency(monthlyBudget)}/月</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">自備款比例 (%)</label>
                            <input
                                type="range" min="10" max="40" step="5"
                                value={downPaymentRatio} onChange={(e) => setDownPaymentRatio(Number(e.target.value))}
                                className="w-full" aria-label="自備款比例"
                            />
                            <p className="text-right font-bold text-brand-primary">{downPaymentRatio}%</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">年利率 (%)</label>
                            <input
                                type="range" min="1" max="5" step="0.1"
                                value={rate} onChange={(e) => setRate(Number(e.target.value))}
                                className="w-full" aria-label="年利率"
                            />
                            <p className="text-right font-bold text-brand-primary">{rate}%</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">貸款年限</label>
                            <input
                                type="range" min="10" max="40" step="5"
                                value={years} onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full" aria-label="貸款年限"
                            />
                            <p className="text-right font-bold text-brand-primary">{years} 年</p>
                        </div>
                    </div>

                    {/* 結果 */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 bg-gradient-to-br from-brand-primary to-blue-600 rounded-xl text-white">
                            <Home className="w-8 h-8 mb-3 opacity-80" />
                            <p className="text-sm opacity-80 mb-1">你可以買</p>
                            <p className="text-3xl font-black">${formatCurrency(result.totalPrice)}</p>
                            <p className="text-sm opacity-80 mt-2">的房子</p>
                        </div>
                        <div className="space-y-3">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-sm text-slate-500">可貸金額</p>
                                <p className="text-xl font-bold text-slate-900">${formatCurrency(result.loanAmount)}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-sm text-slate-500">自備款需準備</p>
                                <p className="text-xl font-bold text-slate-900">${formatCurrency(result.downPayment)}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">常見問題</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 自備款只準備頭期款就夠嗎？</h3>
                            <p className="text-slate-600">不夠！還要考慮：契稅（6%）、代書費、仲介費（1-2%）、裝潢費用、搬家費用等。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 月付佔收入多少合理？</h3>
                            <p className="text-slate-600">建議不超過月收入 1/3，最多不超過 40%，否則生活品質會受影響。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 雙薪家庭怎麼算？</h3>
                            <p className="text-slate-600">建議只算主要收入者的 1/3，另一人的收入作為緩衝，以防一方失業。</p>
                        </div>
                    </div>
                </section>

                <div className="text-center">
                    <Link href="/mortgage" className="inline-flex items-center px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg">
                        <Calculator className="w-5 h-5 mr-2" />前往完整房貸試算
                    </Link>
                </div>
            </main>
        </div>
    );
}
