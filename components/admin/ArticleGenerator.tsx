'use client';

import { useState } from 'react';
import { Sparkles, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ArticleGenerator() {
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!topic.trim()) return;

        setIsGenerating(true);
        setContent('');
        setError('');

        try {
            const response = await fetch('/app/api/ai/article-generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            });

            if (!response.ok) {
                // If the updated path fails, try the standard API path structure
                const fallbackResponse = await fetch('/api/ai/article-generator', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ topic }),
                });

                if (!fallbackResponse.ok) {
                    throw new Error('Failed to generate article');
                }

                // Read the stream from fallback response
                const reader = fallbackResponse.body?.getReader();
                if (!reader) throw new Error('No readable stream');

                const decoder = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const text = decoder.decode(value, { stream: true });
                    setContent((prev) => prev + text);
                }
            } else {
                // Read the stream from first response
                const reader = response.body?.getReader();
                if (!reader) throw new Error('No readable stream');

                const decoder = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const text = decoder.decode(value, { stream: true });
                    setContent((prev) => prev + text);
                }
            }

        } catch (err) {
            console.error(err);
            setError('生成失敗，請稍後再試。');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        alert('已複製到剪貼簿！');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    TaiCalc 專欄作家 AI 產生器
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            文章主題
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="例如：2025年ETF定期定額策略、年輕人如何存第一桶金..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            disabled={isGenerating}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic.trim()}
                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isGenerating || !topic.trim()
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                正在撰寫中...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                開始撰寫
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {content && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <h3 className="font-semibold text-slate-700">文章預覽</h3>
                        <button
                            onClick={handleCopy}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            複製 Markdown
                        </button>
                    </div>
                    <div className="p-8 prose prose-slate max-w-none">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}
