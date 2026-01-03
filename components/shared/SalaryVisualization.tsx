'use client';

import React from 'react';
import { DataVisualization, ChartData, Insight, generateInsights } from './DataVisualization';
import { SalaryResult, HistoricalComparison, TrendAnalysis } from '@/features/salary/logic';

interface SalaryVisualizationProps {
    result: SalaryResult;
    historicalComparison?: HistoricalComparison;
    trendAnalysis?: TrendAnalysis;
    className?: string;
}

export function SalaryVisualization({ 
    result, 
    historicalComparison, 
    trendAnalysis,
    className = '' 
}: SalaryVisualizationProps) {
    
    // 月薪結構圓餅圖數據
    const salaryBreakdownData: ChartData[] = [
        {
            name: '實領薪資',
            value: result.monthly.net,
            color: '#10B981' // emerald-500
        },
        {
            name: '勞保費',
            value: result.monthly.laborInsurance,
            color: '#EF4444' // red-500
        },
        {
            name: '健保費',
            value: result.monthly.healthInsurance,
            color: '#F59E0B' // amber-500
        },
        {
            name: '勞退提撥',
            value: result.monthly.laborPension,
            color: '#8B5CF6' // violet-500
        }
    ];

    // 歷史比較柱狀圖數據
    const historicalComparisonData: ChartData[] = historicalComparison ? [
        {
            name: '2024年實領',
            value: historicalComparison.previousYear?.monthly.net || 0,
            color: '#94A3B8' // slate-400
        },
        {
            name: '2025年實領',
            value: historicalComparison.currentYear.monthly.net,
            color: '#3B82F6' // blue-500
        }
    ] : [];

    // 年度費用分析數據
    const yearlyAnalysisData: ChartData[] = [
        {
            name: '勞保費',
            value: result.yearly.totalLaborInsurance,
            color: '#EF4444'
        },
        {
            name: '健保費',
            value: result.yearly.totalHealthInsurance,
            color: '#F59E0B'
        },
        {
            name: '勞退提撥',
            value: result.yearly.totalLaborPension,
            color: '#8B5CF6'
        }
    ];

    // 生成薪資結構洞察
    const salaryInsights: Insight[] = [
        {
            type: 'comparison',
            title: '實領比例',
            description: `實領薪資佔總薪資的 ${((result.monthly.net / result.monthly.gross) * 100).toFixed(1)}%`,
            impact: (result.monthly.net / result.monthly.gross) < 0.8 ? 'medium' : 'low'
        },
        {
            type: 'tip',
            title: '扣除項目分析',
            description: `每月扣除總額 ${(result.monthly.gross - result.monthly.net).toLocaleString()} 元，其中勞保費佔 ${((result.monthly.laborInsurance / (result.monthly.gross - result.monthly.net)) * 100).toFixed(1)}%`,
            impact: 'low'
        }
    ];

    // 添加歷史比較洞察
    if (historicalComparison?.yearOverYearChange) {
        const change = historicalComparison.yearOverYearChange;
        if (change.netIncome !== 0) {
            salaryInsights.push({
                type: change.netIncome > 0 ? 'trend' : 'warning',
                title: '年度變化',
                description: `相比去年，實領薪資${change.netIncome > 0 ? '增加' : '減少'} ${Math.abs(change.netIncome).toLocaleString()} 元`,
                impact: Math.abs(change.netIncome) > 1000 ? 'high' : 'medium'
            });
        }
    }

    // 添加趨勢分析洞察
    if (trendAnalysis) {
        if (trendAnalysis.realIncomeChange < 0) {
            salaryInsights.push({
                type: 'warning',
                title: '實質收入下降',
                description: `考慮通膨因素後，實質收入下降 ${Math.abs(trendAnalysis.realIncomeChange).toFixed(1)}%`,
                impact: 'high'
            });
        }

        if (trendAnalysis.salaryGrowth > 5) {
            salaryInsights.push({
                type: 'tip',
                title: '薪資成長良好',
                description: `薪資成長率 ${trendAnalysis.salaryGrowth.toFixed(1)}% 超過一般水準`,
                impact: 'low'
            });
        }
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 薪資結構圓餅圖 */}
            <DataVisualization
                data={salaryBreakdownData}
                type="pie"
                title="月薪結構分析"
                insights={salaryInsights}
                showExport={true}
            />

            {/* 歷史比較圖 */}
            {historicalComparison && historicalComparisonData.length > 0 && (
                <DataVisualization
                    data={historicalComparisonData}
                    type="comparison"
                    title="年度薪資比較 (2024 vs 2025)"
                    insights={generateInsights(historicalComparisonData, 'comparison')}
                    showExport={true}
                />
            )}

            {/* 年度費用分析 */}
            <DataVisualization
                data={yearlyAnalysisData}
                type="bar"
                title="年度扣除項目分析"
                insights={generateInsights(yearlyAnalysisData, 'bar')}
                showExport={true}
            />

            {/* 趨勢分析圖表 */}
            {trendAnalysis && (
                <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">趨勢分析摘要</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {trendAnalysis.salaryGrowth.toFixed(1)}%
                            </div>
                            <div className="text-sm text-blue-700 mt-1">薪資成長率</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {trendAnalysis.inflationImpact.toLocaleString()}
                            </div>
                            <div className="text-sm text-orange-700 mt-1">通膨影響 (元)</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                            <div className={`text-2xl font-bold ${
                                trendAnalysis.realIncomeChange >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {trendAnalysis.realIncomeChange.toFixed(1)}%
                            </div>
                            <div className="text-sm text-slate-700 mt-1">實質收入變化</div>
                        </div>
                    </div>
                    
                    {trendAnalysis.recommendations.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium text-slate-700 mb-2">專業建議</h4>
                            <ul className="space-y-2">
                                {trendAnalysis.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}