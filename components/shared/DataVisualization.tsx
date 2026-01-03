'use client';

import React, { useRef } from 'react';
import { 
    BarChart, 
    Bar, 
    LineChart, 
    Line, 
    PieChart, 
    Pie, 
    Cell,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import html2canvas from 'html2canvas';

export interface ChartData {
    name: string;
    value: number;
    category?: string;
    color?: string;
    metadata?: {
        timestamp?: Date;
        source?: string;
        confidence?: number;
    };
}

export interface Insight {
    type: 'warning' | 'tip' | 'comparison' | 'trend' | 'recommendation' | 'achievement';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    icon?: string;
    actionable?: boolean;
    relatedData?: string[];
}

export interface FinancialReport {
    summary: {
        title: string;
        description: string;
        keyMetrics: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[];
    };
    insights: Insight[];
    recommendations: string[];
    exportData: {
        charts: ChartExportData[];
        rawData: any;
    };
}

export interface ChartExportData {
    title: string;
    type: ChartType;
    data: ChartData[];
    insights: Insight[];
}

export type ChartType = 'bar' | 'line' | 'pie' | 'comparison' | 'area' | 'scatter' | 'trend';
export type ExportFormat = 'png' | 'jpg' | 'pdf' | 'csv' | 'json';

interface DataVisualizationProps {
    data: ChartData[];
    type: ChartType;
    title: string;
    insights?: Insight[];
    className?: string;
    showExport?: boolean;
    enableInteraction?: boolean;
    historicalData?: ChartData[];
    comparisonData?: ChartData[];
    onDataPointClick?: (data: ChartData) => void;
}

const COLORS = [
    '#3B82F6', // blue-500
    '#EF4444', // red-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#84CC16'  // lime-500
];

const INSIGHT_ICONS = {
    warning: '⚠️',
    tip: '💡',
    comparison: '📊',
    trend: '📈',
    recommendation: '🎯',
    achievement: '🏆'
};

const IMPACT_COLORS = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-blue-600 bg-blue-50 border-blue-200'
};

