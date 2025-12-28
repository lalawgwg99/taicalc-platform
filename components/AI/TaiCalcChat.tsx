'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, X, Sparkles, Loader2, MessageCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function TaiCalcChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) throw new Error('AI 回應失敗');

            const text = await response.text();

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: text,
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: '抱歉，發生錯誤。請稍後再試。',
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 快捷問題
    const quickQuestions = [
        '月薪 5 萬，適合買多少錢的房？',
        '我該自提勞退嗎？',
        '年薪 120 萬要繳多少稅？',
    ];

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                {/* 脈動光環 */}
                <div className="absolute inset-0 w-16 h-16 -m-1">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 animate-ping" />
                </div>

                {/* 主按鈕 */}
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    aria-label="開啟 AI 財務顧問"
                    className="relative w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:shadow-purple-500/25 transition-all duration-300"
                >
                    <Sparkles className="w-7 h-7" />

                    {/* 小標籤 */}
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                        AI
                    </span>
                </motion.button>

                {/* 提示文字 */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute right-20 top-1/2 -translate-y-1/2 bg-white px-3 py-2 rounded-xl shadow-lg whitespace-nowrap text-sm font-medium text-slate-700 hidden lg:block"
                >
                    <span className="text-purple-600">✨ 問我財務問題</span>
                    <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45" />
                </motion.div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/50 z-50 overflow-hidden"
            >
                {/* 頭部 - 漸層背景 */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-5 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">數策 AI 顧問</h3>
                                <div className="flex items-center space-x-1 text-[11px] text-white/70">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <span>線上 • 可自動計算</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="關閉對話"
                            className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 對話區域 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white" ref={scrollRef}>
                    {messages.length === 0 && (
                        <div className="space-y-4">
                            {/* 歡迎訊息 */}
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-8 h-8 text-purple-600" />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">您好！我是數策 AI</h4>
                                <p className="text-slate-500 text-sm">我可以幫您計算薪資、稅務、房貸等財務問題</p>
                            </div>

                            {/* 快捷問題 */}
                            <div className="space-y-2">
                                <p className="text-xs text-slate-400 font-medium px-1">💡 試試這些問題：</p>
                                {quickQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(q)}
                                        className="w-full text-left px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:border-purple-300 transition-all flex items-center space-x-2"
                                    >
                                        <Zap className="w-4 h-4 text-amber-500" />
                                        <span>{q}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map(m => (
                        <div
                            key={m.id}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] ${m.role === 'user'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-md'
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-md shadow-sm'
                                    } px-4 py-3`}
                            >
                                <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%] shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                            <span className="text-sm text-slate-500">AI 正在計算中...</span>
                        </div>
                    )}
                </div>

                {/* 輸入區域 */}
                <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
                    <div className="flex gap-2">
                        <input
                            className="flex-1 px-4 py-3 bg-slate-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-sm placeholder:text-slate-400"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="輸入您的財務問題..."
                            aria-label="輸入訊息"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            aria-label="發送訊息"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center mt-2">
                        由 Gemini 2.5 Flash 驅動 • 計算結果僅供參考
                    </p>
                </form>
            </motion.div>
        </AnimatePresence>
    );
}

export default TaiCalcChat;

