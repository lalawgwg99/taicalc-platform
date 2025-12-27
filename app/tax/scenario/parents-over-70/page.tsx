'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Calculator, ArrowRight, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { TAIWAN_PARAMS } from '@/lib/constants';

export default function ParentsOver70Scenario() {
    const [parentsUnder70, setParentsUnder70] = useState(0);
    const [parentsOver70, setParentsOver70] = useState(2);

    const { EXEMPTION } = TAIWAN_PARAMS.DEDUCTIONS as any;

    const exemptionUnder70 = parentsUnder70 * EXEMPTION;
    const exemptionOver70 = parentsOver70 * (EXEMPTION * 1.5);
    const totalExemption = exemptionUnder70 + exemptionOver70;
    const bonus = exemptionOver70 - (parentsOver70 * EXEMPTION);

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
                            <div className="bg-brand-success text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">情境分析</div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            扶養 70 歲以上長輩，免稅額加成 50%
                        </h1>
                        <p className="text-lg text-slate-600 font-medium max-w-3xl leading-relaxed">
                            稅法針對 70 歲以上扶養親屬提供額外優惠：免稅額從 9.2 萬提高至 13.8 萬。善用此規則，合法節稅又盡孝。
                        </p>
                    </motion.div>
                </header>

                {/* 互動試算 */}
                <section className="mb-12">
                    <div className="glass-card rounded-3xl p-8 bg-white/60 border border-white/40 shadow-xl backdrop-blur-md">
                        <h2 className="text-xl font-black text-slate-900 mb-6">調整扶養人數，即時計算免稅額</h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-3">70歲以下扶養親屬</label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="4"
                                        step="1"
                                        value={parentsUnder70}
                                        onChange={(e) => setParentsUnder70(Number(e.target.value))}
                                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                                    />
                                    <span className="text-2xl font-black text-slate-700 w-16 text-center">{parentsUnder70} 人</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-3">70歲以上扶養親屬 ⭐</label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="4"
                                        step="1"
                                        value={parentsOver70}
                                        onChange={(e) => setParentsOver70(Number(e.target.value))}
                                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-success"
                                    />
                                    <span className="text-2xl font-black text-brand-success w-16 text-center">{parentsOver70} 人</span>
                                </div>
                            </div>
                        </div>

                        {/* 計算結果 */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6">
                            <h3 className="text-lg font-black text-slate-900 mb-4">免稅額計算結果</h3>
                            <div className="space-y-3 text-sm">
                                {parentsUnder70 > 0 && (
                                    <div className="flex justify-between items-center pb-3 border-b border-green-200">
                                        <span className="text-slate-600">70歲以下 {parentsUnder70} 人 × {formatCurrency(EXEMPTION)}</span>
                                        <span className="font-mono font-bold">{formatCurrency(exemptionUnder70)}</span>
                                    </div>
                                )}
                                {parentsOver70 > 0 && (
                                    <div className="flex justify-between items-center pb-3 border-b border-green-200">
                                        <span className="text-slate-600">70歲以上 {parentsOver70} 人 × {formatCurrency(EXEMPTION * 1.5)}</span>
                                        <span className="font-mono font-bold text-green-700">{formatCurrency(exemptionOver70)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-3">
                                    <span className="font-bold text-slate-900 text-lg">總免稅額</span>
                                    <span className="font-mono font-black text-2xl text-green-700">{formatCurrency(totalExemption)}</span>
                                </div>
                            </div>
                        </div>

                        {/* 加成優惠 */}
                        {parentsOver70 > 0 && (
                            <div className="mt-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Heart className="w-8 h-8" />
                                        <div>
                                            <p className="text-sm text-green-100">70歲以上加成優惠</p>
                                            <p className="text-3xl font-black">{formatCurrency(bonus)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-green-100">相當於節稅</p>
                                        <p className="text-xl font-bold">約 {formatCurrency(Math.round(bonus * 0.12))}</p>
                                        <p className="text-xs text-green-200">(以 12% 稅率估算)</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 重點提示 */}
                <section className="mb-12">
                    <h3 className="text-2xl font-black text-slate-900 mb-6">🎯 重點提示</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/60 border border-slate-200 rounded-2xl p-6">
                            <h4 className="font-bold text-slate-900 mb-2">📅 年齡計算基準</h4>
                            <p className="text-slate-600 text-sm">以「所得年度次年 1 月 1 日」為準。例如 2025 年報稅，看的是 2025/1/1 是否滿 70 歲。</p>
                        </div>
                        <div className="bg-white/60 border border-slate-200 rounded-2xl p-6">
                            <h4 className="font-bold text-slate-900 mb-2">👨‍👩‍👧 扶養條件</h4>
                            <p className="text-slate-600 text-sm">須符合「無謀生能力」或「未滿 20 歲」等條件，且須檢附相關證明文件。</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-12">
                    <h3 className="text-2xl font-black text-slate-900 mb-6">❓ 常見問題</h3>
                    <div className="space-y-4">
                        {[
                            {
                                q: '兄弟姊妹可以同時扶養父母嗎？',
                                a: '不行。每位扶養親屬只能由一位納稅義務人申報，需要事先溝通協調。'
                            },
                            {
                                q: '扶養父母一定要同住嗎？',
                                a: '不一定。只要符合扶養條件（例如無謀生能力），即使不同住也可申報。'
                            },
                            {
                                q: '父母有收入還能申報扶養嗎？',
                                a: '若所得超過免稅額（9.2萬）或有其他收入來源，可能不符合「無謀生能力」，需個案判定。'
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
                        <h3 className="text-2xl font-black mb-3">計算您的完整稅額</h3>
                        <p className="mb-6 text-blue-50">輸入所有收入與扶養資料，取得精準的應繳稅額與節稅建議。</p>
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
