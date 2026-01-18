'use client';

/**
 * HyperGrid 主控制台
 * 左右分屏：指令輸入 + 即時預覽
 */

import { useState } from 'react';
import { Engine } from '@/components/Engine';
import { AIResponse } from '@/types/schema';
import { Sparkles, Download, Copy, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [uiData, setUiData] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 處理生成請求
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '生成失敗');
      }

      setUiData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 匯出功能：複製 JSON
  const handleCopyJSON = () => {
    if (!uiData) return;

    navigator.clipboard.writeText(JSON.stringify(uiData.layout, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 匯出功能：下載 HTML
  const handleDownloadHTML = () => {
    if (!uiData) return;

    const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HyperGrid 生成頁面</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 p-8">
  <!-- 此處需手動整合 Engine 渲染邏輯 -->
  <div id="root">
    ${JSON.stringify(uiData.layout, null, 2)}
  </div>
</body>
</html>
    `.trim();

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hypergrid-export.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 快捷範例
  const templates = [
    { label: '🏷️ 電商促銷', prompt: '設計一個家電促銷頁，包含 3 個產品卡片、折扣標籤、倒數計時器與搶購按鈕' },
    { label: '📊 產品比價', prompt: '建立一個比價介面，顯示 Sony、Dyson、Panasonic 三個品牌的價格圖表' },
    { label: '🎁 新品上市', prompt: '設計新品發表頁，大標題、產品圖、特色清單與預購按鈕' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* ========== 左側：控制面板 ========== */}
      <div className="w-1/3 min-w-[400px] p-8 bg-white border-r border-slate-200 flex flex-col gap-6 overflow-y-auto">
        {/* Logo */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            HyperGrid
          </h1>
          <p className="text-sm text-slate-500">動態商用渲染引擎</p>
        </div>

        {/* 輸入區 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            輸入設計需求
          </label>
          <textarea
            className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
            placeholder="例如：設計一個適合家電展的促銷卡片，包含三個產品和一個搶購按鈕..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleGenerate();
              }
            }}
          />
          <div className="text-xs text-slate-400">
            💡 按 Ctrl+Enter 快速生成
          </div>
        </div>

        {/* 快捷模板 */}
        <div>
          <div className="text-xs font-medium text-slate-600 mb-2">快速範例</div>
          <div className="flex flex-wrap gap-2">
            {templates.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(t.prompt)}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 生成按鈕 */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Clock className="w-5 h-5 animate-spin" />
              AI 建構中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              生成 UI 介面
            </>
          )}
        </button>

        {/* 狀態提示 */}
        {uiData && !error && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
              <CheckCircle2 className="w-5 h-5" />
              AI 解析完成
            </div>
            <p className="text-sm text-green-700">{uiData.summary}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-1">
              <AlertCircle className="w-5 h-5" />
              生成失敗
            </div>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 匯出工具 */}
        {uiData && (
          <div className="flex gap-2 pt-4 border-t border-slate-200">
            <button
              onClick={handleCopyJSON}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">已複製</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  複製 JSON
                </>
              )}
            </button>
            <button
              onClick={handleDownloadHTML}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              下載 HTML
            </button>
          </div>
        )}
      </div>

      {/* ========== 右側：預覽畫布 ========== */}
      <div className="flex-1 p-10 flex items-center justify-center overflow-y-auto">
        {uiData ? (
          <div className="w-full max-w-3xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4">
            <Engine data={uiData.layout} />
          </div>
        ) : (
          <div className="text-slate-400 text-center">
            <div className="text-7xl mb-6">🎨</div>
            <p className="text-lg font-medium text-slate-500 mb-2">等待指令輸入</p>
            <p className="text-sm text-slate-400">輸入你的設計需求，讓 AI 為你生成專業介面</p>
          </div>
        )}
      </div>
    </div>
  );
}
