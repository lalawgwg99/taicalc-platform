/**
 * SEO 優化完整性測試
 * 
 * 驗證 SEO 優化器的完整性和正確性
 * 
 * 屬性 7: SEO Optimization Completeness
 * 驗證: 需求 4.1, 4.2, 4.4
 */

import { describe, test, expect } from '@jest/globals';
import fc from 'fast-check';
import { 
  generatePageMetadata, 
  generateStructuredData, 
  generateInternalLinks,
  calculatorSEOConfigs,
  CalculatorType 
} from '@/lib/seo/seo-optimizer';
import { generateSocialShareLinks } from '@/components/seo/SocialPreview';

// 所有支援的計算器類型
const allCalculatorTypes: CalculatorType[] = [
  'salary', 'mortgage', 'tax', 'investment', 'retirement', 'capital',
  'cost', 'credit-card', 'delivery-income', 'electricity', 'labor-pension',
  'overtime', 'percentage', 'profit', 'rent-cost', 'split', 'work-hours'
];

describe('SEO 優化完整性測試', () => {
  describe('屬性測試 - SEO Optimization Completeness', () => {
    test('**Feature: taicalc-optimization, Property 7: For any calculator type, the SEO optimizer should provide complete structured data, social media previews, and internal linking**', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...allCalculatorTypes),
          (calculatorType) => {
            // 生成頁面 metadata
            const metadata = generatePageMetadata(calculatorType);
            
            // 驗證基本 metadata 完整性
            expect(metadata.title).toBeDefined();
            expect(metadata.title).toContain('TaiCalc');
            expect(metadata.description).toBeDefined();
            expect(metadata.description!.length).toBeGreaterThan(35);
            expect(metadata.description!.length).toBeLessThan(160);
            
            // 驗證 OpenGraph 數據
            expect(metadata.openGraph).toBeDefined();
            expect(metadata.openGraph?.title).toBeDefined();
            expect(metadata.openGraph?.description).toBeDefined();
            expect(metadata.openGraph?.url).toBeDefined();
            expect(metadata.openGraph?.siteName).toBe('TaiCalc 數策');
            expect(metadata.openGraph?.locale).toBe('zh_TW');
            
            // 驗證 Twitter 卡片
            expect(metadata.twitter).toBeDefined();
            expect((metadata.twitter as any)?.card).toBe('summary_large_image');
            expect(metadata.twitter?.title).toBeDefined();
            expect(metadata.twitter?.description).toBeDefined();
            
            // 驗證結構化數據
            const structuredData = generateStructuredData(calculatorType);
            expect(structuredData).toBeDefined();
            expect(Array.isArray(structuredData)).toBe(true);
            expect(structuredData.length).toBeGreaterThan(0);
            
            // 驗證每個結構化數據項目
            structuredData.forEach(schema => {
              expect(schema['@context']).toBe('https://schema.org');
              expect(schema['@type']).toBeDefined();
            });
            
            // 驗證內部連結
            const internalLinks = generateInternalLinks(calculatorType);
            expect(Array.isArray(internalLinks)).toBe(true);
            
            // 如果有內部連結，驗證其結構
            if (internalLinks.length > 0) {
              internalLinks.forEach(link => {
                expect(link.title).toBeDefined();
                expect(link.url).toBeDefined();
                expect(link.url).toMatch(/^\/[a-z-/]+$/);
                expect(link.description).toBeDefined();
              });
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('**Feature: taicalc-optimization, Property 7a: For any URL and content, social share links should be properly formatted**', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          fc.string({ minLength: 10, maxLength: 100 }),
          fc.string({ minLength: 20, maxLength: 200 }),
          (url, title, description) => {
            const shareLinks = generateSocialShareLinks(url, title, description);
            
            // 驗證所有必要的社交平台都有連結
            const expectedPlatforms = ['facebook', 'twitter', 'linkedin', 'line', 'telegram', 'whatsapp', 'email'];
            expectedPlatforms.forEach(platform => {
              expect(shareLinks[platform]).toBeDefined();
              expect(shareLinks[platform]).toContain(encodeURIComponent(url));
            });
            
            // 驗證 Facebook 分享連結格式
            expect(shareLinks.facebook).toMatch(/^https:\/\/www\.facebook\.com\/sharer\/sharer\.php\?u=/);
            
            // 驗證 Twitter 分享連結格式
            expect(shareLinks.twitter).toMatch(/^https:\/\/twitter\.com\/intent\/tweet\?/);
            
            // 驗證 LinkedIn 分享連結格式
            expect(shareLinks.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/sharing\/share-offsite\/\?/);
            
            // 驗證 LINE 分享連結格式
            expect(shareLinks.line).toMatch(/^https:\/\/social-plugins\.line\.me\/lineit\/share\?/);
            
            // 驗證 Email 分享連結格式
            expect(shareLinks.email).toMatch(/^mailto:\?/);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('**Feature: taicalc-optimization, Property 7b: For any calculator type, structured data should include valid Schema.org markup**', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...allCalculatorTypes),
          (calculatorType) => {
            const structuredData = generateStructuredData(calculatorType);
            
            // 尋找 WebPage schema
            const webPageSchema = structuredData.find(schema => schema['@type'] === 'WebPage');
            expect(webPageSchema).toBeDefined();
            expect(webPageSchema?.name).toBeDefined();
            expect(webPageSchema?.description).toBeDefined();
            expect(webPageSchema?.url).toBeDefined();
            
            // 尋找 BreadcrumbList schema
            const breadcrumbSchema = structuredData.find(schema => schema['@type'] === 'BreadcrumbList');
            expect(breadcrumbSchema).toBeDefined();
            expect(breadcrumbSchema?.itemListElement).toBeDefined();
            expect(Array.isArray(breadcrumbSchema?.itemListElement)).toBe(true);
            expect(breadcrumbSchema?.itemListElement.length).toBeGreaterThanOrEqual(3);
            
            // 驗證麵包屑項目結構
            breadcrumbSchema?.itemListElement.forEach((item: any, index: number) => {
              expect(item['@type']).toBe('ListItem');
              expect(item.position).toBe(index + 1);
              expect(item.name).toBeDefined();
              expect(item.item).toBeDefined();
            });
            
            // 尋找 SoftwareApplication schema
            const appSchema = structuredData.find(schema => schema['@type'] === 'SoftwareApplication');
            if (appSchema) {
              expect(appSchema.name).toBeDefined();
              expect(appSchema.description).toBeDefined();
              expect(appSchema.applicationCategory).toBe('FinanceApplication');
              expect(appSchema.operatingSystem).toBe('Web Browser');
              expect(appSchema.offers).toBeDefined();
              expect(appSchema.offers['@type']).toBe('Offer');
              expect(appSchema.offers.price).toBe('0');
              expect(appSchema.offers.priceCurrency).toBe('TWD');
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('單元測試 - SEO 配置完整性', () => {
    test('所有計算器類型都有 SEO 配置', () => {
      allCalculatorTypes.forEach(calculatorType => {
        expect(calculatorSEOConfigs[calculatorType]).toBeDefined();
        
        const config = calculatorSEOConfigs[calculatorType];
        expect(config.title).toBeDefined();
        expect(config.title).toContain('TaiCalc');
        expect(config.description).toBeDefined();
        expect(config.description.length).toBeGreaterThan(30);
        expect(config.keywords).toBeDefined();
        expect(Array.isArray(config.keywords)).toBe(true);
        expect(config.keywords!.length).toBeGreaterThan(0);
      });
    });

    test('SEO 標題格式一致性', () => {
      allCalculatorTypes.forEach(calculatorType => {
        const config = calculatorSEOConfigs[calculatorType];
        
        // 標題應該包含計算器名稱和 TaiCalc 品牌
        expect(config.title).toMatch(/.*(計算器|試算器).*\|.*TaiCalc/);
        
        // 標題長度應該適合搜索引擎顯示
        expect(config.title.length).toBeLessThanOrEqual(60);
      });
    });

    test('SEO 描述格式一致性', () => {
      allCalculatorTypes.forEach(calculatorType => {
        const config = calculatorSEOConfigs[calculatorType];
        
        // 描述長度應該適合搜索引擎顯示
        expect(config.description.length).toBeGreaterThanOrEqual(35);
        expect(config.description.length).toBeLessThanOrEqual(160);
        
        // 描述應該包含相關關鍵詞
        const hasRelevantKeywords = config.keywords!.some(keyword => 
          config.description.toLowerCase().includes(keyword.toLowerCase())
        );
        expect(hasRelevantKeywords).toBe(true);
      });
    });

    test('內部連結系統完整性', () => {
      allCalculatorTypes.forEach(calculatorType => {
        const internalLinks = generateInternalLinks(calculatorType);
        
        // 每個連結都應該有完整的結構
        internalLinks.forEach(link => {
          expect(link.title).toBeDefined();
          expect(link.title.length).toBeGreaterThan(0);
          expect(link.url).toBeDefined();
          expect(link.url).toMatch(/^\/[a-z-/]+$/);
          expect(link.description).toBeDefined();
          expect(link.description.length).toBeGreaterThan(0);
        });
        
        // 連結不應該指向自己
        const selfLinks = internalLinks.filter(link => 
          link.url === `/${calculatorType}` || 
          link.url.includes(calculatorType)
        );
        expect(selfLinks.length).toBe(0);
      });
    });
  });

  describe('邊界條件測試', () => {
    test('空字串和特殊字符處理', () => {
      const testCases = [
        { url: '', title: '', description: '' },
        { url: 'https://test.com', title: '測試<script>', description: '描述"引號"' },
        { url: 'https://test.com?param=value&other=123', title: '標題 & 符號', description: '描述 % 編碼' }
      ];

      testCases.forEach(testCase => {
        expect(() => {
          generateSocialShareLinks(testCase.url, testCase.title, testCase.description);
        }).not.toThrow();
      });
    });

    test('無效計算器類型處理', () => {
      // 測試不存在的計算器類型
      const invalidType = 'invalid-calculator' as CalculatorType;
      
      expect(() => {
        generatePageMetadata(invalidType);
      }).toThrow();
    });

    test('長文本處理', () => {
      const longTitle = 'A'.repeat(200);
      const longDescription = 'B'.repeat(500);
      const longUrl = 'https://example.com/' + 'c'.repeat(1000);

      expect(() => {
        generateSocialShareLinks(longUrl, longTitle, longDescription);
      }).not.toThrow();
    });
  });

  describe('性能測試', () => {
    test('SEO 數據生成性能', () => {
      const startTime = performance.now();
      
      // 為所有計算器類型生成 SEO 數據
      allCalculatorTypes.forEach(calculatorType => {
        generatePageMetadata(calculatorType);
        generateStructuredData(calculatorType);
        generateInternalLinks(calculatorType);
      });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // SEO 數據生成應該在合理時間內完成（100ms）
      expect(executionTime).toBeLessThan(100);
    });

    test('大量社交分享連結生成性能', () => {
      const startTime = performance.now();
      
      // 生成 1000 個社交分享連結
      for (let i = 0; i < 1000; i++) {
        generateSocialShareLinks(
          `https://example.com/page-${i}`,
          `標題 ${i}`,
          `描述 ${i}`
        );
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // 大量連結生成應該在合理時間內完成（500ms）
      expect(executionTime).toBeLessThan(500);
    });
  });
});