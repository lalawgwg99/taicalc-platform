'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    Shield,
    Sliders,
    Layers,
    Lock
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function ProLandingPage() {
    // 模擬數據 - 視覺化用
    const data = [
        { year: '2025', scenarioA: 100, scenarioB: 100 },
        { year: '2026', scenarioA: 110, scenarioB: 105 },
        { year: '2027', scenarioA: 125, scenarioB: 112 },
        { year: '2028', scenarioA: 145, scenarioB: 120 },
        { year: '2029', scenarioA: 170, scenarioB: 130 },
        { year: '2030', scenarioA: 200, scenarioB: 145 },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 overflow-x-hidden font-sans">

            {/* 導航 */}
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                        <span className="font-bold text-lg">TaiCalc</span>
                        <span className="text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">PRO</span>
                    </Link>
                    <Link href="/salary" className="text-sm border border-slate-600 rounded-full px-4 py-1.5 hover:bg-slate-800 transition-all text-slate-300">
                        回到免費版
                    </Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">

                {/* Hero Section */}
                <section className="pt-20 pb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm font-bold mb-8">
                            TaiCalc Pro 個人財務戰情室
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
                            不只是計算金額，<br />
                            而是看清<span className="text-indigo-400">每個選擇的代價</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            將「如果當初這樣選」變成清楚可比較的結果。<br className="hidden md:block" />
                            無論是薪資談判、房貸選擇還是投資策略，不再靠直覺猜測。
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/pro/calculator" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center group">
                                💎 財務方案比較器
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/pro/mortgage" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center group">
                                🏠 房貸方案比較
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-slate-500">🎉 現在免費開放體驗所有 Pro 功能！</p>
                    </motion.div>
                </section>

                {/* 視覺化展示 */}
                <section className="mb-24">
                    <div className="glass-card bg-slate-800/50 border border-slate-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">把未來，變成一張看得懂的圖</h2>
                                <p className="text-slate-400 mb-8 text-lg">
                                    不是表格地獄，而是清楚呈現「差距正在拉開」的過程。一眼看出 5 年後資產會相差多少。
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-center space-x-3 text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        <span>視覺化長期複利效應</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        <span>多方案走勢同步比較</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        <span>關鍵轉折點自動標示</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="h-[300px] w-full bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                            labelStyle={{ color: '#94a3b8' }}
                                        />
                                        <Area type="monotone" dataKey="scenarioA" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorA)" name="Pro 策略 (A)" />
                                        <Area type="monotone" dataKey="scenarioB" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorB)" name="一般方案 (B)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 痛點共鳴 */}
                <section className="mb-24 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-10">你是不是也遇過這些情況？</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 font-bold text-xl">?</div>
                            <p className="text-slate-300">算得出數字，卻不知道該不該這樣選</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 font-bold text-xl">?</div>
                            <p className="text-slate-300">有兩三個方案，但沒辦法放在同一張表比較</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 font-bold text-xl">?</div>
                            <p className="text-slate-300">擔心現在省的錢，未來會不會付出更大代價</p>
                        </div>
                    </div>
                    <div className="mt-8 text-indigo-400 font-bold text-xl">
                        TaiCalc Pro，就是為這些時刻而生。
                    </div>
                </section>

                {/* 核心功能 */}
                <section className="mb-24">
                    <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Pro 版，不是幫你多算一點<br />而是幫你「選對」</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                            <Layers className="w-8 h-8 text-indigo-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">多方案比較</h3>
                            <p className="text-slate-400 text-sm">同一個問題，同時比較 A / B / C，一眼看出長期差距。</p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                            <TrendingUp className="w-8 h-8 text-emerald-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">長期影響模擬</h3>
                            <p className="text-slate-400 text-sm">把 1 年、5 年、10 年後的結果直接算給你看。</p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                            <CheckCircle2 className="w-8 h-8 text-amber-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">關鍵指標摘要</h3>
                            <p className="text-slate-400 text-sm">不用看一堆數字，直接告訴你哪個選擇「整體比較好」。</p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                            <Sliders className="w-8 h-8 text-purple-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">個人化參數設定</h3>
                            <p className="text-slate-400 text-sm">根據你的薪資、年齡、目標做調整，而不是用通用假設。</p>
                        </div>
                    </div>
                </section>

                {/* 信任區塊 */}
                <section className="mb-24 text-center">
                    <div className="inline-flex items-center space-x-2 bg-slate-800 px-6 py-3 rounded-full border border-slate-700">
                        <Shield className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-300 text-sm font-medium">採用台灣在地稅務與制度假設，邏輯透明，可自行調整。</span>
                    </div>
                </section>

                {/* 價格方案 */}
                <section className="mb-24 max-w-lg mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">什麼時候該升級？</h2>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-500 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl shadow-indigo-900/20">
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                            最適合你
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">單次解鎖</h3>
                        <div className="text-4xl font-black text-white mb-2">
                            NT$ 59 <span className="text-lg text-slate-500 font-normal">/ 次</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-8">
                            適合面對重大決策時 (買房、換工作)<br />一次算清楚
                        </p>

                        <ul className="text-left space-y-3 mb-8 max-w-xs mx-auto text-sm text-slate-300">
                            <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-indigo-400" /> 解鎖所有 Pro 進階圖表</li>
                            <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-indigo-400" /> 無限次多方案比較</li>
                            <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-indigo-400" /> 匯出完整分析報告</li>
                        </ul>

                        <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95">
                            👉 立即解鎖
                        </button>
                    </div>
                </section>

                {/* 底部 CTA */}
                <section className="text-center pb-12">
                    <h2 className="text-2xl font-bold mb-6">當你面臨選擇時，不用再只靠感覺。</h2>
                    <button className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center justify-center mx-auto group">
                        <span>解鎖 TaiCalc Pro</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </section>

            </main>
        </div>
    );
}
