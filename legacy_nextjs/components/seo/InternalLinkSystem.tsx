/**
 * 內部連結系統 - 提供相關計算器推薦和內部連結優化
 */

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CalculatorType, generateInternalLinks, generateSmartInternalLinks, getRelatedCalculatorsByCategory } from '@/lib/seo/seo-optimizer';

interface InternalLinkSystemProps {
  currentCalculator: CalculatorType;
  className?: string;
  maxLinks?: number;
  showDescription?: boolean;
  userContext?: {
    previousCalculators?: CalculatorType[];
    userGoals?: string[];
    sessionData?: Record<string, any>;
  };
  enableSmartRecommendations?: boolean;
}

export function InternalLinkSystem({ 
  currentCalculator, 
  className = '',
  maxLinks = 3,
  showDescription = true,
  userContext,
  enableSmartRecommendations = false
}: InternalLinkSystemProps) {
  const [relatedLinks, setRelatedLinks] = useState<Array<{
    title: string;
    url: string;
    description: string;
    relevanceScore?: number;
    category?: string;
    reason?: string;
  }>>([]);
  const [showAllLinks, setShowAllLinks] = useState(false);

  useEffect(() => {
    if (enableSmartRecommendations && userContext) {
      const smartLinks = generateSmartInternalLinks(currentCalculator, userContext);
      setRelatedLinks(smartLinks.slice(0, showAllLinks ? smartLinks.length : maxLinks));
    } else {
      const basicLinks = generateInternalLinks(currentCalculator);
      setRelatedLinks(basicLinks.slice(0, showAllLinks ? basicLinks.length : maxLinks));
    }
  }, [currentCalculator, userContext, enableSmartRecommendations, maxLinks, showAllLinks]);
  
  if (relatedLinks.length === 0) {
    return null;
  }

  const getRelevanceColor = (score?: number) => {
    if (!score) return 'bg-gray-100';
    if (score >= 0.8) return 'bg-green-100 border-green-200';
    if (score >= 0.6) return 'bg-blue-100 border-blue-200';
    return 'bg-gray-100 border-gray-200';
  };

  const getRelevanceIcon = (score?: number) => {
    if (!score) return '🔗';
    if (score >= 0.8) return '⭐';
    if (score >= 0.6) return '👍';
    return '🔗';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          {enableSmartRecommendations ? '智能推薦工具' : '相關計算工具'}
        </h3>
        {relatedLinks.length > maxLinks && (
          <button
            onClick={() => setShowAllLinks(!showAllLinks)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showAllLinks ? '收起' : `查看全部 (${relatedLinks.length})`}
          </button>
        )}
      </div>
      
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {relatedLinks.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            className={`group block p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-indigo-300 hover:bg-white/70 transition-all duration-200 ${getRelevanceColor(link.relevanceScore)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-sm">{getRelevanceIcon(link.relevanceScore)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                    {link.title}
                  </h4>
                  {link.relevanceScore && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {Math.round(link.relevanceScore * 100)}%
                    </span>
                  )}
                </div>
                {link.category && (
                  <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full inline-block mb-2">
                    {link.category}
                  </div>
                )}
                {showDescription && (
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                    {link.description}
                  </p>
                )}
                {link.reason && enableSmartRecommendations && (
                  <p className="text-xs text-green-600 italic">
                    💡 {link.reason}
                  </p>
                )}
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* 類別相關推薦 */}
      <CategoryBasedRecommendations 
        currentCalculator={currentCalculator}
        className="mt-6"
      />
    </div>
  );
}

/**
 * 基於類別的推薦組件
 */
interface CategoryBasedRecommendationsProps {
  currentCalculator: CalculatorType;
  className?: string;
}

function CategoryBasedRecommendations({ currentCalculator, className = '' }: CategoryBasedRecommendationsProps) {
  const [categoryLinks, setCategoryLinks] = useState<Array<{
    title: string;
    url: string;
    description: string;
    category: string;
  }>>([]);

  useEffect(() => {
    const links = getRelatedCalculatorsByCategory(currentCalculator, 3);
    setCategoryLinks(links);
  }, [currentCalculator]);

  if (categoryLinks.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <h4 className="text-md font-medium text-slate-700 mb-3">
        同類別工具推薦
      </h4>
      <div className="grid gap-2 md:grid-cols-3">
        {categoryLinks.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            className="group flex items-center p-3 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 bg-slate-300 group-hover:bg-indigo-300 rounded mr-3 flex items-center justify-center">
              <svg className="w-3 h-3 text-slate-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 group-hover:text-indigo-600 text-sm truncate">
                {link.title}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {link.category}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * 麵包屑導航組件
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-slate-600 ${className}`} aria-label="麵包屑導航">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg className="w-4 h-4 mx-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-indigo-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

/**
 * 網站地圖連結組件
 */
interface SitemapSection {
  title: string;
  links: Array<{
    title: string;
    href: string;
    description?: string;
  }>;
}

interface SitemapLinksProps {
  sections: SitemapSection[];
  className?: string;
}

export function SitemapLinks({ sections, className = '' }: SitemapLinksProps) {
  return (
    <div className={`grid gap-8 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          <h3 className="font-semibold text-slate-900 text-lg">
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <Link
                  href={link.href}
                  className="group block p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {link.title}
                  </div>
                  {link.description && (
                    <div className="text-sm text-slate-500 mt-1">
                      {link.description}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * 生成網站地圖數據
 */
export function generateSitemapData(): SitemapSection[] {
  return [
    {
      title: '薪資與稅務',
      links: [
        { title: '薪資計算器', href: '/salary', description: '計算實際到手薪資' },
        { title: '所得稅計算器', href: '/tax', description: '2025年稅率試算' },
        { title: '加班費計算器', href: '/tools/overtime-calculator', description: '加班工資計算' },
        { title: '勞退自提計算器', href: '/tools/labor-pension-calculator', description: '勞退收益試算' }
      ]
    },
    {
      title: '房貸與投資',
      links: [
        { title: '房貸試算器', href: '/mortgage', description: '每月還款金額計算' },
        { title: '投資複利計算器', href: '/investment', description: '長期投資收益' },
        { title: '退休金計算器', href: '/retirement', description: '退休規劃試算' },
        { title: '資本利得稅計算器', href: '/capital', description: '投資稅務計算' }
      ]
    },
    {
      title: '生活費用',
      links: [
        { title: '租屋成本計算器', href: '/tools/rent-cost-calculator', description: '租屋總成本分析' },
        { title: '電費計算器', href: '/tools/electricity-calculator', description: '台電電費試算' },
        { title: '分帳計算器', href: '/tools/split-calculator', description: '聚餐費用分攤' },
        { title: '外送收入計算器', href: '/tools/delivery-income-calculator', description: '外送員收入分析' }
      ]
    },
    {
      title: '商業計算',
      links: [
        { title: '成本計算器', href: '/tools/cost-calculator', description: '商品定價分析' },
        { title: '獲利計算器', href: '/tools/profit-calculator', description: '投資報酬率計算' },
        { title: '百分比計算器', href: '/tools/percentage-calculator', description: '比例換算工具' },
        { title: '工時計算器', href: '/tools/work-hours-calculator', description: '工作時數統計' }
      ]
    },
    {
      title: '信貸與金融',
      links: [
        { title: '信用卡利息計算器', href: '/tools/credit-card-calculator', description: '分期付款試算' }
      ]
    },
    {
      title: '知識與工具',
      links: [
        { title: '財務知識庫', href: '/knowledge', description: '理財教學文章' },
        { title: '計算工具總覽', href: '/tools', description: '所有計算器列表' },
        { title: '已儲存結果', href: '/saved-results', description: '查看儲存的計算結果' }
      ]
    }
  ];
}

/**
 * 相關文章推薦組件
 */
interface RelatedArticle {
  title: string;
  href: string;
  excerpt: string;
  category: string;
}

interface RelatedArticlesProps {
  calculatorType: CalculatorType;
  maxArticles?: number;
  className?: string;
}

export function RelatedArticles({ 
  calculatorType, 
  maxArticles = 3, 
  className = '' 
}: RelatedArticlesProps) {
  // 這裡可以根據計算器類型生成相關文章
  // 目前使用模擬數據，實際應該從知識庫API獲取
  const getRelatedArticles = (type: CalculatorType): RelatedArticle[] => {
    const articleMap: Record<CalculatorType, RelatedArticle[]> = {
      salary: [
        {
          title: '2025年勞健保費率調整重點',
          href: '/knowledge/2025-labor-health-insurance-rates',
          excerpt: '了解最新的勞健保費率變化對薪資的影響',
          category: '薪資規劃'
        },
        {
          title: '勞退自提6%真的划算嗎？',
          href: '/knowledge/labor-pension-self-contribution',
          excerpt: '深入分析勞退自提的稅務優惠和投資效益',
          category: '退休規劃'
        }
      ],
      mortgage: [
        {
          title: '新青安房貸申請條件與優勢',
          href: '/knowledge/new-youth-housing-loan',
          excerpt: '詳解新青安房貸的申請資格和利率優惠',
          category: '房貸規劃'
        },
        {
          title: '買房vs租房：財務分析完整指南',
          href: '/knowledge/buy-vs-rent-analysis',
          excerpt: '從財務角度比較買房和租房的長期成本',
          category: '房產投資'
        }
      ],
      // 其他計算器類型的相關文章...
      tax: [],
      investment: [],
      retirement: [],
      capital: [],
      cost: [],
      'credit-card': [],
      'delivery-income': [],
      electricity: [],
      'labor-pension': [],
      overtime: [],
      percentage: [],
      profit: [],
      'rent-cost': [],
      split: [],
      'work-hours': []
    };
    
    return articleMap[type] || [];
  };

  const articles = getRelatedArticles(calculatorType).slice(0, maxArticles);
  
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-800">
        相關文章推薦
      </h3>
      
      <div className="space-y-3">
        {articles.map((article, index) => (
          <Link
            key={index}
            href={article.href}
            className="group block p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-indigo-300 hover:bg-white/70 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
                <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                  {article.title}
                </h4>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}