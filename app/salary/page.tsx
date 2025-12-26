'use client';

import { useState } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import {
    Info, Calculator, TrendingUp, ShieldCheck,
    Download, Share2
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { analyzeSalary } from '@/lib/calculations';

export default function SalaryCalculatorPage() {
    const [inputSalary, setInputSalary] = useState(50000);
    const [bonusMonths, setBonusMonths] = useState(2);

    const results = analyzeSalary(inputSalary, bonusMonths);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* 導航欄 */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                        <span className="text-xl font-bold text-slate-800">TaiCalc <span className="text-blue-600">台算</span></span>
                    </a>
                    <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
                        <a href="/salary" className="text-blue-600">薪資計算</a>
                        <a href="#" className="hover:text-blue-600">房貸試算</a>
                        <a href="#" className="hover:text-blue-600">投資回報</a>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">薪資試算器</h1>
                    <p className="mt-2 text-lg text-slate-600">輸入月薪，精確計算實領金額與各項稅務支出。</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左側：輸入區域 */}
                    <div className="lg:col-span-5 space-y-6">
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <Calculator className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-bold">基本設定</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">每月月薪 (TWD)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                        <input
                                            type="number"
                                            className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={inputSalary}
                                            onChange={(e) => setInputSalary(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-700">年終與獎金 (月數)</label>
                                        <span className="text-sm font-bold text-blue-600">{bonusMonths} 個月</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="12" step="0.5"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        value={bonusMonths}
                                        onChange={(e) => setBonusMonths(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start space-x-3">
                                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    本工具採用 2024 年度台灣現行所得稅率、勞保與健保費率計算。
                                    實際薪資受投保薪資分級、眷屬加保及專案扣款影響，結果僅供參考。
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* 右側：結果與圖表 */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* 核心數據卡片 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <p className="text-sm font-medium text-slate-500 mb-1">每月實領 (到手薪資)</p>
                                <h3 className="text-3xl font-black text-slate-900">
                                    <span className="text-sm font-normal mr-1">TWD</span>
                                    {formatCurrency(results.monthly.takeHome)}
                                </h3>
                                <div className="mt-4 flex items-center text-xs text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-1 rounded-md">
                                    <ShieldCheck className="w-3 h-3 mr-1" />
                                    扣除勞健保後
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <p className="text-sm font-medium text-slate-500 mb-1">年度預估總所得稅</p>
                                <h3 className="text-3xl font-black text-red-600">
                                    <span className="text-sm font-normal text-slate-900 mr-1">TWD</span>
                                    {formatCurrency(results.annual.tax)}
                                </h3>
                                <p className="mt-4 text-xs text-slate-500">
                                    預估有效稅率: {results.effectiveTaxRate.toFixed(1)}%
                                </p>
                            </div>
                        </div>

                        {/* 圖表分析區 */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-lg font-bold">年度薪資佔比分析</h2>
                                </div>
                                <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                <div className="md:col-span-5 h-[240px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={results.chartData}
                                                cx="50%" cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {results.chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="md:col-span-7 space-y-4">
                                    {results.chartData.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between group">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-sm font-medium text-slate-600">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                ${formatCurrency(item.value)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-900">年度總額 (Gross)</span>
                                        <span className="text-lg font-black text-blue-600">${formatCurrency(results.annual.gross)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 詳細表單 */}
                        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
                            <h2 className="text-lg font-bold mb-4">支出明細速覽</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm">每月勞保 (個人 20%)</span>
                                    <span className="font-mono">${formatCurrency(results.monthly.labor)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm">每月健保 (個人 30%)</span>
                                    <span className="font-mono">${formatCurrency(results.monthly.health)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm">雇主勞退提撥 (6%)</span>
                                    <span className="font-mono text-emerald-400">${formatCurrency(results.monthly.pension)}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* SEO 優化：FAQ 區塊 */}
                <section className="mt-16 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">常見問題 FAQ</h2>
                    <div className="space-y-6">
                        <FAQItem
                            question="為什麼我的實領薪資比月薪少這麼多？"
                            answer="實領薪資需扣除勞保、健保等社會保險費用。勞保個人負擔 20%，健保個人負擔 30%。這些費用是法定強制扣繳，用於保障您的退休與醫療權益。"
                        />
                        <FAQItem
                            question="年終獎金會影響所得稅嗎？"
                            answer="會的！年終獎金計入年度總所得，可能讓您跨入更高的稅率級距。本工具已將年終獎金納入計算，幫您預估實際稅負。"
                        />
                        <FAQItem
                            question="如何降低所得稅負擔？"
                            answer="可善用扣除額：標準扣除額 $131,000、薪資特別扣除額 $218,000、免稅額 $97,000。若有撫養親屬、購屋貸款利息、保險費等，可進一步減稅。"
                        />
                    </div>
                </section>
            </main>

            {/* 底部按鈕 */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
                <div className="max-w-6xl mx-auto flex gap-4">
                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>下載試算報告</span>
                    </button>
                    <button className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-200 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>分享結果</span>
                    </button>
                </div>
            </footer>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-bold text-slate-900 mb-2">{question}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{answer}</p>
        </div>
    );
}
