'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Home,
    TrendingDown,
    Calculator,
    BarChart3,
    Sparkles
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

interface MortgageScenario {
    id: string;
    name: string;
    color: string;
    loanAmount: number;
    years: number;
    rate: number;
    gracePeriod: number;
}

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];

const defaultMortgage = (index: number): MortgageScenario => ({
    id: `mortgage-${Date.now()}-${index}`,
    name: index === 0 ? '一般房貸' : index === 1 ? '新青安' : `方案 ${String.fromCharCode(65 + index)}`,
    color: COLORS[index % COLORS.length],
    loanAmount: 10000000,
    years: 30,
    rate: index === 1 ? 1.775 : 2.0,
    gracePeriod: index === 1 ? 5 : 0
});

export default function MortgageComparePage() {
    const [scenarios, setScenarios] = useState<MortgageScenario[]>([
        defaultMortgage(0),
        defaultMortgage(1)
    ]);
    const [activeTab, setActiveTab] = useState<'input' | 'compare' | 'chart'>('input');

    const calculateMortgage = (s: MortgageScenario) => {
        const monthlyRate = s.rate / 100 / 12;
        const totalMonths = s.years * 12;
        const graceMonths = s.gracePeriod * 12;
        const payMonths = totalMonths - graceMonths;

        // 寬限期月付
        const gracePayment = Math.round(s.loanAmount * monthlyRate);

        // 本息攤還月付
        let monthlyPayment: number;
        if (monthlyRate === 0) {
            monthlyPayment = s.loanAmount / payMonths;
        } else {
            monthlyPayment = s.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payMonths)
                / (Math.pow(1 + monthlyRate, payMonths) - 1);
        }

        const totalGracePayment = gracePayment * graceMonths;
        const totalRegularPayment = monthlyPayment * payMonths;
        const totalPayment = totalGracePayment + totalRegularPayment;
        const totalInterest = totalPayment - s.loanAmount;

        // 年度餘額資料
        const yearlyData = [];
        let balance = s.loanAmount;

        for (let year = 0; year <= s.years; year++) {
            yearlyData.push({
                year,
                balance: Math.round(balance)
            });

            for (let month = 0; month < 12; month++) {
                const currentYear = year;
                if (currentYear < s.gracePeriod) {
                    // 寬限期：只付利息，本金不變
                } else {
                    // 本息攤還
                    const interest = balance * monthlyRate;
                    const principal = monthlyPayment - interest;
                    balance = Math.max(0, balance - principal);
                }
            }
        }

        return {
            gracePayment,
            monthlyPayment: Math.round(monthlyPayment),
            totalPayment: Math.round(totalPayment),
            totalInterest: Math.round(totalInterest),
            interestRatio: (totalInterest / totalPayment * 100),
            yearlyData
        };
    };

    const getChartData = () => {
        const maxYears = Math.max(...scenarios.map(s => s.years));
        const data = [];

        for (let year = 0; year <= maxYears; year++) {
            const point: any = { year: `${year}年` };
            scenarios.forEach(s => {
                const calc = calculateMortgage(s);
                const yearData = calc.yearlyData.find(d => d.year === year);
                point[s.name] = yearData?.balance || 0;
            });
            data.push(point);
        }
        return data;
    };

    const addScenario = () => {
        if (scenarios.length >= 4) return;
        setScenarios([...scenarios, defaultMortgage(scenarios.length)]);
    };

    const removeScenario = (id: string) => {
        if (scenarios.length <= 1) return;
        setScenarios(scenarios.filter(s => s.id !== id));
    };

    const updateScenario = (id: string, updates: Partial<MortgageScenario>) => {
        setScenarios(scenarios.map(s =>
            s.id === id ? { ...s, ...updates } : s
        ));
    };

    const fmt = (n: number) => n?.toLocaleString('zh-TW') || '0';

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
            <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/pro" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-bold">TaiCalc</span>
                        <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">PRO</span>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Home className="w-4 h-4 text-emerald-400" />
                        房貸方案比較器
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-white mb-2">
                        🏠 房貸方案比較器
                    </h1>
                    <p className="text-slate-400">
                        比較一般房貸 vs 新青安，看清利率與寬限期的長期影響
                    </p>
                </div>

                {/* Tab 切換 */}
                <div className="flex justify-center gap-2 mb-8">
                    {[
                        { id: 'input', label: '設定方案', icon: Calculator },
                        { id: 'compare', label: '數據比較', icon: BarChart3 },
                        { id: 'chart', label: '還款曲線', icon: TrendingDown }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 輸入 Tab */}
                {activeTab === 'input' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            {scenarios.map((scenario) => (
                                <div
                                    key={scenario.id}
                                    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
                                    style={{ borderTopColor: scenario.color, borderTopWidth: 4 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <input
                                            type="text"
                                            value={scenario.name}
                                            onChange={(e) => updateScenario(scenario.id, { name: e.target.value })}
                                            className="bg-transparent text-white font-bold text-lg border-none outline-none"
                                        />
                                        {scenarios.length > 1 && (
                                            <button
                                                onClick={() => removeScenario(scenario.id)}
                                                className="text-slate-500 hover:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">貸款金額 (NT$)</label>
                                            <input
                                                type="number"
                                                value={scenario.loanAmount}
                                                onChange={(e) => updateScenario(scenario.id, { loanAmount: Number(e.target.value) })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-slate-400 mb-1 block">貸款年限</label>
                                                <input
                                                    type="number"
                                                    value={scenario.years}
                                                    onChange={(e) => updateScenario(scenario.id, { years: Number(e.target.value) })}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-400 mb-1 block">年利率 (%)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={scenario.rate}
                                                    onChange={(e) => updateScenario(scenario.id, { rate: Number(e.target.value) })}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">寬限期 (年)</label>
                                            <input
                                                type="number"
                                                value={scenario.gracePeriod}
                                                onChange={(e) => updateScenario(scenario.id, { gracePeriod: Number(e.target.value) })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {scenarios.length < 4 && (
                                <button
                                    onClick={addScenario}
                                    className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-emerald-400 hover:border-emerald-500 transition-all min-h-[300px]"
                                >
                                    <Plus className="w-8 h-8" />
                                    <span>新增方案</span>
                                </button>
                            )}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => setActiveTab('compare')}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl"
                            >
                                開始比較 →
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* 比較 Tab */}
                {activeTab === 'compare' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full bg-slate-800/50 rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left text-slate-400 text-sm p-4">指標</th>
                                        {scenarios.map(s => (
                                            <th key={s.id} className="text-center p-4" style={{ color: s.color }}>
                                                {s.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-white">
                                    <tr className="border-b border-slate-700/50">
                                        <td className="p-4 text-slate-400">貸款金額</td>
                                        {scenarios.map(s => (
                                            <td key={s.id} className="text-center p-4">
                                                NT$ {fmt(s.loanAmount)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-slate-700/50">
                                        <td className="p-4 text-slate-400">年利率</td>
                                        {scenarios.map(s => (
                                            <td key={s.id} className="text-center p-4">
                                                {s.rate}%
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-slate-700/50">
                                        <td className="p-4 text-slate-400">寬限期</td>
                                        {scenarios.map(s => (
                                            <td key={s.id} className="text-center p-4">
                                                {s.gracePeriod} 年
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-slate-700/50">
                                        <td className="p-4 text-slate-400">寬限期月付</td>
                                        {scenarios.map(s => {
                                            const calc = calculateMortgage(s);
                                            return (
                                                <td key={s.id} className="text-center p-4">
                                                    {s.gracePeriod > 0 ? `NT$ ${fmt(calc.gracePayment)}` : '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr className="border-b border-slate-700/50 bg-slate-700/30">
                                        <td className="p-4 text-slate-300 font-bold">正常期月付</td>
                                        {scenarios.map(s => {
                                            const calc = calculateMortgage(s);
                                            return (
                                                <td key={s.id} className="text-center p-4 font-bold text-lg" style={{ color: s.color }}>
                                                    NT$ {fmt(calc.monthlyPayment)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr className="border-b border-slate-700/50">
                                        <td className="p-4 text-slate-400">總利息支出</td>
                                        {scenarios.map(s => {
                                            const calc = calculateMortgage(s);
                                            return (
                                                <td key={s.id} className="text-center p-4 text-orange-400">
                                                    NT$ {fmt(calc.totalInterest)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr className="bg-emerald-900/30">
                                        <td className="p-4 text-emerald-300 font-bold">總還款金額</td>
                                        {scenarios.map(s => {
                                            const calc = calculateMortgage(s);
                                            return (
                                                <td key={s.id} className="text-center p-4 text-xl font-black text-white">
                                                    NT$ {fmt(calc.totalPayment)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 分析 */}
                        {scenarios.length >= 2 && (
                            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4">💡 關鍵結論</h3>
                                {(() => {
                                    const results = scenarios.map(s => ({
                                        ...s,
                                        result: calculateMortgage(s)
                                    }));
                                    const sorted = [...results].sort((a, b) => a.result.totalInterest - b.result.totalInterest);
                                    const best = sorted[0];
                                    const worst = sorted[sorted.length - 1];
                                    const interestDiff = worst.result.totalInterest - best.result.totalInterest;

                                    return (
                                        <div className="space-y-4 text-slate-300">
                                            <p>
                                                <span style={{ color: best.color }} className="font-bold">{best.name}</span>
                                                {' '}總利息較低，比{' '}
                                                <span style={{ color: worst.color }} className="font-bold">{worst.name}</span>
                                                {' '}省下{' '}
                                                <span className="text-2xl font-black text-emerald-400">NT$ {fmt(interestDiff)}</span>
                                            </p>
                                            <p className="text-slate-400 text-sm">
                                                ⚠️ 注意：新青安雖然利率低，但寬限期結束後月付會大幅增加，請確保屆時有足夠還款能力。
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* 圖表 Tab */}
                {activeTab === 'chart' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">📉 貸款餘額變化</h3>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={getChartData()}>
                                        <defs>
                                            {scenarios.map(s => (
                                                <linearGradient key={s.id} id={`gradient-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="year" stroke="#64748b" />
                                        <YAxis
                                            stroke="#64748b"
                                            tickFormatter={(v) => `${(v / 10000).toFixed(0)}萬`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                            formatter={(value: number) => [`NT$ ${fmt(value)}`, '餘額']}
                                        />
                                        <Legend />
                                        {scenarios.map(s => (
                                            <Area
                                                key={s.id}
                                                type="monotone"
                                                dataKey={s.name}
                                                stroke={s.color}
                                                strokeWidth={2}
                                                fill={`url(#gradient-${s.id})`}
                                            />
                                        ))}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="mt-12 text-center">
                    <Link
                        href="/pro"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        ← 返回 Pro 首頁
                    </Link>
                </div>
            </main>
        </div>
    );
}
