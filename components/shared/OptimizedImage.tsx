'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { imageOptimizer } from '@/lib/image-optimization/ImageOptimizer';
import { ImageAsset } from '@/lib/image-optimization/types';

interface OptimizedImageProps extends Omit<ImageAsset, 'src'> {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 優化的圖片組件
 * 整合 Next.js Image 組件和自定義圖片優化器
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  sizes,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // 生成優化的圖片數據
  const optimizedImage = imageOptimizer.optimizeImages([{
    src,
    alt,
    width: width || 800,
    height: height || 600,
    quality,
    priority
  }])[0];

  useEffect(() => {
    // 如果不是優先載入的圖片，使用延遲載入
    if (!priority && imageRef.current?.parentElement) {
      imageOptimizer.lazyLoadImages(imageRef.current.parentElement, {
        rootMargin: '50px',
        threshold: 0.1,
        fadeInDuration: 300
      });
    }

    return () => {
      // 清理資源
      imageOptimizer.destroy();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // 錯誤狀態顯示預設圖片
  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-gray-400 text-sm text-center p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          圖片載入失敗
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 載入中的佔位符 */}
      {!isLoaded && placeholder === 'blur' && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
          style={{
            backgroundImage: `url("${optimizedImage.blurDataURL}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes || optimizedImage.sizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={optimizedImage.blurDataURL}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* 載入進度指示器 */}
      {!isLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/**
 * 響應式圖片組件
 * 針對不同螢幕尺寸提供最佳化的圖片
 */
export function ResponsiveImage({
  src,
  alt,
  className = '',
  priority = false,
  quality = 85,
  onLoad,
  onError
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}) {
  const responsiveSet = imageOptimizer.generateResponsiveImages(src);

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1200}
      height={800}
      className={className}
      sizes={responsiveSet.sizes}
      priority={priority}
      quality={quality}
      onLoad={onLoad}
      onError={onError}
    />
  );
}

/**
 * 圖片畫廊組件
 * 支援延遲載入和優化的多圖片顯示
 */
export function ImageGallery({
  images,
  className = '',
  itemClassName = '',
  columns = 3
}: {
  images: ImageAsset[];
  className?: string;
  itemClassName?: string;
  columns?: number;
}) {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (galleryRef.current) {
      imageOptimizer.lazyLoadImages(galleryRef.current, {
        rootMargin: '100px',
        threshold: 0.1
      });
    }
  }, []);

  return (
    <div 
      ref={galleryRef}
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {images.map((image, index) => (
        <div key={index} className={itemClassName}>
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={image.width || 400}
            height={image.height || 300}
            className="w-full h-full object-cover rounded-lg"
            priority={index < 3} // 前三張圖片優先載入
            quality={image.quality || 85}
          />
        </div>
      ))}
    </div>
  );
}