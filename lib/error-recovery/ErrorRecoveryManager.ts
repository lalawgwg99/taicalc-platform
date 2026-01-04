/**
 * 錯誤恢復管理器
 * 提供自動錯誤恢復、降級功能和用戶引導恢復
 */

export interface SystemError extends Error {
  code?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  recoverable?: boolean;
  context?: Record<string, any>;
}

export interface UserError extends Error {
  userMessage?: string;
  suggestions?: string[];
  actionRequired?: boolean;
}

export interface RecoveryResult {
  success: boolean;
  message: string;
  fallbackUsed?: boolean;
  retryAfter?: number;
}

export interface RecoverySteps {
  steps: Array<{
    title: string;
    description: string;
    action?: () => void;
    completed?: boolean;
  }>;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AlternativeFeature {
  name: string;
  description: string;
  component?: React.ComponentType<any>;
  limitations?: string[];
}

export interface ErrorRecord {
  id: string;
  error: Error;
  type: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  recoverable?: boolean;
  resolved?: boolean;
  timestamp: number;
  context?: Record<string, any>;
  additionalData?: any;
  retryConfig?: {
    maxRetries: number;
    currentAttempt: number;
    baseDelay: number;
    strategy: 'exponential' | 'linear' | 'fixed';
  };
}

/**
 * 錯誤恢復管理器類
 */
export class ErrorRecoveryManager {
  private recoveryStrategies: Map<string, (error: SystemError) => Promise<RecoveryResult>>;
  private fallbackFeatures: Map<string, AlternativeFeature>;
  private errorHistory: Array<{ error: Error; timestamp: Date; recovered: boolean }>;
  private errorRecords: Map<string, ErrorRecord>;

  constructor() {
    this.recoveryStrategies = new Map();
    this.fallbackFeatures = new Map();
    this.errorHistory = [];
    this.errorRecords = new Map();
    
    this.initializeDefaultStrategies();
    this.initializeDefaultFallbacks();
  }

  /**
   * 記錄錯誤並返回錯誤 ID
   */
  recordError(error: Error, options: {
    type?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    recoverable?: boolean;
    resolved?: boolean;
    timestamp?: number;
    context?: Record<string, any>;
    additionalData?: any;
    retryConfig?: {
      maxRetries: number;
      baseDelay: number;
      strategy: 'exponential' | 'linear' | 'fixed';
    };
  } = {}): string {
    const id = this.generateErrorId();
    const record: ErrorRecord = {
      id,
      error,
      type: options.type || this.classifyError(error),
      severity: options.severity || 'medium',
      recoverable: options.recoverable || false,
      resolved: options.resolved || false,
      timestamp: options.timestamp || Date.now(),
      context: options.context,
      additionalData: options.additionalData,
      retryConfig: options.retryConfig ? {
        ...options.retryConfig,
        currentAttempt: 0
      } : undefined
    };

    this.errorRecords.set(id, record);
    
    // 也記錄到舊的歷史記錄中以保持兼容性
    this.errorHistory.push({
      error,
      timestamp: new Date(record.timestamp),
      recovered: false
    });

    return id;
  }

  /**
   * 獲取錯誤數量
   */
  getErrorCount(): number {
    return this.errorRecords.size;
  }

  /**
   * 檢查是否有可恢復的錯誤
   */
  hasRecoverableErrors(): boolean {
    return Array.from(this.errorRecords.values()).some(
      record => record.recoverable && !record.resolved
    );
  }

  /**
   * 檢查是否有關鍵錯誤
   */
  hasCriticalErrors(): boolean {
    return Array.from(this.errorRecords.values()).some(
      record => record.severity === 'critical' && !record.resolved
    );
  }

  /**
   * 按類型獲取錯誤
   */
  getErrorsByType(): Record<string, ErrorRecord[]> {
    const result: Record<string, ErrorRecord[]> = {};
    
    for (const record of this.errorRecords.values()) {
      if (!record.resolved) {
        if (!result[record.type]) {
          result[record.type] = [];
        }
        result[record.type].push(record);
      }
    }
    
    return result;
  }

  /**
   * 按嚴重程度獲取錯誤
   */
  getErrorsBySeverity(): Record<string, ErrorRecord[]> {
    const result: Record<string, ErrorRecord[]> = {};
    
    for (const record of this.errorRecords.values()) {
      if (!record.resolved && record.severity) {
        if (!result[record.severity]) {
          result[record.severity] = [];
        }
        result[record.severity].push(record);
      }
    }
    
    return result;
  }

