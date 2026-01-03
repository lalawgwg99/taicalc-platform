/**
 * 文章推薦組件
 * 根據用戶當前使用的計算器或瀏覽內容推薦相關文章
 */

'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Star, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { knowledgeEngine } from '@/features/knowledge-base/knowledge-engine';
import { KnowledgeArticle, ArticleRecommendation } from '@/features/knowledge-base/types';

interface ArticleRecommendationsProps {
  calculatorType?: string;
  currentArticleId?: string;
  userInterests?: string[];
  title?: string;
  maxItems?: number;
  showReason?: boolean;
  compact?: boolean;
}

export default function ArticleRecommendations({
  calculatorType,
  currentArticleId,
  userInterests = [],
  title = '推薦閱讀',
  maxItems = 3,
  showReason = true,
  compact = false
}: ArticleRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ArticleRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // 載入推薦文章
  const loadRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let recs: ArticleRecommendation[] = [];

      // 基於當前文章推薦
      if (currentArticleId) {
        recs = knowledgeEngine.getArticleRecommendations(currentArticleId, undefined, maxItems);
      }
      // 基於計算器類型推薦
      else if (calculatorType) {
        const articles = knowledgeEngine.getArticlesByCalculator(calculatorType, maxItems);
        recs = articles.map(article => ({
          article,
          reason: `與${getCalculatorName(calculatorType)}相關`,
          relevanceScore: 0.8
        }));
      }
      // 基於用戶興趣推薦
      else if (userInterests.length > 0) {
        const searchResult = knowledgeEngine.searchArticles({
          query: '',
          tags: userInterests,
          limit: maxItems
        });
        recs = searchResult.articles.map(article => ({
          article,
          reason: `符合您的興趣：${userInterests.join('、')}`,
          relevanceScore: 0.7
        }));
      }
      // 預設推薦熱門文章
      else {
        const articles = knowledgeEngine.getPopularArticles(maxItems);
        recs = articles.map(article => ({
          article,
          reason: '熱門推薦',
          relevanceScore: 0.6
        }));
      }

      setRecommendations(recs);
    } catch (err) {
      console.error('載入推薦文章失敗:', err);
      setError('載入推薦文章失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 獲取計算器名稱
  const getCalculatorName = (type: string): string => {
    const names: Record<string, string> = {
      salary: '薪資計算器',
      tax: '稅務計算器',
      mortgage: '房貸計算器',
      retirement: '退休規劃',
      capital: '投資計算器',
      insurance: '保險計算器'
    };
    return names[type] || type;
  };

  // 重新載入推薦
  const handleRefresh = () => {
    loadRecommendations();
  };

  useEffect(() => {
    loadRecommendations();
  }, [calculatorType, currentArticleId, userInterests, maxItems]);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md ${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
            {title}
          </h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: maxItems }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md ${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
            {title}
          </h3>
          <button
            onClick={handleRefresh}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-6">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">
            {error || '暫無推薦文章'}
          </p>
          <Link
            href="/knowledge"
            className="inline-block mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            瀏覽知識庫
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="重新載入推薦"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/knowledge"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            查看更多
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <Link
            key={rec.article.id}
            href={`/knowledge/${rec.article.id}`}
            className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium text-gray-900 line-clamp-2 mb-1 ${compact ? 'text-sm' : 'text-base'}`}>
                  {rec.article.title}
                </h4>
                
                {!compact && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {rec.article.summary}
                  </p>
                )}
                
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {categoryLabels[rec.article.category]}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{rec.article.readingTime}分鐘</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{rec.article.rating}</span>
                  </div>
                </div>
                
                {showReason && (
                  <div className="text-xs text-blue-600">
                    {rec.reason}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 查看更多按鈕 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/knowledge"
          className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
        >
          探索更多財務知識
        </Link>
      </div>
    </div>
  );
}