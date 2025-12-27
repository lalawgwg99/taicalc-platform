'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CompoundInterestPage() {
    const [initial, setInitial] = useState(100000);
    const [monthly, setMonthly] = useState(10000);
    const [years, setYears] = useState(20);

    const rates = [3, 5, 7, 10];

    const result = useMemo(() => {
        return rates.map(rate => {
            const monthlyRate = rate / 100 / 12;
            const months = years * 12;

            // 複利計算：初始本金 + 定期定額
            const futureInitial = initial * Math.pow(1 + monthlyRate, months);
            const futureMonthly = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            const total = futureInitial + futureMonthly;
            const totalInvested = initial + monthly * months;
            const profit = total - totalInvested;

            return { rate, total: Math.round(total), invested: totalInvested, profit: Math.round(profit) };
        });
    }, [initial, monthly, years]);

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
                        複利到底有多可怕？
                    </h1>
                    <p className="text-lg text-slate-500">
                        用 3 種報酬率跑出差距，看懂時間的威力
                    </p>
                </header>

                {/* 重點結論 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-primary" />
                        複利的威力
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <p className="font-bold text-brand-primary mb-1">愛因斯坦說：複利是世界第八大奇蹟</p>
                            <p className="text-sm text-slate-600">理解它的人賺它，不理解的人付它</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                            <p className="font-bold text-green-600 mb-1">72 法則</p>
                            <p className="text-sm text-slate-600">72 ÷ 年報酬率 = 資產翻倍年數。例如 7% 報酬率，約 10 年翻倍</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                            <p className="font-bold text-purple-600 mb-1">時間 &gt; 金額</p>
                            <p className="text-sm text-slate-600">早 10 年開始，比晚 10 年每月多存 50% 效果更好</p>
                        </div>
                    </div>
                </section>

                {/* 互動計算 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-brand-primary" />
                        互動試算
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">初始本金</label>
                            <input
                                type="range" min="0" max="1000000" step="50000"
                                value={initial} onChange={(e) => setInitial(Number(e.target.value))}
                                className="w-full" aria-label="初始本金"
                            />
                            <p className="text-right font-bold text-brand-primary">${formatCurrency(initial)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">每月投入</label>
                            <input
                                type="range" min="1000" max="50000" step="1000"
                                value={monthly} onChange={(e) => setMonthly(Number(e.target.value))}
                                className="w-full" aria-label="每月投入"
                            />
                            <p className="text-right font-bold text-brand-primary">${formatCurrency(monthly)}/月</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">投資年數</label>
                            <input
                                type="range" min="5" max="40" step="5"
                                value={years} onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full" aria-label="投資年數"
                            />
                            <p className="text-right font-bold text-brand-primary">{years} 年</p>
                        </div>
                    </div>

                    {/* 比較表格 */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 text-left font-bold text-slate-500">年報酬率</th>
                                    <th className="py-3 text-right font-bold text-slate-500">投入總額</th>
                                    <th className="py-3 text-right font-bold text-slate-500">{years} 年後資產</th>
                                    <th className="py-3 text-right font-bold text-slate-500">獲利</th>
                                    <th className="py-3 text-right font-bold text-slate-500">獲利倍數</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((r, i) => (
                                    <tr key={i} className={`border-b border-slate-100 ${r.rate === 7 ? 'bg-blue-50' : ''}`}>
                                        <td className={`py-3 font-bold ${r.rate === 7 ? 'text-brand-primary' : 'text-slate-900'}`}>
                                            <DollarSign className="w-4 h-4 inline mr-1" />
                                            {r.rate}% {r.rate === 7 && '(市場平均)'}
                                        </td>
                                        <td className="py-3 text-right text-slate-600">${formatCurrency(r.invested)}</td>
                                        <td className="py-3 text-right font-bold text-slate-900">${formatCurrency(r.total)}</td>
                                        <td className="py-3 text-right font-bold text-green-600">+${formatCurrency(r.profit)}</td>
                                        <td className="py-3 text-right font-bold text-brand-primary">{(r.total / r.invested).toFixed(2)}x</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* FAQ */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">常見問題</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 7% 報酬率實際嗎？</h3>
                            <p className="text-slate-600">美股長期平均約 10%，台股約 7-8%。扣除通膨和費用，實質報酬約 4-6%。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 定期定額 vs 單筆投入？</h3>
                            <p className="text-slate-600">長期來看單筆效果較好，但定期定額降低擇時風險，適合大多數人。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 這個計算有考慮通膨嗎？</h3>
                            <p className="text-slate-600">沒有。實質購買力要再扣除 2-3% 通膨。建議用資本計算器看「實質購買力」。</p>
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
