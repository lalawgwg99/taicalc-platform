'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calculator, TrendingUp, Home, PiggyBank, Sparkles, BookOpen } from 'lucide-react';

const features = [
    {
        icon: Calculator,
        title: '薪資計算',
        description: '精確計算勞健保、稅額',
        href: '/calculators',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: TrendingUp,
        title: '稅務試算',
        description: '2025 綜所稅快速估算',
        href: '/calculators',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: Home,
        title: '房貸計算',
        description: '月付金與利息分析',
        href: '/calculators',
        color: 'from-orange-500 to-amber-500',
    },
    {
        icon: PiggyBank,
        title: '複利成長',
        description: '投資未來價值計算',
        href: '/calculators',
        color: 'from-purple-500 to-pink-500',
    },
];

export default function HomePage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            AI 財務代理人上線
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                            台灣計算
                            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                                {' '}TaiCalc
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                            專為台灣設計的智慧理財工具。精準計算、AI 分析、助您做出更好的財務決策。
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/calculators"
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                開始計算
                            </Link>
                            <Link
                                href="/knowledge"
                                className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                            >
                                <BookOpen className="w-5 h-5" />
                                學習理財
                            </Link>
                            <button
                                onClick={() => {
                                    // 觸發 AI 聊天介面開啟
                                    const event = new CustomEvent('openAIChat');
                                    window.dispatchEvent(event);
                                }}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                詢問 AI 顧問
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
                        核心計算工具
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Link
                                    href={feature.href}
                                    className="block p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        {feature.description}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-indigo-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        為什麼選擇 TaiCalc？
                    </h2>
                    <p className="text-slate-600 mb-8">
                        我們使用最新的 2025 年稅務法規與勞健保費率，結合 AI 技術提供個人化建議。
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            2025 最新法規
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            AI 即時分析
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            完全免費
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
