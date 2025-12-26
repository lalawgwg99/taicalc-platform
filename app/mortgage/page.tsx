'use client';

import React, { useState, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Home, Landmark, Calendar, Percent, ArrowRight,
    Info, ShieldCheck, Download, Calculator, TrendingDown, ChevronLeft, Zap
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- 內部工具函數 ---
const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null) return "0";
    return new Intl.NumberFormat('zh-TW', {
        style: 'decimal',
        maximumFractionDigits: 0,
    }).format(amount);
};

// --- 房貸計算核心邏輯 ---
type CalculationMethod = 'average' | 'principal';

interface MortgageParams {
    loanAmount: number; // 萬元
    annualRate: number; // %
    years: number;
    gracePeriod: number; // 年
    method: CalculationMethod;
}

const calculateMortgage = ({
    loanAmount,
    annualRate,
    years,
    gracePeriod,
    method
}: MortgageParams) => {
    const amount = loanAmount * 10000;
    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = years * 12;
    const graceMonths = gracePeriod * 12;
    const payMonths = totalMonths - graceMonths;

    // 避免除以零
    if (totalMonths <= 0) return { monthlyPayment: 0, graceMonthlyPayment: 0, postGraceMonthlyPayment: 0, totalInterest: 0, totalPayment: 0, schedule: [] };

    // 1. 計算每月應付本息 (EMI) - 適用於本息平均攤還
    const emi = monthlyRate === 0
        ? amount / payMonths
        : (amount * monthlyRate * Math.pow(1 + monthlyRate, payMonths)) / (Math.pow(1 + monthlyRate, payMonths) - 1);

    // 預先決定寬限期與非寬限期的金額
    const graceMonthlyPayment = amount * monthlyRate;
    const postGraceMonthlyPayment = method === 'average' ? emi : (amount / payMonths + amount * monthlyRate);

    // 初始顯示的月繳金額 (若有寬限期則顯示寬限期金額)
    const monthlyPayment = graceMonths > 0 ? graceMonthlyPayment : postGraceMonthlyPayment;

    let schedule = [];
    let remainingBalance = amount;
    let totalInterest = 0;

    for (let m = 1; m <= totalMonths; m++) {
        let interestPayment = remainingBalance * monthlyRate;
        let principalPayment = 0;

        if (m <= graceMonths) {
            principalPayment = 0;
        } else {
            if (method === 'average') {
                principalPayment = emi - interestPayment;
            } else {
                // 本金平均攤還：每月本金固定
                principalPayment = amount / payMonths;
            }
        }

        remainingBalance = Math.max(0, remainingBalance - principalPayment);
        totalInterest += interestPayment;

        // 每年度記錄一個點 (供圖表使用)
        if (m % 12 === 0 || m === 1) {
            schedule.push({
                year: Math.ceil(m / 12),
                balance: Math.round(remainingBalance),
                cumulativeInterest: Math.round(totalInterest)
            });
        }
    }

    return {
        monthlyPayment,
        graceMonthlyPayment,
        postGraceMonthlyPayment,
        totalInterest,
        totalPayment: amount + totalInterest,
        schedule
    };
};

