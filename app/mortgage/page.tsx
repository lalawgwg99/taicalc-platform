'use client';

import { useState, useCallback } from 'react';

interface MortgageResult {
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
}

function calculateMortgage(totalLoan: number, rate: number, years: number): MortgageResult {
    const r = rate / 100 / 12;
    const n = years * 12;
    const monthlyPayment = Math.round(totalLoan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - totalLoan;
    return { monthlyPayment, totalInterest, totalPayment };
}

export default function MortgageCalculatorPage() {
    const [totalLoan, setTotalLoan] = useState(10000000);
    const [rate, setRate] = useState(2.0);
    const [years, setYears] = useState(30);
    const [result, setResult] = useState<MortgageResult | null>(null);

    const handleCalculate = useCallback(() => {
        setResult(calculateMortgage(totalLoan, rate, years));
    }, [totalLoan, rate, years]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">房貸試算</h1>
                <p className="text-slate-500 mb-8">計算每月還款金額與利息</p>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            貸款總額 (NT$)
                        </label>
                        <input
                            type="number"
                            value={totalLoan}
                            onChange={(e) => setTotalLoan(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            年利率 (%)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            貸款年限 (年)
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
                    計算
                </button>

                {result && (
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="glass-card rounded-2xl p-6 text-center">
                            <p className="text-slate-500 mb-2">每月應繳</p>
                            <p className="text-2xl font-bold font-mono text-gradient-primary">
                                NT$ {result.monthlyPayment.toLocaleString()}
                            </p>
                        </div>
                        <div className="glass-card rounded-2xl p-6 text-center">
                            <p className="text-slate-500 mb-2">總利息</p>
                            <p className="text-2xl font-bold font-mono text-red-500">
                                NT$ {result.totalInterest.toLocaleString()}
                            </p>
                        </div>
                        <div className="glass-card rounded-2xl p-6 text-center">
                            <p className="text-slate-500 mb-2">還款總額</p>
                            <p className="text-2xl font-bold font-mono text-slate-700">
                                NT$ {result.totalPayment.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
