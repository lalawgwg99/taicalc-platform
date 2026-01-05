'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart as PieChartIcon, Info, Sparkles, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

// 動態導入圖表元件,禁用 SSR 以避免 recharts 錯誤
const CompoundGrowthChart = dynamic(() => import('@/components/charts/CompoundGrowthChart'), {
    ssr: false,
    loading: () => <div className="w-full h-80 bg-gray-100 rounded-lg animate-pulse" />
});

const PrincipalInterestChart = dynamic(() => import('@/components/charts/PrincipalInterestChart'), {
    ssr: false,
    loading: () => <div className="w-full h-80 bg-gray-100 rounded-lg animate-pulse" />
});

interface CompoundResult {
    futureValue: number;
    totalContributions: number;
    totalInterest: number;
    yearlyBreakdown: Array<{ year: number; value: number; interest: number }>;
}

interface GrowthData {
    year: number;
    principal: number;
    interest: number;
    total: number;
}

function calculateCompound(
    principal: number,
    monthlyContribution: number,
    annualRate: number,
    years: number
): CompoundResult {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    let balance = principal;
    const yearlyBreakdown: CompoundResult['yearlyBreakdown'] = [];

    for (let month = 1; month <= totalMonths; month++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;

        if (month % 12 === 0) {
            const year = month / 12;
            const contributed = principal + monthlyContribution * month;
            yearlyBreakdown.push({
                year,
                value: Math.round(balance),
                interest: Math.round(balance - contributed),
            });
        }
    }

    const totalContributions = principal + monthlyContribution * totalMonths;
    const totalInterest = balance - totalContributions;

    return {
        futureValue: Math.round(balance),
        totalContributions: Math.round(totalContributions),
        totalInterest: Math.round(totalInterest),
        yearlyBreakdown,
    };
}

// 預設情境
const scenarios = [
    { name: '小資族', principal: 50000, monthly: 5000, rate: 5, years: 20 },
    { name: '穩健型', principal: 100000, monthly: 10000, rate: 6, years: 20 },
    { name: '積極型', principal: 200000, monthly: 20000, rate: 8, years: 20 },
];

