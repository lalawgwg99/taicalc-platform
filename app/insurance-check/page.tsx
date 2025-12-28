'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Shield, Heart, Activity, Car, Home, Umbrella,
    CheckCircle2, AlertTriangle, XCircle, Sparkles, RefreshCw,
    User, Calendar, DollarSign, Users, Baby, Briefcase
} from 'lucide-react';

interface InsuranceProfile {
    age: number;
    gender: 'male' | 'female';
    maritalStatus: 'single' | 'married' | 'divorced';
    hasChildren: boolean;
    childrenCount: number;
    occupation: string;
    monthlyIncome: number;
    hasMortgage: boolean;
    mortgageAmount: number;
    currentInsurance: {
        life: boolean;
        medical: boolean;
        accident: boolean;
        cancer: boolean;
        disability: boolean;
        car: boolean;
    };
}

interface InsuranceRecommendation {
    type: string;
    icon: React.ReactNode;
    priority: 'essential' | 'recommended' | 'optional';
    status: 'have' | 'need' | 'upgrade';
    coverage: string;
    reason: string;
    suggestedAmount?: string;
}

const INSURANCE_TYPES = [
    { id: 'life', label: '壽險', icon: Heart },
    { id: 'medical', label: '實支實付醫療險', icon: Activity },
    { id: 'accident', label: '意外險', icon: Car },
    { id: 'cancer', label: '重大傷病/癌症險', icon: Shield },
    { id: 'disability', label: '失能險', icon: Umbrella },
    { id: 'car', label: '車險', icon: Car },
];

