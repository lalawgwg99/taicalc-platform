/**
 * @jest-environment jsdom
 */

import { tutorialManager } from '@/lib/tutorial/TutorialManager';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Feature: taicalc-optimization, Property 4: Interactive UI Responsiveness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('教學管理器響應性', () => {
    test('教學管理器應該提供所有預設教學', () => {
      const allTutorials = tutorialManager.getAllTutorials();
      
      // 驗證基本教學存在
      expect(allTutorials.length).toBeGreaterThan(0);
      
      const salaryTutorial = tutorialManager.getTutorial('salary-basic');
      expect(salaryTutorial).toBeTruthy();
      expect(salaryTutorial?.title).toBe('薪資計算器基礎教學');
      expect(salaryTutorial?.calculatorType).toBe('salary');
      expect(salaryTutorial?.steps.length).toBeGreaterThan(0);
    });

    test('教學管理器應該正確分類教學', () => {
      const salaryTutorials = tutorialManager.getTutorialsByType('salary');
      const mortgageTutorials = tutorialManager.getTutorialsByType('mortgage');
      const taxTutorials = tutorialManager.getTutorialsByType('tax');
      const generalTutorials = tutorialManager.getTutorialsByType('general');
      
      expect(salaryTutorials.length).toBeGreaterThan(0);
      expect(mortgageTutorials.length).toBeGreaterThan(0);
      expect(taxTutorials.length).toBeGreaterThan(0);
      expect(generalTutorials.length).toBeGreaterThan(0);
      
      // 驗證分類正確
      salaryTutorials.forEach(tutorial => {
        expect(tutorial.calculatorType).toBe('salary');
      });
    });

    test('教學管理器應該即時更新用戶進度', () => {
      // 重置進度以確保乾淨的測試環境
      tutorialManager.resetProgress();
      const initialStats = tutorialManager.getStats();
      
      // 開始教學
      tutorialManager.startTutorial('salary-basic');
      
      // 更新進度（確保有足夠的時間）
      tutorialManager.updateProgress('salary-basic', 0, 5000); // 5 秒
      tutorialManager.updateProgress('salary-basic', 1, 3000); // 3 秒
      
      // 完成教學
      tutorialManager.completeTutorial('salary-basic', 5);
      
      const finalStats = tutorialManager.getStats();
      
      // 驗證統計數據更新
      expect(finalStats.completedCount).toBe(initialStats.completedCount + 1);
      expect(finalStats.totalTimeSpent).toBeGreaterThanOrEqual(initialStats.totalTimeSpent);
      expect(finalStats.completionRate).toBeGreaterThan(initialStats.completionRate);
    });

    test('教學管理器應該提供準確的推薦', () => {
      // 重置進度
      tutorialManager.resetProgress();
      
      // 獲取初始推薦
      const initialRecommendations = tutorialManager.getRecommendedTutorials(3);
      expect(initialRecommendations).toHaveLength(3);
      
      // 完成初級教學
      tutorialManager.completeTutorial('salary-basic', 5);
      
      // 獲取新推薦
      const newRecommendations = tutorialManager.getRecommendedTutorials(3);
      
      // 驗證推薦邏輯
      expect(newRecommendations).toHaveLength(3);
      expect(newRecommendations.every(t => t.id !== 'salary-basic')).toBe(true); // 不推薦已完成的
    });

    test('教學管理器應該正確處理用戶偏好', () => {
      const initialProfile = tutorialManager.getUserProgress();
      
      // 更新偏好
      tutorialManager.updatePreferences({
        autoPlay: true,
        showHints: false,
        preferredDifficulty: 'advanced'
      });
      
      const updatedProfile = tutorialManager.getUserProgress();
      
      expect(updatedProfile.preferences.autoPlay).toBe(true);
      expect(updatedProfile.preferences.showHints).toBe(false);
      expect(updatedProfile.preferences.preferredDifficulty).toBe('advanced');
    });

    test('教學管理器應該正確計算技能等級', () => {
      // 重置進度
      tutorialManager.resetProgress();
      
      const initialProfile = tutorialManager.getUserProgress();
      expect(initialProfile.skillLevel.salary).toBe(0);
      
      // 完成初級教學
      tutorialManager.completeTutorial('salary-basic', 5);
      
      const updatedProfile = tutorialManager.getUserProgress();
      expect(updatedProfile.skillLevel.salary).toBeGreaterThan(0);
      expect(updatedProfile.skillLevel.salary).toBeLessThanOrEqual(100);
    });
  });

  describe('教學內容驗證', () => {
    test('所有教學應該有完整的步驟定義', () => {
      const allTutorials = tutorialManager.getAllTutorials();
      
      allTutorials.forEach(tutorial => {
        expect(tutorial.id).toBeTruthy();
        expect(tutorial.title).toBeTruthy();
        expect(tutorial.description).toBeTruthy();
        expect(tutorial.steps.length).toBeGreaterThan(0);
        expect(tutorial.estimatedTime).toBeGreaterThan(0);
        expect(['beginner', 'intermediate', 'advanced']).toContain(tutorial.difficulty);
        
        // 驗證步驟內容
        tutorial.steps.forEach(step => {
          expect(step.id).toBeTruthy();
          expect(step.title).toBeTruthy();
          expect(step.content).toBeTruthy();
          
          if (step.position) {
            expect(['top', 'bottom', 'left', 'right', 'center']).toContain(step.position);
          }
          
          if (step.action) {
            expect(['click', 'input', 'hover', 'scroll', 'wait']).toContain(step.action);
          }
        });
      });
    });

    test('教學步驟應該有適當的目標選擇器', () => {
      const salaryTutorial = tutorialManager.getTutorial('salary-basic');
      expect(salaryTutorial).toBeTruthy();
      
      const stepsWithTargets = salaryTutorial!.steps.filter(step => step.target);
      expect(stepsWithTargets.length).toBeGreaterThan(0);
      
      stepsWithTargets.forEach(step => {
        expect(step.target).toMatch(/^[.#]?[\w-\[\]="':]+$/); // 基本 CSS 選擇器格式
      });
    });
  });

  describe('性能響應性', () => {
    test('教學管理器操作應該在合理時間內完成', () => {
      const startTime = performance.now();
      
      // 執行多個操作
      tutorialManager.getAllTutorials();
      tutorialManager.getTutorialsByType('salary');
      tutorialManager.getRecommendedTutorials(5);
      tutorialManager.startTutorial('salary-basic');
      tutorialManager.updateProgress('salary-basic', 0, 1000);
      tutorialManager.completeTutorial('salary-basic', 5);
      tutorialManager.getStats();
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // 所有操作應該在 50ms 內完成
      expect(executionTime).toBeLessThan(50);
    });

    test('教學管理器應該有效處理大量數據', () => {
      const startTime = performance.now();
      
      // 模擬大量教學完成
      for (let i = 0; i < 100; i++) {
        tutorialManager.updateProgress('salary-basic', i % 5, 100);
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // 大量更新應該在 100ms 內完成
      expect(executionTime).toBeLessThan(100);
    });
  });

  describe('錯誤處理響應性', () => {
    test('教學管理器應該優雅處理無效的教學 ID', () => {
      expect(() => {
        tutorialManager.startTutorial('non-existent-tutorial');
      }).not.toThrow();
      
      expect(() => {
        tutorialManager.updateProgress('non-existent-tutorial', 0, 1000);
      }).not.toThrow();
      
      expect(() => {
        tutorialManager.completeTutorial('non-existent-tutorial', 5);
      }).not.toThrow();
    });

    test('教學管理器應該處理無效的用戶輸入', () => {
      expect(() => {
        tutorialManager.updateProgress('salary-basic', -1, -1000);
      }).not.toThrow();
      
      expect(() => {
        tutorialManager.completeTutorial('salary-basic', 10); // 超出範圍的評分
      }).not.toThrow();
      
      expect(() => {
        tutorialManager.updatePreferences({
          preferredDifficulty: 'invalid' as any
        });
      }).not.toThrow();
    });

    test('教學管理器應該處理 localStorage 錯誤', () => {
      // 模擬 localStorage 錯誤
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      expect(() => {
        tutorialManager.completeTutorial('salary-basic', 5);
      }).not.toThrow();
      
      // 恢復正常行為
      localStorageMock.setItem.mockImplementation(() => {});
    });
  });
});