/**
 * 分析數據收集管理器
 * 
 * 提供 Google Analytics 4 和自訂事件追蹤功能
 */

// 事件類型定義
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// 計算器使用事件
export interface CalculatorUsageEvent extends AnalyticsEvent {
  calculator_type: string;
  input_values: Record<string, any>;
  result_values: Record<string, any>;
  calculation_time: number;
}

// 用戶行為事件
export interface UserBehaviorEvent extends AnalyticsEvent {
  page_path: string;
  user_agent: string;
  session_id: string;
  timestamp: number;
}

// 性能指標事件
export interface PerformanceEvent extends AnalyticsEvent {
  metric_name: string;
  metric_value: number;
  page_path: string;
  connection_type?: string;
}

// 錯誤事件
export interface ErrorEvent extends AnalyticsEvent {
  error_type: string;
  error_message: string;
  stack_trace?: string;
  page_path: string;
  user_agent: string;
}

/**
 * Google Analytics 4 管理器
 */
export class GA4Manager {
  private isInitialized = false;
  private measurementId: string | null = null;

  constructor() {
    this.measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined' || !this.measurementId) {
      return;
    }

    // 檢查 gtag 是否已載入
    if (typeof window.gtag !== 'undefined') {
      this.isInitialized = true;
      return;
    }

    // 等待 gtag 載入
    const checkGtag = () => {
      if (typeof window.gtag !== 'undefined') {
        this.isInitialized = true;
        this.configureGA4();
      } else {
        setTimeout(checkGtag, 100);
      }
    };

    checkGtag();
  }

  private configureGA4() {
    if (!this.isInitialized || !this.measurementId) return;

    // 配置 GA4 基本設定
    window.gtag('config', this.measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: 'SameSite=Strict;Secure',
      cookie_expires: 60 * 60 * 24 * 30 // 30 天
    });
  }

  /**
   * 發送自訂事件到 GA4
   */
  trackEvent(event: AnalyticsEvent) {
    if (!this.isInitialized || typeof window.gtag === 'undefined') {
      console.warn('GA4 not initialized, event not sent:', event);
      return;
    }

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });
  }

  /**
   * 追蹤頁面瀏覽
   */
  trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.isInitialized || typeof window.gtag === 'undefined') {
      return;
    }

    window.gtag('config', this.measurementId!, {
      page_path: pagePath,
      page_title: pageTitle
    });
  }

  /**
   * 設定用戶屬性
   */
  setUserProperties(properties: Record<string, any>) {
    if (!this.isInitialized || typeof window.gtag === 'undefined') {
      return;
    }

    window.gtag('config', this.measurementId!, {
      custom_map: properties
    });
  }
}

/**
 * 自訂事件追蹤管理器
 */
export class CustomEventTracker {
  private events: AnalyticsEvent[] = [];
  private maxEvents = 1000;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupPerformanceTracking();
    this.setupErrorTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 追蹤計算器使用
   */
  trackCalculatorUsage(calculatorType: string, inputValues: Record<string, any>, resultValues: Record<string, any>, calculationTime: number) {
    const event: CalculatorUsageEvent = {
      action: 'calculator_usage',
      category: 'calculator',
      label: calculatorType,
      calculator_type: calculatorType,
      input_values: this.sanitizeValues(inputValues),
      result_values: this.sanitizeValues(resultValues),
      calculation_time: calculationTime,
      custom_parameters: {
        session_id: this.sessionId,
        timestamp: Date.now()
      }
    };

    this.addEvent(event);
    this.sendToGA4(event);
  }

  /**
   * 追蹤用戶行為
   */
  trackUserBehavior(action: string, category: string, label?: string, customParams?: Record<string, any>) {
    const event: UserBehaviorEvent = {
      action,
      category,
      label,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      session_id: this.sessionId,
      timestamp: Date.now(),
      custom_parameters: customParams
    };

    this.addEvent(event);
    this.sendToGA4(event);
  }

  /**
   * 追蹤性能指標
   */
  trackPerformance(metricName: string, metricValue: number, customParams?: Record<string, any>) {
    const event: PerformanceEvent = {
      action: 'performance_metric',
      category: 'performance',
      label: metricName,
      value: metricValue,
      metric_name: metricName,
      metric_value: metricValue,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      connection_type: this.getConnectionType(),
      custom_parameters: {
        session_id: this.sessionId,
        timestamp: Date.now(),
        ...customParams
      }
    };

    this.addEvent(event);
    this.sendToGA4(event);
  }

