'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calculator, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function LoanTermComparisonPage() {
    const [loanAmount, setLoanAmount] = useState(10000000);
    const [rate, setRate] = useState(2.15);

    const terms = [20, 25, 30, 35, 40];

    const result = useMemo(() => {
        return terms.map(years => {
            const monthlyRate = rate / 100 / 12;
            const totalMonths = years * 12;
            const monthly = monthlyRate === 0
                ? loanAmount / totalMonths
                : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
            const total = monthly * totalMonths;
            const interest = total - loanAmount;

            return { years, monthly: Math.round(monthly), interest: Math.round(interest), total: Math.round(total) };
        });
    }, [loanAmount, rate]);

    const base = result[2]; // 30年作為基準

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
                        房貸年限 20/30/40 年怎麼選？
                    </h1>
                    <p className="text-lg text-slate-500">
                        月付金、總利息、風險壓力完整比較
                    </p>
                </header>

                {/* 結論 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-primary" />
                        選擇建議
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 rounded-xl">
                            <p className="font-bold text-green-600 mb-1">20-25 年：省利息派</p>
                            <p className="text-sm text-slate-600">月付壓力大，但總利息最少，適合收入穩定高的人</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl border-2 border-brand-primary">
                            <p className="font-bold text-brand-primary mb-1">30 年：平衡派 ⭐</p>
                            <p className="text-sm text-slate-600">月付適中，最多人選擇，彈性空間大</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                            <p className="font-bold text-purple-600 mb-1">35-40 年：低壓力派</p>
                            <p className="text-sm text-slate-600">月付最低，但總利息高，適合想保留現金流的人</p>
                        </div>
                    </div>
                </section>

                {/* 互動計算 */}
                <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-brand-primary" />
                        年限比較試算
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">貸款金額</label>
                            <input
                                type="range" min="1000000" max="30000000" step="500000"
                                value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="w-full" aria-label="貸款金額"
                            />
                            <p className="text-right font-bold text-brand-primary">${formatCurrency(loanAmount)}</p>
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
                    </div>

                    {/* 比較表格 */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 text-left font-bold text-slate-500">年限</th>
                                    <th className="py-3 text-right font-bold text-slate-500">月付金</th>
                                    <th className="py-3 text-right font-bold text-slate-500">vs 30年</th>
                                    <th className="py-3 text-right font-bold text-slate-500">總利息</th>
                                    <th className="py-3 text-right font-bold text-slate-500">vs 30年</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((r, i) => (
                                    <tr key={i} className={`border-b border-slate-100 ${r.years === 30 ? 'bg-blue-50' : ''}`}>
                                        <td className={`py-3 font-bold ${r.years === 30 ? 'text-brand-primary' : 'text-slate-900'}`}>
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            {r.years} 年 {r.years === 30 && '⭐'}
                                        </td>
                                        <td className="py-3 text-right font-bold text-slate-900">${formatCurrency(r.monthly)}</td>
                                        <td className={`py-3 text-right font-bold ${r.monthly > base.monthly ? 'text-red-500' : r.monthly < base.monthly ? 'text-green-500' : 'text-slate-400'}`}>
                                            {r.monthly === base.monthly ? '-' : (r.monthly > base.monthly ? '+' : '') + formatCurrency(r.monthly - base.monthly)}
                                        </td>
                                        <td className="py-3 text-right text-slate-600">${formatCurrency(r.interest)}</td>
                                        <td className={`py-3 text-right font-bold ${r.interest > base.interest ? 'text-red-500' : r.interest < base.interest ? 'text-green-500' : 'text-slate-400'}`}>
                                            {r.interest === base.interest ? '-' : (r.interest > base.interest ? '+' : '') + formatCurrency(r.interest - base.interest)}
                                        </td>
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
                            <h3 className="font-bold text-slate-900 mb-2">Q: 年限越長越好嗎？</h3>
                            <p className="text-slate-600">不一定。年限長月付低但總利息高。建議用「月付不超過收入 1/3」原則選擇。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 可以中途縮短年限嗎？</h3>
                            <p className="text-slate-600">可以，透過「提前還款」可縮短年限，但需注意綁約期內可能有違約金。</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Q: 新青安最長幾年？</h3>
                            <p className="text-slate-600">新青安最長 40 年，加上寬限期 5 年，是目前最優惠的首購方案。</p>
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
