'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, X, Bot, Loader2, Sparkles } from 'lucide-react';
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

    if (!isOpen) {
        return (
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                aria-label="開啟 AI 對話"
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-brand-primary to-blue-600 text-white rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-2xl transition-shadow"
            >
                <Bot className="w-6 h-6" />
            </motion.button>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 z-50 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-brand-primary to-blue-600 text-white px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">TaiCalc 數策</h3>
                            <p className="text-[10px] text-white/70">AI 財務顧問</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="關閉對話"
                        className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
                    {messages.length === 0 && (
                        <div className="text-center py-8">
                            <Bot className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm font-medium">您好！我是數策 AI 顧問</p>
                            <p className="text-slate-400 text-xs mt-1">試著問我：「月薪 8 萬買得起 2000 萬的房嗎？」</p>
                        </div>
                    )}

                    {messages.map(m => (
                        <div
                            key={m.id}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] ${m.role === 'user'
                                        ? 'bg-brand-primary text-white rounded-2xl rounded-tr-md'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-md shadow-sm'
                                    } px-4 py-3`}
                            >
                                <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>AI 正在思考與運算...</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200">
                    <div className="flex gap-2">
                        <input
                            className="flex-1 px-4 py-2 bg-slate-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm placeholder:text-slate-400"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="輸入財務問題..."
                            aria-label="輸入訊息"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            aria-label="發送訊息"
                            className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
    );
}

export default TaiCalcChat;
