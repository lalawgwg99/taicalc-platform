/**
 * 財務知識庫工具集
 * 提供給 AI 模型使用的知識庫搜尋和推薦工具
 */

import { z } from 'zod';
import { knowledgeEngine } from './knowledge-engine';
import { KnowledgeCategory } from './types';

export const knowledgeBaseTools = {
  searchKnowledgeBase: {
    description: '搜尋財務知識庫文章，提供相關的教學內容和指導。',
    parameters: z.object({
      query: z.string().describe('搜尋關鍵字或問題'),
      category: z.enum([
        'salary', 'tax', 'investment', 'insurance', 'mortgage', 
        'retirement', 'budgeting', 'debt_management', 'financial_planning', 'career_development'
      ]).optional().describe('文章分類篩選'),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe('難度等級'),
      limit: z.number().min(1).max(10).optional().describe('返回結果數量限制（預設5）')
    }),
    execute: async (args: { 
      query: string; 
      category?: KnowledgeCategory; 
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
      limit?: number;
    }) => {
      const searchResult = knowledgeEngine.searchArticles({
        query: args.query,
        category: args.category,
        difficulty: args.difficulty,
        limit: args.limit || 5
      });

      if (searchResult.articles.length === 0) {
        return {
          summary: '未找到相關文章',
          details: [
            '很抱歉，沒有找到符合您搜尋條件的文章。',
            '',
            '搜尋建議：',
            ...searchResult.suggestions.map(s => `• ${s}`),
            '',
            '您也可以瀏覽以下熱門主題：',
            ...searchResult.relatedTopics.map(t => `• ${t}`)
          ]
        };
      }

      const details = [
        `找到 ${searchResult.totalCount} 篇相關文章：`,
        ''
      ];

      searchResult.articles.forEach((article, index) => {
        details.push(`${index + 1}. **${article.title}**`);
        details.push(`   分類：${article.category} | 難度：${article.difficulty} | 閱讀時間：${article.readingTime}分鐘`);
        details.push(`   摘要：${article.summary}`);
        details.push(`   標籤：${article.tags.join('、')}`);
        if (article.relatedCalculators.length > 0) {
          details.push(`   相關計算器：${article.relatedCalculators.join('、')}`);
        }
        details.push('');
      });

      if (searchResult.suggestions.length > 0) {
        details.push('相關搜尋建議：');
        details.push(...searchResult.suggestions.map(s => `• ${s}`));
      }

      return {
        summary: `知識庫搜尋結果：${args.query}`,
        details
      };
    }
  },

  getArticleRecommendations: {
    description: '根據用戶當前閱讀的文章或興趣，推薦相關的財務知識文章。',
    parameters: z.object({
      articleId: z.string().optional().describe('當前文章ID（如果有的話）'),
      userInterests: z.array(z.string()).optional().describe('用戶興趣標籤'),
      calculatorType: z.string().optional().describe('用戶正在使用的計算器類型'),
      limit: z.number().min(1).max(10).optional().describe('推薦文章數量（預設3）')
    }),
    execute: async (args: { 
      articleId?: string; 
      userInterests?: string[];
      calculatorType?: string;
      limit?: number;
    }) => {
      const limit = args.limit || 3;
      let recommendations: any[] = [];

      // 基於文章ID推薦
      if (args.articleId) {
        const articleRecs = knowledgeEngine.getArticleRecommendations(args.articleId, undefined, limit);
        recommendations = articleRecs.map(rec => ({
          article: rec.article,
          reason: rec.reason,
          score: rec.relevanceScore
        }));
      }
      // 基於計算器類型推薦
      else if (args.calculatorType) {
        const articles = knowledgeEngine.getArticlesByCalculator(args.calculatorType, limit);
        recommendations = articles.map(article => ({
          article,
          reason: `與${args.calculatorType}計算器相關`,
          score: 0.8
        }));
      }
      // 基於用戶興趣推薦
      else if (args.userInterests && args.userInterests.length > 0) {
        const searchResult = knowledgeEngine.searchArticles({
          query: '',
          tags: args.userInterests,
          limit
        });
        recommendations = searchResult.articles.map(article => ({
          article,
          reason: `符合您的興趣：${args.userInterests!.join('、')}`,
          score: 0.7
        }));
      }
      // 預設推薦熱門文章
      else {
        const articles = knowledgeEngine.getPopularArticles(limit);
        recommendations = articles.map(article => ({
          article,
          reason: '熱門推薦',
          score: 0.6
        }));
      }

      if (recommendations.length === 0) {
        return {
          summary: '暫無推薦文章',
          details: [
            '目前沒有符合條件的推薦文章。',
            '您可以瀏覽我們的熱門文章或使用搜尋功能找到感興趣的內容。'
          ]
        };
      }

      const details = [
        '為您推薦以下文章：',
        ''
      ];

      recommendations.forEach((rec, index) => {
        const article = rec.article;
        details.push(`${index + 1}. **${article.title}**`);
        details.push(`   推薦理由：${rec.reason}`);
        details.push(`   分類：${article.category} | 難度：${article.difficulty} | 閱讀時間：${article.readingTime}分鐘`);
        details.push(`   摘要：${article.summary}`);
        details.push('');
      });

      return {
        summary: '文章推薦',
        details
      };
    }
  },

  getLearningPaths: {
    description: '獲取結構化的學習路徑，幫助用戶系統性地學習財務知識。',
    parameters: z.object({
      category: z.enum([
        'salary', 'tax', 'investment', 'insurance', 'mortgage', 
        'retirement', 'budgeting', 'debt_management', 'financial_planning', 'career_development'
      ]).optional().describe('學習路徑分類'),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe('難度等級')
    }),
    execute: async (args: { 
      category?: KnowledgeCategory; 
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
    }) => {
      let learningPaths = knowledgeEngine.getLearningPaths(args.category);

      // 難度篩選
      if (args.difficulty) {
        learningPaths = learningPaths.filter(path => path.difficulty === args.difficulty);
      }

      if (learningPaths.length === 0) {
        return {
          summary: '未找到符合條件的學習路徑',
          details: [
            '很抱歉，沒有找到符合您條件的學習路徑。',
            '建議您瀏覽其他分類或難度的學習路徑。'
          ]
        };
      }

      const details = [
        '推薦的學習路徑：',
        ''
      ];

      learningPaths.forEach((path, index) => {
        details.push(`${index + 1}. **${path.title}**`);
        details.push(`   描述：${path.description}`);
        details.push(`   分類：${path.category} | 難度：${path.difficulty} | 預估時間：${path.estimatedTime}小時`);
        
        if (path.prerequisites.length > 0) {
          details.push(`   先修要求：${path.prerequisites.join('、')}`);
        }
        
        details.push('   學習目標：');
        path.objectives.forEach(objective => {
          details.push(`   • ${objective}`);
        });
        
        details.push(`   包含文章數：${path.articles.length}篇`);
        details.push('');
      });

      return {
        summary: '學習路徑推薦',
        details
      };
    }
  },

  getPopularContent: {
    description: '獲取熱門的財務知識內容，包括最受歡迎和最新的文章。',
    parameters: z.object({
      type: z.enum(['popular', 'latest']).describe('內容類型：熱門或最新'),
      limit: z.number().min(1).max(10).optional().describe('返回數量（預設5）')
    }),
    execute: async (args: { type: 'popular' | 'latest'; limit?: number }) => {
      const limit = args.limit || 5;
      let articles: any[] = [];

      if (args.type === 'popular') {
        articles = knowledgeEngine.getPopularArticles(limit);
      } else {
        articles = knowledgeEngine.getLatestArticles(limit);
      }

      const typeLabel = args.type === 'popular' ? '熱門' : '最新';
      const details = [
        `${typeLabel}文章推薦：`,
        ''
      ];

      articles.forEach((article, index) => {
        details.push(`${index + 1}. **${article.title}**`);
        details.push(`   分類：${article.category} | 難度：${article.difficulty} | 閱讀時間：${article.readingTime}分鐘`);
        details.push(`   摘要：${article.summary}`);
        if (args.type === 'popular') {
          details.push(`   瀏覽次數：${article.views} | 評分：${article.rating}/5`);
        } else {
          details.push(`   發布日期：${article.publishDate}`);
        }
        details.push('');
      });

      return {
        summary: `${typeLabel}內容推薦`,
        details
      };
    }
  }
};