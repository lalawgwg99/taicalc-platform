'use client';

import React, { useEffect } from 'react';

export const runtime = 'edge';

export default function DebugPage() {
  useEffect(() => {
    // 檢查是否有全域事件監聽器阻止點擊
    const handleGlobalClick = (e: MouseEvent) => {
      console.log('全域點擊事件:', e.target);
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      console.log('全域按鍵事件:', e.key);
    };

    document.addEventListener('click', handleGlobalClick, true);
    document.addEventListener('keydown', handleGlobalKeyDown, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      document.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, []);

  const testClick = (message: string) => {
    console.log('測試點擊:', message);
    alert(`測試成功: ${message}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">按鈕診斷頁面</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            這個頁面用來診斷按鈕點擊問題。請打開瀏覽器開發者工具的控制台查看日誌。
          </p>
          
          {/* 最基本的按鈕 */}
          <button
            onClick={() => testClick('基本按鈕')}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            基本按鈕（內聯樣式）
          </button>
          
          {/* Tailwind 樣式按鈕 */}
          <button
            onClick={() => testClick('Tailwind 按鈕')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
          >
            Tailwind 樣式按鈕
          </button>
          
          {/* 高 z-index 按鈕 */}
          <button
            onClick={() => testClick('高 z-index 按鈕')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            style={{ position: 'relative', zIndex: 9999 }}
          >
            高 z-index 按鈕
          </button>
          
          {/* 簡單連結 */}
          <a
            href="/salary"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              testClick('連結點擊');
              window.location.href = '/salary';
            }}
          >
            測試連結
          </a>
          
          {/* 事件冒泡測試 */}
          <div 
            className="p-4 bg-gray-200 rounded-lg"
            onClick={() => console.log('外層 div 點擊')}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                testClick('阻止冒泡按鈕');
              }}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              阻止冒泡按鈕
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">診斷步驟：</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>打開瀏覽器開發者工具（F12）</li>
              <li>切換到 Console 標籤</li>
              <li>點擊上面的按鈕</li>
              <li>查看控制台是否有錯誤或日誌</li>
              <li>檢查是否有彈出視窗</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}