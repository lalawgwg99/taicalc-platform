'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function EarlyRepaymentPage() {
    const [loanAmount, setLoanAmount] = useState(10000000);
    const [rate, setRate] = useState(2.15);
    const [years, setYears] = useState(30);
    const [yearsElapsed, setYearsElapsed] = useState(5);
    const [earlyPayment, setEarlyPayment] = useState(1000000);

    const result = useMemo(() => {
        const monthlyRate = rate / 100 / 12;
        const totalMonths = years * 12;
        const elapsedMonths = yearsElapsed * 12;
        const remainingMonths = totalMonths - elapsedMonths;

        // 原始月付
        const originalMonthly = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

        // 計算已還本金
        let balance = loanAmount;
        for (let i = 0; i < elapsedMonths; i++) {
            const interest = balance * monthlyRate;
            const principal = originalMonthly - interest;
            balance -= principal;
        }

        // 提前還款後
        const newBalance = balance - earlyPayment;

        // 選項1：縮短年限（月付不變）
        let shortenMonths = 0;
        if (newBalance > 0 && monthlyRate > 0) {
            shortenMonths = Math.ceil(Math.log(originalMonthly / (originalMonthly - newBalance * monthlyRate)) / Math.log(1 + monthlyRate));
        }
        const shortenSavedInterest = originalMonthly * (remainingMonths - shortenMonths) - earlyPayment;

        // 選項2：降低月付（年限不變）
        const newMonthly = newBalance > 0 && remainingMonths > 0
            ? (newBalance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / (Math.pow(1 + monthlyRate, remainingMonths) - 1)
            : 0;
        const reduceMonthlyDiff = originalMonthly - newMonthly;
        const reduceSavedInterest = reduceMonthlyDiff * remainingMonths - earlyPayment;

        return {
            originalMonthly: Math.round(originalMonthly),
            currentBalance: Math.round(balance),
            newBalance: Math.round(newBalance),
            shortenMonths: remainingMonths - shortenMonths,
            shortenSavedInterest: Math.round(Math.max(0, shortenSavedInterest)),
            newMonthly: Math.round(newMonthly),
            reduceMonthlyDiff: Math.round(reduceMonthlyDiff),
            reduceSavedInterest: Math.round(Math.max(0, reduceSavedInterest))
        };
    }, [loanAmount, rate, years, yearsElapsed, earlyPayment]);

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
                        提前還款划算嗎？
                    </h1>
                    <p className="text-lg text-slate-500">
                        部分還款 vs 縮短年限 vs 降低月付，哪個最省利息？
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
                            <p className="font-bold text-brand-primary mb-1">1. 縮短年限最省利息</p>
                            <p className="text-sm text-slate-600">保持月付不變，用提前還款縮短貸款期限，利息省最多</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                            <p className="font-bold text-green-600 mb-1">2. 降低月付更有彈性</p>
                            <p className="text-sm text-slate-600">每月現金流增加，可用於投資或應急</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-xl">
                            <p className="font-bold text-orange-600 mb-1">3. 越早還越划算</p>
                            <p className="text-sm text-slate-600">前幾年還款中利息佔比高，提前還本金效益最大</p>
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
                            <label className="block text-sm font-bold text-slate-500 mb-2">原始貸款金額</label>
                            <input
                                type="range"
                                min="1000000"
                                max="30000000"
                                step="500000"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="w-full"
                                aria-label="原始貸款金額"
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
                            <label className="block text-sm font-bold text-slate-500 mb-2">已還款年數</label>
                            <input
                                type="range"
                                min="1"
                                max={years - 1}
                                step="1"
                                value={yearsElapsed}
                                onChange={(e) => setYearsElapsed(Number(e.target.value))}
                                className="w-full"
                                aria-label="已還款年數"
                            />
                            <p className="text-right font-bold text-brand-primary">{yearsElapsed} 年</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">提前還款金額</label>
                            <input
                                type="range"
                                min="100000"
                                max="5000000"
                                step="100000"
                                value={earlyPayment}
                                onChange={(e) => setEarlyPayment(Number(e.target.value))}
                                className="w-full"
                                aria-label="提前還款金額"
                            />
                            <p className="text-right font-bold text-brand-primary">${formatCurrency(earlyPayment)}</p>
                        </div>
                    </div>

                    {/* 當前狀態 */}
                    <div className="p-4 bg-slate-100 rounded-xl mb-6">
                        <p className="text-sm text-slate-500">當前狀態</p>
                        <p className="font-bold text-slate-900">月付 ${formatCurrency(result.originalMonthly)} | 剩餘本金 ${formatCurrency(result.currentBalance)}</p>
                    </div>

                    {/* 兩種選項 */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 bg-blue-50 rounded-xl border-2 border-brand-primary">
                            <p className="text-sm text-brand-primary mb-2 font-bold">選項 1：縮短年限</p>
                            <p className="text-2xl font-black text-brand-primary">省 {result.shortenMonths} 個月</p>
                            <p className="text-sm text-slate-600 mt-2">月付維持 ${formatCurrency(result.originalMonthly)}</p>
                            <p className="text-sm text-green-600 font-bold">省利息約 ${formatCurrency(result.shortenSavedInterest)}</p>
                        </div>
                        <div className="p-6 bg-green-50 rounded-xl">
                            <p className="text-sm text-green-600 mb-2 font-bold">選項 2：降低月付</p>
                            <p className="text-2xl font-black text-green-600">${formatCurrency(result.newMonthly)}<span className="text-sm font-normal">/月</span></p>
                            <p className="text-sm text-slate-600 mt-2">每月少付 ${formatCurrency(result.reduceMonthlyDiff)}</p>
                            <p className="text-sm text-green-600 font-bold">省利息約 ${formatCurrency(result.reduceSavedInterest)}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">常見問題</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 提前還款有違約金嗎？</h3>
                            <p className="text-slate-600">大部分銀行在綁約期（通常 2-3 年）內提前還款需付違約金，約 1-2%。期滿後通常免違約金。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 部分還款還是全額還款好？</h3>
                            <p className="text-slate-600">看個人資金狀況。如果有其他投資報酬率高於房貸利率，可考慮保留資金。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 什麼時候提前還款最划算？</h3>
                            <p className="text-slate-600">越早越好。貸款前期利息佔比高，提前還本金可省下更多利息。</p>
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
