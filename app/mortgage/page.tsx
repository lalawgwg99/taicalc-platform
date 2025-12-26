'use client';

import React, { useState, useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
    Home, Calculator, Percent, Calendar, DollarSign,
    TrendingUp, AlertCircle, ChevronLeft, Download, Share2, Building
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import AIInsightCard from '@/components/AI/AIInsightCard';

// --- 內聯計算邏輯 (避免 Import Error) ---
function calculateMortgage(loanAmount: number, annualRate: number, years: number, gracePeriod: number) {
    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = years * 12;
    const graceMonths = gracePeriod * 12;
    const payMonths = totalMonths - graceMonths;

    // 寬限期月付 (僅利息)
    const graceMonthlyPayment = Math.round(loanAmount * monthlyRate);

    // 寬限期後月付 (本息攤還) - 本息平均攤還法
    let postGraceMonthlyPayment = 0;
    if (payMonths > 0) {
        if (monthlyRate === 0) {
            postGraceMonthlyPayment = Math.round(loanAmount / payMonths);
        } else {
            // PMT = P * r * (1+r)^n / ((1+r)^n - 1)
            const x = Math.pow(1 + monthlyRate, payMonths);
            postGraceMonthlyPayment = Math.round((loanAmount * monthlyRate * x) / (x - 1));
        }
    }

    const totalPaymentGrace = graceMonthlyPayment * graceMonths;
    const totalPaymentPost = postGraceMonthlyPayment * payMonths;
    const totalPayment = totalPaymentGrace + totalPaymentPost;
    const totalInterest = totalPayment - loanAmount;

    return {
        monthlyPayment: postGraceMonthlyPayment, // 寬限期後主要月付
        gracePeriodPayment: graceMonthlyPayment, // 寬限期月付
        totalInterest,
        totalPayment
    };
}

export default function MortgagePage() {
    // 狀態管理
    const [loanAmount, setLoanAmount] = useState(15000000); // 1500萬
    const [interestRate, setInterestRate] = useState(2.15); // 2.15%
    const [years, setYears] = useState(30); // 30年
    const [gracePeriod, setGracePeriod] = useState(3); // 寬限期3年

    // 計算結果
    const result = useMemo(() => {
        return calculateMortgage(loanAmount, interestRate, years, gracePeriod);
    }, [loanAmount, interestRate, years, gracePeriod]);

    // 視覺化圖表數據
    const chartData = [
        { name: '本金償還', value: loanAmount, color: '#3b82f6' }, // Brand Primary
        { name: '總利息', value: result.totalInterest, color: '#f59e0b' }, // Brand Warning
    ];

    const monthlyData = useMemo(() => {
        // 生成每月還款趨勢數據 (每年一筆)
        const data = [];
        const monthlyRate = interestRate / 100 / 12;
        const totalMonths = years * 12;
        const graceMonths = gracePeriod * 12;

        // 本息攤還月付金公式
        const remainingMonths = totalMonths - graceMonths;
        const pmt = monthlyRate === 0 ? (loanAmount / remainingMonths) : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);

        for (let y = 1; y <= years; y++) {
            const m = y * 12;
            let payment = 0;
            // 概算該年度的月付金
            if (m <= graceMonths) {
                payment = loanAmount * monthlyRate;
            } else {
                payment = pmt;
            }
            data.push({
                year: y,
                payment: Math.round(payment),
                label: `第${y}年`
            });
        }
        return data;
    }, [loanAmount, interestRate, years, gracePeriod]);

    // 下載報表功能
    const handleDownload = () => {
        const reportContent = `
TaiCalc 數策 - 房貸試算報表
==============================
生成時間: ${new Date().toLocaleString('zh-TW')}

【貸款條件】
貸款金額: ${formatCurrency(loanAmount)}
年利率: ${interestRate}%
貸款年限: ${years} 年
寬限期: ${gracePeriod} 年

【還款資訊】
寬限期月付金 (僅利息): ${formatCurrency(result.gracePeriodPayment)}
寬限期後月付金: ${formatCurrency(result.monthlyPayment)}
總利息支出: ${formatCurrency(result.totalInterest)}
總還款金額: ${formatCurrency(result.totalPayment)}

【分析指標】
利息佔比: ${((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%
每萬元月付: ${formatCurrency(Math.round(result.monthlyPayment / (loanAmount / 10000)))}

==============================
由 TaiCalc 數策 提供 | https://taicalc.com
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `房貸報表_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
                            <div className="bg-brand-primary text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-200">New</div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">房貸決策戰情室</h1>
                        </motion.div>
                        <p className="text-slate-500 font-medium max-w-2xl text-lg">
                            精算新青安與寬限期影響，為您的置產佈局提供清晰視野。
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左側：控制面板 */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="glass-card rounded-[32px] p-8 bg-white/60 border border-white/40 shadow-xl shadow-slate-100/50 backdrop-blur-md">
                            <div className="flex items-center space-x-2 text-brand-primary mb-6">
                                <Calculator className="w-5 h-5" />
                                <h2 className="font-black uppercase tracking-widest text-sm text-slate-400">貸款條件設定</h2>
                            </div>

                            <div className="space-y-6">
                                {/* 貸款金額 */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                                        貸款總額 (NTD)
                                    </label>
                                    <div className="relative group">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
                                        <input
                                            type="number"
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 text-lg shadow-sm"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                                            aria-label="輸入貸款總額"
                                        />
                                    </div>
                                </div>

                                {/* 年利率 & 寬限期 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                                            年利率 (%)
                                        </label>
                                        <div className="relative group">
                                            <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-accent transition-colors w-4 h-4" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-bold text-slate-900 shadow-sm"
                                                value={interestRate}
                                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                                aria-label="輸入年利率"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                                            寬限期 (年)
                                        </label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors w-4 h-4" />
                                            <select
                                                className="w-full pl-10 pr-8 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 shadow-sm appearance-none cursor-pointer"
                                                value={gracePeriod}
                                                onChange={(e) => setGracePeriod(Number(e.target.value))}
                                                aria-label="選擇寬限期年份"
                                            >
                                                {[0, 1, 2, 3, 4, 5].map(y => (
                                                    <option key={y} value={y}>{y} 年</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 貸款年限 */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                                        貸款期限 (年)
                                    </label>
                                    <div className="relative p-1">
                                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 px-1">
                                            <span>20年</span>
                                            <span className="text-brand-primary">{years}年</span>
                                            <span>40年</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="20" max="40" step="5"
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                            value={years}
                                            onChange={(e) => setYears(Number(e.target.value))}
                                            aria-label="調整貸款年限"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 手機版快速結果 */}
                        <div className="lg:hidden glass-card rounded-[24px] p-6 bg-white border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-500 font-bold">寬限期後月付</span>
                                <span className="text-2xl font-black text-brand-primary">${formatCurrency(result.monthlyPayment)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 右側：儀表板 */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 核心指標卡片 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-brand-primary to-blue-600 rounded-[32px] p-8 shadow-2xl shadow-blue-500/30 text-white flex flex-col justify-between h-[200px] relative overflow-hidden">
                                <Home className="absolute right-4 top-4 text-white/10 w-32 h-32 -rotate-12" />
                                <div>
                                    <h3 className="text-xs font-black text-blue-100 uppercase tracking-widest mb-1">本息攤還月付金 (寬限期後)</h3>
                                    <div className="text-5xl font-black tracking-tight">${formatCurrency(result.monthlyPayment)}</div>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2 text-sm font-bold bg-white/10 w-fit px-3 py-1.5 rounded-lg mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>寬限期前月付 ${formatCurrency(result.gracePeriodPayment)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-lg shadow-slate-100 flex flex-col justify-between h-[200px] relative overflow-hidden">
                                <DollarSign className="absolute right-4 top-4 text-slate-100 w-32 h-32 rotate-12" />
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center">
                                        總利息支出
                                        <AlertCircle className="w-3 h-3 ml-1 text-slate-300" />
                                    </h3>
                                    <div className="text-4xl font-black tracking-tight text-brand-warning">${formatCurrency(result.totalInterest)}</div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        利息佔總還款金額的 <span className="text-brand-warning font-bold">{Math.round((result.totalInterest / (loanAmount + result.totalInterest)) * 100)}%</span>。
                                        {gracePeriod > 0 ? `寬限期 ${gracePeriod} 年雖減輕初期負擔，但會增加後期月付壓力。` : '無寬限期雖然初期壓力較大，但總利息支出最少。'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* AI 智慧診斷區塊 */}
                        <div className="mb-6">
                            <AIInsightCard
                                title="AI 房地產戰略顧問"
                                buttonText="點擊進行 AI 房貸戰略分析"
                                prompt="你是 TaiCalc 首席房地產戰略官。請分析這份房貸試算數據，並提供 3 個精確的戰略洞察。重點包括：1.目前的寬限期設定對後續 20+ 年現金流壓力的真實影響。2.總利息支出比率是否在合理範圍內。3.針對目前的置產條件（如新青安或首購）給予風險控管或佈局建議。請直接切入重點，字數控制在 250 字內。"
                                context={{
                                    loanAmount,
                                    interestRate,
                                    years,
                                    gracePeriod,
                                    monthlyPayment: result.monthlyPayment,
                                    gracePeriodPayment: result.gracePeriodPayment,
                                    totalInterest: result.totalInterest,
                                    interestRatio: Math.round((result.totalInterest / (loanAmount + result.totalInterest)) * 100)
                                }}
                            />
                        </div>

                        {/* 圖表分析區 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 圓餅圖：本金利息比 */}
                            <div className="md:col-span-1 glass-card rounded-[32px] p-6 bg-white border border-slate-200 shadow-xl shadow-slate-100 flex flex-col items-center justify-center">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 w-full text-center">總還款結構</h3>
                                <div className="w-full h-[180px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%" cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex gap-4 mt-2 text-xs font-bold">
                                    <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-brand-primary mr-1" />本金</div>
                                    <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-brand-warning mr-1" />利息</div>
                                </div>
                            </div>

                            {/* 折線圖：月付金趨勢 */}
                            <div className="md:col-span-2 glass-card rounded-[32px] p-6 bg-white border border-slate-200 shadow-xl shadow-slate-100">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">月付金壓力趨勢 (30年)</h3>
                                <div className="w-full h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData}>
                                            <defs>
                                                <linearGradient id="colorPayment" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `Y${v}`} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `${v / 1000}k`} width={40} />
                                            <RechartsTooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                formatter={(value: any) => `$${formatCurrency(value)}`}
                                            />
                                            <Area type="stepAfter" dataKey="payment" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPayment)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <footer className="fixed bottom-0 left-0 right-0 bg-brand-surface/90 backdrop-blur-xl border-t border-white/10 p-4 z-40">
                <div className="max-w-7xl mx-auto flex gap-4">
                    <button onClick={handleDownload} className="flex-1 bg-brand-primary text-white h-14 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-glow flex items-center justify-center space-x-2" aria-label="下載房貸試算報表">
                        <Download className="w-5 h-5" />
                        <span>下載報表</span>
                    </button>
                    <button className="px-6 bg-brand-surface border border-white/10 text-white h-14 rounded-xl font-bold hover:bg-white/5 transition-all" aria-label="分享房貸試算結果">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
