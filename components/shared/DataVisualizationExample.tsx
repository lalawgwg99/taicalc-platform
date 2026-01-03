'use client';

import React from 'react';
import { DataVisualization, FinancialReportGenerator, DataCorrelationAnalyzer } from './index';

// 示例數據
const sampleChartData = [
    { name: '薪資', value: 50000, category: 'income' },
    { name: '勞保費', value: 1150, category: 'deduction' },
    { name: '健保費', value: 775, category: 'deduction' },
    { name: '勞退', value: 3000, category: 'deduction' }
];

const sampleCorrelationData = [
    {
        name: '2024年1月',
        datasets: {
            '薪資': 45000,
            '勞保費': 1035,
            '健保費': 697,
            '勞退': 2700
        }
    },
    {
        name: '2024年12月',
        datasets: {
            '薪資': 50000,
            '勞保費': 1150,
            '健保費': 775,
            '勞退': 3000
        }
    },
    {
        name: '2025年1月',
        datasets: {
            '薪資': 52000,
            '勞保費': 1196,
            '健保費': 806,
            '勞退': 3120
        }
    }
];

export function DataVisualizationExample() {
    return (
        <div className="space-y-8 p-6">
            <h2 className="text-2xl font-bold text-slate-800">數據視覺化組件示例</h2>
            
            {/* 基本圖表示例 */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-700">基本圖表功能</h3>
                
                <DataVisualization
                    data={sampleChartData}
                    type="pie"
                    title="薪資結構分析"
                    showExport={true}
                    enableInteraction={true}
                />
                
                <DataVisualization
                    data={sampleChartData}
                    type="bar"
                    title="薪資項目比較"
                    showExport={true}
                />
            </div>

            {/* 關聯分析示例 */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-700">數據關聯分析</h3>
                
                <DataCorrelationAnalyzer
                    data={sampleCorrelationData}
                    title="薪資變化關聯分析"
                    enableCrossAnalysis={true}
                />
            </div>

            {/* 財務報告生成示例 */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-700">個性化財務報告</h3>
                
                <FinancialReportGenerator
                    data={sampleChartData}
                    title="月薪分析報告"
                    reportType="salary"
                />
            </div>
        </div>
    );
}