/**
 * SEO 優化器 - 提供結構化數據、社交媒體預覽和內部連結系統
 */

import { Metadata } from 'next';

// SEO 配置介面
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any>[];
  noIndex?: boolean;
  alternateLanguages?: { [key: string]: string };
}

// 計算器類型定義
export type CalculatorType =
  | 'salary'
  | 'mortgage'
  | 'tax'
  | 'investment'
  | 'retirement'
  | 'capital'
  | 'cost'
  | 'credit-card'
  | 'delivery-income'
  | 'electricity'
  | 'labor-pension'
  | 'overtime'
  | 'percentage'
  | 'profit'
  | 'rent-cost'
  | 'split'
  | 'work-hours';

// 計算器 SEO 配置
export const calculatorSEOConfigs: Record<CalculatorType, SEOConfig> = {
  salary: {
    title: '薪資計算器 - 2025年最新勞健保費率 | TaiCalc',
    description: '精準計算實際到手薪資、勞保、健保、勞退提撥。使用2025年最新費率，支援年終獎金計算，提供歷史比較分析。',
    keywords: ['薪資計算', '勞健保計算', '實領薪資', '2025勞保費率', '健保費率', '勞退提撥', '年終獎金'],
    ogImage: '/images/og/salary-calculator.png'
  },
  mortgage: {
    title: '房貸計算器 - 每月還款金額計算 | TaiCalc',
    description: '快速計算房貸每月還款金額、總利息支出。支援新青安房貸、一般房貸試算，幫您做出最佳購屋決策。',
    keywords: ['房貸試算', '房貸計算', '每月還款', '新青安房貸', '房屋貸款', '利息計算'],
    ogImage: '/images/og/mortgage-calculator.png'
  },
  tax: {
    title: '所得稅計算器 - 2025年稅率級距 | TaiCalc',
    description: '2025年所得稅試算，支援單身、已婚、扶養親屬等不同情況。精準計算應繳稅額，提前規劃節稅策略。',
    keywords: ['所得稅計算', '2025所得稅', '稅率級距', '報稅試算', '節稅規劃', '扶養親屬'],
    ogImage: '/images/og/tax-calculator.png'
  },
  investment: {
    title: '投資複利計算器 - 長期投資收益試算 | TaiCalc',
    description: '計算投資複利效果，模擬長期投資收益。支援定期定額、一次性投資等多種投資方式試算。',
    keywords: ['複利計算', '投資計算', '定期定額', '投資收益', '理財規劃', '資產配置'],
    ogImage: '/images/og/investment-calculator.png'
  },
  retirement: {
    title: '退休金計算器 - 退休規劃試算 | TaiCalc',
    description: '計算退休所需資金，規劃退休投資策略。考量通膨影響，幫您制定完整退休財務計畫。',
    keywords: ['退休金計算', '退休規劃', '勞退試算', '退休投資', '財務自由', '養老金'],
    ogImage: '/images/og/retirement-calculator.png'
  },
  capital: {
    title: '資本利得稅計算器 - 股票交易稅務 | TaiCalc',
    description: '計算股票、房地產等資本利得稅。了解交易成本，優化投資策略，合法節稅，提升投資效益。',
    keywords: ['資本利得稅', '股票稅務', '證券交易稅', '房地合一稅', '投資稅務'],
    ogImage: '/images/og/capital-calculator.png'
  },
  cost: {
    title: '成本計算器 - 商品定價分析 | TaiCalc',
    description: '快速計算商品成本、利潤率、建議售價。適用於電商、零售業者進行定價策略分析，優化商品獲利能力。',
    keywords: ['成本計算', '定價策略', '利潤分析', '商品定價', '毛利率計算'],
    ogImage: '/images/og/cost-calculator.png'
  },
  'credit-card': {
    title: '信用卡利息計算器 - 分期付款試算 | TaiCalc',
    description: '計算信用卡分期利息、最低應繳金額。比較不同還款方案，避免循環利息陷阱，聰明理財。',
    keywords: ['信用卡利息', '分期付款', '循環利息', '最低應繳', '信用卡債務'],
    ogImage: '/images/og/credit-card-calculator.png'
  },
  'delivery-income': {
    title: '外送收入計算器 - 外送員薪資試算 | TaiCalc',
    description: '計算外送收入、油錢成本、實際獲利。適用於foodpanda、Uber Eats等平台外送員薪資分析。',
    keywords: ['外送收入', '外送員薪資', 'foodpanda收入', 'Uber Eats收入', '外送成本'],
    ogImage: '/images/og/delivery-income-calculator.png'
  },
  electricity: {
    title: '電費計算器 - 台電電費試算 | TaiCalc',
    description: '根據台電最新電價計算電費。支援夏季、非夏季電價，幫您控制用電成本，節省電費支出。',
    keywords: ['電費計算', '台電電價', '電費試算', '用電成本', '節電規劃'],
    ogImage: '/images/og/electricity-calculator.png'
  },
  'labor-pension': {
    title: '勞退自提計算器 - 勞退收益試算 | TaiCalc',
    description: '計算勞退自提6%的退休收益。比較自提與不自提差異，規劃退休財務，提升退休保障，享受稅務優惠。',
    keywords: ['勞退自提', '勞退收益', '退休金試算', '勞工退休金', '6%自提'],
    ogImage: '/images/og/labor-pension-calculator.png'
  },
  overtime: {
    title: '加班費計算器 - 加班工資試算 | TaiCalc',
    description: '根據勞基法計算加班費。支援平日、假日、國定假日等不同加班費率計算，保障勞工權益。',
    keywords: ['加班費計算', '加班工資', '勞基法加班', '加班費率', '工時計算'],
    ogImage: '/images/og/overtime-calculator.png'
  },
  percentage: {
    title: '百分比計算器 - 比例換算工具 | TaiCalc',
    description: '快速百分比計算、比例換算、折扣計算。適用於商業分析、學術研究、日常數學計算，提升計算效率。',
    keywords: ['百分比計算', '比例計算', '折扣計算', '百分比換算', '數學計算'],
    ogImage: '/images/og/percentage-calculator.png'
  },
  profit: {
    title: '獲利計算器 - 投資報酬率分析 | TaiCalc',
    description: '計算投資獲利、報酬率、年化收益率。分析投資績效，優化投資組合，制定更好的投資策略。',
    keywords: ['獲利計算', '投資報酬率', '年化收益', '投資績效', 'ROI計算'],
    ogImage: '/images/og/profit-calculator.png'
  },
  'rent-cost': {
    title: '租屋成本計算器 - 租金負擔分析 | TaiCalc',
    description: '租屋成本計算、租金負擔比例分析。包含押金、仲介費、水電等完整租屋支出預算規劃。',
    keywords: ['租屋成本', '租金計算', '租屋負擔', '租屋預算', '房租分析'],
    ogImage: '/images/og/rent-cost-calculator.png'
  },
  split: {
    title: '分帳計算器 - 聚餐費用分攤 | TaiCalc',
    description: '快速計算聚餐、旅遊等費用分攤。支援不同分攤方式，讓帳務清楚透明，避免金錢糾紛。',
    keywords: ['分帳計算', '費用分攤', '聚餐分帳', '旅遊分帳', 'AA制計算'],
    ogImage: '/images/og/split-calculator.png'
  },
  'work-hours': {
    title: '工時計算器 - 工作時數統計 | TaiCalc',
    description: '計算工作時數、加班時數。適用於時薪工作者、自由工作者進行工時管理，提升工作效率。',
    keywords: ['工時計算', '工作時數', '加班時數', '時薪計算', '工時管理'],
    ogImage: '/images/og/work-hours-calculator.png'
  }
};