export default function MortgageCalculator() {
    // 基本狀態
    const [loanAmount, setLoanAmount] = useState(1000); // 1000萬
    const [rate, setRate] = useState(2.185); // 目前一般房貸低點
    const [years, setYears] = useState(30);
    const [graceYear, setGraceYear] = useState(0);
    const [method, setMethod] = useState<CalculationMethod>('average');

    // 計算結果
    const results = useMemo(() => {
        return calculateMortgage({ loanAmount, annualRate: rate, years, gracePeriod: graceYear, method });
    }, [loanAmount, rate, years, graceYear, method]);

    // 新青安對比
    const qingAnResults = useMemo(() => {
        // 青安補貼後約 1.775%
        return calculateMortgage({ loanAmount, annualRate: 1.775, years, gracePeriod: 5, method: 'average' });
    }, [loanAmount, years]);

    return (
        <div className="min-h-screen bg-brand-background font-sans pb-32">
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

            <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-blue-50 text-brand-primary text-[10px] font-black px-2 py-1 rounded border border-blue-100">MORTGAGE PRO</span>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">房貸決策工具</h1>
                            </div>
                            <p className="text-slate-500 font-medium">對比不同方案，找出最適合您的還款策略。包含新青安貸款方案參考。</p>
                        </motion.div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左側：輸入與配置 */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-white/70 border border-slate-200 rounded-[32px] p-8 backdrop-blur-xl shadow-sm">
                            <div className="flex items-center space-x-2 mb-6 text-brand-primary">
                                <Calculator className="w-5 h-5" />
                                <h2 className="font-bold">貸款參數</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">貸款總額 (萬元)</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">$</span>
                                        <input
                                            type="number"
                                            className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all shadow-sm"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">貸款年限</label>
                                        <select
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/50"
                                            value={years}
                                            onChange={(e) => setYears(Number(e.target.value))}
                                        >
                                            <option value={20}>20 年</option>
                                            <option value={30}>30 年</option>
                                            <option value={40}>40 年</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">年利率 (%)</label>
                                        <input
                                            type="number" step="0.001"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/50"
                                            value={rate}
                                            onChange={(e) => setRate(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">還款方式</label>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => setMethod('average')}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${method === 'average' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            本息平均
                                        </button>
                                        <button
                                            onClick={() => setMethod('principal')}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${method === 'principal' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            本金平均
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">寬限期 (年)</label>
                                    <input
                                        type="number" min="0" max="5"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/50"
                                        value={graceYear}
                                        onChange={(e) => setGraceYear(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 決策建議區 */}
                        <section className="bg-gradient-to-br from-brand-primary to-blue-600 rounded-[32px] p-8 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <h3 className="text-sm font-black mb-4 flex items-center uppercase tracking-wider relative z-10">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                數策建議
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-md">
                                    <p className="text-xs text-blue-50 leading-relaxed font-medium">
                                        若您具備首購資格，<span className="font-black text-white underline decoration-blue-300 decoration-2 underline-offset-2">新青安貸款</span> 前五年寬限期可節省約 <span className="text-2xl font-black block mt-2 text-white">${formatCurrency(Math.max(0, results.monthlyPayment - qingAnResults.graceMonthlyPayment))}/月</span>
                                    </p>
                                </div>
                                <p className="text-[10px] text-blue-100 font-medium opacity-80 flex items-start">
                                    <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                    建議房貸支出不超過家庭月收入的 1/3，以維持生活品質。
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* 右側：核心數據與視覺化 */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 數據概要 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">每月繳款 (初期)</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">${formatCurrency(results.monthlyPayment)}</h3>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">利息總額</p>
                                <h3 className="text-3xl font-black text-brand-error tracking-tight">${formatCurrency(results.totalInterest)}</h3>
                            </div>
                            <div className="bg-white border-l-4 border-l-brand-primary border-y border-r border-slate-200 rounded-[24px] p-6 shadow-sm">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">本利總額</p>
                                <h3 className="text-3xl font-black text-brand-primary tracking-tight">${formatCurrency(results.totalPayment)}</h3>
                            </div>
                        </div>

                        {/* 圖表分析 */}
                        <div className="bg-white border border-slate-200 rounded-[32px] p-8 relative overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                                    <TrendingDown className="w-4 h-4 mr-2 text-brand-primary" />
                                    貸款餘額與利息累積趨勢
                                </h2>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-2 h-2 rounded-full bg-brand-primary" />
                                        <span className="text-xs font-bold text-slate-500">剩餘本金</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-2 h-2 rounded-full bg-brand-error" />
                                        <span className="text-xs font-bold text-slate-500">累積利息</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={results.schedule} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis
                                            dataKey="year"
                                            stroke="#94a3b8"
                                            fontSize={10}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(val) => `第${val}年`}
                                            tickMargin={10}
                                        />
                                        <YAxis hide />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            formatter={(val: number) => [`$${formatCurrency(val)}`]}
                                            itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#64748b', marginBottom: '0.5rem' }}
                                        />
                                        <Area type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" activeDot={{ r: 6, strokeWidth: 0 }} />
                                        <Area type="monotone" dataKey="cumulativeInterest" stroke="#dc2626" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 詳細對比清單 */}
                        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 bg-slate-50">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">還款計畫核心明細</h3>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                        <span className="text-xs text-slate-500 font-bold">平均每日支出</span>
                                        <span className="text-sm font-black text-slate-900">${formatCurrency(results.monthlyPayment / 30)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                        <span className="text-xs text-slate-500 font-bold">利息佔總支出比例</span>
                                        <span className="text-sm font-black text-brand-error">{results.totalPayment > 0 ? ((results.totalInterest / results.totalPayment) * 100).toFixed(1) : 0}%</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                        <span className="text-xs text-slate-500 font-bold">建議家庭月收入下限</span>
                                        <span className="text-sm font-black text-brand-success">${formatCurrency(results.monthlyPayment * 3)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                        <span className="text-xs text-slate-500 font-bold">總還款槓桿倍數</span>
                                        <span className="text-sm font-black text-slate-900">{(loanAmount > 0 ? results.totalPayment / (loanAmount * 10000) : 0).toFixed(2)}x</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => window.print()}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 print:hidden"
                        >
                            <Download className="w-5 h-5" />
                            <span>下載完整房貸決策報告 (PDF)</span>
                        </button>
                        <p className="text-xs text-center text-slate-400 mt-2 print:hidden">
                            提示：點擊後選擇「另存為 PDF」即可高畫質保存報告。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
