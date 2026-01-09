'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Segment-level error boundary
 * Catches errors in route segments and provides recovery UI
 */
export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('[Segment Error]', error);
    }, [error]);

    return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-3">發生錯誤</h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    很抱歉，頁面載入時發生問題。這可能是暫時性的網路問題，請嘗試重新載入。
                </p>
                {error.digest && (
                    <p className="text-xs text-slate-400 mb-4 font-mono">
                        錯誤代碼: {error.digest}
                    </p>
                )}
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95 transition-all"
                >
                    <RefreshCw className="w-4 h-4" />
                    重新載入
                </button>
            </div>
        </div>
    );
}
