/**
 * SEO 工具組件 - 提供 SEO 相關的工具和功能
 */

'use client';

import { useState, useEffect } from 'react';
import { CalculatorType, generateStructuredData, generatePageMetadata } from '@/lib/seo/seo-optimizer';

interface SEOToolsProps {
  calculatorType: CalculatorType;
  className?: string;
  showStructuredData?: boolean;
  showMetaTags?: boolean;
  showSEOAnalysis?: boolean;
}

export function SEOTools({
  calculatorType,
  className = '',
  showStructuredData = false,
  showMetaTags = false,
  showSEOAnalysis = false
}: SEOToolsProps) {
  const [structuredData, setStructuredData] = useState<Record<string, any>[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [seoScore, setSeoScore] = useState<number>(0);
  const [seoAnalysis, setSeoAnalysis] = useState<{
    title: { score: number; issues: string[] };
    description: { score: number; issues: string[] };
    keywords: { score: number; issues: string[] };
    structuredData: { score: number; issues: string[] };
    images: { score: number; issues: string[] };
  } | null>(null);

  useEffect(() => {
    // 生成結構化數據
    const schemas = generateStructuredData(calculatorType);
    setStructuredData(schemas);

    // 生成 metadata
    const meta = generatePageMetadata(calculatorType);
    setMetadata(meta);

    // 執行 SEO 分析
    if (showSEOAnalysis) {
      const analysis = analyzeSEO(calculatorType, meta, schemas);
      setSeoAnalysis(analysis);
      setSeoScore(calculateOverallSEOScore(analysis));
    }
  }, [calculatorType, showSEOAnalysis]);

  if (!showStructuredData && !showMetaTags && !showSEOAnalysis) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* SEO 分析總覽 */}
      {showSEOAnalysis && seoAnalysis && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">SEO 分析</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                seoScore >= 90 ? 'bg-green-500' :
                seoScore >= 70 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                {seoScore}
              </div>
              <div className="text-sm text-slate-600">
                SEO 分數
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SEOAnalysisCard
              title="標題優化"
              score={seoAnalysis.title.score}
              issues={seoAnalysis.title.issues}
            />
            <SEOAnalysisCard
              title="描述優化"
              score={seoAnalysis.description.score}
              issues={seoAnalysis.description.issues}
            />
            <SEOAnalysisCard
              title="關鍵字優化"
              score={seoAnalysis.keywords.score}
              issues={seoAnalysis.keywords.issues}
            />
            <SEOAnalysisCard
              title="結構化數據"
              score={seoAnalysis.structuredData.score}
              issues={seoAnalysis.structuredData.issues}
            />
            <SEOAnalysisCard
              title="圖片優化"
              score={seoAnalysis.images.score}
              issues={seoAnalysis.images.issues}
            />
          </div>
        </div>
      )}

      {/* Meta 標籤預覽 */}
      {showMetaTags && metadata && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Meta 標籤預覽</h3>
          <div className="space-y-3 font-mono text-sm">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-slate-600 mb-1">Title:</div>
              <div className="text-slate-900">{metadata.title}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-slate-600 mb-1">Description:</div>
              <div className="text-slate-900">{metadata.description}</div>
            </div>
            {metadata.keywords && (
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-slate-600 mb-1">Keywords:</div>
                <div className="text-slate-900">{metadata.keywords.join(', ')}</div>
              </div>
            )}
            {metadata.openGraph && (
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-slate-600 mb-1">Open Graph:</div>
                <div className="text-slate-900 space-y-1">
                  <div>og:title = "{metadata.openGraph.title}"</div>
                  <div>og:description = "{metadata.openGraph.description}"</div>
                  <div>og:url = "{metadata.openGraph.url}"</div>
                  <div>og:site_name = "{metadata.openGraph.siteName}"</div>
                  {metadata.openGraph.images && metadata.openGraph.images[0] && (
                    <div>og:image = "{metadata.openGraph.images[0].url}"</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 結構化數據預覽 */}
      {showStructuredData && structuredData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">結構化數據 (JSON-LD)</h3>
          <div className="space-y-4">
            {structuredData.map((schema, index) => (
              <div key={index} className="border border-slate-200 rounded-lg">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-700">
                    {schema['@type']} Schema
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(schema, null, 2))}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    複製
                  </button>
                </div>
                <pre className="p-4 text-xs text-slate-600 overflow-x-auto">
                  {JSON.stringify(schema, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * SEO 分析卡片組件
 */
interface SEOAnalysisCardProps {
  title: string;
  score: number;
  issues: string[];
}

function SEOAnalysisCard({ title, score, issues }: SEOAnalysisCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return '✅';
    if (score >= 70) return '⚠️';
    return '❌';
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-slate-700">{title}</h4>
        <div className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
          {getScoreIcon(score)} {score}
        </div>
      </div>
      {issues.length > 0 && (
        <div className="space-y-1">
          {issues.map((issue, index) => (
            <div key={index} className="text-sm text-slate-600 flex items-start">
              <span className="text-red-500 mr-2 flex-shrink-0">•</span>
              <span>{issue}</span>
            </div>
          ))}
        </div>
      )}
      {issues.length === 0 && (
        <div className="text-sm text-green-600">
          ✓ 所有檢查項目都通過
        </div>
      )}
    </div>
  );
}

/**
 * 執行 SEO 分析
 */
function analyzeSEO(calculatorType: CalculatorType, metadata: any, schemas: Record<string, any>[]) {
  const analysis = {
    title: { score: 100, issues: [] as string[] },
    description: { score: 100, issues: [] as string[] },
    keywords: { score: 100, issues: [] as string[] },
    structuredData: { score: 100, issues: [] as string[] },
    images: { score: 100, issues: [] as string[] }
  };

  // 分析標題
  if (!metadata.title) {
    analysis.title.score -= 50;
    analysis.title.issues.push('缺少頁面標題');
  } else {
    if (metadata.title.length > 60) {
      analysis.title.score -= 20;
      analysis.title.issues.push('標題過長（建議60字元以內）');
    }
    if (metadata.title.length < 30) {
      analysis.title.score -= 15;
      analysis.title.issues.push('標題過短（建議30-60字元）');
    }
    if (!metadata.title.includes('TaiCalc')) {
      analysis.title.score -= 10;
      analysis.title.issues.push('標題未包含品牌名稱');
    }
  }

  // 分析描述
  if (!metadata.description) {
    analysis.description.score -= 50;
    analysis.description.issues.push('缺少頁面描述');
  } else {
    if (metadata.description.length > 160) {
      analysis.description.score -= 20;
      analysis.description.issues.push('描述過長（建議160字元以內）');
    }
    if (metadata.description.length < 120) {
      analysis.description.score -= 15;
      analysis.description.issues.push('描述過短（建議120-160字元）');
    }
  }

  // 分析關鍵字
  if (!metadata.keywords || metadata.keywords.length === 0) {
    analysis.keywords.score -= 30;
    analysis.keywords.issues.push('缺少關鍵字');
  } else {
    if (metadata.keywords.length < 5) {
      analysis.keywords.score -= 15;
      analysis.keywords.issues.push('關鍵字數量過少（建議5-10個）');
    }
    if (metadata.keywords.length > 15) {
      analysis.keywords.score -= 10;
      analysis.keywords.issues.push('關鍵字數量過多（建議5-10個）');
    }
  }

  // 分析結構化數據
  if (schemas.length === 0) {
    analysis.structuredData.score -= 40;
    analysis.structuredData.issues.push('缺少結構化數據');
  } else {
    const hasWebPage = schemas.some(s => s['@type'] === 'WebPage');
    const hasBreadcrumb = schemas.some(s => s['@type'] === 'BreadcrumbList');
    const hasFAQ = schemas.some(s => s['@type'] === 'FAQPage');
    
    if (!hasWebPage) {
      analysis.structuredData.score -= 15;
      analysis.structuredData.issues.push('缺少 WebPage 結構化數據');
    }
    if (!hasBreadcrumb) {
      analysis.structuredData.score -= 10;
      analysis.structuredData.issues.push('缺少麵包屑結構化數據');
    }
    if (!hasFAQ) {
      analysis.structuredData.score -= 5;
      analysis.structuredData.issues.push('建議添加 FAQ 結構化數據');
    }
  }

  // 分析圖片
  if (!metadata.openGraph?.images || metadata.openGraph.images.length === 0) {
    analysis.images.score -= 30;
    analysis.images.issues.push('缺少 Open Graph 圖片');
  } else {
    const image = metadata.openGraph.images[0];
    if (!image.alt) {
      analysis.images.score -= 15;
      analysis.images.issues.push('圖片缺少 alt 文字');
    }
    if (image.width !== 1200 || image.height !== 630) {
      analysis.images.score -= 10;
      analysis.images.issues.push('圖片尺寸不符合建議（1200x630）');
    }
  }

  return analysis;
}

/**
 * 計算整體 SEO 分數
 */
function calculateOverallSEOScore(analysis: any): number {
  const scores = [
    analysis.title.score,
    analysis.description.score,
    analysis.keywords.score,
    analysis.structuredData.score,
    analysis.images.score
  ];
  
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

/**
 * 複製到剪貼板
 */
function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加成功提示
      console.log('已複製到剪貼板');
    }).catch(err => {
      console.error('複製失敗:', err);
    });
  } else {
    // 降級方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('已複製到剪貼板');
    } catch (err) {
      console.error('複製失敗:', err);
    }
    document.body.removeChild(textArea);
  }
}

/**
 * SEO 檢查清單組件
 */
interface SEOChecklistProps {
  calculatorType: CalculatorType;
  className?: string;
}

export function SEOChecklist({ calculatorType, className = '' }: SEOChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const checklistItems = [
    { id: 'title', label: '頁面標題優化（30-60字元）', category: '基本 SEO' },
    { id: 'description', label: '頁面描述優化（120-160字元）', category: '基本 SEO' },
    { id: 'keywords', label: '關鍵字設定（5-10個）', category: '基本 SEO' },
    { id: 'h1', label: 'H1 標籤設定', category: '內容結構' },
    { id: 'headings', label: '標題層級結構（H1-H6）', category: '內容結構' },
    { id: 'internal-links', label: '內部連結優化', category: '連結建設' },
    { id: 'og-image', label: 'Open Graph 圖片（1200x630）', category: '社交媒體' },
    { id: 'og-tags', label: 'Open Graph 標籤完整', category: '社交媒體' },
    { id: 'twitter-cards', label: 'Twitter Cards 設定', category: '社交媒體' },
    { id: 'structured-data', label: '結構化數據（JSON-LD）', category: '技術 SEO' },
    { id: 'breadcrumbs', label: '麵包屑導航', category: '技術 SEO' },
    { id: 'canonical', label: 'Canonical URL 設定', category: '技術 SEO' },
    { id: 'mobile-friendly', label: '行動裝置友善', category: '使用者體驗' },
    { id: 'page-speed', label: '頁面載入速度優化', category: '使用者體驗' },
    { id: 'alt-text', label: '圖片 Alt 文字', category: '可訪問性' }
  ];

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getCompletionRate = () => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / checklistItems.length) * 100);
  };

  const groupedItems = checklistItems.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, typeof checklistItems>);

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">SEO 檢查清單</h3>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-bold">{getCompletionRate()}%</span>
          </div>
          <div className="text-sm text-slate-600">完成度</div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h4 className="font-medium text-slate-700 mb-3">{category}</h4>
            <div className="space-y-2">
              {items.map(item => (
                <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedItems[item.id] || false}
                    onChange={() => toggleItem(item.id)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className={`text-sm ${
                    checkedItems[item.id] ? 'text-slate-500 line-through' : 'text-slate-700'
                  }`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}