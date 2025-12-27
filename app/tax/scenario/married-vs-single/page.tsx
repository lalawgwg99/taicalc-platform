'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Users, Calculator, ArrowRight, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { TAIWAN_PARAMS } from '@/lib/constants';

export default function MarriedVsSingleScenario() {
    const [annualIncome, setAnnualIncome] = useState(1200000);

    // 簡化的稅額計算函數
    const calculateTax = (income: number, isMarried: boolean) => {
        const { EXEMPTION, STANDARD, SALARY_SPECIAL } = TAIWAN_PARAMS.DEDUCTIONS as any;
        const exemptions = isMarried ? EXEMPTION * 2 : EXEMPTION;
        const standardDeduction = isMarried ? STANDARD * 2 : STANDARD;
        const salaryDeduction = Math.min(income, SALARY_SPECIAL);
        const totalDeductions = exemptions + standardDeduction + salaryDeduction;
        const netIncome = Math.max(0, income - totalDeductions);

        // 簡化稅額計算（使用 12% 稅率）
        let tax = 0;
        if (netIncome <= 590000) {
            tax = netIncome * 0.05;
        } else if (netIncome <= 1330000) {
            tax = netIncome * 0.12 - 41300;
        } else {
            tax = netIncome * 0.20 - 147700;
        }
        tax = Math.max(0, tax);

        return {
            exemptions,
            standardDeduction,
            tax: Math.round(tax),
            effectiveRate: income > 0 ? (tax / income) * 100 : 0
        };
    };

    const single = useMemo(() => calculateTax(annualIncome, false), [annualIncome]);
    const married = useMemo(() => calculateTax(annualIncome, true), [annualIncome]);
    const savings = single.tax - married.tax;

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
                            <div className="bg-brand-accent text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">情境分析</div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            結婚後報稅會比較省嗎？
                        </h1>
                        <p className="text-lg text-slate-600 font-medium max-w-3xl leading-relaxed">
                            婚姻狀態會影響標準扣除額（雙倍）與免稅額（多一人）。用實際案例看看單身與已婚的稅負差異。
                        </p>
                    </motion.div>
                </header>

                {/* 互動試算 */}
                <section className="mb-12">
                    <div className="glass-card rounded-3xl p-8 bg-white border border-slate-200 shadow-xl backdrop-blur-md">
                        <h2 className="text-xl font-black text-slate-900 mb-6">調整年收入，即時比較稅負</h2>
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-slate-600 mb-3">年收入</label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="range"
                                    min="500000"
                                    max="3000000"
                                    step="100000"
                                    value={annualIncome}
                                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                    aria-label="調整年收入"
                                />
                                <span className="text-2xl font-black text-brand-primary w-32 text-right">{formatCurrency(annualIncome)}</span>
                            </div>
                        </div>

                        {/* 比較結果 */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6">
                                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center">
                                    👤 單身申報
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">免稅額</span>
                                        <span className="font-mono">{formatCurrency(single.exemptions)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">標準扣除額</span>
                                        <span className="font-mono">{formatCurrency(single.standardDeduction)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-3">
                                        <span className="font-bold text-slate-900">應繳稅額</span>
                                        <span className="font-mono font-black text-lg">{formatCurrency(single.tax)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6">
                                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center">
                                    💑 已婚申報
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">免稅額</span>
                                        <span className="font-mono">{formatCurrency(married.exemptions)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">標準扣除額</span>
                                        <span className="font-mono">{formatCurrency(married.standardDeduction)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-3">
                                        <span className="font-bold text-slate-900">應繳稅額</span>
                                        <span className="font-mono font-black text-lg text-green-700">{formatCurrency(married.tax)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 節稅金額 */}
                        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <TrendingDown className="w-8 h-8" />
                                    <div>
                                        <p className="text-sm text-green-100">結婚可節省</p>
                                        <p className="text-3xl font-black">{formatCurrency(savings)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-green-100">有效稅率</p>
                                    <p className="text-xl font-bold">單身 {single.effectiveRate.toFixed(1)}% → 已婚 {married.effectiveRate.toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 分析說明 */}
                <section className="mb-12">
                    <h3 className="text-2xl font-black text-slate-900 mb-6">為什麼已婚比較省？</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <h4 className="font-bold text-slate-900 mb-2">📋 標準扣除額加倍</h4>
                            <p className="text-slate-600 text-sm">單身 12.4萬 → 已婚 24.8萬，多了 12.4萬 的扣除空間。</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <h4 className="font-bold text-slate-900 mb-2">👥 免稅額增加</h4>
                            <p className="text-slate-600 text-sm">配偶算一個扶養人口，多 9.2萬 免稅額。</p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section>
                    <div className="bg-gradient-to-r from-brand-primary to-blue-600 rounded-3xl p-8 text-white">
                        <h3 className="text-2xl font-black mb-3">試算您的實際狀況</h3>
                        <p className="mb-6 text-blue-50">輸入收入、扶養親屬等資料，取得更精準的稅額計算。</p>
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
