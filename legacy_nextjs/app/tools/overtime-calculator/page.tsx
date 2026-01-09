'use client';

import { useState, useCallback } from 'react';

type OvertimeType = 'weekday' | 'restday' | 'holiday';

interface OvertimeResult {
    regularRate: number;
    overtimePay: number;
    breakdown: string[];
}

export default function OvertimeCalculatorPage() {
    const [salaryType, setSalaryType] = useState<'hourly' | 'monthly'>('monthly');
    const [salary, setSalary] = useState(40000);
    const [overtimeType, setOvertimeType] = useState<OvertimeType>('weekday');
    const [hours, setHours] = useState(2);
    const [result, setResult] = useState<OvertimeResult | null>(null);

    const handleCalculate = useCallback(() => {
        // 計算時薪（月薪÷30÷8）
        const hourlyRate = salaryType === 'hourly'
            ? salary
            : Math.round(salary / 30 / 8);

        let overtimePay = 0;
        const breakdown: string[] = [];

        if (overtimeType === 'weekday') {
            // 平日加班：前 2 小時 1.34 倍，之後 1.67 倍
            const first2 = Math.min(hours, 2);
            const after2 = Math.max(hours - 2, 0);
            const pay1 = Math.round(first2 * hourlyRate * 1.34);
            const pay2 = Math.round(after2 * hourlyRate * 1.67);
            overtimePay = pay1 + pay2;
            if (first2 > 0) breakdown.push(`前 ${first2} 小時 × 1.34 倍 = NT$ ${pay1}`);
            if (after2 > 0) breakdown.push(`後 ${after2} 小時 × 1.67 倍 = NT$ ${pay2}`);
        } else if (overtimeType === 'restday') {
            // 休息日：前 2 小時 1.34 倍，3-8 小時 1.67 倍，9 小時起 2.67 倍
            const h1 = Math.min(hours, 2);
            const h2 = Math.min(Math.max(hours - 2, 0), 6);
            const h3 = Math.max(hours - 8, 0);
            const pay1 = Math.round(h1 * hourlyRate * 1.34);
            const pay2 = Math.round(h2 * hourlyRate * 1.67);
            const pay3 = Math.round(h3 * hourlyRate * 2.67);
            overtimePay = pay1 + pay2 + pay3;
            if (h1 > 0) breakdown.push(`前 2 小時 × 1.34 倍 = NT$ ${pay1}`);
            if (h2 > 0) breakdown.push(`3-8 小時 × 1.67 倍 = NT$ ${pay2}`);
            if (h3 > 0) breakdown.push(`9+ 小時 × 2.67 倍 = NT$ ${pay3}`);
        } else {
            // 國定假日：全程 2 倍
            overtimePay = Math.round(hours * hourlyRate * 2);
            breakdown.push(`${hours} 小時 × 2 倍 = NT$ ${overtimePay}`);
        }

        setResult({
            regularRate: hourlyRate,
            overtimePay,
            breakdown,
        });
    }, [salaryType, salary, overtimeType, hours]);

    return (
        <div className="container max-w-4xl mx-auto px-4 pt-24 pb-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">加班費計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    不懂勞基法沒關係，這個會幫你算對。依台灣勞基法第 24 條自動計算。
                </p>

                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 確認公司給的加班費對不對</li>
                        <li>• 評估加班是否划算</li>
                        <li>• 年終獎金或離職結算核對</li>
                    </ul>
                </div>

                {/* 薪資類型 */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">薪資類型</label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setSalaryType('monthly')}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${salaryType === 'monthly'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white/50 text-slate-600 hover:bg-white'
                                }`}
                        >
                            月薪制
                        </button>
                        <button
                            onClick={() => setSalaryType('hourly')}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${salaryType === 'hourly'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white/50 text-slate-600 hover:bg-white'
                                }`}
                        >
                            時薪制
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {salaryType === 'monthly' ? '月薪 (NT$)' : '時薪 (NT$)'}
                        </label>
                        <input
                            type="number"
                            value={salary}
                            onChange={(e) => setSalary(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            加班時數
                        </label>
                        <input
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                {/* 加班類型 */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-3">加班類型</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: 'weekday', label: '平日加班' },
                            { value: 'restday', label: '休息日' },
                            { value: 'holiday', label: '國定假日' },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setOvertimeType(opt.value as OvertimeType)}
                                className={`py-3 rounded-xl font-medium transition-all ${overtimeType === opt.value
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white/50 text-slate-600 hover:bg-white'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算加班費
                </button>

                {result && (
                    <div className="mt-8 space-y-4">
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <p className="text-slate-500 mb-2">合法加班費</p>
                            <p className="text-5xl font-bold font-mono text-gradient-primary">
                                NT$ {result.overtimePay.toLocaleString()}
                            </p>
                            <p className="text-slate-400 mt-3 text-sm">
                                您的時薪基準：NT$ {result.regularRate}
                            </p>
                        </div>

                        <div className="glass-surface rounded-xl p-4">
                            <p className="text-sm text-slate-500 mb-2">計算明細</p>
                            {result.breakdown.map((line, i) => (
                                <p key={i} className="text-slate-700 text-sm">{line}</p>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 text-sm text-slate-400 text-center">
                    💡 依據勞基法第 24 條計算，僅供參考
                </div>

                <div className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">常見問題</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-slate-700">Q：公司給的加班費比這少怎麼辦？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                可向勞動局申訴或撥打 1955 勞工諮詢專線。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
