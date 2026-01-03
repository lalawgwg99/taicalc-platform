/**
 * 分析數據收集 React Hook
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@/lib/analytics/analytics-manager';

/**
 * 使用分析追蹤的 Hook
 */
export function useAnalytics() {
  const pathname = usePathname();
  const lastPathname = useRef<string>('');

  // 追蹤頁面瀏覽
  useEffect(() => {
    if (pathname && pathname !== lastPathname.current) {
      analytics.trackPageView(pathname, document.title);
      lastPathname.current = pathname;
    }
  }, [pathname]);

  // 追蹤計算器使用
  const trackCalculatorUsage = useCallback((
    calculatorType: string,
    inputValues: Record<string, any>,
    resultValues: Record<string, any>,
    startTime?: number
  ) => {
    const calculationTime = startTime ? Date.now() - startTime : 0;
    analytics.trackCalculator(calculatorType, inputValues, resultValues, calculationTime);
  }, []);

  // 追蹤用戶行為
  const trackUserAction = useCallback((
    action: string,
    category: string,
    label?: string,
    customParams?: Record<string, any>
  ) => {
    analytics.trackAction(action, category, label, customParams);
  }, []);

  // 追蹤按鈕點擊
  const trackButtonClick = useCallback((buttonName: string, location?: string) => {
    analytics.trackAction('button_click', 'interaction', buttonName, {
      location: location || pathname,
      timestamp: Date.now()
    });
  }, [pathname]);

  // 追蹤表單提交
  const trackFormSubmit = useCallback((formName: string, formData?: Record<string, any>) => {
    analytics.trackAction('form_submit', 'interaction', formName, {
      form_data: formData,
      location: pathname,
      timestamp: Date.now()
    });
  }, [pathname]);

  // 追蹤連結點擊
  const trackLinkClick = useCallback((linkUrl: string, linkText?: string, isExternal?: boolean) => {
    analytics.trackAction('link_click', 'navigation', linkUrl, {
      link_text: linkText,
      is_external: isExternal,
      location: pathname,
      timestamp: Date.now()
    });
  }, [pathname]);

  // 追蹤搜尋
  const trackSearch = useCallback((searchTerm: string, searchCategory?: string, resultCount?: number) => {
    analytics.trackAction('search', 'search', searchTerm, {
      search_category: searchCategory,
      result_count: resultCount,
      location: pathname,
      timestamp: Date.now()
    });
  }, [pathname]);

  // 追蹤分享
  const trackShare = useCallback((platform: string, contentType: string, contentId?: string) => {
    analytics.trackAction('share', 'social', platform, {
      content_type: contentType,
      content_id: contentId,
      location: pathname,
      timestamp: Date.now()
    });
  }, [pathname]);

  // 追蹤下載
  const trackDownload = useCallback((fileName: string, fileType?: string, fileSize?: number) => {
    analytics.trackAction('download', 'file', fileName, {
      file_type: fileType,
      file_size: fileSize,
      location: pathname,
      timestamp: Date.now()
    });
  }, []);

  // 追蹤錯誤
  const trackError = useCallback((errorType: string, errorMessage: string, stackTrace?: string) => {
    analytics.trackError(errorType, errorMessage, stackTrace, {
      location: pathname,
      timestamp: Date.now()
    });
  }, [pathname]);

  return {
    trackCalculatorUsage,
    trackUserAction,
    trackButtonClick,
    trackFormSubmit,
    trackLinkClick,
    trackSearch,
    trackShare,
    trackDownload,
    trackError
  };
}

/**
 * 計算器專用分析 Hook
 */
