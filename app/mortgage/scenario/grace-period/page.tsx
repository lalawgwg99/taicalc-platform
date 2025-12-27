'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function GracePeriodPage() {
    const [loanAmount, setLoanAmount] = useState(10000000);
    const [rate, setRate] = useState(2.15);
    const [years, setYears] = useState(30);
    const [gracePeriod, setGracePeriod] = useState(3);

    const result = useMemo(() => {
        const monthlyRate = rate / 100 / 12;
        const totalMonths = years * 12;
        const graceMonths = gracePeriod * 12;
        const payMonths = totalMonths - graceMonths;

        // 無寬限期
        const noGraceMonthly = monthlyRate === 0
            ? loanAmount / totalMonths
            : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        const noGraceTotal = noGraceMonthly * totalMonths;
        const noGraceInterest = noGraceTotal - loanAmount;

        // 有寬限期
        const graceMonthly = loanAmount * monthlyRate;
        const postGraceMonthly = monthlyRate === 0
            ? loanAmount / payMonths
            : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payMonths)) / (Math.pow(1 + monthlyRate, payMonths) - 1);
        const graceTotal = graceMonthly * graceMonths + postGraceMonthly * payMonths;
        const graceInterest = graceTotal - loanAmount;

        return {
            noGraceMonthly: Math.round(noGraceMonthly),
            noGraceInterest: Math.round(noGraceInterest),
            graceMonthly: Math.round(graceMonthly),
            postGraceMonthly: Math.round(postGraceMonthly),
            graceInterest: Math.round(graceInterest),
            extraInterest: Math.round(graceInterest - noGraceInterest),
            savingsInGrace: Math.round((noGraceMonthly - graceMonthly) * graceMonths)
        };
    }, [loanAmount, rate, years, gracePeriod]);

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
                        寬限期到底划不划算？
                    </h1>
                    <p className="text-lg text-slate-500">
                        用數據告訴你：何時用寬限期、總利息差多少、適合誰
                    </p>
                </header>

                {/* 快速結論 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-primary" />
                        3 個重點結論
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <p className="font-bold text-brand-primary mb-1">1. 寬限期會增加總利息</p>
                            <p className="text-sm text-slate-600">以 1000 萬、2.15%、30 年、寬限 3 年為例，總利息約多 {formatCurrency(result.extraInterest)} 元</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                            <p className="font-bold text-green-600 mb-1">2. 寬限期能減輕初期壓力</p>
                            <p className="text-sm text-slate-600">寬限期間月付只要 ${formatCurrency(result.graceMonthly)}，比正常少付 ${formatCurrency(result.noGraceMonthly - result.graceMonthly)}/月</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                            <p className="font-bold text-purple-600 mb-1">3. 適合「現金流緊、預期收入會增加」的人</p>
                            <p className="text-sm text-slate-600">如果收入穩定且足夠，不建議使用寬限期</p>
                        </div>
                    </div>
                </section>

                {/* 互動計算 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-brand-primary" />
                        互動試算
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                            <label className="block text-sm font-bold text-slate-500 mb-2">年利率 (%)</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="w-full"
                                aria-label="年利率"
                            />
                            <p className="text-right font-bold text-brand-primary">{rate}%</p>
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
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">寬限期</label>
                            <input
                                type="range"
                                min="0"
                                max="5"
                                step="1"
                                value={gracePeriod}
                                onChange={(e) => setGracePeriod(Number(e.target.value))}
                                className="w-full"
                                aria-label="寬限期"
                            />
                            <p className="text-right font-bold text-brand-primary">{gracePeriod} 年</p>
                        </div>
                    </div>

                    {/* 比較表 */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <p className="text-sm text-slate-500 mb-2">無寬限期</p>
                            <p className="text-2xl font-black text-slate-900">${formatCurrency(result.noGraceMonthly)}<span className="text-sm font-normal">/月</span></p>
                            <p className="text-sm text-slate-500 mt-2">總利息：${formatCurrency(result.noGraceInterest)}</p>
                        </div>
                        <div className="p-6 bg-blue-50 rounded-xl border-2 border-brand-primary">
                            <p className="text-sm text-brand-primary mb-2">有寬限期 {gracePeriod} 年</p>
                            <p className="text-2xl font-black text-brand-primary">${formatCurrency(result.graceMonthly)}<span className="text-sm font-normal">/月（寬限期）</span></p>
                            <p className="text-lg font-bold text-slate-700">${formatCurrency(result.postGraceMonthly)}<span className="text-sm font-normal">/月（寬限後）</span></p>
                            <p className="text-sm text-slate-500 mt-2">總利息：${formatCurrency(result.graceInterest)}</p>
                            <p className="text-sm text-red-500 font-bold">多付 ${formatCurrency(result.extraInterest)} 利息</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">常見問題</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 什麼情況適合用寬限期？</h3>
                            <p className="text-slate-600">1) 剛買房裝潢費用大 2) 預期未來收入會增加 3) 有其他投資報酬率較高的用途</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 寬限期結束後可以延長嗎？</h3>
                            <p className="text-slate-600">需與銀行協商，通常需要符合條件才能延長，且可能需要手續費。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 新青安寬限期有什麼特別？</h3>
                            <p className="text-slate-600">新青安提供最長 5 年寬限期，利率優惠 2.06%，是首購族的好選擇。</p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/mortgage?gracePeriod=3"
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