export default function CapitalCalculatorPage() {
    const [principal, setPrincipal] = useState(100000);
    const [monthlyContribution, setMonthlyContribution] = useState(10000);
    const [annualRate, setAnnualRate] = useState(7);
    const [years, setYears] = useState(20);
    const [result, setResult] = useState<CompoundResult | null>(null);

    // 即時計算
    useEffect(() => {
        const calcResult = calculateCompound(principal, monthlyContribution, annualRate, years);
        setResult(calcResult);
    }, [principal, monthlyContribution, annualRate, years]);

    // 情境快速填入
    const applyScenario = (scenario: typeof scenarios[0]) => {
        setPrincipal(scenario.principal);
        setMonthlyContribution(scenario.monthly);
        setAnnualRate(scenario.rate);
        setYears(scenario.years);
    };

    // 轉換資料格式供圖表使用
    const chartData: GrowthData[] = result ? result.yearlyBreakdown.map(item => ({
        year: item.year,
        principal: principal + (monthlyContribution * item.year * 12),
        interest: item.interest,
        total: item.value
    })) : [];

    // 投資報酬率 (ROI)
    const roi = result ? ((result.totalInterest / result.totalContributions) * 100).toFixed(1) : '0';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-24 px-4">
            <div className="container max-w-7xl mx-auto">
                {/* 頁首 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        看見複利的威力
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        複利計算器
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        時間是最好的朋友,越早開始投資,複利效果越驚人
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* 左側: 輸入區 */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24"
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                投資參數
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        初始本金 (NT$)
                                    </label>
                                    <input
                                        type="number"
                                        value={principal}
                                        onChange={(e) => setPrincipal(Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-lg font-semibold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        每月投入 (NT$)
                                    </label>
                                    <input
                                        type="number"
                                        value={monthlyContribution}
                                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-lg font-semibold"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">💡 建議每月至少存入收入的20%</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        年化報酬率 (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={annualRate}
                                        onChange={(e) => setAnnualRate(Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-lg font-semibold"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">💡 台股0050長期約7-8%</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        投資年限 (年)
                                    </label>
                                    <input
                                        type="number"
                                        value={years}
                                        onChange={(e) => setYears(Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-lg font-semibold"
                                    />
                                </div>
                            </div>

                            {/* 情境快速選擇 */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-sm font-medium text-gray-700 mb-3">快速情境</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {scenarios.map((scenario) => (
                                        <button
                                            key={scenario.name}
                                            onClick={() => applyScenario(scenario)}
                                            className="px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors font-medium"
                                        >
                                            {scenario.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 即時預覽 */}
                            {result && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4">
                                        <p className="text-sm text-gray-600 mb-1">預估最終資產</p>
                                        <p className="text-3xl font-bold text-purple-600">
                                            NT$ {result.futureValue.toLocaleString()}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between text-sm">
                                            <span className="text-gray-600">投資報酬率</span>
                                            <span className="font-bold text-green-600">{roi}%</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* 右側: 結果與圖表 */}
                    <div className="lg:col-span-2">
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* 核心數據卡片 */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
                                        <p className="text-blue-100 mb-1">最終價值</p>
                                        <p className="text-3xl font-bold">
                                            {(result.futureValue / 10000).toFixed(0)}萬
                                        </p>
                                        <p className="text-sm text-blue-100 mt-2">NT$ {result.futureValue.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                        <p className="text-gray-500 mb-1">總投入</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {(result.totalContributions / 10000).toFixed(0)}萬
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">NT$ {result.totalContributions.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
                                        <p className="text-green-100 mb-1">複利收益</p>
                                        <p className="text-3xl font-bold">
                                            +{(result.totalInterest / 10000).toFixed(0)}萬
                                        </p>
                                        <p className="text-sm text-green-100 mt-2">NT$ {result.totalInterest.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* 成長曲線圖 */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        資產成長曲線
                                    </h3>
                                    <CompoundGrowthChart data={chartData} />
                                </div>

                                {/* 圓餅圖 */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <PieChartIcon className="w-5 h-5 text-purple-600" />
                                        本金 vs 收益比例
                                    </h3>
                                    <PrincipalInterestChart
                                        principal={result.totalContributions}
                                        interest={result.totalInterest}
                                    />
                                </div>

                                {/* 複利說明卡片 */}
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                                    <div className="flex items-start gap-3">
                                        <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">💡 複利效果說明</h4>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                以您的投資為例,{years}年後的 <span className="font-bold text-green-600">NT$ {result.totalInterest.toLocaleString()}</span> 收益,
                                                是靠「利滾利」產生的。這就是愛因斯坦所說的「世界第八大奇蹟」。
                                                <span className="font-semibold text-amber-700"> 越早開始,複利效果越驚人!</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 報酬率比較表 */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-yellow-600" />
                                        不同報酬率比較
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 text-gray-700">年化報酬率</th>
                                                    <th className="text-right py-3 px-4 text-gray-700">最終資產</th>
                                                    <th className="text-right py-3 px-4 text-gray-700">複利收益</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[3, 5, 7, 10].map(rate => {
                                                    const tempResult = calculateCompound(principal, monthlyContribution, rate, years);
                                                    return (
                                                        <tr key={rate} className={`border-b border-gray-100 ${rate === annualRate ? 'bg-purple-50' : ''}`}>
                                                            <td className="py-3 px-4 font-medium">{rate}%</td>
                                                            <td className="text-right py-3 px-4 font-mono">
                                                                NT$ {tempResult.futureValue.toLocaleString()}
                                                            </td>
                                                            <td className="text-right py-3 px-4 font-mono text-green-600">
                                                                +NT$ {tempResult.totalInterest.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">
                                        💡 相同投入下,報酬率差3%,長期累積差異可達數百萬
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
