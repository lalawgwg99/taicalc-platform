/**
 * 教學系統 Hook
 * 提供教學功能的 React Hook 介面
 */

import { useState, useEffect, useCallback } from 'react';
import { tutorialManager, TutorialProgress } from '@/lib/tutorial/TutorialManager';
import { Tutorial, CalculatorType } from '@/components/tutorial/TutorialSystem';

export interface UseTutorialOptions {
  calculatorType?: CalculatorType;
  autoStart?: boolean;
  onComplete?: (tutorialId: string) => void;
  onStepChange?: (tutorialId: string, stepIndex: number) => void;
}

export interface UseTutorialReturn {
  // 狀態
  currentTutorial: Tutorial | null;
  isVisible: boolean;
  isLoading: boolean;
  
  // 教學列表
  availableTutorials: Tutorial[];
  recommendedTutorials: Tutorial[];
  
  // 進度信息
  userProgress: any;
  stats: any;
  
  // 操作方法
  startTutorial: (tutorialId: string) => void;
  closeTutorial: () => void;
  completeTutorial: (rating?: number, feedback?: string) => void;
  updateStepProgress: (stepIndex: number, timeSpent: number) => void;
  
  // 推薦和搜尋
  getTutorialsByType: (type: CalculatorType) => Tutorial[];
  searchTutorials: (query: string) => Tutorial[];
}

/**
 * 教學系統 Hook
 */
export function useTutorial(options: UseTutorialOptions = {}): UseTutorialReturn {
  const {
    calculatorType,
    autoStart = false,
    onComplete,
    onStepChange
  } = options;

  // 狀態管理
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTutorials, setAvailableTutorials] = useState<Tutorial[]>([]);
  const [recommendedTutorials, setRecommendedTutorials] = useState<Tutorial[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  /**
   * 載入教學數據
   */
  const loadTutorialData = useCallback(() => {
    setIsLoading(true);
    
    try {
      // 載入所有教學
      const allTutorials = tutorialManager.getAllTutorials();
      setAvailableTutorials(allTutorials);

      // 載入推薦教學
      const recommended = tutorialManager.getRecommendedTutorials(3);
      setRecommendedTutorials(recommended);

      // 載入用戶進度
      const progress = tutorialManager.getUserProgress();
      setUserProgress(progress);

      // 載入統計信息
      const tutorialStats = tutorialManager.getStats();
      setStats(tutorialStats);

    } catch (error) {
      console.error('載入教學數據失敗:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 開始教學
   */
  const startTutorial = useCallback((tutorialId: string) => {
    const tutorial = tutorialManager.getTutorial(tutorialId);
    if (!tutorial) {
      console.error('找不到教學:', tutorialId);
      return;
    }

    tutorialManager.startTutorial(tutorialId);
    setCurrentTutorial(tutorial);
    setIsVisible(true);
  }, []);

  /**
   * 關閉教學
   */
  const closeTutorial = useCallback(() => {
    setIsVisible(false);
    setCurrentTutorial(null);
  }, []);

  /**
   * 完成教學
   */
  const completeTutorial = useCallback((rating?: number, feedback?: string) => {
    if (!currentTutorial) return;

    tutorialManager.completeTutorial(currentTutorial.id, rating, feedback);
    onComplete?.(currentTutorial.id);
    
    // 重新載入數據以更新進度
    loadTutorialData();
    
    // 關閉教學
    closeTutorial();
  }, [currentTutorial, onComplete, loadTutorialData, closeTutorial]);

  /**
   * 更新步驟進度
   */
  const updateStepProgress = useCallback((stepIndex: number, timeSpent: number) => {
    if (!currentTutorial) return;

    tutorialManager.updateProgress(currentTutorial.id, stepIndex, timeSpent);
    onStepChange?.(currentTutorial.id, stepIndex);
    
    // 更新用戶進度
    const progress = tutorialManager.getUserProgress();
    setUserProgress(progress);
  }, [currentTutorial, onStepChange]);

  /**
   * 根據類型獲取教學
   */
  const getTutorialsByType = useCallback((type: CalculatorType) => {
    return tutorialManager.getTutorialsByType(type);
  }, []);

  /**
   * 搜尋教學
   */
  const searchTutorials = useCallback((query: string) => {
    const allTutorials = tutorialManager.getAllTutorials();
    const lowerQuery = query.toLowerCase();
    
    return allTutorials.filter(tutorial => 
      tutorial.title.toLowerCase().includes(lowerQuery) ||
      tutorial.description.toLowerCase().includes(lowerQuery) ||
      tutorial.steps.some(step => 
        step.title.toLowerCase().includes(lowerQuery) ||
        step.content.toLowerCase().includes(lowerQuery)
      )
    );
  }, []);

  /**
   * 自動開始教學
   */
  useEffect(() => {
    if (autoStart && calculatorType && !currentTutorial) {
      const tutorials = getTutorialsByType(calculatorType);
      const beginnerTutorial = tutorials.find(t => t.difficulty === 'beginner');
      
      if (beginnerTutorial && !userProgress?.completedTutorials.includes(beginnerTutorial.id)) {
        startTutorial(beginnerTutorial.id);
      }
    }
  }, [autoStart, calculatorType, currentTutorial, getTutorialsByType, userProgress, startTutorial]);

  /**
   * 初始化載入
   */
  useEffect(() => {
    loadTutorialData();
  }, [loadTutorialData]);

  return {
    // 狀態
    currentTutorial,
    isVisible,
    isLoading,
    
    // 教學列表
    availableTutorials,
    recommendedTutorials,
    
    // 進度信息
    userProgress,
    stats,
    
    // 操作方法
    startTutorial,
    closeTutorial,
    completeTutorial,
    updateStepProgress,
    
    // 推薦和搜尋
    getTutorialsByType,
    searchTutorials
  };
}

/**
 * 教學觸發器 Hook
 * 用於在特定條件下自動觸發教學
 */
export function useTutorialTrigger(calculatorType: CalculatorType) {
  const { startTutorial, getTutorialsByType, userProgress } = useTutorial();

  /**
   * 檢查是否應該顯示教學建議
   */
  const shouldShowTutorialSuggestion = useCallback(() => {
    if (!userProgress) return false;

    const tutorials = getTutorialsByType(calculatorType);
    const availableTutorials = tutorials.filter(
      tutorial => !userProgress.completedTutorials.includes(tutorial.id)
    );

    return availableTutorials.length > 0;
  }, [calculatorType, getTutorialsByType, userProgress]);

  /**
   * 獲取建議的教學
   */
  const getSuggestedTutorial = useCallback(() => {
    if (!userProgress) return null;

    const tutorials = getTutorialsByType(calculatorType);
    const availableTutorials = tutorials.filter(
      tutorial => !userProgress.completedTutorials.includes(tutorial.id)
    );

    // 優先推薦初級教學
    return availableTutorials.find(t => t.difficulty === 'beginner') || 
           availableTutorials[0] || 
           null;
  }, [calculatorType, getTutorialsByType, userProgress]);

  /**
   * 觸發建議的教學
   */
  const triggerSuggestedTutorial = useCallback(() => {
    const suggested = getSuggestedTutorial();
    if (suggested) {
      startTutorial(suggested.id);
    }
  }, [getSuggestedTutorial, startTutorial]);

  return {
    shouldShowTutorialSuggestion,
    getSuggestedTutorial,
    triggerSuggestedTutorial
  };
}