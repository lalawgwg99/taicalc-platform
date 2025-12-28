'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, AlertCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIInsightCardProps {
    prompt: string;
    context: any;
    buttonText?: string;
    title?: string;
}

export default function AIInsightCard({
    prompt,
    context,
    buttonText = "AI 戰略分析",
    title = "AI 智慧財稅顧問"
}: AIInsightCardProps) {
    const [completion, setCompletion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setCompletion('');

        try {
            const response = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, context }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'AI 服務異常');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('無法讀取串流回應');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                setCompletion(prev => prev + chunk);
            }
        } catch (err: any) {
            setError(err.message || 'AI 連線失敗');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {!completion && !isLoading && !error && (
                <button
                    onClick={handleAnalyze}
                    className="group relative w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-brand-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span className="relative z-10">{buttonText}</span>
                </button>
            )}

            <AnimatePresence>
                {(isLoading || completion || error) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative overflow-hidden"
                    >
                        <div className="glass-card rounded-2xl p-6 border-2 border-brand-primary/10 bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-100/50">
                            {/* Header */}
                            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-brand-primary/5">
                                <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-slate-800 tracking-tight">{title}</h3>
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400 ml-auto" />}
                            </div>

                            {/* Content */}
                            <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-strong:text-brand-primary prose-strong:font-black">
                                {completion ? (
                                    <ReactMarkdown>{completion}</ReactMarkdown>
                                ) : error ? (
                                    <div className="flex items-center text-red-500 space-x-2 bg-red-50 p-3 rounded-lg">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="font-bold text-sm">{error}</span>
                                    </div>
                                ) : (
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                                    </div>
                                )}
                            </div>

                            {/* Re-analyze Button */}
                            {(completion || error) && !isLoading && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={handleAnalyze}
                                        className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-xs transition-all"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>重新分析</span>
                                    </button>
                                    <p className="text-[10px] text-slate-400 text-center mt-2">💡 參數更新後再點一次分析</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
