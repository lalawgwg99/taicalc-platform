'use client';

import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Global error boundary
 * Catches errors at the root level, including layout errors
 * Must include its own <html> and <body> tags
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
    return (
        <html lang="zh-TW">
            <body className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-10 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <AlertOctagon className="w-10 h-10 text-red-500" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        系統發生嚴重錯誤
                    </h1>

                    {/* Description */}
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        很抱歉，網站遇到無法預期的錯誤。我們已記錄此問題，請嘗試重新整理頁面。
                    </p>

                    {/* Error Digest */}
                    {error.digest && (
                        <div className="mb-6 px-4 py-2 bg-slate-50 rounded-lg">
                            <code className="text-xs text-slate-400 font-mono">
                                Error ID: {error.digest}
                            </code>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => (window.location.href = '/')}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            返回首頁
                        </button>
                        <button
                            onClick={reset}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            重試操作
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
