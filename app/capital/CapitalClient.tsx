'use client';

import React, { useState, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import {
    Home, Calculator, Percent, Calendar, DollarSign,
    TrendingUp, TrendingDown, AlertCircle, ChevronLeft, Download, Share2, Building,
    Target, RefreshCw, Flame, Wallet, Trophy, Info, ShieldCheck, PiggyBank
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { calculateCapitalGrowth, analyzeFinancialFreedom } from '@/lib/financials';
import AIInsightCard from '@/components/AI/AIInsightCard';
import { calculateFIRE, calculatePassiveIncome, calculateMilestones, calculateGoalReverse, QUICK_SCENARIOS } from '@/lib/calculations/capital';

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

    // FIRE 計算（假設月開銷 5 萬）
    const [monthlyExpense, setMonthlyExpense] = useState(50000);
    const fireResult = useMemo(() => {
        return calculateFIRE(monthlyExpense, initialCapital, monthlyContribution, annualReturnRate);
    }, [monthlyExpense, initialCapital, monthlyContribution, annualReturnRate]);

    // 被動收入計算
    const [targetPassiveIncome, setTargetPassiveIncome] = useState(30000);
    const passiveIncomeResult = useMemo(() => {
        return calculatePassiveIncome(targetPassiveIncome, 5);
    }, [targetPassiveIncome]);

    // 里程碑計算
    const milestones = useMemo(() => {
        return calculateMilestones(initialCapital, monthlyContribution, annualReturnRate);
    }, [initialCapital, monthlyContribution, annualReturnRate]);

    // 目標反推計算 (新增)
    const [goalTarget, setGoalTarget] = useState(10000000); // 目標 1000 萬
    const [goalYears, setGoalYears] = useState(10); // 預計 10 年
    const goalReverseResult = useMemo(() => {
        return calculateGoalReverse(goalTarget, goalYears, annualReturnRate, initialCapital);
    }, [goalTarget, goalYears, annualReturnRate, initialCapital]);

    // 快速套用情境
    const applyScenario = (scenario: typeof QUICK_SCENARIOS[0]) => {
        setInitialCapital(scenario.initialCapital);
        setMonthlyContribution(scenario.monthlyContribution);
        setYears(scenario.years);
        setAnnualReturnRate(scenario.expectedReturn);
    };

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

    // 下載報表功能
    const handleDownload = () => {
        const lastYear = simulationData[simulationData.length - 1];
        const reportContent = `
TaiCalc 數策 - 資本增長模擬報表
==============================
生成時間: ${new Date().toLocaleString('zh-TW')}

【投資參數】
初始本金: ${formatCurrency(initialCapital)}
月定期投入: ${formatCurrency(monthlyContribution)}
預估年報酬率: ${annualReturnRate}%
通膨預估: ${inflationRate}%
投資期間: ${years} 年

【模擬結果 (第 ${years} 年)】
名目總資產: ${formatCurrency(lastYear.totalAssets)}
實質購買力: ${formatCurrency(lastYear.realAssets)}
累計投入本金: ${formatCurrency(lastYear.principal)}
投資報酬率: ${roi.toFixed(1)}%

【關鍵洞察】
通膨侵蝕: ${formatCurrency(lastYear.totalAssets - lastYear.realAssets)}
實質報酬率 (扣除通膨): ${(annualReturnRate - inflationRate).toFixed(1)}%

==============================
由 TaiCalc 數策 提供 | https://taicalc.com
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `資本增長報表_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-brand-background font-sans pb-32 overflow-x-hidden text-slate-900">
            {/* 極光背景 */}
            <div className="fixed inset-0 pointer-events-none -z-10 " />

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
                            onClick={handleDownload}
                            className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-all shadow-sm active:scale-95 print:hidden"
                            aria-label="下載報表"
                        >
                            <Download className="w-4 h-4" />
                            <span>下載報表</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左側：控制面板 */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* 快速情境按鈕 */}
                        <section className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-md">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">⚡ 快速情境</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {QUICK_SCENARIOS.map((scenario) => (
                                    <button
                                        key={scenario.name}
                                        onClick={() => applyScenario(scenario)}
                                        className="p-3 bg-slate-50 hover:bg-brand-primary/10 border border-slate-200 hover:border-brand-primary rounded-xl text-left transition-all group"
                                    >
                                        <div className="text-lg mb-1">{scenario.emoji}</div>
                                        <div className="text-sm font-bold text-slate-700 group-hover:text-brand-primary">{scenario.name}</div>
                                        <div className="text-xs text-slate-400">{scenario.description}</div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md backdrop-blur-md">
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
                            <div className="bg-gradient-to-br from-brand-primary to-blue-600 rounded-2xl p-8 shadow-lg text-white flex flex-col justify-between h-[200px] relative overflow-hidden">
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

                            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg shadow-slate-100 flex flex-col justify-between h-[200px] relative overflow-hidden">
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
                        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
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
                        <div className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md">
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

                        {/* 控制面板結束 */}
                    </div>

                    {/* 右側：顯示結果 */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* 主要亮點指標：FIRE 與 被動收入 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* FIRE 區塊 */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glass-card rounded-3xl p-8 bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                    <Flame className="w-20 h-20 text-brand-warning" />
                                </div>
                                <div className="flex items-center space-x-2 mb-6">
                                    <div className="w-8 h-8 bg-brand-warning/20 rounded-lg flex items-center justify-center">
                                        <Flame className="w-5 h-5 text-brand-warning" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800">🔥 FIRE 財務自由計算</h3>
                                    <div className="group/info relative cursor-help">
                                        <Info className="w-4 h-4 text-slate-400" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 group-hover/info:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl">
                                            <p className="font-bold mb-1">什麼是 FIRE？</p>
                                            根據「4% 法則」，只要存到年開銷的 25 倍，並將其投入平均年化 4% 的標的，您就能靠領出的本金與獲利過活一輩子。
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">每月開銷</div>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-xs text-slate-400">$</span>
                                            <input
                                                type="text" inputMode="numeric"
                                                className="w-full bg-transparent text-xl font-black text-slate-900 outline-none"
                                                value={formatCurrency(monthlyExpense)}
                                                onChange={(e) => setMonthlyExpense(parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">FIRE 目標金額</div>
                                        <div className="text-xl font-black text-brand-warning">${formatCurrency(fireResult.fireNumber)}</div>
                                        <div className="text-[9px] text-slate-400 mt-1">年開銷 × 25</div>
                                    </div>
                                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">距離 FIRE 還需</div>
                                        <div className="text-xl font-black text-slate-900">{fireResult.yearsToFIRE === Infinity ? '∞' : fireResult.yearsToFIRE} 年</div>
                                        <div className="text-[9px] text-brand-primary font-bold mt-1">進度 {fireResult.currentProgress.toFixed(1)}%</div>
                                    </div>
                                </div>
                                {/* 進度條 */}
                                <div className="mt-6 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${fireResult.currentProgress}%` }}
                                        className="h-full bg-brand-warning shadow-glow"
                                    />
                                </div>
                            </motion.div>

                            {/* 被動收入區塊 */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glass-card rounded-3xl p-8 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                    <Wallet className="w-20 h-20 text-emerald-600" />
                                </div>
                                <div className="flex items-center space-x-2 mb-6">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Wallet className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800">💰 被動收入試算</h3>
                                    <div className="group/info relative cursor-help">
                                        <Info className="w-4 h-4 text-slate-400" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 group-hover/info:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl">
                                            <p className="font-bold mb-1">如何增加被動收入？</p>
                                            輸入您理想的月領金額，系統會根據不同殖利率算出您需要的總本金。您可以將此視為「存股」或「房地產」的長期目標。
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-emerald-50">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">目標月被動收入</div>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-xs text-slate-400">$</span>
                                            <input
                                                type="text" inputMode="numeric"
                                                className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none"
                                                value={formatCurrency(targetPassiveIncome)}
                                                onChange={(e) => setTargetPassiveIncome(parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-emerald-50">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">所需本金 (5% 殖利率)</div>
                                        <div className="text-2xl font-black text-emerald-600">${formatCurrency(passiveIncomeResult.requiredCapital)}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between gap-1 overflow-x-auto pb-2">
                                    {[3, 4, 5, 6, 7].map((rate) => (
                                        <div key={rate} className={`flex-1 min-w-[60px] p-2 rounded-xl text-center border transition-colors ${rate === 5 ? 'bg-emerald-100 border-emerald-200' : 'bg-white border-slate-100'}`}>
                                            <div className="text-[9px] font-black text-slate-400 mb-1">{rate}%</div>
                                            <div className="text-[10px] font-black text-slate-700">${formatCurrency(Math.round(targetPassiveIncome * 12 / (rate / 100)))}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* 目標反推區塊 (New) - Full Width */}
                        <div className="w-full">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glass-card rounded-3xl p-8 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                    <Target className="w-20 h-20 text-indigo-600" />
                                </div>
                                <div className="flex items-center space-x-2 mb-6">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Target className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800">🎯 目標反推：圓夢計畫</h3>
                                    <div className="group/info relative cursor-help">
                                        <Info className="w-4 h-4 text-slate-400" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 group-hover/info:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl">
                                            <p className="font-bold mb-1">如何達成夢想？</p>
                                            輸入您想在幾年後存到的目標金額（例如買房頭期款、創業基金），系統會根據您的連結本金與投資報酬率，算出每個月需要投入多少。
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-indigo-50">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">我想在 N 年後</div>
                                        <div className="flex items-center space-x-1">
                                            <input
                                                type="number"
                                                className="w-full bg-transparent text-xl font-black text-slate-900 outline-none"
                                                value={goalYears}
                                                onChange={(e) => setGoalYears(Number(e.target.value) || 0)}
                                            />
                                            <span className="text-xs text-slate-400">年</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-indigo-50">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">存到目標金額</div>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-xs text-slate-400">$</span>
                                            <input
                                                type="text" inputMode="numeric"
                                                className="w-full bg-transparent text-xl font-black text-slate-900 outline-none"
                                                value={formatCurrency(goalTarget)}
                                                onChange={(e) => setGoalTarget(parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-indigo-600 rounded-2xl p-4 shadow-lg shadow-indigo-200 text-white">
                                        <div className="text-[10px] font-bold text-indigo-200 uppercase mb-1">每月需存</div>
                                        <div className="text-2xl font-black">${formatCurrency(goalReverseResult.monthlyInvestment)}</div>
                                    </div>
                                </div>
                                <div className="text-[11px] text-slate-500 text-center bg-indigo-50/50 rounded-lg p-2">
                                    * 以現有本金 <span className="font-bold">${formatCurrency(initialCapital)}</span> 與年報酬 <span className="font-bold">{annualReturnRate}%</span> 複利計算
                                </div>
                            </motion.div>
                        </div>

                        {/* 資產里程碑 */}
                        <section className="glass-card rounded-3xl p-8 bg-white border border-slate-200 shadow-lg">
                            <div className="flex items-center space-x-2 mb-8">
                                <Trophy className="w-6 h-6 text-brand-warning" />
                                <h3 className="text-xl font-black text-slate-900">🏆 資產里程碑</h3>
                                <span className="text-xs text-slate-400">（根據您的儲蓄與投報率推算達成年份）</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {milestones.map((ms) => {
                                    const isReached = ms.year === 0;
                                    return (
                                        <div key={ms.milestone} className={`relative p-5 rounded-2xl border-2 transition-all ${isReached ? 'border-brand-primary bg-brand-surface' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                                            {isReached && <div className="absolute -top-2 -right-2 bg-brand-primary text-white p-1 rounded-full shadow-lg"><ShieldCheck className="w-4 h-4" /></div>}
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg">{ms.milestone >= 10000000 ? '🏰' : ms.milestone >= 1000000 ? '🏠' : '🎯'}</div>
                                                <div className="text-sm font-black text-slate-900">{ms.label}</div>
                                            </div>
                                            <div className="text-2xl font-black text-slate-900">{isReached ? '已達成' : `第 ${ms.year} 年`}</div>
                                            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Achievement Target</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </div>

                {/* 延伸閱讀區塊 */}
                <section className="mt-12 glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">📚 延伸閱讀</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/mortgage" className="group p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                            <p className="font-bold text-slate-900 group-hover:text-brand-primary mb-1">房貸佈局計算器</p>
                            <p className="text-sm text-slate-500">先還房貸還是先投資？</p>
                        </Link>
                        <Link href="/tax" className="group p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                            <p className="font-bold text-slate-900 group-hover:text-brand-primary mb-1">稅務優化計算器</p>
                            <p className="text-sm text-slate-500">投資收益如何報稅</p>
                        </Link>
                        <Link href="/salary" className="group p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                            <p className="font-bold text-slate-900 group-hover:text-brand-primary mb-1">薪資戰略計算器</p>
                            <p className="text-sm text-slate-500">計算可投資餘額</p>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