export function useCalculatorAnalytics(calculatorType: string) {
  const { trackCalculatorUsage, trackUserAction, trackError } = useAnalytics();
  const calculationStartTime = useRef<number | null>(null);

  // 開始計算
  const startCalculation = useCallback((inputValues: Record<string, any>) => {
    calculationStartTime.current = Date.now();
    trackUserAction('calculation_started', 'calculator', calculatorType, {
      input_values: inputValues
    });
  }, [calculatorType, trackUserAction]);

  // 完成計算
  const completeCalculation = useCallback((
    inputValues: Record<string, any>,
    resultValues: Record<string, any>
  ) => {
    const startTime = calculationStartTime.current;
    calculationStartTime.current = null;
    
    trackCalculatorUsage(calculatorType, inputValues, resultValues, startTime || undefined);
    
    trackUserAction('calculation_completed', 'calculator', calculatorType, {
      calculation_time: startTime ? Date.now() - startTime : 0
    });
  }, [calculatorType, trackCalculatorUsage, trackUserAction]);

  // 計算失敗
  const failCalculation = useCallback((
    inputValues: Record<string, any>,
    errorMessage: string
  ) => {
    calculationStartTime.current = null;
    
    trackError('calculation_error', errorMessage);
    
    trackUserAction('calculation_failed', 'calculator', calculatorType, {
      input_values: inputValues,
      error_message: errorMessage
    });
  }, [calculatorType, trackUserAction, trackError]);

  // 重置計算
  const resetCalculation = useCallback(() => {
    calculationStartTime.current = null;
    trackUserAction('calculation_reset', 'calculator', calculatorType);
  }, [calculatorType, trackUserAction]);

  // 分享結果
  const shareResult = useCallback((platform: string, resultData: Record<string, any>) => {
    trackUserAction('result_shared', 'calculator', calculatorType, {
      platform,
      result_data: resultData
    });
  }, [calculatorType, trackUserAction]);

  // 保存結果
  const saveResult = useCallback((resultData: Record<string, any>) => {
    trackUserAction('result_saved', 'calculator', calculatorType, {
      result_data: resultData
    });
  }, [calculatorType, trackUserAction]);

  return {
    startCalculation,
    completeCalculation,
    failCalculation,
    resetCalculation,
    shareResult,
    saveResult
  };
}

/**
 * 性能監控 Hook
 */
export function usePerformanceTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // 追蹤頁面載入性能
    const trackPagePerformance = () => {
      if (typeof window === 'undefined') return;

      // 等待頁面完全載入
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          // 頁面載入時間
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;
          analytics.trackPerformance('page_load_time', loadTime, {
            page_path: pathname
          });

          // DOM 載入時間
          const domTime = navigation.domContentLoadedEventEnd - navigation.fetchStart;
          analytics.trackPerformance('dom_content_loaded_time', domTime, {
            page_path: pathname
          });

          // 首次內容繪製時間
          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            analytics.trackPerformance('first_contentful_paint', fcpEntry.startTime, {
              page_path: pathname
            });
          }
        }
      }, 0);
    };

    if (document.readyState === 'complete') {
      trackPagePerformance();
    } else {
      window.addEventListener('load', trackPagePerformance);
      return () => window.removeEventListener('load', trackPagePerformance);
    }
  }, [pathname]);

  // 追蹤自訂性能指標
  const trackCustomMetric = useCallback((metricName: string, metricValue: number, customParams?: Record<string, any>) => {
    analytics.trackPerformance(metricName, metricValue, {
      page_path: pathname,
      ...customParams
    });
  }, [pathname]);

  return {
    trackCustomMetric
  };
}

/**
 * 錯誤追蹤 Hook
 */
export function useErrorTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // 追蹤 React 錯誤邊界錯誤
    const handleReactError = (error: Error, errorInfo: any) => {
      analytics.trackError('react_error', error.message, error.stack, {
        component_stack: errorInfo.componentStack,
        page_path: pathname
      });
    };

    // 這裡可以與 React 錯誤邊界整合
    // 實際實作需要在錯誤邊界組件中調用

    return () => {
      // 清理
    };
  }, [pathname]);

  // 手動追蹤錯誤
  const trackCustomError = useCallback((errorType: string, errorMessage: string, stackTrace?: string, customParams?: Record<string, any>) => {
    analytics.trackError(errorType, errorMessage, stackTrace, {
      page_path: pathname,
      ...customParams
    });
  }, [pathname]);

  return {
    trackCustomError
  };
}