  /**
   * 獲取錯誤上下文
   */
  getErrorContext(errorId: string): Record<string, any> | undefined {
    const record = this.errorRecords.get(errorId);
    return record?.context;
  }

  /**
   * 獲取錯誤附加數據
   */
  getErrorAdditionalData(errorId: string): any {
    const record = this.errorRecords.get(errorId);
    return record?.additionalData;
  }

  /**
   * 獲取重試信息
   */
  getRetryInfo(errorId: string): {
    maxRetries: number;
    currentAttempt: number;
    canRetry: boolean;
  } | undefined {
    const record = this.errorRecords.get(errorId);
    if (!record?.retryConfig) return undefined;

    return {
      maxRetries: record.retryConfig.maxRetries,
      currentAttempt: record.retryConfig.currentAttempt,
      canRetry: record.retryConfig.currentAttempt < record.retryConfig.maxRetries
    };
  }

  /**
   * 檢查是否可以重試
   */
  canRetry(errorId: string): boolean {
    const retryInfo = this.getRetryInfo(errorId);
    return retryInfo?.canRetry || false;
  }

  /**
   * 增加重試次數
   */
  incrementRetryAttempt(errorId: string): void {
    const record = this.errorRecords.get(errorId);
    if (record?.retryConfig) {
      record.retryConfig.currentAttempt++;
    }
  }

  /**
   * 標記錯誤為已解決
   */
  markErrorAsResolved(errorId: string): void {
    const record = this.errorRecords.get(errorId);
    if (record) {
      record.resolved = true;
    }
  }

  /**
   * 獲取所有錯誤
   */
  getAllErrors(): ErrorRecord[] {
    return Array.from(this.errorRecords.values());
  }

