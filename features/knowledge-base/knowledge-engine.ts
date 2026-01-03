/**
 * 財務知識庫核心引擎
 * 提供文章搜尋、推薦和學習路徑功能
 */

import {
  KnowledgeArticle,
  KnowledgeCategory,
  SearchQuery,
  SearchResult,
  ArticleRecommendation,
  LearningPath,
  UserProgress
} from './types';

export class KnowledgeBaseEngine {
  private articles: KnowledgeArticle[] = [];
  private learningPaths: LearningPath[] = [];

  constructor() {
    this.initializeKnowledgeBase();
  }

  /**
   * 初始化知識庫內容
   */
  private initializeKnowledgeBase(): void {
    this.articles = [
      {
        id: 'salary-basics',
        title: '薪資結構完全解析：勞保、健保、勞退一次搞懂',
        content: `
# 薪資結構完全解析

## 基本概念

台灣的薪資結構包含多個組成部分，了解這些組成對於財務規劃至關重要。

## 主要扣除項目

### 1. 勞工保險費
- 費率：11.5%（2025年）
- 負擔比例：雇主 70%、勞工 20%、政府 10%
- 投保薪資上限：45,800元

### 2. 全民健康保險費
- 費率：5.17%（2025年）
- 負擔比例：雇主 60%、勞工 30%、政府 10%
- 投保薪資上限：182,000元

### 3. 勞工退休金
- 提撥率：6%（雇主負擔）
- 自提：0-6%（勞工可選擇）
- 月提繳工資上限：150,000元

## 實際計算範例

以月薪 50,000 元為例：
- 勞保費：約 1,834 元
- 健保費：約 776 元
- 所得稅：依年收入而定
- 實領金額：約 47,390 元

## 優化建議

1. 考慮自提勞退享受稅務優惠
2. 了解投保薪資級距對保障的影響
3. 定期檢視薪資結構變化
        `,
        summary: '詳細解析台灣薪資結構，包含勞保、健保、勞退的計算方式和優化策略。',
        category: 'salary',
        tags: ['薪資計算', '勞保', '健保', '勞退', '稅務'],
        difficulty: 'beginner',
        readingTime: 8,
        author: 'TaiCalc 財務團隊',
        publishDate: '2025-01-01',
        lastUpdated: '2025-01-01',
        relatedCalculators: ['salary', 'tax'],
        relatedArticles: ['tax-planning-basics', 'retirement-planning'],
        views: 1250,
        rating: 4.8
      },
      {
        id: 'investment-basics',
        title: '投資理財入門：從零開始建立投資組合',
        content: `
# 投資理財入門指南

## 投資前的準備

### 1. 建立緊急預備金
投資前務必準備 3-6 個月的生活費作為緊急預備金。

### 2. 清償高利率債務
信用卡債、現金卡等高利率債務應優先清償。

### 3. 評估風險承受度
- 保守型：以債券、定存為主
- 穩健型：股債平衡配置
- 積極型：以股票為主要投資標的

## 投資工具介紹

### 股票投資
- 優點：長期報酬率較高
- 缺點：波動性大
- 適合：長期投資者

### 債券投資
- 優點：收益穩定
- 缺點：報酬率較低
- 適合：保守投資者

### ETF（指數股票型基金）
- 優點：分散風險、費用低
- 缺點：無法超越市場表現
- 適合：新手投資者

## 投資策略

### 定期定額投資
- 降低市場波動影響
- 培養投資紀律
- 適合薪水族

### 資產配置
- 年齡法則：股票比例 = 100 - 年齡
- 定期檢視調整
- 分散投資風險

## 常見錯誤

1. 追高殺低
2. 過度集中投資
3. 情緒化決策
4. 忽略手續費成本
        `,
        summary: '投資理財的基礎知識，包含投資前準備、工具介紹和策略建議。',
        category: 'investment',
        tags: ['投資入門', '資產配置', '風險管理', 'ETF', '定期定額'],
        difficulty: 'beginner',
        readingTime: 12,
        author: 'TaiCalc 投資顧問',
        publishDate: '2025-01-01',
        lastUpdated: '2025-01-01',
        relatedCalculators: ['capital', 'retirement'],
        relatedArticles: ['retirement-planning', 'house-buying-guide'],
        views: 2100,
        rating: 4.7
      },
      {
        id: 'house-buying-guide',
        title: '買房完全攻略：從頭期款到房貸規劃',
        content: `
# 買房完全攻略

## 買房前的財務準備

### 1. 頭期款準備
- 一般建議：房價的 20-30%
- 最低要求：房價的 10-15%
- 包含：簽約金、開工款、完工款

### 2. 其他費用
- 仲介費：房價的 1-2%
- 代書費：約 10-15 萬
- 裝潢費：依需求而定
- 搬家費用

### 3. 財務能力評估
- 房貸月付金不超過月收入 30%
- 保留緊急預備金
- 考慮未來收入變化

## 房貸選擇策略

### 利率類型
- 固定利率：利率不變，適合升息環境
- 機動利率：隨市場調整，適合降息環境
- 混合利率：前期固定，後期機動

### 還款方式
- 本息均攤：每月還款金額固定
- 本金均攤：每月本金固定，利息遞減
- 寬限期：前期只還利息

### 貸款年限
- 20年：總利息較少，月付金較高
- 30年：月付金較低，總利息較多
- 40年：月付金最低，總利息最多

## 購屋流程

1. 確定預算和需求
2. 選擇地段和物件
3. 實地看屋評估
4. 議價和簽約
5. 申請房貸
6. 完成過戶

## 注意事項

- 檢查房屋權狀
- 了解社區管理
- 評估增值潛力
- 考慮交通便利性
        `,
        summary: '完整的買房指南，涵蓋財務準備、房貸選擇和購屋流程。',
        category: 'mortgage',
        tags: ['買房', '房貸', '頭期款', '利率', '財務規劃'],
        difficulty: 'intermediate',
        readingTime: 15,
        author: 'TaiCalc 房產專家',
        publishDate: '2025-01-01',
        lastUpdated: '2025-01-01',
        relatedCalculators: ['mortgage', 'salary'],
        relatedArticles: ['salary-basics', 'investment-basics'],
        views: 1800,
        rating: 4.9
      },
      {
        id: 'retirement-planning',
        title: '退休規劃全攻略：提早準備，安心退休',
        content: `
# 退休規劃全攻略

## 退休金來源

### 第一層：勞保老年給付
- 年金給付：月領終身
- 一次給付：一次領取
- 影響因素：投保年資、平均月投保薪資

### 第二層：勞工退休金
- 新制：個人專戶制
- 舊制：雇主提撥制
- 自提優勢：節稅效果

### 第三層：個人退休準備
- 商業保險
- 投資理財
- 其他資產

## 退休金需求估算

### 替代率概念
- 退休後收入 ÷ 退休前收入
- 建議替代率：70-80%
- 考慮通膨影響

### 計算方式
1. 估算退休後年支出
2. 計算勞保勞退給付
3. 評估資金缺口
4. 制定投資計劃

## 退休投資策略

### 年輕階段（20-35歲）
- 積極成長型投資
- 股票比例較高
- 長期投資視野

### 中年階段（35-50歲）
- 平衡型投資
- 股債均衡配置
- 定期檢視調整

### 接近退休（50-65歲）
- 保守穩健投資
- 債券比例提高
- 降低投資風險

## 實用建議

1. 越早開始越好
2. 善用複利效果
3. 定期檢視調整
4. 考慮通膨因素
5. 多元化投資
        `,
        summary: '全面的退休規劃指南，包含退休金來源分析和投資策略建議。',
        category: 'retirement',
        tags: ['退休規劃', '勞保', '勞退', '投資策略', '替代率'],
        difficulty: 'intermediate',
        readingTime: 18,
        author: 'TaiCalc 退休規劃師',
        publishDate: '2025-01-01',
        lastUpdated: '2025-01-01',
        relatedCalculators: ['retirement', 'capital', 'salary'],
        relatedArticles: ['salary-basics', 'investment-basics'],
        views: 1650,
        rating: 4.8
      },
      {
        id: 'tax-planning-basics',
        title: '個人稅務規劃：合法節稅策略大公開',
        content: `
# 個人稅務規劃指南

## 綜合所得稅基礎

### 稅率級距（2025年）
- 5%：0-59萬
- 12%：59-133萬
- 20%：133-266萬
- 30%：266-498萬
- 40%：498萬以上

### 免稅額
- 個人：44.6萬
- 配偶：44.6萬
- 扶養親屬：13.2萬/人

## 合法節稅策略

### 1. 善用扣除額
- 標準扣除額 vs 列舉扣除額
- 特別扣除額：薪資、身心障礙等
- 幼兒學前扣除額

### 2. 投資節稅
- 勞退自提：最高 10.8萬/年
- 保險費扣除額：2.4萬/年
- 捐贈扣除額：所得 20%

### 3. 時機規劃
- 所得分年認列
- 費用集中扣除
- 投資損益實現時點

## 常見節稅工具

### 勞退自提
- 節稅效果：依稅率級距
- 投資報酬：不低於 2年期定存
- 提領方式：月退或一次領

### 商業保險
- 人身保險：2.4萬/年
- 健康醫療險：2.4萬/年
- 投資型保險：注意相關規定

### 教育支出
- 子女教育費：2.5萬/人
- 幼兒學前：12萬/人
- 身心障礙：20萬/人

## 申報注意事項

1. 保留相關憑證
2. 選擇有利申報方式
3. 注意申報期限
4. 善用網路申報
5. 定期檢視調整

## 風險提醒

- 避免逃漏稅行為
- 注意查核重點
- 保持誠實申報
- 尋求專業協助
        `,
        summary: '個人稅務規劃的基礎知識和合法節稅策略分享。',
        category: 'tax',
        tags: ['稅務規劃', '節稅', '綜合所得稅', '扣除額', '勞退自提'],
        difficulty: 'intermediate',
        readingTime: 14,
        author: 'TaiCalc 稅務專家',
        publishDate: '2025-01-01',
        lastUpdated: '2025-01-01',
        relatedCalculators: ['tax', 'salary'],
        relatedArticles: ['salary-basics', 'retirement-planning'],
        views: 1400,
        rating: 4.6
      }
    ];

    this.learningPaths = [
      {
        id: 'financial-basics',
        title: '理財基礎入門',
        description: '從零開始學習個人理財，建立正確的財務觀念和基礎知識。',
        category: 'financial_planning',
        difficulty: 'beginner',
        estimatedTime: 6,
        articles: ['salary-basics', 'investment-basics', 'tax-planning-basics'],
        prerequisites: [],
        objectives: [
          '了解薪資結構和相關扣除項目',
          '建立基本投資理財概念',
          '掌握個人稅務規劃基礎'
        ]
      },
      {
        id: 'home-ownership',
        title: '購屋置產規劃',
        description: '完整的購屋規劃指南，從財務準備到房貸選擇。',
        category: 'mortgage',
        difficulty: 'intermediate',
        estimatedTime: 8,
        articles: ['house-buying-guide', 'salary-basics', 'investment-basics'],
        prerequisites: ['financial-basics'],
        objectives: [
          '評估購屋財務能力',
          '了解房貸產品和選擇策略',
          '制定購屋時程規劃'
        ]
      },
      {
        id: 'retirement-preparation',
        title: '退休準備規劃',
        description: '全面的退休規劃指南，確保退休生活無憂。',
        category: 'retirement',
        difficulty: 'intermediate',
        estimatedTime: 10,
        articles: ['retirement-planning', 'investment-basics', 'salary-basics', 'tax-planning-basics'],
        prerequisites: ['financial-basics'],
        objectives: [
          '計算退休金需求',
          '制定退休投資策略',
          '優化退休稅務規劃'
        ]
      }
    ];
  }

