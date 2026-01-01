'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function GlobalError({
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
        <html>
            <body className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">系統發生嚴重錯誤</h2>
                    <p className="text-slate-500 mb-8">
                        很抱歉，網站遇到無法預期的錯誤。我們已記錄此問題，請嘗試重新整理頁面。
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            重新載入
                        </button>
                        <button
                            onClick={() => reset()}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-indigo-500/30"
                        >
                            <RefreshCw className="w-4 h-4" />
                            重試操作
                        </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-8 p-4 bg-slate-50 rounded-lg text-left overflow-auto max-h-48 text-xs font-mono text-slate-600">
                            <p className="font-bold mb-1">Error Digest:</p>
                            {error.digest}
                            <p className="font-bold mt-2 mb-1">Message:</p>
                            {error.message}
                        </div>
                    )}
                </div>
            </body>
        </html>
    );
}
