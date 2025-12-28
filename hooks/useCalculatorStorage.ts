import { useState, useEffect } from 'react';

interface StorageOptions<T> {
    key: string;
    initialValues: T;
}

/**
 * 通用計算器儲存 Hook
 * 自動儲存計算參數到 localStorage，回訪時自動載入
 */
export function useCalculatorStorage<T extends Record<string, any>>({
    key,
    initialValues,
}: StorageOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

    // 初次載入時，從 localStorage 讀取
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored);
                setValues({ ...initialValues, ...parsed });
                setHasLoadedFromStorage(true);
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
        }
    }, [key]); // 只在 mount 時執行一次

    // 每次 values 更新時，儲存到 localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(key, JSON.stringify(values));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }, [key, values]);

    // 清除儲存
    const clearStorage = () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
        setValues(initialValues);
        setHasLoadedFromStorage(false);
    };

    return {
        values,
        setValues,
        hasLoadedFromStorage,
        clearStorage,
    };
}
