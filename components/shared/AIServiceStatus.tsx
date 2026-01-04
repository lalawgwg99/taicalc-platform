'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Settings, ExternalLink } from 'lucide-react';

interface AIServiceStatusProps {
  className?: string;
}

interface ServiceStatus {
  available: boolean;
  error?: string;
  code?: string;
  suggestion?: string;
}

export default function AIServiceStatus({ className = '' }: AIServiceStatusProps) {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkServiceStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: '測試連線' }]
        }),
      });

      if (response.ok) {
        setStatus({ available: true });
      } else {
        const errorData = await response.json();
        setStatus({
          available: false,
          error: errorData.error || '服務無法使用',
          code: errorData.code,
          suggestion: errorData.suggestion
        });
      }
    } catch (error) {
      setStatus({
        available: false,
        error: '無法連接到 AI 服務',
        code: 'CONNECTION_ERROR',
        suggestion: '請檢查網路連線或聯繫管理員'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServiceStatus();
  }, []);

  if (loading) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg border ${className}`}>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-sm text-gray-600">檢查 AI 服務狀態...</span>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  if (status.available) {
    return (
      <div className={`p-4 bg-green-50 rounded-lg border border-green-200 ${className}`}>
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-green-800">AI 服務正常運作</p>
            <p className="text-xs text-green-600">您可以使用所有 AI 功能</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-red-50 rounded-lg border border-red-200 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">AI 服務暫時無法使用</p>
          <p className="text-xs text-red-600 mt-1">{status.error}</p>
          
          {status.suggestion && (
            <p className="text-xs text-red-600 mt-2">💡 {status.suggestion}</p>
          )}

          {status.code === 'API_KEY_MISSING' && (
            <div className="mt-3 p-3 bg-white rounded border">
              <p className="text-xs font-medium text-gray-800 mb-2">設定說明：</p>
              <ol className="text-xs text-gray-600 space-y-1">
                <li>1. 前往 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Google AI Studio <ExternalLink className="w-3 h-3 ml-1" /></a> 獲取 API 金鑰</li>
                <li>2. 複製 .env.example 為 .env.local</li>
                <li>3. 在 .env.local 中設定 GOOGLE_GENERATIVE_AI_API_KEY</li>
                <li>4. 重新啟動應用程式</li>
              </ol>
            </div>
          )}

          <div className="mt-3 flex space-x-2">
            <button
              onClick={checkServiceStatus}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            >
              重新檢查
            </button>
            
            {status.code === 'API_KEY_MISSING' && (
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Settings className="w-3 h-3 mr-1" />
                獲取 API 金鑰
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}