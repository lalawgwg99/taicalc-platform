'use client';

import { useState, useCallback } from 'react';

type CalcMode = 'findPercentage' | 'findValue' | 'findOriginal' | 'percentChange';

export default function PercentageCalculatorPage() {
    const [mode, setMode] = useState<CalcMode>('findPercentage');
    const [valueA, setValueA] = useState(25);
    const [valueB, setValueB] = useState(100);
    const [result, setResult] = useState<string | null>(null);

    const handleCalculate = useCallback(() => {
        let res: number;
        switch (mode) {
            case 'findPercentage':
                res = valueB > 0 ? (valueA / valueB) * 100 : 0;
                setResult(`${valueA} 是 ${valueB} 的 ${Math.round(res * 100) / 100}%`);
                break;
            case 'findValue':
                res = (valueA / 100) * valueB;
                setResult(`${valueB} 的 ${valueA}% = ${Math.round(res * 100) / 100}`);
                break;
            case 'findOriginal':
                res = valueA > 0 ? (valueB / valueA) * 100 : 0;
                setResult(`如果 ${valueB} 是 ${valueA}%，原值 = ${Math.round(res * 100) / 100}`);
                break;
            case 'percentChange':
                res = valueA > 0 ? ((valueB - valueA) / valueA) * 100 : 0;
                setResult(`從 ${valueA} 到 ${valueB} 的變化率 = ${res >= 0 ? '+' : ''}${Math.round(res * 100) / 100}%`);
                break;
        }
    }, [mode, valueA, valueB]);

    const labels = {
        findPercentage: { a: '部分值', b: '整體值' },
        findValue: { a: '百分比 (%)', b: '整體值' },
        findOriginal: { a: '已知百分比 (%)', b: '已知值' },
        percentChange: { a: '原始值', b: '新值' },
    };

    return (
        <div className="container max-w-4xl mx-auto px-4 pt-24 pb-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">百分比計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    快速計算百分比、求原值或計算變化率，適用於各種日常與商業情境。
                </p>

                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 計算折扣後價格</li>
                        <li>• 算出佔比是多少%</li>
                        <li>• 比較兩個數字的變化率</li>
                    </ul>
                </div>

                {/* 模式選擇 */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">計算類型</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                            { value: 'findPercentage', label: '求百分比' },
                            { value: 'findValue', label: '求數值' },
                            { value: 'findOriginal', label: '求原值' },
                            { value: 'percentChange', label: '變化率' },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setMode(opt.value as CalcMode)}
                                className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${mode === opt.value
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white/50 text-slate-600 hover:bg-white'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {labels[mode].a}
                        </label>
                        <input
                            type="number"
                            value={valueA}
                            onChange={(e) => setValueA(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {labels[mode].b}
                        </label>
                        <input
                            type="number"
                            value={valueB}
                            onChange={(e) => setValueB(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算
                </button>

                {result && (
                    <div className="mt-8">
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <p className="text-2xl font-bold text-gradient-primary">
                                {result}
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
                            <h3 className="font-medium text-slate-700">Q：怎麼計算打 8 折後的價格？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                選擇「求數值」，輸入百分比 80，整體值輸入原價。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-700">Q：如何知道考試進步了多少%？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                選擇「變化率」，原始值輸入原分數，新值輸入新分數。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
