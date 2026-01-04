'use client';

import React from 'react';
import Link from 'next/link';
import { Calculator, Home, TrendingUp, PiggyBank, BookOpen, ArrowRight } from 'lucide-react';

export const runtime = 'edge';

const calculators = [
  {
    id: 'salary',
    title: '薪資計算',
    href: '/salary',
    icon: Calculator,
    description: '計算實領薪資、勞健保、勞退'
  },
  {
    id: 'mortgage',
    title: '房貸試算',
    href: '/mortgage',
    icon: Home,
    description: '房貸月付金、利息總額試算'
  },
  {
    id: 'tax',
    title: '稅務計算',
    href: '/tax',
    icon: TrendingUp,
    description: '所得稅、綜所稅試算'
  },
  {
    id: 'capital',
    title: '投資理財',
    href: '/capital',
    icon: PiggyBank,
    description: '複利計算、投資報酬率'
  }
];

export default function SimpleHomePage() {
  const handleButtonClick = (name: string) => {
    console.log(`按鈕點擊: ${name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 簡化的 Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            台灣人的智慧財務計算平台
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            薪資、房貸、稅務、投資一站搞定
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/salary"
              onClick={() => handleButtonClick('開始計算薪資')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              開始計算薪資
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/knowledge"
              onClick={() => handleButtonClick('理財知識庫')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              理財知識庫
            </Link>
          </div>

          {/* 計算器網格 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.id}
                  href={calc.href}
                  onClick={() => handleButtonClick(calc.title)}
                  className="block p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {calc.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600">
                    {calc.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 測試區域 */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">按鈕測試區域</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('測試按鈕 1')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              測試按鈕 1
            </button>
            
            <button
              onClick={() => handleButtonClick('測試按鈕 2')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              測試按鈕 2
            </button>
            
            <button
              onClick={() => handleButtonClick('測試按鈕 3')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              測試按鈕 3
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              請打開瀏覽器開發者工具的控制台，點擊上面的按鈕查看是否有日誌輸出。
              如果有日誌但沒有導航，可能是路由問題。如果沒有日誌，可能是事件監聽問題。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}