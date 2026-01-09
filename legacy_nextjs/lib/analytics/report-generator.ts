/**
 * 分析報告生成器
 * 
 * 生成各種使用報告和分析洞察
 */

import { analytics } from './analytics-manager';

// 報告類型定義
export interface UsageReport {
  period: {
    start: Date;
    end: Date;
    duration: number;
  };
  summary: {
    totalEvents: number;
    uniqueUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    bounceRate: number;
  };
  calculators: {
    mostPopular: Array<{ name: string; usage: number; percentage: number }>;
    averageCalculationTime: number;
    totalCalculations: number;
    conversionRate: number;
  };
  performance: {
    averagePageLoadTime: number;
    averageFCP: number;
    averageLCP: number;
    cumulativeLayoutShift: number;
    errorRate: number;
  };
  userBehavior: {
    topPages: Array<{ path: string; views: number; percentage: number }>;
    commonUserFlows: Array<{ flow: string[]; count: number }>;
    exitPages: Array<{ path: string; exits: number; percentage: number }>;
  };
  insights: {
    recommendations: string[];
    trends: Array<{ metric: string; trend: 'up' | 'down' | 'stable'; change: number }>;
    issues: Array<{ type: string; description: string; severity: 'low' | 'medium' | 'high' }>;
  };
}

export interface CalculatorReport {
  calculatorType: string;
  period: {
    start: Date;
    end: Date;
  };
  usage: {
    totalUsage: number;
    uniqueUsers: number;
    averageCalculationTime: number;
    completionRate: number;
  };
  inputs: {
    mostCommonValues: Record<string, any>;
    valueRanges: Record<string, { min: number; max: number; average: number }>;
    validationErrors: Array<{ field: string; error: string; count: number }>;
  };
  results: {
    resultRanges: Record<string, { min: number; max: number; average: number }>;
    mostCommonResults: Record<string, any>;
  };
  userBehavior: {
    averageTimeOnPage: number;
    shareRate: number;
    saveRate: number;
    returnRate: number;
  };
  performance: {
    averageCalculationTime: number;
    errorRate: number;
    timeoutRate: number;
  };
}

export interface PerformanceReport {
  period: {
    start: Date;
    end: Date;
  };
  coreWebVitals: {
    lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  };
  pageMetrics: {
    averageLoadTime: number;
    averageFCP: number;
    averageTTI: number;
    averageTTFB: number;
  };
  resourceMetrics: {
    totalResourceSize: number;
    averageResourceLoadTime: number;
    slowestResources: Array<{ url: string; loadTime: number; size: number }>;
  };
  errorMetrics: {
    totalErrors: number;
    errorRate: number;
    commonErrors: Array<{ type: string; message: string; count: number }>;
  };
  recommendations: Array<{
    category: 'performance' | 'accessibility' | 'seo' | 'best-practices';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
  }>;
}

/**
 * 報告生成器類別
 */
export class ReportGenerator {
  /**
   * 生成使用報告
   */
  static generateUsageReport(startDate: Date, endDate: Date): UsageReport {
    const baseReport = analytics.getUsageReport();
    const duration = endDate.getTime() - startDate.getTime();

    // 模擬數據 - 實際應該從分析數據庫獲取
    const mockData = this.generateMockUsageData(startDate, endDate);

    return {
      period: {
        start: startDate,
        end: endDate,
        duration
      },
      summary: {
        totalEvents: baseReport.summary.totalEvents,
        uniqueUsers: mockData.uniqueUsers,
        totalSessions: mockData.totalSessions,
        averageSessionDuration: baseReport.summary.sessionDuration,
        bounceRate: mockData.bounceRate
      },
      calculators: {
        mostPopular: baseReport.summary.mostUsedCalculators.map((calc, index) => ({
          name: calc.calculator,
          usage: calc.count,
          percentage: (calc.count / baseReport.summary.totalEvents) * 100
        })),
        averageCalculationTime: baseReport.summary.averageCalculationTime,
        totalCalculations: baseReport.summary.mostUsedCalculators.reduce((sum, calc) => sum + calc.count, 0),
        conversionRate: mockData.conversionRate
      },
      performance: {
        averagePageLoadTime: baseReport.performance.averagePageLoadTime,
        averageFCP: baseReport.performance.averageFCP,
        averageLCP: mockData.averageLCP,
        cumulativeLayoutShift: mockData.cumulativeLayoutShift,
        errorRate: baseReport.performance.errorRate
      },
      userBehavior: {
        topPages: mockData.topPages,
        commonUserFlows: mockData.commonUserFlows,
        exitPages: mockData.exitPages
      },
      insights: {
        recommendations: this.generateRecommendations(baseReport),
        trends: this.analyzeTrends(baseReport),
        issues: this.identifyIssues(baseReport)
      }
    };
  }

