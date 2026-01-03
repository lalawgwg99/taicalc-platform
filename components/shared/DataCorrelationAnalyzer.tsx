'use client';

import React, { useMemo } from 'react';
import { DataVisualization, ChartData, Insight } from './DataVisualization';

interface CorrelationData {
    name: string;
    datasets: {
        [key: string]: number;
    };
}

interface DataCorrelationAnalyzerProps {
    data: CorrelationData[];
    title: string;
    className?: string;
    enableCrossAnalysis?: boolean;
}

interface CorrelationInsight extends Insight {
    correlation?: number;
    datasets?: string[];
}

export function DataCorrelationAnalyzer({
    data,
    title,
    className = '',
    enableCrossAnalysis = true
}: DataCorrelationAnalyzerProps) {
    
    // 計算相關性分析
    const correlationAnalysis = useMemo(() => {
        if (!enableCrossAnalysis || data.length < 2) return null;

        const datasetKeys = Object.keys(data[0]?.datasets || {});
        if (datasetKeys.length < 2) return null;

        const correlations: { [key: string]: number } = {};
        
        // 計算每對數據集之間的相關係數
        for (let i = 0; i < datasetKeys.length; i++) {
            for (let j = i + 1; j < datasetKeys.length; j++) {
                const key1 = datasetKeys[i];
                const key2 = datasetKeys[j];
                
                const values1 = data.map(d => d.datasets[key1]);
                const values2 = data.map(d => d.datasets[key2]);
                
                const correlation = calculateCorrelation(values1, values2);
                correlations[`${key1}_${key2}`] = correlation;
            }
        }

        return {
            datasetKeys,
            correlations,
            strongCorrelations: Object.entries(correlations)
                .filter(([_, corr]) => Math.abs(corr) > 0.7)
                .map(([pair, corr]) => ({ pair, correlation: corr }))
        };
    }, [data, enableCrossAnalysis]);

    // 計算皮爾遜相關係數
    const calculateCorrelation = (x: number[], y: number[]): number => {
        const n = x.length;
        if (n !== y.length || n === 0) return 0;

        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = y.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
        const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    };

    // 生成關聯性洞察
    const generateCorrelationInsights = (): CorrelationInsight[] => {
        const insights: CorrelationInsight[] = [];

        if (!correlationAnalysis) return insights;

        // 強相關性洞察
        correlationAnalysis.strongCorrelations.forEach(({ pair, correlation }) => {
            const [dataset1, dataset2] = pair.split('_');
            const isPositive = correlation > 0;
            
            insights.push({
                type: 'comparison',
                title: `${isPositive ? '正' : '負'}相關性發現`,
                description: `${dataset1} 與 ${dataset2} 之間存在${isPositive ? '強正' : '強負'}相關性 (r=${correlation.toFixed(3)})，${isPositive ? '同向變化' : '反向變化'}明顯`,
                impact: Math.abs(correlation) > 0.8 ? 'high' : 'medium',
                correlation,
                datasets: [dataset1, dataset2],
                actionable: true,
                relatedData: [dataset1, dataset2]
            });
        });

        // 數據集表現分析
        if (correlationAnalysis.datasetKeys.length > 0) {
            correlationAnalysis.datasetKeys.forEach(key => {
                const values = data.map(d => d.datasets[key]);
                const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
                const max = Math.max(...values);
                const min = Math.min(...values);
                const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
                const cv = Math.sqrt(variance) / avg; // 變異係數

                if (cv > 0.3) {
                    insights.push({
                        type: 'trend',
                        title: `${key} 變異性分析`,
                        description: `${key} 數據變異較大 (CV=${(cv * 100).toFixed(1)}%)，範圍從 ${min.toLocaleString()} 到 ${max.toLocaleString()}`,
                        impact: cv > 0.5 ? 'medium' : 'low',
                        datasets: [key],
                        actionable: true
                    });
                }
            });
        }

        // 綜合表現洞察
        const totalPerformance = data.map(item => {
            const total = Object.values(item.datasets).reduce((sum, val) => sum + val, 0);
            return { name: item.name, total };
        });

        const bestPerformer = totalPerformance.reduce((best, current) => 
            current.total > best.total ? current : best
        );

        const worstPerformer = totalPerformance.reduce((worst, current) => 
            current.total < worst.total ? current : worst
        );

        if (bestPerformer.total > worstPerformer.total * 1.2) {
            insights.push({
                type: 'achievement',
                title: '綜合表現分析',
                description: `${bestPerformer.name} 綜合表現最佳 (${bestPerformer.total.toLocaleString()})，比最低的 ${worstPerformer.name} 高出 ${((bestPerformer.total / worstPerformer.total - 1) * 100).toFixed(1)}%`,
                impact: 'high',
                actionable: true,
                relatedData: [bestPerformer.name, worstPerformer.name]
            });
        }

        return insights;
    };

    // 準備圖表數據
    const chartData: ChartData[] = useMemo(() => {
        if (!correlationAnalysis) return [];

        return correlationAnalysis.datasetKeys.map(key => {
            const values = data.map(d => d.datasets[key]);
            const total = values.reduce((sum, val) => sum + val, 0);
            
            return {
                name: key,
                value: total,
                category: 'dataset'
            };
        });
    }, [data, correlationAnalysis]);

    // 準備相關性矩陣數據
    const correlationMatrixData: ChartData[] = useMemo(() => {
        if (!correlationAnalysis) return [];

        return Object.entries(correlationAnalysis.correlations).map(([pair, correlation]) => {
            const [dataset1, dataset2] = pair.split('_');
            return {
                name: `${dataset1} ↔ ${dataset2}`,
                value: Math.abs(correlation),
                category: correlation > 0 ? 'positive' : 'negative',
                color: correlation > 0 ? '#10B981' : '#EF4444'
            };
        });
    }, [correlationAnalysis]);

    const insights = generateCorrelationInsights();

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 數據集總覽 */}
            <DataVisualization
                data={chartData}
                type="bar"
                title={`${title} - 數據集總覽`}
                insights={insights.filter(i => i.datasets && i.datasets.length === 1)}
                showExport={true}
            />

            {/* 相關性分析 */}
            {enableCrossAnalysis && correlationAnalysis && (
                <div className="space-y-4">
                    <DataVisualization
                        data={correlationMatrixData}
                        type="bar"
                        title="數據關聯性分析"
                        insights={insights.filter(i => i.correlation !== undefined)}
                        showExport={true}
                    />

                    {/* 相關性矩陣表格 */}
                    <div className="glass-card rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4">相關性矩陣</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left p-2 font-medium text-slate-700">數據集</th>
                                        {correlationAnalysis.datasetKeys.map(key => (
                                            <th key={key} className="text-center p-2 font-medium text-slate-700">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {correlationAnalysis.datasetKeys.map(key1 => (
                                        <tr key={key1} className="border-b border-slate-100">
                                            <td className="p-2 font-medium text-slate-700">{key1}</td>
                                            {correlationAnalysis.datasetKeys.map(key2 => {
                                                if (key1 === key2) {
                                                    return (
                                                        <td key={key2} className="text-center p-2">
                                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                                                1.000
                                                            </span>
                                                        </td>
                                                    );
                                                }

                                                const correlationKey = key1 < key2 ? `${key1}_${key2}` : `${key2}_${key1}`;
                                                const correlation = correlationAnalysis.correlations[correlationKey] || 0;
                                                const absCorr = Math.abs(correlation);
                                                
                                                let colorClass = 'bg-slate-100 text-slate-600';
                                                if (absCorr > 0.7) {
                                                    colorClass = correlation > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
                                                } else if (absCorr > 0.3) {
                                                    colorClass = correlation > 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700';
                                                }

                                                return (
                                                    <td key={key2} className="text-center p-2">
                                                        <span className={`px-2 py-1 rounded text-xs ${colorClass}`}>
                                                            {correlation.toFixed(3)}
                                                        </span>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 相關性說明 */}
                        <div className="mt-4 text-xs text-slate-600 space-y-1">
                            <p>📊 相關係數範圍: -1 (完全負相關) 到 +1 (完全正相關)</p>
                            <p>🟢 |r| &gt; 0.7: 強相關 | 🔵 0.3 &lt; |r| &le; 0.7: 中等相關 | ⚪ |r| &le; 0.3: 弱相關</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 綜合分析洞察 */}
            {insights.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">綜合分析洞察</h4>
                    <div className="space-y-3">
                        {insights.map((insight, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <span className="text-lg">
                                        {insight.type === 'comparison' ? '📊' : 
                                         insight.type === 'trend' ? '📈' : 
                                         insight.type === 'achievement' ? '🏆' : '💡'}
                                    </span>
                                    <div className="flex-1">
                                        <h5 className="font-medium text-slate-800 mb-1">{insight.title}</h5>
                                        <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                                        
                                        {insight.datasets && (
                                            <div className="flex flex-wrap gap-1">
                                                {insight.datasets.map((dataset, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                                                    >
                                                        {dataset}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                                        insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {insight.impact === 'high' ? '高' : 
                                         insight.impact === 'medium' ? '中' : '低'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}