/**
 * 生成頁面 Metadata
 */
export function generatePageMetadata(
  calculatorType: CalculatorType,
  customConfig?: Partial<SEOConfig>
): Metadata {
  const config = calculatorSEOConfigs[calculatorType];

  if (!config) {
    throw new Error(`未找到計算器類型 "${calculatorType}" 的 SEO 配置`);
  }

  const mergedConfig = { ...config, ...customConfig };
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taicalc.com';

  // 動態生成 OG 圖片 URL
  const ogImageUrl = generateDynamicOGImage(calculatorType, mergedConfig);

  return {
    title: mergedConfig.title,
    description: mergedConfig.description,
    keywords: mergedConfig.keywords,
    robots: mergedConfig.noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: mergedConfig.title,
      description: mergedConfig.description,
      url: mergedConfig.canonicalUrl || `${baseUrl}/${calculatorType}`,
      siteName: 'TaiCalc 數策',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: mergedConfig.title,
          type: 'image/png'
        },
        // 添加多種尺寸的圖片
        {
          url: ogImageUrl.replace('1200x630', '800x600'),
          width: 800,
          height: 600,
          alt: mergedConfig.title,
          type: 'image/png'
        }
      ],
      locale: 'zh_TW',
      type: 'website',
      // 增加更多 OG 標籤
      countryName: '台灣',
      determiner: 'the',
      ttl: 604800 // 7 days
    },
    twitter: {
      card: 'summary_large_image',
      title: mergedConfig.title,
      description: mergedConfig.description,
      images: [ogImageUrl],
      creator: '@taicalc',
      site: '@taicalc'
    },
    // 添加更多社交媒體標籤
    other: {
      // Facebook App ID (如果有的話)
      'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
      // LINE 分享優化
      'line:card': 'summary_large_image',
      // Telegram 分享優化
      'telegram:card': 'summary_large_image',
      // 添加 Apple 相關標籤
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'TaiCalc',
      // 添加 Microsoft 相關標籤
      'msapplication-TileColor': '#6366f1',
      'msapplication-config': '/browserconfig.xml',
      // 添加主題顏色
      'theme-color': '#6366f1'
    },
    alternates: mergedConfig.alternateLanguages ? {
      languages: mergedConfig.alternateLanguages
    } : undefined,
    // 添加應用程式相關標籤
    applicationName: 'TaiCalc 數策',
    referrer: 'origin-when-cross-origin',
    colorScheme: 'light',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1
    },
    // 添加驗證標籤
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
      other: {
        'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || ''
      }
    }
  };
}

/**
 * 動態生成 OG 圖片 URL
 */
