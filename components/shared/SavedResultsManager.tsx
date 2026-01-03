'use client';

import { useState, useEffect } from 'react';
import { Trash2, Calendar, Calculator, Download, Eye } from 'lucide-react';
import { useSavedResults } from './ResultActions';

interface SavedResult {
  id: string;
  calculatorType: string;
  data: any;
  timestamp: number;
  title: string;
}

interface SavedResultsManagerProps {
  /** 是否顯示為模態框 */
  isModal?: boolean;
  /** 關閉模態框的回調 */
  onClose?: () => void;
}

/**
 * 保存結果管理組件
 * 顯示用戶保存的所有計算結果，支持查看、刪除和匯出
 */
export default function SavedResultsManager({ 
  isModal = false, 
  onClose 
}: SavedResultsManagerProps) {
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SavedResult | null>(null);
  const { getSavedResults, deleteSavedResult, clearAllSavedResults } = useSavedResults();

  useEffect(() => {
    loadSavedResults();
  }, []);

  const loadSavedResults = () => {
    const results = getSavedResults();
    // 按時間倒序排列（最新的在前）
    results.sort((a, b) => b.timestamp - a.timestamp);
    setSavedResults(results);
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除這個保存的結果嗎？')) {
      if (deleteSavedResult(id)) {
        loadSavedResults();
        if (selectedResult?.id === id) {
          setSelectedResult(null);
        }
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('確定要清除所有保存的結果嗎？此操作無法復原。')) {
      if (clearAllSavedResults()) {
        loadSavedResults();
        setSelectedResult(null);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatResultPreview = (data: any, type: string) => {
    switch (type) {
      case '薪資計算器':
        return `月薪: NT$ ${data.monthly?.gross?.toLocaleString() || 'N/A'} → 實領: NT$ ${data.monthly?.net?.toLocaleString() || 'N/A'}`;
      case '成本計算器':
        return `總成本: NT$ ${data.totalCost?.toLocaleString() || 'N/A'} | 毛利率: ${data.margin || 'N/A'}%`;
      case '信用卡分期計算器':
        return `月付: NT$ ${data.monthlyPayment?.toLocaleString() || 'N/A'} | 利息: NT$ ${data.totalInterest?.toLocaleString() || 'N/A'}`;
      default:
        return '查看詳細結果';
    }
  };

  const renderDetailedResult = (result: SavedResult) => {
    const { data, calculatorType } = result;
    
    switch (calculatorType) {
      case '薪資計算器':
        return (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4">
              <h4 className="font-semibold text-slate-800 mb-3">月薪明細</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>月薪總額</span>
                  <span className="font-mono">NT$ {data.monthly?.gross?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>勞保自付</span>
                  <span className="font-mono text-red-500">-NT$ {data.monthly?.laborInsurance?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>健保自付</span>
                  <span className="font-mono text-red-500">-NT$ {data.monthly?.healthInsurance?.toLocaleString() || 'N/A'}</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between font-semibold">
                  <span>實領金額</span>
                  <span className="font-mono text-green-600">NT$ {data.monthly?.net?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-4">
              <h4 className="font-semibold text-slate-800 mb-3">年度概算</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>年薪總額</span>
                  <span className="font-mono">NT$ {data.yearly?.gross?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>年度實領</span>
                  <span className="font-mono text-green-600">NT$ {data.yearly?.net?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case '成本計算器':
        return (
          <div className="glass-card rounded-xl p-4">
            <h4 className="font-semibold text-slate-800 mb-3">成本分析</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="text-slate-500">總成本</p>
                <p className="font-mono font-semibold">NT$ {data.totalCost?.toLocaleString() || 'N/A'}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-500">單位成本</p>
                <p className="font-mono font-semibold">NT$ {data.unitCost?.toLocaleString() || 'N/A'}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-500">毛利率</p>
                <p className={`font-mono font-semibold ${(data.margin || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {data.margin || 'N/A'}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-500">損益兩平</p>
                <p className="font-mono font-semibold">
                  {data.breakeven ? `${data.breakeven} 件` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        );
        
      case '信用卡分期計算器':
        return (
          <div className="glass-card rounded-xl p-4">
            <h4 className="font-semibold text-slate-800 mb-3">分期分析</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>每月應繳</span>
                <span className="font-mono">NT$ {data.monthlyPayment?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>總付款額</span>
                <span className="font-mono">NT$ {data.totalPayment?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>利息支出</span>
                <span className="font-mono text-red-500">NT$ {data.totalInterest?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>年利率</span>
                <span className="font-mono text-red-500">{data.interestRate || 'N/A'}%</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="glass-card rounded-xl p-4">
            <pre className="text-sm text-slate-600 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  const containerClass = isModal 
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    : "container max-w-6xl mx-auto px-4 py-8";

  const contentClass = isModal
    ? "bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
    : "glass-panel rounded-3xl p-8";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {/* 標題區 */}
        <div className="flex items-center justify-between mb-6 p-6 pb-0">
          <h2 className="text-2xl font-bold text-slate-900">保存的計算結果</h2>
          <div className="flex gap-2">
            {savedResults.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                清除全部
              </button>
            )}
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                關閉
              </button>
            )}
          </div>
        </div>

        {/* 內容區 */}
        <div className="flex-1 overflow-hidden px-6 pb-6">
          {savedResults.length === 0 ? (
            <div className="text-center py-12">
              <Calculator className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">還沒有保存任何計算結果</p>
              <p className="text-slate-400 text-sm mt-2">
                在計算器頁面點擊「保存結果」按鈕來保存您的計算
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 h-full">
              {/* 結果列表 */}
              <div className="space-y-3 overflow-y-auto">
                <h3 className="font-semibold text-slate-700 mb-3">
                  已保存 {savedResults.length} 個結果
                </h3>
                {savedResults.map((result) => (
                  <div
                    key={result.id}
                    className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                      selectedResult?.id === result.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-slate-800 text-sm">
                        {result.calculatorType}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(result.id);
                        }}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-xs text-slate-500 mb-2">
                      {formatResultPreview(result.data, result.calculatorType)}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(result.timestamp)}
                    </div>
                  </div>
                ))}
              </div>

              {/* 詳細結果 */}
              <div className="overflow-y-auto">
                {selectedResult ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-700">
                        {selectedResult.calculatorType} - 詳細結果
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(selectedResult.timestamp)}
                      </div>
                    </div>
                    {renderDetailedResult(selectedResult)}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>選擇一個結果查看詳細內容</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}