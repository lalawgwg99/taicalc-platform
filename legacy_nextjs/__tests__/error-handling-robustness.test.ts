/**
 * 錯誤處理穩健性屬性測試
 * 
 * 驗證系統在各種錯誤情況下的穩健性和恢復能力
 * 使用屬性測試確保錯誤處理機制在各種輸入下都能正常工作
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fc from 'fast-check';

// 測試組件和工具
import { ErrorRecoveryManager } from '@/lib/error-recovery/ErrorRecoveryManager';

describe('錯誤處理穩健性屬性測試', () => {
  let consoleErrorSpy: any;
  let errorRecoveryManager: ErrorRecoveryManager;

  beforeEach(() => {
    // 抑制測試期間的 console.error 輸出
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    errorRecoveryManager = new ErrorRecoveryManager();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  /**
   * 基本功能測試
   */
  it('基本測試: ErrorRecoveryManager 應該能正常創建和使用', () => {
    const manager = new ErrorRecoveryManager();
    expect(manager).toBeDefined();
    expect(manager.getErrorCount()).toBe(0);
    expect(manager.hasRecoverableErrors()).toBe(false);
    expect(manager.hasCriticalErrors()).toBe(false);
  });

  /**
   * 屬性 3.1: 錯誤記錄完整性屬性
   * 驗證錯誤記錄包含所有必要信息
   */
  it('屬性 3.1: 錯誤記錄應該包含完整的錯誤信息', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 200 }), // 確保最小長度
        fc.oneof(
          fc.constant('calculation'),
          fc.constant('network'),
          fc.constant('validation'),
          fc.constant('render')
        ),
        fc.boolean(),
        (errorMessage, errorType, isRecoverable) => {
          const manager = new ErrorRecoveryManager();
          const error = new Error(errorMessage);
          
          const errorId = manager.recordError(error, {
            type: errorType,
            recoverable: isRecoverable,
            timestamp: Date.now(),
            context: { component: 'TestComponent' }
          });

          // 驗證錯誤被正確記錄
          expect(errorId).toBeDefined();
          expect(typeof errorId).toBe('string');
          expect(errorId.length).toBeGreaterThan(0);
          
          // 驗證錯誤計數
          expect(manager.getErrorCount()).toBe(1);
          
          // 驗證可恢復錯誤狀態
          if (isRecoverable) {
            expect(manager.hasRecoverableErrors()).toBe(true);
          }
        }
      ),
      { numRuns: 50 } // 減少運行次數以提高測試速度
    );
  });

  /**
   * 屬性 3.2: 錯誤恢復策略屬性
   * 驗證不同類型錯誤的恢復策略
   */
  it('屬性 3.2: 錯誤恢復策略應該根據錯誤類型調整', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            message: fc.string({ minLength: 5, maxLength: 100 }),
            type: fc.oneof(
              fc.constant('calculation'),
              fc.constant('network'),
              fc.constant('validation'),
              fc.constant('render')
            ),
            recoverable: fc.boolean(),
            severity: fc.oneof(
              fc.constant('low'),
              fc.constant('medium'),
              fc.constant('high'),
              fc.constant('critical')
            )
          }),
          { minLength: 1, maxLength: 5 } // 減少數組大小
        ),
        (errors) => {
          const manager = new ErrorRecoveryManager();
          const errorIds: string[] = [];

          // 記錄所有錯誤
          errors.forEach(errorData => {
            const error = new Error(errorData.message);
            const errorId = manager.recordError(error, {
              type: errorData.type,
              recoverable: errorData.recoverable,
              severity: errorData.severity,
              timestamp: Date.now()
            });
            errorIds.push(errorId);
          });

          // 驗證錯誤記錄數量
          expect(manager.getErrorCount()).toBe(errors.length);
          expect(errorIds).toHaveLength(errors.length);

          // 驗證所有錯誤 ID 都是唯一的
          const uniqueIds = new Set(errorIds);
          expect(uniqueIds.size).toBe(errors.length);

          // 驗證可恢復錯誤的識別
          const recoverableErrors = errors.filter(e => e.recoverable);
          if (recoverableErrors.length > 0) {
            expect(manager.hasRecoverableErrors()).toBe(true);
          } else {
            expect(manager.hasRecoverableErrors()).toBe(false);
          }

          // 驗證錯誤清理功能
          manager.clearErrors();
          expect(manager.getErrorCount()).toBe(0);
          expect(manager.hasRecoverableErrors()).toBe(false);
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * 屬性 3.3: 錯誤重試機制屬性
   * 驗證錯誤重試邏輯的正確性
   */
  it('屬性 3.3: 錯誤重試機制應該遵循指定的重試策略', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }), // 確保至少有 1 次重試
        fc.integer({ min: 100, max: 2000 }),
        fc.oneof(
          fc.constant('exponential'),
          fc.constant('linear'),
          fc.constant('fixed')
        ),
        (maxRetries, baseDelay, retryStrategy) => {
          const manager = new ErrorRecoveryManager();
          const error = new Error('測試重試錯誤');
          
          const errorId = manager.recordError(error, {
            type: 'network',
            recoverable: true,
            retryConfig: {
              maxRetries,
              baseDelay,
              strategy: retryStrategy
            }
          });

          // 驗證重試配置
          const retryInfo = manager.getRetryInfo(errorId);
          expect(retryInfo).toBeDefined();
          
          if (retryInfo) {
            expect(retryInfo.maxRetries).toBe(maxRetries);
            expect(retryInfo.currentAttempt).toBe(0);
            expect(retryInfo.canRetry).toBe(true);
          }

          // 模擬重試過程
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const canRetry = manager.canRetry(errorId);
            expect(canRetry).toBe(true);
            
            manager.incrementRetryAttempt(errorId);
            const updatedInfo = manager.getRetryInfo(errorId);
            expect(updatedInfo?.currentAttempt).toBe(attempt);
          }

          // 驗證超過最大重試次數後不能再重試
          expect(manager.canRetry(errorId)).toBe(false);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * 屬性 3.4: 錯誤分類和優先級屬性
   * 驗證錯誤按類型和嚴重程度的正確分類
   */
  it('屬性 3.4: 錯誤應該按類型和嚴重程度正確分類', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            type: fc.oneof(
              fc.constant('calculation'),
              fc.constant('network'),
              fc.constant('validation'),
              fc.constant('render')
            ),
            severity: fc.oneof(
              fc.constant('low'),
              fc.constant('medium'),
              fc.constant('high'),
              fc.constant('critical')
            ),
            message: fc.string({ minLength: 5, maxLength: 100 })
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (errors) => {
          const manager = new ErrorRecoveryManager();
          
          // 記錄所有錯誤
          errors.forEach(errorData => {
            const error = new Error(errorData.message);
            manager.recordError(error, {
              type: errorData.type,
              severity: errorData.severity,
              timestamp: Date.now()
            });
          });

          // 按類型分組驗證
          const errorsByType = manager.getErrorsByType();
          const expectedTypes = [...new Set(errors.map(e => e.type))];
          
          expectedTypes.forEach(type => {
            const errorsOfType = errors.filter(e => e.type === type);
            expect(errorsByType[type] || []).toHaveLength(errorsOfType.length);
          });

          // 按嚴重程度分組驗證
          const errorsBySeverity = manager.getErrorsBySeverity();
          const expectedSeverities = [...new Set(errors.map(e => e.severity))];
          
          expectedSeverities.forEach(severity => {
            const errorsOfSeverity = errors.filter(e => e.severity === severity);
            expect(errorsBySeverity[severity] || []).toHaveLength(errorsOfSeverity.length);
          });

          // 驗證關鍵錯誤的識別
          const criticalErrors = errors.filter(e => e.severity === 'critical');
          expect(manager.hasCriticalErrors()).toBe(criticalErrors.length > 0);
        }
      ),
      { numRuns: 25 }
    );
  });

  /**
   * 屬性 3.5: 錯誤上下文保存屬性
   * 驗證錯誤上下文信息的完整保存
   */
  it('屬性 3.5: 錯誤上下文信息應該被完整保存', () => {
    fc.assert(
      fc.property(
        fc.record({
          component: fc.string({ minLength: 5, maxLength: 50 }),
          action: fc.string({ minLength: 5, maxLength: 50 }),
          sessionId: fc.string({ minLength: 10, maxLength: 40 })
        }),
        fc.record({
          state: fc.record({
            isLoading: fc.boolean(),
            hasData: fc.boolean(),
            errorCount: fc.integer({ min: 0, max: 10 })
          })
        }),
        (context, additionalData) => {
          const manager = new ErrorRecoveryManager();
          const error = new Error('上下文測試錯誤');
          
          const errorId = manager.recordError(error, {
            type: 'validation',
            context,
            additionalData,
            timestamp: Date.now()
          });

          // 驗證上下文保存
          const savedContext = manager.getErrorContext(errorId);
          expect(savedContext).toBeDefined();
          
          if (savedContext) {
            expect(savedContext.component).toBe(context.component);
            expect(savedContext.action).toBe(context.action);
            expect(savedContext.sessionId).toBe(context.sessionId);
          }

          // 驗證附加數據保存
          const savedAdditionalData = manager.getErrorAdditionalData(errorId);
          expect(savedAdditionalData).toBeDefined();
          
          if (savedAdditionalData) {
            expect(savedAdditionalData.state.isLoading).toBe(additionalData.state.isLoading);
            expect(savedAdditionalData.state.hasData).toBe(additionalData.state.hasData);
            expect(savedAdditionalData.state.errorCount).toBe(additionalData.state.errorCount);
          }
        }
      ),
      { numRuns: 15 }
    );
  });

  /**
   * 屬性 3.6: 錯誤統計和報告屬性
   * 驗證錯誤統計信息的準確性
   */
  it('屬性 3.6: 錯誤統計信息應該準確反映錯誤狀態', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            type: fc.oneof(
              fc.constant('calculation'),
              fc.constant('network'),
              fc.constant('validation')
            ),
            severity: fc.oneof(
              fc.constant('low'),
              fc.constant('medium'),
              fc.constant('high'),
              fc.constant('critical')
            ),
            recoverable: fc.boolean(),
            resolved: fc.boolean()
          }),
          { minLength: 2, maxLength: 8 }
        ),
        (errorConfigs) => {
          const manager = new ErrorRecoveryManager();
          
          // 記錄所有錯誤
          const errorIds = errorConfigs.map((config, index) => {
            const error = new Error(`測試錯誤 ${index}`);
            return manager.recordError(error, {
              type: config.type,
              severity: config.severity,
              recoverable: config.recoverable,
              resolved: config.resolved,
              timestamp: Date.now() - (index * 1000) // 不同的時間戳
            });
          });

          // 標記一些錯誤為已解決
          errorConfigs.forEach((config, index) => {
            if (config.resolved) {
              manager.markErrorAsResolved(errorIds[index]);
            }
          });

          // 驗證統計信息
          const stats = manager.getErrorStats();
          
          expect(stats.total).toBe(errorConfigs.length);
          expect(stats.resolved).toBe(errorConfigs.filter(c => c.resolved).length);
          expect(stats.unresolved).toBe(errorConfigs.filter(c => !c.resolved).length);
          expect(stats.recoverable).toBe(errorConfigs.filter(c => c.recoverable && !c.resolved).length);
          expect(stats.critical).toBe(errorConfigs.filter(c => c.severity === 'critical' && !c.resolved).length);

          // 驗證按類型統計
          const typeStats = stats.byType;
          ['calculation', 'network', 'validation'].forEach(type => {
            const expectedCount = errorConfigs.filter(c => c.type === type && !c.resolved).length;
            expect(typeStats[type] || 0).toBe(expectedCount);
          });

          // 驗證按嚴重程度統計
          const severityStats = stats.bySeverity;
          ['low', 'medium', 'high', 'critical'].forEach(severity => {
            const expectedCount = errorConfigs.filter(c => c.severity === severity && !c.resolved).length;
            expect(severityStats[severity] || 0).toBe(expectedCount);
          });
        }
      ),
      { numRuns: 15 }
    );
  });

  /**
   * 屬性 3.7: 錯誤清理和記憶體管理屬性
   * 驗證錯誤記錄的清理和記憶體管理
   */
  it('屬性 3.7: 錯誤清理應該正確管理記憶體使用', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 5, max: 20 }), // 減少錯誤數量
        fc.integer({ min: 1, max: 12 }), // 小時
        (errorCount, maxAgeHours) => {
          const manager = new ErrorRecoveryManager();
          const now = Date.now();
          const maxAge = maxAgeHours * 60 * 60 * 1000; // 轉換為毫秒
          
          // 創建不同時間的錯誤
          const errorIds: string[] = [];
          for (let i = 0; i < errorCount; i++) {
            const error = new Error(`錯誤 ${i}`);
            const timestamp = now - (i * (maxAge / errorCount)); // 分散在時間範圍內
            
            const errorId = manager.recordError(error, {
              type: 'test',
              timestamp
            });
            errorIds.push(errorId);
          }

          // 驗證所有錯誤都被記錄
          expect(manager.getErrorCount()).toBe(errorCount);

          // 清理舊錯誤
          const cutoffTime = now - maxAge;
          const cleanedCount = manager.cleanupOldErrors(cutoffTime);
          
          // 驗證清理結果
          const remainingCount = manager.getErrorCount();
          expect(cleanedCount + remainingCount).toBe(errorCount);
          expect(remainingCount).toBeGreaterThanOrEqual(0);
          expect(remainingCount).toBeLessThanOrEqual(errorCount);

          // 驗證剩餘錯誤都是新的
          const remainingErrors = manager.getAllErrors();
          remainingErrors.forEach(error => {
            expect(error.timestamp).toBeGreaterThanOrEqual(cutoffTime);
          });
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * 整合測試：完整錯誤處理流程
   */
  it('整合測試: 完整的錯誤管理流程', () => {
    const manager = new ErrorRecoveryManager();
    
    // 記錄各種類型的錯誤
    const calculationError = new Error('計算錯誤');
    const networkError = new Error('網路錯誤');
    const validationError = new Error('驗證錯誤');
    
    const calcErrorId = manager.recordError(calculationError, {
      type: 'calculation',
      severity: 'high',
      recoverable: true,
      context: { component: 'Calculator' }
    });
    
    const netErrorId = manager.recordError(networkError, {
      type: 'network',
      severity: 'medium',
      recoverable: true,
      retryConfig: { maxRetries: 3, baseDelay: 1000, strategy: 'exponential' }
    });
    
    const valErrorId = manager.recordError(validationError, {
      type: 'validation',
      severity: 'low',
      recoverable: false
    });

    // 驗證初始狀態
    expect(manager.getErrorCount()).toBe(3);
    expect(manager.hasRecoverableErrors()).toBe(true);
    expect(manager.hasCriticalErrors()).toBe(false);

    // 測試重試機制
    expect(manager.canRetry(netErrorId)).toBe(true);
    manager.incrementRetryAttempt(netErrorId);
    expect(manager.getRetryInfo(netErrorId)?.currentAttempt).toBe(1);

    // 解決一個錯誤
    manager.markErrorAsResolved(calcErrorId);
    expect(manager.getErrorCount()).toBe(3); // 總數不變
    
    const stats = manager.getErrorStats();
    expect(stats.resolved).toBe(1);
    expect(stats.unresolved).toBe(2);

    // 清理所有錯誤
    manager.clearErrors();
    expect(manager.getErrorCount()).toBe(0);
    expect(manager.hasRecoverableErrors()).toBe(false);
  });
});