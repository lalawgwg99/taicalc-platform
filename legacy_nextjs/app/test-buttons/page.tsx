'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const runtime = 'edge';

export default function TestButtonsPage() {
  const router = useRouter();

  const handleClick = (buttonName: string) => {
    console.log(`按鈕點擊: ${buttonName}`);
    alert(`${buttonName} 按鈕被點擊了！`);
  };

  const handleNavigation = (path: string) => {
    console.log(`導航到: ${path}`);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">按鈕功能測試頁面</h1>
        
        <div className="space-y-8">
          {/* 基本按鈕測試 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">基本按鈕測試</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleClick('基本按鈕')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                基本按鈕
              </button>
              
              <button
                onClick={() => handleClick('樣式按鈕')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
              >
                樣式按鈕
              </button>
            </div>
          </div>

          {/* Next.js Link 測試 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Next.js Link 測試</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/salary"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                薪資計算頁面
              </Link>
              
              <Link
                href="/knowledge"
                className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                知識庫頁面
              </Link>
              
              <Link
                href="/mortgage"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                房貸計算頁面
              </Link>
            </div>
          </div>

          {/* useRouter 測試 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">useRouter 導航測試</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleNavigation('/salary')}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Router 導航到薪資
              </button>
              
              <button
                onClick={() => handleNavigation('/knowledge')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Router 導航到知識庫
              </button>
            </div>
          </div>

          {/* 複雜樣式按鈕測試 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">複雜樣式按鈕測試</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleClick('複雜樣式按鈕')}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                複雜樣式按鈕
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* 返回首頁 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">返回測試</h2>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}