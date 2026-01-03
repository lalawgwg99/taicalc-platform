'use client';

import { useState } from 'react';
import { Share2, Download, Save, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ResultActionsProps {
  /** 計算結果數據 */
  resultData: any;
  /** 計算器類型 */
  calculatorType: string;
  /** 結果容器的 ref，用於截圖 */
  resultRef?: React.RefObject<HTMLElement>;
  /** 自定義分享標題 */
  shareTitle?: string;
  /** 自定義分享描述 */
  shareDescription?: string;
}

interface SavedResult {
  id: string;
  calculatorType: string;
  data: any;
  timestamp: number;
  title: string;
}

/**
 * 結果分享和保存功能組件
 * 提供分享、保存到本地存儲、匯出為圖片等功能
 */
export default function ResultActions({
  resultData,
  calculatorType,
  resultRef,
  shareTitle = 'TaiCalc 計算結果',
  shareDescription = '使用 TaiCalc 計算的財務結果'
}: ResultActionsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  /**
   * 保存結果到本地存儲
   */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const savedResults = getSavedResults();
      const newResult: SavedResult = {
        id: Date.now().toString(),
        calculatorType,
        data: resultData,
        timestamp: Date.now(),
        title: `${shareTitle} - ${new Date().toLocaleDateString('zh-TW')}`
      };

      savedResults.push(newResult);
      
      // 限制保存數量，只保留最新的 50 個結果
      if (savedResults.length > 50) {
        savedResults.splice(0, savedResults.length - 50);
      }

      localStorage.setItem('taicalc_saved_results', JSON.stringify(savedResults));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('保存結果失敗:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * 獲取已保存的結果
   */
  const getSavedResults = (): SavedResult[] => {
    try {
      const saved = localStorage.getItem('taicalc_saved_results');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  /**
   * 複製結果到剪貼板
   */
  const handleCopyResult = async () => {
    try {
      const resultText = formatResultForSharing(resultData, calculatorType);
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('複製失敗:', error);
    }
  };

  /**
   * 分享結果（使用 Web Share API 或回退到複製）
   */
  const handleShare = async () => {
    const shareData = {
      title: shareTitle,
      text: shareDescription,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 回退到複製連結
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('分享失敗:', error);
    }
  };

  /**
   * 匯出結果為圖片
   */
  const handleExportImage = async () => {
    if (!resultRef?.current) {
      console.error('無法找到結果容器');
      return;
    }

    setIsExporting(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 提高解析度
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      // 創建下載連結
      const link = document.createElement('a');
      link.download = `taicalc-${calculatorType}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('匯出圖片失敗:', error);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * 格式化結果為文字格式，用於分享
   */
  const formatResultForSharing = (data: any, type: string): string => {
    const timestamp = new Date().toLocaleDateString('zh-TW');
    let resultText = `📊 TaiCalc ${type} 計算結果 (${timestamp})\n\n`;

    // 根據不同計算器類型格式化結果
    switch (type) {
      case '薪資計算器':
        if (data.monthly && data.yearly) {
          resultText += `💰 月薪明細:\n`;
          resultText += `• 月薪總額: NT$ ${data.monthly.gross?.toLocaleString() || 'N/A'}\n`;
          resultText += `• 實領金額: NT$ ${data.monthly.net?.toLocaleString() || 'N/A'}\n\n`;
          resultText += `📅 年度概算:\n`;
          resultText += `• 年薪總額: NT$ ${data.yearly.gross?.toLocaleString() || 'N/A'}\n`;
          resultText += `• 年度實領: NT$ ${data.yearly.net?.toLocaleString() || 'N/A'}\n`;
        }
        break;
      case '成本計算器':
        if (data.totalCost !== undefined) {
          resultText += `💼 成本分析:\n`;
          resultText += `• 總成本: NT$ ${data.totalCost?.toLocaleString() || 'N/A'}\n`;
          resultText += `• 單位成本: NT$ ${data.unitCost?.toLocaleString() || 'N/A'}\n`;
          resultText += `• 毛利率: ${data.margin || 'N/A'}%\n`;
          if (data.breakeven) {
            resultText += `• 損益兩平: ${data.breakeven} 件\n`;
          }
        }
        break;
      case '信用卡分期計算器':
        if (data.totalPayment !== undefined) {
          resultText += `💳 分期分析:\n`;
          resultText += `• 每月應繳: NT$ ${data.monthlyPayment?.toLocaleString() || 'N/A'}\n`;
          resultText += `• 總付款額: NT$ ${data.totalPayment?.toLocaleString() || 'N/A'}\n`;
          resultText += `• 利息支出: NT$ ${data.totalInterest?.toLocaleString() || 'N/A'}\n`;
          resultText += `• 年利率: ${data.interestRate || 'N/A'}%\n`;
        }
        break;
      default:
        resultText += JSON.stringify(data, null, 2);
    }

    resultText += `\n🔗 計算來源: ${window.location.href}`;
    return resultText;
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {/* 保存按鈕 */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" />
            已保存
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {isSaving ? '保存中...' : '保存結果'}
          </>
        )}
      </button>

      {/* 複製按鈕 */}
      <button
        onClick={handleCopyResult}
        className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            已複製
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            複製結果
          </>
        )}
      </button>

      {/* 分享按鈕 */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
      >
        <Share2 className="w-4 h-4" />
        分享
      </button>

      {/* 匯出圖片按鈕 */}
      {resultRef && (
        <button
          onClick={handleExportImage}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isExporting ? '匯出中...' : '匯出圖片'}
        </button>
      )}
    </div>
  );
}

/**
 * Hook 用於管理保存的結果
 */
export function useSavedResults() {
  const getSavedResults = (): SavedResult[] => {
    try {
      const saved = localStorage.getItem('taicalc_saved_results');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const deleteSavedResult = (id: string) => {
    try {
      const savedResults = getSavedResults();
      const filtered = savedResults.filter(result => result.id !== id);
      localStorage.setItem('taicalc_saved_results', JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  };

  const clearAllSavedResults = () => {
    try {
      localStorage.removeItem('taicalc_saved_results');
      return true;
    } catch {
      return false;
    }
  };

  return {
    getSavedResults,
    deleteSavedResult,
    clearAllSavedResults
  };
}