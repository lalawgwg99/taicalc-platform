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
            title: '薪資試算器',
            description: '精確計算實領薪資、勞健保費用與年度個人所得稅。',
            icon: <Calculator className="w-6 h-6" />,
            link: '/salary',
            color: 'bg-blue-500',
            tag: '最熱門',
            status: 'hot'
        },
        {
            title: '房貸試算器',
            description: '多種還款方式（本息、本金）對比，幫您算好每月負擔。',
            icon: <Home className="w-6 h-6" />,
            link: '#',
            color: 'bg-emerald-500',
            tag: '即將推出',
            status: 'pending'
        },
        {
            title: '所得稅計算器',
            description: '針對 2025 所得稅新制優化，含扶養與列舉扣除額試算。',
            icon: <PieChart className="w-6 h-6" />,
            link: '#',
            color: 'bg-purple-500',
            tag: '即將推出',
            status: 'pending'
        },
        {
            title: '投資回報計算',
            description: '複利、定期定額與通膨調整，制定長期的財務計畫。',
            icon: <TrendingUp className="w-6 h-6" />,
            link: '#',
            color: 'bg-orange-500',
            tag: '即將推出',
            status: 'pending'
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
            {/* 炫麗背景裝飾 */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-purple-400/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-emerald-400/10 blur-[120px] rounded-full" />
            </div>

            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <span className="font-bold text-xl">T</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-800">
                            TaiCalc <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">台算</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
                        <Link href="/salary" className="hover:text-blue-600 transition-colors">薪資計算</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">房貸試算</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">財務工具</Link>
                        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md active:scale-95">
                            開始試算
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
                        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 border border-blue-100 shadow-sm">
                            <Zap className="w-4 h-4 fill-current" />
                            <span>2025 台灣在地化法規已更新</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                            把錢算清楚<br />
                            <span className="text-blue-600">再做精準的決定</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10">
                            台灣在地化的財務決策工具箱。從薪資、稅務到房貸投資，<br className="hidden md:block" />
                            我們用最直覺的視覺化圖表，幫您看清每一分錢的流向。
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                            <Link href="/salary" className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center group">
                                立即試算薪資
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="w-full md:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm">
                                瞭解更多功能
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* 核心功能網格 */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group relative bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer"
                        >
                            <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                {tool.icon}
                            </div>
                            <div className="mb-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tool.status === 'hot' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {tool.tag}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                                {tool.description}
                            </p>
                            <Link
                                href={tool.link}
                                className={`flex items-center text-sm font-bold ${tool.status === 'hot' ? 'text-blue-600' : 'text-slate-400 cursor-not-allowed'}`}
                            >
                                <span>進入試算</span>
                                <ChevronRight className="ml-1 w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </section>

                {/* 優勢區塊 */}
                <section className="bg-slate-900 rounded-[40px] p-8 md:p-16 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                                為什麼選擇 <span className="text-blue-400">TaiCalc</span>？
                            </h2>
                            <div className="space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="text-blue-400 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">極致在地化</h4>
                                        <p className="text-slate-400 font-medium">100% 符合台灣現行勞基法、所得稅新制與勞健保費率級距。</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="text-blue-400 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">隱私第一</h4>
                                        <p className="text-slate-400 font-medium">所有計算均在瀏覽器端完成，我們絕不儲存、也不上傳您的財務敏感資訊。</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="text-blue-400 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">視覺化分析</h4>
                                        <p className="text-slate-400 font-medium">不只給您數字，更用專業圖表告訴您這筆錢背後的機會與風險。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl rounded-[32px] p-8 border border-white/10 shadow-2xl relative">
                            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                            <div className="relative z-10">
                                <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl text-slate-500 font-bold">
                                    [ 專業圖表演示區域 ]
                                </div>
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-4 rounded-2xl">
                                        <p className="text-xs text-slate-400 mb-1 font-bold uppercase">準確率</p>
                                        <p className="text-2xl font-black tracking-tight">99.9%</p>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-2xl">
                                        <p className="text-xs text-slate-400 mb-1 font-bold uppercase">使用次數</p>
                                        <p className="text-2xl font-black tracking-tight">24k+</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-slate-500 text-sm font-medium">
                    <p>© 2025 TaiCalc 台算. 所有計算結果僅供參考，實際金額應以政府公告為準。</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-blue-600 transition-colors">隱私權政策</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">聯絡我們</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
