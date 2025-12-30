/**
 * TaiCalc 共用元件：分享與匯出功能
 * 無需登入即可分享結果或匯出
 */

'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Download, Link2 } from 'lucide-react';

interface ShareExportProps {
    /** 計算類型 */
    type: 'salary' | 'mortgage' | 'tax' | 'capital' | 'pro';
    /** 計算輸入參數 */
    params: Record<string, any>;
    /** 計算結果摘要（用於分享文字） */
    summary?: string;
}

/**
 * 將參數壓縮成 URL hash
 */
function encodeParams(params: Record<string, any>): string {
    try {
        const json = JSON.stringify(params);
        return btoa(encodeURIComponent(json));
    } catch {
        return '';
    }
}

/**
 * 從 URL hash 解壓參數
 */
export function decodeParams(hash: string): Record<string, any> | null {
    try {
        const json = decodeURIComponent(atob(hash));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/**
 * 生成分享連結
 */
export function generateShareUrl(type: string, params: Record<string, any>): string {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://taicalc.com';
    const path = `/${type}`;
    const hash = encodeParams(params);
    return `${base}${path}#share=${hash}`;
}

export function ShareExport({ type, params, summary }: ShareExportProps) {
    const [copied, setCopied] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const shareUrl = generateShareUrl(type, params);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error('Failed to copy:', e);
        }
    };

    const handleNativeShare = async () => {
        if (!navigator.share) {
            handleCopyLink();
            return;
        }

        try {
            await navigator.share({
                title: 'TaiCalc 試算結果',
                text: summary || '我的財務試算結果',
                url: shareUrl,
            });
        } catch (e) {
            // User cancelled or error
            console.log('Share cancelled or failed:', e);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
            >
                <Share2 className="w-4 h-4" />
                分享結果
            </button>

            {showMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-white border border-slate-200 rounded-xl shadow-lg p-2 min-w-[200px] z-50">
                    {/* 複製連結 */}
                    <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-left transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 text-sm">已複製！</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-700 text-sm">複製連結</span>
                            </>
                        )}
                    </button>

                    {/* 原生分享（手機） */}
                    {'share' in navigator && (
                        <button
                            onClick={handleNativeShare}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-left transition-colors"
                        >
                            <Link2 className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-700 text-sm">分享至...</span>
                        </button>
                    )}

                    {/* 分享連結預覽 */}
                    <div className="border-t border-slate-100 mt-2 pt-2 px-3">
                        <p className="text-xs text-slate-400 mb-1">分享連結</p>
                        <p className="text-xs text-slate-500 break-all bg-slate-50 p-2 rounded">
                            {shareUrl.length > 60 ? shareUrl.slice(0, 60) + '...' : shareUrl}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * 精簡版分享按鈕
 */
export function ShareButton({ type, params }: Omit<ShareExportProps, 'summary'>) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareUrl = generateShareUrl(type, params);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'TaiCalc 試算結果',
                    url: shareUrl,
                });
                return;
            } catch {
                // fallback to copy
            }
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error('Failed to copy:', e);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            title="分享結果"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">已複製</span>
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4" />
                    <span>分享</span>
                </>
            )}
        </button>
    );
}
