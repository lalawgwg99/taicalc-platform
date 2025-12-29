'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Calculator,
    Home,
    TrendingUp,
    PieChart,
    ChevronRight,
    ArrowRight,
    FileText,
    Shield,
    BarChart3
} from 'lucide-react';

export default function HomePage() {
    const tools = [
        {
            title: '薪資計算',
            description: '算出扣完勞健保後實際拿多少，還能反推談薪時該開多少。',
            icon: <Calculator className="w-6 h-6" />,
            link: '/salary',
            color: 'bg-blue-500',
        },
        {
            title: '房貸試算',
            description: '輸入房價和利率，馬上知道每月要繳多少、總共付多少利息。',
            icon: <Home className="w-6 h-6" />,
            link: '/mortgage',
            color: 'bg-emerald-500',
        },
        {
            title: '稅務試算',
            description: '根據收入和扣除額，幫你算出今年要繳多少稅。',
            icon: <PieChart className="w-6 h-6" />,
            link: '/tax',
            color: 'bg-violet-500',
        },
        {
            title: '存錢 / 投資試算',
            description: '看看每月存多少、放幾年，最後會變成多少錢。',
            icon: <TrendingUp className="w-6 h-6" />,
            link: '/capital',
            color: 'bg-amber-500',
        },
    ];

    return (
        <div className="min-h-screen font-sans overflow-x-hidden bg-gradient-to-b from-slate-50 to-white">

            {/* 導航列 */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <span className="font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900">
                            TaiCalc
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/articles" className="hidden md:block text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors">
                            知識文章
                        </Link>
                        <Link href="/salary" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all shadow-md font-medium text-sm">
                            開始試算
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* ===== Hero Section ===== */}
                <section className="pt-16 pb-20 md:pt-24 md:pb-28 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* H1 主標 */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                            TaiCalc｜幫你算清楚，<br className="md:hidden" />
                            <span className="text-blue-500">每個財務選擇的長期差距</span>
                        </h1>

                        {/* 副標 */}
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-4 leading-relaxed">
                            同一份薪資、同一筆房貸，不同選擇，<br className="hidden md:block" />
                            5 年後差距可能超過<span className="font-bold text-slate-800">數十萬到上百萬</span>。
                        </p>
                        <p className="text-base text-slate-500 max-w-xl mx-auto mb-10">
                            TaiCalc 幫你快速試算，看清每個決定的真正影響。
                        </p>

                        {/* CTA 按鈕 - 只要一個 */}
                        <Link
                            href="/salary"
                            className="inline-flex items-center bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 group"
                        >
                            👉 立即開始試算（免費）
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </section>

                {/* ===== 為什麼要用 TaiCalc ===== */}
                <section className="py-16 mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-10 text-center">
                        為什麼要用 TaiCalc？
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2 text-lg">台灣在地規則</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                依最新勞健保、稅務與房貸條件設計，<br />不用自己查法規。
                            </p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2 text-lg">不用 Excel，也不用註冊</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                打開就能算，結果一看就懂。<br />所有計算都在你眼前完成。
                            </p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                                <BarChart3 className="w-6 h-6 text-amber-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2 text-lg">不只算數字，而是比較選擇</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                幫你看「如果當初這樣選，<br />會差多少錢」。
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== 熱門財務試算工具 ===== */}
                <section id="tools" className="py-16 mb-8 scroll-mt-20">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-10 text-center">
                        熱門財務試算工具
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {tools.map((tool, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                <Link href={tool.link} className="block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all group h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                            {tool.icon}
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-500 transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        {tool.description}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ===== 知識文章入口 ===== */}
                <section className="py-12 mb-8">
                    <Link
                        href="/articles"
                        className="block bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-500 transition-colors">
                                    📚 財務知識文章
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    勞退自提怎麼選？ETF 該怎麼買？用白話文幫你解釋。
                                </p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </section>

            </main>

            {/* ===== 頁尾（為未來鋪梗）===== */}
            <footer className="border-t border-slate-100 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
                    <div className="text-center mb-8">
                        <p className="text-slate-500 text-sm">
                            TaiCalc 正在持續進化，<br className="md:hidden" />
                            未來將提供更完整的財務分析與個人化建議。
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-slate-400 text-sm">
                        <p>© 2025 TaiCalc. 計算結果僅供參考。</p>
                        <div className="flex space-x-6">
                            <Link href="/privacy" className="hover:text-blue-500 transition-colors">隱私權政策</Link>
                            <Link href="/terms" className="hover:text-blue-500 transition-colors">使用條款</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
