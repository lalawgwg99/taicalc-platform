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
            status: 'hot'
        },
        {
            title: '房貸佈局',
            description: '多情境還款壓力測試，AI 協助精算寬限期與置產戰略。',
            icon: <Home className="w-6 h-6" />,
            link: '/mortgage',
            color: 'bg-brand-success',
            tag: 'AI 診斷',
            status: 'hot'
        },
        {
            title: '稅務優化',
            description: '2025 新制法規模型，AI 自動尋找最佳節稅佈局路徑。',
            icon: <PieChart className="w-6 h-6" />,
            link: '/tax',
            color: 'bg-brand-accent',
            tag: 'AI 賦能',
            status: 'hot'
        },
        {
            title: '資本決策',
            description: '複利、通膨與現金流預測，AI 生成專屬財富自由藍圖。',
            icon: <TrendingUp className="w-6 h-6" />,
            link: '/capital',
            color: 'bg-brand-warning',
            tag: 'AI 首席官',
            status: 'hot'
        },
    ];

    return (
        <div className="min-h-screen bg-brand-background text-brand-text-primary font-sans overflow-x-hidden">
            {/* 極光背景 */}
            <div className="fixed inset-0 pointer-events-none -z-10 aurora-bg opacity-70" />

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
                    <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
                        <Link href="/salary" className="hover:text-brand-primary transition-colors">薪資戰略</Link>
                        <Link href="/mortgage" className="hover:text-brand-primary transition-colors">房貸佈局</Link>
                        <Link href="/capital" className="hover:text-brand-primary transition-colors">資本決策</Link>
                        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 font-bold active:scale-95">
                            開始佈局
                        </button>
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
                        <div className="inline-flex items-center space-x-2 bg-blue-50 text-brand-primary px-4 py-1.5 rounded-full text-sm font-bold mb-8 border border-blue-100 shadow-sm">
                            <Zap className="w-4 h-4 fill-current" />
                            <span>2025 戰略模組已上線</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                            洞悉數字背後的<br />
                            <span className="text-brand-primary">戰略與機遇</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10">
                            從被動計算到主動佈局。數策 (TaiCalc) 整合大數據與法規模型，<br className="hidden md:block" />
                            為您的薪資談判、資產配置提供軍師級的決策建議。
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                            <Link href="/salary" className="w-full md:w-auto bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 flex items-center justify-center group">
                                開始試算
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#tools" className="w-full md:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm">
                                查看所有工具
                            </a>
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
                            className="group relative glass-card p-8 rounded-[32px] hover:border-brand-primary/30 transition-all cursor-pointer bg-white"
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
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                                {tool.description}
                            </p>
                            <Link
                                href={tool.link}
                                className={`flex items-center text-sm font-bold ${tool.status === 'hot' ? 'text-brand-primary' : 'text-slate-400 cursor-not-allowed'}`}
                            >
                                <span>進入系統</span>
                                <ChevronRight className="ml-1 w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </section>

                {/* 優勢區塊 */}
                <section className="glass-card rounded-[40px] p-8 md:p-16 border border-slate-200 relative overflow-hidden bg-white shadow-xl shadow-slate-100">
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

                        <div className="glass-card bg-slate-50 p-8 rounded-[32px] border border-slate-200 relative">
                            <div className="relative z-10">
                                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold bg-white/50">
                                    <span>[ 戰略圖表預覽 ]</span>
                                    <div className="flex space-x-2 mt-4">
                                        <div className="w-3 h-12 bg-brand-primary rounded-t-sm opacity-40"></div>
                                        <div className="w-3 h-20 bg-brand-primary rounded-t-sm opacity-60"></div>
                                        <div className="w-3 h-16 bg-brand-primary rounded-t-sm opacity-80"></div>
                                        <div className="w-3 h-24 bg-brand-primary rounded-t-sm"></div>
                                    </div>
                                </div>
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-xs text-slate-500 mb-1 font-bold uppercase">精算誤差</p>
                                        <p className="text-2xl font-black tracking-tight text-slate-900">0.00%</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-xs text-slate-500 mb-1 font-bold uppercase">決策參考</p>
                                        <p className="text-2xl font-black tracking-tight text-slate-900">Top 1%</p>
                                    </div>
                                </div>
                            </div>
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
