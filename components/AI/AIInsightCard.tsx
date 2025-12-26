'use client';

import React from 'react';
import { useCompletion } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, AlertCircle, Play, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIInsightCardProps {
    prompt: string;      // 給 AI 的具體指令 (e.g. "分析這份薪資單的談判空間")
    context: any;        // JSON 數據 (e.g. { monthlySalary: 50000, ... })
    buttonText?: string;
    title?: string;
}

export default function AIInsightCard({
    prompt,
    context,
    buttonText = "AI 戰略分析",
    title = "AI 智慧財稅顧問"
}: AIInsightCardProps) {
    const { completion, isLoading, error, complete } = useCompletion({
        api: '/api/ai/analyze',
    });

    const handleAnalyze = () => {
        complete(prompt, { body: { context } });
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
                                        <span className="font-bold text-sm">AI 連線失敗，請檢查 API Key 設定或稍後再試。</span>
                                    </div>
                                ) : (
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