  /**
   * 生成計算器專用報告
   */
  static generateCalculatorReport(calculatorType: string, startDate: Date, endDate: Date): CalculatorReport {
    // 模擬數據 - 實際應該從分析數據庫獲取特定計算器的數據
    const mockData = this.generateMockCalculatorData(calculatorType, startDate, endDate);

    return {
      calculatorType,
      period: {
        start: startDate,
        end: endDate
      },
      usage: mockData.usage,
      inputs: mockData.inputs,
      results: mockData.results,
      userBehavior: mockData.userBehavior,
      performance: mockData.performance
    };
  }

  /**
   * 生成性能報告
   */
  static generatePerformanceReport(startDate: Date, endDate: Date): PerformanceReport {
    const baseReport = analytics.getUsageReport();
    const mockData = this.generateMockPerformanceData(startDate, endDate);

    return {
      period: {
        start: startDate,
        end: endDate
      },
      coreWebVitals: {
        lcp: this.rateCoreWebVital('lcp', mockData.lcp),
        fid: this.rateCoreWebVital('fid', mockData.fid),
        cls: this.rateCoreWebVital('cls', mockData.cls)
      },
      pageMetrics: {
        averageLoadTime: baseReport.performance.averagePageLoadTime,
        averageFCP: baseReport.performance.averageFCP,
        averageTTI: mockData.averageTTI,
        averageTTFB: mockData.averageTTFB
      },
      resourceMetrics: mockData.resourceMetrics,
      errorMetrics: {
        totalErrors: mockData.totalErrors,
        errorRate: baseReport.performance.errorRate,
        commonErrors: mockData.commonErrors
      },
      recommendations: this.generatePerformanceRecommendations(mockData)
    };
  }

  /**
   * 生成建議
   */
  private static generateRecommendations(report: any): string[] {
    const recommendations: string[] = [];

    if (report.performance.errorRate > 0.05) {
      recommendations.push('錯誤率偏高，建議檢查並修復常見錯誤');
    }

    if (report.performance.averagePageLoadTime > 3000) {
      recommendations.push('頁面載入時間超過 3 秒，建議優化性能');
    }

    if (report.summary.averageCalculationTime > 1000) {
      recommendations.push('計算時間較長，建議優化計算邏輯');
    }

    if (report.userBehavior.sessionPath.length < 2) {
      recommendations.push('用戶停留頁面較少，建議改善內部連結和用戶體驗');
    }

    return recommendations;
  }

  /**
   * 分析趨勢
   */
  private static analyzeTrends(report: any): Array<{ metric: string; trend: 'up' | 'down' | 'stable'; change: number }> {
    // 模擬趨勢分析 - 實際應該比較歷史數據
    return [
      { metric: '總事件數', trend: 'up', change: 15.2 },
      { metric: '平均計算時間', trend: 'down', change: -8.5 },
      { metric: '錯誤率', trend: 'stable', change: 0.1 },
      { metric: '頁面載入時間', trend: 'down', change: -12.3 }
    ];
  }

