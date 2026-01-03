/**
 * 財務知識庫文章詳細頁面
 * 顯示文章內容和相關推薦
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, Star, BookOpen, Share2, Bookmark, Eye, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { knowledgeEngine } from '@/features/knowledge-base/knowledge-engine';
import { KnowledgeArticle, ArticleRecommendation } from '@/features/knowledge-base/types';

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<KnowledgeArticle | null>(null);
  const [recommendations, setRecommendations] = useState<ArticleRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      try {
        // 模擬從知識庫獲取文章
        const allArticles = knowledgeEngine.getPopularArticles(100); // 獲取所有文章
        const foundArticle = allArticles.find(a => a.id === articleId);
        
        if (foundArticle) {
          setArticle(foundArticle);
          
          // 獲取推薦文章
          const recs = knowledgeEngine.getArticleRecommendations(articleId);
          setRecommendations(recs);
        }
      } catch (error) {
        console.error('載入文章失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch (error) {
        // 如果分享失敗，複製到剪貼板
        navigator.clipboard.writeText(window.location.href);
        alert('連結已複製到剪貼板');
      }
    } else {
      // 備用方案：複製到剪貼板
      navigator.clipboard.writeText(window.location.href);
      alert('連結已複製到剪貼板');
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 這裡可以添加實際的書籤保存邏輯
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">文章不存在</h2>
          <p className="text-gray-600 mb-4">抱歉，找不到您要查看的文章。</p>
          <Link 
            href="/knowledge"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            返回知識庫
          </Link>
        </div>
      </div>
    );
  }

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

  // 難度標籤映射
  const difficultyLabels: Record<string, { label: string; color: string }> = {
    beginner: { label: '初級', color: 'text-green-600 bg-green-100' },
    intermediate: { label: '中級', color: 'text-yellow-600 bg-yellow-100' },
    advanced: { label: '高級', color: 'text-red-600 bg-red-100' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 導航欄 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/knowledge"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回知識庫
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 文章標題區域 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {categoryLabels[article.category] || article.category}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full ${difficultyLabels[article.difficulty]?.color}`}>
                  {difficultyLabels[article.difficulty]?.label}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {article.summary}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{article.publishDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readingTime} 分鐘閱讀</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.views} 次瀏覽</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{article.rating}/5</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-6">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isBookmarked 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* 標籤 */}
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 文章內容 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: article.content.replace(/\n/g, '<br />').replace(/#{1,6}\s/g, '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-900">').replace(/<h3[^>]*>/g, '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-900">') 
              }}
            />
          </div>
        </div>

        {/* 相關計算器 */}
        {article.relatedCalculators.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">相關計算器</h3>
            <div className="flex flex-wrap gap-3">
              {article.relatedCalculators.map(calculator => (
                <Link
                  key={calculator}
                  href={`/${calculator}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {calculator === 'salary' && '薪資計算器'}
                  {calculator === 'tax' && '稅務計算器'}
                  {calculator === 'mortgage' && '房貸計算器'}
                  {calculator === 'retirement' && '退休規劃'}
                  {calculator === 'capital' && '投資計算器'}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 推薦文章 */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">推薦閱讀</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map(rec => (
                <Link
                  key={rec.article.id}
                  href={`/knowledge/${rec.article.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 line-clamp-2 flex-1">
                      {rec.article.title}
                    </h4>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{rec.article.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {rec.article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {categoryLabels[rec.article.category]}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{rec.article.readingTime} 分鐘</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-blue-600">
                    推薦理由：{rec.reason}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}