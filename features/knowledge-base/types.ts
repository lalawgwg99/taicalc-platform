/**
 * 財務知識庫相關類型定義
 */

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: KnowledgeCategory;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number; // 分鐘
  author: string;
  publishDate: string;
  lastUpdated: string;
  relatedCalculators: string[];
  relatedArticles: string[];
  views: number;
  rating: number;
}

export type KnowledgeCategory = 
  | 'salary' 
  | 'tax' 
  | 'investment' 
  | 'insurance' 
  | 'mortgage' 
  | 'retirement' 
  | 'budgeting' 
  | 'debt_management' 
  | 'financial_planning' 
  | 'career_development';

export interface SearchQuery {
  query: string;
  category?: KnowledgeCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  limit?: number;
}

export interface SearchResult {
  articles: KnowledgeArticle[];
  totalCount: number;
  suggestions: string[];
  relatedTopics: string[];
}

export interface ArticleRecommendation {
  article: KnowledgeArticle;
  reason: string;
  relevanceScore: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: KnowledgeCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // 小時
  articles: string[]; // article IDs
  prerequisites: string[];
  objectives: string[];
}

export interface UserProgress {
  userId: string;
  readArticles: string[];
  bookmarkedArticles: string[];
  completedPaths: string[];
  currentPaths: string[];
  preferences: {
    categories: KnowledgeCategory[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
  };
}