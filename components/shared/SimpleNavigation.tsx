'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { href: '/', label: '首頁' },
  { href: '/salary', label: '薪資計算' },
  { href: '/mortgage', label: '房貸試算' },
  { href: '/tax', label: '稅務計算' },
  { href: '/knowledge', label: '知識庫' },
];

/**
 * 簡化版導航組件 - 用於測試
 */
export default function SimpleNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            TaiCalc
          </Link>

          {/* 導航連結 */}
          <div className="flex items-center space-x-6">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => console.log(`點擊了: ${item.label}`)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}