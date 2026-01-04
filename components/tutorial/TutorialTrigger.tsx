'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Play, Star, Clock, Award } from 'lucide-react';
import { useTutorial, useTutorialTrigger } from '@/hooks/useTutorial';
import { CalculatorType } from '@/components/tutorial/TutorialSystem';
import TutorialSystem from '@/components/tutorial/TutorialSystem';

interface TutorialTriggerProps {
  calculatorType: CalculatorType;
  autoStart?: boolean;
  showRecommendations?: boolean;
  className?: string;
}

/**
 * 教學觸發器組件
 * 在適當時機顯示教學建議和啟動教學
 */
export default function TutorialTrigger({
  calculatorType,
  autoStart = false,
  showRecommendations = true,
  className = ''
}: TutorialTriggerProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [hasShownSuggestion, setHasShownSuggestion] = useState(false);

  const {
    currentTutorial,
    isVisible,
    recommendedTutorials,
    stats,
    startTutorial,
    closeTutorial,
    completeTutorial,
    updateStepProgress
  } = useTutorial({
    calculatorType,
    autoStart,
    onComplete: (tutorialId) => {
      console.log('教學完成:', tutorialId);
    },
    onStepChange: (tutorialId, stepIndex) => {
      console.log('步驟變更:', tutorialId, stepIndex);
    }
  });

  const {
    shouldShowTutorialSuggestion,
    getSuggestedTutorial,
    triggerSuggestedTutorial
  } = useTutorialTrigger(calculatorType);

  /**
   * 檢查是否顯示教學建議
   */
  useEffect(() => {
    if (showRecommendations && !hasShownSuggestion && shouldShowTutorialSuggestion()) {
      // 延遲顯示建議，避免干擾用戶
      const timer = setTimeout(() => {
        setShowSuggestion(true);
        setHasShownSuggestion(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showRecommendations, hasShownSuggestion, shouldShowTutorialSuggestion]);

  /**
   * 關閉建議
   */
  const closeSuggestion = () => {
    setShowSuggestion(false);
  };

  /**
   * 開始建議的教學
   */
  const startSuggestedTutorial = () => {
    triggerSuggestedTutorial();
    setShowSuggestion(false);
  };

  const suggestedTutorial = getSuggestedTutorial();

  return (
    <div className={className}>
      {/* 教學建議彈窗 */}
      <AnimatePresence>
        {showSuggestion && suggestedTutorial && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-40 max-w-sm"
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
              {/* 標題欄 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-blue-100 rounded-full">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">新手教學</h3>
                </div>
                <button
                  onClick={closeSuggestion}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* 內容 */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">
                  {suggestedTutorial.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {suggestedTutorial.description}
                </p>

                {/* 教學信息 */}
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{suggestedTutorial.estimatedTime} 分鐘</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>
                      {suggestedTutorial.difficulty === 'beginner' ? '初級' :
                       suggestedTutorial.difficulty === 'intermediate' ? '中級' : '高級'}
                    </span>
                  </div>
                </div>

                {/* 統計信息 */}
                {stats && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">學習進度</span>
                      <span className="font-medium text-gray-900">
                        {stats.completedCount}/{stats.totalTutorials}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 操作按鈕 */}
              <div className="flex space-x-2">
                <button
                  onClick={startSuggestedTutorial}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Play className="w-3 h-3" />
                  <span>開始學習</span>
                </button>
                <button
                  onClick={closeSuggestion}
                  className="px-3 py-2 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  稍後
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 推薦教學列表 */}
      {showRecommendations && recommendedTutorials.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span>推薦教學</span>
          </h3>
          
          <div className="grid gap-3">
            {recommendedTutorials.map((tutorial) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => startTutorial(tutorial.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {tutorial.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {tutorial.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{tutorial.estimatedTime} 分鐘</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>
                          {tutorial.difficulty === 'beginner' ? '初級' :
                           tutorial.difficulty === 'intermediate' ? '中級' : '高級'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="ml-3 p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 教學系統 */}
      <TutorialSystem
        tutorial={currentTutorial || undefined}
        isVisible={isVisible}
        onComplete={completeTutorial}
        onClose={closeTutorial}
        onStepChange={(stepIndex) => {
          if (currentTutorial) {
            updateStepProgress(stepIndex, 1000); // 假設每步驟花費 1 秒
          }
        }}
        autoPlay={false}
        showProgress={true}
      />
    </div>
  );
}