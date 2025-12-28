'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Star, Flame, Globe, User, Calendar, Clock,
    Eye, Sparkles, RefreshCw, TrendingUp, PiggyBank, Heart,
    Shield, Zap, AlertTriangle, DollarSign
} from 'lucide-react';

type DivinationSystem = 'ziwei' | 'bazi' | 'western';
type Gender = 'male' | 'female' | 'other';

interface UserProfile {
    name: string;
    birthDate: string;
    birthTime: string;
    gender: Gender;
    system: DivinationSystem;
    salary?: number;
    retirementAge?: number;
}

const SYSTEMS = [
    { id: 'ziwei' as DivinationSystem, label: '紫微斗數', icon: Star, desc: '星辰軌跡' },
    { id: 'bazi' as DivinationSystem, label: '八字命理', icon: Flame, desc: '五行生剋' },
    { id: 'western' as DivinationSystem, label: '西洋占星', icon: Globe, desc: '行星相位' },
];

export default function FortunePage() {
    const [step, setStep] = useState<'input' | 'result'>('input');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');

    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        birthDate: '',
        birthTime: '12:00',
        gender: 'male',
        system: 'ziwei',
        salary: undefined,
        retirementAge: 60,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile.name || !profile.birthDate) return;

        setLoading(true);
        setResult('');

        try {
            const response = await fetch('/api/ai/fortune', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'financeFortune',
                    profile,
                    stream: true,
                }),
            });

            if (!response.ok) throw new Error('API Error');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('Cannot read stream');

            setStep('result');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                setResult(prev => prev + chunk);
            }
        } catch (err) {
            console.error(err);
            setResult('⚠️ 天機運算失敗，請稍後再試。');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStep('input');
        setResult('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-9 h-9 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 group-hover:border-purple-400 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-purple-400">TaiCalc</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Eye className="w-6 h-6 text-amber-400" />
                        <span className="font-black text-white tracking-wider">財運<span className="text-amber-400">命盤</span></span>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {step === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Hero */}
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 rounded-full border border-amber-500/30 mb-6">
                                    <Eye className="w-10 h-10 text-amber-400" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-wide">
                                    財運命盤<span className="text-amber-400">分析</span>
                                </h1>
                                <p className="text-slate-400 max-w-md mx-auto">
                                    結合命理智慧與財務規劃，為您揭示財運趨勢與理財建議
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-8 bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                                {/* Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                                        <User className="w-4 h-4" /> 姓名
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="請輸入姓名"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
                                        value={profile.name}
                                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                                            <Calendar className="w-4 h-4" /> 出生日期
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all [color-scheme:dark]"
                                            value={profile.birthDate}
                                            onChange={e => setProfile({ ...profile, birthDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                                            <Clock className="w-4 h-4" /> 出生時間
                                        </label>
                                        <input
                                            type="time"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all [color-scheme:dark]"
                                            value={profile.birthTime}
                                            onChange={e => setProfile({ ...profile, birthTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* System Selection */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                                        <Eye className="w-4 h-4" /> 命理系統
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {SYSTEMS.map(sys => {
                                            const Icon = sys.icon;
                                            return (
                                                <button
                                                    key={sys.id}
                                                    type="button"
                                                    onClick={() => setProfile({ ...profile, system: sys.id })}
                                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${profile.system === sys.id
                                                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                                                            : 'bg-slate-900/30 border-white/10 text-slate-400 hover:border-white/30'
                                                        }`}
                                                >
                                                    <Icon className="w-6 h-6 mb-2" />
                                                    <span className="text-xs font-bold">{sys.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Optional: Salary */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
                                        <DollarSign className="w-4 h-4" /> 月薪（選填，可獲得更精準建議）
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="例：60000"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                        value={profile.salary || ''}
                                        onChange={e => setProfile({ ...profile, salary: Number(e.target.value) || undefined })}
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading || !profile.name || !profile.birthDate}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black py-4 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg shadow-amber-500/20"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            天機運算中...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            啟動財運分析
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Features */}
                            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                                <div className="p-4">
                                    <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                    <div className="text-xs text-slate-400">財運趨勢</div>
                                </div>
                                <div className="p-4">
                                    <PiggyBank className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                    <div className="text-xs text-slate-400">理財建議</div>
                                </div>
                                <div className="p-4">
                                    <Shield className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                                    <div className="text-xs text-slate-400">風險提醒</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Result Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
                                    <Eye className="w-5 h-5 text-amber-400" />
                                    <span className="text-amber-400 font-bold">財運命盤分析結果</span>
                                </div>
                                <h2 className="text-2xl font-black">{profile.name} 的財運命盤</h2>
                                <p className="text-slate-400 text-sm mt-2">
                                    {profile.birthDate} · {SYSTEMS.find(s => s.id === profile.system)?.label}
                                </p>
                            </div>

                            {/* Result Content */}
                            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                                {loading && !result && (
                                    <div className="flex items-center justify-center gap-3 text-amber-400">
                                        <RefreshCw className="w-6 h-6 animate-spin" />
                                        <span>五老星運算中...</span>
                                    </div>
                                )}

                                <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-strong:text-amber-400 prose-h1:text-amber-400 prose-h2:text-amber-400 prose-h3:text-amber-400 prose-li:text-slate-300">
                                    {result.split('\n').map((line, i) => (
                                        <p key={i} className={line.startsWith('#') ? 'text-amber-400 font-bold text-lg' : ''}>
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 bg-slate-700 text-white font-bold py-4 rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    重新分析
                                </button>
                                <Link
                                    href="/retirement"
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 rounded-xl hover:from-blue-400 hover:to-indigo-400 transition-all flex items-center justify-center gap-2"
                                >
                                    <PiggyBank className="w-5 h-5" />
                                    前往退休規劃
                                </Link>
                            </div>

                            {/* Cross-linking */}
                            <div className="bg-purple-900/30 border border-purple-500/20 rounded-xl p-6 text-center">
                                <p className="text-purple-300 text-sm mb-3">
                                    💡 根據您的命盤特質，建議使用 TaiCalc 計算器做更精確的財務規劃
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <Link href="/salary" className="text-xs bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full hover:bg-purple-500/30 transition-all">
                                        薪資戰略
                                    </Link>
                                    <Link href="/tax" className="text-xs bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full hover:bg-purple-500/30 transition-all">
                                        稅務優化
                                    </Link>
                                    <Link href="/mortgage" className="text-xs bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full hover:bg-purple-500/30 transition-all">
                                        房貸佈局
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
