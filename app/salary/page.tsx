'use client';

import { useState, useCallback } from 'react';
import { calculateSalary, SalaryInput, SalaryResult } from '@/features/salary/logic';

export default function SalaryCalculatorPage() {
    const [monthlySalary, setMonthlySalary] = useState(50000);
    const [bonusMonths, setBonusMonths] = useState(1);
    const [result, setResult] = useState<SalaryResult | null>(null);

    const handleCalculate = useCallback(() => {
        const input: SalaryInput = { monthlySalary, bonusMonths };
        setResult(calculateSalary(input));
    }, [monthlySalary, bonusMonths]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">薪資計算器</h1>
                <p className="text-slate-500 mb-8">計算實際到手薪資、勞健保、勞退</p>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            月薪 (NT$)
                        </label>
                        <input
                            type="number"
                            value={monthlySalary}
                            onChange={(e) => setMonthlySalary(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            年終獎金 (月數)
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            value={bonusMonths}
                            onChange={(e) => setBonusMonths(Number(e.target.value))}
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
                    <div className="mt-8 space-y-6">
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">月薪明細</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">月薪總額</span>
                                    <span className="font-mono font-semibold">NT$ {result.monthly.gross.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">勞保自付</span>
                                    <span className="font-mono text-red-500">-NT$ {result.monthly.laborInsurance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">健保自付</span>
                                    <span className="font-mono text-red-500">-NT$ {result.monthly.healthInsurance.toLocaleString()}</span>
                                </div>
                                <hr className="border-slate-200" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-slate-800">實領</span>
                                    <span className="font-mono text-gradient-primary">NT$ {result.monthly.net.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">年度概算</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">年薪總額</span>
                                    <span className="font-mono font-semibold">NT$ {result.yearly.gross.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">年度勞保</span>
                                    <span className="font-mono text-red-500">-NT$ {result.yearly.totalLaborInsurance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">年度健保</span>
                                    <span className="font-mono text-red-500">-NT$ {result.yearly.totalHealthInsurance.toLocaleString()}</span>
                                </div>
                                <hr className="border-slate-200" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-slate-800">年度實領</span>
                                    <span className="font-mono text-gradient-primary">NT$ {result.yearly.net.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