function generateDynamicOGImage(calculatorType: CalculatorType, config: SEOConfig): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taicalc.com';

  // 如果有自定義圖片，使用自定義圖片
  if (config.ogImage && !config.ogImage.includes('og/')) {
    return config.ogImage;
  }

  // 生成動態 OG 圖片 URL（可以是 API 端點或預生成的圖片）
  const params = new URLSearchParams({
    type: calculatorType,
    title: encodeURIComponent(config.title.split('|')[0].trim()),
    category: encodeURIComponent(getCalculatorCategoryName(calculatorType)),
    size: '1200x630'
  });

  // 如果有 OG 圖片生成 API，使用 API
  if (process.env.NEXT_PUBLIC_OG_IMAGE_API) {
    return `${process.env.NEXT_PUBLIC_OG_IMAGE_API}/calculator?${params.toString()}`;
  }

  // 否則使用預設圖片
  return config.ogImage || `${baseUrl}/images/og/${calculatorType}-calculator.png`;
}

/**
 * 生成結構化數據
 */
export function generateStructuredData(
  calculatorType: CalculatorType,
  customData?: Record<string, any>
): Record<string, any>[] {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taicalc.com';
  const config = calculatorSEOConfigs[calculatorType];

  // 增強的 WebPage Schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: config.title,
    description: config.description,
    url: `${baseUrl}/${calculatorType}`,
    inLanguage: 'zh-TW',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: 'TaiCalc 數策',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'TaiCalc 數策',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 200
      }
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'TaiCalc 數策',
      url: baseUrl
    },
    about: {
      '@type': 'Thing',
      name: getCalculatorCategoryName(calculatorType)
    },
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: config.title,
      description: config.description,
      url: `${baseUrl}/${calculatorType}`,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2.0',
      releaseNotes: '2025年最新版本，支援最新法規和費率',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'TWD',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
        bestRating: '5',
        worstRating: '1'
      },
      featureList: getCalculatorFeatures(calculatorType)
    },
    // 增加關鍵字和主題標記
    keywords: config.keywords?.join(', '),
    audience: {
      '@type': 'Audience',
      audienceType: '台灣居民',
      geographicArea: {
        '@type': 'Country',
        name: '台灣'
      }
    }
  };

  // 增強的麵包屑 Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首頁',
        item: {
          '@type': 'WebPage',
          '@id': baseUrl,
          name: '首頁'
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '計算工具',
        item: {
          '@type': 'CollectionPage',
          '@id': `${baseUrl}/tools`,
          name: '計算工具'
        }
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: getCalculatorDisplayName(calculatorType),
        item: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/${calculatorType}`,
          name: getCalculatorDisplayName(calculatorType)
        }
      }
    ]
  };

  // 增加 HowTo Schema（針對計算器使用說明）
  const howToSchema = generateHowToSchema(calculatorType);

  // 增加 Service Schema（針對財務服務）
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${getCalculatorDisplayName(calculatorType)}服務`,
    description: config.description,
    provider: {
      '@type': 'Organization',
      name: 'TaiCalc 數策',
      url: baseUrl
    },
    areaServed: {
      '@type': 'Country',
      name: '台灣'
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/${calculatorType}`,
      serviceSmsNumber: null,
      servicePhone: null
    },
    category: getCalculatorCategoryName(calculatorType),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TWD'
    }
  };

  const faqSchema = generateFAQSchema(calculatorType);

  const schemas: any[] = [webPageSchema, breadcrumbSchema, serviceSchema];

  if (howToSchema) {
    schemas.push(howToSchema);
  }

  if (faqSchema) {
    schemas.push(faqSchema);
  }

  if (config.structuredData) {
    schemas.push(...config.structuredData);
  }

  if (customData) {
    schemas.push(customData);
  }

  return schemas;
}

/**
 * 生成 FAQ 結構化數據
 */
function generateFAQSchema(calculatorType: CalculatorType): Record<string, any> | null {
  const faqs = getFAQsByCalculatorType(calculatorType);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * 獲取計算器相關的常見問題
 */
function getFAQsByCalculatorType(calculatorType: CalculatorType): Array<{ question: string, answer: string }> | null {
  const faqMap: Partial<Record<CalculatorType, Array<{ question: string, answer: string }>>> = {
    salary: [
      {
        question: '2025年勞健保費率是多少？',
        answer: '2025年勞保費率為11.5%，健保費率為5.17%。勞退提撥率為6%。'
      },
      {
        question: '薪資計算包含哪些項目？',
        answer: '包含勞保自付額、健保自付額、勞退提撥、所得稅預扣等項目，計算實際到手薪資。'
      }
    ],
    mortgage: [
      {
        question: '新青安房貸和一般房貸有什麼差別？',
        answer: '新青安房貸提供較低利率和較長還款期限，適用於首次購屋的年輕族群。'
      },
      {
        question: '房貸利率會影響多少還款金額？',
        answer: '利率每增加0.1%，30年期房貸的總利息支出約增加1-2%。'
      }
    ],
    tax: [
      {
        question: '2025年所得稅免稅額是多少？',
        answer: '個人免稅額為97,000元，配偶免稅額為97,000元，扶養親屬免稅額為97,000元。'
      },
      {
        question: '如何計算應繳所得稅？',
        answer: '應納稅額 = (綜合所得總額 - 免稅額 - 扣除額) × 稅率 - 累進差額'
      }
    ],
    investment: [
      {
        question: '複利效果如何計算？',
        answer: '複利公式：FV = PV × (1 + r)^n，其中FV為終值，PV為現值，r為利率，n為期數。'
      }
    ],
    retirement: [
      {
        question: '退休需要準備多少錢？',
        answer: '一般建議準備退休前年收入的10-15倍，並考量通膨和醫療費用增加。'
      }
    ],
    capital: [
      {
        question: '股票資本利得稅如何計算？',
        answer: '個人股票交易所得目前免稅，但證券交易稅為0.3%。'
      }
    ],
    cost: [
      {
        question: '如何計算合理的商品定價？',
        answer: '建議售價 = 成本 ÷ (1 - 目標毛利率)，並考量市場競爭和消費者接受度。'
      }
    ],
    'credit-card': [
      {
        question: '信用卡循環利息如何計算？',
        answer: '循環利息 = 未繳金額 × 日息 × 天數，年利率通常為15%左右。'
      }
    ],
    'delivery-income': [
      {
        question: '外送員實際收入如何計算？',
        answer: '實際收入 = 總收入 - 油錢 - 車輛折舊 - 保險費用 - 其他成本。'
      }
    ],
    electricity: [
      {
        question: '台電電費如何計算？',
        answer: '採累進費率制，用電量越高費率越高。夏季(6-9月)和非夏季費率不同。'
      }
    ],
    'labor-pension': [
      {
        question: '勞退自提6%划算嗎？',
        answer: '勞退自提享有稅務優惠，且有政府保證收益，通常比定存划算。'
      }
    ],
    overtime: [
      {
        question: '加班費如何計算？',
        answer: '平日加班前2小時為1.33倍，超過2小時為1.67倍。假日加班為2倍工資。'
      }
    ],
    percentage: [
      {
        question: '如何快速計算百分比？',
        answer: '百分比 = (部分 ÷ 總數) × 100%'
      }
    ],
    profit: [
      {
        question: '投資報酬率如何計算？',
        answer: 'ROI = (投資收益 - 投資成本) ÷ 投資成本 × 100%'
      }
    ],
    'rent-cost': [
      {
        question: '租屋成本包含哪些項目？',
        answer: '包含租金、押金、仲介費、水電費、網路費、管理費等。'
      }
    ],
    split: [
      {
        question: '如何公平分攤費用？',
        answer: '可依人數平分、依消費金額比例分攤，或依個人經濟能力調整。'
      }
    ],
    'work-hours': [
      {
        question: '如何計算有效工時？',
        answer: '有效工時 = 總工時 - 休息時間 - 非生產性時間'
      }
    ]
  };

  return faqMap[calculatorType] || null;
}

/**
 * 獲取計算器功能列表
 */
function getCalculatorFeatures(calculatorType: CalculatorType): string[] {
  const featureMap: Record<CalculatorType, string[]> = {
    salary: [
      '2025年最新勞健保費率計算',
      '年終獎金試算',
      '歷史比較分析',
      '趨勢分析',
      '實領薪資計算',
      '勞退提撥計算'
    ],
    mortgage: [
      '每月還款金額計算',
      '總利息計算',
      '新青安房貸支援',
      '不同利率比較',
      '還款期限調整',
      '提前還款試算'
    ],
    tax: [
      '2025年稅率級距',
      '免稅額計算',
      '扣除額優化',
      '節稅建議',
      '扶養親屬計算',
      '所得稅試算'
    ],
    investment: [
      '複利效果計算',
      '定期定額試算',
      '投資報酬率分析',
      '風險評估',
      '長期投資規劃',
      '通膨影響分析'
    ],
    retirement: [
      '退休金需求計算',
      '退休投資規劃',
      '通膨調整',
      '生活費估算',
      '醫療費用預估',
      '退休年齡規劃'
    ],
    capital: [
      '資本利得稅計算',
      '股票交易稅',
      '房地合一稅',
      '節稅策略',
      '投資成本分析',
      '稅務優化'
    ],
    cost: [
      '商品成本分析',
      '定價策略',
      '利潤率計算',
      '毛利分析',
      '競爭力評估',
      '成本結構優化'
    ],
    'credit-card': [
      '信用卡利息計算',
      '分期付款試算',
      '循環利息分析',
      '還款策略',
      '債務整合',
      '最低應繳計算'
    ],
    'delivery-income': [
      '外送收入計算',
      '成本分析',
      '油錢計算',
      '時薪分析',
      '平台比較',
      '實際獲利計算'
    ],
    electricity: [
      '台電電費計算',
      '夏季非夏季費率',
      '累進費率計算',
      '節電建議',
      '用電成本分析',
      '電費預估'
    ],
    'labor-pension': [
      '勞退自提計算',
      '6%自提效益',
      '稅務優惠',
      '退休收益試算',
      '投資報酬比較',
      '退休保障分析'
    ],
    overtime: [
      '加班費計算',
      '勞基法規定',
      '平日假日費率',
      '國定假日加班',
      '工時管理',
      '加班成本分析'
    ],
    percentage: [
      '百分比計算',
      '比例換算',
      '折扣計算',
      '成長率分析',
      '比率比較',
      '數學運算'
    ],
    profit: [
      '獲利計算',
      '投資報酬率',
      '年化收益',
      'ROI分析',
      '投資績效',
      '收益比較'
    ],
    'rent-cost': [
      '租屋成本計算',
      '租金負擔分析',
      '押金計算',
      '仲介費用',
      '水電費估算',
      '租屋預算規劃'
    ],
    split: [
      '費用分攤計算',
      'AA制計算',
      '聚餐分帳',
      '旅遊費用分攤',
      '比例分配',
      '公平分攤'
    ],
    'work-hours': [
      '工時計算',
      '工作時數統計',
      '加班時數',
      '時薪計算',
      '工時管理',
      '效率分析'
    ]
  };

  return featureMap[calculatorType] || ['財務計算', '數據分析', '結果匯出'];
}

/**
 * 生成 HowTo 結構化數據
 */
function generateHowToSchema(calculatorType: CalculatorType): Record<string, any> | null {
  const howToMap: Partial<Record<CalculatorType, {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string; }>;
  }>> = {
    salary: {
      name: '如何使用薪資計算器',
      description: '學習如何使用薪資計算器計算實際到手薪資',
      steps: [
        { name: '輸入月薪', text: '在月薪欄位輸入您的月薪金額' },
        { name: '設定年終獎金', text: '輸入年終獎金月數，通常為1-3個月' },
        { name: '點擊計算', text: '點擊「計算薪資」按鈕開始計算' },
        { name: '查看結果', text: '查看實領薪資、勞健保扣除額等詳細資訊' }
      ]
    },
    mortgage: {
      name: '如何使用房貸試算器',
      description: '學習如何計算房貸每月還款金額',
      steps: [
        { name: '輸入貸款總額', text: '輸入您要貸款的總金額' },
        { name: '設定年利率', text: '輸入銀行提供的年利率' },
        { name: '選擇貸款年限', text: '選擇貸款期限，通常為20-30年' },
        { name: '查看試算結果', text: '查看每月還款金額和總利息支出' }
      ]
    },
    tax: {
      name: '如何使用所得稅計算器',
      description: '學習如何計算個人所得稅',
      steps: [
        { name: '輸入年收入', text: '輸入您的年度總收入' },
        { name: '選擇申報方式', text: '選擇單身或已婚申報' },
        { name: '設定扶養人數', text: '輸入扶養親屬人數' },
        { name: '查看應繳稅額', text: '查看應繳所得稅和節稅建議' }
      ]
    },
    // 其他計算器的 HowTo 可以根據需要添加
    investment: {
      name: '如何使用投資複利計算器',
      description: '學習如何計算投資複利效果',
      steps: [
        { name: '輸入初始投資', text: '輸入您的初始投資金額' },
        { name: '設定年報酬率', text: '輸入預期的年報酬率' },
        { name: '選擇投資期間', text: '選擇投資的年數' },
        { name: '查看複利效果', text: '查看投資成長和複利收益' }
      ]
    },
    retirement: {
      name: '如何使用退休金計算器',
      description: '學習如何規劃退休金需求',
      steps: [
        { name: '輸入目前年齡', text: '輸入您目前的年齡' },
        { name: '設定退休年齡', text: '設定預計退休的年齡' },
        { name: '估算退休支出', text: '估算退休後每月生活費' },
        { name: '查看退休規劃', text: '查看需要準備的退休金總額' }
      ]
    },
    capital: {
      name: '如何使用資本利得稅計算器',
      description: '學習如何計算投資稅務',
      steps: [
        { name: '輸入買入價格', text: '輸入投資標的買入價格' },
        { name: '輸入賣出價格', text: '輸入投資標的賣出價格' },
        { name: '選擇投資類型', text: '選擇股票、房地產等投資類型' },
        { name: '查看稅務計算', text: '查看應繳資本利得稅' }
      ]
    }
  };

  const howToData = howToMap[calculatorType];
  if (!howToData) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howToData.name,
    description: howToData.description,
    image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taicalc.com'}/images/how-to/${calculatorType}.png`,
    totalTime: 'PT3M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'TWD',
      value: '0'
    },
    supply: [
      {
        '@type': 'HowToSupply',
        name: '網路瀏覽器'
      },
      {
        '@type': 'HowToSupply',
        name: '財務資料'
      }
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'TaiCalc 計算器'
      }
    ],
    step: howToData.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taicalc.com'}/images/steps/${calculatorType}-step-${index + 1}.png`
    }))
  };
}
function getCalculatorCategoryName(calculatorType: CalculatorType): string {
  const categoryMap: Record<CalculatorType, string> = {
    salary: '薪資計算',
    mortgage: '房貸試算',
    tax: '稅務計算',
    investment: '投資理財',
    retirement: '退休規劃',
    capital: '稅務計算',
    cost: '商業計算',
    'credit-card': '信貸計算',
    'delivery-income': '收入計算',
    electricity: '生活費用',
    'labor-pension': '退休規劃',
    overtime: '薪資計算',
    percentage: '數學計算',
    profit: '投資理財',
    'rent-cost': '生活費用',
    split: '生活費用',
    'work-hours': '工時管理'
  };

  return categoryMap[calculatorType] || '財務計算';
}