export default function InsuranceCheckPage() {
    const [step, setStep] = useState<'input' | 'result'>('input');
    const [loading, setLoading] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState('');

    const [profile, setProfile] = useState<InsuranceProfile>({
        age: 30,
        gender: 'male',
        maritalStatus: 'single',
        hasChildren: false,
        childrenCount: 0,
        occupation: '上班族',
        monthlyIncome: 50000,
        hasMortgage: false,
        mortgageAmount: 0,
        currentInsurance: {
            life: false,
            medical: false,
            accident: false,
            cancer: false,
            disability: false,
            car: false,
        }
    });

    const calculateRecommendations = (): InsuranceRecommendation[] => {
        const recs: InsuranceRecommendation[] = [];
        const { age, maritalStatus, hasChildren, monthlyIncome, hasMortgage, mortgageAmount, currentInsurance } = profile;

        // 1. 實支實付醫療險 - 必備
        recs.push({
            type: '實支實付醫療險',
            icon: <Activity className="w-6 h-6" />,
            priority: 'essential',
            status: currentInsurance.medical ? 'have' : 'need',
            coverage: '住院雜費 10-20 萬/次',
            reason: '健保不給付的自費項目越來越多，達文西手術、標靶藥物等動輒數十萬。',
            suggestedAmount: '建議投保 2 張，額度合計 20 萬以上'
        });

        // 2. 意外險 - 必備
        recs.push({
            type: '意外險',
            icon: <Car className="w-6 h-6" />,
            priority: 'essential',
            status: currentInsurance.accident ? 'have' : 'need',
            coverage: `意外身故 ${Math.max(monthlyIncome * 100, 200)} 萬`,
            reason: '保費便宜、保障高，是 CP 值最高的險種。',
            suggestedAmount: `建議保額至少年收入的 10 倍：${(monthlyIncome * 12 * 10 / 10000).toFixed(0)} 萬`
        });

        // 3. 壽險 - 有家庭責任者必備
        const needLife = maritalStatus === 'married' || hasChildren || hasMortgage;
        const lifeAmount = hasMortgage ? mortgageAmount : monthlyIncome * 12 * (hasChildren ? 10 : 5);
        recs.push({
            type: '定期壽險',
            icon: <Heart className="w-6 h-6" />,
            priority: needLife ? 'essential' : 'optional',
            status: currentInsurance.life ? (needLife ? 'upgrade' : 'have') : (needLife ? 'need' : 'have'),
            coverage: `身故保障 ${(lifeAmount / 10000).toFixed(0)} 萬`,
            reason: needLife
                ? `您${hasMortgage ? '有房貸' : ''}${hasChildren ? '有子女扶養責任' : ''}，需確保家人的經濟安全。`
                : '目前無家庭責任，可暫緩。等有房貸或小孩再規劃。',
            suggestedAmount: needLife ? `建議保額：${hasMortgage ? '房貸餘額 + ' : ''}年收入 ${hasChildren ? '10' : '5'} 倍` : undefined
        });

        // 4. 重大傷病/癌症險 - 建議
        recs.push({
            type: '重大傷病險',
            icon: <Shield className="w-6 h-6" />,
            priority: 'recommended',
            status: currentInsurance.cancer ? 'have' : 'need',
            coverage: '一次給付 100-200 萬',
            reason: '確診即理賠，可彌補治療期間的收入損失和龐大醫療支出。',
            suggestedAmount: '建議保額 100-200 萬，視預算而定'
        });

        // 5. 失能險 - 年輕人建議
        recs.push({
            type: '失能險',
            icon: <Umbrella className="w-6 h-6" />,
            priority: age < 45 ? 'recommended' : 'optional',
            status: currentInsurance.disability ? 'have' : 'need',
            coverage: '失能月給付 3-5 萬',
            reason: '比死亡更可怕的是失去工作能力卻還活著。長照費用每月 3-6 萬起。',
            suggestedAmount: '建議月給付額度至少 3 萬'
        });

        return recs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAiAnalysis('');

        // 計算推薦
        const recommendations = calculateRecommendations();

        // 呼叫 AI 分析
        try {
            const response = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `你是保險規劃專家。請根據以下用戶資料，提供個人化的保險規劃建議：

用戶資料：
- 年齡：${profile.age} 歲
- 性別：${profile.gender === 'male' ? '男' : '女'}
- 婚姻狀態：${profile.maritalStatus === 'single' ? '單身' : profile.maritalStatus === 'married' ? '已婚' : '離異'}
- 有無子女：${profile.hasChildren ? `有，${profile.childrenCount} 位` : '無'}
- 職業：${profile.occupation}
- 月收入：${profile.monthlyIncome} 元
- 有無房貸：${profile.hasMortgage ? `有，${profile.mortgageAmount} 萬` : '無'}
- 現有保險：${Object.entries(profile.currentInsurance).filter(([, v]) => v).map(([k]) => INSURANCE_TYPES.find(t => t.id === k)?.label).join('、') || '無'}

請提供：
1. 目前保障缺口分析（2-3 句話）
2. 最優先需要補強的 2 個險種
3. 預算分配建議（假設年預算為年收入的 6-10%）
4. 一句話總結

回答請精簡、專業、具體。`,
                    context: { profile, recommendations }
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
                setAiAnalysis(prev => prev + chunk);
            }
        } catch (err) {
            console.error(err);
            setStep('result');
            setAiAnalysis('⚠️ AI 分析暫時無法使用，但您仍可參考下方的保險建議。');
        } finally {
            setLoading(false);
        }
    };

    const recommendations = step === 'result' ? calculateRecommendations() : [];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/articles" className="flex items-center space-x-3 group">
                        <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 shadow-sm group-hover:border-rose-500 group-hover:text-rose-500 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-600">知識庫</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Shield className="w-6 h-6 text-rose-500" />
                        <span className="font-black text-slate-900">保險<span className="text-rose-500">健檢</span></span>
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
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-100 rounded-full mb-6">
                                    <Shield className="w-10 h-10 text-rose-500" />
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 mb-4">
                                    免費保險<span className="text-rose-500">健檢</span>
                                </h1>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    3 分鐘了解您的保障缺口，AI 幫您規劃最適合的保險組合
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                                {/* 基本資料 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                            <Calendar className="w-4 h-4" /> 年齡
                                        </label>
                                        <input
                                            type="number"
                                            min="18"
                                            max="70"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500"
                                            value={profile.age}
                                            onChange={e => setProfile({ ...profile, age: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                            <User className="w-4 h-4" /> 性別
                                        </label>
                                        <div className="flex gap-2">
                                            {['male', 'female'].map(g => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => setProfile({ ...profile, gender: g as 'male' | 'female' })}
                                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${profile.gender === g
                                                            ? 'bg-rose-500 text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {g === 'male' ? '男' : '女'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 家庭狀況 */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                        <Users className="w-4 h-4" /> 婚姻狀態
                                    </label>
                                    <div className="flex gap-2">
                                        {[
                                            { id: 'single', label: '單身' },
                                            { id: 'married', label: '已婚' },
                                            { id: 'divorced', label: '離異' },
                                        ].map(s => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => setProfile({ ...profile, maritalStatus: s.id as 'single' | 'married' | 'divorced' })}
                                                className={`flex-1 py-3 rounded-xl font-bold transition-all ${profile.maritalStatus === s.id
                                                        ? 'bg-rose-500 text-white'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 子女 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                            <Baby className="w-4 h-4" /> 有無子女
                                        </label>
                                        <div className="flex gap-2">
                                            {[true, false].map(v => (
                                                <button
                                                    key={String(v)}
                                                    type="button"
                                                    onClick={() => setProfile({ ...profile, hasChildren: v, childrenCount: v ? 1 : 0 })}
                                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${profile.hasChildren === v
                                                            ? 'bg-rose-500 text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {v ? '有' : '無'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {profile.hasChildren && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                                                子女人數
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500"
                                                value={profile.childrenCount}
                                                onChange={e => setProfile({ ...profile, childrenCount: Number(e.target.value) })}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* 收入 */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                        <DollarSign className="w-4 h-4" /> 月收入
                                    </label>
                                    <input
                                        type="number"
                                        min="20000"
                                        step="5000"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500"
                                        value={profile.monthlyIncome}
                                        onChange={e => setProfile({ ...profile, monthlyIncome: Number(e.target.value) })}
                                    />
                                </div>

                                {/* 房貸 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                            <Home className="w-4 h-4" /> 有無房貸
                                        </label>
                                        <div className="flex gap-2">
                                            {[true, false].map(v => (
                                                <button
                                                    key={String(v)}
                                                    type="button"
                                                    onClick={() => setProfile({ ...profile, hasMortgage: v, mortgageAmount: v ? 500 : 0 })}
                                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${profile.hasMortgage === v
                                                            ? 'bg-rose-500 text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {v ? '有' : '無'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {profile.hasMortgage && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                                                房貸餘額（萬）
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="50"
                                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500"
                                                value={profile.mortgageAmount}
                                                onChange={e => setProfile({ ...profile, mortgageAmount: Number(e.target.value) })}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* 現有保險 */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                        <Shield className="w-4 h-4" /> 目前已有的保險（可複選）
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {INSURANCE_TYPES.map(type => {
                                            const Icon = type.icon;
                                            const isSelected = profile.currentInsurance[type.id as keyof typeof profile.currentInsurance];
                                            return (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setProfile({
                                                        ...profile,
                                                        currentInsurance: {
                                                            ...profile.currentInsurance,
                                                            [type.id]: !isSelected
                                                        }
                                                    })}
                                                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${isSelected
                                                            ? 'bg-rose-50 border-rose-500 text-rose-600'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                                                        }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span className="text-sm font-bold">{type.label}</span>
                                                    {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black py-4 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg shadow-lg shadow-rose-200"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            AI 分析中...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            開始保險健檢
                                        </>
                                    )}
                                </button>
                            </form>
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
                                <div className="inline-flex items-center gap-2 bg-rose-100 rounded-full px-4 py-2 mb-4">
                                    <Shield className="w-5 h-5 text-rose-500" />
                                    <span className="text-rose-600 font-bold">保險健檢報告</span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">您的保障缺口分析</h2>
                            </div>

                            {/* AI Analysis */}
                            {(aiAnalysis || loading) && (
                                <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles className="w-5 h-5 text-rose-500" />
                                        <span className="font-bold text-rose-600">AI 個人化建議</span>
                                        {loading && <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />}
                                    </div>
                                    <div className="prose prose-sm max-w-none text-slate-700">
                                        {aiAnalysis.split('\n').map((line, i) => (
                                            <p key={i}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recommendations */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-slate-900">保險規劃建議</h3>
                                {recommendations.map((rec, i) => (
                                    <div
                                        key={i}
                                        className={`p-6 rounded-2xl border ${rec.status === 'have'
                                                ? 'bg-emerald-50 border-emerald-200'
                                                : rec.status === 'need'
                                                    ? 'bg-rose-50 border-rose-200'
                                                    : 'bg-amber-50 border-amber-200'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl ${rec.status === 'have' ? 'bg-emerald-100 text-emerald-600' :
                                                    rec.status === 'need' ? 'bg-rose-100 text-rose-600' :
                                                        'bg-amber-100 text-amber-600'
                                                }`}>
                                                {rec.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-slate-900">{rec.type}</span>
                                                    {rec.status === 'have' && (
                                                        <span className="text-xs bg-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full font-bold">已有 ✓</span>
                                                    )}
                                                    {rec.status === 'need' && (
                                                        <span className="text-xs bg-rose-200 text-rose-700 px-2 py-0.5 rounded-full font-bold">需補強</span>
                                                    )}
                                                    {rec.status === 'upgrade' && (
                                                        <span className="text-xs bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-bold">建議加強</span>
                                                    )}
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${rec.priority === 'essential' ? 'bg-slate-900 text-white' :
                                                            rec.priority === 'recommended' ? 'bg-slate-200 text-slate-700' :
                                                                'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {rec.priority === 'essential' ? '必備' : rec.priority === 'recommended' ? '建議' : '選配'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2">{rec.reason}</p>
                                                <p className="text-sm font-bold text-slate-800">建議額度：{rec.coverage}</p>
                                                {rec.suggestedAmount && (
                                                    <p className="text-xs text-slate-500 mt-1">💡 {rec.suggestedAmount}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => { setStep('input'); setAiAnalysis(''); }}
                                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    重新健檢
                                </button>
                                <Link
                                    href="/articles/labor-pension-2025"
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Shield className="w-5 h-5" />
                                    閱讀保險知識
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
