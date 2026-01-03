/**
 * 財務知識庫主頁面
 * 提供文章搜尋、分類瀏覽和學習路徑功能
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, TrendingUp, Clock, Star, Filter, Grid, List } from 'lucide-react';
import { knowledgeEngine } from '@/features/knowledge-base/knowledge-engine';
import { KnowledgeArticle, KnowledgeCategory, SearchResult, LearningPath } from '@/features/knowledge-base/types';

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | ''>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | ''>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [popularArticles, setPopularArticles] = useState<KnowledgeArticle[]>([]);
  const [latestArticles, setLatestArticles] = useState<KnowledgeArticle[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 分類選項
  const categories: { value: KnowledgeCategory; label: string }[] = [
    { value: 'salary', label: '薪資計算' },
    { value: 'tax', label: '稅務規劃' },
    { value: 'investment', label: '投資理財' },
    { value: 'mortgage', label: '房貸規劃' },
    { value: 'retirement', label: '退休規劃' },
    { value: 'insurance', label: '保險規劃' },
    { value: 'budgeting', label: '預算管理' },
    { value: 'debt_management', label: '債務管理' },
    { value: 'financial_planning', label: '財務規劃' },
    { value: 'career_development', label: '職涯發展' }
  ];

  // 難度選項
  const difficulties = [
    { value: 'beginner', label: '初級', color: 'text-green-600' },
    { value: 'intermediate', label: '中級', color: 'text-yellow-600' },
    { value: 'advanced', label: '高級', color: 'text-red-600' }
  ];

  // 初始化數據
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const popular = knowledgeEngine.getPopularArticles(6);
        const latest = knowledgeEngine.getLatestArticles(6);
        const paths = knowledgeEngine.getLearningPaths();
        
        setPopularArticles(popular);
        setLatestArticles(latest);
        setLearningPaths(paths);
      } catch (error) {
        console.error('載入知識庫數據失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // 處理 URL 查詢參數
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    
    if (queryParam) {
      setSearchQuery(queryParam);
      // 自動執行搜尋
      const searchWithQuery = async () => {
        setIsLoading(true);
        try {
          const results = knowledgeEngine.searchArticles({
            query: queryParam,
            limit: 20
          });
          setSearchResults(results);
        } catch (error) {
          console.error('搜尋失敗:', error);
        } finally {
          setIsLoading(false);
        }
      };
      searchWithQuery();
    }
  }, []);

  // 執行搜尋
  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedCategory && !selectedDifficulty) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const results = knowledgeEngine.searchArticles({
        query: searchQuery.trim(),
        category: selectedCategory || undefined,
        difficulty: selectedDifficulty || undefined,
        limit: 20
      });
      setSearchResults(results);
    } catch (error) {
      console.error('搜尋失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 清除搜尋
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSearchResults(null);
  };

  // 獲取分類標籤
  const getCategoryLabel = (category: KnowledgeCategory) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  // 獲取難度樣式
  const getDifficultyStyle = (difficulty: string) => {
    const diff = difficulties.find(d => d.value === difficulty);
    return diff?.color || 'text-gray-600';
  };

  // 文章卡片組件
  const ArticleCard = ({ article, showCategory = true }: { article: KnowledgeArticle; showCategory?: boolean }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>
          {showCategory && (
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {getCategoryLabel(article.category)}
              </span>
              <span className={`text-xs font-medium ${getDifficultyStyle(article.difficulty)}`}>
                {difficulties.find(d => d.value === article.difficulty)?.label}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm text-gray-600">{article.rating}</span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {article.summary}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{article.readingTime} 分鐘</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{article.views} 次瀏覽</span>
          </div>
        </div>
        <span>{article.publishDate}</span>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {article.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {tag}
          </span>
        ))}
        {article.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            +{article.tags.length - 3}
          </span>
        )}
      </div>
      
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
        閱讀文章
      </button>
    </div>
  );

  // 學習路徑卡片組件
  const LearningPathCard = ({ path }: { path: LearningPath }) => (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyStyle(path.difficulty)} bg-white`}>
          {difficulties.find(d => d.value === path.difficulty)?.label}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{path.description}</p>
      
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          <span>{path.articles.length} 篇文章</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{path.estimatedTime} 小時</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">學習目標：</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          {path.objectives.slice(0, 2).map((objective, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-blue-600 mt-1">•</span>
              <span>{objective}</span>
            </li>
          ))}
          {path.objectives.length > 2 && (
            <li className="text-blue-600">+{path.objectives.length - 2} 個目標</li>
          )}
        </ul>
      </div>
      
      <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200">
        開始學習
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">財務知識庫</h1>
            <p className="text-lg text-gray-600">學習理財知識，提升財務素養</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜尋區域 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜尋財務知識..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as KnowledgeCategory)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">所有分類</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">所有難度</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? '搜尋中...' : '搜尋'}
              </button>
              <button
                onClick={clearSearch}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                清除
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 搜尋結果 */}
        {searchResults && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                搜尋結果 ({searchResults.totalCount})
              </h2>
            </div>
            
            {searchResults.articles.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {searchResults.articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相關文章</h3>
                <p className="text-gray-600 mb-4">請嘗試其他關鍵字或調整篩選條件</p>
                {searchResults.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">搜尋建議：</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {searchResults.suggestions.map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            handleSearch();
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 預設內容 */}
        {!searchResults && (
          <>
            {/* 學習路徑 */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">學習路徑</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  查看全部
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningPaths.map(path => (
                  <LearningPathCard key={path.id} path={path} />
                ))}
              </div>
            </div>

            {/* 熱門文章 */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">熱門文章</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  查看更多
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* 最新文章 */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">最新文章</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  查看更多
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}