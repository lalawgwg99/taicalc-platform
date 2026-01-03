'use client';

import { useState, useCallback } from 'react';

interface ElectricityResult {
    totalCost: number;
    breakdown: { tier: string; kwh: number; rate: number; cost: number }[];
    avgRate: number;
}

// 台電 2024 夏月電價級距（住宅用電）
const SUMMER_RATES = [
    { limit: 120, rate: 1.68 },
    { limit: 330, rate: 2.45 },
    { limit: 500, rate: 3.70 },
    { limit: 700, rate: 5.04 },
    { limit: 1000, rate: 6.03 },
    { limit: Infinity, rate: 7.69 },
];

const NON_SUMMER_RATES = [
    { limit: 120, rate: 1.68 },
    { limit: 330, rate: 2.16 },
    { limit: 500, rate: 3.03 },
    { limit: 700, rate: 4.14 },
    { limit: 1000, rate: 5.07 },
    { limit: Infinity, rate: 6.63 },
];

export default function ElectricityCalculatorPage() {
    const [kwh, setKwh] = useState(400);
    const [isSummer, setIsSummer] = useState(true);
    const [result, setResult] = useState<ElectricityResult | null>(null);

    const handleCalculate = useCallback(() => {
        const rates = isSummer ? SUMMER_RATES : NON_SUMMER_RATES;
        let remaining = kwh;
        let prevLimit = 0;
        const breakdown: ElectricityResult['breakdown'] = [];
        let totalCost = 0;

        for (const tier of rates) {
            if (remaining <= 0) break;
            const tierKwh = Math.min(remaining, tier.limit - prevLimit);
            const tierCost = Math.round(tierKwh * tier.rate * 10) / 10;

            if (tierKwh > 0) {
                breakdown.push({
                    tier: `${prevLimit + 1}~${tier.limit === Infinity ? '以上' : tier.limit} 度`,
                    kwh: tierKwh,
                    rate: tier.rate,
                    cost: tierCost,
                });
                totalCost += tierCost;
            }

            remaining -= tierKwh;
            prevLimit = tier.limit;
        }

        setResult({
            totalCost: Math.round(totalCost),
            breakdown,
            avgRate: kwh > 0 ? Math.round((totalCost / kwh) * 100) / 100 : 0,
        });
    }, [kwh, isSummer]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">電費試算計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    不是你用太多電，是級距在吃你錢。依台電累進電價計算。
                </p>

                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 估算每月電費支出</li>
                        <li>• 理解電費級距怎麼算</li>
                        <li>• 評估省電效益</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">計費季節</label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsSummer(true)}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${isSummer
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white/50 text-slate-600 hover:bg-white'
                                }`}
                        >
                            🌞 夏月 (6-9月)
                        </button>
                        <button
                            onClick={() => setIsSummer(false)}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${!isSummer
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/50 text-slate-600 hover:bg-white'
                                }`}
                        >
                            ❄️ 非夏月
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        用電度數 (度/月)
                    </label>
                    <input
                        type="number"
                        value={kwh}
                        onChange={(e) => setKwh(Number(e.target.value))}
                        className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                    />
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算電費
                </button>

                {result && (
                    <div className="mt-8 space-y-4">
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <p className="text-slate-500 mb-2">預估電費</p>
                            <p className="text-5xl font-bold font-mono text-gradient-primary">
                                NT$ {result.totalCost.toLocaleString()}
                            </p>
                            <p className="text-slate-400 mt-3 text-sm">
                                平均每度 NT$ {result.avgRate}
                            </p>
                        </div>

                        <div className="glass-surface rounded-xl p-4">
                            <p className="text-sm text-slate-500 mb-3">級距明細</p>
                            <div className="space-y-2">
                                {result.breakdown.map((tier, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-slate-600">{tier.tier}</span>
                                        <span className="font-mono">
                                            {tier.kwh} 度 × ${tier.rate} =
                                            <span className={i === result.breakdown.length - 1 && result.breakdown.length > 1 ? ' text-red-500 font-semibold' : ''}>
                                                ${tier.cost}
                                            </span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {result.breakdown.length > 2 && (
                            <div className="glass-card rounded-xl p-4 bg-amber-50/50 border-l-4 border-amber-400">
                                <p className="text-amber-800 text-sm">
                                    ⚠️ 高級距用電貴很多！最後一級每度 ${result.breakdown[result.breakdown.length - 1].rate}，
                                    比第一級貴 {Math.round((result.breakdown[result.breakdown.length - 1].rate / result.breakdown[0].rate - 1) * 100)}%
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 text-sm text-slate-400 text-center">
                    💡 依台電 2024 年電價表計算，僅供參考
                </div>

                <div className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">常見問題</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-slate-700">Q：為什麼夏天電費特別貴？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                6-9 月是夏月電價，每個級距的單價都比非夏月高。加上冷氣用電量大，雙重影響。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
