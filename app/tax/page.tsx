'use client';

import { useState, useCallback } from 'react';
import { calculateTax, TaxInput } from '@/features/tax/logic';

export default function TaxCalculatorPage() {
    const [income, setIncome] = useState(1000000);
    const [isMarried, setIsMarried] = useState(false);
    const [spouseIncome, setSpouseIncome] = useState(0);
    const [children, setChildren] = useState(0);
    const [result, setResult] = useState<number | null>(null);

    const handleCalculate = useCallback(() => {
        const input: TaxInput = { income, isMarried, spouseIncome, children };
        setResult(calculateTax(input));
    }, [income, isMarried, spouseIncome, children]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">所得稅計算</h1>
                <p className="text-slate-500 mb-8">2025 年所得稅試算</p>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            年收入 (NT$)
                        </label>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            撫養子女數
                        </label>
                        <input
                            type="number"
                            value={children}
                            onChange={(e) => setChildren(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isMarried}
                            onChange={(e) => setIsMarried(e.target.checked)}
                            className="w-5 h-5 rounded accent-indigo-500"
                        />
                        <span className="text-slate-700">已婚</span>
                    </label>
                </div>

                {isMarried && (
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            配偶年收入 (NT$)
                        </label>
                        <input
                            type="number"
                            value={spouseIncome}
                            onChange={(e) => setSpouseIncome(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                )}

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算
                </button>

                {result !== null && (
                    <div className="mt-8">
                        <div className="glass-card rounded-2xl p-6 text-center">
                            <p className="text-slate-500 mb-2">預估應繳稅額</p>
                            <p className="text-4xl font-bold font-mono text-gradient-primary">
                                NT$ {result.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