  /**
   * 識別問題
   */
  private static identifyIssues(report: any): Array<{ type: string; description: string; severity: 'low' | 'medium' | 'high' }> {
    const issues: Array<{ type: string; description: string; severity: 'low' | 'medium' | 'high' }> = [];

    if (report.performance.errorRate > 0.1) {
      issues.push({
        type: 'high_error_rate',
        description: `錯誤率達到 ${(report.performance.errorRate * 100).toFixed(1)}%，需要立即處理`,
        severity: 'high'
      });
    }

    if (report.performance.averagePageLoadTime > 5000) {
      issues.push({
        type: 'slow_page_load',
        description: `頁面載入時間超過 5 秒，嚴重影響用戶體驗`,
        severity: 'high'
      });
    }

    if (report.summary.averageCalculationTime > 2000) {
      issues.push({
        type: 'slow_calculation',
        description: `計算時間超過 2 秒，可能影響用戶滿意度`,
        severity: 'medium'
      });
    }

    return issues;
  }

  /**
   * Core Web Vitals 評級
   */
  private static rateCoreWebVital(metric: string, value: number): { value: number; rating: 'good' | 'needs-improvement' | 'poor' } {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    let rating: 'good' | 'needs-improvement' | 'poor';

    if (value <= threshold.good) {
      rating = 'good';
    } else if (value <= threshold.poor) {
      rating = 'needs-improvement';
    } else {
      rating = 'poor';
    }

    return { value, rating };
  }

  /**
   * 生成性能建議
   */
  private static generatePerformanceRecommendations(data: any): Array<{
    category: 'performance' | 'accessibility' | 'seo' | 'best-practices';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
  }> {
    const recommendations = [];

    if (data.lcp > 2500) {
      recommendations.push({
        category: 'performance' as const,
        title: '優化 Largest Contentful Paint (LCP)',
        description: '減少圖片大小、優化服務器響應時間、使用 CDN',
        impact: 'high' as const,
        effort: 'medium' as const
      });
    }

    if (data.fid > 100) {
      recommendations.push({
        category: 'performance' as const,
        title: '改善 First Input Delay (FID)',
        description: '減少 JavaScript 執行時間、使用 Web Workers、優化第三方腳本',
        impact: 'high' as const,
        effort: 'high' as const
      });
    }

    if (data.cls > 0.1) {
      recommendations.push({
        category: 'performance' as const,
        title: '減少 Cumulative Layout Shift (CLS)',
        description: '為圖片和廣告設定尺寸、避免動態插入內容',
        impact: 'medium' as const,
        effort: 'low' as const
      });
    }

    return recommendations;
  }

  /**
   * 生成模擬使用數據
   */
  private static generateMockUsageData(startDate: Date, endDate: Date) {
    return {
      uniqueUsers: Math.floor(Math.random() * 1000) + 500,
      totalSessions: Math.floor(Math.random() * 1500) + 800,
      bounceRate: Math.random() * 0.3 + 0.2,
      conversionRate: Math.random() * 0.1 + 0.05,
      averageLCP: Math.random() * 1000 + 2000,
      cumulativeLayoutShift: Math.random() * 0.2,
      topPages: [
        { path: '/salary', views: 450, percentage: 35.2 },
        { path: '/mortgage', views: 320, percentage: 25.1 },
        { path: '/tax', views: 280, percentage: 21.9 },
        { path: '/investment', views: 180, percentage: 14.1 },
        { path: '/', views: 50, percentage: 3.9 }
      ],
      commonUserFlows: [
        { flow: ['/', '/salary'], count: 120 },
        { flow: ['/salary', '/tax'], count: 85 },
        { flow: ['/mortgage', '/investment'], count: 65 }
      ],
      exitPages: [
        { path: '/salary', exits: 180, percentage: 40.0 },
        { path: '/mortgage', exits: 128, percentage: 28.4 },
        { path: '/tax', exits: 98, percentage: 21.8 }
      ]
    };
  }