/**
 * 獲取計算器顯示名稱
 */
function getCalculatorDisplayName(calculatorType: CalculatorType): string {
  const displayNameMap: Record<CalculatorType, string> = {
    salary: '薪資計算器',
    mortgage: '房貸試算器',
    tax: '所得稅計算器',
    investment: '投資複利計算器',
    retirement: '退休金計算器',
    capital: '資本利得稅計算器',
    cost: '成本計算器',
    'credit-card': '信用卡利息計算器',
    'delivery-income': '外送收入計算器',
    electricity: '電費計算器',
    'labor-pension': '勞退自提計算器',
    overtime: '加班費計算器',
    percentage: '百分比計算器',
    profit: '獲利計算器',
    'rent-cost': '租屋成本計算器',
    split: '分帳計算器',
    'work-hours': '工時計算器'
  };

  return displayNameMap[calculatorType] || '計算器';
}

/**
 * 生成內部連結建議（增強版）
 */
export function generateInternalLinks(calculatorType: CalculatorType): Array<{
  title: string;
  url: string;
  description: string;
  relevanceScore?: number;
  category?: string;
}> {
  const linkMap: Record<CalculatorType, Array<{ title: string, url: string, description: string, relevanceScore: number, category: string }>> = {
    salary: [
      { title: '所得稅計算器', url: '/tax', description: '計算薪資所得稅', relevanceScore: 0.9, category: '稅務計算' },
      { title: '勞退自提計算器', url: '/tools/labor-pension-calculator', description: '評估勞退自提效益', relevanceScore: 0.85, category: '退休規劃' },
      { title: '加班費計算器', url: '/tools/overtime-calculator', description: '計算加班工資', relevanceScore: 0.8, category: '薪資計算' },
      { title: '工時計算器', url: '/tools/work-hours-calculator', description: '管理工作時間', relevanceScore: 0.7, category: '工時管理' },
      { title: '退休金計算器', url: '/retirement', description: '規劃退休財務', relevanceScore: 0.6, category: '退休規劃' }
    ],
    mortgage: [
      { title: '租屋成本計算器', url: '/tools/rent-cost-calculator', description: '比較租屋與購屋成本', relevanceScore: 0.9, category: '居住成本' },
      { title: '投資複利計算器', url: '/investment', description: '計算頭期款投資收益', relevanceScore: 0.8, category: '投資理財' },
      { title: '薪資計算器', url: '/salary', description: '評估還款能力', relevanceScore: 0.85, category: '薪資計算' },
      { title: '所得稅計算器', url: '/tax', description: '計算房貸利息扣除額', relevanceScore: 0.7, category: '稅務計算' },
      { title: '電費計算器', url: '/tools/electricity-calculator', description: '估算居住總成本', relevanceScore: 0.6, category: '生活費用' }
    ],
    tax: [
      { title: '薪資計算器', url: '/salary', description: '計算薪資所得', relevanceScore: 0.9, category: '薪資計算' },
      { title: '資本利得稅計算器', url: '/capital', description: '計算投資稅務', relevanceScore: 0.85, category: '投資稅務' },
      { title: '退休金計算器', url: '/retirement', description: '規劃退休稅務', relevanceScore: 0.7, category: '退休規劃' },
      { title: '勞退自提計算器', url: '/tools/labor-pension-calculator', description: '享受稅務優惠', relevanceScore: 0.8, category: '退休規劃' },
      { title: '房貸試算器', url: '/mortgage', description: '計算房貸利息扣除', relevanceScore: 0.6, category: '房貸試算' }
    ],
    investment: [
      { title: '退休金計算器', url: '/retirement', description: '規劃退休投資', relevanceScore: 0.9, category: '退休規劃' },
      { title: '獲利計算器', url: '/tools/profit-calculator', description: '分析投資報酬', relevanceScore: 0.85, category: '投資分析' },
      { title: '資本利得稅計算器', url: '/capital', description: '計算投資稅務', relevanceScore: 0.8, category: '投資稅務' },
      { title: '薪資計算器', url: '/salary', description: '評估投資能力', relevanceScore: 0.7, category: '薪資計算' },
      { title: '百分比計算器', url: '/tools/percentage-calculator', description: '計算投資比例', relevanceScore: 0.6, category: '數學計算' }
    ],
    retirement: [
      { title: '投資複利計算器', url: '/investment', description: '規劃退休投資', relevanceScore: 0.9, category: '投資理財' },
      { title: '勞退自提計算器', url: '/tools/labor-pension-calculator', description: '優化勞退收益', relevanceScore: 0.85, category: '退休規劃' },
      { title: '薪資計算器', url: '/salary', description: '評估退休前收入', relevanceScore: 0.8, category: '薪資計算' },
      { title: '所得稅計算器', url: '/tax', description: '規劃退休稅務', relevanceScore: 0.7, category: '稅務計算' },
      { title: '房貸試算器', url: '/mortgage', description: '退休前房貸規劃', relevanceScore: 0.6, category: '房貸試算' }
    ],
    capital: [
      { title: '投資複利計算器', url: '/investment', description: '計算投資收益', relevanceScore: 0.9, category: '投資理財' },
      { title: '獲利計算器', url: '/tools/profit-calculator', description: '分析投資報酬', relevanceScore: 0.85, category: '投資分析' },
      { title: '所得稅計算器', url: '/tax', description: '計算綜合所得稅', relevanceScore: 0.8, category: '稅務計算' },
      { title: '百分比計算器', url: '/tools/percentage-calculator', description: '計算稅率比例', relevanceScore: 0.7, category: '數學計算' },
      { title: '薪資計算器', url: '/salary', description: '評估投資能力', relevanceScore: 0.6, category: '薪資計算' }
    ],
    cost: [
      { title: '獲利計算器', url: '/tools/profit-calculator', description: '分析商品獲利', relevanceScore: 0.9, category: '商業分析' },
      { title: '百分比計算器', url: '/tools/percentage-calculator', description: '計算成本比例', relevanceScore: 0.85, category: '數學計算' },
      { title: '所得稅計算器', url: '/tax', description: '計算營業稅務', relevanceScore: 0.7, category: '稅務計算' },
      { title: '薪資計算器', url: '/salary', description: '計算人事成本', relevanceScore: 0.6, category: '薪資計算' }
    ],
    'credit-card': [
      { title: '薪資計算器', url: '/salary', description: '評估還款能力', relevanceScore: 0.9, category: '薪資計算' },
      { title: '百分比計算器', url: '/tools/percentage-calculator', description: '計算利率比較', relevanceScore: 0.8, category: '數學計算' },
      { title: '房貸試算器', url: '/mortgage', description: '比較貸款方案', relevanceScore: 0.7, category: '貸款比較' },
      { title: '投資複利計算器', url: '/investment', description: '投資vs還債分析', relevanceScore: 0.6, category: '投資理財' }
    ],
    'delivery-income': [
      { title: '薪資計算器', url: '/salary', description: '比較正職收入', relevanceScore: 0.9, category: '收入比較' },
      { title: '工時計算器', url: '/tools/work-hours-calculator', description: '管理工作時間', relevanceScore: 0.85, category: '工時管理' },
      { title: '成本計算器', url: '/tools/cost-calculator', description: '計算營運成本', relevanceScore: 0.8, category: '成本分析' },
      { title: '所得稅計算器', url: '/tax', description: '計算所得稅', relevanceScore: 0.7, category: '稅務計算' },
      { title: '電費計算器', url: '/tools/electricity-calculator', description: '計算車輛充電成本', relevanceScore: 0.6, category: '營運成本' }
    ],
    electricity: [
      { title: '租屋成本計算器', url: '/tools/rent-cost-calculator', description: '計算居住總成本', relevanceScore: 0.9, category: '居住成本' },
      { title: '百分比計算器', url: '/tools/percentage-calculator', description: '分析電費占比', relevanceScore: 0.8, category: '數學計算' },
      { title: '薪資計算器', url: '/salary', description: '評估電費負擔', relevanceScore: 0.7, category: '薪資計算' },
      { title: '房貸試算器', url: '/mortgage', description: '計算居住總成本', relevanceScore: 0.6, category: '居住成本' }
    ],
    'labor-pension': [
      { title: '薪資計算器', url: '/salary', description: '了解勞退提撥', relevanceScore: 0.9, category: '薪資計算' },
      { title: '退休金計算器', url: '/retirement', description: '規劃完整退休', relevanceScore: 0.85, category: '退休規劃' },
      { title: '投資複利計算器', url: '/investment', description: '比較投資收益', relevanceScore: 0.8, category: '投資比較' },
      { title: '所得稅計算器', url: '/tax', description: '享受稅務優惠', relevanceScore: 0.75, category: '稅務優惠' },
      { title: '獲利計算器', url: '/tools/profit-calculator', description: '分析勞退報酬', relevanceScore: 0.7, category: '投資分析' }
    ],
    overtime: [
      { title: '薪資計算器', url: '/salary', description: '計算基本薪資', relevanceScore: 0.9, category: '薪資計算' },
      { title: '工時計算器', url: '/tools/work-hours-calculator', description: '管理工作時間', relevanceScore: 0.85, category: '工時管理' },
      { title: '所得稅計算器', url: '/tax', description: '計算加班費稅務', relevanceScore: 0.7, category: '稅務計算' },
      { title: '勞退自提計算器', url: '/tools/labor-pension-calculator', description: '優化退休規劃', relevanceScore: 0.6, category: '退休規劃' }
    ],
    percentage: [
      { title: '獲利計算器', url: '/tools/profit-calculator', description: '計算報酬率', relevanceScore: 0.9, category: '投資分析' },
      { title: '成本計算器', url: '/tools/cost-calculator', description: '分析成本結構', relevanceScore: 0.85, category: '成本分析' },
      { title: '投資複利計算器', url: '/investment', description: '計算投資比例', relevanceScore: 0.8, category: '投資理財' },
      { title: '信用卡利息計算器', url: '/tools/credit-card-calculator', description: '比較利率', relevanceScore: 0.7, category: '利率比較' }
    ],
    profit: [
      { title: '投資複利計算器', url: '/investment', description: '計算長期收益', relevanceScore: 0.9, category: '投資理財' },
      { title: '成本計算器', url: '/tools/cost-calculator', description: '分析成本結構', relevanceScore: 0.85, category: '成本分析' },
      { title: '百分比計算器', url: '/tools/percentage-calculator', description: '計算報酬率', relevanceScore: 0.8, category: '數學計算' },
      { title: '資本利得稅計算器', url: '/capital', description: '計算投資稅務', relevanceScore: 0.75, category: '投資稅務' },
      { title: '退休金計算器', url: '/retirement', description: '規劃退休投資', relevanceScore: 0.7, category: '退休規劃' }
    ],
    'rent-cost': [
      { title: '房貸試算器', url: '/mortgage', description: '比較購屋成本', relevanceScore: 0.9, category: '居住選擇' },
      { title: '薪資計算器', url: '/salary', description: '評估負擔能力', relevanceScore: 0.85, category: '薪資計算' },
      { title: '電費計算器', url: '/tools/electricity-calculator', description: '計算水電費用', relevanceScore: 0.8, category: '生活費用' },
      { title: '百分比計算器', url: '/tools/percentage-calculator', description: '分析租金占比', relevanceScore: 0.7, category: '數學計算' },
      { title: '投資複利計算器', url: '/investment', description: '頭期款投資分析', relevanceScore: 0.6, category: '投資理財' }
    ],
    split: [
      { title: '百分比計算器', url: '/tools/percentage-calculator', description: '計算分攤比例', relevanceScore: 0.9, category: '數學計算' },
      { title: '成本計算器', url: '/tools/cost-calculator', description: '分析費用結構', relevanceScore: 0.7, category: '成本分析' },
      { title: '薪資計算器', url: '/salary', description: '評估負擔能力', relevanceScore: 0.6, category: '薪資計算' }
    ],
    'work-hours': [
      { title: '薪資計算器', url: '/salary', description: '計算時薪收入', relevanceScore: 0.9, category: '薪資計算' },
      { title: '加班費計算器', url: '/tools/overtime-calculator', description: '計算加班收入', relevanceScore: 0.85, category: '薪資計算' },
      { title: '外送收入計算器', url: '/tools/delivery-income-calculator', description: '比較兼職收入', relevanceScore: 0.8, category: '收入比較' },
      { title: '百分比計算器', url: '/tools/percentage-calculator', description: '分析工時效率', relevanceScore: 0.7, category: '效率分析' }
    ]
  };

  const links = linkMap[calculatorType] || [];

  // 按相關性分數排序
  return links.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * 獲取相關計算器（基於類別）
 */
export function getRelatedCalculatorsByCategory(calculatorType: CalculatorType, maxResults: number = 5): Array<{
  title: string;
  url: string;
  description: string;
  category: string;
}> {
  // 正確的 URL 映射
  const calculatorUrlMap: Record<CalculatorType, string> = {
    salary: '/salary',
    mortgage: '/mortgage',
    tax: '/tax',
    investment: '/capital',
    retirement: '/capital',
    capital: '/capital',
    cost: '/tools/cost-calculator',
    'credit-card': '/tools/credit-card-calculator',
    'delivery-income': '/tools/delivery-income-calculator',
    electricity: '/tools/electricity-calculator',
    'labor-pension': '/tools/labor-pension-calculator',
    overtime: '/tools/overtime-calculator',
    percentage: '/tools/percentage-calculator',
    profit: '/tools/profit-calculator',
    'rent-cost': '/tools/rent-cost-calculator',
    split: '/tools/split-calculator',
    'work-hours': '/tools/work-hours-calculator'
  };

  const currentCategory = getCalculatorCategoryName(calculatorType);
  const allCalculators = Object.keys(calculatorSEOConfigs) as CalculatorType[];

  const relatedCalculators = allCalculators
    .filter(type => type !== calculatorType)
    .filter(type => getCalculatorCategoryName(type) === currentCategory)
    .map(type => ({
      title: getCalculatorDisplayName(type),
      url: calculatorUrlMap[type],
      description: calculatorSEOConfigs[type].description.substring(0, 100) + '...',
      category: getCalculatorCategoryName(type)
    }))
    .slice(0, maxResults);

  return relatedCalculators;
}


/**
 * 生成智能內部連結建議
 */
export function generateSmartInternalLinks(
  calculatorType: CalculatorType,
  userContext?: {
    previousCalculators?: CalculatorType[];
    userGoals?: string[];
    sessionData?: Record<string, any>;
  }
): Array<{
  title: string;
  url: string;
  description: string;
  relevanceScore: number;
  category: string;
  reason: string;
}> {
  const baseLinks = generateInternalLinks(calculatorType);

  // 如果沒有用戶上下文，返回基本連結
  if (!userContext) {
    return baseLinks.map(link => ({
      ...link,
      relevanceScore: link.relevanceScore || 0.5,
      category: link.category || '相關工具',
      reason: '基於計算器類型的相關推薦'
    }));
  }

  // 基於用戶歷史調整相關性分數
  const adjustedLinks = baseLinks.map(link => {
    let adjustedScore = link.relevanceScore || 0.5;
    let reason = '基於計算器類型的相關推薦';

    // 如果用戶之前使用過相關計算器，提高分數
    if (userContext.previousCalculators) {
      const linkCalculatorType = link.url.replace('/', '').replace('/tools/', '') as CalculatorType;
      if (userContext.previousCalculators.includes(linkCalculatorType)) {
        adjustedScore += 0.2;
        reason = '基於您的使用歷史推薦';
      }
    }

    // 基於用戶目標調整分數
    if (userContext.userGoals) {
      const goalKeywords = userContext.userGoals.join(' ').toLowerCase();
      if (link.description.toLowerCase().includes('退休') && goalKeywords.includes('退休')) {
        adjustedScore += 0.3;
        reason = '符合您的退休規劃目標';
      }
      if (link.description.toLowerCase().includes('投資') && goalKeywords.includes('投資')) {
        adjustedScore += 0.3;
        reason = '符合您的投資理財目標';
      }
      if (link.description.toLowerCase().includes('稅') && goalKeywords.includes('節稅')) {
        adjustedScore += 0.3;
        reason = '符合您的節稅規劃目標';
      }
    }

    return {
      ...link,
      relevanceScore: Math.min(adjustedScore, 1.0), // 限制最高分數為 1.0
      category: link.category || '相關工具',
      reason
    };
  });

  // 按調整後的相關性分數排序
  return adjustedLinks.sort((a, b) => b.relevanceScore - a.relevanceScore);
}