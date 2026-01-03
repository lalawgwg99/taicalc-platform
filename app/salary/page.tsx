'use client';

import { useState, useCallback, useRef } from 'react';
import { 
    calculateSalary, 
    calculateHistoricalComparison, 
    calculateTrendAnalysis,
    SalaryInput, 
    SalaryResult,
    HistoricalComparison,
    TrendAnalysis
} from '@/features/salary/logic';
import { ResultActions, SalaryVisualization, AIAdvisorSuggestions } from '@/components/shared';
import { ArticleRecommendations } from '@/components/knowledge';
import { InternalLinkSystem, Breadcrumb, SocialShareButtons } from '@/components/seo';
import { useCalculatorAnalytics, usePerformanceTracking } from '@/hooks/useAnalytics';

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/seo-optimizer';

// 生成頁面 metadata
export const metadata: Metadata = generatePageMetadata('salary');

export default function SalaryCalculatorPage() {
    const [monthlySalary, setMonthlySalary] = useState(50000);
    const [bonusMonths, setBonusMonths] = useState(1);
    const [result, setResult] = useState<SalaryResult | null>(null);
    const [historicalComparison, setHistoricalComparison] = useState<HistoricalComparison | null>(null);
    const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const resultRef = useRef<HTMLDivElement>(null);

    // 分析追蹤
    const { 
        startCalculation, 
        completeCalculation, 
        failCalculation, 
        shareResult, 
        saveResult 
    } = useCalculatorAnalytics('salary');
    const { trackCustomMetric } = usePerformanceTracking();

    const handleCalculate = useCallback(() => {
        const input: SalaryInput = { monthlySalary, bonusMonths };
        
        try {
            // 開始追蹤計算
            startCalculation(input);
            const calculationStart = performance.now();
            
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
        <div className="container max-w-4xl mx-auto px-4 py-12">
            {/* 麵包屑導航 */}
            <Breadcrumb items={breadcrumbItems} className="mb-6" />
            
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">薪資計算器</h1>
                <p className="text-slate-500 mb-8">計算實際到手薪資、勞健保、勞退 (2025年最新費率)</p>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            月薪 (NT$)
                        </label>
                        <input
                            type="number"
                            value={monthlySalary}
                            onChange={(e) => setMonthlySalary(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            年終獎金 (月數)
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            value={bonusMonths}
                            onChange={(e) => setBonusMonths(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold mb-6"
                >
                    計算薪資
                </button>

                {result && (
                    <div ref={resultRef} className="space-y-6">
                        {/* 基本計算結果 */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">月薪明細 ({result.metadata.year}年)</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">月薪總額</span>
                                    <span className="font-mono font-semibold">NT$ {result.monthly.gross.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">勞保自付</span>
                                    <span className="font-mono text-red-500">-NT$ {result.monthly.laborInsurance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">健保自付</span>
                                    <span className="font-mono text-red-500">-NT$ {result.monthly.healthInsurance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">勞退提撥</span>
                                    <span className="font-mono text-red-500">-NT$ {result.monthly.laborPension.toLocaleString()}</span>
                                </div>
                                <hr className="border-slate-200" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-slate-800">實領</span>
                                    <span className="font-mono text-gradient-primary">NT$ {result.monthly.net.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className="mt-4 text-xs text-slate-500">
                                資料來源：{result.metadata.dataSource} | 更新日期：{result.metadata.lastUpdated}
                            </div>
                        </div>

                        {/* 年度概算 */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">年度概算</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">年薪總額</span>
                                    <span className="font-mono font-semibold">NT$ {result.yearly.gross.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">年度勞保</span>
                                    <span className="font-mono text-red-500">-NT$ {result.yearly.totalLaborInsurance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">年度健保</span>
                                    <span className="font-mono text-red-500">-NT$ {result.yearly.totalHealthInsurance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">年度勞退</span>
                                    <span className="font-mono text-red-500">-NT$ {result.yearly.totalLaborPension.toLocaleString()}</span>
                                </div>
                                <hr className="border-slate-200" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-slate-800">年度實領</span>
                                    <span className="font-mono text-gradient-primary">NT$ {result.yearly.net.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* AI 智能建議 */}
                        <AIAdvisorSuggestions
                            calculatorType="salary"
                            resultData={result}
                            className="mt-6"
                        />

                        {/* 進階分析切換 */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-colors"
                        >
                            {showAdvanced ? '隱藏' : '顯示'} 進階分析 (歷史比較 & 趨勢分析)
                        </button>

                        {/* 歷史比較 */}
                        {showAdvanced && historicalComparison && (
                            <div className="glass-card rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">歷史比較 (2024 vs 2025)</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">2025年實領</span>
                                        <span className="font-mono font-semibold">NT$ {historicalComparison.currentYear.monthly.net.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">2024年實領</span>
                                        <span className="font-mono">NT$ {historicalComparison.previousYear?.monthly.net.toLocaleString()}</span>
                                    </div>
                                    {historicalComparison.yearOverYearChange && (
                                        <>
                                            <hr className="border-slate-200" />
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">實領變化</span>
                                                <span className={`font-mono font-semibold ${
                                                    historicalComparison.yearOverYearChange.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {historicalComparison.yearOverYearChange.netIncome >= 0 ? '+' : ''}
                                                    NT$ {historicalComparison.yearOverYearChange.netIncome.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-500 space-y-1">
                                                <div className="flex justify-between">
                                                    <span>勞保費變化</span>
                                                    <span>{historicalComparison.yearOverYearChange.laborInsurance >= 0 ? '+' : ''}
                                                        {historicalComparison.yearOverYearChange.laborInsurance.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>健保費變化</span>
                                                    <span>{historicalComparison.yearOverYearChange.healthInsurance >= 0 ? '+' : ''}
                                                        {historicalComparison.yearOverYearChange.healthInsurance.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>勞退變化</span>
                                                    <span>{historicalComparison.yearOverYearChange.laborPension >= 0 ? '+' : ''}
                                                        {historicalComparison.yearOverYearChange.laborPension.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 趨勢分析 */}
                        {showAdvanced && trendAnalysis && (
                            <div className="glass-card rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">趨勢分析</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                                            <div className="text-sm text-slate-600">薪資成長率</div>
                                            <div className={`text-lg font-bold ${
                                                trendAnalysis.salaryGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {trendAnalysis.salaryGrowth.toFixed(2)}%
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                                            <div className="text-sm text-slate-600">通膨影響</div>
                                            <div className="text-lg font-bold text-orange-600">
                                                -NT$ {trendAnalysis.inflationImpact.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                                            <div className="text-sm text-slate-600">實質收入變化</div>
                                            <div className={`text-lg font-bold ${
                                                trendAnalysis.realIncomeChange >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {trendAnalysis.realIncomeChange.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {trendAnalysis.recommendations.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-slate-700 mb-2">建議事項</h4>
                                            <ul className="space-y-1 text-sm text-slate-600">
                                                {trendAnalysis.recommendations.map((rec, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="text-blue-500 mr-2">•</span>
                                                        <span>{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 數據視覺化 */}
                        {showAdvanced && (
                            <SalaryVisualization
                                result={result}
                                historicalComparison={historicalComparison || undefined}
                                trendAnalysis={trendAnalysis || undefined}
                                className="mt-6"
                            />
                        )}

                        {/* 結果操作按鈕 */}
                        <ResultActions
                            resultData={result}
                            calculatorType="薪資計算器"
                            resultRef={resultRef as React.RefObject<HTMLElement>}
                            shareTitle="TaiCalc 薪資計算結果"
                            shareDescription={`月薪 NT$ ${result.monthly.gross.toLocaleString()}，實領 NT$ ${result.monthly.net.toLocaleString()}`}
                            onShare={(platform) => shareResult(platform, {
                                monthly_gross: result.monthly.gross,
                                monthly_net: result.monthly.net,
                                yearly_net: result.yearly.net
                            })}
                            onSave={() => saveResult({
                                monthly_gross: result.monthly.gross,
                                monthly_net: result.monthly.net,
                                yearly_net: result.yearly.net,
                                calculation_date: new Date().toISOString()
                            })}
                        />

                        {/* 相關知識文章推薦 */}
                        <ArticleRecommendations
                            calculatorType="salary"
                            title="薪資相關知識"
                            maxItems={3}
                            showReason={true}
                        />

                        {/* 社交媒體分享 */}
                        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                            <h4 className="font-medium text-slate-700 mb-3">分享計算結果</h4>
                            <SocialShareButtons
                                url={shareData.url}
                                title={shareData.title}
                                description={shareData.description}
                            />
                        </div>
                    </div>
                )}

                {/* 相關計算工具推薦 */}
                <InternalLinkSystem
                    currentCalculator="salary"
                    className="mt-8"
                    maxLinks={3}
                    showDescription={true}
                />
            </div>
        </div>
    );
}
