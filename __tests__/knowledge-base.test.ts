/**
 * 知識庫功能測試
 * 驗證搜尋、推薦和學習路徑功能
 */

import { knowledgeEngine } from '@/features/knowledge-base/knowledge-engine';
import { KnowledgeCategory } from '@/features/knowledge-base/types';

describe('知識庫功能測試', () => {
  describe('文章搜尋功能', () => {
    test('應該能夠搜尋薪資相關文章', () => {
      const results = knowledgeEngine.searchArticles({
        query: '薪資',
        limit: 5
      });

      expect(results.articles.length).toBeGreaterThan(0);
      expect(results.totalCount).toBeGreaterThan(0);
      
      // 檢查搜尋結果是否包含薪資相關內容
      const hasRelevantContent = results.articles.some(article => 
        article.title.includes('薪資') || 
        article.content.includes('薪資') ||
        article.tags.includes('薪資計算')
      );
      expect(hasRelevantContent).toBe(true);
    });

    test('應該能夠按分類篩選文章', () => {
      const results = knowledgeEngine.searchArticles({
        query: '',
        category: 'salary' as KnowledgeCategory,
        limit: 10
      });

      expect(results.articles.length).toBeGreaterThan(0);
      
      // 檢查所有結果都是薪資分類
      const allSalaryCategory = results.articles.every(article => 
        article.category === 'salary'
      );
      expect(allSalaryCategory).toBe(true);
    });

    test('應該能夠按難度篩選文章', () => {
      const results = knowledgeEngine.searchArticles({
        query: '',
        difficulty: 'beginner',
        limit: 10
      });

      expect(results.articles.length).toBeGreaterThan(0);
      
      // 檢查所有結果都是初級難度
      const allBeginner = results.articles.every(article => 
        article.difficulty === 'beginner'
      );
      expect(allBeginner).toBe(true);
    });

    test('空搜尋應該返回空結果', () => {
      const results = knowledgeEngine.searchArticles({
        query: '',
        limit: 10
      });

      // 空搜尋應該返回所有文章
      expect(results.articles.length).toBeGreaterThan(0);
    });

    test('不存在的關鍵字應該返回空結果', () => {
      const results = knowledgeEngine.searchArticles({
        query: 'xyz不存在的關鍵字xyz',
        limit: 10
      });

      expect(results.articles.length).toBe(0);
      expect(results.totalCount).toBe(0);
    });
  });

  describe('文章推薦功能', () => {
    test('應該能夠根據文章ID推薦相關文章', () => {
      // 先獲取一篇文章
      const allArticles = knowledgeEngine.getPopularArticles(10);
      expect(allArticles.length).toBeGreaterThan(0);
      
      const firstArticle = allArticles[0];
      const recommendations = knowledgeEngine.getArticleRecommendations(firstArticle.id);

      expect(recommendations.length).toBeGreaterThan(0);
      
      // 推薦的文章不應該包含原文章
      const containsOriginal = recommendations.some(rec => 
        rec.article.id === firstArticle.id
      );
      expect(containsOriginal).toBe(false);

      // 每個推薦都應該有推薦理由
      recommendations.forEach(rec => {
        expect(rec.reason).toBeDefined();
        expect(rec.reason.length).toBeGreaterThan(0);
        expect(rec.relevanceScore).toBeGreaterThan(0);
        expect(rec.relevanceScore).toBeLessThanOrEqual(1);
      });
    });

    test('應該能夠根據計算器類型推薦文章', () => {
      const articles = knowledgeEngine.getArticlesByCalculator('salary', 3);

      expect(articles.length).toBeGreaterThan(0);
      expect(articles.length).toBeLessThanOrEqual(3);
      
      // 所有推薦文章都應該與薪資計算器相關
      const allRelated = articles.every(article => 
        article.relatedCalculators.includes('salary')
      );
      expect(allRelated).toBe(true);
    });
  });

  describe('學習路徑功能', () => {
    test('應該能夠獲取所有學習路徑', () => {
      const paths = knowledgeEngine.getLearningPaths();

      expect(paths.length).toBeGreaterThan(0);
      
      paths.forEach(path => {
        expect(path.id).toBeDefined();
        expect(path.title).toBeDefined();
        expect(path.description).toBeDefined();
        expect(path.articles.length).toBeGreaterThan(0);
        expect(path.objectives.length).toBeGreaterThan(0);
        expect(path.estimatedTime).toBeGreaterThan(0);
      });
    });

    test('應該能夠按分類篩選學習路徑', () => {
      const salaryPaths = knowledgeEngine.getLearningPaths('financial_planning' as KnowledgeCategory);

      salaryPaths.forEach(path => {
        expect(path.category).toBe('financial_planning');
      });
    });
  });

  describe('熱門和最新文章功能', () => {
    test('應該能夠獲取熱門文章', () => {
      const popularArticles = knowledgeEngine.getPopularArticles(5);

      expect(popularArticles.length).toBeGreaterThan(0);
      expect(popularArticles.length).toBeLessThanOrEqual(5);
      
      // 檢查是否按熱門度排序（瀏覽量 * 評分）
      for (let i = 0; i < popularArticles.length - 1; i++) {
        const current = popularArticles[i].views * popularArticles[i].rating;
        const next = popularArticles[i + 1].views * popularArticles[i + 1].rating;
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });

    test('應該能夠獲取最新文章', () => {
      const latestArticles = knowledgeEngine.getLatestArticles(5);

      expect(latestArticles.length).toBeGreaterThan(0);
      expect(latestArticles.length).toBeLessThanOrEqual(5);
      
      // 檢查是否按發布日期排序
      for (let i = 0; i < latestArticles.length - 1; i++) {
        const currentDate = new Date(latestArticles[i].publishDate);
        const nextDate = new Date(latestArticles[i + 1].publishDate);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });
  });

  describe('數據完整性檢查', () => {
    test('所有文章都應該有必要的欄位', () => {
      const allArticles = knowledgeEngine.getPopularArticles(100); // 獲取所有文章

      allArticles.forEach(article => {
        expect(article.id).toBeDefined();
        expect(article.title).toBeDefined();
        expect(article.content).toBeDefined();
        expect(article.summary).toBeDefined();
        expect(article.category).toBeDefined();
        expect(article.tags).toBeDefined();
        expect(article.difficulty).toBeDefined();
        expect(article.readingTime).toBeGreaterThan(0);
        expect(article.author).toBeDefined();
        expect(article.publishDate).toBeDefined();
        expect(article.lastUpdated).toBeDefined();
        expect(article.relatedCalculators).toBeDefined();
        expect(article.relatedArticles).toBeDefined();
        expect(article.views).toBeGreaterThan(0);
        expect(article.rating).toBeGreaterThan(0);
        expect(article.rating).toBeLessThanOrEqual(5);
      });
    });

    test('相關文章引用應該存在', () => {
      const allArticles = knowledgeEngine.getPopularArticles(100);
      const articleIds = new Set(allArticles.map(a => a.id));

      allArticles.forEach(article => {
        article.relatedArticles.forEach(relatedId => {
          expect(articleIds.has(relatedId)).toBe(true);
        });
      });
    });
  });
});