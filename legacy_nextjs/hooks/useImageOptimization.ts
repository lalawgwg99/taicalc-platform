'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { imageOptimizer } from '@/lib/image-optimization/ImageOptimizer';
import { ImageAsset, OptimizedImage, LazyLoadOptions } from '@/lib/image-optimization/types';

interface UseImageOptimizationOptions {
  lazyLoad?: boolean;
  lazyLoadOptions?: LazyLoadOptions;
  quality?: number;
}

interface UseImageOptimizationReturn {
  optimizedImages: OptimizedImage[];
  isLoading: boolean;
  error: string | null;
  optimizeImages: (images: ImageAsset[]) => void;
  enableLazyLoading: (container: HTMLElement) => void;
  clearError: () => void;
}

/**
 * 圖片優化 Hook
 * 提供圖片優化、延遲載入和錯誤處理功能
 */
export function useImageOptimization(
  options: UseImageOptimizationOptions = {}
): UseImageOptimizationReturn {
  const [optimizedImages, setOptimizedImages] = useState<OptimizedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    lazyLoad = true,
    lazyLoadOptions = {},
    quality = 85
  } = options;

  /**
   * 優化圖片陣列
   */
  const optimizeImages = useCallback((images: ImageAsset[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // 為每張圖片設定預設品質
      const imagesWithQuality = images.map(img => ({
        ...img,
        quality: img.quality || quality
      }));

      const optimized = imageOptimizer.optimizeImages(imagesWithQuality);
      setOptimizedImages(optimized);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '圖片優化失敗';
      setError(errorMessage);
      console.error('圖片優化錯誤:', err);
    } finally {
      setIsLoading(false);
    }
  }, [quality]);

  /**
   * 啟用延遲載入
   */
  const enableLazyLoading = useCallback((container: HTMLElement) => {
    if (!lazyLoad) return;

    try {
      imageOptimizer.lazyLoadImages(container, lazyLoadOptions);
    } catch (err) {
      console.error('延遲載入設定失敗:', err);
      setError('延遲載入功能無法啟用');
    }
  }, [lazyLoad, lazyLoadOptions]);

  /**
   * 清除錯誤
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 清理資源
   */
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      imageOptimizer.destroy();
    };
  }, []);

  return {
    optimizedImages,
    isLoading,
    error,
    optimizeImages,
    enableLazyLoading,
    clearError
  };
}

/**
 * 單張圖片優化 Hook
 */
export function useSingleImageOptimization(
  image: ImageAsset | null,
  options: UseImageOptimizationOptions = {}
) {
  const {
    optimizedImages,
    isLoading,
    error,
    optimizeImages,
    enableLazyLoading,
    clearError
  } = useImageOptimization(options);

  useEffect(() => {
    if (image) {
      optimizeImages([image]);
    }
  }, [image, optimizeImages]);

  return {
    optimizedImage: optimizedImages[0] || null,
    isLoading,
    error,
    enableLazyLoading,
    clearError
  };
}

/**
 * 響應式圖片 Hook
 */
export function useResponsiveImage(src: string) {
  const [responsiveSet, setResponsiveSet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setError(null);

    try {
      const responsive = imageOptimizer.generateResponsiveImages(src);
      setResponsiveSet(responsive);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '響應式圖片生成失敗';
      setError(errorMessage);
      console.error('響應式圖片錯誤:', err);
    } finally {
      setIsLoading(false);
    }
  }, [src]);

  return {
    responsiveSet,
    isLoading,
    error
  };
}

/**
 * 圖片預載入 Hook
 */
export function useImagePreload(urls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const preloadImages = useCallback(async (imageUrls: string[]) => {
    setIsLoading(true);
    const loaded = new Set<string>();
    const failed = new Set<string>();

    const promises = imageUrls.map(url => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          loaded.add(url);
          resolve();
        };
        
        img.onerror = () => {
          failed.add(url);
          resolve();
        };
        
        img.src = url;
      });
    });

    await Promise.all(promises);
    
    setLoadedImages(loaded);
    setFailedImages(failed);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (urls.length > 0) {
      preloadImages(urls);
    }
  }, [urls, preloadImages]);

  return {
    loadedImages,
    failedImages,
    isLoading,
    preloadImages
  };
}