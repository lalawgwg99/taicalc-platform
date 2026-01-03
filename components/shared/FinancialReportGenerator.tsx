'use client';

import React, { useState } from 'react';
import { DataVisualization, ChartData, generateFinancialReport, FinancialReport } from './DataVisualization';

interface FinancialReportGeneratorProps {
    data: ChartData[];
    title: string;
    reportType?: 'salary' | 'investment' | 'expense' | 'general';
    className?: string;
    onReportGenerated?: (report: FinancialReport) => void;
}

export function FinancialReportGenerator({
    data,
    title,
    reportType = 'general',
    className = '',
    onReportGenerated
}: FinancialReportGeneratorProps) {
    const [report, setReport] = useState<FinancialReport | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateReport = async () => {
        setIsGenerating(true);
        
        try {
            // 模擬報告生成過程
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const generatedReport = generateFinancialReport(data, 'comparison', title);
            setReport(generatedReport);
            
            if (onReportGenerated) {
                onReportGenerated(generatedReport);
            }
        } catch (error) {
            console.error('報告生成失敗:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const exportReport = (format: 'pdf' | 'json' | 'csv') => {
        if (!report) return;

        switch (format) {
            case 'json':
                const jsonContent = JSON.stringify(report, null, 2);
                downloadFile(jsonContent, `${title}_report.json`, 'application/json');
                break;
            
            case 'csv':
                const csvContent = convertReportToCSV(report);
                downloadFile(csvContent, `${title}_report.csv`, 'text/csv');
                break;
            
            case 'pdf':
                console.warn('PDF 匯出功能需要額外配置');
                break;
        }
    };

    const convertReportToCSV = (report: FinancialReport): string => {
        const lines = [
            `# ${report.summary.title}`,
            `# ${report.summary.description}`,
            `# 生成時間: ${new Date().toLocaleString('zh-TW')}`,
            '',
            '## 關鍵指標',
            '指標,數值,趨勢',
            ...report.summary.keyMetrics.map(metric => 
                `${metric.label},${metric.value},${metric.trend}`
            ),
            '',
            '## 洞察分析',
            '類型,標題,描述,影響程度',
            ...report.insights.map(insight => 
                `${insight.type},${insight.title},"${insight.description}",${insight.impact}`
            ),
            '',
            '## 建議事項',
            ...report.recommendations.map((rec, index) => `${index + 1}. ${rec}`)
        ];
        
        return lines.join('\n');
    };

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 報告生成控制 */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">個性化財務報告</h3>
                    <button
                        onClick={generateReport}
                        disabled={isGenerating}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isGenerating
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        {isGenerating ? '生成中...' : '生成報告'}
                    </button>
                </div>

                {isGenerating && (
                    <div className="flex items-center gap-3 text-slate-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        <span>正在分析數據並生成個性化報告...</span>
                    </div>
                )}
            </div>

            {/* 報告內容 */}
            {report && (
                <div className="space-y-6">
                    {/* 報告摘要 */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    {report.summary.title}
                                </h3>
                                <p className="text-slate-600">{report.summary.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => exportReport('json')}
                                    className="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                                    title="匯出完整報告數據"
                                >
                                    📄 JSON
                                </button>
                                <button
                                    onClick={() => exportReport('csv')}
                                    className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                                    title="匯出報告摘要"
                                >
                                    📊 CSV
                                </button>
                            </div>
                        </div>

                        {/* 關鍵指標 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {report.summary.keyMetrics.map((metric, index) => (
                                <div key={index} className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <span className="text-lg font-bold text-slate-800">
                                            {metric.value}
                                        </span>
                                        {metric.trend === 'up' && <span className="text-green-500">↗️</span>}
                                        {metric.trend === 'down' && <span className="text-red-500">↘️</span>}
                                        {metric.trend === 'stable' && <span className="text-slate-500">➡️</span>}
                                    </div>
                                    <div className="text-sm text-slate-600">{metric.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 數據視覺化 */}
                    <DataVisualization
                        data={data}
                        type="comparison"
                        title="數據分析圖表"
                        insights={report.insights}
                        showExport={true}
                    />

                    {/* 建議事項 */}
                    <div className="glass-card rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4">專業建議</h4>
                        <div className="space-y-3">
                            {report.recommendations.map((recommendation, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                    <p className="text-slate-700">{recommendation}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 報告元數據 */}
                    <div className="glass-card rounded-2xl p-4 bg-slate-50">
                        <div className="text-sm text-slate-600 space-y-1">
                            <p>📅 報告生成時間: {new Date().toLocaleString('zh-TW')}</p>
                            <p>📊 數據點數量: {data.length} 項</p>
                            <p>🔍 洞察數量: {report.insights.length} 個</p>
                            <p>💡 建議數量: {report.recommendations.length} 項</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}