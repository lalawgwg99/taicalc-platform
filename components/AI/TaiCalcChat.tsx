'use client';

import { useRef, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import {
    Send,
    X,
    Sparkles,
    Loader2,
    MessageCircle,
    Zap,
    RefreshCw,
    Bot,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function TaiCalcChat() {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, reload, stop } = useChat({
        onError: (error) => {
            console.error('Chat error:', error);
            setErrorMsg(error.message || '發生未知錯誤');
        },
    });

    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    /* 自動捲到底 */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleQuickQuestion = (q: string) => {
        // 手動觸發 submit
        const event = { preventDefault: () => { } } as any;
        handleInputChange({ target: { value: q } } as any);
        // 需要一點延遲讓 input update
        setTimeout(() => {
            handleSubmit(event, { body: {} });
        }, 0);
    };

    const handleClearChat = () => {
        stop();
        setMessages([]);
    };

    const quickQuestions = [
        '月薪 5 萬，適合買多少錢的房？',
        '我該自提勞退嗎？',
        '年薪 120 萬要繳多少稅？',
    ];

    const hasUserMessage = messages.some((m: any) => m.role === 'user');

    /* 關閉狀態（浮動按鈕） */
    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <div className="absolute inset-0 w-16 h-16 -m-1">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 animate-ping" />
                </div>

                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="relative w-16 h-16 glass-card border-none bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:shadow-indigo-500/40 transition-shadow"
                >
                    <Sparkles className="w-7 h-7" />
                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white shadow-sm">
                        AI
                    </span>
                </motion.button>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                className="fixed bottom-6 right-6 w-[380px] h-[600px] glass-panel rounded-3xl flex flex-col z-50 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 text-white px-5 py-4 flex justify-between items-center shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="font-bold text-sm tracking-wide">AI 財務顧問</div>
                            <div className="text-[10px] opacity-80 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                Online
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={handleClearChat} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="清除對話">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="關閉視窗">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/50"
                >
                    {!hasUserMessage && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                                <Bot className="w-8 h-8 text-indigo-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-800">您好，我是 TaiCalc AI</h3>
                                <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
                                    我可以幫您計算薪資結構、稅務規劃或房貸試算
                                </p>
                            </div>
                            <div className="w-full space-y-2 px-4">
                                {quickQuestions.map(q => (
                                    <button
                                        key={q}
                                        onClick={() => handleQuickQuestion(q)}
                                        className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-left text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all text-ellipsis overflow-hidden whitespace-nowrap"
                                    >
                                        <Zap className="inline w-3 h-3 mr-2 text-amber-500" />
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {Array.isArray(messages) && messages.map((m: any) => (
                        <div
                            key={m.id}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm block ${m.role === 'user'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none prose prose-sm max-w-none'
                                    }`}
                            >
                                <ReactMarkdown>{m.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/50 border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2 text-xs text-slate-500">
                                <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                                正在分析您的財務數據...
                            </div>
                        </div>
                    )}
                    {errorMsg && (
                        <div className="mx-4 my-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center justify-between">
                            <span>{errorMsg}</span>
                            <button onClick={() => { setErrorMsg(null); reload(); }} className="text-red-400 hover:text-red-700">
                                <RefreshCw className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form
                    onSubmit={handleSubmit}
                    className="p-4 bg-white/80 backdrop-blur-md border-t border-white/50"
                >
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="輸入您的問題..."
                            className="glass-input w-full px-4 py-3 rounded-xl text-sm placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
    );
}
