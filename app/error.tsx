'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="w-full min-h-[400px] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">區塊載入失敗</h2>
                <p className="text-sm text-slate-500 mb-6">
                    此區塊暫時無法顯示，請嘗試重試。
                </p>
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium rounded-lg transition-colors text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    重試
                </button>
            </div>
        </div>
    );
}
