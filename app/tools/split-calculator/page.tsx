'use client';

import { useState, useCallback } from 'react';

interface SplitResult {
    perPerson: number;
    total: number;
    people: number;
}

export default function SplitCalculatorPage() {
    const [total, setTotal] = useState(3000);
    const [people, setPeople] = useState(4);
    const [tipPercent, setTipPercent] = useState(0);
    const [result, setResult] = useState<SplitResult | null>(null);

    const handleCalculate = useCallback(() => {
        const tipAmount = total * (tipPercent / 100);
        const finalTotal = total + tipAmount;
        const perPerson = people > 0 ? finalTotal / people : 0;

        setResult({
            perPerson: Math.ceil(perPerson),
            total: Math.round(finalTotal),
            people,
        });
    }, [total, people, tipPercent]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">分攤計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    快速計算聚餐、合租、團購等費用如何平均分攤，省去尷尬的計算時間。
                </p>

                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 聚餐結帳平分費用</li>
                        <li>• 合租水電瓦斯分攤</li>
                        <li>• 團購金額計算</li>
                    </ul>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            總金額 (NT$)
                        </label>
                        <input
                            type="number"
                            value={total}
                            onChange={(e) => setTotal(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            分攤人數
                        </label>
                        <input
                            type="number"
                            value={people}
                            onChange={(e) => setPeople(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            服務費 (%)
                        </label>
                        <input
                            type="number"
                            value={tipPercent}
                            onChange={(e) => setTipPercent(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算分攤
                </button>

                {result && (
                    <div className="mt-8">
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <p className="text-slate-500 mb-2">每人應付</p>
                            <p className="text-5xl font-bold font-mono text-gradient-primary">
                                NT$ {result.perPerson.toLocaleString()}
                            </p>
                            <p className="text-slate-400 mt-4 text-sm">
                                總額 NT$ {result.total.toLocaleString()} ÷ {result.people} 人
                            </p>
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
                            <h3 className="font-medium text-slate-700">Q：服務費要怎麼算？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                一般餐廳服務費為 10%，輸入 10 即可自動加進總額計算。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-700">Q：小數點怎麼處理？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                系統會自動無條件進位，確保不會少收。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