  /**
   * 追蹤錯誤
   */
  trackError(errorType: string, errorMessage: string, stackTrace?: string, customParams?: Record<string, any>) {
    const event: ErrorEvent = {
      action: 'error_occurred',
      category: 'error',
      label: errorType,
      error_type: errorType,
      error_message: errorMessage,
      stack_trace: stackTrace,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      custom_parameters: {
        session_id: this.sessionId,
        timestamp: Date.now(),
        ...customParams
      }
    };

    this.addEvent(event);
    this.sendToGA4(event);
  }

  /**
   * 設定自動性能追蹤
   */
  private setupPerformanceTracking() {
    if (typeof window === 'undefined') return;

    // 追蹤頁面載入時間
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
          this.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
          this.trackPerformance('first_contentful_paint', this.getFirstContentfulPaint());
        }
      }, 0);
    });

    // 追蹤 Core Web Vitals
    this.trackCoreWebVitals();
  }

  /**
   * 設定自動錯誤追蹤
   */
  private setupErrorTracking() {
    if (typeof window === 'undefined') return;

    // JavaScript 錯誤
    window.addEventListener('error', (event) => {
      this.trackError(
        'javascript_error',
        event.message,
        event.error?.stack,
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      );
    });

    // Promise 拒絕錯誤
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        'unhandled_promise_rejection',
        event.reason?.message || String(event.reason),
        event.reason?.stack
      );
    });
  }

  /**
   * 追蹤 Core Web Vitals
   */
  private trackCoreWebVitals() {
    if (typeof window === 'undefined') return;

    // 使用 web-vitals 庫的簡化版本
    try {
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackPerformance('largest_contentful_paint', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.trackPerformance('first_input_delay', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.trackPerformance('cumulative_layout_shift', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Core Web Vitals tracking not supported:', error);
    }
  }

  /**
   * 獲取 First Contentful Paint
   */
  private getFirstContentfulPaint(): number {
    try {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      return fcpEntry ? fcpEntry.startTime : 0;
    } catch {
      return 0;
    }
  }

  /**
   * 獲取連線類型
   */
  private getConnectionType(): string {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  /**
   * 清理敏感數據
   */
  private sanitizeValues(values: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(values)) {
      // 移除可能的敏感信息
      if (typeof value === 'string' && value.length > 100) {
        sanitized[key] = '[長字串已截斷]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = '[物件]';
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * 添加事件到本地存儲
   */
  private addEvent(event: AnalyticsEvent) {
    this.events.push(event);
    
    // 限制事件數量
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  /**
   * 發送事件到 GA4
   */
  private sendToGA4(event: AnalyticsEvent) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }
  }

  /**
   * 獲取事件統計
   */
  getEventStats(): {
    totalEvents: number;
    eventsByCategory: Record<string, number>;
    eventsByAction: Record<string, number>;
    sessionId: string;
  } {
    const eventsByCategory: Record<string, number> = {};
    const eventsByAction: Record<string, number> = {};

    this.events.forEach(event => {
      eventsByCategory[event.category] = (eventsByCategory[event.category] || 0) + 1;
      eventsByAction[event.action] = (eventsByAction[event.action] || 0) + 1;
    });

    return {
      totalEvents: this.events.length,
      eventsByCategory,
      eventsByAction,
      sessionId: this.sessionId
    };
  }

  /**
   * 生成使用報告
   */
  generateUsageReport(): {
    summary: {
      totalEvents: number;
      sessionDuration: number;
      mostUsedCalculators: Array<{ calculator: string; count: number }>;
      averageCalculationTime: number;
    };
    performance: {
      averagePageLoadTime: number;
      averageFCP: number;
      errorRate: number;
    };
    userBehavior: {
      mostCommonActions: Array<{ action: string; count: number }>;
      sessionPath: string[];
    };
  } {
    const calculatorEvents = this.events.filter(e => e.action === 'calculator_usage') as CalculatorUsageEvent[];
    const performanceEvents = this.events.filter(e => e.category === 'performance') as PerformanceEvent[];
    const errorEvents = this.events.filter(e => e.category === 'error');
    const behaviorEvents = this.events.filter(e => e.category !== 'calculator' && e.category !== 'performance' && e.category !== 'error') as UserBehaviorEvent[];

    // 計算器使用統計
    const calculatorStats: Record<string, number> = {};
    let totalCalculationTime = 0;

    calculatorEvents.forEach(event => {
      calculatorStats[event.calculator_type] = (calculatorStats[event.calculator_type] || 0) + 1;
      totalCalculationTime += event.calculation_time;
    });

    const mostUsedCalculators = Object.entries(calculatorStats)
      .map(([calculator, count]) => ({ calculator, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 性能統計
    const pageLoadTimes = performanceEvents.filter(e => e.metric_name === 'page_load_time').map(e => e.metric_value);
    const fcpTimes = performanceEvents.filter(e => e.metric_name === 'first_contentful_paint').map(e => e.metric_value);

    // 用戶行為統計
    const actionStats: Record<string, number> = {};
    const sessionPath: string[] = [];

    behaviorEvents.forEach(event => {
      actionStats[event.action] = (actionStats[event.action] || 0) + 1;
      if (event.page_path && !sessionPath.includes(event.page_path)) {
        sessionPath.push(event.page_path);
      }
    });

    const mostCommonActions = Object.entries(actionStats)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      summary: {
        totalEvents: this.events.length,
        sessionDuration: Date.now() - parseInt(this.sessionId.split('_')[1]),
        mostUsedCalculators,
        averageCalculationTime: calculatorEvents.length > 0 ? totalCalculationTime / calculatorEvents.length : 0
      },
      performance: {
        averagePageLoadTime: pageLoadTimes.length > 0 ? pageLoadTimes.reduce((a, b) => a + b, 0) / pageLoadTimes.length : 0,
        averageFCP: fcpTimes.length > 0 ? fcpTimes.reduce((a, b) => a + b, 0) / fcpTimes.length : 0,
        errorRate: this.events.length > 0 ? errorEvents.length / this.events.length : 0
      },
      userBehavior: {
        mostCommonActions,
        sessionPath
      }
    };
  }
}

// 全域分析管理器實例
let analyticsManager: {
  ga4: GA4Manager;
  customTracker: CustomEventTracker;
} | null = null;

/**
 * 獲取分析管理器實例
 */
export function getAnalyticsManager() {
  if (!analyticsManager) {
    analyticsManager = {
      ga4: new GA4Manager(),
      customTracker: new CustomEventTracker()
    };
  }
  return analyticsManager;
}

/**
 * 便捷的追蹤函數
 */
export const analytics = {
  // 追蹤計算器使用
  trackCalculator: (calculatorType: string, inputValues: Record<string, any>, resultValues: Record<string, any>, calculationTime: number) => {
    const manager = getAnalyticsManager();
    manager.customTracker.trackCalculatorUsage(calculatorType, inputValues, resultValues, calculationTime);
  },

  // 追蹤用戶行為
  trackAction: (action: string, category: string, label?: string, customParams?: Record<string, any>) => {
    const manager = getAnalyticsManager();
    manager.customTracker.trackUserBehavior(action, category, label, customParams);
  },

  // 追蹤頁面瀏覽
  trackPageView: (pagePath: string, pageTitle?: string) => {
    const manager = getAnalyticsManager();
    manager.ga4.trackPageView(pagePath, pageTitle);
  },

  // 追蹤性能
  trackPerformance: (metricName: string, metricValue: number, customParams?: Record<string, any>) => {
    const manager = getAnalyticsManager();
    manager.customTracker.trackPerformance(metricName, metricValue, customParams);
  },

  // 追蹤錯誤
  trackError: (errorType: string, errorMessage: string, stackTrace?: string, customParams?: Record<string, any>) => {
    const manager = getAnalyticsManager();
    manager.customTracker.trackError(errorType, errorMessage, stackTrace, customParams);
  },

  // 獲取使用報告
  getUsageReport: () => {
    const manager = getAnalyticsManager();
    return manager.customTracker.generateUsageReport();
  }
};

// 擴展 Window 介面以支援 gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}