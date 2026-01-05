'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator,
    TrendingUp,
    Eye,
    EyeOff,
    Sparkles,
    ArrowRight,
    BarChart3,
    PieChart as PieChartIcon,
    Info,
    CheckCircle,
    Wallet
} from 'lucide-react';
import {
    calculateSalary,
    calculateHistoricalComparison,
    calculateTrendAnalysis,
    SalaryInput,
    SalaryResult,
    HistoricalComparison,
    TrendAnalysis
} from '@/features/salary/logic';
import { ResultActions } from '@/components/shared';
import { ArticleRecommendations } from '@/components/knowledge';
import { InternalLinkSystem, Breadcrumb, SocialShareButtons } from '@/components/seo';
import { useCalculatorAnalytics, usePerformanceTracking } from '@/hooks/useAnalytics';

// 圖表暫時移除以排查問題

export function SalaryCalculator() {
    const [monthlySalary, setMonthlySalary] = useState(50000);
    const [bonusMonths, setBonusMonths] = useState(1);
    const [result, setResult] = useState<SalaryResult | null>(null);
    const [historicalComparison, setHistoricalComparison] = useState<HistoricalComparison | null>(null);
    const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'comparison' | 'trend'>('basic');
    const resultRef = useRef<HTMLDivElement>(null);

    // 即時預覽計算
    const previewResult = useMemo(() => {
        if (monthlySalary > 0) {
            return calculateSalary({ monthlySalary, bonusMonths });
        }
        return null;
    }, [monthlySalary, bonusMonths]);

    // 分析追蹤
    const {
        startCalculation,
        completeCalculation,
        failCalculation,
        shareResult,
        saveResult
    } = useCalculatorAnalytics('salary');
    const { trackCustomMetric } = usePerformanceTracking();

    const handleCalculate = useCallback(async () => {
        const input: SalaryInput = { monthlySalary, bonusMonths };

        try {
            setIsCalculating(true);
            startCalculation(input);
            const calculationStart = performance.now();

            // 模擬計算延遲以顯示載入動畫
            await new Promise(resolve => setTimeout(resolve, 800));

            // 基本計算
            const salaryResult = calculateSalary(input);
            setResult(salaryResult);

            // 歷史比較
            const historicalResult = calculateHistoricalComparison(input);
            setHistoricalComparison(historicalResult);

            // 趨勢分析
            const trendResult = calculateTrendAnalysis(input);
            setTrendAnalysis(trendResult);

            // 計算完成追蹤
            const calculationTime = performance.now() - calculationStart;
            trackCustomMetric('salary_calculation_time', calculationTime);

            completeCalculation(input, {
                monthly_net: salaryResult.monthly.net,
                yearly_net: salaryResult.yearly.net,
                total_deductions: salaryResult.monthly.laborInsurance + salaryResult.monthly.healthInsurance + salaryResult.monthly.laborPension
            });

        } catch (error) {
            console.error('計算錯誤:', error);
            failCalculation(input, error instanceof Error ? error.message : '未知錯誤');
        } finally {
            setIsCalculating(false);
        }
    }, [monthlySalary, bonusMonths, startCalculation, completeCalculation, failCalculation, trackCustomMetric]);

    // 麵包屑導航數據
    const breadcrumbItems = [
        { label: '首頁', href: '/' },
        { label: '計算工具', href: '/tools' },
        { label: '薪資計算器' }
    ];

    // 分享數據
    const shareData = {
        url: typeof window !== 'undefined' ? window.location.href : 'https://taicalc.com/salary',
        title: '薪資計算器 - 2025年最新勞健保費率 | TaiCalc',
        description: result
            ? `月薪 NT$ ${result.monthly.gross.toLocaleString()}，實領 NT$ ${result.monthly.net.toLocaleString()}`
            : '精準計算實際到手薪資、勞保、健保、勞退提撥。使用2025年最新費率。'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="container max-w-6xl mx-auto px-4 pt-24 pb-8">
                {/* 麵包屑導航 */}
                <Breadcrumb items={breadcrumbItems} className="mb-6" />

                {/* 主標題區域 */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" />
                            2025年最新費率
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            薪資計算器
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            精準計算實際到手薪資、勞健保、勞退提撥
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* 左側：輸入區域 */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="calculator-card p-6 sticky top-24"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg text-white">
                                    <Calculator className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">輸入薪資資訊</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        月薪 (NT$)
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="monthlySalary"
                                            type="number"
                                            value={monthlySalary}
                                            onChange={(e) => setMonthlySalary(Number(e.target.value))}
                                            className="modern-input w-full text-lg font-semibold"
                                            placeholder="請輸入月薪"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                            元
                                        </div>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        基本工資：27,470 元
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        年終獎金 (月數)
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="bonusMonths"
                                            type="number"
                                            step="0.5"
                                            value={bonusMonths}
                                            onChange={(e) => setBonusMonths(Number(e.target.value))}
                                            className="modern-input w-full text-lg font-semibold"
                                            placeholder="0"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                            個月
                                        </div>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        一般為 1-3 個月
                                    </div>
                                </div>

                                <motion.button
                                    type="button"
                                    onClick={handleCalculate}
                                    disabled={isCalculating}
                                    className="btn-primary w-full py-4 text-lg font-semibold relative overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <AnimatePresence mode="wait">
                                        {isCalculating ? (
                                            <motion.div
                                                key="calculating"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                計算中...
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="calculate"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                開始計算
                                                <ArrowRight className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>

                                {/* 快速預設值 */}
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="text-sm font-medium text-gray-700 mb-3">常用薪資範圍</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[30000, 40000, 50000, 60000].map((salary) => (
                                            <button
                                                key={salary}
                                                onClick={() => setMonthlySalary(salary)}
                                                className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                {salary.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 即時預覽卡片 */}
                                {previewResult && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Wallet className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">即時預估</span>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-600">
                                                NT$ {previewResult.monthly.net.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-blue-600/70 mt-1">
                                                月薪 {monthlySalary.toLocaleString()} 實際到手
                                            </p>
                                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                                <div className="text-center">
                                                    <span className="text-gray-500">勞保</span>
                                                    <p className="text-red-500 font-medium">-{previewResult.monthly.laborInsurance.toLocaleString()}</p>
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-gray-500">健保</span>
                                                    <p className="text-red-500 font-medium">-{previewResult.monthly.healthInsurance.toLocaleString()}</p>
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-gray-500">勞退</span>
                                                    <p className="text-red-500 font-medium">-{previewResult.monthly.laborPension.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* 右側：結果區域 */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    ref={resultRef}
                                    className="space-y-6"
                                >
                                    {/* 結果摘要卡片 */}
                                    <div className="result-card p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">計算結果</h3>
                                            <div className="flex items-center gap-1 text-sm text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                計算完成
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="text-center">
                                                <div className="text-sm text-gray-500 mb-1">月薪總額</div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    NT$ {result.monthly.gross.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm text-gray-500 mb-1">實際到手</div>
                                                <div className="text-3xl font-bold text-gradient">
                                                    NT$ {result.monthly.net.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div>
                                                    <div className="text-xs text-gray-500">勞保</div>
                                                    <div className="text-sm font-semibold text-red-600">
                                                        -{result.monthly.laborInsurance.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">健保</div>
                                                    <div className="text-sm font-semibold text-red-600">
                                                        -{result.monthly.healthInsurance.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">勞退</div>
                                                    <div className="text-sm font-semibold text-red-600">
                                                        -{result.monthly.laborPension.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 標籤頁導航 */}
                                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                                        {[
                                            { id: 'basic', label: '基本資訊', icon: Calculator },
                                            { id: 'comparison', label: '歷史比較', icon: BarChart3 },
                                            { id: 'trend', label: '趨勢分析', icon: TrendingUp }
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id as any)}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                                    ? 'bg-white text-blue-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                <tab.icon className="w-4 h-4" />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* 標籤頁內容 */}
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'basic' && (
                                            <motion.div
                                                key="basic"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                {/* 月薪明細 */}
                                                <div className="modern-card p-6">
                                                    <h4 className="font-semibold text-gray-900 mb-4">月薪明細 ({result.metadata.year}年)</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">月薪總額</span>
                                                            <span className="font-mono font-semibold">NT$ {result.monthly.gross.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">勞保自付</span>
                                                            <span className="font-mono text-red-600">-NT$ {result.monthly.laborInsurance.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">健保自付</span>
                                                            <span className="font-mono text-red-600">-NT$ {result.monthly.healthInsurance.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">勞退提撥</span>
                                                            <span className="font-mono text-red-600">-NT$ {result.monthly.laborPension.toLocaleString()}</span>
                                                        </div>
                                                        <hr className="border-gray-200" />
                                                        <div className="flex justify-between items-center text-lg font-bold">
                                                            <span className="text-gray-900">實領金額</span>
                                                            <span className="font-mono text-gradient">NT$ {result.monthly.net.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 年度概算 */}
                                                <div className="modern-card p-6">
                                                    <h4 className="font-semibold text-gray-900 mb-4">年度概算</h4>
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div>
                                                            <div className="text-sm text-gray-500 mb-1">年薪總額</div>
                                                            <div className="text-xl font-bold text-gray-900">
                                                                NT$ {result.yearly.gross.toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-gray-500 mb-1">年度實領</div>
                                                            <div className="text-xl font-bold text-gradient">
                                                                NT$ {result.yearly.net.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}


                                        {activeTab === 'comparison' && historicalComparison && (
                                            <motion.div
                                                key="comparison"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="modern-card p-6"
                                            >
                                                <h4 className="font-semibold text-gray-900 mb-4">歷史比較 (2024 vs 2025)</h4>
                                                <div className="space-y-4">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                            <div className="text-sm text-gray-600">2025年實領</div>
                                                            <div className="text-xl font-bold text-blue-600">
                                                                NT$ {historicalComparison.currentYear.monthly.net.toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                            <div className="text-sm text-gray-600">2024年實領</div>
                                                            <div className="text-xl font-bold text-gray-600">
                                                                NT$ {historicalComparison.previousYear?.monthly.net.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {historicalComparison.yearOverYearChange && (
                                                        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                                                            <div className="text-sm text-gray-600">實領變化</div>
                                                            <div className={`text-2xl font-bold ${historicalComparison.yearOverYearChange.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                                                                }`}>
                                                                {historicalComparison.yearOverYearChange.netIncome >= 0 ? '+' : ''}
                                                                NT$ {historicalComparison.yearOverYearChange.netIncome.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'trend' && trendAnalysis && (
                                            <motion.div
                                                key="trend"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="modern-card p-6"
                                            >
                                                <h4 className="font-semibold text-gray-900 mb-4">趨勢分析</h4>
                                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                                                        <div className="text-sm text-gray-600">薪資成長率</div>
                                                        <div className={`text-xl font-bold ${trendAnalysis.salaryGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                            {trendAnalysis.salaryGrowth.toFixed(2)}%
                                                        </div>
                                                    </div>
                                                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                                                        <div className="text-sm text-gray-600">通膨影響</div>
                                                        <div className="text-xl font-bold text-orange-600">
                                                            -NT$ {trendAnalysis.inflationImpact.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                                                        <div className="text-sm text-gray-600">實質收入變化</div>
                                                        <div className={`text-xl font-bold ${trendAnalysis.realIncomeChange >= 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                            {trendAnalysis.realIncomeChange.toFixed(2)}%
                                                        </div>
                                                    </div>
                                                </div>

                                                {trendAnalysis.recommendations.length > 0 && (
                                                    <div className="bg-blue-50 rounded-lg p-4">
                                                        <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                                            <Info className="w-4 h-4 text-blue-600" />
                                                            建議事項
                                                        </h5>
                                                        <ul className="space-y-1 text-sm text-gray-700">
                                                            {trendAnalysis.recommendations.map((rec, index) => (
                                                                <li key={index} className="flex items-start gap-2">
                                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                                    <span>{rec}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* 結果操作按鈕 */}
                                    <ResultActions
                                        resultData={result}
                                        calculatorType="薪資計算器"
                                        resultRef={resultRef as React.RefObject<HTMLElement>}
                                        shareTitle="TaiCalc 薪資計算結果"
                                        shareDescription={`月薪 NT$ ${result.monthly.gross.toLocaleString()}，實領 NT$ ${result.monthly.net.toLocaleString()}`}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Calculator className="w-12 h-12 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        開始計算您的薪資
                                    </h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        輸入您的月薪和年終獎金，立即獲得精準的實領薪資計算結果
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* 底部相關內容 */}
                {result && (
                    <div className="mt-12 space-y-8">
                        {/* 相關知識文章推薦 */}
                        <ArticleRecommendations
                            calculatorType="salary"
                            title="薪資相關知識"
                            maxItems={3}
                            showReason={true}
                        />

                        {/* 社交媒體分享 */}
                        <div className="modern-card p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">分享計算結果</h4>
                            <SocialShareButtons
                                url={shareData.url}
                                title={shareData.title}
                                description={shareData.description}
                            />
                        </div>

                        {/* 相關計算工具推薦 */}
                        <InternalLinkSystem
                            currentCalculator="salary"
                            className="mt-8"
                            maxLinks={3}
                            showDescription={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}