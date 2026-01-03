/**
 * 知識庫搜尋小工具
 * 可嵌入到其他頁面中提供快速搜尋功能
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, BookOpen, Clock, Star, X } from 'lucide-react';
import Link from 'next/link';
import { knowledgeEngine } from '@/features/knowledge-base/knowledge-engine';
import { KnowledgeArticle } from '@/features/knowledge-base/types';

interface KnowledgeSearchWidgetProps {
  placeholder?: string;
  maxResults?: number;
  showCategories?: boolean;
  onArticleSelect?: (article: KnowledgeArticle) => void;
}

export default function KnowledgeSearchWidget({
  placeholder = '搜尋財務知識...',
  maxResults = 5,
  showCategories = true,
  onArticleSelect
}: KnowledgeSearchWidgetProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KnowledgeArticle[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 分類標籤映射
  const categoryLabels: Record<string, string> = {
    salary: '薪資計算',
    tax: '稅務規劃',
    investment: '投資理財',
    mortgage: '房貸規劃',
    retirement: '退休規劃',
    insurance: '保險規劃',
    budgeting: '預算管理',
    debt_management: '債務管理',
    financial_planning: '財務規劃',
    career_development: '職涯發展'
  };

  // 搜尋功能
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResult = knowledgeEngine.searchArticles({
        query: searchQuery.trim(),
        limit: maxResults
      });
      
      setResults(searchResult.articles);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('搜尋失敗:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 處理輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // 防抖搜尋
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // 處理鍵盤導航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleArticleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 處理文章選擇
  const handleArticleSelect = (article: KnowledgeArticle) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (onArticleSelect) {
      onArticleSelect(article);
    }
  };

  // 點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* 搜尋輸入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 搜尋結果下拉選單 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">搜尋中...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((article, index) => (
                <div key={article.id}>
                  <Link
                    href={`/knowledge/${article.id}`}
                    onClick={() => handleArticleSelect(article)}
                    className={`block p-4 hover:bg-gray-50 transition-colors duration-150 ${
                      index === selectedIndex ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {showCategories && (
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {categoryLabels[article.category]}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readingTime}分鐘</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{article.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {index < results.length - 1 && <div className="border-b border-gray-100" />}
                </div>
              ))}
              
              {/* 查看更多結果 */}
              <div className="border-t border-gray-100 p-3">
                <Link
                  href={`/knowledge?q=${encodeURIComponent(query)}`}
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    setIsOpen(false);
                  }}
                >
                  查看所有搜尋結果
                </Link>
              </div>
            </>
          ) : query.trim() ? (
            <div className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">未找到相關文章</p>
              <Link
                href={`/knowledge?q=${encodeURIComponent(query)}`}
                className="text-sm text-blue-600 hover:text-blue-700"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setIsOpen(false);
                }}
              >
                在知識庫中搜尋
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}