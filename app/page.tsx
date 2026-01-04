'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Calculator, 
  TrendingUp, 
  Home, 
  PiggyBank, 
  ArrowRight, 
  Sparkles,
  Shield,
  Clock,
  Users,
  ChevronRight,
  Play,
  BookOpen,
  Star,
  Zap
} from 'lucide-react';

const calculators = [
  {
    id: 'salary',
    icon: Calculator,
    title: '薪資計算',
    subtitle: '實領薪資試算',
    description: '2025年最新勞健保費率，精準計算實際到手薪資',
    href: '/salary',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    popular: true,
    features: ['勞健保計算', '年終獎金', '歷史比較']
  },
  {
    id: 'mortgage',
    icon: Home,
    title: '房貸試算',
    subtitle: '購屋貸款規劃',
    description: '月付金、總利息完整分析，支援新青安房貸',
    href: '/mortgage',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    features: ['月付金計算', '利息分析', '還款規劃']
  },
  {
    id: 'tax',
    icon: TrendingUp,
    title: '稅務規劃',
    subtitle: '綜所稅試算',
    description: '2025年綜合所得稅試算，節稅策略建議',
    href: '/tax',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50',
    features: ['所得稅計算', '節稅建議', '扣除額優化']
  },
  {
    id: 'investment',
    icon: PiggyBank,
    title: '投資理財',
    subtitle: '複利計算',
    description: '投資報酬率計算、資產配置建議',
    href: '/capital',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    features: ['複利計算', '資產配置', '風險評估']
  },
];

const features = [
  {
    icon: Shield,
    title: '隱私安全',
    description: '所有計算在您的裝置上進行，不會上傳任何個人資料'
  },
  {
    icon: Zap,
    title: '即時更新',
    description: '自動同步最新法規變更，確保計算結果準確'
  },
  {
    icon: Users,
    title: '台灣專用',
    description: '專為台灣稅制設計，符合本地法規要求'
  }
];

const quickStats = [
  { label: '基本工資', value: '27,470', unit: '元/月', change: '+3.35%' },
  { label: '勞保費率', value: '12%', unit: '個人負擔20%', change: '維持' },
  { label: '健保費率', value: '5.17%', unit: '個人負擔30%', change: '維持' }
];

export default function HomePage() {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 px-4 overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-cyan-200/20 rounded-full blur-3xl" />
          <div className="absolute top-40 -left-32 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* 主標題區域 */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                2025年最新版本
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                台灣人的
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  智慧財務
                </span>
                <br />計算平台
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                薪資、房貸、稅務、投資一站搞定<br />
                使用最新法規，計算最準確，完全免費
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/salary"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  開始計算薪資
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/knowledge"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
                >
                  <BookOpen className="w-5 h-5" />
                  理財知識庫
                </Link>
              </div>
            </motion.div>
          </div>

          {/* 計算器卡片網格 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {calculators.map((calc, index) => (
              <motion.div
                key={calc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onHoverStart={() => setActiveCalculator(calc.id)}
                onHoverEnd={() => setActiveCalculator(null)}
                className="group"
              >
                <Link href={calc.href} className="block">
                  <div className={`relative p-6 bg-gradient-to-br ${calc.bgGradient} rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}>
                    {/* 熱門標籤 */}
                    {calc.popular && (
                      <div className="absolute -top-1 -right-1 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full transform rotate-12">
                        熱門
                      </div>
                    )}
                    
                    {/* 圖標和標題 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-br ${calc.gradient} rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}>
                        <calc.icon className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {calc.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium mb-2">
                        {calc.subtitle}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {calc.description}
                      </p>
                    </div>

                    {/* 功能特色 */}
                    <div className="space-y-1">
                      {calc.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* 懸停效果 */}
                    <AnimatePresence>
                      {activeCalculator === calc.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                        >
                          <div className="text-center">
                            <Play className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-700">立即開始</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 快速資訊區 */}
      <section className="py-12 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              2025年最新資訊
            </h2>
            <p className="text-gray-600">即時更新的法規資訊</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 mb-2">{stat.unit}</div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.change.includes('+') 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 特色說明 */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              為什麼選擇 TaiCalc？
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              專為台灣使用者設計，提供最準確、最安全的財務計算服務
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI 服務狀態 */}
      {/* 服務狀態區塊已移除 */}

      {/* CTA 區域 */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            開始您的財務規劃之旅
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            立即使用我們的計算器，做出更明智的財務決策
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/salary"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              開始計算
            </Link>
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              學習理財
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}