'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Calculator,
    Home,
    TrendingUp,
    Receipt,
    ChevronRight,
    Briefcase,
    Zap,
    Shield,
    Target,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';

// 核心計算器入口
const CORE_CALCULATORS = [
    {
        id: 'salary',
        title: '薪資計算器',
        question: '月薪扣完實領多少？',
        description: '勞健保、勞退、年終獎金完整試算',
        href: '/salary',
        icon: Briefcase,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        id: 'mortgage',
        title: '房貸計算器',
        question: '每月要繳多少？',
        description: '本息攤還、新青安、寬限期試算',
        href: '/mortgage',
        icon: Home,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
    },
    {
        id: 'tax',
        title: '所得稅計算器',
        question: '年收要繳多少稅？',
        description: '2024 稅率級距、免稅額、扣除額',
        href: '/tax',
        icon: Receipt,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    {
        id: 'capital',
        title: '複利計算器',
        question: '存到 100 萬要多久？',
        description: '定期定額、報酬率、時間複利效應',
        href: '/capital',
        icon: TrendingUp,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
    },
];

// 常見問題快速入口
const QUICK_QUESTIONS = [
    { q: '面試時該開多少薪水？', href: '/salary', tag: '薪資' },
    { q: '勞退自提 6% 划算嗎？', href: '/salary/scenarios/pension-tax-saving', tag: '薪資' },
    { q: '新青安房貸利率多少？', href: '/mortgage', tag: '房貸' },
    { q: '年終獎金要繳多少稅？', href: '/tax/scenarios/year-end-bonus', tag: '稅務' },
    { q: '每月存 1 萬，10 年後變多少？', href: '/capital', tag: '理財' },
    { q: '買房還是租房划算？', href: '/mortgage/scenario/rent-vs-buy', tag: '房貸' },
];

export default function HomePage() {
    return (
        <div className="relative">
            {/* 導航列 - 玻璃擬態 */}
            <nav className="sticky top-0 z-50 glass-surface border-b border-white/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
                            TaiCalc
                        </span>
                    </Link>
                    <div className="flex items-center space-x-1 md:space-x-4">
                        <Link href="/calculators" className="hidden md:inline-block px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                            所有工具
                        </Link>
                        <Link href="/articles" className="hidden md:inline-block px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                            知識文章
                        </Link>
                        <Link href="/salary" className="btn-primary px-4 py-2 rounded-lg text-sm">
                            開始試算
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

                {/* ===== Hero Section ===== */}
                <section className="pt-24 pb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* 標籤 */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-indigo-100 backdrop-blur-md mb-8 shadow-sm">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm font-medium text-indigo-600">專為台灣人設計的財務決策工具</span>
                        </div>

                        {/* H1 主標 */}
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight text-slate-900">
                            3 分鐘算清楚
                            <br />
                            <span className="text-gradient-primary">
                                每個財務決策的影響
                            </span>
                        </h1>

                        {/* 副標 */}
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                            薪資、房貸、所得稅、投資複利。<br className="sm:hidden" />
                            免註冊、結果清楚、一看就懂。
                        </p>
                    </motion.div>
                </section>

                {/* ===== 核心計算器卡片 ===== */}
                <section className="pb-20">
                    <div className="grid md:grid-cols-2 gap-6">
                        {CORE_CALCULATORS.map((calc, idx) => (
                            <motion.div
                                key={calc.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <Link href={calc.href} className="group block h-full">
                                    <div className="glass-card rounded-3xl p-8 h-full relative overflow-hidden group-hover:border-indigo-200 group-hover:shadow-indigo-500/10">

                                        {/* 裝飾性背景光斑 */}
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                                        <div className="relative z-10 flex items-start justify-between">
                                            <div>
                                                <div className={`w-14 h-14 ${calc.bg} ${calc.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                                    <calc.icon className="w-7 h-7" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{calc.title}</h3>
                                                <p className="text-lg font-bold text-slate-700 mb-3">{calc.question}</p>
                                                <p className="text-slate-500 leading-relaxed">{calc.description}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ===== 常見問題快速入口 ===== */}
                <section className="pb-24">
                    <div className="glass-panel rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center justify-center gap-2">
                            <Target className="w-6 h-6 text-indigo-500" />
                            常見問題，一鍵直達
                        </h2>
                        <div className="flex flex-wrapjustify-center gap-3 max-w-4xl mx-auto">
                            {QUICK_QUESTIONS.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className="group inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-full hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-medium group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{item.tag}</span>
                                    <span className="text-slate-600 font-medium group-hover:text-indigo-700 transition-colors">{item.q}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== 信任區塊 ===== */}
                <section className="pb-24">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">台灣在地數據</h3>
                            <p className="text-slate-500 leading-relaxed">依據 2024/2025 最新勞健保、稅務級距與房貸政策設計，拒絕過時資訊。</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">快，還要更快</h3>
                            <p className="text-slate-500 leading-relaxed">無需登入、無需等待。打開即算，UI 操作直覺，3 分鐘內獲得答案。</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Target className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">決策輔助</h3>
                            <p className="text-slate-500 leading-relaxed">提供的不只是數字，還有「划算與否」的分析建議，幫助你做對決定。</p>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
