'use client';

import { useState, useCallback } from 'react';
import { bundleAnalyzer, BundleReport } from '@/lib/performance/bundle-analyzer';

interface UseBundleAnalyzerReturn {
  report: BundleReport | null;
  loading: boolean;
  error: string | null;
  analyze: () => Promise<void>;
  clearError: () => void;
}

/**
 * Bundle Analyzer Hook
 * 管理 bundle 分析的狀態和操作
 */
export function useBundleAnalyzer(): UseBundleAnalyzerReturn {
  const [report, setReport] = useState<BundleReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const bundleReport = await bundleAnalyzer.analyzeBundle();
      setReport(bundleReport);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '分析 bundle 時發生未知錯誤';
      setError(errorMessage);
      console.error('Bundle 分析錯誤:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    report,
    loading,
    error,
    analyze,
    clearError
  };
}