'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, Menu, X, Home, ChevronDown, Sparkles } from 'lucide-react';

// 主導航項目（精簡版）
const mainNavItems = [
  { href: '/', label: '首頁', icon: Home },
  { href: '/salary', label: '薪資計算', icon: Calculator },
  { href: '/mortgage', label: '房貸試算', icon: Home },
  { href: '/tax', label: '稅務計算', icon: Calculator },
];

// 工具分類（下拉選單）
const toolCategories = [
  {
    label: '📊 財務計算',
    items: [
      { href: '/tools/cost-calculator', label: '成本計算機' },
      { href: '/tools/profit-calculator', label: '利潤計算機' },
      { href: '/tools/percentage-calculator', label: '百分比計算' },
      { href: '/tools/credit-card-calculator', label: '信用卡計算' },
      { href: '/tools/electricity-calculator', label: '電費計算' },
      { href: '/tools/rent-cost-calculator', label: '租金成本' },
    ]
  },
  {
    label: '💼 工作相關',
    items: [
      { href: '/tools/work-hours-calculator', label: '工時計算機' },
      { href: '/tools/overtime-calculator', label: '加班費計算' },
      { href: '/tools/delivery-income-calculator', label: '外送收入' },
      { href: '/tools/labor-pension-calculator', label: '勞退計算' },
    ]
  },
  {
    label: '🛠️ 其他工具',
    items: [
      { href: '/tools/split-calculator', label: '分帳計算' },
      { href: '/tools/image-optimizer', label: '圖片優化' },
      { href: '/tools/performance', label: '績效分析' },
    ]
  }
];

/**
 * 導航組件（分類下拉選單版）
 */
export default function NavigationFixed() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<number | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setMobileExpandedCategory(null);
  };

  // 桌面版：滑鼠進入分類
  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(index);
  };

  // 桌面版：滑鼠離開分類（延遲關閉）
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  // 手機版：切換分類展開
  const toggleMobileCategory = (index: number) => {
    setMobileExpandedCategory(prev => prev === index ? null : index);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
          : 'bg-white/80 backdrop-blur-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                {scrolled && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
                )}
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  TaiCalc
                </span>
                <div className="text-xs text-gray-500 -mt-1">台灣財務計算</div>
              </div>
            </Link>

            {/* 桌面版導航 */}
            <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
              {/* 主導航項目 */}
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* 工具下拉選單 */}
              {toolCategories.map((category, idx) => (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeDropdown === idx
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <span>{category.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === idx ? 'rotate-180' : ''
                      }`} />
                  </button>

                  {/* 下拉選單 */}
                  {activeDropdown === idx && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      {category.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 text-sm transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 2025 標籤 */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-full text-xs font-medium text-emerald-700">
                <Sparkles className="w-3 h-3" />
                <span>2025最新</span>
              </div>
            </div>

            {/* 手機版選單按鈕 */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 手機版導航選單 */}
        {isOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-2">
              {/* 主導航項目 */}
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* 分類選單 */}
              {toolCategories.map((category, idx) => (
                <div key={idx} className="border-t border-gray-100 pt-2 mt-2">
                  <button
                    onClick={() => toggleMobileCategory(idx)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    <span>{category.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedCategory === idx ? 'rotate-180' : ''
                      }`} />
                  </button>

                  {/* 展開的子項目 */}
                  {mobileExpandedCategory === idx && (
                    <div className="ml-4 mt-1 space-y-1">
                      {category.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                              }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* 手機版選單背景遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
}