  /**
   * 搜尋文章
   */
  searchArticles(query: SearchQuery): SearchResult {
    let filteredArticles = [...this.articles];

    // 關鍵字搜尋
    if (query.query) {
      const searchTerm = query.query.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // 分類篩選
    if (query.category) {
      filteredArticles = filteredArticles.filter(article =>
        article.category === query.category
      );
    }

    // 難度篩選
    if (query.difficulty) {
      filteredArticles = filteredArticles.filter(article =>
        article.difficulty === query.difficulty
      );
    }

    // 標籤篩選
    if (query.tags && query.tags.length > 0) {
      filteredArticles = filteredArticles.filter(article =>
        query.tags!.some(tag => article.tags.includes(tag))
      );
    }

    // 按相關性和評分排序
    filteredArticles.sort((a, b) => {
      // 簡單的相關性評分
      let scoreA = a.rating * a.views;
      let scoreB = b.rating * b.views;

      if (query.query) {
        const searchTerm = query.query.toLowerCase();
        if (a.title.toLowerCase().includes(searchTerm)) scoreA += 1000;
        if (b.title.toLowerCase().includes(searchTerm)) scoreB += 1000;
      }

      return scoreB - scoreA;
    });

    // 限制結果數量
    const limit = query.limit || 10;
    const results = filteredArticles.slice(0, limit);

    // 生成搜尋建議
    const suggestions = this.generateSearchSuggestions(query.query || '');
    const relatedTopics = this.getRelatedTopics(results);

    return {
      articles: results,
      totalCount: filteredArticles.length,
      suggestions,
      relatedTopics
    };
  }

  /**
   * 獲取文章推薦
   */
  getArticleRecommendations(
    articleId: string, 
    userProgress?: UserProgress,
    limit: number = 5
  ): ArticleRecommendation[] {
    const currentArticle = this.articles.find(a => a.id === articleId);
    if (!currentArticle) return [];

    const recommendations: ArticleRecommendation[] = [];

    // 1. 相關文章推薦
    currentArticle.relatedArticles.forEach(relatedId => {
      const relatedArticle = this.articles.find(a => a.id === relatedId);
      if (relatedArticle) {
        recommendations.push({
          article: relatedArticle,
          reason: '相關主題文章',
          relevanceScore: 0.9
        });
      }
    });

    // 2. 同分類文章推薦
    const sameCategory = this.articles.filter(a => 
      a.id !== articleId && 
      a.category === currentArticle.category &&
      !currentArticle.relatedArticles.includes(a.id)
    );

    sameCategory.forEach(article => {
      recommendations.push({
        article,
        reason: `${this.getCategoryName(article.category)}相關文章`,
        relevanceScore: 0.7
      });
    });

    // 3. 相似標籤文章推薦
    const similarTags = this.articles.filter(a => 
      a.id !== articleId &&
      a.tags.some(tag => currentArticle.tags.includes(tag)) &&
      !recommendations.some(r => r.article.id === a.id)
    );

    similarTags.forEach(article => {
      const commonTags = article.tags.filter(tag => currentArticle.tags.includes(tag));
      recommendations.push({
        article,
        reason: `相似主題：${commonTags.join('、')}`,
        relevanceScore: 0.6
      });
    });

    // 4. 基於用戶偏好推薦
    if (userProgress) {
      const userPreferredCategories = userProgress.preferences.categories;
      const userPreferredDifficulty = userProgress.preferences.difficulty;

      const personalizedArticles = this.articles.filter(a =>
        a.id !== articleId &&
        !recommendations.some(r => r.article.id === a.id) &&
        (userPreferredCategories.includes(a.category) || a.difficulty === userPreferredDifficulty)
      );

      personalizedArticles.forEach(article => {
        recommendations.push({
          article,
          reason: '基於您的偏好推薦',
          relevanceScore: 0.5
        });
      });
    }

    // 按相關性評分排序並限制數量
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  /**
   * 獲取學習路徑
   */
  getLearningPaths(category?: KnowledgeCategory): LearningPath[] {
    if (category) {
      return this.learningPaths.filter(path => path.category === category);
    }
    return [...this.learningPaths];
  }

  /**
   * 獲取熱門文章
   */
  getPopularArticles(limit: number = 5): KnowledgeArticle[] {
    return [...this.articles]
      .sort((a, b) => (b.views * b.rating) - (a.views * a.rating))
      .slice(0, limit);
  }

  /**
   * 獲取最新文章
   */
  getLatestArticles(limit: number = 5): KnowledgeArticle[] {
    return [...this.articles]
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit);
  }

  /**
   * 根據計算器推薦相關文章
   */
  getArticlesByCalculator(calculatorType: string, limit: number = 3): KnowledgeArticle[] {
    return this.articles
      .filter(article => article.relatedCalculators.includes(calculatorType))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * 生成搜尋建議
   */
  private generateSearchSuggestions(query: string): string[] {
    if (!query) return [];

    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    // 基於文章標題和標籤生成建議
    this.articles.forEach(article => {
      // 標題建議
      if (article.title.toLowerCase().includes(lowerQuery)) {
        suggestions.push(article.title);
      }

      // 標籤建議
      article.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowerQuery) && !suggestions.includes(tag)) {
          suggestions.push(tag);
        }
      });
    });

    return suggestions.slice(0, 5);
  }

  /**
   * 獲取相關主題
   */
  private getRelatedTopics(articles: KnowledgeArticle[]): string[] {
    const topics = new Set<string>();

    articles.forEach(article => {
      article.tags.forEach(tag => topics.add(tag));
    });

    return Array.from(topics).slice(0, 8);
  }

  /**
   * 獲取分類名稱
   */
  private getCategoryName(category: KnowledgeCategory): string {
    const categoryNames: Record<KnowledgeCategory, string> = {
      salary: '薪資計算',
      tax: '稅務規劃',
      investment: '投資理財',
      insurance: '保險規劃',
      mortgage: '房貸規劃',
      retirement: '退休規劃',
      budgeting: '預算管理',
      debt_management: '債務管理',
      financial_planning: '財務規劃',
      career_development: '職涯發展'
    };

    return categoryNames[category] || category;
  }
}

// 單例模式
export const knowledgeEngine = new KnowledgeBaseEngine();