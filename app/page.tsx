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
    CheckCircle2,
    ShieldCheck,
    Zap,
    ArrowRight
} from 'lucide-react';

export default function HomePage() {
    const tools = [
        {
            title: '薪資戰略系統',
            description: '導入2025勞健保大數據，含 AI 談薪與稅務偵測雷達。',
            icon: <Calculator className="w-6 h-6" />,
            link: '/salary',
            color: 'bg-brand-primary',
            tag: 'AI 智慧型',
            status: 'hot',
            impact: '幫你算出實拿多少'
        },
        {
            title: '房貸佈局',
            description: '多情境還款壓力測試，AI 協助精算寬限期與置產戰略。',
            icon: <Home className="w-6 h-6" />,
            link: '/mortgage',
            color: 'bg-brand-success',
            tag: 'AI 診斷',
            status: 'hot',
            impact: '避免多付 50 萬利息'
        },
        {
            title: '稅務優化',
            description: '2025 新制法規模型，AI 自動尋找最佳節稅佈局路徑。',
            icon: <PieChart className="w-6 h-6" />,
            link: '/tax',
            color: 'bg-brand-accent',
            tag: 'AI 賦能',
            status: 'hot',
            impact: '每年多省 3-8 萬稅金'
        },
        {
            title: '退休規劃',
            description: '複利計算 + 勞退新制試算，幫你算出退休需要多少錢。',
            icon: <TrendingUp className="w-6 h-6" />,
            link: '/retirement',
            color: 'bg-brand-warning',
            tag: 'AI 智慧型',
            status: 'hot',
            impact: '30 年多存 200 萬'
        },
    ];

    return (
        <div className="min-h-screen font-sans overflow-x-hidden">

            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 border border-blue-100">
                            <span className="font-bold text-xl">T</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">
                            TaiCalc <span className="text-brand-primary">數策</span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-8">
                        {/* 手機也顯示的快速連結 */}
                        <Link href="/articles" className="text-xs md:text-sm font-bold text-slate-600 hover:text-brand-primary transition-colors whitespace-nowrap">
                            知識庫
                        </Link>
                        <Link href="/fortune" className="text-xs md:text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors whitespace-nowrap">
                            財運
                        </Link>
                        <Link href="/salary" className="bg-slate-900 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 font-bold text-xs md:text-sm active:scale-95 whitespace-nowrap">
                            開始試算
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
                {/* Hero Section */}
                <section className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-sm font-bold mb-8 border border-amber-200 shadow-sm">
                            <Zap className="w-4 h-4 fill-current" />
                            <span>真實案例：幫用戶多留下 127 萬</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                            同一份薪資，<br />
                            <span className="text-brand-primary">不同決策</span>
                        </h1>
                        <p className="text-4xl md:text-5xl font-black text-slate-900 mb-8">
                            5 年後差距超過 <span className="text-rose-500">100 萬</span>
                        </p>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10">
                            不是幫你算錢，而是告訴你<span className="font-black text-slate-900">哪個選擇會留下最多錢</span>。<br className="hidden md:block" />
                            AI 幫你找出每個財務決策中「看不見的成本」與「隱藏的機會」。
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                            <Link href="/salary" className="w-full md:w-auto bg-gradient-to-r from-brand-primary to-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-blue-300/50 transition-all shadow-lg shadow-blue-200 flex items-center justify-center group">
                                免費試算我的財務策略
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* 真實案例展示 */}
                        <div className="mt-16 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 text-left">
                                <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">案例 A</div>
                                <div className="text-2xl font-black text-slate-900 mb-2">勞退自提 6%</div>
                                <div className="text-sm text-slate-600">30 年累積多存 <span className="font-black text-emerald-600">227 萬</span></div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-left">
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">案例 B</div>
                                <div className="text-2xl font-black text-slate-900 mb-2">房貸寬限期</div>
                                <div className="text-sm text-slate-600">選錯方案多付利息 <span className="font-black text-blue-600">68 萬</span></div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-left">
                                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">案例 C</div>
                                <div className="text-2xl font-black text-slate-900 mb-2">綜所稅申報</div>
                                <div className="text-sm text-slate-600">扣除額優化省稅 <span className="font-black text-amber-600">4.8 萬/年</span></div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* 核心功能網格 */}
                <section id="tools" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 scroll-mt-24">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group relative glass-card p-10 rounded-2xl hover:border-brand-primary/30 transition-all cursor-pointer"
                        >
                            <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform`}>
                                {tool.icon}
                            </div>
                            <div className="mb-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tool.status === 'hot' ? 'bg-blue-50 text-brand-primary' : 'bg-slate-100 text-slate-500'}`}>
                                    {tool.tag}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-brand-primary transition-colors">{tool.title}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                                {tool.description}
                            </p>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6">
                                <div className="text-xs text-slate-500 mb-1">💰 實際價值</div>
                                <div className="text-sm font-black text-slate-900">{tool.impact}</div>
                            </div>
                            <Link
                                href={tool.link}
                                className={`flex items-center text-sm font-bold ${tool.status === 'hot' ? 'text-brand-primary' : 'text-slate-400 cursor-not-allowed'}`}
                            >
                                <span>立即試算</span>
                                <ChevronRight className="ml-1 w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </section>

                {/* 優勢區塊 */}
                <section className="glass-card rounded-2xl p-10 md:p-20 border border-slate-200 relative overflow-hidden shadow-card">
                    <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight text-slate-900">
                                為什麼選擇 <span className="text-brand-primary">數策</span>？
                            </h2>
                            <div className="space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                                        <CheckCircle2 className="text-brand-success w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-slate-900">決策級精準度</h4>
                                        <p className="text-slate-500 font-medium">100% 同步 2024 勞健保分級表與稅務新制，誤差值趨近於零。</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                                        <ShieldCheck className="text-brand-primary w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-slate-900">隱私防護盾</h4>
                                        <p className="text-slate-500 font-medium">採用本地端運算架構 (Local-First)，您的財務戰略數據絕不外流。</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                                        <TrendingUp className="text-brand-accent w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-slate-900">戰略視覺化</h4>
                                        <p className="text-slate-500 font-medium">不僅是報表，而是戰情室。用動態圖表呈現資金流動與增長關鍵點。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* 知識庫快速入口 */}
                            <Link href="/articles" className="block glass-card bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                        📚
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h4 className="text-lg font-black text-emerald-900 mb-2">理財知識庫</h4>
                                <p className="text-sm text-emerald-700 font-medium mb-4">
                                    勞退自提、ETF 投資、保險規劃...專業文章讓你秒懂財務策略。
                                </p>
                                <div className="flex items-center text-xs font-bold text-emerald-600">
                                    <span>立即閱讀</span>
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                </div>
                            </Link>

                            {/* 財運命盤快速入口 */}
                            <Link href="/fortune" className="block glass-card bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                                        🔮
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h4 className="text-lg font-black text-purple-900 mb-2">財運命盤</h4>
                                <p className="text-sm text-purple-700 font-medium mb-4">
                                    輸入生辰，AI 分析你的財富潛力與投資風格，找出最適合的理財路徑。
                                </p>
                                <div className="flex items-center text-xs font-bold text-purple-600">
                                    <span>免費測算</span>
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-slate-400 text-sm font-medium">
                    <p>© 2025 數策 NumStrat. 戰略數據僅供決策參考，實際法規以政府公告為準。</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-brand-primary transition-colors">隱私戰略</a>
                        <a href="#" className="hover:text-brand-primary transition-colors">聯絡顧問</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
