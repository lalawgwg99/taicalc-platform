'use client';

import { useState, useCallback } from 'react';

interface WorkHoursResult {
    totalHours: number;
    totalMinutes: number;
    hourlyRate: number;
    totalPay: number;
}

export default function WorkHoursCalculatorPage() {
    const [startHour, setStartHour] = useState(9);
    const [startMinute, setStartMinute] = useState(0);
    const [endHour, setEndHour] = useState(18);
    const [endMinute, setEndMinute] = useState(0);
    const [breakMinutes, setBreakMinutes] = useState(60);
    const [hourlyWage, setHourlyWage] = useState(183);
    const [result, setResult] = useState<WorkHoursResult | null>(null);

    const handleCalculate = useCallback(() => {
        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;
        let workMinutes = endTotal - startTotal - breakMinutes;
        if (workMinutes < 0) workMinutes = 0;

        const hours = Math.floor(workMinutes / 60);
        const minutes = workMinutes % 60;
        const decimalHours = workMinutes / 60;
        const totalPay = decimalHours * hourlyWage;

        setResult({
            totalHours: hours,
            totalMinutes: minutes,
            hourlyRate: hourlyWage,
            totalPay: Math.round(totalPay),
        });
    }, [startHour, startMinute, endHour, endMinute, breakMinutes, hourlyWage]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">工時計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    快速計算上班時數與薪資，適用於時薪、兼職、計時工作者。
                </p>

                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 兼職工時與薪資核算</li>
                        <li>• 加班費計算</li>
                        <li>• 時間管理與效率評估</li>
                    </ul>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            上班時間
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={startHour}
                                onChange={(e) => setStartHour(Number(e.target.value))}
                                className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                                placeholder="時"
                            />
                            <span className="flex items-center text-slate-500">:</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={startMinute}
                                onChange={(e) => setStartMinute(Number(e.target.value))}
                                className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                                placeholder="分"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            下班時間
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={endHour}
                                onChange={(e) => setEndHour(Number(e.target.value))}
                                className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                                placeholder="時"
                            />
                            <span className="flex items-center text-slate-500">:</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={endMinute}
                                onChange={(e) => setEndMinute(Number(e.target.value))}
                                className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                                placeholder="分"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            休息時間 (分鐘)
                        </label>
                        <input
                            type="number"
                            value={breakMinutes}
                            onChange={(e) => setBreakMinutes(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            時薪 (NT$)
                        </label>
                        <input
                            type="number"
                            value={hourlyWage}
                            onChange={(e) => setHourlyWage(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算工時
                </button>

                {result && (
                    <div className="mt-8 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">實際工時</p>
                                <p className="text-3xl font-bold font-mono text-slate-800">
                                    {result.totalHours} 小時 {result.totalMinutes} 分
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">應得薪資</p>
                                <p className="text-3xl font-bold font-mono text-gradient-primary">
                                    NT$ {result.totalPay.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 text-sm text-slate-400 text-center">
                    💡 2025 年基本時薪為 NT$ 183
                </div>

                <div className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">常見問題</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-slate-700">Q：加班費怎麼算？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                加班時薪通常為平時時薪的 1.34 倍或 1.67 倍，請依勞基法或公司規定調整。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-700">Q：休息時間要扣除嗎？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                一般午休不計入工時，系統會自動扣除您輸入的休息時間。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
