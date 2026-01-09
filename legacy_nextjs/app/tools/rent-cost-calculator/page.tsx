'use client';

import { useState, useCallback } from 'react';

interface RentResult {
    totalMonthly: number;
    totalYearly: number;
    breakdown: { item: string; amount: number }[];
}

export default function RentCostCalculatorPage() {
    const [rent, setRent] = useState(15000);
    const [managementFee, setManagementFee] = useState(800);
    const [electricity, setElectricity] = useState(800);
    const [water, setWater] = useState(200);
    const [gas, setGas] = useState(300);
    const [internet, setInternet] = useState(500);
    const [result, setResult] = useState<RentResult | null>(null);

    const handleCalculate = useCallback(() => {
        const breakdown = [
            { item: '房租', amount: rent },
            { item: '管理費', amount: managementFee },
            { item: '電費', amount: electricity },
            { item: '水費', amount: water },
            { item: '瓦斯', amount: gas },
            { item: '網路', amount: internet },
        ].filter(item => item.amount > 0);

        const totalMonthly = breakdown.reduce((sum, item) => sum + item.amount, 0);

        setResult({
            totalMonthly,
            totalYearly: totalMonthly * 12,
            breakdown,
        });
    }, [rent, managementFee, electricity, water, gas, internet]);

    return (
        <div className="container max-w-4xl mx-auto px-4 pt-24 pb-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">租屋成本計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    房租不是全部，這才是你每月真正花的錢。
                </p>

                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 比較不同租屋的真實成本</li>
                        <li>• 規劃每月固定支出</li>
                        <li>• 評估是否超出預算</li>
                    </ul>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            房租 (NT$)
                        </label>
                        <input
                            type="number"
                            value={rent}
                            onChange={(e) => setRent(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            管理費 (NT$)
                        </label>
                        <input
                            type="number"
                            value={managementFee}
                            onChange={(e) => setManagementFee(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            電費 (NT$)
                        </label>
                        <input
                            type="number"
                            value={electricity}
                            onChange={(e) => setElectricity(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            水費 (NT$)
                        </label>
                        <input
                            type="number"
                            value={water}
                            onChange={(e) => setWater(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            瓦斯 (NT$)
                        </label>
                        <input
                            type="number"
                            value={gas}
                            onChange={(e) => setGas(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            網路 (NT$)
                        </label>
                        <input
                            type="number"
                            value={internet}
                            onChange={(e) => setInternet(Number(e.target.value))}
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
                    <div className="mt-8 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">每月實際支出</p>
                                <p className="text-4xl font-bold font-mono text-gradient-primary">
                                    NT$ {result.totalMonthly.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">年度總支出</p>
                                <p className="text-4xl font-bold font-mono text-slate-800">
                                    NT$ {result.totalYearly.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="glass-surface rounded-xl p-4">
                            <p className="text-sm text-slate-500 mb-3">費用明細</p>
                            <div className="space-y-2">
                                {result.breakdown.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-slate-600">{item.item}</span>
                                        <span className="font-mono font-medium">
                                            NT$ {item.amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {result.totalMonthly > rent * 1.2 && (
                            <div className="glass-card rounded-xl p-4 bg-amber-50/50 border-l-4 border-amber-400">
                                <p className="text-amber-800 text-sm">
                                    ⚠️ 額外費用佔房租的 {Math.round((result.totalMonthly - rent) / rent * 100)}%，
                                    比較租屋時別只看房租！
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 text-sm text-slate-400 text-center">
                    💡 建議租屋總支出控制在月收入 30% 以內
                </div>

                <div className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">常見問題</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-slate-700">Q：房東收一度 5 元電費合理嗎？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                台電住宅電價約 2-7 元/度（依級距），5 元算中等。建議用電費計算器估算。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
