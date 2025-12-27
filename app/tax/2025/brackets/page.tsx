'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Calculator, TrendingUp, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function TaxBrackets2025() {
    const brackets = [
        { limit: 590000, rate: 5, deduction: 0, label: '0 ~ 59萬' },
        { limit: 1330000, rate: 12, deduction: 41300, label: '59萬 ~ 133萬' },
        { limit: 2660000, rate: 20, deduction: 147700, label: '133萬 ~ 266萬' },
        { limit: 4980000, rate: 30, deduction: 414700, label: '266萬 ~ 498萬' },
        { limit: Infinity, rate: 40, deduction: 912700, label: '498萬以上' },
    ];

    return (
        <div className="min-h-screen bg-brand-background font-sans pb-32 overflow-x-hidden text-slate-900">
            <div className="fixed inset-0 pointer-events-none -z-10 " />

            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/tax" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary shadow-lg border border-white/5 transition-transform group-hover:scale-110">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-slate-600 group-hover:text-brand-primary transition-colors">返回稅務試算</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black shadow-glow">T</div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">TaiCalc <span className="text-brand-primary">數策</span></span>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-brand-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">2025 最新</div>
                            <span className="text-sm text-slate-500 font-medium">更新日期：2025-01-01</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            2025 年綜合所得稅級距表
                        </h1>
                        <p className="text-lg text-slate-600 font-medium max-w-3xl leading-relaxed">
                            了解最新的所得稅級距與稅率，精準計算您的應繳稅額。五級累進稅率從 5% 至 40%，掌握邊際稅率是節稅第一步。
                        </p>
                    </motion.div>
                </header>

                {/* 級距表 */}
                <section className="mb-12">
                    <div className="glass-card rounded-3xl p-8 bg-white border border-slate-200 shadow-xl backdrop-blur-md">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">📊 2025 綜所稅級距一覽</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-200">
                                        <th className="text-left py-4 px-4 font-black text-slate-700">淨所得級距</th>
                                        <th className="text-center py-4 px-4 font-black text-slate-700">稅率</th>
                                        <th className="text-right py-4 px-4 font-black text-slate-700">累進差額</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brackets.map((bracket, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-4 font-mono text-sm">{bracket.label}</td>
                                            <td className="text-center py-4 px-4">
                                                <span className="inline-block bg-brand-primary/10 text-brand-primary font-black px-4 py-1 rounded-full text-lg">
                                                    {bracket.rate}%
                                                </span>
                                            </td>
                                            <td className="text-right py-4 px-4 font-mono text-sm text-slate-600">
                                                {bracket.deduction > 0 ? formatCurrency(bracket.deduction) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 計算公式 */}
                <section className="mb-12">
                    <div className="glass-card rounded-3xl p-8 bg-blue-50/60 border border-blue-100 shadow-xl backdrop-blur-md">
                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center">
                            <Calculator className="w-6 h-6 mr-2 text-brand-primary" />
                            如何計算應繳稅額？
                        </h3>
                        <div className="bg-white/80 rounded-2xl p-6 font-mono text-sm space-y-2">
                            <p className="text-slate-700"><strong>應納稅額</strong> = 淨所得 × 稅率 - 累進差額</p>
                            <p className="text-xs text-slate-500 mt-4">
                                範例：淨所得 150 萬，級距為 12%，累進差額 41,300<br />
                                應納稅額 = 1,500,000 × 12% - 41,300 = <strong className="text-brand-primary">138,700 元</strong>
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-12">
                    <h3 className="text-2xl font-black text-slate-900 mb-6">💡 常見問題</h3>
                    <div className="space-y-4">
                        {[
                            {
                                q: '什麼是「淨所得」？',
                                a: '淨所得 = 總收入 - 免稅額 - 扣除額（標準/列舉）- 特別扣除額。用淨所得對照級距表，才能算出應繳稅額。'
                            },
                            {
                                q: '邊際稅率與有效稅率的差別？',
                                a: '邊際稅率是您最後一塊錢適用的稅率（例如 12%），有效稅率是實際繳稅金額 ÷ 總收入，通常會低於邊際稅率。'
                            },
                            {
                                q: '2025 年級距有調整嗎？',
                                a: '2025 年級距維持五級不變（5%、12%、20%、30%、40%），累進差額也維持相同。'
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                                <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section>
                    <div className="bg-gradient-to-r from-brand-primary to-blue-600 rounded-3xl p-8 text-white">
                        <h3 className="text-2xl font-black mb-3">立即試算您的 2025 應繳稅額</h3>
                        <p className="mb-6 text-blue-50">使用 TaiCalc 完整稅務計算器，輸入收入與家庭狀況，精準估算稅額與節稅空間。</p>
                        <Link
                            href="/tax"
                            className="inline-flex items-center space-x-2 bg-white text-brand-primary px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg"
                        >
                            <Calculator className="w-5 h-5" />
                            <span>開始計算</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
