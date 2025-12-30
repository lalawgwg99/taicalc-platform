'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    Trash2,
    TrendingUp,
    Calculator,
    BarChart3,
    Download,
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
    BarChart,
    Bar
} from 'recharts';

// 方案類型
interface Scenario {
    id: string;
    name: string;
    color: string;
    // 薪資
    monthlySalary: number;
    bonusMonths: number;
    selfContribute: boolean;
    // 投資
    monthlyInvestment: number;
    returnRate: number;
    // 計算年數
    years: number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const defaultScenario = (index: number): Scenario => ({
    id: `scenario-${Date.now()}-${index}`,
    name: `方案 ${String.fromCharCode(65 + index)}`,
    color: COLORS[index % COLORS.length],
    monthlySalary: 50000,
    bonusMonths: 2,
    selfContribute: false,
    monthlyInvestment: 10000,
    returnRate: 7,
    years: 10
});

export default function ProCalculatorPage() {
    const [scenarios, setScenarios] = useState<Scenario[]>([
        defaultScenario(0),
        defaultScenario(1)
    ]);
    const [activeTab, setActiveTab] = useState<'input' | 'compare' | 'chart'>('input');

    // 計算單一方案
    const calculateScenario = (s: Scenario) => {
        // 薪資計算
        const laborRate = 0.024;
        const healthRate = 0.0155;
        const pensionRate = s.selfContribute ? 0.06 : 0;

        const monthlyDeductions = Math.round(s.monthlySalary * (laborRate + healthRate + pensionRate));
        const monthlyTakeHome = s.monthlySalary - monthlyDeductions;
        const annualGross = s.monthlySalary * (12 + s.bonusMonths);
        const annualNet = annualGross - (monthlyDeductions * 12);

        // 投資成長計算
        const r = s.returnRate / 100 / 12;
        const n = s.years * 12;
        let futureValue: number;
        if (r === 0) {
            futureValue = s.monthlyInvestment * n;
        } else {
            futureValue = s.monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r);
        }
        const totalContributed = s.monthlyInvestment * n;
        const totalEarnings = futureValue - totalContributed;

        // 年度資料
        const yearlyData = [];
        for (let year = 0; year <= s.years; year++) {
            const months = year * 12;
            let value: number;
            if (r === 0) {
                value = s.monthlyInvestment * months;
            } else {
                value = s.monthlyInvestment * ((Math.pow(1 + r, months) - 1) / r);
            }
            yearlyData.push({
                year,
                value: Math.round(value),
                principal: s.monthlyInvestment * months
            });
        }

        return {
            monthlyTakeHome,
            annualGross,
            annualNet,
            futureValue: Math.round(futureValue),
            totalContributed,
            totalEarnings: Math.round(totalEarnings),
            yearlyData
        };
    };

    // 合併年度資料用於圖表
    const getChartData = () => {
        const maxYears = Math.max(...scenarios.map(s => s.years));
        const data = [];

        for (let year = 0; year <= maxYears; year++) {
            const point: any = { year: `第${year}年` };
            scenarios.forEach((s, i) => {
                const calc = calculateScenario(s);
                const yearData = calc.yearlyData.find(d => d.year === year);
                point[s.name] = yearData?.value || 0;
            });
            data.push(point);
        }
        return data;
    };

    const addScenario = () => {
        if (scenarios.length >= 5) return;
        setScenarios([...scenarios, defaultScenario(scenarios.length)]);
    };

    const removeScenario = (id: string) => {
        if (scenarios.length <= 1) return;
        setScenarios(scenarios.filter(s => s.id !== id));
    };

    const updateScenario = (id: string, updates: Partial<Scenario>) => {
        setScenarios(scenarios.map(s =>
            s.id === id ? { ...s, ...updates } : s
        ));
    };

    const fmt = (n: number) => n?.toLocaleString('zh-TW') || '0';

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
            {/* 導航 */}
            <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/pro" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-bold">TaiCalc</span>
                        <span className="text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">PRO</span>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        多方案比較器
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* 標題 */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-white mb-2">
                        💎 財務方案比較器
                    </h1>
                    <p className="text-slate-400">
                        同時比較多個財務規劃方案，看清每個選擇的長期影響
                    </p>
                </div>

