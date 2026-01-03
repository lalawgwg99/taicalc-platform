/**
 * 分析數據收集測試
 * 
 * 驗證分析數據收集系統的正確性和完整性
 * 
 * 屬性 8: Analytics Data Collection
 * 驗證: 需求 4.5, 8.1, 8.3
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fc from 'fast-check';
import { 
  GA4Manager, 
  CustomEventTracker, 
  getAnalyticsManager,
  analytics 
} from '@/lib/analytics/analytics-manager';
import { ReportGenerator, ReportExporter } from '@/lib/analytics/report-generator';

// Mock window.gtag
const mockGtag = jest.fn();
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => [])
  },
  writable: true
});

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

describe('分析數據收集測試', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 設定環境變數
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123456';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('屬性測試 - Analytics Data Collection', () => {
    test('**Feature: taicalc-optimization, Property 8: For any user interaction or system event, the performance monitor should collect appropriate anonymous usage data**', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('salary', 'mortgage', 'tax', 'investment'),
          fc.record({
            monthlySalary: fc.integer({ min: 20000, max: 200000 }),
            bonusMonths: fc.float({ min: 0, max: 5 })
          }),
          fc.record({
            monthlyNet: fc.integer({ min: 15000, max: 150000 }),
            yearlyNet: fc.integer({ min: 180000, max: 1800000 })
          }),
          fc.integer({ min: 50, max: 5000 }),
          (calculatorType, inputValues, resultValues, calculationTime) => {
            const manager = getAnalyticsManager();
            
            // 追蹤計算器使用
            manager.customTracker.trackCalculatorUsage(
              calculatorType,
              inputValues,
              resultValues,
              calculationTime
            );
            
            // 驗證事件統計
            const stats = manager.customTracker.getEventStats();
            expect(stats.totalEvents).toBeGreaterThan(0);
            expect(stats.eventsByCategory['calculator']).toBeGreaterThan(0);
            expect(stats.eventsByAction['calculator_usage']).toBeGreaterThan(0);
            expect(stats.sessionId).toBeDefined();
            expect(stats.sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
            
            // 驗證使用報告生成
            const report = manager.customTracker.generateUsageReport();
            expect(report.summary.totalEvents).toBeGreaterThan(0);
            expect(report.summary.sessionDuration).toBeGreaterThan(0);
            expect(report.summary.mostUsedCalculators).toBeDefined();
            expect(Array.isArray(report.summary.mostUsedCalculators)).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('**Feature: taicalc-optimization, Property 8a: For any performance metric, the system should track and store measurement data**', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('page_load_time', 'first_contentful_paint', 'largest_contentful_paint', 'cumulative_layout_shift'),
          fc.float({ min: 0, max: 10000 }),
          fc.constantFrom('/salary', '/mortgage', '/tax', '/investment'),
          (metricName, metricValue, pagePath) => {
            const manager = getAnalyticsManager();
            
            // 追蹤性能指標
            manager.customTracker.trackPerformance(metricName, metricValue, {
              page_path: pagePath
            });
            
            // 驗證事件記錄
            const stats = manager.customTracker.getEventStats();
            expect(stats.eventsByCategory['performance']).toBeGreaterThan(0);
            expect(stats.eventsByAction['performance_metric']).toBeGreaterThan(0);
            
            // 驗證報告中包含性能數據
            const report = manager.customTracker.generateUsageReport();
            expect(report.performance).toBeDefined();
            expect(typeof report.performance.averagePageLoadTime).toBe('number');
            expect(typeof report.performance.averageFCP).toBe('number');
            expect(typeof report.performance.errorRate).toBe('number');
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('**Feature: taicalc-optimization, Property 8b: For any error occurrence, the system should log error information for analysis**', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('javascript_error', 'network_error', 'validation_error', 'calculation_error'),
          fc.string({ minLength: 10, maxLength: 100 }),
          fc.option(fc.string({ minLength: 50, maxLength: 500 })),
          (errorType, errorMessage, stackTrace) => {
            const manager = getAnalyticsManager();
            
            // 追蹤錯誤
            manager.customTracker.trackError(errorType, errorMessage, stackTrace || undefined);
            
            // 驗證錯誤事件記錄
            const stats = manager.customTracker.getEventStats();
            expect(stats.eventsByCategory['error']).toBeGreaterThan(0);
            expect(stats.eventsByAction['error_occurred']).toBeGreaterThan(0);
            
            // 驗證報告中包含錯誤數據
            const report = manager.customTracker.generateUsageReport();
            expect(report.performance.errorRate).toBeGreaterThanOrEqual(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('**Feature: taicalc-optimization, Property 8c: For any user behavior event, the system should collect anonymous behavioral data**', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('button_click', 'form_submit', 'link_click', 'search', 'share'),
          fc.constantFrom('interaction', 'navigation', 'search', 'social'),
          fc.option(fc.string({ minLength: 5, maxLength: 50 })),
          (action, category, label) => {
            const manager = getAnalyticsManager();
            
            // 追蹤用戶行為
            manager.customTracker.trackUserBehavior(action, category, label || undefined);
            
            // 驗證行為事件記錄
            const stats = manager.customTracker.getEventStats();
            expect(stats.totalEvents).toBeGreaterThan(0);
            expect(stats.eventsByAction[action]).toBeGreaterThan(0);
            
            // 驗證報告中包含用戶行為數據
            const report = manager.customTracker.generateUsageReport();
            expect(report.userBehavior).toBeDefined();
            expect(Array.isArray(report.userBehavior.mostCommonActions)).toBe(true);
            expect(Array.isArray(report.userBehavior.sessionPath)).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('單元測試 - GA4 管理器', () => {
    test('GA4 管理器初始化', () => {
      const ga4Manager = new GA4Manager();
      expect(ga4Manager).toBeDefined();
    });

    test('GA4 事件追蹤', () => {
      const ga4Manager = new GA4Manager();
      
      const testEvent = {
        action: 'test_action',
        category: 'test_category',
        label: 'test_label',
        value: 100
      };
      
      // 模擬 gtag 已載入
      ga4Manager['isInitialized'] = true;
      
      expect(() => {
        ga4Manager.trackEvent(testEvent);
      }).not.toThrow();
    });

    test('GA4 頁面瀏覽追蹤', () => {
      const ga4Manager = new GA4Manager();
      ga4Manager['isInitialized'] = true;
      
      expect(() => {
        ga4Manager.trackPageView('/test-page', 'Test Page');
      }).not.toThrow();
    });

    test('GA4 用戶屬性設定', () => {
      const ga4Manager = new GA4Manager();
      ga4Manager['isInitialized'] = true;
      
      const userProperties = {
        user_type: 'premium',
        preferred_calculator: 'salary'
      };
      
      expect(() => {
        ga4Manager.setUserProperties(userProperties);
      }).not.toThrow();
    });
  });

  describe('單元測試 - 自訂事件追蹤器', () => {
    test('自訂事件追蹤器初始化', () => {
      const tracker = new CustomEventTracker();
      expect(tracker).toBeDefined();
      
      const stats = tracker.getEventStats();
      expect(stats.sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(stats.totalEvents).toBe(0);
    });

    test('計算器使用追蹤', () => {
      const tracker = new CustomEventTracker();
      
      const inputValues = { monthlySalary: 50000, bonusMonths: 1 };
      const resultValues = { monthlyNet: 42000, yearlyNet: 504000 };
      
      tracker.trackCalculatorUsage('salary', inputValues, resultValues, 250);
      
      const stats = tracker.getEventStats();
      expect(stats.totalEvents).toBe(1);
      expect(stats.eventsByCategory['calculator']).toBe(1);
      expect(stats.eventsByAction['calculator_usage']).toBe(1);
    });

    test('用戶行為追蹤', () => {
      const tracker = new CustomEventTracker();
      
      tracker.trackUserBehavior('button_click', 'interaction', 'calculate_button');
      
      const stats = tracker.getEventStats();
      expect(stats.totalEvents).toBe(1);
      expect(stats.eventsByAction['button_click']).toBe(1);
    });

    test('性能指標追蹤', () => {
      const tracker = new CustomEventTracker();
      
      tracker.trackPerformance('page_load_time', 1500);
      
      const stats = tracker.getEventStats();
      expect(stats.totalEvents).toBe(1);
      expect(stats.eventsByCategory['performance']).toBe(1);
    });

    test('錯誤追蹤', () => {
      const tracker = new CustomEventTracker();
      
      tracker.trackError('javascript_error', 'Test error message', 'Error stack trace');
      
      const stats = tracker.getEventStats();
      expect(stats.totalEvents).toBe(1);
      expect(stats.eventsByCategory['error']).toBe(1);
    });

    test('事件數量限制', () => {
      const tracker = new CustomEventTracker();
      tracker['maxEvents'] = 5; // 設定較小的限制用於測試
      
      // 添加超過限制的事件
      for (let i = 0; i < 10; i++) {
        tracker.trackUserBehavior(`action_${i}`, 'test', `label_${i}`);
      }
      
      const stats = tracker.getEventStats();
      expect(stats.totalEvents).toBe(5); // 應該被限制在 5 個事件
    });
  });

  describe('單元測試 - 報告生成器', () => {
    test('使用報告生成', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      
      const report = ReportGenerator.generateUsageReport(startDate, endDate);
      
      expect(report.period.start).toEqual(startDate);
      expect(report.period.end).toEqual(endDate);
      expect(report.period.duration).toBeGreaterThan(0);
      
      expect(report.summary).toBeDefined();
      expect(typeof report.summary.totalEvents).toBe('number');
      expect(typeof report.summary.uniqueUsers).toBe('number');
      expect(typeof report.summary.totalSessions).toBe('number');
      
      expect(report.calculators).toBeDefined();
      expect(Array.isArray(report.calculators.mostPopular)).toBe(true);
      
      expect(report.performance).toBeDefined();
      expect(typeof report.performance.averagePageLoadTime).toBe('number');
      expect(typeof report.performance.errorRate).toBe('number');
      
      expect(report.userBehavior).toBeDefined();
      expect(Array.isArray(report.userBehavior.topPages)).toBe(true);
      
      expect(report.insights).toBeDefined();
      expect(Array.isArray(report.insights.recommendations)).toBe(true);
      expect(Array.isArray(report.insights.trends)).toBe(true);
      expect(Array.isArray(report.insights.issues)).toBe(true);
    });

    test('計算器專用報告生成', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      
      const report = ReportGenerator.generateCalculatorReport('salary', startDate, endDate);
      
      expect(report.calculatorType).toBe('salary');
      expect(report.period.start).toEqual(startDate);
      expect(report.period.end).toEqual(endDate);
      
      expect(report.usage).toBeDefined();
      expect(typeof report.usage.totalUsage).toBe('number');
      expect(typeof report.usage.completionRate).toBe('number');
      
      expect(report.inputs).toBeDefined();
      expect(typeof report.inputs.mostCommonValues).toBe('object');
      expect(Array.isArray(report.inputs.validationErrors)).toBe(true);
      
      expect(report.results).toBeDefined();
      expect(typeof report.results.resultRanges).toBe('object');
      
      expect(report.userBehavior).toBeDefined();
      expect(typeof report.userBehavior.shareRate).toBe('number');
      
      expect(report.performance).toBeDefined();
      expect(typeof report.performance.errorRate).toBe('number');
    });

    test('性能報告生成', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      
      const report = ReportGenerator.generatePerformanceReport(startDate, endDate);
      
      expect(report.period.start).toEqual(startDate);
      expect(report.period.end).toEqual(endDate);
      
      expect(report.coreWebVitals).toBeDefined();
      expect(report.coreWebVitals.lcp).toBeDefined();
      expect(report.coreWebVitals.fid).toBeDefined();
      expect(report.coreWebVitals.cls).toBeDefined();
      
      expect(['good', 'needs-improvement', 'poor']).toContain(report.coreWebVitals.lcp.rating);
      expect(['good', 'needs-improvement', 'poor']).toContain(report.coreWebVitals.fid.rating);
      expect(['good', 'needs-improvement', 'poor']).toContain(report.coreWebVitals.cls.rating);
      
      expect(report.pageMetrics).toBeDefined();
      expect(typeof report.pageMetrics.averageLoadTime).toBe('number');
      
      expect(report.resourceMetrics).toBeDefined();
      expect(typeof report.resourceMetrics.totalResourceSize).toBe('number');
      
      expect(report.errorMetrics).toBeDefined();
      expect(typeof report.errorMetrics.errorRate).toBe('number');
      
      expect(Array.isArray(report.recommendations)).toBe(true);
    });
  });

  describe('單元測試 - 報告導出器', () => {
    test('JSON 導出', () => {
      const testData = { test: 'data', number: 123, array: [1, 2, 3] };
      const jsonString = ReportExporter.exportToJSON(testData);
      
      expect(typeof jsonString).toBe('string');
      expect(() => JSON.parse(jsonString)).not.toThrow();
      
      const parsed = JSON.parse(jsonString);
      expect(parsed).toEqual(testData);
    });

    test('CSV 導出', () => {
      const testData = [
        { name: 'Calculator A', usage: 100, percentage: 50.0 },
        { name: 'Calculator B', usage: 80, percentage: 40.0 },
        { name: 'Calculator C', usage: 20, percentage: 10.0 }
      ];
      
      const csvString = ReportExporter.exportToCSV(testData);
      
      expect(typeof csvString).toBe('string');
      expect(csvString).toContain('name,usage,percentage');
      expect(csvString).toContain('"Calculator A",100,50');
      expect(csvString).toContain('"Calculator B",80,40');
      expect(csvString).toContain('"Calculator C",20,10');
    });

    test('空數據 CSV 導出', () => {
      const csvString = ReportExporter.exportToCSV([]);
      expect(csvString).toBe('');
    });

    test('報告摘要生成', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      const mockReport = ReportGenerator.generateUsageReport(startDate, endDate);
      
      const summary = ReportExporter.generateSummary(mockReport);
      
      expect(typeof summary).toBe('string');
      expect(summary).toContain('TaiCalc 使用報告摘要');
      expect(summary).toContain('總體統計');
      expect(summary).toContain('計算器使用');
      expect(summary).toContain('性能指標');
      expect(summary).toContain('建議改進');
    });
  });

  describe('邊界條件測試', () => {
    test('無效數據處理', () => {
      const tracker = new CustomEventTracker();
      
      // 測試空值和無效值
      expect(() => {
        tracker.trackCalculatorUsage('', {}, {}, 0);
      }).not.toThrow();
      
      expect(() => {
        tracker.trackUserBehavior('', '', '');
      }).not.toThrow();
      
      expect(() => {
        tracker.trackPerformance('', -1);
      }).not.toThrow();
      
      expect(() => {
        tracker.trackError('', '');
      }).not.toThrow();
    });

    test('大量數據處理', () => {
      const tracker = new CustomEventTracker();
      
      // 添加大量事件
      for (let i = 0; i < 1500; i++) {
        tracker.trackUserBehavior(`action_${i}`, 'test', `label_${i}`);
      }
      
      const stats = tracker.getEventStats();
      expect(stats.totalEvents).toBeLessThanOrEqual(1000); // 應該被限制
      
      // 報告生成應該仍然正常工作
      expect(() => {
        tracker.generateUsageReport();
      }).not.toThrow();
    });

    test('特殊字符處理', () => {
      const tracker = new CustomEventTracker();
      
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const unicodeChars = '中文測試🎉💻📊';
      
      expect(() => {
        tracker.trackUserBehavior(specialChars, unicodeChars, specialChars);
      }).not.toThrow();
      
      expect(() => {
        tracker.trackError(unicodeChars, specialChars);
      }).not.toThrow();
    });
  });

  describe('性能測試', () => {
    test('大量事件追蹤性能', () => {
      const tracker = new CustomEventTracker();
      const startTime = performance.now();
      
      // 追蹤 1000 個事件
      for (let i = 0; i < 1000; i++) {
        tracker.trackUserBehavior(`action_${i}`, 'performance_test', `label_${i}`);
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // 應該在合理時間內完成（1秒）
      expect(executionTime).toBeLessThan(1000);
    });

    test('報告生成性能', () => {
      const startTime = performance.now();
      
      // 生成多個報告
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      
      for (let i = 0; i < 10; i++) {
        ReportGenerator.generateUsageReport(startDate, endDate);
        ReportGenerator.generateCalculatorReport('salary', startDate, endDate);
        ReportGenerator.generatePerformanceReport(startDate, endDate);
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // 應該在合理時間內完成（2秒）
      expect(executionTime).toBeLessThan(2000);
    });
  });

  describe('整合測試', () => {
    test('完整分析流程', () => {
      // 模擬完整的用戶會話
      const tracker = new CustomEventTracker();
      
      // 1. 頁面載入
      tracker.trackPerformance('page_load_time', 1200);
      tracker.trackPerformance('first_contentful_paint', 800);
      
      // 2. 用戶互動
      tracker.trackUserBehavior('page_view', 'navigation', '/salary');
      tracker.trackUserBehavior('button_click', 'interaction', 'calculate_button');
      
      // 3. 計算器使用
      const inputValues = { monthlySalary: 60000, bonusMonths: 1.5 };
      const resultValues = { monthlyNet: 50000, yearlyNet: 600000 };
      tracker.trackCalculatorUsage('salary', inputValues, resultValues, 150);
      
      // 4. 結果操作
      tracker.trackUserBehavior('result_shared', 'social', 'line');
      tracker.trackUserBehavior('result_saved', 'interaction', 'save_button');
      
      // 5. 驗證完整流程
      const stats = tracker.getEventStats();
      expect(stats.totalEvents).toBe(7);
      expect(stats.eventsByCategory['performance']).toBe(2);
      expect(stats.eventsByCategory['calculator']).toBe(1);
      expect(stats.eventsByAction['page_view']).toBe(1);
      expect(stats.eventsByAction['calculator_usage']).toBe(1);
      
      // 6. 生成報告
      const report = tracker.generateUsageReport();
      expect(report.summary.totalEvents).toBe(7);
      expect(report.summary.mostUsedCalculators.length).toBeGreaterThan(0);
      expect(report.performance.averagePageLoadTime).toBeGreaterThan(0);
      expect(report.userBehavior.mostCommonActions.length).toBeGreaterThan(0);
    });
  });
});