export function DataVisualization({ 
    data, 
    type, 
    title, 
    insights = [], 
    className = '',
    showExport = true,
    enableInteraction = false,
    historicalData = [],
    comparisonData = [],
    onDataPointClick
}: DataVisualizationProps) {
    const chartRef = useRef<HTMLDivElement>(null);

    const exportChart = async (format: ExportFormat = 'png') => {
        if (!chartRef.current) return;

        try {
            switch (format) {
                case 'png':
                case 'jpg':
                    const canvas = await html2canvas(chartRef.current, {
                        backgroundColor: '#ffffff',
                        scale: 2,
                        logging: false
                    });

                    const link = document.createElement('a');
                    link.download = `${title.replace(/\s+/g, '_')}_chart.${format}`;
                    link.href = canvas.toDataURL(`image/${format}`, 0.9);
                    link.click();
                    break;

                case 'csv':
                    const csvContent = convertToCSV(data, title);
                    downloadFile(csvContent, `${title.replace(/\s+/g, '_')}_data.csv`, 'text/csv');
                    break;

                case 'json':
                    const jsonContent = JSON.stringify({
                        title,
                        type,
                        data,
                        insights,
                        exportDate: new Date().toISOString()
                    }, null, 2);
                    downloadFile(jsonContent, `${title.replace(/\s+/g, '_')}_data.json`, 'application/json');
                    break;

                case 'pdf':
                    // PDF 匯出需要額外的庫，這裡先提供基本實作
                    console.warn('PDF 匯出功能需要額外配置');
                    break;

                default:
                    console.error('不支援的匯出格式:', format);
            }
        } catch (error) {
            console.error('圖表匯出失敗:', error);
        }
    };

    const convertToCSV = (data: ChartData[], title: string): string => {
        const headers = ['名稱', '數值', '類別'];
        const rows = data.map(item => [
            item.name,
            item.value.toString(),
            item.category || ''
        ]);
        
        const csvContent = [
            `# ${title}`,
            `# 匯出時間: ${new Date().toLocaleString('zh-TW')}`,
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        return csvContent;
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

    const renderChart = () => {
        const commonProps = {
            width: '100%',
            height: 300,
            data: data
        };

        const handleDataPointClick = (data: any) => {
            if (enableInteraction && onDataPointClick) {
                onDataPointClick(data);
            }
        };

        switch (type) {
            case 'bar':
                return (
                    <ResponsiveContainer {...commonProps}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                            />
                            <YAxis 
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar 
                                dataKey="value" 
                                fill="#3B82F6"
                                radius={[4, 4, 0, 0]}
                                onClick={handleDataPointClick}
                                cursor={enableInteraction ? 'pointer' : 'default'}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer {...commonProps}>
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                            />
                            <YAxis 
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#3B82F6" 
                                strokeWidth={3}
                                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                                onClick={handleDataPointClick}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'area':
                return (
                    <ResponsiveContainer {...commonProps}>
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                            />
                            <YAxis 
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#3B82F6" 
                                strokeWidth={2}
                                fill="url(#colorValue)"
                                fillOpacity={1}
                                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'trend':
                // 趨勢圖結合歷史數據和當前數據
                const trendData = [...(historicalData || []), ...data];
                return (
                    <ResponsiveContainer {...commonProps}>
                        <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                            />
                            <YAxis 
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#3B82F6" 
                                strokeWidth={3}
                                name="趨勢線"
                                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer {...commonProps}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                onClick={handleDataPointClick}
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.color || COLORS[index % COLORS.length]} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'comparison':
                return (
                    <ResponsiveContainer {...commonProps}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                            />
                            <YAxis 
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                            <Bar 
                                dataKey="value" 
                                fill="#3B82F6"
                                radius={[4, 4, 0, 0]}
                                name="數值"
                                onClick={handleDataPointClick}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            default:
                return <div className="text-center text-slate-500">不支援的圖表類型: {type}</div>;
        }
    };

    return (
        <div className={`glass-card rounded-2xl p-6 ${className}`}>
            {/* 標題和匯出按鈕 */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                {showExport && (
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => exportChart('png')}
                            className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                            title="匯出為 PNG 圖片"
                        >
                            📊 PNG
                        </button>
                        <button
                            onClick={() => exportChart('jpg')}
                            className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                            title="匯出為 JPG 圖片"
                        >
                            🖼️ JPG
                        </button>
                        <button
                            onClick={() => exportChart('csv')}
                            className="px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
                            title="匯出為 CSV 數據"
                        >
                            📋 CSV
                        </button>
                        <button
                            onClick={() => exportChart('json')}
                            className="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                            title="匯出為 JSON 數據"
                        >
                            📄 JSON
                        </button>
                    </div>
                )}
            </div>

            {/* 圖表區域 */}
            <div ref={chartRef} className="mb-6">
                {renderChart()}
            </div>

            {/* 洞察分析 */}
            {insights.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-medium text-slate-700 mb-3">數據洞察</h4>
                    {insights.map((insight, index) => (
                        <div 
                            key={index}
                            className={`p-3 rounded-lg border ${IMPACT_COLORS[insight.impact]} ${
                                insight.actionable ? 'border-l-4' : ''
                            }`}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-lg">
                                    {insight.icon || INSIGHT_ICONS[insight.type]}
                                </span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h5 className="font-medium">{insight.title}</h5>
                                        {insight.actionable && (
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                可操作
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm opacity-90">{insight.description}</p>
                                    {insight.relatedData && insight.relatedData.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {insight.relatedData.map((item, idx) => (
                                                <span 
                                                    key={idx}
                                                    className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// 洞察生成工具函數
export function generateInsights(data: ChartData[], type: ChartType): Insight[] {
    const insights: Insight[] = [];
    
    if (data.length === 0) return insights;

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const maxItem = data.find(d => d.value === max);
    const minItem = data.find(d => d.value === min);

    // 最大值洞察
    if (maxItem) {
        const percentageAboveAvg = ((max - avg) / avg * 100);
        insights.push({
            type: 'comparison',
            title: '最高數值分析',
            description: `${maxItem.name} 的數值最高 (${max.toLocaleString()})，比平均值高出 ${percentageAboveAvg.toFixed(1)}%`,
            impact: max > avg * 1.5 ? 'high' : 'medium',
            actionable: true,
            relatedData: [maxItem.name]
        });
    }

    // 最小值洞察
    if (minItem && min < avg * 0.5) {
        insights.push({
            type: 'warning',
            title: '數值偏低警示',
            description: `${minItem.name} 的數值 (${min.toLocaleString()}) 明顯低於平均值，建議深入分析原因`,
            impact: 'medium',
            actionable: true,
            relatedData: [minItem.name]
        });
    }

    // 變異性洞察
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / avg; // 變異係數

    if (cv > 0.5) {
        insights.push({
            type: 'trend',
            title: '數據變異分析',
            description: `數據分布較為分散，變異係數為 ${(cv * 100).toFixed(1)}%，標準差為 ${stdDev.toFixed(0)}，建議分析造成差異的根本原因`,
            impact: cv > 1 ? 'high' : 'low',
            actionable: true
        });
    }

    // 趨勢洞察 (適用於時間序列數據)
    if (type === 'line' && data.length >= 3) {
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
        const trendChange = ((secondAvg - firstAvg) / firstAvg) * 100;

        if (Math.abs(trendChange) > 10) {
            insights.push({
                type: 'trend',
                title: trendChange > 0 ? '上升趨勢確認' : '下降趨勢警示',
                description: `數據呈現${trendChange > 0 ? '明顯上升' : '明顯下降'}趨勢，變化幅度約 ${Math.abs(trendChange).toFixed(1)}%，${trendChange > 0 ? '表現良好' : '需要關注'}`,
                impact: Math.abs(trendChange) > 25 ? 'high' : 'medium',
                actionable: true
            });
        }
    }

    // 分布均勻性洞察
    if (type === 'pie' && data.length > 2) {
        const expectedValue = 100 / data.length; // 期望的均勻分布百分比
        const actualPercentages = values.map(v => (v / values.reduce((sum, val) => sum + val, 0)) * 100);
        const isBalanced = actualPercentages.every(p => Math.abs(p - expectedValue) < expectedValue * 0.3);
        
        if (isBalanced) {
            insights.push({
                type: 'tip',
                title: '分布均衡',
                description: '各項目分布相對均衡，沒有明顯的偏重項目',
                impact: 'low'
            });
        } else {
            const dominantItem = data[actualPercentages.indexOf(Math.max(...actualPercentages))];
            insights.push({
                type: 'comparison',
                title: '分布不均',
                description: `${dominantItem.name} 佔比最大 (${Math.max(...actualPercentages).toFixed(1)}%)，分布存在明顯偏重`,
                impact: 'medium',
                actionable: true,
                relatedData: [dominantItem.name]
            });
        }
    }

    // 異常值檢測
    const q1 = values.sort((a, b) => a - b)[Math.floor(values.length * 0.25)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const iqr = q3 - q1;
    const outliers = data.filter(item => 
        item.value < (q1 - 1.5 * iqr) || item.value > (q3 + 1.5 * iqr)
    );

    if (outliers.length > 0) {
        insights.push({
            type: 'warning',
            title: '異常值檢測',
            description: `發現 ${outliers.length} 個異常值：${outliers.map(o => o.name).join(', ')}，建議進一步驗證數據準確性`,
            impact: 'medium',
            actionable: true,
            relatedData: outliers.map(o => o.name)
        });
    }

    // 成就和里程碑識別
    if (max > avg * 2) {
        insights.push({
            type: 'achievement',
            title: '卓越表現',
            description: `${maxItem?.name} 表現卓越，超越平均水準 ${((max / avg - 1) * 100).toFixed(0)}%`,
            impact: 'high',
            actionable: false
        });
    }

    // 改進建議
    if (type === 'comparison' && data.length >= 2) {
        const sortedData = [...data].sort((a, b) => b.value - a.value);
        const topPerformer = sortedData[0];
        const bottomPerformer = sortedData[sortedData.length - 1];
        
        if (topPerformer.value > bottomPerformer.value * 1.5) {
            insights.push({
                type: 'recommendation',
                title: '改進機會',
                description: `參考 ${topPerformer.name} 的成功經驗，可以幫助提升 ${bottomPerformer.name} 的表現`,
                impact: 'medium',
                actionable: true,
                relatedData: [topPerformer.name, bottomPerformer.name]
            });
        }
    }

    return insights;
}

// 生成個性化財務報告
export function generateFinancialReport(
    data: ChartData[], 
    type: ChartType, 
    title: string,
    additionalContext?: any
): FinancialReport {
    const insights = generateInsights(data, type);
    const values = data.map(d => d.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // 生成關鍵指標
    const keyMetrics = [
        {
            label: '總計',
            value: `NT$ ${total.toLocaleString()}`,
            trend: 'stable' as const
        },
        {
            label: '平均值',
            value: `NT$ ${avg.toLocaleString()}`,
            trend: 'stable' as const
        },
        {
            label: '最高值',
            value: `NT$ ${max.toLocaleString()}`,
            trend: 'up' as const
        },
        {
            label: '最低值',
            value: `NT$ ${min.toLocaleString()}`,
            trend: min < avg * 0.8 ? 'down' as const : 'stable' as const
        }
    ];

    // 生成建議
    const recommendations = [
        ...insights.filter(i => i.actionable).map(i => i.description),
        '定期檢視數據變化趨勢，及時調整策略',
        '建立數據監控機制，確保及時發現異常情況'
    ];

    // 準備匯出數據
    const exportData: ChartExportData[] = [{
        title,
        type,
        data,
        insights
    }];

    return {
        summary: {
            title: `${title} - 分析報告`,
            description: `基於 ${data.length} 項數據的綜合分析，發現 ${insights.length} 個關鍵洞察`,
            keyMetrics
        },
        insights,
        recommendations,
        exportData: {
            charts: exportData,
            rawData: {
                data,
                metadata: {
                    generatedAt: new Date().toISOString(),
                    dataPoints: data.length,
                    analysisType: type,
                    totalValue: total,
                    averageValue: avg
                }
            }
        }
    };
}