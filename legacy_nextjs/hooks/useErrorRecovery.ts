'use client';

import { useState, useCallback, useEffect } from 'react';
import { errorRecoveryManager, SystemError, UserError, RecoveryResult, RecoverySteps } from '@/lib/error-recovery/ErrorRecoveryManager';

interface UseErrorRecoveryOptions {
  autoRecover?: boolean;
  maxRetries?: number;
  onError?: (error: Error) => void;
  onRecovery?: (result: RecoveryResult) => void;
}

interface UseErrorRecoveryReturn {
  error: Error | null;
  isRecovering: boolean;
  recoveryResult: RecoveryResult | null;
  recoverySteps: RecoverySteps | null;
  retryCount: number;
  recover: () => Promise<void>;
  clearError: () => void;
  reportError: (error: Error) => void;
  getErrorStats: () => any;
}

/**
 * 錯誤恢復 Hook
 * 提供錯誤處理、自動恢復和用戶引導功能
 */
export function useErrorRecovery(options: UseErrorRecoveryOptions = {}): UseErrorRecoveryReturn {
  const {
    autoRecover = true,
    maxRetries = 3,
    onError,
    onRecovery
  } = options;

  const [error, setError] = useState<Error | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<RecoveryResult | null>(null);
  const [recoverySteps, setRecoverySteps] = useState<RecoverySteps | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * 處理錯誤
   */
  const handleError = useCallback(async (newError: Error) => {
    setError(newError);
    setRecoveryResult(null);
    setRecoverySteps(null);

    // 調用外部錯誤處理器
    onError?.(newError);

    // 報告錯誤
    errorRecoveryManager.reportAndLearn(newError);

    // 如果啟用自動恢復且未超過重試次數
    if (autoRecover && retryCount < maxRetries) {
      setIsRecovering(true);
      
      try {
        const result = await errorRecoveryManager.autoRecover(newError as SystemError);
        setRecoveryResult(result);
        
        if (result.success) {
          // 自動恢復成功
          onRecovery?.(result);
          
          // 如果需要延遲重試
          if (result.retryAfter) {
            setTimeout(() => {
              setError(null);
              setRetryCount(0);
            }, result.retryAfter);
          } else {
            setError(null);
            setRetryCount(0);
          }
        } else {
          // 自動恢復失敗，提供用戶引導
          const steps = errorRecoveryManager.guideUserRecovery(newError as UserError);
          setRecoverySteps(steps);
        }
      } catch (recoveryError) {
        console.error('錯誤恢復失敗:', recoveryError);
        
        // 提供用戶引導作為降級方案
        const steps = errorRecoveryManager.guideUserRecovery(newError as UserError);
        setRecoverySteps(steps);
      } finally {
        setIsRecovering(false);
      }
    } else {
      // 不自動恢復或已達到最大重試次數，提供用戶引導
      const steps = errorRecoveryManager.guideUserRecovery(newError as UserError);
      setRecoverySteps(steps);
    }
  }, [autoRecover, maxRetries, retryCount, onError, onRecovery]);

  /**
   * 手動恢復
   */
  const recover = useCallback(async () => {
    if (!error) return;

    setIsRecovering(true);
    setRetryCount(prev => prev + 1);

    try {
      const result = await errorRecoveryManager.autoRecover(error as SystemError);
      setRecoveryResult(result);
      
      if (result.success) {
        onRecovery?.(result);
        setError(null);
        setRetryCount(0);
      }
    } catch (recoveryError) {
      console.error('手動恢復失敗:', recoveryError);
    } finally {
      setIsRecovering(false);
    }
  }, [error, onRecovery]);

  /**
   * 清除錯誤
   */
  const clearError = useCallback(() => {
    setError(null);
    setRecoveryResult(null);
    setRecoverySteps(null);
    setRetryCount(0);
  }, []);

  /**
   * 報告錯誤
   */
  const reportError = useCallback((newError: Error) => {
    handleError(newError);
  }, [handleError]);

  /**
   * 獲取錯誤統計
   */
  const getErrorStats = useCallback(() => {
    return errorRecoveryManager.getErrorStats();
  }, []);

  return {
    error,
    isRecovering,
    recoveryResult,
    recoverySteps,
    retryCount,
    recover,
    clearError,
    reportError,
    getErrorStats
  };
}

/**
 * 全域錯誤處理 Hook
 */
export function useGlobalErrorHandler() {
  const { reportError } = useErrorRecovery({ autoRecover: true });

  useEffect(() => {
    // 監聽未捕獲的錯誤
    const handleUnhandledError = (event: ErrorEvent) => {
      console.error('未捕獲的錯誤:', event.error);
      reportError(event.error || new Error(event.message));
    };

    // 監聽未處理的 Promise 拒絕
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('未處理的 Promise 拒絕:', event.reason);
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      reportError(error);
    };

    // 添加事件監聽器
    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // 清理函數
    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [reportError]);

  return { reportError };
}

/**
 * 特定功能的錯誤處理 Hook
 */
export function useFeatureErrorHandler(featureName: string) {
  const { error, isRecovering, recover, clearError, reportError } = useErrorRecovery();
  const [fallbackFeature, setFallbackFeature] = useState<any>(null);

  const handleFeatureError = useCallback((featureError: Error) => {
    reportError(featureError);
    
    // 嘗試獲取降級功能
    const fallback = errorRecoveryManager.provideFallback(featureName);
    if (fallback) {
      setFallbackFeature(fallback);
    }
  }, [featureName, reportError]);

  const clearFeatureError = useCallback(() => {
    clearError();
    setFallbackFeature(null);
  }, [clearError]);

  return {
    error,
    isRecovering,
    fallbackFeature,
    handleFeatureError,
    recover,
    clearError: clearFeatureError
  };
}