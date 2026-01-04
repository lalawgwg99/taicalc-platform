'use client';

import React, { useState, useEffect } from 'react';
import { bundleAnalyzer, BundleReport, ChunkInfo, OptimizationSuggestion } from '@/lib/performance/bundle-analyzer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Info, TrendingUp, Package, Zap } from 'lucide-react';

interface BundleAnalyzerPanelProps {
  className?: string;
}

export default function BundleAnalyzerPanel({ className = '' }: BundleAnalyzerPanelProps) {
  const [report, setReport] = useState<BundleReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeBundle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const bundleReport = await bundleAnalyzer.analyzeBundle();
      setReport(bundleReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 自動執行一次分析
    analyzeBundle();
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSeverityColor = (severity: OptimizationSuggestion['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: OptimizationSuggestion['severity']) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">正在分析 Bundle...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Bundle 分析器
          </h3>
          <button
            onClick={analyzeBundle}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            重新分析
          </button>
        </div>
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-4">
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  // 準備圖表數據
  const chartData = report.chunks.map(chunk => ({
    name: chunk.name,
    size: Math.round(chunk.size / 1024), // 轉換為 KB
    type: chunk.isEntry ? '入口點' : chunk.isAsync ? '異步' : '同步'
  }));

  const pieData = report.chunks.slice(0, 5).map((chunk, index) => ({
    name: chunk.name,
    value: chunk.size,
    color: `hsl(${index * 72}, 70%, 50%)`
  }));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 標題和控制項 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Bundle 分析報告
        </h3>
        <button
          onClick={analyzeBundle}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          重新分析
        </button>
      </div>

      {/* 總覽卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">總大小</p>
              <p className="text-2xl font-bold text-gray-900">{formatSize(report.totalSize)}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gzip 大小</p>
              <p className="text-2xl font-bold text-gray-900">{formatSize(report.gzipSize)}</p>
            </div>
            <Zap className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chunks 數量</p>
              <p className="text-2xl font-bold text-gray-900">{report.chunks.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">性能分數</p>
              <p className={`text-2xl font-bold ${getScoreColor(report.performanceScore)}`}>
                {report.performanceScore}/100
              </p>
            </div>
            <CheckCircle className={`w-8 h-8 ${getScoreColor(report.performanceScore)}`} />
          </div>
        </div>
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chunks 大小柱狀圖 */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Chunks 大小分布</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value} KB`, '大小']}
                labelFormatter={(label) => `Chunk: ${label}`}
              />
              <Bar dataKey="size" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chunks 組成圓餅圖 */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h4 className="text-md font-semibold text-gray-900 mb-4">前 5 大 Chunks</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatSize(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 大型 Chunks 列表 */}
      {report.largestChunks.length > 0 && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h4 className="text-md font-semibold text-gray-900 mb-4">大型 Chunks (超過 244KB)</h4>
          <div className="space-y-3">
            {report.largestChunks.map((chunk, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{chunk.name}</p>
                  <p className="text-sm text-gray-600">
                    模組: {chunk.modules.slice(0, 3).join(', ')}
                    {chunk.modules.length > 3 && ` +${chunk.modules.length - 3} 更多`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{formatSize(chunk.size)}</p>
                  <p className="text-xs text-gray-500">
                    {chunk.isEntry ? '入口點' : chunk.isAsync ? '異步載入' : '同步載入'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 優化建議 */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900">智能優化建議</h4>
          <div className="text-sm text-gray-500">
            預估總節省: {report.suggestions.reduce((sum, s) => sum + (s.estimatedSavings || 0), 0).toFixed(1)} KB
          </div>
        </div>
        <div className="space-y-4">
          {report.suggestions.map((suggestion, index) => (
            <div key={index} className={`p-4 border rounded-md ${getSeverityColor(suggestion.severity)}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-0.5">
                  {getSeverityIcon(suggestion.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{suggestion.title}</h5>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        suggestion.severity === 'high' ? 'bg-red-100 text-red-800' :
                        suggestion.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {suggestion.severity === 'high' ? '高優先級' :
                         suggestion.severity === 'medium' ? '中優先級' : '低優先級'}
                      </span>
                      {suggestion.estimatedSavings && (
                        <span className="text-sm font-medium text-green-600">
                          節省 {suggestion.estimatedSavings.toFixed(1)} KB
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm mb-3">{suggestion.description}</p>
                  <div className="text-xs space-y-2">
                    <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                      <p className="font-medium text-blue-900">💡 影響</p>
                      <p className="text-blue-800">{suggestion.impact}</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                      <p className="font-medium text-green-900">🔧 實作方式</p>
                      <pre className="text-green-800 whitespace-pre-wrap font-mono text-xs mt-1 overflow-x-auto">
                        {suggestion.implementation}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 快速行動按鈕 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">快速行動</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              📋 複製 Next.js 配置
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
              📊 生成詳細報告
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
              🚀 查看最佳實踐
            </button>
          </div>
        </div>
      </div>

      {/* 報告時間 */}
      <div className="text-center text-sm text-gray-500">
        報告生成時間: {report.generatedAt.toLocaleString('zh-TW')}
      </div>
    </div>
  );
}