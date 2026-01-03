/**
 * 圖片優化管理器
 * 提供自動圖片優化、響應式圖片生成和延遲載入功能
 */

import { 
  ImageAsset, 
  OptimizedImage, 
  ResponsiveImageSet, 
  ImageOptimizationConfig,
  LazyLoadOptions 
} from './types';

export class ImageOptimizer {
  private config: ImageOptimizationConfig;
  private observer: IntersectionObserver | null = null;

  constructor(config?: Partial<ImageOptimizationConfig>) {
    this.config = {
      quality: 85,
      formats: ['webp', 'jpeg'],
      breakpoints: [640, 768, 1024, 1280, 1536],
      lazyLoading: true,
      placeholder: 'blur',
      ...config
    };
  }

  /**
   * 優化圖片陣列
   * @param images 要優化的圖片陣列
   * @returns 優化後的圖片陣列
   */
  optimizeImages(images: ImageAsset[]): OptimizedImage[] {
    return images.map(image => this.optimizeSingleImage(image));
  }

  /**
   * 優化單張圖片
   * @param image 要優化的圖片
   * @returns 優化後的圖片
   */
  private optimizeSingleImage(image: ImageAsset): OptimizedImage {
    const { src, width = 800, height = 600, quality = this.config.quality } = image;
    
    // 生成不同尺寸的圖片 URL (使用 Next.js Image Optimization API)
    const srcSet = this.generateSrcSet(src, width, quality);
    const sizes = this.generateSizes();
    
    return {
      src: this.generateOptimizedUrl(src, width, height, quality),
      srcSet,
      sizes,
      width,
      height,
      placeholder: this.generatePlaceholder(src, width, height),
      blurDataURL: this.generateBlurDataURL(width, height)
    };
  }

  /**
   * 生成響應式圖片集
   * @param src 原始圖片路徑
   * @returns 響應式圖片集
   */
  generateResponsiveImages(src: string): ResponsiveImageSet {
    const breakpoints = this.config.breakpoints;
    const quality = this.config.quality;

    const responsiveImages = {
      small: this.generateOptimizedUrl(src, breakpoints[0], undefined, quality),
      medium: this.generateOptimizedUrl(src, breakpoints[1], undefined, quality),
      large: this.generateOptimizedUrl(src, breakpoints[2], undefined, quality),
      xlarge: this.generateOptimizedUrl(src, breakpoints[3], undefined, quality),
      srcSet: this.generateSrcSet(src, breakpoints[2], quality),
      sizes: this.generateSizes()
    };

    return responsiveImages;
  }

  /**
   * 實作延遲載入
   * @param container 容器元素
   * @param options 延遲載入選項
   */
  lazyLoadImages(container: HTMLElement, options?: LazyLoadOptions): void {
    if (!('IntersectionObserver' in window)) {
      // 如果瀏覽器不支援 IntersectionObserver，直接載入所有圖片
      this.loadAllImages(container);
      return;
    }

    const config = {
      rootMargin: options?.rootMargin || '50px',
      threshold: options?.threshold || 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          this.loadImage(img, options?.fadeInDuration);
          this.observer?.unobserve(img);
        }
      });
    }, config);

    // 觀察所有具有 data-lazy 屬性的圖片
    const lazyImages = container.querySelectorAll('img[data-lazy]');
    lazyImages.forEach(img => {
      this.observer?.observe(img);
    });
  }

  /**
   * 生成優化後的圖片 URL
   * @param src 原始圖片路徑
   * @param width 寬度
   * @param height 高度
   * @param quality 品質
   * @returns 優化後的 URL
   */
  private generateOptimizedUrl(
    src: string, 
    width: number, 
    height?: number, 
    quality?: number
  ): string {
    // 使用 Next.js Image Optimization API
    const params = new URLSearchParams();
    params.set('url', src);
    params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality) params.set('q', quality.toString());

    return `/_next/image?${params.toString()}`;
  }

  /**
   * 生成 srcSet 字串
   * @param src 原始圖片路徑
   * @param baseWidth 基礎寬度
   * @param quality 品質
   * @returns srcSet 字串
   */
  private generateSrcSet(src: string, baseWidth: number, quality: number): string {
    const densities = [1, 1.5, 2, 3];
    
    return densities
      .map(density => {
        const width = Math.round(baseWidth * density);
        const url = this.generateOptimizedUrl(src, width, undefined, quality);
        return `${url} ${density}x`;
      })
      .join(', ');
  }

  /**
   * 生成 sizes 屬性
   * @returns sizes 字串
   */
  private generateSizes(): string {
    return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
  }

  /**
   * 生成佔位符
   * @param src 原始圖片路徑
   * @param width 寬度
   * @param height 高度
   * @returns 佔位符 URL
   */
  private generatePlaceholder(src: string, width: number, height: number): string {
    // 生成低品質的佔位符圖片
    return this.generateOptimizedUrl(src, Math.min(width, 40), Math.min(height, 40), 10);
  }

  /**
   * 生成模糊數據 URL
   * @param width 寬度
   * @param height 高度
   * @returns 模糊數據 URL
   */
  private generateBlurDataURL(width: number, height: number): string {
    // 生成簡單的 SVG 佔位符
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  /**
   * 載入單張圖片
   * @param img 圖片元素
   * @param fadeInDuration 淡入動畫時間
   */
  private loadImage(img: HTMLImageElement, fadeInDuration = 300): void {
    const src = img.dataset.lazy;
    if (!src) return;

    // 設定淡入動畫
    img.style.opacity = '0';
    img.style.transition = `opacity ${fadeInDuration}ms ease-in-out`;

    img.onload = () => {
      img.style.opacity = '1';
      img.removeAttribute('data-lazy');
    };

    img.onerror = () => {
      // 載入失敗時顯示預設圖片或保持佔位符
      img.style.opacity = '1';
      img.removeAttribute('data-lazy');
    };

    img.src = src;
  }

  /**
   * 載入所有圖片（降級方案）
   * @param container 容器元素
   */
  private loadAllImages(container: HTMLElement): void {
    const lazyImages = container.querySelectorAll('img[data-lazy]') as NodeListOf<HTMLImageElement>;
    lazyImages.forEach(img => {
      this.loadImage(img);
    });
  }

  /**
   * 清理資源
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// 建立預設實例
export const imageOptimizer = new ImageOptimizer();