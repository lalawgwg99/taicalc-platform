import { Metadata } from 'next';
import BundleAnalyzerPanel from '@/components/performance/BundleAnalyzerPanel';
import { Zap, TrendingUp, Package, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... (rest of the component) */}
      {/* r相關工具連結 */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">相關工具</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/tools"
            className="flex items-center p-3 bg-white rounded-md border hover:shadow-md transition-shadow"
          >
            <Package className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">所有工具</p>
              <p className="text-xs text-gray-600">查看所有可用工具</p>
            </div>
          </Link>
          <Link
            href="/calculators"
            className="flex items-center p-3 bg-white rounded-md border hover:shadow-md transition-shadow"
          >
            <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">計算器</p>
              <p className="text-xs text-gray-600">財務計算工具</p>
            </div>
          </Link>
          <Link
            href="/knowledge"
            className="flex items-center p-3 bg-white rounded-md border hover:shadow-md transition-shadow"
          >
            <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">知識庫</p>
              <p className="text-xs text-gray-600">學習財務知識</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
