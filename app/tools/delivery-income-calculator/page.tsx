'use client';

import { useState, useCallback } from 'react';

interface DeliveryResult {
    daily: number;
    weekly: number;
    monthly: number;
    hourlyRate: number;
}

export default function DeliveryIncomeCalculatorPage() {
    const [avgOrderPay, setAvgOrderPay] = useState(65);
    const [ordersPerDay, setOrdersPerDay] = useState(15);
    const [hoursPerDay, setHoursPerDay] = useState(6);
    const [daysPerWeek, setDaysPerWeek] = useState(5);
    const [result, setResult] = useState<DeliveryResult | null>(null);

    const handleCalculate = useCallback(() => {
        const daily = avgOrderPay * ordersPerDay;
        const weekly = daily * daysPerWeek;
        const monthly = weekly * 4;
        const hourlyRate = hoursPerDay > 0 ? Math.round(daily / hoursPerDay) : 0;

        setResult({ daily, weekly, monthly, hourlyRate });
    }, [avgOrderPay, ordersPerDay, hoursPerDay, daysPerWeek]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">外送收入計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    不跑不知道，一算才知道你在賺還是累。快速估算外送員日、週、月收入。
                </p>

                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 評估外送是否值得跑</li>
                        <li>• 比較全職與兼職收入</li>
                        <li>• 設定每月收入目標</li>
                    </ul>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            每單平均收入 (NT$)
                        </label>
                        <input
                            type="number"
                            value={avgOrderPay}
                            onChange={(e) => setAvgOrderPay(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            每天接單數
                        </label>
                        <input
                            type="number"
                            value={ordersPerDay}
                            onChange={(e) => setOrdersPerDay(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            每天工作時數
                        </label>
                        <input
                            type="number"
                            value={hoursPerDay}
                            onChange={(e) => setHoursPerDay(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            每週工作天數
                        </label>
                        <input
                            type="number"
                            value={daysPerWeek}
                            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算收入
                </button>

                {result && (
                    <div className="mt-8 space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">日收入</p>
                                <p className="text-2xl font-bold font-mono text-slate-800">
                                    NT$ {result.daily.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">週收入</p>
                                <p className="text-2xl font-bold font-mono text-indigo-600">
                                    NT$ {result.weekly.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">月收入</p>
                                <p className="text-2xl font-bold font-mono text-gradient-primary">
                                    NT$ {result.monthly.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="glass-surface rounded-xl p-4 text-center">
                            <p className="text-slate-600">
                                換算時薪約 <span className="font-bold text-indigo-600">NT$ {result.hourlyRate}</span>
                                {result.hourlyRate >= 183
                                    ? ' ✅ 高於基本工資'
                                    : ' ⚠️ 低於基本工資 (NT$ 183)'}
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-8 text-sm text-slate-400 text-center">
                    💡 未扣除油錢、車損、保險等成本
                </div>

                <div className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">常見問題</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-slate-700">Q：這是淨利嗎？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                不是，這是毛收入。實際淨利需扣除油錢、車損、手機費等成本。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
