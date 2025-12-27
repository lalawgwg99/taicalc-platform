'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, Suspense } from 'react';
import { Share2, Link as LinkIcon, Check, Copy } from 'lucide-react';

/**
 * URL 參數管理 Hook
 * 用於將計算器狀態保存到 URL，實現可回訪連結
 */

interface UseShareableLinkOptions {
    params: Record<string, string | number | boolean | undefined>;
    baseUrl?: string;
}

function useShareableLinkInner({ params, baseUrl }: UseShareableLinkOptions) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    // 從 URL 讀取初始參數
    const getInitialParams = useCallback(() => {
        const result: Record<string, string> = {};
        searchParams?.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }, [searchParams]);

    // 更新 URL 參數（不刷新頁面）
    const updateUrlParams = useCallback((newParams: Record<string, string | number | boolean | undefined>) => {
        const urlParams = new URLSearchParams();
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== false) {
                urlParams.set(key, String(value));
            }
        });
        const newUrl = `${pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
    }, [pathname]);

    // 產生分享連結
    const generateShareUrl = useCallback(() => {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== false) {
                urlParams.set(key, String(value));
            }
        });
        const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://taicalc.com');
        return `${base}${pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    }, [params, pathname, baseUrl]);

    // 複製連結到剪貼簿
    const copyToClipboard = useCallback(async () => {
        const url = generateShareUrl();
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return true;
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return true;
        }
    }, [generateShareUrl]);

    // Web Share API
    const share = useCallback(async () => {
        const url = generateShareUrl();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'TaiCalc 計算結果',
                    text: '查看我的財務計算結果',
                    url,
                });
                return true;
            } catch {
                // User cancelled or share failed
                return false;
            }
        }
        // Fallback to copy
        return copyToClipboard();
    }, [generateShareUrl, copyToClipboard]);

    return {
        getInitialParams,
        updateUrlParams,
        generateShareUrl,
        copyToClipboard,
        share,
        copied,
    };
}

// 包裝 Suspense 的 hook
export function useShareableLink(options: UseShareableLinkOptions) {
    return useShareableLinkInner(options);
}

/**
 * 分享按鈕組件
 */
interface ShareButtonProps {
    params: Record<string, string | number | boolean | undefined>;
    variant?: 'icon' | 'button' | 'full';
    className?: string;
}

function ShareButtonInner({ params, variant = 'button', className = '' }: ShareButtonProps) {
    const { share, copyToClipboard, copied } = useShareableLinkInner({ params });

    if (variant === 'icon') {
        return (
            <button
                onClick={share}
                className={`p-2 hover:bg-slate-100 rounded-lg transition-all ${className}`}
                title="分享連結"
            >
                {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                ) : (
                    <Share2 className="w-5 h-5 text-slate-500" />
                )}
            </button>
        );
    }

    if (variant === 'full') {
        return (
            <div className={`flex gap-2 ${className}`}>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-all"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span>已複製</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            <span>複製連結</span>
                        </>
                    )}
                </button>
                <button
                    onClick={share}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all"
                >
                    <Share2 className="w-4 h-4" />
                    <span>分享</span>
                </button>
            </div>
        );
    }

    // Default: button
    return (
        <button
            onClick={share}
            className={`flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-all ${className}`}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span>已複製</span>
                </>
            ) : (
                <>
                    <LinkIcon className="w-4 h-4" />
                    <span>分享連結</span>
                </>
            )}
        </button>
    );
}

// 包裝 Suspense
export function ShareButton(props: ShareButtonProps) {
    return (
        <Suspense fallback={<button className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-slate-400">載入中...</button>}>
            <ShareButtonInner {...props} />
        </Suspense>
    );
}

/**
 * 從 URL 參數初始化狀態的 helper
 */
export function parseUrlParams(searchParams: URLSearchParams | null): Record<string, string> {
    const result: Record<string, string> = {};
    searchParams?.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

export function parseNumber(value: string | undefined, defaultValue: number): number {
    if (!value) return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
}

export function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
}
