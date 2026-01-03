/**
 * 知識庫工具集測試
 * 測試 AI 模型使用的知識庫工具
 */

import { knowledgeBaseTools } from '@/features/knowledge-base/tools';

describe('知識庫工具集測試', () => {
  describe('searchKnowledgeBase 工具', () => {
    test('應該能夠搜尋薪資相關內容', async () => {
      const result = await knowledgeBaseTools.searchKnowledgeBase.execute({
        query: '薪資計算',
        limit: 3
      });

      expect(result.summary).toContain('知識庫搜尋結果');
      expect(result.details).toBeDefined();
      expect(result.details.length).toBeGreaterThan(0);
      
      // 檢查是否包含找到的文章信息
      const detailsText = result.details.join(' ');
      expect(detailsText).toContain('薪資');
    });

    test('應該能夠按分類搜尋', async () => {
      const result = await knowledgeBaseTools.searchKnowledgeBase.execute({
        query: '',
        category: 'salary',
        limit: 5
      });

      expect(result.summary).toContain('知識庫搜尋結果');
      expect(result.details).toBeDefined();
      
      const detailsText = result.details.join(' ');
      expect(detailsText).toContain('薪資');
    });

    test('搜尋不存在的內容應該返回建議', async () => {
      const result = await knowledgeBaseTools.searchKnowledgeBase.execute({
        query: 'xyz不存在的內容xyz',
        limit: 5
      });

      expect(result.summary).toContain('未找到相關文章');
      expect(result.details).toBeDefined();
      
      const detailsText = result.details.join(' ');
      expect(detailsText).toContain('搜尋建議') || expect(detailsText).toContain('熱門主題');
    });
  });

  describe('getArticleRecommendations 工具', () => {
    test('應該能夠根據計算器類型推薦文章', async () => {
      const result = await knowledgeBaseTools.getArticleRecommendations.execute({
        calculatorType: 'salary',
        limit: 3
      });

      expect(result.summary).toBe('文章推薦');
      expect(result.details).toBeDefined();
      expect(result.details.length).toBeGreaterThan(0);
      
      const detailsText = result.details.join(' ');
      expect(detailsText).toContain('推薦');
    });

    test('應該能夠根據用戶興趣推薦文章', async () => {
      const result = await knowledgeBaseTools.getArticleRecommendations.execute({
        userInterests: ['薪資計算', '投資理財'],
        limit: 3
      });

      expect(result.summary).toBe('文章推薦');
      expect(result.details).toBeDefined();
      
      const detailsText = result.details.join(' ');
      expect(detailsText).toContain('推薦');
    });

    test('沒有條件時應該推薦熱門文章', async () => {
      const result = await knowledgeBaseTools.getArticleRecommendations.execute({
        limit: 3
      });

      expect(result.summary).toBe('文章推薦');
      expect(result.details).toBeDefined();
      
      const detailsText = result.details.join(' ');
      expect(detailsText).toContain('熱門推薦');
    });
  });

  describe('getLearningPaths 工具', () => {
    test('應該能夠獲取所有學習路徑', async () => {
      const result = await knowledgeBaseTools.getLearningPaths.execute({});

      expect(result.summary).toBe('學習路徑推薦');
      expect(result.details).toBeDefined();
      expect(result.details.length).toBeGreaterThan(0);
      
      const detailsText = result.details.join(' ');
      expect(detailsText).toContain('學習路徑');
    });

    test('應該能夠按分類獲取學習路徑', async () => {
      const result = await knowledgeBaseTools.getLearningPaths.execute({
        category: 'financial_planning'
      });

      expect(result.summary).toBe('學習路徑推薦');
      expect(result.details).toBeDefined();
    });

    test('應該能夠按難度篩選學習路徑', async () => {
      const result = await knowledgeBaseTools.getLearningPaths.execute({
        difficulty: 'beginner'
      });

      expect(result.summary).toBe('學習路徑推薦');
      expect(result.details).toBeDefined();
    });
  });

  describe('getPopularContent 工具', () => {
    test('應該能夠獲取熱門文章', async () => {
      const result = await knowledgeBaseTools.getPopularContent.execute({
        type: 'popular',
        limit: 3
      });

      expect(result.summary).toBe('熱門內容推薦');
      expect(result.details).toBeDefined();
      expect(result.details.length).toBeGreaterThan(0);
      
      const detailsText = result.details.join(' ');
      expect(detailsText).toContain('熱門文章推薦');
    });

    test('應該能夠獲取最新文章', async () => {
      const result = await knowledgeBaseTools.getPopularContent.execute({
        type: 'latest',
        limit: 3
      });

      expect(result.summary).toBe('最新內容推薦');
      expect(result.details).toBeDefined();
      expect(result.details.length).toBeGreaterThan(0);
      
      const detailsText = result.details.join(' ');
      expect(detailsText).toContain('最新文章推薦');
    });
  });

  describe('工具參數驗證', () => {
    test('searchKnowledgeBase 應該處理無效參數', async () => {
      const result = await knowledgeBaseTools.searchKnowledgeBase.execute({
        query: '',
        limit: 0
      });

      // 應該有合理的回應，即使參數無效
      expect(result.summary).toBeDefined();
      expect(result.details).toBeDefined();
    });

    test('getArticleRecommendations 應該處理空參數', async () => {
      const result = await knowledgeBaseTools.getArticleRecommendations.execute({});

      expect(result.summary).toBe('文章推薦');
      expect(result.details).toBeDefined();
    });
  });
});