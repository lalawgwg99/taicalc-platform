/**
 * 圖片優化相關的類型定義
 */

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
}

export interface OptimizedImage {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  placeholder?: string;
  blurDataURL?: string;
}

export interface ResponsiveImageSet {
  small: string;
  medium: string;
  large: string;
  xlarge: string;
  srcSet: string;
  sizes: string;
}

export interface ImageOptimizationConfig {
  quality: number;
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
  breakpoints: number[];
  lazyLoading: boolean;
  placeholder: 'blur' | 'empty';
}

export interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  fadeInDuration?: number;
}