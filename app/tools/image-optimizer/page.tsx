import { Metadata } from 'next';
import ImageOptimizerDemo from './ImageOptimizerDemo';
import { Image as ImageIcon, Zap, Smartphone, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: '圖片優化工具 | TaiCalc',
  description: '體驗 TaiCalc 的圖片優化技術：自動壓縮、響應式載入、延遲載入等功能',
  keywords: ['圖片優化', '響應式圖片', '延遲載入', '網站性能', 'TaiCalc'],
};

export default function ImageOptimizerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ImageIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">圖片優化工具</h1>
              <p className="text-gray-600 mt-1">
                體驗先進的圖片優化技術，提升網站載入速度和用戶體驗
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 功能介紹 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">自動優化</h3>
            </div>
            <p className="text-gray-600 text-sm">
              自動壓縮圖片、選擇最佳格式（WebP、AVIF），並生成多種尺寸以適應不同設備
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-4">
              <Smartphone className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">響應式載入</h3>
            </div>
            <p className="text-gray-600 text-sm">
              根據用戶設備和螢幕尺寸，自動選擇最適合的圖片尺寸和品質
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-4">
              <Globe className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">延遲載入</h3>
            </div>
            <p className="text-gray-600 text-sm">
              只載入用戶可見區域的圖片，大幅減少初始載入時間和頻寬使用
            </p>
          </div>
        </div>

        {/* 圖片優化器演示 */}
        <ImageOptimizerDemo />

        {/* 技術說明 */}
        <div className="mt-8 bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">技術特色</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🚀 性能優化</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Next.js Image 組件整合</li>
                <li>• WebP/AVIF 格式自動轉換</li>
                <li>• 智能品質調整（85% 預設）</li>
                <li>• CDN 快取優化</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📱 用戶體驗</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 模糊佔位符載入效果</li>
                <li>• 漸進式圖片載入</li>
                <li>• 錯誤處理和降級方案</li>
                <li>• 無障礙訪問支援</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 實作範例 */}
        <div className="mt-8 bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">實作範例</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="text-sm text-gray-800 overflow-x-auto">
{`import OptimizedImage from '@/components/shared/OptimizedImage';

// 基本使用
<OptimizedImage
  src="/images/hero-image.jpg"
  alt="TaiCalc 財務計算工具"
  width={800}
  height={600}
  priority={true}
  quality={90}
/>

// 響應式圖片
<ResponsiveImage
  src="/images/feature-showcase.jpg"
  alt="功能展示"
  className="w-full rounded-lg"
/>

// 圖片畫廊
<ImageGallery
  images={galleryImages}
  columns={3}
  className="mt-8"
/>`}
            </pre>
          </div>
        </div>

        {/* 相關工具連結 */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">相關工具</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/tools/performance"
              className="flex items-center p-3 bg-white rounded-md border hover:shadow-md transition-shadow"
            >
              <Zap className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">性能分析</p>
                <p className="text-xs text-gray-600">Bundle 分析工具</p>
              </div>
            </a>
            <a
              href="/tools"
              className="flex items-center p-3 bg-white rounded-md border hover:shadow-md transition-shadow"
            >
              <Globe className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">所有工具</p>
                <p className="text-xs text-gray-600">查看所有可用工具</p>
              </div>
            </a>
            <a
              href="/calculators"
              className="flex items-center p-3 bg-white rounded-md border hover:shadow-md transition-shadow"
            >
              <ImageIcon className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">計算器</p>
                <p className="text-xs text-gray-600">財務計算工具</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}