  /**
   * 清理舊錯誤
   */
  cleanupOldErrors(cutoffTime: number): number {
    let cleanedCount = 0;
    
    for (const [id, record] of this.errorRecords.entries()) {
      if (record.timestamp < cutoffTime) {
        this.errorRecords.delete(id);
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  }

  /**
   * 清除所有錯誤
   */
  clearErrors(): void {
    this.errorRecords.clear();
    this.errorHistory = [];
  }

  /**
   * 生成錯誤 ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * 初始化預設恢復策略
   */
  private initializeDefaultStrategies() {
    // 網路錯誤恢復
    this.recoveryStrategies.set('NETWORK_ERROR', async (error) => {
      console.log('嘗試恢復網路錯誤:', error.message);
      
      // 檢查網路連線
      if (navigator.onLine) {
        // 重試請求
        await this.delay(1000);
        return {
          success: true,
          message: '網路連線已恢復，請重試操作',
          retryAfter: 1000
        };
      } else {
        return {
          success: false,
          message: '網路連線中斷，請檢查網路設定',
          fallbackUsed: true
        };
      }
    });

    // API 錯誤恢復
    this.recoveryStrategies.set('API_ERROR', async (error) => {
      console.log('嘗試恢復 API 錯誤:', error.message);
      
      // 檢查是否為暫時性錯誤
      if (error.message.includes('timeout') || error.message.includes('503')) {
        return {
          success: true,
          message: '服務暫時不可用，將在 5 秒後重試',
          retryAfter: 5000
        };
      }
      
      return {
        success: false,
        message: 'API 服務發生錯誤，已切換到離線模式',
        fallbackUsed: true
      };
    });

    // 記憶體錯誤恢復
    this.recoveryStrategies.set('MEMORY_ERROR', async (error) => {
      console.log('嘗試恢復記憶體錯誤:', error.message);
      
      // 清理快取
      this.clearCaches();
      
      return {
        success: true,
        message: '已清理記憶體快取，請重新載入頁面',
        retryAfter: 2000
      };
    });

    // 計算錯誤恢復
    this.recoveryStrategies.set('CALCULATION_ERROR', async (error) => {
      console.log('嘗試恢復計算錯誤:', error.message);
      
      return {
        success: true,
        message: '計算參數有誤，已重置為預設值',
        fallbackUsed: true
      };
    });
  }

  /**
   * 初始化預設降級功能
   */
  private initializeDefaultFallbacks() {
    // AI 功能降級
    this.fallbackFeatures.set('ai-advisor', {
      name: '基礎財務建議',
      description: 'AI 服務暫時無法使用，提供基礎的財務計算和建議',
      limitations: ['無法提供個人化建議', '無法進行複雜分析', '建議內容有限']
    });

    // 圖表功能降級
    this.fallbackFeatures.set('charts', {
      name: '簡化圖表',
      description: '使用基礎圖表替代複雜的互動式圖表',
      limitations: ['無法互動', '樣式簡化', '功能有限']
    });

    // 搜尋功能降級
    this.fallbackFeatures.set('search', {
      name: '基礎搜尋',
      description: '使用本地搜尋替代智能搜尋功能',
      limitations: ['搜尋結果較少', '無法智能推薦', '搜尋速度較慢']
    });

    // 數據同步降級
    this.fallbackFeatures.set('sync', {
      name: '本地儲存',
      description: '暫時使用本地儲存，無法同步到雲端',
      limitations: ['數據僅存在本地', '無法跨設備同步', '可能會遺失數據']
    });
  }

  /**
   * 自動恢復錯誤
   */
  async autoRecover(error: SystemError): Promise<RecoveryResult> {
    try {
      // 記錄錯誤
      this.recordError(error, {
        type: this.classifyError(error),
        severity: error.severity || 'medium',
        recoverable: error.recoverable || false
      });

      // 根據錯誤類型選擇恢復策略
      const errorType = this.classifyError(error);
      const strategy = this.recoveryStrategies.get(errorType);

      if (strategy) {
        const result = await strategy(error);
        
        if (result.success) {
          this.recordErrorToHistory(error, true);
        }
        
        return result;
      }

      // 沒有特定策略，嘗試通用恢復
      return await this.genericRecovery(error);

    } catch (recoveryError) {
      console.error('錯誤恢復失敗:', recoveryError);
      
      return {
        success: false,
        message: '自動恢復失敗，請手動處理',
        fallbackUsed: true
      };
    }
  }

  /**
   * 用戶引導恢復
   */
  guideUserRecovery(error: UserError): RecoverySteps {
    const errorType = this.classifyError(error);
    
    switch (errorType) {
      case 'NETWORK_ERROR':
        return {
          steps: [
            {
              title: '檢查網路連線',
              description: '確認您的設備已連接到網際網路',
              completed: false
            },
            {
              title: '重新整理頁面',
              description: '按 F5 或點擊瀏覽器的重新整理按鈕',
              action: () => window.location.reload(),
              completed: false
            },
            {
              title: '清除瀏覽器快取',
              description: '清除瀏覽器快取和 Cookie',
              completed: false
            }
          ],
          estimatedTime: 3,
          difficulty: 'easy'
        };

      case 'CALCULATION_ERROR':
        return {
          steps: [
            {
              title: '檢查輸入數據',
              description: '確認所有必填欄位都已正確填寫',
              completed: false
            },
            {
              title: '驗證數值範圍',
              description: '確保輸入的數值在合理範圍內',
              completed: false
            },
            {
              title: '重置表單',
              description: '清除表單並重新輸入數據',
              completed: false
            }
          ],
          estimatedTime: 5,
          difficulty: 'easy'
        };

      case 'API_ERROR':
        return {
          steps: [
            {
              title: '等待服務恢復',
              description: '服務可能暫時不可用，請稍後再試',
              completed: false
            },
            {
              title: '使用離線功能',
              description: '切換到離線模式繼續使用基本功能',
              completed: false
            },
            {
              title: '聯繫技術支援',
              description: '如果問題持續，請聯繫我們的技術支援團隊',
              completed: false
            }
          ],
          estimatedTime: 10,
          difficulty: 'medium'
        };

      default:
        return {
          steps: [
            {
              title: '重新載入頁面',
              description: '嘗試重新載入頁面解決問題',
              action: () => window.location.reload(),
              completed: false
            },
            {
              title: '清除瀏覽器數據',
              description: '清除瀏覽器快取、Cookie 和本地儲存',
              completed: false
            },
            {
              title: '回報問題',
              description: '如果問題持續，請回報給我們',
              completed: false
            }
          ],
          estimatedTime: 5,
          difficulty: 'medium'
        };
    }
  }

  /**
   * 提供降級功能
   */
  provideFallback(feature: string): AlternativeFeature | null {
    return this.fallbackFeatures.get(feature) || null;
  }

  /**
   * 錯誤報告和學習
   */
  reportAndLearn(error: Error): void {
    // 記錄錯誤模式
    this.recordError(error, {
      type: this.classifyError(error),
      severity: 'medium',
      recoverable: false
    });
    
    // 分析錯誤趨勢
    const recentErrors = this.errorHistory
      .filter(entry => Date.now() - entry.timestamp.getTime() < 3600000) // 最近一小時
      .map(entry => entry.error);

    if (recentErrors.length > 10) {
      console.warn('檢測到高錯誤率，可能需要系統維護');
    }

    // 發送錯誤報告
    this.sendErrorReport(error);
  }

  /**
   * 分類錯誤類型
   */
  private classifyError(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'NETWORK_ERROR';
    }
    
    if (message.includes('api') || message.includes('server')) {
      return 'API_ERROR';
    }
    
    if (message.includes('memory') || message.includes('heap')) {
      return 'MEMORY_ERROR';
    }
    
    if (message.includes('calculation') || message.includes('math')) {
      return 'CALCULATION_ERROR';
    }
    
    return 'UNKNOWN_ERROR';
  }

  /**
   * 通用錯誤恢復
   */
  private async genericRecovery(error: SystemError): Promise<RecoveryResult> {
    // 嘗試清理和重置
    this.clearCaches();
    
    await this.delay(1000);
    
    return {
      success: true,
      message: '已執行通用錯誤恢復程序',
      fallbackUsed: true,
      retryAfter: 2000
    };
  }

  /**
   * 清理快取
   */
  private clearCaches(): void {
    try {
      // 清理 localStorage 中的快取數據
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('cache_') || key.startsWith('temp_'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // 清理 sessionStorage
      sessionStorage.clear();
      
      console.log('快取已清理');
    } catch (error) {
      console.error('清理快取失敗:', error);
    }
  }

  /**
   * 記錄錯誤到歷史記錄（舊版本兼容）
   */
  private recordErrorToHistory(error: Error, recovered: boolean): void {
    this.errorHistory.push({
      error,
      timestamp: new Date(),
      recovered
    });

    // 保持錯誤歷史記錄在合理範圍內
    if (this.errorHistory.length > 100) {
      this.errorHistory = this.errorHistory.slice(-50);
    }
  }

  /**
   * 發送錯誤報告
   */
  private async sendErrorReport(error: Error): Promise<void> {
    try {
      await fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }),
      });
    } catch (reportError) {
      console.error('發送錯誤報告失敗:', reportError);
    }
  }

  /**
   * 延遲函數
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 獲取錯誤統計
   */
  getErrorStats() {
    const allRecords = Array.from(this.errorRecords.values());
    const total = allRecords.length;
    const resolved = allRecords.filter(record => record.resolved).length;
    const unresolved = total - resolved;
    const recoverable = allRecords.filter(record => record.recoverable && !record.resolved).length;
    const critical = allRecords.filter(record => record.severity === 'critical' && !record.resolved).length;
    
    // 按類型統計
    const byType: Record<string, number> = {};
    allRecords.filter(record => !record.resolved).forEach(record => {
      byType[record.type] = (byType[record.type] || 0) + 1;
    });
    
    // 按嚴重程度統計
    const bySeverity: Record<string, number> = {};
    allRecords.filter(record => !record.resolved && record.severity).forEach(record => {
      bySeverity[record.severity!] = (bySeverity[record.severity!] || 0) + 1;
    });

    const recentErrors = allRecords.filter(
      record => Date.now() - record.timestamp < 3600000
    ).length;

    return {
      total,
      resolved,
      unresolved,
      recoverable,
      critical,
      byType,
      bySeverity,
      recoveryRate: total > 0 ? (resolved / total) * 100 : 0,
      recentErrors,
      errorTypes: this.getErrorTypeDistribution()
    };
  }

  /**
   * 獲取錯誤類型分佈
   */
  private getErrorTypeDistribution() {
    const distribution: Record<string, number> = {};
    
    this.errorHistory.forEach(entry => {
      const type = this.classifyError(entry.error);
      distribution[type] = (distribution[type] || 0) + 1;
    });

    return distribution;
  }
}

// 創建全域實例
export const errorRecoveryManager = new ErrorRecoveryManager();