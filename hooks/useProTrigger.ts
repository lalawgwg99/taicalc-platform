import { useEffect, useRef, useState } from 'react';
import { TriggerType } from '@/components/ProUpgradePrompt';

interface TriggerConfig {
    /**
     * 顯示觸發器前需等待的時間（毫秒）
     */
    delayMs?: number;
    /**
     * 是否只顯示一次（存在 localStorage）
     */
    showOnce?: boolean;
    /**
     * localStorage key（當 showOnce 為 true 時使用）
     */
    storageKey?: string;
}

interface UseProTriggerOptions {
    /**
     * 觸發類型
     */
    triggerType: TriggerType;
    /**
     * 觸發條件（返回 true 時觸發）
     */
    condition: boolean;
    /**
     * 配置選項
     */
    config?: TriggerConfig;
}

/**
 * Pro 升級觸發器的自定義 Hook
 * 
 * 使用範例：
 * ```tsx
 * const { isVisible, dismiss } = useProTrigger({
 *   triggerType: 'result_completed',
 *   condition: hasCalculated,
 *   config: { delayMs: 2000, showOnce: true }
 * });
 * ```
 */
export function useProTrigger({ triggerType, condition, config }: UseProTriggerOptions) {
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hasTriggeredRef = useRef(false);

    const storageKey = config?.storageKey || `pro_trigger_${triggerType}`;
    const delayMs = config?.delayMs || 0;
    const showOnce = config?.showOnce ?? true;

    useEffect(() => {
        // 檢查是否已經觸發過
        if (showOnce && typeof window !== 'undefined') {
            const hasShown = localStorage.getItem(storageKey);
            if (hasShown) {
                return;
            }
        }

        // 如果條件滿足且尚未觸發
        if (condition && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;

            timerRef.current = setTimeout(() => {
                setIsVisible(true);

                // 記錄已顯示
                if (showOnce && typeof window !== 'undefined') {
                    localStorage.setItem(storageKey, 'true');
                }
            }, delayMs);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [condition, storageKey, delayMs, showOnce]);

    const dismiss = () => {
        setIsVisible(false);
    };

    return { isVisible, dismiss };
}

/**
 * 追蹤使用次數的 Hook
 */
export function useUsageCount(key: string) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storageKey = `usage_count_${key}`;
        const currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
        const newCount = currentCount + 1;

        localStorage.setItem(storageKey, newCount.toString());
        setCount(newCount);
    }, [key]);

    return count;
}

/**
 * 追蹤停留時間的 Hook
 */
export function useDwellTime(thresholdSeconds: number) {
    const [hasExceeded, setHasExceeded] = useState(false);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        startTimeRef.current = Date.now();

        const interval = setInterval(() => {
            const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
            if (elapsedSeconds >= thresholdSeconds && !hasExceeded) {
                setHasExceeded(true);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [thresholdSeconds, hasExceeded]);

    return hasExceeded;
}
