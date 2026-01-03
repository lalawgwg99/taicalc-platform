'use client';

import { useState, useCallback, useRef } from 'react';
import { ResultActions } from '@/components/shared';

interface CreditResult {
    totalPayment: number;
    totalInterest: number;
    monthlyPayment: number;
    interestRate: number;
}

export default function CreditCardCalculatorPage() {
    const [amount, setAmount] = useState(30000);
    const [installments, setInstallments] = useState(12);
    const [feePercent, setFeePercent] = useState(4.5);
    const [result, setResult] = useState<CreditResult | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const handleCalculate = useCallback(() => {
        // 分期手續費計算
        const totalInterest = Math.round(amount * (feePercent / 100));
        const totalPayment = amount + totalInterest;
        const monthlyPayment = Math.round(totalPayment / installments);

        // 換算年利率（簡易公式）
        const approxAnnualRate = (feePercent / installments) * 12 * 2;

        setResult({
            totalPayment,
            totalInterest,
            monthlyPayment,
            interestRate: Math.round(approxAnnualRate * 10) / 10,
        });
    }, [amount, installments, feePercent]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">信用卡分期利息計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    銀行不會告訴你的真實利息，這裡直接算給你看。
                </p>

                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 比較分期與一次付清的差異</li>
                        <li>• 評估 0 利率分期的隱藏成本</li>
                        <li>• 計算真實年利率</li>
                    </ul>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            消費金額 (NT$)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            分期期數
                        </label>
                        <select
                            value={installments}
                            onChange={(e) => setInstallments(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        >
                            <option value={3}>3 期</option>
                            <option value={6}>6 期</option>
                            <option value={12}>12 期</option>
                            <option value={18}>18 期</option>
                            <option value={24}>24 期</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            手續費 (%)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={feePercent}
                            onChange={(e) => setFeePercent(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算真實成本
                </button>

                {result && (
                    <div ref={resultRef} className="mt-8 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">每月應繳</p>
                                <p className="text-3xl font-bold font-mono text-slate-800">
                                    NT$ {result.monthlyPayment.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center bg-red-50/50">
                                <p className="text-slate-500 mb-2">多付利息</p>
                                <p className="text-3xl font-bold font-mono text-red-500">
                                    NT$ {result.totalInterest.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="glass-surface rounded-xl p-4 text-center">
                            <p className="text-slate-600">
                                總付款 NT$ {result.totalPayment.toLocaleString()}，
                                換算年利率約 <span className="font-bold text-red-500">{result.interestRate}%</span>
                            </p>
                        </div>

                        {result.totalInterest > 0 && (
                            <div className="glass-card rounded-xl p-4 bg-amber-50/50 border-l-4 border-amber-400">
                                <p className="text-amber-800 text-sm">
                                    ⚠️ 提醒：這 NT$ {result.totalInterest.toLocaleString()} 是「隱形成本」，
                                    銀行 0 利率分期通常已將手續費加在商品價格中。
                                </p>
                            </div>
                        )}

                        {/* 結果操作按鈕 */}
                        <ResultActions
                            resultData={result}
                            calculatorType="信用卡分期計算器"
                            resultRef={resultRef}
                            shareTitle="TaiCalc 信用卡分期計算結果"
                            shareDescription={`月付 NT$ ${result.monthlyPayment.toLocaleString()}，利息 NT$ ${result.totalInterest.toLocaleString()}`}
                        />
                    </div>
                )}

                <div className="mt-8 text-sm text-slate-400 text-center">
                    💡 0 利率不等於 0 成本
                </div>

                <div className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">常見問題</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-slate-700">Q：0 利率分期真的免費嗎？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                大多數情況不是。商家通常已將手續費加入商品價格，或由銀行補貼。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
