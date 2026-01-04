import { Metadata } from 'next';
import BundleAnalyzerPanel from '@/components/performance/BundleAnalyzerPanel';
import { Zap, TrendingUp, Package, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: '性能分析工具 | TaiCalc',
  description: '分析 TaiCalc 平台的 bundle 大小、載入性能，並獲得智能優化建議',
  keywords: ['性能分析', 'bundle分析', '網站優化', '載入速度', 'TaiCalc'],
};

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">性能分析工具</h1>
              <p className="text-gray-600 mt-1">
                分析網站性能，識別優化機會，提升用戶體驗
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
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Bundle 分析</h3>
            </div>
            <p className="text-gray-600 text-sm">
              深入分析 JavaScript bundle 的組成，識別大型程式碼塊和優化機會
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">性能指標</h3>
            </div>
            <p className="text-gray-600 text-sm">
              監控關鍵性能指標，包括載入時間、bundle 大小和優化分數
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">智能建議</h3>
            </div>
            <p className="text-gray-600 text-sm">
              獲得基於實際數據的優化建議，包含具體的實作方式和預估效果
            </p>
          </div>
        </div>

        {/* Bundle Analyzer 面板 */}
        <BundleAnalyzerPanel />

        {/* 性能優化最佳實踐 */}
        <div className="mt-8 bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">性能優化最佳實踐</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🚀 載入優化</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 使用 Next.js Image 組件優化圖片載入</li>
                <li>• 啟用 Gzip/Brotli 壓縮</li>
                <li>• 實作關鍵資源的預載入</li>
                <li>• 使用 CDN 加速靜態資源</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📦 程式碼優化</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 實作動態載入和程式碼分割</li>
                <li>• 移除未使用的依賴和程式碼</li>
                <li>• 使用 Tree Shaking 優化 bundle</li>
                <li>• 選擇輕量級的第三方庫</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 相關工具連結 */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">相關工具</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/tools"
              className="flex items-center p-3 bg-white rounded-md border hover:shadow-md transition-shadow"
            >
              <Package className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">所有工具</p>
                <p className="text-xs text-gray-600">查看所有可用工具</p>
              </div>
            </a>
            <a
              href="/calculators"
              className="flex items-center p-3 bg-white rounded-md border hover:shadow-md transition-shadow"
            >
              <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">計算器</p>
                <p className="text-xs text-gray-600">財務計算工具</p>
              </div>
            </a>
            <a
              href="/knowledge"
              className="flex items-center p-3 bg-white rounded-md border hover:shadow-md transition-shadow"
            >
              <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">知識庫</p>
                <p className="text-xs text-gray-600">學習財務知識</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}