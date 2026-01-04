/**
 * 學習路徑詳細頁面
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BookOpen, Clock, CheckCircle, ArrowRight, Star, User } from 'lucide-react';
import { knowledgeEngine } from '@/features/knowledge-base/knowledge-engine';
import { LearningPath, KnowledgeArticle } from '@/features/knowledge-base/types';

export default function LearningPathPage() {
  const router = useRouter();
  const params = useParams();
  const pathId = params.id as string;
  
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [completedArticles, setCompletedArticles] = useState<Set<string>>(new Set());
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLearningPath = () => {
      setIsLoading(true);
      try {
        const paths = knowledgeEngine.getLearningPaths();
        const path = paths.find(p => p.id === pathId);
        
        if (!path) {
          router.push('/knowledge');
          return;
        }

        setLearningPath(path);
        
        // 載入文章內容
        const pathArticles = path.articles.map(articleId => {
          const searchResult = knowledgeEngine.searchArticles({ query: '', limit: 100 });
          return searchResult.articles.find(a => a.id === articleId);
        }).filter(Boolean) as KnowledgeArticle[];
        
        setArticles(pathArticles);
        
        // 從 localStorage 載入進度
        const savedProgress = localStorage.getItem(`learning-path-${pathId}`);
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          setCompletedArticles(new Set(progress.completedArticles || []));
          setCurrentArticleIndex(progress.currentArticleIndex || 0);
        }
      } catch (error) {
        console.error('載入學習路徑失敗:', error);
        router.push('/knowledge');
      } finally {
        setIsLoading(false);
      }
    };

    if (pathId) {
      loadLearningPath();
    }
  }, [pathId, router]);

  // 儲存進度
  const saveProgress = (completed: Set<string>, currentIndex: number) => {
    const progress = {
      completedArticles: Array.from(completed),
      currentArticleIndex: currentIndex,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`learning-path-${pathId}`, JSON.stringify(progress));
  };

  // 標記文章為已完成
  const markArticleCompleted = (articleId: string) => {
    const newCompleted = new Set(completedArticles);
    newCompleted.add(articleId);
    setCompletedArticles(newCompleted);
    saveProgress(newCompleted, currentArticleIndex);
  };

  // 開始閱讀文章
  const startReading = (articleId: string, index: number) => {
    setCurrentArticleIndex(index);
    saveProgress(completedArticles, index);
    router.push(`/knowledge/${articleId}?learning-path=${pathId}`);
  };

  // 計算完成進度
  const completionPercentage = articles.length > 0 
    ? Math.round((completedArticles.size / articles.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入學習路徑中...</p>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">學習路徑不存在</h2>
          <p className="text-gray-600 mb-4">找不到指定的學習路徑</p>
          <button
            onClick={() => router.push('/knowledge')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回知識庫
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <button
              onClick={() => router.push('/knowledge')}
              className="hover:text-blue-600 transition-colors"
            >
              知識庫
            </button>
            <ArrowRight className="w-4 h-4" />
            <span>學習路徑</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {learningPath.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {learningPath.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{articles.length} 篇文章</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>約 {learningPath.estimatedTime} 小時</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="capitalize">{learningPath.difficulty}</span>
                </div>
              </div>
            </div>
            
            {/* 進度圓環 */}
            <div className="flex-shrink-0 ml-8">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${completionPercentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 學習目標 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">學習目標</h2>
          <ul className="space-y-2">
            {learningPath.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 文章列表 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">學習內容</h2>
          
          <div className="space-y-4">
            {articles.map((article, index) => {
              const isCompleted = completedArticles.has(article.id);
              const isCurrent = index === currentArticleIndex;
              
              return (
                <div
                  key={article.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {article.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 ml-11">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 ml-11">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readingTime} 分鐘</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span>{article.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {isCompleted && (
                        <span className="text-green-600 text-sm font-medium">已完成</span>
                      )}
                      <button
                        onClick={() => startReading(article.id, index)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isCompleted ? '重新閱讀' : '開始閱讀'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 完成狀態 */}
          {completionPercentage === 100 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  🎉 恭喜完成學習路徑！
                </h3>
                <p className="text-gray-600 mb-4">
                  您已經完成了「{learningPath.title}」的所有學習內容
                </p>
                <button
                  onClick={() => router.push('/knowledge')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  探索更多學習內容
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}