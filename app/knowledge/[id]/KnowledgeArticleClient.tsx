'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Star, BookOpen, Share2, Bookmark, Eye, Calendar, User, Tag } from 'lucide-react';
import { knowledgeEngine } from '@/features/knowledge-base/knowledge-engine';
import { ArticleRecommendations } from '@/components/knowledge';

interface KnowledgeArticleClientProps {
  articleId: string;
}

export function KnowledgeArticleClient({ articleId }: KnowledgeArticleClientProps) {
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setIsLoading(true);
        
        // 獲取所有文章
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

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 這裡可以添加實際的書籤功能
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log('分享取消或失敗');
      }
    } else {
      // 回退到複製連結
      navigator.clipboard.writeText(window.location.href);
      alert('連結已複製到剪貼板');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">文章不存在</h1>
            <p className="text-slate-600 mb-8">抱歉，找不到您要查看的文章。</p>
            <button
              onClick={() => router.push('/knowledge')}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              返回知識庫
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* 返回按鈕 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>

        {/* 文章內容 */}
        <article className="glass-panel rounded-3xl p-8 mb-8">
          {/* 文章標題 */}
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <BookOpen className="w-4 h-4" />
              <span>{article.category}</span>
              {article.tags && article.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.author || 'TaiCalc 團隊'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.publishedAt || Date.now()).toLocaleDateString('zh-TW')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readingTime || '5'} 分鐘閱讀</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.views || 0} 次瀏覽</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 文章摘要 */}
            {article.summary && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
                <p className="text-slate-700 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            )}
          </header>

          {/* 文章內容 */}
          <div className="prose prose-slate max-w-none">
            <div 
              className="text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* 文章評分 */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">這篇文章對您有幫助嗎？</h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-yellow-400 hover:text-yellow-500 transition-colors"
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-slate-500">
                    ({article.rating || 4.5}/5, {article.ratingCount || 12} 評價)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* 相關文章推薦 */}
        {recommendations.length > 0 && (
          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">相關文章</h2>
            <ArticleRecommendations
              calculatorType={article.category}
              title=""
              maxItems={3}
              showReason={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}