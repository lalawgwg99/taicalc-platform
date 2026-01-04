'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, CheckCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type CalculatorType = 'salary' | 'tax' | 'mortgage' | 'capital' | 'general';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS 選擇器
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'input' | 'hover' | 'scroll' | 'wait';
  actionTarget?: string;
  actionValue?: string;
  duration?: number; // 自動進行下一步的時間（毫秒）
  skippable?: boolean;
  highlight?: boolean;
  interactive?: boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  calculatorType: CalculatorType;
  steps: TutorialStep[];
  estimatedTime: number; // 分鐘
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

interface TutorialSystemProps {
  tutorial?: Tutorial;
  isVisible?: boolean;
  onComplete?: () => void;
  onClose?: () => void;
  onStepChange?: (stepIndex: number) => void;
  autoPlay?: boolean;
  showProgress?: boolean;
}

/**
 * 互動式教學系統組件
 */
export default function TutorialSystem({
  tutorial,
  isVisible = false,
  onComplete,
  onClose,
  onStepChange,
  autoPlay = false,
  showProgress = true
}: TutorialSystemProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = tutorial?.steps[currentStepIndex];
  const isLastStep = currentStepIndex === (tutorial?.steps.length || 0) - 1;
  const isFirstStep = currentStepIndex === 0;

  /**
   * 計算工具提示位置
   */
  const calculateTooltipPosition = useCallback((targetElement: HTMLElement, position: string = 'bottom') => {
    const rect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    
    if (!tooltipRect) return { x: 0, y: 0 };

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = rect.left + (rect.width - tooltipRect.width) / 2;
        y = rect.top - tooltipRect.height - 10;
        break;
      case 'bottom':
        x = rect.left + (rect.width - tooltipRect.width) / 2;
        y = rect.bottom + 10;
        break;
      case 'left':
        x = rect.left - tooltipRect.width - 10;
        y = rect.top + (rect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        x = rect.right + 10;
        y = rect.top + (rect.height - tooltipRect.height) / 2;
        break;
      case 'center':
      default:
        x = window.innerWidth / 2 - tooltipRect.width / 2;
        y = window.innerHeight / 2 - tooltipRect.height / 2;
        break;
    }

    // 確保工具提示在視窗內
    x = Math.max(10, Math.min(x, window.innerWidth - tooltipRect.width - 10));
    y = Math.max(10, Math.min(y, window.innerHeight - tooltipRect.height - 10));

    return { x, y };
  }, []);

  /**
   * 高亮目標元素
   */
  const highlightTarget = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      setHighlightedElement(element);
      
      // 滾動到元素
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });

      // 計算工具提示位置
      setTimeout(() => {
        const position = calculateTooltipPosition(element, currentStep?.position);
        setTooltipPosition(position);
      }, 100);

      return element;
    }
    return null;
  }, [calculateTooltipPosition, currentStep?.position]);

  /**
   * 執行步驟動作
   */
  const executeStepAction = useCallback(async (step: TutorialStep) => {
    if (!step.action || !step.actionTarget) return;

    const targetElement = document.querySelector(step.actionTarget) as HTMLElement;
    if (!targetElement) return;

    switch (step.action) {
      case 'click':
        targetElement.click();
        break;
      case 'input':
        if (targetElement instanceof HTMLInputElement && step.actionValue) {
          targetElement.value = step.actionValue;
          targetElement.dispatchEvent(new Event('input', { bubbles: true }));
        }
        break;
      case 'hover':
        targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        break;
      case 'scroll':
        targetElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'wait':
        await new Promise(resolve => setTimeout(resolve, step.duration || 1000));
        break;
    }
  }, []);

  /**
   * 前往下一步
   */
  const nextStep = useCallback(async () => {
    if (!tutorial || isLastStep) {
      // 教學完成
      setCompletedSteps(prev => new Set([...prev, currentStepIndex]));
      onComplete?.();
      return;
    }

    // 執行當前步驟的動作
    if (currentStep) {
      await executeStepAction(currentStep);
    }

    // 標記當前步驟為完成
    setCompletedSteps(prev => new Set([...prev, currentStepIndex]));

    // 前往下一步
    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    onStepChange?.(nextIndex);
  }, [tutorial, isLastStep, currentStepIndex, currentStep, executeStepAction, onComplete, onStepChange]);

  /**
   * 前往上一步
   */
  const previousStep = useCallback(() => {
    if (isFirstStep) return;
    
    const prevIndex = currentStepIndex - 1;
    setCurrentStepIndex(prevIndex);
    onStepChange?.(prevIndex);
  }, [isFirstStep, currentStepIndex, onStepChange]);

  /**
   * 跳到指定步驟
   */
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= (tutorial?.steps.length || 0)) return;
    
    setCurrentStepIndex(stepIndex);
    onStepChange?.(stepIndex);
  }, [tutorial?.steps.length, onStepChange]);

  /**
   * 重新開始教學
   */
  const restart = useCallback(() => {
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setIsPlaying(autoPlay);
    onStepChange?.(0);
  }, [autoPlay, onStepChange]);

  /**
   * 切換自動播放
   */
  const toggleAutoPlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  /**
   * 自動播放邏輯
   */
  useEffect(() => {
    if (isPlaying && currentStep?.duration && !isLastStep) {
      autoPlayTimerRef.current = setTimeout(() => {
        nextStep();
      }, currentStep.duration);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, currentStep, isLastStep, nextStep]);

  /**
   * 高亮當前步驟的目標元素
   */
  useEffect(() => {
    if (currentStep?.target) {
      highlightTarget(currentStep.target);
    } else {
      setHighlightedElement(null);
    }
  }, [currentStep, highlightTarget]);

  /**
   * 清理高亮
   */
  useEffect(() => {
    return () => {
      setHighlightedElement(null);
    };
  }, []);

  if (!tutorial || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50"
        onClick={(e) => {
          if (e.target === overlayRef.current) {
            onClose?.();
          }
        }}
      >
        {/* 高亮遮罩 */}
        {highlightedElement && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: highlightedElement.getBoundingClientRect().left - 4,
              top: highlightedElement.getBoundingClientRect().top - 4,
              width: highlightedElement.getBoundingClientRect().width + 8,
              height: highlightedElement.getBoundingClientRect().height + 8,
              border: '3px solid #3B82F6',
              borderRadius: '8px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              zIndex: 51
            }}
          />
        )}

        {/* 工具提示 */}
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bg-white rounded-lg shadow-xl border max-w-md z-52"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y
          }}
        >
          {/* 標題欄 */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-gray-900">{currentStep?.title}</h3>
              <p className="text-sm text-gray-500">
                步驟 {currentStepIndex + 1} / {tutorial.steps.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 內容 */}
          <div className="p-4">
            <p className="text-gray-700 mb-4">{currentStep?.content}</p>

            {/* 進度條 */}
            {showProgress && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>進度</span>
                  <span>{Math.round(((currentStepIndex + 1) / tutorial.steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentStepIndex + 1) / tutorial.steps.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* 控制按鈕 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={previousStep}
                  disabled={isFirstStep}
                  className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleAutoPlay}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={restart}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {currentStep?.skippable && (
                  <button
                    onClick={nextStep}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    跳過
                  </button>
                )}

                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  {isLastStep ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>完成</span>
                    </>
                  ) : (
                    <>
                      <span>下一步</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 步驟指示器 */}
          <div className="px-4 pb-4">
            <div className="flex space-x-1">
              {tutorial.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStepIndex
                      ? 'bg-blue-600'
                      : completedSteps.has(index)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* 教學信息面板 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{tutorial.title}</h4>
              <p className="text-sm text-gray-600">{tutorial.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>預估時間: {tutorial.estimatedTime} 分鐘</span>
                <span>難度: {
                  tutorial.difficulty === 'beginner' ? '初級' :
                  tutorial.difficulty === 'intermediate' ? '中級' : '高級'
                }</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}