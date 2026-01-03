'use client';

import { useState, useCallback, useRef } from 'react';
import { ResultActions } from '@/components/shared';

interface CostResult {
    totalCost: number;
    unitCost: number;
    margin: number;
    breakeven: number;
}

export default function CostCalculatorPage() {
    const [materialCost, setMaterialCost] = useState(1000);
    const [laborCost, setLaborCost] = useState(500);
    const [overheadCost, setOverheadCost] = useState(200);
    const [quantity, setQuantity] = useState(10);
    const [sellingPrice, setSellingPrice] = useState(250);
    const [result, setResult] = useState<CostResult | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const handleCalculate = useCallback(() => {
        const totalCost = materialCost + laborCost + overheadCost;
        const unitCost = quantity > 0 ? totalCost / quantity : 0;
        const margin = sellingPrice > 0 ? ((sellingPrice - unitCost) / sellingPrice) * 100 : 0;
        const breakeven = unitCost > 0 && sellingPrice > unitCost
            ? Math.ceil(totalCost / (sellingPrice - unitCost))
            : 0;

        setResult({
            totalCost: Math.round(totalCost),
            unitCost: Math.round(unitCost * 100) / 100,
            margin: Math.round(margin * 10) / 10,
            breakeven,
        });
    }, [materialCost, laborCost, overheadCost, quantity, sellingPrice]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                {/* H1 + 用途說明 */}
                <h1 className="text-3xl font-bold text-slate-900 mb-3">成本計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    快速計算產品或服務的實際成本，避免報價錯誤或低估支出，讓每一筆生意都算得清楚。
                </p>

                {/* 使用情境 */}
                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 接案前確認是否會虧錢</li>
                        <li>• 商品定價前估算成本結構</li>
                        <li>• 比較不同方案的成本差異</li>
                    </ul>
                </div>

                {/* 計算器 UI */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            材料成本 (NT$)
                        </label>
                        <input
                            type="number"
                            value={materialCost}
                            onChange={(e) => setMaterialCost(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            人工成本 (NT$)
                        </label>
                        <input
                            type="number"
                            value={laborCost}
                            onChange={(e) => setLaborCost(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            其他費用 (NT$)
                        </label>
                        <input
                            type="number"
                            value={overheadCost}
                            onChange={(e) => setOverheadCost(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            預計數量
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            預計售價 (NT$)
                        </label>
                        <input
                            type="number"
                            value={sellingPrice}
                            onChange={(e) => setSellingPrice(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算成本
                </button>

                {/* 結果區 */}
                {result && (
                    <div ref={resultRef} className="mt-8 space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">總成本</p>
                                <p className="text-3xl font-bold font-mono text-slate-800">
                                    NT$ {result.totalCost.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">單位成本</p>
                                <p className="text-3xl font-bold font-mono text-gradient-primary">
                                    NT$ {result.unitCost.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">毛利率</p>
                                <p className={`text-3xl font-bold font-mono ${result.margin >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {result.margin}%
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">損益兩平數量</p>
                                <p className="text-3xl font-bold font-mono text-indigo-600">
                                    {result.breakeven > 0 ? `${result.breakeven} 件` : '—'}
                                </p>
                            </div>
                        </div>

                        {/* 簡單解釋 */}
                        <div className="glass-surface rounded-xl p-4 text-center text-slate-600">
                            {result.margin >= 20
                                ? '✅ 利潤空間健康，可考慮執行'
                                : result.margin >= 0
                                    ? '⚠️ 利潤偏低，建議重新評估定價或成本'
                                    : '❌ 目前定價會虧損，請調整'}
                        </div>

                        {/* 結果操作按鈕 */}
                        <ResultActions
                            resultData={result}
                            calculatorType="成本計算器"
                            resultRef={resultRef}
                            shareTitle="TaiCalc 成本計算結果"
                            shareDescription={`總成本 NT$ ${result.totalCost.toLocaleString()}，毛利率 ${result.margin}%`}
                        />
                    </div>
                )}

                {/* 小提醒 */}
                <div className="mt-8 text-sm text-slate-400 text-center">
                    💡 結果僅供參考，實際請依情況調整
                </div>

                {/* FAQ */}
                <div className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">常見問題</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-slate-700">Q：計算結果準確嗎？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                只要輸入正確數據，結果即時且精準。建議多嘗試不同情境來比較。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-700">Q：其他費用應該包含什麼？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                可包含運費、包材、水電、租金分攤等間接成本。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
