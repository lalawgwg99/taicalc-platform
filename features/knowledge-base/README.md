# TaiCalc 財務知識庫

## 概述

TaiCalc 財務知識庫是一個完整的財務教育和學習系統，提供豐富的財務知識內容、智能搜尋功能和個人化推薦服務。

## 主要功能

### 1. 知識文章管理
- 📚 豐富的財務知識文章庫
- 🏷️ 多維度分類和標籤系統
- ⭐ 文章評分和瀏覽統計
- 🔄 相關文章推薦

### 2. 智能搜尋系統
- 🔍 全文搜尋功能
- 🎯 分類和難度篩選
- 💡 搜尋建議和相關主題
- 📊 搜尋結果排序

### 3. 學習路徑規劃
- 🛤️ 結構化學習路徑
- 📈 難度漸進設計
- 🎯 明確學習目標
- ⏱️ 預估學習時間

### 4. 個人化推薦
- 🤖 基於計算器使用的推薦
- 👤 基於用戶興趣的推薦
- 📈 熱門和最新內容推薦
- 🔗 相關文章智能關聯

## 技術架構

### 核心組件

#### KnowledgeBaseEngine
主要的知識庫引擎，提供：
- 文章搜尋和篩選
- 推薦算法
- 學習路徑管理
- 數據統計分析

#### 工具集 (Tools)
為 AI 模型提供的工具接口：
- `searchKnowledgeBase`: 搜尋知識庫
- `getArticleRecommendations`: 獲取文章推薦
- `getLearningPaths`: 獲取學習路徑
- `getPopularContent`: 獲取熱門內容

#### UI 組件
- `KnowledgeSearchWidget`: 搜尋小工具
- `ArticleRecommendations`: 推薦組件
- 知識庫主頁面和文章詳細頁面

### 數據模型

```typescript
interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: KnowledgeCategory;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  author: string;
  publishDate: string;
  lastUpdated: string;
  relatedCalculators: string[];
  relatedArticles: string[];
  views: number;
  rating: number;
}
```

## 使用方式

### 1. 基本搜尋

```typescript
import { knowledgeEngine } from '@/features/knowledge-base/knowledge-engine';

// 搜尋薪資相關文章
const results = knowledgeEngine.searchArticles({
  query: '薪資計算',
  category: 'salary',
  difficulty: 'beginner',
  limit: 5
});
```

### 2. 獲取推薦

```typescript
// 根據計算器類型推薦
const articles = knowledgeEngine.getArticlesByCalculator('salary', 3);

// 根據文章ID推薦相關文章
const recommendations = knowledgeEngine.getArticleRecommendations('salary-basics');
```

### 3. 學習路徑

```typescript
// 獲取所有學習路徑
const paths = knowledgeEngine.getLearningPaths();

// 按分類獲取學習路徑
const financialPaths = knowledgeEngine.getLearningPaths('financial_planning');
```

### 4. 在計算器中整合推薦

```tsx
import { ArticleRecommendations } from '@/components/knowledge';

// 在計算器結果頁面中添加
<ArticleRecommendations
  calculatorType="salary"
  title="薪資相關知識"
  maxItems={3}
  showReason={true}
/>
```

## 內容分類

### 文章分類
- `salary`: 薪資計算
- `tax`: 稅務規劃
- `investment`: 投資理財
- `mortgage`: 房貸規劃
- `retirement`: 退休規劃
- `insurance`: 保險規劃
- `budgeting`: 預算管理
- `debt_management`: 債務管理
- `financial_planning`: 財務規劃
- `career_development`: 職涯發展

### 難度等級
- `beginner`: 初級 - 適合理財新手
- `intermediate`: 中級 - 有基礎理財知識
- `advanced`: 高級 - 深度財務規劃

## 測試

知識庫包含完整的測試套件：

```bash
# 運行知識庫測試
npm test -- --testPathPatterns="knowledge-base"

# 運行特定測試文件
npm test __tests__/knowledge-base.test.ts
npm test __tests__/knowledge-base-tools.test.ts
```

## 擴展指南

### 添加新文章

1. 在 `KnowledgeBaseEngine` 的 `initializeKnowledgeBase` 方法中添加文章
2. 確保所有必要欄位都已填寫
3. 設置正確的相關文章引用
4. 運行測試確保數據完整性

### 創建新的學習路徑

1. 在 `learningPaths` 數組中添加新路徑
2. 確保引用的文章都存在
3. 設置合理的學習目標和時間估算

### 自定義推薦算法

可以在 `getArticleRecommendations` 方法中調整推薦邏輯：
- 調整相關性評分權重
- 添加新的推薦因子
- 優化排序算法

## 性能優化

- 文章內容使用延遲載入
- 搜尋結果限制數量避免過載
- 推薦算法優化減少計算複雜度
- 適當的快取策略

## 未來規劃

- [ ] 用戶閱讀進度追蹤
- [ ] 個人化學習建議
- [ ] 文章評論和互動功能
- [ ] 多媒體內容支援
- [ ] 社群分享功能
- [ ] 離線閱讀支援