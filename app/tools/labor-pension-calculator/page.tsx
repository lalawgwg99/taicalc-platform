'use client';

import { useState, useCallback } from 'react';

interface RetirementResult {
    monthlyPension: { min: number; max: number };
    lumpSum: { min: number; max: number };
    yearsOfService: number;
}

export default function LaborPensionCalculatorPage() {
    const [avgSalary, setAvgSalary] = useState(45000);
    const [yearsOfService, setYearsOfService] = useState(30);
    const [selfContribution, setSelfContribution] = useState(6);
    const [result, setResult] = useState<RetirementResult | null>(null);

    const handleCalculate = useCallback(() => {
        // 勞保老年給付（月領）簡易估算
        // 公式：平均月投保薪資 × 年資 × 0.775% + 3,000
        const basePension = avgSalary * yearsOfService * 0.00775 + 3000;

        // 勞退新制（假設 6% 自提 + 6% 雇主）
        // 簡易年化報酬 2-4%
        const monthlyContrib = avgSalary * (0.06 + selfContribution / 100);
        const months = yearsOfService * 12;
        const laborRetirementLow = Math.round(monthlyContrib * months * 1.02 ** (yearsOfService / 2));
        const laborRetirementHigh = Math.round(monthlyContrib * months * 1.04 ** (yearsOfService / 2));

        // 月領轉換（除以 200 個月粗估）
        const monthlyFromRetirement = {
            min: Math.round(laborRetirementLow / 200),
            max: Math.round(laborRetirementHigh / 200),
        };

        setResult({
            monthlyPension: {
                min: Math.round(basePension * 0.9 + monthlyFromRetirement.min),
                max: Math.round(basePension * 1.1 + monthlyFromRetirement.max),
            },
            lumpSum: {
                min: laborRetirementLow,
                max: laborRetirementHigh,
            },
            yearsOfService,
        });
    }, [avgSalary, yearsOfService, selfContribution]);

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">勞保退休金計算器</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    不用看規則，也能知道你退休大概拿多少。勞保 + 勞退概算。
                </p>

                <div className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">📌 使用情境</h2>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• 估算退休後每月可領多少</li>
                        <li>• 評估是否需要額外儲蓄</li>
                        <li>• 決定勞退自提比例</li>
                    </ul>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            平均月薪 (NT$)
                        </label>
                        <input
                            type="number"
                            value={avgSalary}
                            onChange={(e) => setAvgSalary(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            預計年資 (年)
                        </label>
                        <input
                            type="number"
                            value={yearsOfService}
                            onChange={(e) => setYearsOfService(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            勞退自提 (%)
                        </label>
                        <select
                            value={selfContribution}
                            onChange={(e) => setSelfContribution(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        >
                            <option value={0}>0%（不自提）</option>
                            <option value={1}>1%</option>
                            <option value={2}>2%</option>
                            <option value={3}>3%</option>
                            <option value={4}>4%</option>
                            <option value={5}>5%</option>
                            <option value={6}>6%（最高）</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    估算退休金
                </button>

                {result && (
                    <div className="mt-8 space-y-4">
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <p className="text-slate-500 mb-2">退休後每月可領（概估）</p>
                            <p className="text-4xl font-bold font-mono text-gradient-primary">
                                NT$ {result.monthlyPension.min.toLocaleString()} ~ {result.monthlyPension.max.toLocaleString()}
                            </p>
                            <p className="text-slate-400 mt-3 text-sm">
                                含勞保年金 + 勞退月領
                            </p>
                        </div>

                        <div className="glass-card rounded-2xl p-6 text-center">
                            <p className="text-slate-500 mb-2">勞退帳戶累積（一次領）</p>
                            <p className="text-2xl font-bold font-mono text-indigo-600">
                                NT$ {result.lumpSum.min.toLocaleString()} ~ {result.lumpSum.max.toLocaleString()}
                            </p>
                            <p className="text-slate-400 mt-2 text-sm">
                                工作 {result.yearsOfService} 年累積，報酬率 2-4% 估算
                            </p>
                        </div>

                        <div className="glass-surface rounded-xl p-4 text-center text-slate-600 text-sm">
                            {result.monthlyPension.max < avgSalary * 0.6
                                ? '⚠️ 退休金可能低於現有薪資 60%，建議增加自提或額外儲蓄'
                                : '✅ 退休金水準尚可，但仍建議保持儲蓄習慣'}
                        </div>
                    </div>
                )}

                <div className="mt-8 text-sm text-slate-400 text-center">
                    💡 此為概估，實際金額以勞保局試算為準
                </div>

                <div className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">常見問題</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-slate-700">Q：勞退自提 6% 划算嗎？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                自提可節稅（從薪資扣除），且享有最低保證收益。高薪族較划算。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-700">Q：勞保和勞退有什麼差別？</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                勞保是社會保險（年金），勞退是個人帳戶。兩者都會領到。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
