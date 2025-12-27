'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Receipt, Users, Heart, BookOpen, Calculator, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { TAIWAN_PARAMS } from '@/lib/constants';

export default function TaxDeductions2025() {
    const { EXEMPTION, STANDARD, SALARY_SPECIAL, BASIC_LIVING_EXPENSE } = TAIWAN_PARAMS.DEDUCTIONS as any;

    const deductions = [
        {
            icon: <Users className="w-6 h-6" />,
            title: '免稅額',
            items: [
                { label: '本人、配偶、一般扶養親屬', amount: EXEMPTION },
                { label: '70歲以上扶養親屬', amount: EXEMPTION * 1.5 },
            ]
        },
        {
            icon: <Receipt className="w-6 h-6" />,
            title: '標準扣除額',
            items: [
                { label: '單身', amount: STANDARD },
                { label: '已婚', amount: STANDARD * 2 },
            ]
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: '薪資特別扣除額',
            items: [
                { label: '每人（上限）', amount: SALARY_SPECIAL },
            ]
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: '基本生活費',
            items: [
                { label: '每人', amount: BASIC_LIVING_EXPENSE },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-brand-background font-sans pb-32 overflow-x-hidden text-slate-900">
            <div className="fixed inset-0 pointer-events-none -z-10 aurora-bg opacity-70" />

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
                            2025 年綜合所得稅扣除額總整理
                        </h1>
                        <p className="text-lg text-slate-600 font-medium max-w-3xl leading-relaxed">
                            免稅額、扣除額、特別扣除額⋯⋯一次搞懂所有可扣除項目。善用扣除額，就是合法節稅的第一步。
                        </p>
                    </motion.div>
                </header>

                {/* 扣除額卡片 */}
                <section className="mb-12">
                    <div className="grid md:grid-cols-2 gap-6">
                        {deductions.map((category, index) => (
                            <div key={index} className="glass-card rounded-3xl p-8 bg-white/60 border border-white/40 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900">{category.title}</h3>
                                </div>
                                <div className="space-y-4">
                                    {category.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0">
                                            <span className="text-sm text-slate-600 font-medium">{item.label}</span>
                                            <span className="text-lg font-black text-brand-primary">{formatCurrency(item.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 基本生活費差額說明 */}
                <section className="mb-12">
                    <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-8">
                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center">
                            💡 什麼是「基本生活費差額」？
                        </h3>
                        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-3">
                            <p>
                                <strong>基本生活費</strong> 是政府保障每個人基本生活所需的金額（2025 年為 <strong className="text-brand-primary">20.2 萬元/人</strong>）。
                            </p>
                            <p>
                                計算方式：<br />
                                <code className="bg-white px-2 py-1 rounded text-xs">基本生活費總額 = 申報戶人數 × 20.2 萬</code>
                            </p>
                            <p>
                                若「基本生活費總額」 <strong>大於</strong> 「免稅額 + 標準/列舉扣除額」，<strong className="text-brand-primary">差額可額外扣除</strong>。
                            </p>
                            <p className="text-sm text-slate-500">
                                範例：4 口之家，基本生活費 = 4 × 202,000 = 808,000。若免稅額+扣除額合計 70 萬，則可再多扣 108,000 元。
                            </p>
                        </div>
                    </div>
                </section>

                {/* 節稅策略提示 */}
                <section className="mb-12">
                    <h3 className="text-2xl font-black text-slate-900 mb-6">🎯 節稅策略提示</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title: '善用扶養', desc: '扶養 70 歲以上長輩，免稅額加成 50%' },
                            { title: '標準 vs 列舉', desc: '比較捐贈、醫藥費等，選擇較高者' },
                            { title: '基本生活費', desc: '多口之家特別留意「差額」空間' },
                        ].map((tip, i) => (
                            <div key={i} className="bg-white/60 border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                                <h4 className="font-bold text-slate-900 mb-2">{tip.title}</h4>
                                <p className="text-slate-600 text-sm">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-12">
                    <h3 className="text-2xl font-black text-slate-900 mb-6">❓ 常見問題</h3>
                    <div className="space-y-4">
                        {[
                            {
                                q: '免稅額與扣除額有什麼不同？',
                                a: '免稅額是按「人」計算（本人、配偶、扶養親屬），扣除額是按「項目」計算（標準/列舉、特別扣除）。'
                            },
                            {
                                q: '薪資特別扣除額有限制嗎？',
                                a: '有。每人上限 20.7 萬，且不能超過薪資收入本身。例如年薪 50 萬，最多只能扣 20.7 萬。'
                            },
                            {
                                q: '2025 年扣除額有調整嗎？',
                                a: '免稅額維持 9.2 萬、標準扣除額 12.4 萬（單身）/24.8 萬（已婚）。基本生活費調升至 20.2 萬。'
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white/60 border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                                <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section>
                    <div className="bg-gradient-to-r from-brand-primary to-blue-600 rounded-3xl p-8 text-white">
                        <h3 className="text-2xl font-black mb-3">試算您的節稅空間</h3>
                        <p className="mb-6 text-blue-50">輸入收入與家庭狀況，TaiCalc 自動計算所有扣除額與基本生活費差額。</p>
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
