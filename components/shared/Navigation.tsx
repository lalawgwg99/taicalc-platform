'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, BookOpen, Menu, X, Home, TrendingUp, PiggyBank, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigationItems = [
  { href: '/', label: '首頁', icon: Home },
  { href: '/salary', label: '薪資計算', icon: Calculator, popular: true },
  { href: '/mortgage', label: '房貸試算', icon: Home },
  { href: '/tax', label: '稅務計算', icon: TrendingUp },
  { href: '/capital', label: '投資理財', icon: PiggyBank },
  { href: '/knowledge', label: '知識庫', icon: BookOpen },
];

/**
 * 現代化主導航組件
 */
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 關閉手機選單
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
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
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    
                    {/* 熱門標籤 */}
                    {item.popular && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                    
                    {/* 懸停效果 */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* 桌面版 CTA */}
            <div className="hidden lg:flex items-center space-x-4">
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
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* 手機版導航選單 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          isActive 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span>{item.label}</span>
                            {item.popular && (
                              <div className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                                熱門
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {isActive && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* 手機版額外信息 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="pt-4 mt-4 border-t border-gray-200"
                >
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl text-sm font-medium text-emerald-700">
                    <Sparkles className="w-4 h-4" />
                    <span>使用2025年最新法規計算</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 手機版選單背景遮罩 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
}