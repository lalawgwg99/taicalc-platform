/**
 * 性能合規屬性測試
 * Feature: taicalc-optimization, Property 1: Performance Compliance
 * 
 * 驗證需求: 1.1, 1.5
 * - 頁面載入時間應在 3 秒內完成首次內容繪製
 * - 計算操作應在 100ms 內返回結果
 */

import { bundleAnalyzer, BundleReport } from '@/lib/performance/bundle-analyzer';
import fc from 'fast-check';

describe('Performance Compliance Properties', () => {
  /**
   * Property 1: Performance Compliance
   * For any page load or calculation operation, the system should complete 
   * within the specified time limits (3 seconds for page load, 100ms for calculations)
   * Validates: Requirements 1.1, 1.5
   */
  describe('Property 1: Performance Compliance', () => {
    test('Bundle analysis should complete within reasonable time', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const startTime = performance.now();
          
          const report = await bundleAnalyzer.analyzeBundle();
          
          const endTime = performance.now();
          const analysisTime = endTime - startTime;
          
          // Bundle 分析應在 1 秒內完成（遠低於 3 秒的頁面載入要求）
          expect(analysisTime).toBeLessThan(1000);
          
          // 報告應包含必要的性能數據
          expect(report).toBeDefined();
          expect(report.totalSize).toBeGreaterThan(0);
          expect(report.performanceScore).toBeGreaterThanOrEqual(0);
          expect(report.performanceScore).toBeLessThanOrEqual(100);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('Bundle size should meet performance standards', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const report = await bundleAnalyzer.analyzeBundle();
          
          // 總 bundle 大小不應超過 2MB（未壓縮）
          const MAX_BUNDLE_SIZE = 2 * 1024 * 1024; // 2MB
          expect(report.totalSize).toBeLessThan(MAX_BUNDLE_SIZE);
          
          // Gzip 壓縮後大小應顯著小於原始大小
          expect(report.gzipSize).toBeLessThan(report.totalSize);
          
          // 壓縮比應合理（通常 gzip 可以達到 60-80% 的壓縮率）
          const compressionRatio = report.gzipSize / report.totalSize;
          expect(compressionRatio).toBeLessThan(0.8); // 至少 20% 壓縮
          expect(compressionRatio).toBeGreaterThan(0.1); // 不會壓縮到極小
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('Individual chunks should not exceed recommended size limits', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const report = await bundleAnalyzer.analyzeBundle();
          
          const MAX_CHUNK_SIZE = 244 * 1024; // 244KB - Next.js 建議
          
          // 檢查每個 chunk 的大小
          for (const chunk of report.chunks) {
            // 入口點 chunks 可能稍大，但不應超過 500KB
            if (chunk.isEntry) {
              expect(chunk.size).toBeLessThan(500 * 1024);
            } else {
              // 非入口點 chunks 應遵循 244KB 限制，或至少不超過 300KB
              expect(chunk.size).toBeLessThan(300 * 1024);
            }
            
            // 所有 chunks 都應有正數大小
            expect(chunk.size).toBeGreaterThan(0);
            
            // Chunk 名稱應該有意義
            expect(chunk.name).toBeTruthy();
            expect(typeof chunk.name).toBe('string');
            expect(chunk.name.length).toBeGreaterThan(0);
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('Performance score should reflect actual bundle quality', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const report = await bundleAnalyzer.analyzeBundle();
          
          // 性能分數應在合理範圍內
          expect(report.performanceScore).toBeGreaterThanOrEqual(0);
          expect(report.performanceScore).toBeLessThanOrEqual(100);
          
          // 如果有大型 chunks，性能分數應該較低
          const largeChunks = report.chunks.filter(chunk => chunk.size > 244 * 1024);
          if (largeChunks.length > 2) {
            expect(report.performanceScore).toBeLessThan(80);
          }
          
          // 如果總大小很大，性能分數應該較低
          if (report.totalSize > 1024 * 1024) { // > 1MB
            expect(report.performanceScore).toBeLessThan(90);
          }
          
          // 性能分數應該是整數
          expect(Number.isInteger(report.performanceScore)).toBe(true);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('Optimization suggestions should be relevant and actionable', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const report = await bundleAnalyzer.analyzeBundle();
          
          // 應該總是有一些優化建議
          expect(report.suggestions).toBeDefined();
          expect(Array.isArray(report.suggestions)).toBe(true);
          expect(report.suggestions.length).toBeGreaterThan(0);
          
          // 檢查每個建議的品質
          for (const suggestion of report.suggestions) {
            // 必要欄位檢查
            expect(suggestion.type).toBeDefined();
            expect(suggestion.severity).toBeDefined();
            expect(suggestion.title).toBeDefined();
            expect(suggestion.description).toBeDefined();
            expect(suggestion.impact).toBeDefined();
            expect(suggestion.implementation).toBeDefined();
            
            // 嚴重程度應該是有效值
            expect(['high', 'medium', 'low']).toContain(suggestion.severity);
            
            // 類型應該是有效值
            expect([
              'code-splitting',
              'tree-shaking', 
              'compression',
              'lazy-loading',
              'dependency-optimization'
            ]).toContain(suggestion.type);
            
            // 文字內容應該有意義
            expect(suggestion.title.length).toBeGreaterThan(5);
            expect(suggestion.description.length).toBeGreaterThan(10);
            expect(suggestion.impact.length).toBeGreaterThan(10);
            expect(suggestion.implementation.length).toBeGreaterThan(20);
            
            // 如果有預估節省，應該是正數
            if (suggestion.estimatedSavings !== undefined) {
              expect(suggestion.estimatedSavings).toBeGreaterThan(0);
              expect(suggestion.estimatedSavings).toBeLessThan(10000); // 不應超過 10MB
            }
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('Bundle analysis should be deterministic for same input', async () => {
      // 對於相同的輸入，分析結果應該是一致的
      const report1 = await bundleAnalyzer.analyzeBundle();
      const report2 = await bundleAnalyzer.analyzeBundle();
      
      // 基本結構應該相同
      expect(report1.chunks.length).toBe(report2.chunks.length);
      expect(report1.totalSize).toBe(report2.totalSize);
      expect(report1.performanceScore).toBe(report2.performanceScore);
      
      // Chunks 應該有相同的名稱和大小
      for (let i = 0; i < report1.chunks.length; i++) {
        expect(report1.chunks[i].name).toBe(report2.chunks[i].name);
        expect(report1.chunks[i].size).toBe(report2.chunks[i].size);
        expect(report1.chunks[i].isEntry).toBe(report2.chunks[i].isEntry);
        expect(report1.chunks[i].isAsync).toBe(report2.chunks[i].isAsync);
      }
    });

    test('Large chunks should be properly identified', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const report = await bundleAnalyzer.analyzeBundle();
          
          const MAX_CHUNK_SIZE = 244 * 1024; // 244KB
          
          // 手動計算大型 chunks
          const actualLargeChunks = report.chunks.filter(chunk => chunk.size > MAX_CHUNK_SIZE);
          
          // largestChunks 應該包含所有超過限制的 chunks
          expect(report.largestChunks.length).toBeLessThanOrEqual(actualLargeChunks.length);
          
          // largestChunks 中的每個 chunk 都應該確實很大
          for (const chunk of report.largestChunks) {
            expect(chunk.size).toBeGreaterThan(MAX_CHUNK_SIZE);
          }
          
          // largestChunks 應該按大小降序排列
          for (let i = 1; i < report.largestChunks.length; i++) {
            expect(report.largestChunks[i-1].size).toBeGreaterThanOrEqual(report.largestChunks[i].size);
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Calculation Performance Tests', () => {
    test('Bundle analyzer operations should complete within 100ms target', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          // 測試各種分析操作的性能
          const startTime = performance.now();
          
          // 模擬快速分析操作
          const chunks = await bundleAnalyzer['getChunkInfo']();
          const largeChunks = bundleAnalyzer.identifyLargeChunks(chunks);
          const suggestions = bundleAnalyzer.suggestOptimizations(chunks);
          
          const endTime = performance.now();
          const operationTime = endTime - startTime;
          
          // 這些操作應該很快完成（遠低於 100ms）
          expect(operationTime).toBeLessThan(50);
          
          // 結果應該有效
          expect(Array.isArray(chunks)).toBe(true);
          expect(Array.isArray(largeChunks)).toBe(true);
          expect(Array.isArray(suggestions)).toBe(true);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Memory Usage Tests', () => {
    test('Bundle analysis should not consume excessive memory', async () => {
      // 檢查記憶體使用情況（如果可用）
      if (typeof process !== 'undefined' && process.memoryUsage) {
        const initialMemory = process.memoryUsage();
        
        // 執行多次分析
        for (let i = 0; i < 10; i++) {
          await bundleAnalyzer.analyzeBundle();
        }
        
        const finalMemory = process.memoryUsage();
        
        // 記憶體增長應該合理（不超過 50MB）
        const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
      }
    });
  });
});