'use client';

import { useState, useCallback } from 'react';

interface CompoundResult {
    futureValue: number;
    totalContributions: number;
    totalInterest: number;
    yearlyBreakdown: Array<{ year: number; value: number; interest: number }>;
}

function calculateCompound(
    principal: number,
    monthlyContribution: number,
    annualRate: number,
    years: number
): CompoundResult {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    let balance = principal;
    const yearlyBreakdown: CompoundResult['yearlyBreakdown'] = [];

    for (let month = 1; month <= totalMonths; month++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;

        if (month % 12 === 0) {
            const year = month / 12;
            const contributed = principal + monthlyContribution * month;
            yearlyBreakdown.push({
                year,
                value: Math.round(balance),
                interest: Math.round(balance - contributed),
            });
        }
    }

    const totalContributions = principal + monthlyContribution * totalMonths;
    const totalInterest = balance - totalContributions;

    return {
        futureValue: Math.round(balance),
        totalContributions: Math.round(totalContributions),
        totalInterest: Math.round(totalInterest),
        yearlyBreakdown,
    };
}

export default function CapitalCalculatorPage() {
    const [principal, setPrincipal] = useState(100000);
    const [monthlyContribution, setMonthlyContribution] = useState(10000);
    const [annualRate, setAnnualRate] = useState(7);
    const [years, setYears] = useState(20);
    const [result, setResult] = useState<CompoundResult | null>(null);

    const handleCalculate = useCallback(() => {
        setResult(calculateCompound(principal, monthlyContribution, annualRate, years));
    }, [principal, monthlyContribution, annualRate, years]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">複利計算器</h1>
                <p className="text-slate-500 mb-8">試算複利成長效果，看見時間的力量</p>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            初始本金 (NT$)
                        </label>
                        <input
                            type="number"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            每月投入 (NT$)
                        </label>
                        <input
                            type="number"
                            value={monthlyContribution}
                            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            年化報酬率 (%)
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            value={annualRate}
                            onChange={(e) => setAnnualRate(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            投資年限 (年)
                        </label>
                        <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算複利成長
                </button>

                {result && (
                    <div className="mt-8 space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">最終價值</p>
                                <p className="text-2xl font-bold font-mono text-gradient-primary">
                                    NT$ {result.futureValue.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">總投入</p>
                                <p className="text-2xl font-bold font-mono text-slate-700">
                                    NT$ {result.totalContributions.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">複利收益</p>
                                <p className="text-2xl font-bold font-mono text-green-600">
                                    +NT$ {result.totalInterest.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">年度成長</h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {result.yearlyBreakdown.map((item) => (
                                    <div key={item.year} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                        <span className="text-slate-600">第 {item.year} 年</span>
                                        <div className="text-right">
                                            <span className="font-mono font-semibold">NT$ {item.value.toLocaleString()}</span>
                                            <span className="text-green-600 text-sm ml-2">(+{item.interest.toLocaleString()})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
