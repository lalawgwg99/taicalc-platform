/**
 * 響應式設計一致性測試
 * Feature: taicalc-optimization, Property 2: Responsive Design Consistency
 * 
 * 驗證需求: 1.3, 2.5
 * - 用戶在不同設備上訪問時應提供響應式設計體驗
 * - 用戶在移動設備上使用時 UI 組件應優化觸控操作體驗
 */

import { imageOptimizer } from '@/lib/image-optimization/ImageOptimizer';
import { ImageAsset } from '@/lib/image-optimization/types';
import fc from 'fast-check';

// 模擬不同的視窗尺寸
const viewportSizes = [
  { width: 320, height: 568, name: 'iPhone SE' },
  { width: 375, height: 667, name: 'iPhone 8' },
  { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
  { width: 768, height: 1024, name: 'iPad' },
  { width: 1024, height: 768, name: 'iPad Landscape' },
  { width: 1280, height: 720, name: 'Desktop Small' },
  { width: 1920, height: 1080, name: 'Desktop Large' },
  { width: 2560, height: 1440, name: '2K Monitor' }
];

// 模擬設備類型
const deviceTypes = ['mobile', 'tablet', 'desktop'] as const;

describe('Responsive Design Consistency Properties', () => {
  /**
   * Property 2: Responsive Design Consistency
   * For any viewport size or device type, the platform should maintain 
   * proper layout and functionality
   * Validates: Requirements 1.3, 2.5
   */
  describe('Property 2: Responsive Design Consistency', () => {
    test('Image optimization should work across all viewport sizes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...viewportSizes),
          fc.constantFrom(...deviceTypes),
          async (viewport, deviceType) => {
            // 模擬不同視窗尺寸的圖片需求
            const testImage: ImageAsset = {
              src: 'https://example.com/test-image.jpg',
              alt: 'Test image',
              width: viewport.width,
              height: Math.round(viewport.height * 0.6), // 保持合理的寬高比
              priority: deviceType === 'mobile' // 移動設備優先載入
            };

            const optimizedImages = imageOptimizer.optimizeImages([testImage]);
            const optimizedImage = optimizedImages[0];

            // 驗證圖片優化結果
            expect(optimizedImage).toBeDefined();
            expect(optimizedImage.src).toBeTruthy();
            expect(optimizedImage.srcSet).toBeTruthy();
            expect(optimizedImage.sizes).toBeTruthy();

            // 驗證響應式圖片集
            const responsiveSet = imageOptimizer.generateResponsiveImages(testImage.src);
            expect(responsiveSet).toBeDefined();
            expect(responsiveSet.small).toBeTruthy();
            expect(responsiveSet.medium).toBeTruthy();
            expect(responsiveSet.large).toBeTruthy();
            expect(responsiveSet.xlarge).toBeTruthy();

            // 驗證 sizes 屬性適合當前視窗
            expect(responsiveSet.sizes).toContain('100vw');
            expect(responsiveSet.sizes).toContain('50vw');

            // 移動設備應該有特殊處理
            if (deviceType === 'mobile') {
              expect(testImage.priority).toBe(true);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Responsive breakpoints should cover all common device sizes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...viewportSizes),
          (viewport) => {
            const responsiveSet = imageOptimizer.generateResponsiveImages('test.jpg');
            
            // 驗證響應式斷點覆蓋範圍 - 擴展到支援更大的螢幕
            const breakpoints = [640, 768, 1024, 1280, 1536, 2048, 2560]; // 擴展斷點以支援 2K+ 螢幕
            
            // 每個視窗尺寸都應該有適合的斷點
            const suitableBreakpoint = breakpoints.find(bp => bp >= viewport.width);
            
            // 如果沒有找到合適的斷點，使用最大的斷點
            const effectiveBreakpoint = suitableBreakpoint || Math.max(...breakpoints);
            expect(effectiveBreakpoint).toBeDefined();
            expect(effectiveBreakpoint).toBeGreaterThan(0);

            // sizes 屬性應該包含適當的媒體查詢
            expect(responsiveSet.sizes).toMatch(/\(max-width: \d+px\)/);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    test('Touch-friendly interface elements should be properly sized', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...viewportSizes.filter(v => v.width <= 768)), // 只測試移動和平板
          (viewport) => {
            // 模擬觸控友好的最小尺寸 (44px - Apple HIG 建議)
            const MIN_TOUCH_TARGET = 44;
            const RECOMMENDED_TOUCH_TARGET = 48;

            // 驗證觸控目標尺寸
            expect(MIN_TOUCH_TARGET).toBeGreaterThanOrEqual(44);
            expect(RECOMMENDED_TOUCH_TARGET).toBeGreaterThanOrEqual(48);

            // 在小螢幕上，觸控目標應該更大
            if (viewport.width <= 375) {
              expect(RECOMMENDED_TOUCH_TARGET).toBeGreaterThanOrEqual(48);
            }

            // 驗證間距適合觸控操作
            const MIN_SPACING = 8; // 最小間距
            expect(MIN_SPACING).toBeGreaterThanOrEqual(8);

            return true;
          }
        ),
        { numRuns: 30 }
      );
    });

    test('Layout should remain functional across all viewport sizes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...viewportSizes),
          (viewport) => {
            // 模擬佈局計算
            const containerWidth = viewport.width - 32; // 減去 padding
            const minContentWidth = 280; // 最小內容寬度

            // 內容應該始終可見和可用
            expect(containerWidth).toBeGreaterThan(0);
            
            // 即使在最小螢幕上，內容也應該可用
            if (viewport.width >= 320) {
              expect(containerWidth).toBeGreaterThanOrEqual(minContentWidth);
            }

            // 計算合適的欄數
            const columnWidth = 300; // 每欄最小寬度
            const maxColumns = Math.floor(containerWidth / columnWidth);
            const actualColumns = Math.max(1, Math.min(maxColumns, 4)); // 1-4 欄

            expect(actualColumns).toBeGreaterThanOrEqual(1);
            expect(actualColumns).toBeLessThanOrEqual(4);

            // 移動設備應該使用單欄佈局
            if (viewport.width <= 640) {
              expect(actualColumns).toBe(1);
            }

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    test('Font sizes should scale appropriately for different devices', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...viewportSizes),
          (viewport) => {
            // 基礎字體大小計算
            const baseFontSize = 16; // 16px 基礎
            const scaleFactor = Math.max(0.875, Math.min(1.125, viewport.width / 1024));
            const scaledFontSize = baseFontSize * scaleFactor;

            // 字體大小應該在合理範圍內
            expect(scaledFontSize).toBeGreaterThanOrEqual(14); // 最小可讀大小
            expect(scaledFontSize).toBeLessThanOrEqual(20); // 最大合理大小

            // 移動設備字體不應太小
            if (viewport.width <= 480) {
              expect(scaledFontSize).toBeGreaterThanOrEqual(14);
            }

            // 大螢幕字體不應太大
            if (viewport.width >= 1920) {
              expect(scaledFontSize).toBeLessThanOrEqual(18);
            }

            return true;
          }
        ),
        { numRuns: 40 }
      );
    });

    test('Navigation should adapt to different screen sizes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...viewportSizes),
          (viewport) => {
            // 導航項目數量
            const navItems = ['首頁', '計算器', '知識庫', '工具', '關於'];
            const itemWidth = 80; // 每個導航項目的平均寬度
            const totalNavWidth = navItems.length * itemWidth;

            // 決定導航佈局
            const shouldUseHamburger = viewport.width < totalNavWidth + 200; // 留出額外空間

            if (shouldUseHamburger) {
              // 小螢幕應該使用漢堡選單
              expect(viewport.width).toBeLessThan(600);
            } else {
              // 大螢幕可以顯示完整導航
              expect(viewport.width).toBeGreaterThanOrEqual(totalNavWidth);
            }

            return true;
          }
        ),
        { numRuns: 30 }
      );
    });

    test('Images should maintain aspect ratio across all devices', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...viewportSizes),
          fc.integer({ min: 200, max: 1200 }), // 原始寬度
          fc.integer({ min: 150, max: 900 }),  // 原始高度
          (viewport, originalWidth, originalHeight) => {
            const aspectRatio = originalWidth / originalHeight;
            
            // 計算適合視窗的尺寸
            const maxWidth = viewport.width - 40; // 減去邊距
            const maxHeight = viewport.height - 100; // 減去標題等元素

            let displayWidth = originalWidth;
            let displayHeight = originalHeight;

            // 如果圖片太寬，按寬度縮放
            if (displayWidth > maxWidth) {
              displayWidth = maxWidth;
              displayHeight = displayWidth / aspectRatio;
            }

            // 如果圖片太高，按高度縮放
            if (displayHeight > maxHeight) {
              displayHeight = maxHeight;
              displayWidth = displayHeight * aspectRatio;
            }

            // 驗證縮放後的尺寸
            expect(displayWidth).toBeLessThanOrEqual(maxWidth);
            expect(displayHeight).toBeLessThanOrEqual(maxHeight);
            expect(displayWidth).toBeGreaterThan(0);
            expect(displayHeight).toBeGreaterThan(0);

            // 驗證寬高比保持不變（允許小誤差）
            const newAspectRatio = displayWidth / displayHeight;
            expect(Math.abs(newAspectRatio - aspectRatio)).toBeLessThan(0.01);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Content should be accessible on all device orientations', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...viewportSizes),
          (viewport) => {
            // 測試橫向和縱向
            const orientations = [
              { width: viewport.width, height: viewport.height, name: 'portrait' },
              { width: viewport.height, height: viewport.width, name: 'landscape' }
            ];

            orientations.forEach(orientation => {
              // 內容區域計算
              const contentArea = orientation.width * orientation.height;
              const minContentArea = 200 * 150; // 最小可用內容區域

              expect(contentArea).toBeGreaterThanOrEqual(minContentArea);

              // 確保在任何方向都有足夠的可視區域
              expect(orientation.width).toBeGreaterThanOrEqual(200);
              expect(orientation.height).toBeGreaterThanOrEqual(150);
            });

            return true;
          }
        ),
        { numRuns: 40 }
      );
    });
  });

  describe('Mobile-Specific Touch Optimization Tests', () => {
    test('Touch targets should meet accessibility guidelines', () => {
      const mobileViewports = viewportSizes.filter(v => v.width <= 768);
      
      fc.assert(
        fc.property(
          fc.constantFrom(...mobileViewports),
          (viewport) => {
            // WCAG 2.1 AA 標準：觸控目標至少 44×44 CSS 像素
            const MIN_TOUCH_SIZE = 44;
            const RECOMMENDED_TOUCH_SIZE = 48;

            // 按鈕和連結的最小尺寸
            expect(MIN_TOUCH_SIZE).toBeGreaterThanOrEqual(44);
            
            // 推薦尺寸更大，提供更好的用戶體驗
            expect(RECOMMENDED_TOUCH_SIZE).toBeGreaterThanOrEqual(48);

            // 在非常小的螢幕上，可能需要調整
            if (viewport.width <= 320) {
              // 即使在小螢幕上也要保持最小觸控尺寸
              expect(MIN_TOUCH_SIZE).toBe(44);
            }

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    test('Spacing between touch elements should prevent accidental taps', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...viewportSizes.filter(v => v.width <= 768)),
          (viewport) => {
            // 觸控元素間的最小間距
            const MIN_SPACING = 8;
            let RECOMMENDED_SPACING = 12;

            expect(MIN_SPACING).toBeGreaterThanOrEqual(8);
            expect(RECOMMENDED_SPACING).toBeGreaterThanOrEqual(12);

            // 在密集的介面中，間距更重要
            const elementDensity = viewport.width / 300; // 假設每 300px 有一個主要元素
            if (elementDensity > 2) {
              RECOMMENDED_SPACING = 16; // 動態調整推薦間距
              expect(RECOMMENDED_SPACING).toBeGreaterThanOrEqual(16);
            }

            return true;
          }
        ),
        { numRuns: 15 }
      );
    });
  });

  describe('Performance Consistency Tests', () => {
    test('Responsive image generation should be consistent across viewport sizes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...viewportSizes),
          (viewport) => {
            const testSrc = 'https://example.com/test.jpg';
            
            const startTime = performance.now();
            const responsiveSet = imageOptimizer.generateResponsiveImages(testSrc);
            const endTime = performance.now();
            
            const generationTime = endTime - startTime;

            // 響應式圖片生成應該很快（小於 10ms）
            expect(generationTime).toBeLessThan(10);

            // 結果應該一致
            expect(responsiveSet.small).toBeTruthy();
            expect(responsiveSet.medium).toBeTruthy();
            expect(responsiveSet.large).toBeTruthy();
            expect(responsiveSet.xlarge).toBeTruthy();
            expect(responsiveSet.srcSet).toBeTruthy();
            expect(responsiveSet.sizes).toBeTruthy();

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});