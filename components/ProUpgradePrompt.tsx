'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

export type TriggerType = 'result_completed' | 'repeat_usage' | 'long_dwell' | 'param_limited';

interface ProUpgradePromptProps {
    triggerType: TriggerType;
    isVisible: boolean;
    onDismiss: () => void;
    customMessage?: string;
}

const triggerMessages = {
    result_completed: {
        icon: '🔍',
        title: '如果改一個條件，結果會差多少？',
        description: 'Pro 版可同時比較多個方案，直接看出長期差距。',
        cta: '解鎖比較功能'
    },
    repeat_usage: {
        icon: '📊',
        title: '你已經算過好幾次了',
        description: 'Pro 版幫你把不同方案放在一起，不用再靠直覺猜。',
        cta: '開啟 Pro 分析'
    },
    long_dwell: {
        icon: '💡',
        title: '看得出來你很認真在研究',
        description: '不如讓系統幫你整理關鍵差異。',
        cta: '開啟 Pro 分析'
    },
    param_limited: {
        icon: '⚡',
        title: '免費版一次只能看一種情境',
        description: 'Pro 版可儲存並比較多個選擇。',
        cta: '解鎖完整功能'
    }
};

export default function ProUpgradePrompt({
    triggerType,
    isVisible,
    onDismiss,
    customMessage
}: ProUpgradePromptProps) {
    const [shouldRender, setShouldRender] = useState(false);

    const message = triggerMessages[triggerType];

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
        }
    }, [isVisible]);

    if (!shouldRender) return null;

    return (
        <AnimatePresence onExitComplete={() => setShouldRender(false)}>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="fixed bottom-6 right-6 z-50 max-w-sm"
                >
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-2xl shadow-indigo-900/30 p-6 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        {/* Close button */}
                        <button
                            onClick={onDismiss}
                            className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
                            aria-label="關閉"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="relative">
                            <div className="flex items-start space-x-3 mb-4">
                                <div className="text-3xl">{message.icon}</div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">
                                        {customMessage || message.title}
                                    </h3>
                                    <p className="text-white/90 text-sm">
                                        {message.description}
                                    </p>
                                </div>
                            </div>

                            {/* Price hint */}
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 mb-4 flex items-center justify-between">
                                <span className="text-xs font-medium">單次解鎖</span>
                                <span className="text-lg font-bold">NT$ 99</span>
                            </div>

                            {/* CTA */}
                            <Link
                                href="/pro"
                                className="block w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-all text-center shadow-lg active:scale-95 flex items-center justify-center group"
                            >
                                <span>{message.cta}</span>
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {/* Dismiss link */}
                            <button
                                onClick={onDismiss}
                                className="block w-full text-center text-white/60 text-xs mt-2 hover:text-white transition-colors"
                            >
                                稍後再說
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
