'use client';

import React, { useState, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Target,
    ChevronLeft,
    Info,
    RefreshCw,
    Download
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { calculateCapitalGrowth, analyzeFinancialFreedom } from '@/lib/financials';
import AIInsightCard from '@/components/AI/AIInsightCard';

export default function CapitalPage() {
    // --- 狀態管理 ---
    const [initialCapital, setInitialCapital] = useState(1000000); // 初始本金 100萬
    const [monthlyContribution, setMonthlyContribution] = useState(20000); // 月投入 2萬
    const [annualReturnRate, setAnnualReturnRate] = useState(7); // 年報酬 7% (S&P500 平均)
    const [inflationRate, setInflationRate] = useState(2.5); // 通膨率 2.5%
    const [years, setYears] = useState(30); // 投資 30 年

    // --- 核心運算 (整合 lib/financials) ---
    const simulationData = useMemo(() => {
        return calculateCapitalGrowth({
            initialCapital,
            monthlyContribution,
            annualReturnRate,
            inflationRate,
            years
        });
    }, [initialCapital, monthlyContribution, annualReturnRate, inflationRate, years]);

    const finalResult = useMemo(() => {
        const lastYear = simulationData[simulationData.length - 1];
        return analyzeFinancialFreedom(lastYear);
    }, [simulationData]);

    const roi = useMemo(() => {
        const lastYear = simulationData[simulationData.length - 1];
        const totalInvested = lastYear.principal;
        const profit = lastYear.totalAssets - totalInvested;
        return (profit / totalInvested) * 100;
    }, [simulationData]);

    // 自定義 Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 ring-1 ring-black/5">
                    <p className="text-sm font-bold text-slate-500 mb-2">第 {label} 年 (Year {label})</p>
                    <div className="space-y-2">
                        <p className="text-sm flex items-center justify-between min-w-[180px]">
                            <span className="text-brand-primary font-bold">名目總資產</span>
                            <span className="font-mono font-black text-slate-900">${formatCurrency(payload[0].value)}</span>
                        </p>
                        <p className="text-xs flex items-center justify-between text-emerald-600">
                            <span className="font-bold">實質購買力 (Real)</span>
                            <span className="font-mono font-bold">${formatCurrency(payload[1].value)}</span>
                        </p>
                        <p className="text-xs flex items-center justify-between text-slate-400 border-t border-slate-100 pt-1 mt-1">
                            <span>累計投入本金</span>
                            <span className="font-mono">${formatCurrency(payload[2].value)}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-brand-background font-sans pb-32 overflow-x-hidden text-slate-900">
            {/* 極光背景 */}
            <div className="fixed inset-0 pointer-events-none -z-10 aurora-bg opacity-70" />

            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary shadow-lg border border-white/5 transition-transform group-hover:scale-110">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-slate-600 group-hover:text-brand-primary transition-colors">返回首頁</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black shadow-glow">T</div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">TaiCalc <span className="text-brand-primary">數策</span></span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">

                {/* Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-3 mb-3"
                        >
                            <div className="bg-brand-warning text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-amber-200">New</div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">資本決策模擬 <span className="text-brand-warning">PRO</span></h1>
                        </motion.div>
                        <p className="text-slate-500 font-medium max-w-2xl text-lg">
                            不僅看見複利的力量，更看清通膨的代價。為您的財務自由制定真實可行的時間表。
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-all shadow-sm active:scale-95 print:hidden"
                            aria-label="導出分析報告"
                        >
                            <Download className="w-4 h-4" />
                            <span>導出分析報告</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左側：控制面板 */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="glass-card rounded-[32px] p-8 bg-white/60 border border-white/40 shadow-xl shadow-slate-100/50 backdrop-blur-md">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-2 text-brand-primary">
                                    <Target className="w-5 h-5" />
                                    <h2 className="font-black uppercase tracking-widest text-sm text-slate-400">參數設定</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setInitialCapital(1000000); setMonthlyContribution(20000);
                                        setAnnualReturnRate(7); setInflationRate(2.5); setYears(30);
                                    }}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span className="sr-only">重置參數</span>
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* 初始本金 */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">初始本金</label>
                                        <span className="text-brand-primary font-black font-mono">${formatCurrency(initialCapital)}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="10000000" step="50000"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                        value={initialCapital}
                                        onChange={(e) => setInitialCapital(Number(e.target.value))}
                                        aria-label="調整初始本金"
                                    />
                                </div>

                                {/* 月投入 */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">每月定期定額</label>
                                        <span className="text-brand-primary font-black font-mono">${formatCurrency(monthlyContribution)}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="300000" step="1000"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                        value={monthlyContribution}
                                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                        aria-label="調整每月定期定額"
                                    />
                                </div>

                                {/* 年報酬率 */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">預期年化報酬率</label>
                                        <span className={`text-lg font-black font-mono ${annualReturnRate >= 10 ? 'text-brand-accent' : 'text-slate-700'}`}>{annualReturnRate}%</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="20" step="0.5"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                                        value={annualReturnRate}
                                        onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                                        aria-label="調整預期年化報酬率"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                                        <span>定存 (1.5%)</span>
                                        <span>ETF (7%)</span>
                                        <span>飆股 (15%+)</span>
                                    </div>
                                </div>

                                {/* 通膨率 */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">預估通膨率</label>
                                        <span className="text-red-500 font-black font-mono">{inflationRate}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="10" step="0.1"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                                        value={inflationRate}
                                        onChange={(e) => setInflationRate(Number(e.target.value))}
                                        aria-label="調整預估通膨率"
                                    />
                                    <div className="text-[10px] text-slate-400 mt-1 text-right">
                                        {inflationRate > 3 ? '😱 高通膨警報' : (inflationRate < 1 ? '🥶 緊縮風險' : '正常區間')}
                                    </div>
                                </div>

                                {/* 投資年期 */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">計畫年期</label>
                                        <span className="text-slate-900 font-black font-mono">{years} 年</span>
                                    </div>
                                    <input
                                        type="range" min="5" max="50" step="1"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                                        value={years}
                                        onChange={(e) => setYears(Number(e.target.value))}
                                        aria-label="調整計畫年期"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* 右側：儀表板 */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 核心指標卡片 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-brand-primary to-blue-600 rounded-[32px] p-8 shadow-2xl shadow-blue-500/30 text-white flex flex-col justify-between h-[200px] relative overflow-hidden">
                                <TrendingUp className="absolute right-4 top-4 text-white/10 w-32 h-32 -rotate-12" />
                                <div>
                                    <h3 className="text-xs font-black text-blue-100 uppercase tracking-widest mb-1">{years} 年後總資產 (名目)</h3>
                                    <div className="text-5xl font-black tracking-tight">${formatCurrency(finalResult.totalAssets)}</div>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2 text-sm font-bold bg-white/10 w-fit px-3 py-1.5 rounded-lg mb-2">
                                        <PiggyBank className="w-4 h-4" />
                                        <span>總投入本金 ${formatCurrency(simulationData[simulationData.length - 1].principal)}</span>
                                    </div>
                                    <div className="text-blue-100 text-xs font-bold">
                                        總報酬率 <span className="text-white text-lg ml-1">+{roi.toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-lg shadow-slate-100 flex flex-col justify-between h-[200px] relative overflow-hidden">
                                <TrendingDown className="absolute right-4 top-4 text-slate-100 w-32 h-32 rotate-12" />
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center">
                                        實質購買力 (Real Purchasing Power)
                                        <Info className="w-3 h-3 ml-1 text-slate-300" />
                                    </h3>
                                    <div className="text-4xl font-black tracking-tight text-slate-900">${formatCurrency(finalResult.realAssets)}</div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        經過 <span className="text-red-500 font-bold">{inflationRate}%</span> 通膨侵蝕後，您未來的 {formatCurrency(finalResult.totalAssets)} 元，
                                        僅相當於今天的 <span className="text-emerald-600 font-black">{formatCurrency(finalResult.realAssets)}</span> 元購買力。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 4% 法則 - 被動收入分析 */}
                        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                <div>
                                    <h3 className="text-xs font-black text-brand-accent uppercase tracking-widest mb-4">FIRE 財務自由指標 (4% Rule)</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">每月被動收入 (名目)</p>
                                            <div className="text-3xl font-black text-white">${formatCurrency(finalResult.monthlyPassiveIncome)} <span className="text-sm text-slate-500">/月</span></div>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">每月被動收入 (實質)</p>
                                            <div className="text-2xl font-black text-emerald-400">${formatCurrency(finalResult.realMonthlyPassiveIncome)} <span className="text-sm text-emerald-600/70">/月</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center border-l border-white/10 pl-8">
                                    <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                                        &quot;如果您的月開銷低於 <span className="text-emerald-400 font-bold">${formatCurrency(finalResult.realMonthlyPassiveIncome)}</span>，恭喜您，這個計畫能讓您在 {years} 年後達成財務自由，本金理論上永遠花不完。&quot;
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <div className="px-3 py-1 rounded bg-white/10 text-[10px] font-bold text-slate-300">提領率 4%</div>
                                        <div className="px-3 py-1 rounded bg-white/10 text-[10px] font-bold text-slate-300">本金永續</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI 智慧診斷區塊 */}
                        <div className="mb-6">
                            <AIInsightCard
                                title="AI 資本戰略顧問"
                                buttonText="點擊進行 AI 資產增長戰略分析"
                                prompt="你是 TaiCalc 首席資本戰略官。請分析這份複利增長模擬數據，並提供 3 個精確的戰略洞察。重點包括：1.目前的報酬率與通膨率之間的博弈。2.達成財務自由（FIRE）的可能性與時間表建議。3.針對資產配置或投入金額的優化建議。請直接切入重點，字數控制在 250 字內。"
                                context={{
                                    initialCapital,
                                    monthlyContribution,
                                    annualReturnRate,
                                    inflationRate,
                                    years,
                                    totalAssets: finalResult.totalAssets,
                                    realAssets: finalResult.realAssets,
                                    monthlyPassiveIncome: finalResult.monthlyPassiveIncome,
                                    realMonthlyPassiveIncome: finalResult.realMonthlyPassiveIncome,
                                    roi: roi
                                }}
                            />
                        </div>

                        {/* Chart */}
                        <div className="glass-card rounded-[32px] p-8 bg-white border border-slate-200 shadow-xl shadow-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">資產增長模擬圖</h3>
                                </div>
                                <div className="flex items-center space-x-4 text-[10px] font-bold">
                                    <div className="flex items-center"><div className="w-2 h-2 bg-brand-primary rounded-full mr-1.5" />名目資產</div>
                                    <div className="flex items-center"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5" />實質資產</div>
                                    <div className="flex items-center"><div className="w-2 h-2 bg-slate-300 rounded-full mr-1.5" />投入本金</div>
                                </div>
                            </div>

                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={simulationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="year"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                                            tickFormatter={(value) => `${value}y`}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                                            tickFormatter={(value) => `$${value / 10000}萬`}
                                            width={60}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} />

                                        <Area
                                            type="monotone"
                                            dataKey="totalAssets"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorAssets)"
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="realAssets"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            fillOpacity={1}
                                            fill="url(#colorReal)"
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="principal"
                                            stroke="#cbd5e1"
                                            strokeWidth={2}
                                            fill="transparent"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
