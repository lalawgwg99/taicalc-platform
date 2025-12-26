'use client';

import { useState, useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import {
    Info, Calculator, TrendingUp, ShieldCheck,
    Download, Share2, ChevronLeft, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { analyzeSalary } from '@/lib/calculations';

export default function SalaryCalculatorPage() {
    const [inputSalary, setInputSalary] = useState(50000);
    const [bonusMonths, setBonusMonths] = useState(2);

    const results = useMemo(() => analyzeSalary(inputSalary, bonusMonths), [inputSalary, bonusMonths]);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-32">
            {/* 炫麗背景裝飾 */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 blur-[120px] rounded-full" />
            </div>

            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-800">返回首頁</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">T</div>
                        <span className="text-lg font-bold">TaiCalc <span className="text-blue-600">薪資試算</span></span>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">薪資試算器</h1>
                        <p className="text-lg text-slate-500 font-medium">輸入您的月薪與獎金，剩下的交給我們精確計算。</p>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左側：輸入區域 */}
                    <div className="lg:col-span-5 space-y-6">
                        <section className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 p-8">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <Calculator className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">設定您的待遇</h2>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">每月月薪 (TWD)</label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">$</span>
                                        <input
                                            type="number"
                                            className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-xl font-black"
                                            value={inputSalary}
                                            onChange={(e) => setInputSalary(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-4 px-1">
                                        <label className="text-sm font-bold text-slate-700">年終與獎金 (月數)</label>
                                        <span className="text-lg font-black text-blue-600 px-3 py-1 bg-blue-50 rounded-lg">{bonusMonths} 個月</span>
                                    </div>
                                    <div className="px-1">
                                        <input
                                            type="range"
                                            min="0" max="12" step="0.5"
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            value={bonusMonths}
                                            onChange={(e) => setBonusMonths(Number(e.target.value))}
                                        />
                                        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>0 個月</span>
                                            <span>12 個月</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start space-x-4">
                                <Info className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                                    本工具採用 2024-2025 年度台灣最新所得稅率與勞健保費率。
                                    我們不會上傳任何財務數據。
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* 右側：結果與圖表 */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* 核心數據卡片 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 p-8"
                            >
                                <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">每月到手薪資</p>
                                <h3 className="text-4xl font-black text-slate-900 flex items-baseline leading-none mb-4">
                                    <span className="text-lg font-medium mr-1.5 text-slate-400">$</span>
                                    {formatCurrency(results.monthly.takeHome)}
                                </h3>
                                <div className="inline-flex items-center text-xs text-emerald-600 font-black bg-emerald-50 px-3 py-1.5 rounded-full">
                                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                                    已扣除強制作支出
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 p-8"
                            >
                                <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">年度預估所得稅</p>
                                <h3 className="text-4xl font-black text-rose-600 flex items-baseline leading-none mb-4">
                                    <span className="text-lg font-medium mr-1.5 text-slate-400">$</span>
                                    {formatCurrency(results.annual.tax)}
                                </h3>
                                <div className="inline-flex items-center text-xs text-rose-600 font-black bg-rose-50 px-3 py-1.5 rounded-full">
                                    <TrendingUp className="w-3.5 h-3.5 mr-1" />
                                    稅率級距: {results.effectiveTaxRate.toFixed(1)}%
                                </div>
                            </motion.div>
                        </div>

                        {/* 圖表分析區 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 p-8"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <PieChart className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold font-sans">年度薪資分配</h2>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                                <div className="md:col-span-5 h-[280px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={results.chartData}
                                                cx="50%" cy="50%"
                                                innerRadius={75}
                                                outerRadius={100}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {results.chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">實領薪資</span>
                                        <span className="text-2xl font-black text-blue-600">{Math.round((results.annual.net / results.annual.gross) * 100)}%</span>
                                    </div>
                                </div>

                                <div className="md:col-span-7 space-y-5">
                                    {results.chartData.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between group p-3 hover:bg-slate-50 rounded-2xl transition-all">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                                                <span className="text-md font-bold text-slate-600">{item.name}</span>
                                            </div>
                                            <span className="text-lg font-black text-slate-900">
                                                ${formatCurrency(item.value)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between px-3">
                                        <span className="text-md font-black text-slate-900">年度總額 (應領)</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-indigo-600 tracking-tight">${formatCurrency(results.annual.gross)}</span>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">含獎金合計 {12 + bonusMonths} 個月</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 詳細表單 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-slate-900 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
                            <h2 className="text-xl font-bold text-white mb-6 relative z-10">預估支出細目</h2>
                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-orange-400" /></div>
                                        <span className="text-slate-400 font-bold">每勞保支出</span>
                                    </div>
                                    <span className="text-lg font-black text-white">${formatCurrency(results.monthly.labor)}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-emerald-400" /></div>
                                        <span className="text-slate-400 font-bold">每健保支出</span>
                                    </div>
                                    <span className="text-lg font-black text-white">${formatCurrency(results.monthly.health)}</span>
                                </div>
                                <div className="flex justify-between items-center py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-blue-400" /></div>
                                        <span className="text-slate-400 font-bold">雇主負擔勞退 (6%)</span>
                                    </div>
                                    <span className="text-lg font-black text-blue-400">${formatCurrency(results.monthly.pension)}</span>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* FAQ Section */}
                <section className="mt-24 bg-white rounded-[40px] shadow-sm border border-slate-200/60 p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
                        <Calculator className="w-64 h-64 text-slate-900" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-12 flex items-center">
                        <span className="w-1.5 h-8 bg-blue-600 rounded-full mr-4" />
                        常見問題解答
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <h4 className="text-lg font-extrabold text-blue-600 uppercase tracking-tight">Q. 實領薪資誤差？</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                主要源於「投保薪資分級」。本工具以費率計算（勞 20% / 健 30%），與根據投保級距表查出的數值可能會有數十元的微小差異。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-lg font-extrabold text-blue-600 uppercase tracking-tight">Q. 所得稅如何計算？</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                我們自動扣除 2024-2025 年度基本的免稅額 ($97,000)、標準扣除額 ($131,000) 及薪資特別扣除額 ($218,000) 後，再進行級距試算。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-lg font-extrabold text-blue-600 uppercase tracking-tight">Q. 獎金需要扣稅嗎？</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                單次獎金若超過 $88,501（2024標準），公司會預扣 5% 所得稅。本工具展示的是併入年度總所得後的應納稅額評估。
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* 底部按鈕 */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-200 p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
                <div className="max-w-6xl mx-auto flex gap-4 md:gap-8">
                    <button className="flex-1 bg-slate-900 text-white h-16 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200 group">
                        <Download className="w-5 h-5" />
                        <span>下載分析報告</span>
                    </button>
                    <button className="w-16 h-16 md:w-auto md:px-8 bg-blue-50 text-blue-600 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 hover:bg-blue-100 transition-all active:scale-95 border border-blue-100 group">
                        <Share2 className="w-6 h-6" />
                        <span className="hidden md:inline">分享結果</span>
                    </button>
                </div>
            </footer>
        </div>
    );
}
