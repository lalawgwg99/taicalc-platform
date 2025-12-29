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
    Zap,
    ArrowRight,
    Smartphone,
    Target,
    Lock,
    Percent,
    Clock,
    Wallet,
    Scale,
    Bookmark
} from 'lucide-react';

export default function HomePage() {
    // 熱門計算工具（SEO + 點擊優化）
    const tools = [
        {
            title: '薪資計算器',
            description: '這個薪資計算器可幫你快速算出實領金額，適合面試談薪、年度報稅與勞健保規劃使用。',
            icon: <Calculator className="w-6 h-6" />,
            link: '/salary',
            color: 'bg-blue-500',
            scenario: '想知道扣完勞健保實拿多少',
            category: '💰 金額計算'
        },
        {
            title: '房貸計算器',
            description: '這個房貸計算器可幫你快速算出月付金額，適合買房評估、轉貸比較與還款規劃使用。',
            icon: <Home className="w-6 h-6" />,
            link: '/mortgage',
            color: 'bg-emerald-500',
            scenario: '想知道每月要繳多少房貸',
            category: '🏠 房貸試算'
        },
        {
            title: '所得稅計算器',
            description: '這個所得稅計算器可幫你快速算出應繳稅額，適合年度報稅、節稅規劃與扣除額試算使用。',
            icon: <PieChart className="w-6 h-6" />,
            link: '/tax',
            color: 'bg-violet-500',
            scenario: '想知道今年要繳多少稅',
            category: '📊 稅務試算'
        },
        {
            title: '退休金計算器',
            description: '這個退休金計算器可幫你快速算出退休缺口，適合勞退自提、國民年金與長期規劃使用。',
            icon: <TrendingUp className="w-6 h-6" />,
            link: '/retirement',
            color: 'bg-amber-500',
            scenario: '想知道退休需要存多少',
            category: '📈 退休規劃'
        },
    ];

    // 更多工具類別（SEO 長尾）
    const moreCategories = [
        { icon: <Percent className="w-5 h-5" />, title: '百分比 / 折扣計算', desc: '折扣、成長率、比例換算', link: '/calculators', soon: true },
        { icon: <Wallet className="w-5 h-5" />, title: '成本 / 利潤計算', desc: '報價、毛利、損益分析', link: '/calculators', soon: true },
        { icon: <Clock className="w-5 h-5" />, title: '工時 / 時間計算', desc: '加班費、時薪、工期換算', link: '/calculators', soon: true },
        { icon: <Scale className="w-5 h-5" />, title: '單位 / 數值轉換', desc: '長度、重量、面積換算', link: '/calculators', soon: true },
    ];

    return (
        <div className="min-h-screen font-sans overflow-x-hidden bg-gradient-to-b from-slate-50 to-white">

            {/* 導航列 */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <span className="font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900">
                            TaiCalc
                        </span>
                    </Link>
                    <div className="flex items-center space-x-3 md:space-x-6">
                        <Link href="/articles" className="hidden md:block text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors">
                            知識庫
                        </Link>
                        <Link href="/calculators" className="text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors">
                            所有工具
                        </Link>
                        <Link href="/salary" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all shadow-md font-medium text-sm">
                            立即試算
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* ===== Hero Section: 3秒懂你在幹嘛 ===== */}
                <section className="pt-12 pb-16 md:pt-20 md:pb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* H1 主標 */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                            TaiCalc｜快速、免費的<br className="md:hidden" />
                            <span className="text-blue-500">實用計算工具平台</span>
                        </h1>

                        {/* 副標：一句話說清楚 */}
                        <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-8">
                            幫你用最少時間，算清楚生活、工作與財務中的關鍵數字。
                        </p>

                        {/* CTA 按鈕 */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
                            <Link href="/salary" className="w-full sm:w-auto bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 flex items-center justify-center group">
                                👉 立即使用計算工具
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        alert('請按 Ctrl+D (Mac: Cmd+D) 加入書籤！');
                                    }
                                }}
                                className="w-full sm:w-auto border-2 border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center"
                            >
                                <Bookmark className="mr-2 w-5 h-5" />
                                加入書籤，下次更快算
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* ===== 使用者痛點段：留住人 ===== */}
                <section className="py-12 mb-12">
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 text-center">
                            你是否也遇過這些情況？
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">✗</div>
                                <p className="text-slate-600">想算費用、金額、比例，卻找不到簡單好用的工具</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">✗</div>
                                <p className="text-slate-600">Excel 太麻煩、App 又要下載註冊</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">✗</div>
                                <p className="text-slate-600">網站一堆廣告，看不到重點結果</p>
                            </div>
                        </div>
                        <p className="text-center text-xl font-black text-blue-500">
                            TaiCalc 為此而生。
                        </p>
                    </div>
                </section>

                {/* ===== 核心價值：為什麼選你 ===== */}
                <section className="py-12 mb-12">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center">
                        為什麼選擇 TaiCalc？
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">🚀 即開即算</h3>
                            <p className="text-slate-500 text-sm">不註冊、不下載，打開就能用</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">🎯 結果清楚</h3>
                            <p className="text-slate-500 text-sm">重點數字一眼就懂，不廢話</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                                <Smartphone className="w-6 h-6 text-violet-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">📱 手機友善</h3>
                            <p className="text-slate-500 text-sm">通勤、現場都能快速計算</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                                <Lock className="w-6 h-6 text-amber-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">🔒 不蒐集隱私</h3>
                            <p className="text-slate-500 text-sm">所有計算在你眼前完成</p>
                        </div>
                    </div>
                </section>

                {/* ===== 熱門計算工具（SEO + 點擊）===== */}
                <section id="tools" className="py-12 mb-12 scroll-mt-20">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 text-center">
                        熱門計算工具
                    </h2>
                    <p className="text-slate-500 text-center mb-8">
                        持續新增中，所有工具皆可免費使用
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {tools.map((tool, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                <Link href={tool.link} className="block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                            {tool.icon}
                                        </div>
                                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                            {tool.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-500 transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                                        {tool.description}
                                    </p>
                                    {/* 使用情境 - SEO 加分 */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
                                        <div className="text-xs font-medium text-blue-600 mb-1">📌 什麼情況會用到？</div>
                                        <div className="text-sm text-slate-700">{tool.scenario}</div>
                                    </div>
                                    <div className="flex items-center text-blue-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                        <span>立即試算</span>
                                        <ChevronRight className="ml-1 w-4 h-4" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* 更多工具類別預告 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-slate-900 mb-4 text-center">🔧 更多工具即將上線</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {moreCategories.map((cat, idx) => (
                                <div key={idx} className="flex items-center space-x-3 bg-white rounded-xl p-4 border border-slate-100">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900 text-sm">{cat.title}</div>
                                        <div className="text-xs text-slate-400">{cat.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== 信任感區塊 ===== */}
                <section className="py-12 mb-12">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
                            關於 TaiCalc
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
                            TaiCalc 由個人獨立開發與維護，<br className="hidden md:block" />
                            專注在「<span className="font-bold text-blue-600">實用</span>、<span className="font-bold text-blue-600">簡單</span>、<span className="font-bold text-blue-600">準確</span>」三件事。
                        </p>
                        <p className="text-slate-500 text-sm">
                            不追求花俏，只解決真正需要計算的問題。
                        </p>
                    </div>
                </section>

                {/* ===== 快速入口 ===== */}
                <section className="py-12 mb-12">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link href="/articles" className="block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl">
                                    📚
                                </div>
                                <ChevronRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">理財知識庫</h3>
                            <p className="text-sm text-slate-500">
                                勞退自提、ETF 投資、保險規劃...實用文章讓你快速了解理財知識。
                            </p>
                        </Link>

                        <Link href="/fortune" className="block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-purple-200 transition-all group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-2xl">
                                    🔮
                                </div>
                                <ChevronRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">財運命盤</h3>
                            <p className="text-sm text-slate-500">
                                輸入生辰，AI 分析你的財富潛力與投資風格。
                            </p>
                        </Link>
                    </div>
                </section>

            </main>

            {/* ===== 頁尾（為未來變現鋪路）===== */}
            <footer className="border-t border-slate-100 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                    <div className="text-center mb-8">
                        <p className="text-slate-600 mb-2">
                            TaiCalc 將持續擴充更多實用工具
                        </p>
                        <p className="text-slate-400 text-sm">
                            未來也會提供進階功能與專業版本
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-slate-400 text-sm">
                        <p>© 2025 TaiCalc. 計算結果僅供參考。</p>
                        <div className="flex space-x-6">
                            <Link href="/privacy" className="hover:text-blue-500 transition-colors">隱私權政策</Link>
                            <Link href="/terms" className="hover:text-blue-500 transition-colors">使用條款</Link>
                            <Link href="/developers" className="hover:text-blue-500 transition-colors">開發者</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
