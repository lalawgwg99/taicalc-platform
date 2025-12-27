'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calculator, Target, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function RetirementReversePage() {
    const [targetAmount, setTargetAmount] = useState(20000000);
    const [currentAge, setCurrentAge] = useState(30);
    const [retireAge, setRetireAge] = useState(60);
    const [expectedRate, setExpectedRate] = useState(7);
    const [initialSavings, setInitialSavings] = useState(500000);

    const result = useMemo(() => {
        const years = retireAge - currentAge;
        const months = years * 12;
        const monthlyRate = expectedRate / 100 / 12;

        // 計算初始存款到退休時的價值
        const futureInitial = initialSavings * Math.pow(1 + monthlyRate, months);

        // 計算還需要多少
        const remaining = targetAmount - futureInitial;

        // 反推每月需投入
        let monthlyNeeded = 0;
        if (remaining > 0 && monthlyRate > 0) {
            monthlyNeeded = remaining * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
        }

        const totalInvested = initialSavings + monthlyNeeded * months;
        const totalProfit = targetAmount - totalInvested;

        return {
            years,
            futureInitial: Math.round(futureInitial),
            monthlyNeeded: Math.round(monthlyNeeded),
            totalInvested: Math.round(totalInvested),
            totalProfit: Math.round(totalProfit)
        };
    }, [targetAmount, currentAge, retireAge, expectedRate, initialSavings]);

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
                        退休目標反推：每月要投入多少？
                    </h1>
                    <p className="text-lg text-slate-500">
                        設定退休金目標，反推現在該存多少
                    </p>
                </header>

                {/* 重點結論 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-brand-primary" />
                        退休規劃原則
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <p className="font-bold text-brand-primary mb-1">4% 法則</p>
                            <p className="text-sm text-slate-600">每年提領 4%，退休金可維持 30 年</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                            <p className="font-bold text-green-600 mb-1">25 倍法則</p>
                            <p className="text-sm text-slate-600">年支出 × 25 = 需要的退休金</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                            <p className="font-bold text-purple-600 mb-1">越早開始越輕鬆</p>
                            <p className="text-sm text-slate-600">25 歲開始比 35 歲每月少存 40%</p>
                        </div>
                    </div>
                </section>

                {/* 互動計算 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-brand-primary" />
                        退休目標反推
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">退休金目標</label>
                            <input
                                type="range" min="5000000" max="50000000" step="1000000"
                                value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))}
                                className="w-full" aria-label="退休金目標"
                            />
                            <p className="text-right font-bold text-brand-primary">${formatCurrency(targetAmount)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">目前年齡</label>
                            <input
                                type="range" min="20" max="55" step="1"
                                value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))}
                                className="w-full" aria-label="目前年齡"
                            />
                            <p className="text-right font-bold text-brand-primary">{currentAge} 歲</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">預計退休年齡</label>
                            <input
                                type="range" min={currentAge + 5} max="70" step="1"
                                value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value))}
                                className="w-full" aria-label="預計退休年齡"
                            />
                            <p className="text-right font-bold text-brand-primary">{retireAge} 歲</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">預期年報酬率 (%)</label>
                            <input
                                type="range" min="3" max="12" step="1"
                                value={expectedRate} onChange={(e) => setExpectedRate(Number(e.target.value))}
                                className="w-full" aria-label="預期年報酬率"
                            />
                            <p className="text-right font-bold text-brand-primary">{expectedRate}%</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-500 mb-2">目前已有存款</label>
                            <input
                                type="range" min="0" max="5000000" step="100000"
                                value={initialSavings} onChange={(e) => setInitialSavings(Number(e.target.value))}
                                className="w-full" aria-label="目前已有存款"
                            />
                            <p className="text-right font-bold text-brand-primary">${formatCurrency(initialSavings)}</p>
                        </div>
                    </div>

                    {/* 結果 */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 bg-gradient-to-br from-brand-primary to-blue-600 rounded-xl text-white">
                            <DollarSign className="w-8 h-8 mb-3 opacity-80" />
                            <p className="text-sm opacity-80 mb-1">每月需投入</p>
                            <p className="text-3xl font-black">${formatCurrency(result.monthlyNeeded)}</p>
                            <p className="text-sm opacity-80 mt-2">持續 {result.years} 年</p>
                        </div>
                        <div className="space-y-3">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-sm text-slate-500">現有存款到退休時</p>
                                <p className="text-xl font-bold text-slate-900">${formatCurrency(result.futureInitial)}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl">
                                <p className="text-sm text-green-600">投資獲利</p>
                                <p className="text-xl font-bold text-green-600">+${formatCurrency(result.totalProfit)}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">常見問題</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 退休金要準備多少才夠？</h3>
                            <p className="text-slate-600">以每月生活費 5 萬計算，30 年需要 1800 萬。加上通膨，建議準備 2000-2500 萬。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 7% 報酬率實際嗎？</h3>
                            <p className="text-slate-600">台股長期平均約 7-8%，美股約 10%。保守估計可用 5-6%。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 勞保勞退可以靠嗎？</h3>
                            <p className="text-slate-600">可以補充，但不夠。建議自行準備退休金的 50-70%。</p>
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