  /**
   * 生成模擬計算器數據
   */
  private static generateMockCalculatorData(calculatorType: string, startDate: Date, endDate: Date) {
    return {
      usage: {
        totalUsage: Math.floor(Math.random() * 500) + 200,
        uniqueUsers: Math.floor(Math.random() * 300) + 150,
        averageCalculationTime: Math.random() * 500 + 200,
        completionRate: Math.random() * 0.2 + 0.8
      },
      inputs: {
        mostCommonValues: {
          monthlySalary: 50000,
          bonusMonths: 1,
          years: 30
        },
        valueRanges: {
          monthlySalary: { min: 25000, max: 150000, average: 55000 },
          bonusMonths: { min: 0, max: 3, average: 1.2 }
        },
        validationErrors: [
          { field: 'monthlySalary', error: '薪資不能為空', count: 15 },
          { field: 'years', error: '年限必須大於 0', count: 8 }
        ]
      },
      results: {
        resultRanges: {
          netSalary: { min: 20000, max: 120000, average: 45000 },
          totalTax: { min: 0, max: 25000, average: 8000 }
        },
        mostCommonResults: {
          netSalary: 45000,
          totalTax: 8000
        }
      },
      userBehavior: {
        averageTimeOnPage: Math.random() * 120 + 60,
        shareRate: Math.random() * 0.1 + 0.02,
        saveRate: Math.random() * 0.15 + 0.05,
        returnRate: Math.random() * 0.3 + 0.1
      },
      performance: {
        averageCalculationTime: Math.random() * 300 + 100,
        errorRate: Math.random() * 0.02,
        timeoutRate: Math.random() * 0.005
      }
    };
  }

  /**
   * 生成模擬性能數據
   */
  private static generateMockPerformanceData(startDate: Date, endDate: Date) {
    return {
      lcp: Math.random() * 2000 + 1500,
      fid: Math.random() * 200 + 50,
      cls: Math.random() * 0.3,
      averageTTI: Math.random() * 3000 + 2000,
      averageTTFB: Math.random() * 500 + 200,
      resourceMetrics: {
        totalResourceSize: Math.random() * 2000 + 1000,
        averageResourceLoadTime: Math.random() * 1000 + 500,
        slowestResources: [
          { url: '/images/hero.jpg', loadTime: 1200, size: 450 },
          { url: '/js/bundle.js', loadTime: 800, size: 320 },
          { url: '/css/styles.css', loadTime: 300, size: 85 }
        ]
      },
      totalErrors: Math.floor(Math.random() * 50) + 10,
      commonErrors: [
        { type: 'TypeError', message: 'Cannot read property of undefined', count: 15 },
        { type: 'ReferenceError', message: 'Variable is not defined', count: 8 },
        { type: 'NetworkError', message: 'Failed to fetch', count: 5 }
      ]
    };
  }
}

/**
 * 報告導出功能
 */
export class ReportExporter {
  /**
   * 導出為 JSON
   */
  static exportToJSON(report: any): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * 導出為 CSV
   */
  static exportToCSV(data: Array<Record<string, any>>): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }

  /**
   * 生成報告摘要
   */
  static generateSummary(report: UsageReport): string {
    const { period, summary, calculators, performance } = report;
    const duration = Math.ceil(period.duration / (1000 * 60 * 60 * 24));

    return `
TaiCalc 使用報告摘要
報告期間：${period.start.toLocaleDateString()} - ${period.end.toLocaleDateString()} (${duration} 天)

總體統計：
- 總事件數：${summary.totalEvents.toLocaleString()}
- 獨立用戶：${summary.uniqueUsers.toLocaleString()}
- 總會話數：${summary.totalSessions.toLocaleString()}
- 平均會話時長：${Math.round(summary.averageSessionDuration / 1000)} 秒
- 跳出率：${(summary.bounceRate * 100).toFixed(1)}%

計算器使用：
- 總計算次數：${calculators.totalCalculations.toLocaleString()}
- 平均計算時間：${Math.round(calculators.averageCalculationTime)} 毫秒
- 轉換率：${(calculators.conversionRate * 100).toFixed(1)}%
- 最受歡迎：${calculators.mostPopular[0]?.name || 'N/A'}

性能指標：
- 平均頁面載入時間：${Math.round(performance.averagePageLoadTime)} 毫秒
- 平均首次內容繪製：${Math.round(performance.averageFCP)} 毫秒
- 錯誤率：${(performance.errorRate * 100).toFixed(2)}%

建議改進：
${report.insights.recommendations.map(rec => `- ${rec}`).join('\n')}
    `.trim();
  }
}