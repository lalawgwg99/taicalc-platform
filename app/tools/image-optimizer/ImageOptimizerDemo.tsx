'use client';

import React, { useState, useRef } from 'react';
import OptimizedImage, { ResponsiveImage, ImageGallery } from '@/components/shared/OptimizedImage';
import { useImageOptimization } from '@/hooks/useImageOptimization';
import { ImageAsset } from '@/lib/image-optimization/types';
import { Upload, Download, Eye, Settings, Zap } from 'lucide-react';

// 示例圖片數據
const sampleImages: ImageAsset[] = [
  {
    src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    alt: '財務規劃概念圖',
    width: 800,
    height: 600,
    priority: true
  },
  {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    alt: '數據分析圖表',
    width: 800,
    height: 600
  },
  {
    src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
    alt: '投資理財',
    width: 800,
    height: 600
  },
  {
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    alt: '商業分析',
    width: 800,
    height: 600
  },
  {
    src: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop',
    alt: '計算器工具',
    width: 800,
    height: 600
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    alt: '財務報表',
    width: 800,
    height: 600
  }
];

export default function ImageOptimizerDemo() {
  const [activeTab, setActiveTab] = useState<'single' | 'responsive' | 'gallery'>('single');
  const [selectedImage, setSelectedImage] = useState(sampleImages[0]);
  const [quality, setQuality] = useState(85);
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    optimizedImages,
    isLoading,
    error,
    optimizeImages,
    enableLazyLoading,
    clearError
  } = useImageOptimization({ quality });

  const galleryRef = useRef<HTMLDivElement>(null);

  const handleOptimizeImage = () => {
    optimizeImages([{ ...selectedImage, quality }]);
  };

  const handleEnableLazyLoading = () => {
    if (galleryRef.current) {
      enableLazyLoading(galleryRef.current);
    }
  };

  const tabs = [
    { id: 'single', label: '單張圖片優化', icon: Eye },
    { id: 'responsive', label: '響應式圖片', icon: Settings },
    { id: 'gallery', label: '圖片畫廊', icon: Zap }
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* 標籤頁導航 */}
      <div className="border-b">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* 錯誤顯示 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-red-800 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                關閉
              </button>
            </div>
          </div>
        )}

        {/* 單張圖片優化 */}
        {activeTab === 'single' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">單張圖片優化演示</h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>設定</span>
              </button>
            </div>

            {/* 設定面板 */}
            {showSettings && (
              <div className="p-4 bg-gray-50 rounded-md border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      圖片品質: {quality}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      選擇示例圖片
                    </label>
                    <select
                      value={selectedImage.src}
                      onChange={(e) => {
                        const image = sampleImages.find(img => img.src === e.target.value);
                        if (image) setSelectedImage(image);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {sampleImages.map((img, index) => (
                        <option key={index} value={img.src}>
                          {img.alt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 圖片顯示 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">原始圖片</h4>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  尺寸: {selectedImage.width} × {selectedImage.height}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">優化後圖片</h4>
                <div className="border rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    width={selectedImage.width}
                    height={selectedImage.height}
                    quality={quality}
                    className="w-full h-64 object-cover"
                    priority={true}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  品質: {quality}% | 格式: WebP/AVIF (自動選擇)
                </p>
              </div>
            </div>

            {/* 優化按鈕 */}
            <div className="flex justify-center">
              <button
                onClick={handleOptimizeImage}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>{isLoading ? '優化中...' : '開始優化'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 響應式圖片 */}
        {activeTab === 'responsive' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">響應式圖片演示</h3>
            <p className="text-gray-600">
              調整瀏覽器視窗大小，觀察圖片如何自動適應不同螢幕尺寸
            </p>

            <div className="space-y-4">
              <ResponsiveImage
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop"
                alt="響應式圖片演示"
                className="w-full rounded-lg shadow-md"
                priority={true}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResponsiveImage
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                  alt="數據分析"
                  className="w-full rounded-lg"
                />
                <ResponsiveImage
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop"
                  alt="投資理財"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">響應式特性</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 自動選擇最適合的圖片尺寸</li>
                <li>• 支援高解析度螢幕 (Retina)</li>
                <li>• 根據網路速度調整品質</li>
                <li>• 減少不必要的頻寬使用</li>
              </ul>
            </div>
          </div>
        )}

        {/* 圖片畫廊 */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">延遲載入圖片畫廊</h3>
              <button
                onClick={handleEnableLazyLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>啟用延遲載入</span>
              </button>
            </div>

            <p className="text-gray-600">
              向下滾動觀察圖片的延遲載入效果。只有進入視窗的圖片才會開始載入。
            </p>

            <div ref={galleryRef}>
              <ImageGallery
                images={sampleImages}
                columns={3}
                className="gap-4"
                itemClassName="aspect-square"
              />
            </div>

            <div className="p-4 bg-green-50 rounded-md">
              <h4 className="font-medium text-green-900 mb-2">延遲載入優勢</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• 減少初始頁面載入時間</li>
                <li>• 節省用戶頻寬使用量</li>
                <li>• 改善頁面性能指標</li>
                <li>• 提升用戶體驗</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}