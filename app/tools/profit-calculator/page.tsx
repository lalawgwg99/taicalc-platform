'use client';

import { useState, useCallback } from 'react';

interface ProfitResult {
    revenue: number;
    cost: number;
    grossProfit: number;
    profitMargin: number;
    markup: number;
}

export default function ProfitCalculatorPage() {
    const [sellingPrice, setSellingPrice] = useState(1000);
    const [costPrice, setCostPrice] = useState(600);
    const [quantity, setQuantity] = useState(100);
    const [result, setResult] = useState<ProfitResult | null>(null);

    const handleCalculate = useCallback(() => {
        const revenue = sellingPrice * quantity;
        const cost = costPrice * quantity;
        const grossProfit = revenue - cost;
        const profitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        const markup = costPrice > 0 ? ((sellingPrice - costPrice) / costPrice) * 100 : 0;

        setResult({
            revenue,
            cost,
            grossProfit,
            profitMargin: Math.round(profitMargin * 10) / 10,
            markup: Math.round(markup * 10) / 10,
        });
    }, [sellingPrice, costPrice, quantity]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">利潤計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    快速計算銷售利潤與利潤率，幫助你評估每筆交易是否值得做。
                </p>

                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 評估商品定價是否合理</li>
                        <li>• 比較不同產品的獲利能力</li>
                        <li>• 快速試算促銷折扣後的利潤</li>
                    </ul>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            售價 (NT$)
                        </label>
                        <input
                            type="number"
                            value={sellingPrice}
                            onChange={(e) => setSellingPrice(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            成本 (NT$)
                        </label>
                        <input
                            type="number"
                            value={costPrice}
                            onChange={(e) => setCostPrice(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            數量
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算利潤
                </button>

                {result && (
                    <div className="mt-8 space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">總營收</p>
                                <p className="text-2xl font-bold font-mono text-slate-800">
                                    NT$ {result.revenue.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">總成本</p>
                                <p className="text-2xl font-bold font-mono text-red-500">
                                    NT$ {result.cost.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">毛利</p>
                                <p className={`text-2xl font-bold font-mono ${result.grossProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    NT$ {result.grossProfit.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">利潤率</p>
                                <p className="text-3xl font-bold font-mono text-gradient-primary">
                                    {result.profitMargin}%
                                </p>
                                <p className="text-xs text-slate-400 mt-1">毛利 ÷ 營收</p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">加價率</p>
                                <p className="text-3xl font-bold font-mono text-indigo-600">
                                    {result.markup}%
                                </p>
                                <p className="text-xs text-slate-400 mt-1">利潤 ÷ 成本</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 text-sm text-slate-400 text-center">
                    💡 結果僅供參考，實際請依情況調整
                </div>

                <div className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">常見問題</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-slate-700">Q：利潤率和加價率有什麼差別？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                利潤率是以售價為基準，加價率是以成本為基準。兩者用途不同。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-700">Q：多少利潤率算健康？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                一般商品 20% 以上算健康，服務業可達 30-50%，視產業而定。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
