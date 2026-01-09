'use client';

import { useState } from 'react';
import { Share2, Save, Copy, Check } from 'lucide-react';

interface ResultActionsProps {
  resultData: any;
  calculatorType: string;
  resultRef?: React.RefObject<HTMLElement>;
  shareTitle?: string;
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
 */
export default function ResultActions({
  resultData,
  calculatorType,
  shareTitle = 'TaiCalc 計算結果',
  shareDescription = '使用 TaiCalc 計算的財務結果'
}: ResultActionsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const getSavedResults = (): SavedResult[] => {
    try {
      const saved = localStorage.getItem('taicalc_saved_results');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

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
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('分享失敗:', error);
    }
  };

  const formatResultForSharing = (data: any, type: string): string => {
    const timestamp = new Date().toLocaleDateString('zh-TW');
    let resultText = `📊 TaiCalc ${type} 計算結果 (${timestamp})\n\n`;
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
      default:
        resultText += JSON.stringify(data, null, 2);
    }
    resultText += `\n🔗 計算來源: ${window.location.href}`;
    return resultText;
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6">
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
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
      >
        <Share2 className="w-4 h-4" />
        分享
      </button>
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

  return { getSavedResults, deleteSavedResult, clearAllSavedResults };
}