'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, Loader2, X } from 'lucide-react';

interface EmailCaptureProps {
    source?: string;
    variant?: 'inline' | 'modal' | 'banner';
    onSuccess?: (email: string) => void;
}

export function EmailCapture({ source = 'unknown', variant = 'inline', onSuccess }: EmailCaptureProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('請輸入有效的 Email 地址');
            return;
        }

        setStatus('loading');
        setError('');

        try {
            // TODO: 實際 API 呼叫
            // const response = await fetch('/api/subscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, source }),
            // });

            // 模擬 API 延遲
            await new Promise(resolve => setTimeout(resolve, 1000));

            setStatus('success');
            onSuccess?.(email);

            // 儲存到 localStorage 避免重複顯示
            localStorage.setItem('taicalc_subscribed', 'true');
            localStorage.setItem('taicalc_email', email);
        } catch {
            setStatus('error');
            setError('訂閱失敗，請稍後再試');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold">訂閱成功！我們會定期寄送財務洞察給您</span>
            </div>
        );
    }

    if (variant === 'banner') {
        return (
            <div className="bg-gradient-to-r from-brand-primary to-blue-600 text-white p-4 md:p-6 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-lg mb-1">📬 訂閱財務洞察</h3>
                        <p className="text-blue-100 text-sm">每週一篇，幫助你做更好的財務決策</p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="px-4 py-2 rounded-lg text-slate-900 text-sm w-full sm:w-64"
                            disabled={status === 'loading'}
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-brand-primary rounded-lg font-bold hover:bg-blue-50 transition-all disabled:opacity-50 text-sm whitespace-nowrap"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" />
                                    <span>免費訂閱</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
                {error && <p className="text-red-200 text-sm mt-2">{error}</p>}
            </div>
        );
    }

    // Default: inline variant
    return (
        <div className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-md">
            <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-slate-900">訂閱財務洞察</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">每週一篇精選內容，助你做更好的財務決策</p>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    disabled={status === 'loading'}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                    {status === 'loading' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        '免費訂閱'
                    )}
                </button>
            </form>
            <p className="text-xs text-slate-400 mt-3 text-center">我們尊重您的隱私，隨時可取消訂閱</p>
        </div>
    );
}

// Modal 版本的 Email Capture
interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    source?: string;
}

export function EmailModal({ isOpen, onClose, source = 'modal' }: EmailModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 z-10"
                    aria-label="關閉"
                >
                    <X className="w-4 h-4 text-slate-500" />
                </button>
                <EmailCapture source={source} onSuccess={onClose} />
            </div>
        </div>
    );
}
