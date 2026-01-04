'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, CheckCircle } from 'lucide-react';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  isReporting: boolean;
  reportSent: boolean;
  showDetails: boolean;
}

interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReporting?: boolean;
  maxRetries?: number;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

/**
 * 增強的錯誤邊界組件
 * 提供錯誤恢復、錯誤報告、重試機制等功能
 */
export class EnhancedErrorBoundary extends Component<
  EnhancedErrorBoundaryProps,
  ErrorBoundaryState
> {
  private resetTimeoutId: number | null = null;

  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      isReporting: false,
      reportSent: false,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 生成唯一的錯誤 ID
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Enhanced Error Boundary caught an error:', error, errorInfo);

    this.setState({
      errorInfo
    });

    // 調用外部錯誤處理器
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 自動報告錯誤（如果啟用）
    if (this.props.enableReporting) {
      this.reportError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: EnhancedErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // 如果啟用了 props 變化重置且當前有錯誤
    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => prevProps.resetKeys?.[index] !== key
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  /**
   * 報告錯誤到服務器
   */
  private async reportError(error: Error, errorInfo: ErrorInfo) {
    this.setState({ isReporting: true });

    try {
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userId: this.getUserId(), // 如果有用戶系統
        sessionId: this.getSessionId()
      };

      // 發送錯誤報告（這裡可以替換為實際的錯誤報告服務）
      await fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });

      this.setState({ reportSent: true });
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    } finally {
      this.setState({ isReporting: false });
    }
  }

  /**
   * 獲取用戶 ID（如果有用戶系統）
   */
  private getUserId(): string | null {
    // 這裡可以從 localStorage、cookies 或 context 中獲取用戶 ID
    return localStorage.getItem('userId') || null;
  }

  /**
   * 獲取會話 ID
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  /**
   * 重置錯誤邊界
   */
  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: prevState.retryCount + 1,
      isReporting: false,
      reportSent: false,
      showDetails: false
    }));
  };

  /**
   * 重試操作（帶延遲）
   */
  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      alert(`已達到最大重試次數 (${maxRetries})，請重新整理頁面或聯繫技術支援。`);
      return;
    }

    // 漸進式延遲重試
    const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
    
    this.resetTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, delay);
  };

  /**
   * 複製錯誤信息到剪貼板
   */
  private copyErrorInfo = async () => {
    const { error, errorInfo, errorId } = this.state;
    
    const errorText = `
錯誤 ID: ${errorId}
錯誤訊息: ${error?.message}
發生時間: ${new Date().toLocaleString('zh-TW')}
頁面 URL: ${window.location.href}
用戶代理: ${navigator.userAgent}

錯誤堆疊:
${error?.stack}

組件堆疊:
${errorInfo?.componentStack}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      // 可以顯示一個短暫的成功提示
      alert('錯誤信息已複製到剪貼板');
    } catch (err) {
      console.error('Failed to copy error info:', err);
      // 降級方案：選擇文本
      const textArea = document.createElement('textarea');
      textArea.value = errorText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('錯誤信息已複製到剪貼板');
    }
  };

  /**
   * 切換錯誤詳情顯示
   */
  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    const { hasError, error, errorId, retryCount, isReporting, reportSent, showDetails } = this.state;
    const { children, fallback, maxRetries = 3 } = this.props;

    if (hasError) {
      // 如果提供了自定義 fallback，使用它
      if (fallback) {
        return fallback;
      }

      // 默認錯誤 UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border p-8">
            {/* 錯誤圖標和標題 */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">發生錯誤</h2>
              <p className="text-gray-600 text-sm">
                很抱歉，應用程式遇到了問題。我們已記錄此錯誤並正在處理。
              </p>
            </div>

            {/* 錯誤 ID */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">錯誤 ID:</span>
                <code className="text-xs font-mono text-gray-700">{errorId}</code>
              </div>
            </div>

            {/* 重試信息 */}
            {retryCount > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  重試次數: {retryCount}/{maxRetries}
                </p>
              </div>
            )}

            {/* 錯誤報告狀態 */}
            {this.props.enableReporting && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  {isReporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="text-sm text-blue-800">正在發送錯誤報告...</span>
                    </>
                  ) : reportSent ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">錯誤報告已發送</span>
                    </>
                  ) : (
                    <>
                      <Bug className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-800">錯誤報告功能已啟用</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 操作按鈕 */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  onClick={this.handleRetry}
                  disabled={retryCount >= maxRetries}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>重試</span>
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>返回首頁</span>
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={this.copyErrorInfo}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>複製錯誤信息</span>
                </button>

                <button
                  onClick={this.toggleDetails}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {showDetails ? '隱藏詳情' : '顯示詳情'}
                </button>
              </div>
            </div>

            {/* 錯誤詳情 */}
            {showDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">錯誤詳情</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">錯誤訊息:</p>
                    <p className="text-xs font-mono text-red-600 break-all">{error?.message}</p>
                  </div>
                  {error?.stack && (
                    <div>
                      <p className="text-xs text-gray-500">錯誤堆疊:</p>
                      <pre className="text-xs font-mono text-gray-600 bg-white p-2 rounded border overflow-x-auto max-h-32">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * Hook 版本的錯誤邊界（用於函數組件）
 */
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // 可以在這裡添加錯誤報告邏輯
    if (typeof window !== 'undefined') {
      // 發送錯誤報告
      fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch(reportError => {
        console.error('Failed to report error:', reportError);
      });
    }
  }, []);

  return handleError;
}

export default EnhancedErrorBoundary;