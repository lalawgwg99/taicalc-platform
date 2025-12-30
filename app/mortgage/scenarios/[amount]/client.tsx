'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowRight, Calculator, TrendingDown, Scale } from 'lucide-react';

interface Props {
    loanAmount: number;
}

export default function MortgageScenarioClient({ loanAmount }: Props) {
    const [years, setYears] = useState(30);
    const [rate, setRate] = useState(2.0);

    // 計算
    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;

    let monthlyPayment: number;
    if (monthlyRate === 0) {
        monthlyPayment = loanAmount / totalMonths;
    } else {
        monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)
            / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    // 新青安比較 (1.775%, 5年寬限)
    const youthRate = 1.775 / 100 / 12;
    const graceMonths = 5 * 12;
    const payMonths = totalMonths - graceMonths;
    const gracePayment = loanAmount * youthRate;
    let youthMonthlyPayment: number;
    if (youthRate === 0) {
        youthMonthlyPayment = loanAmount / payMonths;
    } else {
        youthMonthlyPayment = loanAmount * youthRate * Math.pow(1 + youthRate, payMonths)
            / (Math.pow(1 + youthRate, payMonths) - 1);
    }
    const youthTotalInterest = gracePayment * graceMonths + youthMonthlyPayment * payMonths - loanAmount;

    const fmt = (n: number) => Math.round(n).toLocaleString('zh-TW');
    const loanLabel = loanAmount >= 10000000
        ? `${loanAmount / 10000000}千萬`
        : `${loanAmount / 10000}萬`;

    const relatedAmounts = [5000000, 8000000, 10000000, 12000000, 15000000, 20000000]
        .filter(a => a !== loanAmount);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="font-bold text-lg text-slate-900">TaiCalc</Link>
                    <Link href="/mortgage" className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
                        <Calculator className="w-4 h-4" />
                        自訂試算
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* H1 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        房貸 {loanLabel} 月付多少？
                    </h1>
                    <p className="text-lg text-slate-600">
                        {years}年期、{rate}% 利率，每月還款約 <span className="text-2xl font-bold text-green-600">{fmt(monthlyPayment)} 元</span>
                    </p>
                </div>

                {/* 快速結論 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 mb-8"
                >
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-sm text-slate-600 mb-1">貸款金額</p>
                            <p className="text-2xl font-bold text-slate-900">NT$ {fmt(loanAmount)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 mb-1">總利息</p>
                            <p className="text-2xl font-bold text-orange-500">NT$ {fmt(totalInterest)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-green-200">
                            <p className="text-sm text-green-600 mb-1">每月還款</p>
                            <p className="text-3xl font-black text-green-600">NT$ {fmt(monthlyPayment)}</p>
                        </div>
                    </div>
                </motion.div>

                {/* 參數調整 */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">調整試算條件</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-slate-600 mb-2 block">貸款年限</label>
                            <select
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                            >
                                <option value={20}>20 年</option>
                                <option value={30}>30 年</option>
                                <option value={40}>40 年</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 mb-2 block">年利率 (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                            />
                        </div>
                    </div>
                </section>

                {/* 新青安比較 */}
                <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-amber-500" />
                        新青安 vs 一般房貸比較
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-amber-200">
                                    <th className="text-left py-2 text-slate-600">項目</th>
                                    <th className="text-center py-2 text-green-700">一般房貸</th>
                                    <th className="text-center py-2 text-amber-700">新青安</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-amber-100">
                                    <td className="py-2 text-slate-600">利率</td>
                                    <td className="text-center">{rate}%</td>
                                    <td className="text-center">1.775%</td>
                                </tr>
                                <tr className="border-b border-amber-100">
                                    <td className="py-2 text-slate-600">寬限期</td>
                                    <td className="text-center">無</td>
                                    <td className="text-center">5 年</td>
                                </tr>
                                <tr className="border-b border-amber-100">
                                    <td className="py-2 text-slate-600">寬限期月付</td>
                                    <td className="text-center">-</td>
                                    <td className="text-center text-amber-600 font-bold">NT$ {fmt(gracePayment)}</td>
                                </tr>
                                <tr className="border-b border-amber-100">
                                    <td className="py-2 text-slate-600">正常期月付</td>
                                    <td className="text-center text-green-600 font-bold">NT$ {fmt(monthlyPayment)}</td>
                                    <td className="text-center text-amber-600 font-bold">NT$ {fmt(youthMonthlyPayment)}</td>
                                </tr>
                                <tr className="bg-amber-100/50">
                                    <td className="py-2 font-bold">總利息</td>
                                    <td className="text-center text-orange-600 font-bold">NT$ {fmt(totalInterest)}</td>
                                    <td className="text-center text-orange-600 font-bold">NT$ {fmt(youthTotalInterest)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="text-sm text-amber-700 mt-4">
                        ⚠️ 新青安寬限期結束後月付金額會大幅增加，請確保屆時有足夠還款能力。
                    </p>
                </section>

                {/* FAQ */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">常見問題</h2>

                    <div className="space-y-4">
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-slate-900 mb-2">Q：房貸月付金怎麼計算？</h3>
                            <p className="text-slate-600 text-sm">一般採本息平均攤還，會依本金、年利率、期數計算固定月付金。</p>
                        </div>
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-slate-900 mb-2">Q：寬限期真的比較划算嗎？</h3>
                            <p className="text-slate-600 text-sm">短期現金流較輕鬆，但通常會提高總利息或讓後期月付變高，建議用比較器看總成本。</p>
                        </div>
                        <div className="pb-4">
                            <h3 className="font-bold text-slate-900 mb-2">Q：房貸 {loanLabel} 要準備多少頭期款？</h3>
                            <p className="text-slate-600 text-sm">一般需準備 2-3 成頭期款，約 {fmt(loanAmount * 0.25)} 至 {fmt(loanAmount * 0.35)} 元。</p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center text-white mb-8">
                    <h2 className="text-2xl font-bold mb-4">想比較不同房貸方案？</h2>
                    <p className="mb-6 opacity-90">先用保守利率試算，再比較不同方案差距</p>
                    <Link
                        href="/pro/mortgage"
                        className="inline-flex items-center gap-2 bg-white text-green-600 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-all"
                    >
                        <Scale className="w-5 h-5" />
                        房貸方案比較器
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </section>

                {/* 相關頁面 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">其他貸款金額試算</h2>
                    <div className="flex flex-wrap gap-2">
                        {relatedAmounts.map(a => (
                            <Link
                                key={a}
                                href={`/mortgage/scenarios/${a}`}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                            >
                                房貸 {a >= 10000000 ? `${a / 10000000}千萬` : `${a / 10000}萬`}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 內部連結 */}
                <section className="bg-slate-50 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">延伸試算</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/salary" className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                            <Calculator className="w-8 h-8 text-blue-500" />
                            <div>
                                <p className="font-bold text-slate-900">薪資計算器</p>
                                <p className="text-sm text-slate-600">月付 {fmt(monthlyPayment)} 需要月收入多少？</p>
                            </div>
                        </Link>
                        <Link href="/home-assessment" className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                            <Home className="w-8 h-8 text-purple-500" />
                            <div>
                                <p className="font-bold text-slate-900">買房 vs 租房</p>
                                <p className="text-sm text-slate-600">哪個選擇更划算？</p>
                            </div>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 py-8 mt-12">
                <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-500">
                    <p>TaiCalc 房貸試算僅供參考，實際利率與條件以銀行公告為準。</p>
                    <p className="mt-2">不用登入、不用留資料，直接算。</p>
                </div>
            </footer>
        </div>
    );
}