                {/* Tab 切換 */}
                <div className="flex justify-center gap-2 mb-8">
                    {[
                        { id: 'input', label: '設定方案', icon: Calculator },
                        { id: 'compare', label: '數據比較', icon: BarChart3 },
                        { id: 'chart', label: '視覺化圖表', icon: TrendingUp }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 設定方案 Tab */}
                {activeTab === 'input' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {scenarios.map((scenario, index) => (
                                <div
                                    key={scenario.id}
                                    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
                                    style={{ borderLeftColor: scenario.color, borderLeftWidth: 4 }}
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
                                                className="text-slate-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {/* 月薪 */}
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">月薪 (NT$)</label>
                                            <input
                                                type="number"
                                                value={scenario.monthlySalary}
                                                onChange={(e) => updateScenario(scenario.id, { monthlySalary: Number(e.target.value) })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            />
                                        </div>

                                        {/* 年終月數 */}
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">年終月數</label>
                                            <input
                                                type="number"
                                                value={scenario.bonusMonths}
                                                onChange={(e) => updateScenario(scenario.id, { bonusMonths: Number(e.target.value) })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            />
                                        </div>

                                        {/* 勞退自提 */}
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={scenario.selfContribute}
                                                onChange={(e) => updateScenario(scenario.id, { selfContribute: e.target.checked })}
                                                className="w-4 h-4 rounded"
                                            />
                                            <label className="text-sm text-slate-300">勞退自提 6%</label>
                                        </div>

                                        <hr className="border-slate-700" />

                                        {/* 月投資金額 */}
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">每月投資 (NT$)</label>
                                            <input
                                                type="number"
                                                value={scenario.monthlyInvestment}
                                                onChange={(e) => updateScenario(scenario.id, { monthlyInvestment: Number(e.target.value) })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            />
                                        </div>

                                        {/* 報酬率 */}
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">年化報酬率 (%)</label>
                                            <input
                                                type="number"
                                                value={scenario.returnRate}
                                                onChange={(e) => updateScenario(scenario.id, { returnRate: Number(e.target.value) })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            />
                                        </div>

                                        {/* 投資年數 */}
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">投資年數</label>
                                            <input
                                                type="number"
                                                value={scenario.years}
                                                onChange={(e) => updateScenario(scenario.id, { years: Number(e.target.value) })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* 新增方案按鈕 */}
                            {scenarios.length < 5 && (
                                <button
                                    onClick={addScenario}
                                    className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-indigo-400 hover:border-indigo-500 transition-all"
                                >
                                    <Plus className="w-8 h-8" />
                                    <span>新增方案</span>
                                </button>
                            )}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => setActiveTab('compare')}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl transition-all"
                            >
                                開始比較 →
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* 比較結果 Tab */}
                {activeTab === 'compare' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* 結果表格 */}
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
                                        <td className="p-4 text-slate-400">每月實領</td>
                                        {scenarios.map(s => {
                                            const calc = calculateScenario(s);
                                            return (
                                                <td key={s.id} className="text-center p-4 font-bold">
                                                    NT$ {fmt(calc.monthlyTakeHome)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr className="border-b border-slate-700/50">
                                        <td className="p-4 text-slate-400">年薪總額</td>
                                        {scenarios.map(s => {
                                            const calc = calculateScenario(s);
                                            return (
                                                <td key={s.id} className="text-center p-4">
                                                    NT$ {fmt(calc.annualGross)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr className="border-b border-slate-700/50">
                                        <td className="p-4 text-slate-400">每月投資</td>
                                        {scenarios.map(s => (
                                            <td key={s.id} className="text-center p-4">
                                                NT$ {fmt(s.monthlyInvestment)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-slate-700/50">
                                        <td className="p-4 text-slate-400">預期報酬率</td>
                                        {scenarios.map(s => (
                                            <td key={s.id} className="text-center p-4">
                                                {s.returnRate}%
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-slate-700/50 bg-slate-700/30">
                                        <td className="p-4 text-slate-300 font-bold">
                                            總投入本金
                                        </td>
                                        {scenarios.map(s => {
                                            const calc = calculateScenario(s);
                                            return (
                                                <td key={s.id} className="text-center p-4">
                                                    NT$ {fmt(calc.totalContributed)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr className="border-b border-slate-700/50 bg-slate-700/30">
                                        <td className="p-4 text-slate-300 font-bold">
                                            投資收益
                                        </td>
                                        {scenarios.map(s => {
                                            const calc = calculateScenario(s);
                                            return (
                                                <td key={s.id} className="text-center p-4 text-emerald-400">
                                                    + NT$ {fmt(calc.totalEarnings)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr className="bg-indigo-900/30">
                                        <td className="p-4 text-indigo-300 font-bold text-lg">
                                            {Math.max(...scenarios.map(s => s.years))} 年後資產
                                        </td>
                                        {scenarios.map(s => {
                                            const calc = calculateScenario(s);
                                            return (
                                                <td key={s.id} className="text-center p-4 text-2xl font-black" style={{ color: s.color }}>
                                                    NT$ {fmt(calc.futureValue)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 差距分析 */}
                        {scenarios.length >= 2 && (
                            <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4">💡 關鍵差距分析</h3>
                                {(() => {
                                    const results = scenarios.map(s => ({
                                        ...s,
                                        result: calculateScenario(s)
                                    }));
                                    const sorted = [...results].sort((a, b) => b.result.futureValue - a.result.futureValue);
                                    const best = sorted[0];
                                    const worst = sorted[sorted.length - 1];
                                    const diff = best.result.futureValue - worst.result.futureValue;

                                    return (
                                        <div className="space-y-4">
                                            <p className="text-slate-300">
                                                <span style={{ color: best.color }} className="font-bold">{best.name}</span>
                                                {' '}比{' '}
                                                <span style={{ color: worst.color }} className="font-bold">{worst.name}</span>
                                                {' '}多出{' '}
                                                <span className="text-2xl font-black text-emerald-400">NT$ {fmt(diff)}</span>
                                            </p>
                                            <p className="text-slate-400 text-sm">
                                                這個差距相當於 {Math.round(diff / worst.monthlyInvestment)} 個月的投資金額，
                                                或是 {Math.round(diff / worst.monthlySalary)} 個月的薪水。
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
                        className="space-y-8"
                    >
                        {/* 資產成長曲線 */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">📈 資產成長曲線</h3>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={getChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="year" stroke="#64748b" />
                                        <YAxis
                                            stroke="#64748b"
                                            tickFormatter={(v) => `${(v / 10000).toFixed(0)}萬`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                borderColor: '#334155',
                                                color: '#fff'
                                            }}
                                            formatter={(value: number) => [`NT$ ${fmt(value)}`, '']}
                                        />
                                        <Legend />
                                        {scenarios.map(s => (
                                            <Line
                                                key={s.id}
                                                type="monotone"
                                                dataKey={s.name}
                                                stroke={s.color}
                                                strokeWidth={3}
                                                dot={false}
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 最終資產長條圖 */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">📊 最終資產比較</h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={scenarios.map(s => ({
                                        name: s.name,
                                        value: calculateScenario(s).futureValue,
                                        fill: s.color
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="name" stroke="#64748b" />
                                        <YAxis
                                            stroke="#64748b"
                                            tickFormatter={(v) => `${(v / 10000).toFixed(0)}萬`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                borderColor: '#334155'
                                            }}
                                            formatter={(value: number) => [`NT$ ${fmt(value)}`, '資產']}
                                        />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                            {scenarios.map(s => (
                                                <rect key={s.id} fill={s.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 底部操作 */}
                <div className="mt-12 flex justify-center gap-4">
                    <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl transition-all">
                        <Download className="w-4 h-4" />
                        匯出報告
                    </button>
                    <Link
                        href="/pro"
                        className="flex items-center gap-2 border border-slate-700 hover:border-slate-600 text-slate-400 px-6 py-3 rounded-xl transition-all"
                    >
                        返回 Pro 首頁
                    </Link>
                </div>
            </main>
        </div>
    );
}
