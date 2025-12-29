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
    DollarSign,
    Zap,
    Shield,
    Target,
    ArrowUpRight
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
        color: 'from-blue-500 to-blue-600',
        bgLight: 'bg-blue-50',
        textColor: 'text-blue-600'
    },
    {
        id: 'mortgage',
        title: '房貸計算器',
        question: '每月要繳多少？',
        description: '本息攤還、新青安、寬限期試算',
        href: '/mortgage',
        icon: Home,
        color: 'from-green-500 to-green-600',
        bgLight: 'bg-green-50',
        textColor: 'text-green-600'
    },
    {
        id: 'tax',
        title: '所得稅計算器',
        question: '年收要繳多少稅？',
        description: '2024 稅率級距、免稅額、扣除額',
        href: '/tax',
        icon: Receipt,
        color: 'from-purple-500 to-purple-600',
        bgLight: 'bg-purple-50',
        textColor: 'text-purple-600'
    },
    {
        id: 'capital',
        title: '複利計算器',
        question: '存到 100 萬要多久？',
        description: '定期定額、報酬率、時間複利效應',
        href: '/capital',
        icon: TrendingUp,
        color: 'from-indigo-500 to-indigo-600',
        bgLight: 'bg-indigo-50',
        textColor: 'text-indigo-600'
    },
];

// 常見問題快速入口
const QUICK_QUESTIONS = [
    { q: '面試時該開多少薪水？', href: '/salary', tag: '薪資' },
    { q: '勞退自提 6% 划算嗎？', href: '/salary', tag: '薪資' },
    { q: '新青安房貸利率多少？', href: '/mortgage', tag: '房貸' },
    { q: '年終獎金要繳多少稅？', href: '/tax', tag: '稅務' },
    { q: '每月存 1 萬，10 年後變多少？', href: '/capital', tag: '理財' },
    { q: '買房還是租房划算？', href: '/mortgage', tag: '房貸' },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">

            {/* 導航列 - 暗色主題 */}
            <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                            <span className="font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-black tracking-tight">
                            TaiCalc
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/calculators" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            所有工具
                        </Link>
                        <Link href="/articles" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            知識文章
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* ===== Hero Section ===== */}
                <section className="pt-20 pb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* 標籤 */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                            <Zap className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-blue-300">專為台灣人設計的財務計算工具</span>
                        </div>

                        {/* H1 主標 */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
                            <span className="text-white">3 分鐘算清楚</span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                每個財務決策的真正影響
                            </span>
                        </h1>

                        {/* 副標 */}
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                            薪資、房貸、所得稅、投資複利<br className="sm:hidden" />
                            免註冊、結果清楚、一看就懂
                        </p>
                    </motion.div>
                </section>

                {/* ===== 核心計算器卡片 ===== */}
                <section className="pb-16">
                    <div className="grid md:grid-cols-2 gap-6">
                        {CORE_CALCULATORS.map((calc, idx) => (
                            <motion.div
                                key={calc.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <Link href={calc.href} className="group block">
                                    <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 hover:border-slate-600 transition-all overflow-hidden">
                                        {/* 背景漸層 */}
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${calc.color} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`}></div>

                                        <div className="relative z-10 flex items-start justify-between">
                                            <div>
                                                <div className={`w-12 h-12 ${calc.bgLight} ${calc.textColor} rounded-xl flex items-center justify-center mb-4`}>
                                                    <calc.icon className="w-6 h-6" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-1">{calc.title}</h3>
                                                <p className="text-xl font-black text-white mb-2">{calc.question}</p>
                                                <p className="text-sm text-slate-400">{calc.description}</p>
                                            </div>
                                            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ===== 常見問題快速入口 ===== */}
                <section className="pb-16">
                    <h2 className="text-lg font-bold text-slate-400 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        常見問題，一鍵直達
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {QUICK_QUESTIONS.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="group inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-full hover:bg-slate-800 hover:border-slate-600 transition-all"
                            >
                                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">{item.tag}</span>
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.q}</span>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ===== 信任區塊 ===== */}
                <section className="pb-20">
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                        <h2 className="text-xl font-bold text-white mb-6 text-center">為什麼選擇 TaiCalc？</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-white mb-2">台灣在地</h3>
                                <p className="text-sm text-slate-400">依最新勞健保、稅務與房貸條件設計，數據準確可靠</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-white mb-2">3 分鐘解決</h3>
                                <p className="text-sm text-slate-400">打開就能算，不用 Excel 也不用註冊，效率至上</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-white mb-2">結果清楚</h3>
                                <p className="text-sm text-slate-400">不只算數字，還有公式說明、FAQ 和下一步建議</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* ===== 頁尾 ===== */}
            <footer className="border-t border-slate-800 bg-slate-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">T</div>
                            <span className="font-bold">TaiCalc</span>
                            <span className="text-slate-500 text-sm">• 台灣財務決策計算平台</span>
                        </div>
                        <div className="flex space-x-6 text-sm text-slate-500">
                            <Link href="/privacy" className="hover:text-white transition-colors">隱私權政策</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">使用條款</Link>
                            <Link href="/calculators" className="hover:text-white transition-colors">所有工具</Link>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                        <p>© 2025 TaiCalc. 計算結果僅供參考，不構成財務建議。</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
