'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import {
    ChevronLeft, Download, RefreshCw, Flame, Wallet, Trophy, Info, PiggyBank, Target, TrendingUp, TrendingDown,
    ShieldCheck
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
    const [annualReturnRate, setAnnualReturnRate] = useState(7); // 年報酬 7%
    const [inflationRate, setInflationRate] = useState(2.5); // 通膨率 2.5%
    const [years, setYears] = useState(30); // 投資 30 年
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // --- 核心運算 ---
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

    // FIRE 計算
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

    // 目標反推計算
    const [goalTarget, setGoalTarget] = useState(10000000);
    const [goalYears, setGoalYears] = useState(10);
    const goalReverseResult = useMemo(() => {
        return calculateGoalReverse(goalTarget, goalYears, annualReturnRate, initialCapital);
    }, [goalTarget, goalYears, annualReturnRate, initialCapital]);

    // 捲動控制
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 150;
            scrollContainerRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // 自定義 Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/10 ring-1 ring-white/5 text-white">
                    <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">第 {label} 年預估</p>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-blue-400 font-bold text-sm">名目總資產</span>
                            <span className="font-mono font-black text-lg">${formatCurrency(payload[0].value)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-8 border-t border-white/5 pt-1">
                            <span className="text-emerald-400 font-bold text-xs">實質購買力</span>
                            <span className="font-mono font-bold text-sm text-emerald-100">${formatCurrency(payload[1].value)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-8 border-t border-white/5 pt-1">
                            <span className="text-slate-500 font-bold text-[10px]">累計投入本金</span>
                            <span className="font-mono text-[10px] text-slate-400">${formatCurrency(payload[2].value)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const handleDownload = () => {
        const lastYear = simulationData[simulationData.length - 1];
        const reportContent = `
TaiCalc 數策 - 資本決策模擬報表
==============================
生成時間: ${new Date().toLocaleString('zh-TW')}

【投資參數】
初始本金: ${formatCurrency(initialCapital)}
月定期投入: ${formatCurrency(monthlyContribution)}
預估年報酬率: ${annualReturnRate}%
通膨預估: ${inflationRate}%
投資期間: ${years} 年

【核心結果】
名目總資產: ${formatCurrency(lastYear.totalAssets)}
實質購買力: ${formatCurrency(lastYear.realAssets)}
總投資報酬率: ${roi.toFixed(1)}% FIRE 完成度: ${fireResult.currentProgress.toFixed(1)}%

==============================
由 TaiCalc 數策 提供 | 專業金融模擬系統`.trim();

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
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32 selection:bg-brand-primary/10">
            {/* 導航欄 */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group transition-all">
                        <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 shadow-sm group-hover:border-brand-primary group-hover:text-brand-primary transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-slate-600 group-hover:text-brand-primary">首頁</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black text-xs shadow-glow">T</div>
                        <span className="font-black text-slate-900 tracking-tighter">TaiCalc <span className="text-brand-primary">數策</span></span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {/* 標題與操作區 */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3 text-[10px] font-black tracking-[0.2em] text-brand-primary uppercase">
                            <span className="bg-brand-primary/10 px-2 py-0.5 rounded">Professional Edition</span>
                            <span>v2.4.0 Stable</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            資本決策模擬 <span className="text-brand-primary font-outline">CAPITAL</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-xl">
                            根據歷史數據與複利公式，為您的資產增長建立多維度的模擬體系。
                        </p>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-brand-primary transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        <span>導出專業分析報表</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* 左側：控制面板 (占 4 欄) */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* 快速切換預設值 */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">⚡ 快速導航情境</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {QUICK_SCENARIOS.map((scenario) => (
                                    <button
                                        key={scenario.name}
                                        onClick={() => {
                                            setInitialCapital(scenario.initialCapital);
                                            setMonthlyContribution(scenario.monthlyContribution);
                                            setYears(scenario.years);
                                            setAnnualReturnRate(scenario.expectedReturn);
                                        }}
                                        className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-brand-primary group transition-all"
                                    >
                                        <div className="text-xl mb-1">{scenario.emoji}</div>
                                        <div className="text-xs font-black text-slate-700 group-hover:text-brand-primary">{scenario.name}</div>
                                        <div className="text-[10px] text-slate-400 truncate">{scenario.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 參數滑塊區 */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">核心模型參數</span>
                                <button
                                    onClick={() => {
                                        setInitialCapital(1000000); setMonthlyContribution(20000);
                                        setAnnualReturnRate(7); setInflationRate(2.5); setYears(30);
                                    }}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-brand-primary transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>

                            {[
                                { label: '初始投入本金', value: initialCapital, min: 0, max: 10000000, step: 50000, setter: setInitialCapital, unit: '$' },
                                { label: '月定期定額', value: monthlyContribution, min: 0, max: 300000, step: 1000, setter: setMonthlyContribution, unit: '$' },
                                { label: '預期年化報酬', value: annualReturnRate, min: 1, max: 20, step: 0.5, setter: setAnnualReturnRate, unit: '%' },
                                { label: '預估通膨率', value: inflationRate, min: 0, max: 10, step: 0.1, setter: setInflationRate, unit: '%' },
                                { label: '預計計畫年期', value: years, min: 5, max: 50, step: 1, setter: setYears, unit: '年' },
                            ].map((param) => (
                                <div key={param.label} className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <label className="text-xs font-black text-slate-500 uppercase">{param.label}</label>
                                        <span className="text-lg font-mono font-black text-slate-900">
                                            {param.unit === '$' ? `$${formatCurrency(param.value)}` : `${param.value}${param.unit}`}
                                        </span>
                                    </div>
                                    <input
                                        type="range" min={param.min} max={param.max} step={param.step}
                                        value={param.value} onChange={(e) => param.setter(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-slate-900 group-hover:accent-brand-primary transition-all cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* 右側：主儀表板 (占 8 欄) */}
                    <div className="lg:col-span-8 flex flex-col space-y-6">
                        {/* 第一部分：資產核心數據 (2x1 Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-[240px] flex flex-col justify-between shadow-2xl">
                                <TrendingUp className="absolute -right-8 -top-8 text-white/5 w-48 h-48 -rotate-12" />
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-2 text-blue-400 mb-2">
                                        <PiggyBank className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">模擬終值資產</span>
                                    </div>
                                    <div className="text-5xl font-black tracking-tighter mb-2">${formatCurrency(finalResult.totalAssets)}</div>
                                    <div className="text-xs font-bold text-slate-400">複利力量下，{years} 年後的資產估值</div>
                                </div>
                                <div className="relative z-10 bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="text-xs font-bold">總獲利 <span className="text-emerald-400 ml-1">+{roi.toFixed(0)}%</span></div>
                                    <div className="w-px h-4 bg-white/10" />
                                    <div className="text-xs font-bold">投入 <span className="text-blue-400 ml-1">${formatCurrency(simulationData[simulationData.length - 1].principal)}</span></div>
                                </div>
                            </div>

                            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 relative overflow-hidden h-[240px] flex flex-col justify-between group hover:border-emerald-100 transition-all">
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">實質購買力</span>
                                    </div>
                                    <div className="text-4xl font-black tracking-tight text-slate-900">${formatCurrency(finalResult.realAssets)}</div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-4">
                                        考慮預計 <span className="text-red-500 font-bold">{inflationRate}%</span> 的通膨後，相當於今天 <span className="text-emerald-600 font-black">${formatCurrency(finalResult.realAssets)}</span> 元的消費水準。
                                    </p>
                                </div>
                                <TrendingDown className="absolute -bottom-10 -right-10 text-slate-50 w-40 h-40 group-hover:text-emerald-50 transition-colors" />
                            </div>
                        </div>

                        {/* 第二部分：FIRE 進度與被動收入 (2x1 Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* FIRE 分析 */}
                            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-2">
                                        <Flame className="w-5 h-5" />
                                        <h3 className="text-sm font-black uppercase tracking-widest">FIRE 財務自由指標</h3>
                                    </div>
                                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-black">4% 法則</div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-orange-200 text-[10px] font-black uppercase mb-1">每月所需</p>
                                            <div className="flex items-center border-b border-white/20 pb-1">
                                                <span className="text-xs text-orange-200/50 mr-1">$</span>
                                                <input
                                                    type="text" inputMode="numeric"
                                                    className="w-full bg-transparent text-xl font-black outline-none"
                                                    value={formatCurrency(monthlyExpense)}
                                                    onChange={(e) => setMonthlyExpense(parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-orange-200 text-[10px] font-black uppercase mb-1">FIRE 目標資產</p>
                                            <div className="text-xl font-black">${formatCurrency(fireResult.fireNumber)}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-black text-orange-200 uppercase">目前達成度</span>
                                            <span className="text-2xl font-black leading-none">{fireResult.currentProgress.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-3 bg-black/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${fireResult.currentProgress}%` }}
                                                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                            />
                                        </div>
                                        <p className="text-[10px] text-orange-100/70 mt-3 font-bold">預計還要 {fireResult.yearsToFIRE === Infinity ? '∞' : fireResult.yearsToFIRE} 年達成財務自由</p>
                                    </div>
                                </div>
                            </div>

                            {/* 被動收入 */}
                            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2 text-emerald-600">
                                        <Wallet className="w-5 h-5" />
                                        <h3 className="text-sm font-black uppercase tracking-widest">被動收入模擬器</h3>
                                    </div>
                                    <Info className="w-4 h-4 text-slate-300" />
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            <p className="text-slate-400 text-[10px] font-black uppercase mb-1">目標月領</p>
                                            <div className="flex items-center">
                                                <span className="text-xs text-slate-300 mr-1">$</span>
                                                <input
                                                    type="text" inputMode="numeric"
                                                    className="w-full bg-transparent text-xl font-black text-slate-900 outline-none"
                                                    value={formatCurrency(targetPassiveIncome)}
                                                    onChange={(e) => setTargetPassiveIncome(parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                            <p className="text-emerald-600/60 text-[10px] font-black uppercase mb-1">所需本金 (5%)</p>
                                            <div className="text-xl font-black text-emerald-600">${formatCurrency(passiveIncomeResult.requiredCapital)}</div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                                            {[3, 4, 5, 6, 7].map((rate) => (
                                                <div key={rate} className={`flex-shrink-0 w-[90px] p-3 rounded-2xl text-center border transition-all ${rate === 5 ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                                                    <div className="text-[10px] font-black mb-1">{rate}% 殖利率</div>
                                                    <div className="text-[11px] font-black">${formatCurrency(Math.round(targetPassiveIncome * 12 / (rate / 100)) / 10000)}萬</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 第三部分：圖表展示 (Full Width) */}
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center space-x-3">
                                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">資產增長決定方案模擬</h3>
                                </div>
                                <div className="flex space-x-6 text-[10px] font-black uppercase tracking-wide">
                                    <div className="flex items-center"><div className="w-2.5 h-2.5 bg-brand-primary rounded-full mr-2 shadow-glow" />名目資產</div>
                                    <div className="flex items-center"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2" />實質資產</div>
                                </div>
                            </div>
                            <div className="h-[320px] w-full">
                                {mounted ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={simulationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="chartAssets" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                                                <linearGradient id="chartReal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} tickFormatter={(v) => `${v}年`} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} tickFormatter={(v) => `$${v / 10000}萬`} width={60} />
                                            <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1 }} />
                                            <Area type="monotone" dataKey="totalAssets" stroke="#3b82f6" strokeWidth={4} fill="url(#chartAssets)" />
                                            <Area type="monotone" dataKey="realAssets" stroke="#10b981" strokeWidth={2} strokeDasharray="6 6" fill="url(#chartReal)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <RefreshCw className="w-8 h-8 animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 第四部分：目標反推與 AI 診斷 (Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 目標反推 */}
                            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between">
                                <Target className="absolute -right-6 -top-6 text-white/5 w-40 h-40" />
                                <div className="relative z-10">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-6 underline decoration-indigo-300 underline-offset-4">Dreams Achievement Plan</h3>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                                <p className="text-indigo-200 text-[10px] font-black mb-1 italic">目標年期</p>
                                                <div className="flex items-center"><input type="number" className="bg-transparent text-2xl font-black outline-none w-full" value={goalYears} onChange={(e) => setGoalYears(Number(e.target.value) || 0)} /><span className="text-xs font-bold ml-1 text-indigo-100">Y</span></div>
                                            </div>
                                            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                                <p className="text-indigo-200 text-[10px] font-black mb-1 italic">終極目標</p>
                                                <div className="flex items-center text-2xl font-black tracking-tighter overflow-hidden">
                                                    <span className="text-xs mr-0.5 mt-1">$</span>
                                                    <input type="text" className="bg-transparent outline-none w-full" value={formatCurrency(goalTarget)} onChange={(e) => setGoalTarget(parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/10 border-2 border-dashed border-white/20 rounded-2xl p-6 text-center transform hover:scale-[1.02] transition-transform">
                                            <p className="text-indigo-100 text-[10px] font-black uppercase mb-1">每月需額外儲蓄</p>
                                            <div className="text-4xl font-black tracking-tight text-white">${formatCurrency(goalReverseResult.monthlyInvestment)}</div>
                                            <div className="text-[9px] text-indigo-300 mt-2 font-bold opacity-70">基於當前回報率 {annualReturnRate}% 計算</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 里程碑 */}
                            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2 text-slate-900">
                                        <Trophy className="w-5 h-5 text-brand-warning" />
                                        <h3 className="text-sm font-black uppercase tracking-widest">資產里程碑</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300">Milestones</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                                    {milestones.map((ms) => {
                                        const isReached = ms.year === 0;
                                        return (
                                            <div key={ms.milestone} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isReached ? 'bg-brand-primary/5 border border-brand-primary/10' : 'bg-slate-50 border border-slate-100 opacity-60'}`}>
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${isReached ? 'bg-brand-primary text-white shadow-glow' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                                        {isReached ? <ShieldCheck className="w-4 h-4" /> : ms.label.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-black text-slate-800">{ms.label}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">Target: ${formatCurrency(ms.milestone)}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-black ${isReached ? 'text-brand-primary' : 'text-slate-400'}`}>
                                                        {isReached ? '已達成' : `第 ${ms.year} 年`}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* AI 診斷 */}
                        <div className="mt-4">
                            <AIInsightCard
                                title="AI 資本戰略診斷"
                                buttonText="激活 AI 戰略分析模式"
                                prompt="你是 TaiCalc 首席資本戰略官。請分析這份複利增長模擬數據，提供 3 個精確洞察。字數 250 字內。"
                                context={{ initialCapital, monthlyContribution, annualReturnRate, inflationRate, years, totalAssets: finalResult.totalAssets, realAssets: finalResult.realAssets, roi }}
                            />
                        </div>
                    </div>
                </div>

                {/* 底部：延伸探索 */}
                <footer className="mt-20 pt-10 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center space-x-8">
                            {[
                                { label: '房貸佈局', path: '/mortgage', icon: <Target className="w-4 h-4" /> },
                                { label: '稅務優化', path: '/tax', icon: <Info className="w-4 h-4" /> },
                                { label: '薪資戰略', path: '/salary', icon: <Wallet className="w-4 h-4" /> }
                            ].map((item) => (
                                <Link key={item.label} href={item.path} className="flex items-center space-x-2 text-slate-400 hover:text-brand-primary transition-all font-black text-[10px] uppercase tracking-widest group">
                                    <span className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg group-hover:bg-brand-primary/5 group-hover:border-brand-primary transition-all">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">© 2025 TaiCalc Financial Engine. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
