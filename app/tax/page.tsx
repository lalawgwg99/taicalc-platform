'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Zap, PieChart } from 'lucide-react';

export default function TaxPage() {
    return (
        <div className="min-h-screen bg-brand-background font-sans pb-32 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
            {/* 極光背景 */}
            <div className="fixed inset-0 pointer-events-none -z-10 aurora-bg opacity-70" />

            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary shadow-lg border border-white/5 transition-transform group-hover:scale-110">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-slate-600 group-hover:text-brand-primary transition-colors">返回首頁</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black shadow-glow">T</div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">TaiCalc <span className="text-brand-primary">數策</span></span>
                    </div>
                </div>
            </nav>

            <div className="glass-card p-12 rounded-[40px] max-w-2xl w-full border border-white/50 shadow-2xl relative z-10">
                <div className="w-20 h-20 bg-brand-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-brand-accent shadow-inner">
                    <PieChart className="w-10 h-10" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                    稅務優化 <span className="text-brand-accent">Coming Soon</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                    針對 2025 新制稅務模型正在構建中。<br />包含扶養策略、列舉扣除額模擬與節稅最佳路徑分析。
                </p>
                <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-bold">
                    <Zap className="w-4 h-4 fill-slate-400" />
                    <span>開發進度 85% · 預計下週上線</span>
                </div>
            </div>
        </div>
    );
}
