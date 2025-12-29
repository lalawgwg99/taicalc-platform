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
    Briefcase,
    DollarSign,
    Target
} from 'lucide-react';

export default function HomePage() {
    // 真實用戶情境 - 問題導向
    const scenarios = [
        {
            icon: <Briefcase className="w-5 h-5" />,
            category: '💼 職場決策',
            questions: [
                { text: '面試時該開多少薪水？', link: '/salary', params: '?scenario=negotiate' },
                { text: '要不要接受這個 offer？', link: '/salary', params: '?scenario=compare' },
                { text: '勞退自提 6% 划算嗎？', link: '/salary', params: '?scenario=pension' },
            ]
        },
        {
            icon: <Home className="w-5 h-5" />,
            category: '🏠 買房決策',
            questions: [
                { text: '我買得起多少錢的房子？', link: '/mortgage', params: '?scenario=affordability' },
                { text: '轉貸能省多少錢？', link: '/mortgage', params: '?scenario=refinance' },
                { text: '寬限期要選嗎？', link: '/mortgage', params: '?scenario=grace' },
            ]
        },
        {
            icon: <DollarSign className="w-5 h-5" />,
            category: '💰 理財規劃',
            questions: [
                { text: '存到 100 萬要多久？', link: '/capital', params: '?goal=1000000' },
                { text: '年終獎金怎麼投資最好？', link: '/tax', params: '?scenario=bonus' },
                { text: 'FIRE 財務自由需要多少錢？', link: '/capital', params: '?scenario=fire' },
            ]
        }
    ];

    return (
        <div className="min-h-screen font-sans overflow-x-hidden bg-gradient-to-b from-white to-slate-50">

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
                    <div className="flex items-center space-x-4">
                        <Link href="/calculators" className="hidden md:block text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors">
                            所有工具
                        </Link>
                        <Link href="/articles" className="hidden md:block text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors">
                            知識文章
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* ===== Hero Section ===== */}
                <section className="pt-16 pb-12 md:pt-20 md:pb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* H1 主標 - 直擊痛點 */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                            不知道該開多少薪水？<br />
                            買房還是租房？年終獎金怎麼規劃？
                        </h1>

                        {/* 副標 - 解決方案 */}
                        <p className="text-xl md:text-2xl text-blue-600 font-bold max-w-2xl mx-auto mb-4">
                            TaiCalc 幫你用 3 分鐘算清楚
                        </p>
                        <p className="text-base text-slate-500 max-w-xl mx-auto mb-10">
                            專為台灣人設計的財務計算工具，免註冊、免下載、結果清楚一看就懂
                        </p>
                    </motion.div>
                </section>

                {/* ===== 情境問題列表（核心價值）===== */}
                <section className="py-8 mb-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {scenarios.map((scenario, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all"
                            >
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                        {scenario.icon}
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900">{scenario.category}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {scenario.questions.map((q, qIdx) => (
                                        <li key={qIdx}>
                                            <Link
                                                href={`${q.link}${q.params}`}
                                                className="group flex items-start gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5 mt-0.5 flex-shrink-0 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                                <span className="text-sm font-medium leading-relaxed">{q.text}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ===== 信任區塊 ===== */}
                <section className="py-12 mb-8 text-center">
                    <div className="max-w-3xl mx-auto bg-slate-50 rounded-2xl p-8 border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">為什麼選擇 TaiCalc？</h2>
                        <div className="grid md:grid-cols-3 gap-6 text-left">
                            <div>
                                <div className="text-2xl mb-2">🇹🇼</div>
                                <h3 className="font-bold text-slate-900 mb-1">台灣在地</h3>
                                <p className="text-sm text-slate-600">依最新勞健保、稅務與房貸條件設計</p>
                            </div>
                            <div>
                                <div className="text-2xl mb-2">⚡</div>
                                <h3 className="font-bold text-slate-900 mb-1">3 分鐘解決</h3>
                                <p className="text-sm text-slate-600">打開就能算，不用 Excel 也不用註冊</p>
                            </div>
                            <div>
                                <div className="text-2xl mb-2">🎯</div>
                                <h3 className="font-bold text-slate-900 mb-1">結果清楚</h3>
                                <p className="text-sm text-slate-600">不只算數字，還告訴你差距在哪</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== 知識文章入口 ===== */}
                <section className="py-8 mb-12">
                    <Link
                        href="/articles"
                        className="block bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8 hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    📚 還在猶豫？先看看這些文章
                                </h3>
                                <p className="text-slate-600 text-sm">
                                    勞退自提怎麼選？ETF 該怎麼買？用白話文幫你解釋
                                </p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </section>

            </main>

            {/* ===== 頁尾 ===== */}
            <footer className="border-t border-slate-100 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                    <div className="text-center mb-6">
                        <p className="text-slate-400 text-sm">
                            TaiCalc 持續新增更多實用工具，幫助你做出更好的財務決策
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
