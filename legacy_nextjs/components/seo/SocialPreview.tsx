/**
 * 社交媒體預覽組件 - 用於生成和預覽社交媒體分享內容
 */

'use client';

import { useState, useEffect } from 'react';
import { CalculatorType } from '@/lib/seo/seo-optimizer';

interface SocialPreviewProps {
  calculatorType: CalculatorType;
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  resultData?: any; // 計算結果數據，用於動態生成預覽
}

interface PreviewData {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export function SocialPreview({ 
  calculatorType, 
  title, 
  description, 
  imageUrl, 
  url,
  resultData 
}: SocialPreviewProps) {
  const [previewType, setPreviewType] = useState<'facebook' | 'twitter' | 'linkedin' | 'line'>('facebook');
  const [dynamicPreview, setDynamicPreview] = useState<PreviewData | null>(null);
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taicalc.com';
  
  // 生成動態預覽數據
  useEffect(() => {
    if (resultData) {
      const dynamicData = generateDynamicPreviewData(calculatorType, resultData, title, description);
      setDynamicPreview(dynamicData);
    }
  }, [calculatorType, resultData, title, description]);
  
  const previewData: PreviewData = dynamicPreview || {
    title,
    description,
    imageUrl: imageUrl || `${baseUrl}/images/og/${calculatorType}-calculator.png`,
    url: url || `${baseUrl}/${calculatorType}`
  };

  const renderFacebookPreview = () => (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-md shadow-sm">
      <div className="relative">
        <img 
          src={previewData.imageUrl} 
          alt={previewData.title}
          className="w-full h-48 object-cover bg-gray-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `${baseUrl}/images/og/default-calculator.png`;
          }}
        />
        {/* Facebook 播放按鈕覆蓋層（如果是視頻內容） */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="text-xs text-gray-500 uppercase mb-1 flex items-center">
          <span className="w-4 h-4 bg-blue-600 rounded mr-2"></span>
          {new URL(previewData.url).hostname}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 hover:underline cursor-pointer">
          {previewData.title}
        </h3>
        <p className="text-gray-600 text-xs line-clamp-2">
          {previewData.description}
        </p>
        {/* Facebook 互動按鈕 */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <button className="flex items-center space-x-1 hover:text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.641 1.05-1.09 1.47A14.73 14.73 0 0112 15.75c0 .896-.393 1.7-1.016 2.25"/>
              </svg>
              <span>讚</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22l-1.344-4.992z"/>
              </svg>
              <span>留言</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/>
              </svg>
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white max-w-md shadow-sm">
      <div className="p-3">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">TC</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 text-sm">TaiCalc 數策</span>
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="text-gray-500 text-sm">@taicalc</span>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm">現在</span>
            </div>
            <p className="text-gray-900 text-sm mt-1">
              {previewData.description.length > 100 
                ? previewData.description.substring(0, 100) + '...' 
                : previewData.description}
            </p>
          </div>
        </div>
      </div>
      <img 
        src={previewData.imageUrl} 
        alt={previewData.title}
        className="w-full h-48 object-cover bg-gray-200"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `${baseUrl}/images/og/default-calculator.png`;
        }}
      />
      <div className="p-3 border-t border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
          {previewData.title}
        </h3>
        <div className="text-xs text-gray-500 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          {new URL(previewData.url).hostname}
        </div>
        {/* Twitter 互動按鈕 */}
        <div className="flex items-center justify-between mt-3 text-gray-500">
          <button className="flex items-center space-x-1 hover:text-blue-500 text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22l-1.344-4.992z"/>
            </svg>
            <span>12</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-green-500 text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>8</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-red-500 text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/>
            </svg>
            <span>25</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-500 text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0zM6.697 15.126a.5.5 0 01-.606-.606L8 12l-1.909-2.52a.5.5 0 01.606-.606L9 10l2.303-1.126a.5.5 0 01.606.606L10 12l1.909 2.52a.5.5 0 01-.606.606L9 14l-2.303 1.126z"/>
            </svg>
            <span>分享</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-md shadow-sm">
      <div className="p-4">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">TC</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">TaiCalc 數策</div>
            <div className="text-sm text-gray-500">財務計算工具平台</div>
            <div className="text-xs text-gray-400">1小時前</div>
          </div>
        </div>
        <p className="text-gray-900 text-sm mb-3">
          {previewData.description}
        </p>
      </div>
      <img 
        src={previewData.imageUrl} 
        alt={previewData.title}
        className="w-full h-48 object-cover bg-gray-200"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `${baseUrl}/images/og/default-calculator.png`;
        }}
      />
      <div className="p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
          {previewData.title}
        </h3>
        <div className="text-xs text-gray-500 flex items-center mb-3">
          <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
          {new URL(previewData.url).hostname}
        </div>
        {/* LinkedIn 互動按鈕 */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <button className="flex items-center space-x-2 hover:text-blue-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.641 1.05-1.09 1.47A14.73 14.73 0 0112 15.75c0 .896-.393 1.7-1.016 2.25"/>
            </svg>
            <span>讚</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22l-1.344-4.992z"/>
            </svg>
            <span>留言</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0zM6.697 15.126a.5.5 0 01-.606-.606L8 12l-1.909-2.52a.5.5 0 01.606-.606L9 10l2.303-1.126a.5.5 0 01.606.606L10 12l1.909 2.52a.5.5 0 01-.606.606L9 14l-2.303 1.126z"/>
            </svg>
            <span>分享</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderLinePreview = () => (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-md shadow-sm">
      <div className="bg-green-500 p-2 flex items-center">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
          <span className="text-green-500 font-bold text-sm">TC</span>
        </div>
        <div className="text-white">
          <div className="font-medium text-sm">TaiCalc 數策</div>
          <div className="text-xs opacity-90">剛剛</div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-gray-900 text-sm mb-3">
          {previewData.description}
        </p>
      </div>
      <img 
        src={previewData.imageUrl} 
        alt={previewData.title}
        className="w-full h-48 object-cover bg-gray-200"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `${baseUrl}/images/og/default-calculator.png`;
        }}
      />
      <div className="p-3 bg-gray-50">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
          {previewData.title}
        </h3>
        <div className="text-xs text-gray-500">
          {new URL(previewData.url).hostname}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={() => setPreviewType('facebook')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            previewType === 'facebook' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Facebook
        </button>
        <button
          onClick={() => setPreviewType('twitter')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            previewType === 'twitter' 
              ? 'bg-blue-400 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Twitter
        </button>
        <button
          onClick={() => setPreviewType('linkedin')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            previewType === 'linkedin' 
              ? 'bg-blue-700 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          LinkedIn
        </button>
        <button
          onClick={() => setPreviewType('line')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            previewType === 'line' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          LINE
        </button>
      </div>
      
      <div className="flex justify-center">
        {previewType === 'facebook' && renderFacebookPreview()}
        {previewType === 'twitter' && renderTwitterPreview()}
        {previewType === 'linkedin' && renderLinkedInPreview()}
        {previewType === 'line' && renderLinePreview()}
      </div>
      
      <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
        <div><strong>標題:</strong> {previewData.title}</div>
        <div><strong>描述:</strong> {previewData.description}</div>
        <div><strong>圖片:</strong> {previewData.imageUrl}</div>
        <div><strong>網址:</strong> {previewData.url}</div>
        {resultData && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-green-600 font-medium">✓ 包含計算結果的動態預覽</div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 生成動態預覽數據（基於計算結果）
 */
function generateDynamicPreviewData(
  calculatorType: CalculatorType,
  resultData: any,
  originalTitle: string,
  originalDescription: string
): PreviewData {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taicalc.com';
  
  let dynamicTitle = originalTitle;
  let dynamicDescription = originalDescription;
  
  // 根據計算器類型和結果數據生成動態內容
  switch (calculatorType) {
    case 'salary':
      if (resultData.monthly?.net && resultData.monthly?.gross) {
        dynamicTitle = `薪資計算結果 - 月薪 ${resultData.monthly.gross.toLocaleString()} 實領 ${resultData.monthly.net.toLocaleString()} | TaiCalc`;
        dynamicDescription = `月薪 NT$ ${resultData.monthly.gross.toLocaleString()}，扣除勞健保後實領 NT$ ${resultData.monthly.net.toLocaleString()}。使用 TaiCalc 精準計算您的薪資。`;
      }
      break;
    case 'mortgage':
      if (resultData.monthlyPayment && resultData.totalInterest) {
        dynamicTitle = `房貸試算結果 - 每月還款 ${resultData.monthlyPayment.toLocaleString()} | TaiCalc`;
        dynamicDescription = `每月還款 NT$ ${resultData.monthlyPayment.toLocaleString()}，總利息 NT$ ${resultData.totalInterest.toLocaleString()}。立即使用 TaiCalc 試算您的房貸。`;
      }
      break;
    case 'investment':
      if (resultData.finalAmount && resultData.totalReturn) {
        dynamicTitle = `投資複利計算結果 - 最終金額 ${resultData.finalAmount.toLocaleString()} | TaiCalc`;
        dynamicDescription = `投資收益 NT$ ${resultData.totalReturn.toLocaleString()}，最終金額 NT$ ${resultData.finalAmount.toLocaleString()}。體驗複利的威力。`;
      }
      break;
    // 可以為其他計算器類型添加更多動態內容生成邏輯
  }
  
  return {
    title: dynamicTitle,
    description: dynamicDescription,
    imageUrl: `${baseUrl}/images/og/${calculatorType}-calculator.png`,
    url: `${baseUrl}/${calculatorType}`
  };
}

/**
 * 生成社交媒體分享連結
 */
export function generateSocialShareLinks(
  url: string,
  title: string,
  description: string
): Record<string, string> {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };
}

/**
 * 社交媒體分享按鈕組件
 */
interface SocialShareButtonsProps {
  url: string;
  title: string;
  description: string;
  className?: string;
}

export function SocialShareButtons({ 
  url, 
  title, 
  description, 
  className = '' 
}: SocialShareButtonsProps) {
  const shareLinks = generateSocialShareLinks(url, title, description);
  
  const handleShare = (platform: string, shareUrl: string) => {
    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={() => handleShare('facebook', shareLinks.facebook)}
        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </button>
      
      <button
        onClick={() => handleShare('line', shareLinks.line)}
        className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z"/>
        </svg>
        LINE
      </button>
      
      <button
        onClick={() => handleShare('email', shareLinks.email)}
        className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
        Email
      </button>
    </div>
  );
}