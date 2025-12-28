'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Home, ChevronLeft, Zap, Building, DollarSign, Calculator,
    TrendingUp, CheckCircle, AlertTriangle, Loader2
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AssessmentInput {
    monthlySalary: number;
    bonusMonths: number;
    dependents: number;
    isMarried: boolean;
    targetHousePrice: number;
    downPaymentRatio: number;
    interestRate: number;
    loanYears: number;
}

interface AssessmentResult {
    salary: {
        monthly: { takeHome: number; gross: number };
        annual: { net: number; gross: number; tax: number };
    };
    mortgage: {
        loanAmount: number;
        downPayment: number;
        monthlyPayment: number;
        totalInterest: number;
    };
    analysis: {
        affordabilityRatio: number;
        isAffordable: boolean;
        maxRecommendedPrice: number;
        riskLevel: 'low' | 'medium' | 'high';
        suggestions: string[];
    };
}

export default function HomeAssessmentPage() {
    const [input, setInput] = useState<AssessmentInput>({
        monthlySalary: 50000,
        bonusMonths: 2,
        dependents: 0,
        isMarried: false,
        targetHousePrice: 15000000,
        downPaymentRatio: 20,
        interestRate: 2.15,
        loanYears: 30,
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 執行評估
    const runAssessment = async () => {
        setLoading(true);
        setError(null);

        try {
            // Step 1: 薪資分析
            const salaryRes = await fetch('/api/skills/salary.analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: {
                        monthlySalary: input.monthlySalary,
                        bonusMonths: input.bonusMonths,
                        dependents: input.dependents,
                        isMarried: input.isMarried,
                    }
                }),
            });
            const salaryData = await salaryRes.json();
            if (!salaryData.success) throw new Error(salaryData.error);

            // Step 2: 房貸計算
            const loanAmount = input.targetHousePrice * (1 - input.downPaymentRatio / 100);
            const mortgageRes = await fetch('/api/skills/mortgage.calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: {
                        loanAmount,
                        annualRate: input.interestRate,
                        years: input.loanYears,
                        gracePeriod: 0,
                    }
                }),
            });
            const mortgageData = await mortgageRes.json();
            if (!mortgageData.success) throw new Error(mortgageData.error);

            // Step 3: 分析
            const monthlyPayment = mortgageData.data.monthlyPayment;
            const monthlyTakeHome = salaryData.data.monthly.takeHome;
            const affordabilityRatio = (monthlyPayment / monthlyTakeHome) * 100;

            // 建議房價 (月付金不超過月收入 30%)
            const maxMonthlyPayment = monthlyTakeHome * 0.3;
            const maxLoanAmount = maxMonthlyPayment / (mortgageData.data.monthlyPayment / loanAmount);
            const maxRecommendedPrice = maxLoanAmount / (1 - input.downPaymentRatio / 100);

            const suggestions: string[] = [];
            let riskLevel: 'low' | 'medium' | 'high' = 'low';

            if (affordabilityRatio > 50) {
                riskLevel = 'high';
                suggestions.push('房貸佔收入超過 50%，財務壓力極大，建議降低預算');
            } else if (affordabilityRatio > 30) {
                riskLevel = 'medium';
                suggestions.push('房貸佔收入超過 30%，建議增加頭期款或選擇較低總價');
            } else {
                suggestions.push('房貸負擔在合理範圍內，財務狀況健康');
            }

            if (input.downPaymentRatio < 20) {
                suggestions.push('頭期款比例偏低，建議至少準備 20% 以上');
            }

            if (salaryData.data.insights.recommendation) {
                suggestions.push(salaryData.data.insights.recommendation);
            }

            setResult({
                salary: {
                    monthly: {
                        takeHome: salaryData.data.monthly.takeHome,
                        gross: salaryData.data.monthly.gross,
                    },
                    annual: {
                        net: salaryData.data.annual.net,
                        gross: salaryData.data.annual.gross,
                        tax: salaryData.data.annual.tax,
                    },
                },
                mortgage: {
                    loanAmount,
                    downPayment: input.targetHousePrice - loanAmount,
                    monthlyPayment,
                    totalInterest: mortgageData.data.totalInterest,
                },
                analysis: {
                    affordabilityRatio,
                    isAffordable: affordabilityRatio <= 30,
                    maxRecommendedPrice,
                    riskLevel,
                    suggestions,
                },
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : '評估失敗');
        } finally {
            setLoading(false);
        }
    };

    const updateInput = (key: keyof AssessmentInput, value: unknown) => {
        setInput(prev => ({ ...prev, [key]: value }));
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-brand-background font-sans pb-8">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary shadow-lg border border-white/5 transition-transform group-hover:scale-110">
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <span className="hidden md:block text-lg font-bold text-slate-600">返回首頁</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black shadow-glow">T</div>
                        <span className="hidden md:inline text-lg font-bold tracking-tight text-slate-900">TaiCalc <span className="text-brand-primary">數策</span></span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                {/* Header */}
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3 mb-3"
                    >
                        <div className="bg-gradient-to-r from-brand-primary to-blue-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Skill Chain</div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">買房全能評估</h1>
                    </motion.div>
                    <p className="text-slate-500 font-medium max-w-2xl text-lg">
                        一站式評估：薪資分析 → 稅務計算 → 房貸試算 → AI 建議
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 左側：輸入 */}
                    <div className="space-y-6">
                        {/* 薪資設定 */}
                        <section className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-md">
                            <div className="flex items-center space-x-2 text-brand-primary mb-6">
                                <DollarSign className="w-5 h-5" />
                                <h2 className="font-black uppercase tracking-widest text-sm text-slate-400">薪資條件</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">月薪 (元)</label>
                                    <input
                                        type="number"
                                        value={input.monthlySalary}
                                        onChange={e => updateInput('monthlySalary', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-bold text-slate-900"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">年終 (月)</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={input.bonusMonths}
                                            onChange={e => updateInput('bonusMonths', Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-bold text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">眷屬人數</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={input.dependents}
                                            onChange={e => updateInput('dependents', Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-bold text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 房屋設定 */}
                        <section className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-md">
                            <div className="flex items-center space-x-2 text-brand-primary mb-6">
                                <Building className="w-5 h-5" />
                                <h2 className="font-black uppercase tracking-widest text-sm text-slate-400">房屋條件</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">目標房價 (元)</label>
                                    <input
                                        type="number"
                                        value={input.targetHousePrice}
                                        onChange={e => updateInput('targetHousePrice', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-bold text-slate-900"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">頭期款 (%)</label>
                                        <input
                                            type="number"
                                            min="10"
                                            max="100"
                                            value={input.downPaymentRatio}
                                            onChange={e => updateInput('downPaymentRatio', Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-bold text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">利率 (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={input.interestRate}
                                            onChange={e => updateInput('interestRate', Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-bold text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">年限</label>
                                        <input
                                            type="number"
                                            min="10"
                                            max="40"
                                            value={input.loanYears}
                                            onChange={e => updateInput('loanYears', Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-bold text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 執行按鈕 */}
                        <button
                            onClick={runAssessment}
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-brand-primary text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Zap className="w-5 h-5" />
                            )}
                            <span>{loading ? '評估中...' : '🚀 開始全能評估'}</span>
                        </button>
                    </div>

                    {/* 右側：結果 */}
                    <div className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-600">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                {error}
                            </div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* 總評分 */}
                                <div className={`rounded-2xl p-6 border-2 ${result.analysis.riskLevel === 'low' ? 'bg-green-50 border-green-300' :
                                        result.analysis.riskLevel === 'medium' ? 'bg-amber-50 border-amber-300' :
                                            'bg-red-50 border-red-300'
                                    }`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-black text-slate-900">評估結果</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${result.analysis.riskLevel === 'low' ? 'bg-green-200 text-green-800' :
                                                result.analysis.riskLevel === 'medium' ? 'bg-amber-200 text-amber-800' :
                                                    'bg-red-200 text-red-800'
                                            }`}>
                                            {result.analysis.riskLevel === 'low' ? '✅ 財務健康' :
                                                result.analysis.riskLevel === 'medium' ? '⚠️ 需注意' :
                                                    '❌ 高風險'}
                                        </span>
                                    </div>
                                    <div className="text-4xl font-black text-slate-900 mb-2">
                                        {result.analysis.affordabilityRatio.toFixed(1)}%
                                    </div>
                                    <p className="text-slate-600">房貸佔月收入比例</p>
                                </div>

                                {/* 薪資分析 */}
                                <div className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-md">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                                        <DollarSign className="w-5 h-5 text-brand-primary mr-2" />
                                        薪資分析
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <div className="text-slate-500">月實領</div>
                                            <div className="text-lg font-bold text-brand-primary">${formatCurrency(result.salary.monthly.takeHome)}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <div className="text-slate-500">年淨收入</div>
                                            <div className="text-lg font-bold text-slate-900">${formatCurrency(result.salary.annual.net)}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <div className="text-slate-500">年所得稅</div>
                                            <div className="text-lg font-bold text-amber-600">${formatCurrency(result.salary.annual.tax)}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <div className="text-slate-500">年總收入</div>
                                            <div className="text-lg font-bold text-slate-700">${formatCurrency(result.salary.annual.gross)}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 房貸分析 */}
                                <div className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-md">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                                        <Building className="w-5 h-5 text-brand-primary mr-2" />
                                        房貸分析
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <div className="text-slate-500">月付金</div>
                                            <div className="text-lg font-bold text-red-600">${formatCurrency(result.mortgage.monthlyPayment)}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <div className="text-slate-500">貸款金額</div>
                                            <div className="text-lg font-bold text-slate-900">${formatCurrency(result.mortgage.loanAmount)}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <div className="text-slate-500">頭期款</div>
                                            <div className="text-lg font-bold text-green-600">${formatCurrency(result.mortgage.downPayment)}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <div className="text-slate-500">總利息</div>
                                            <div className="text-lg font-bold text-amber-600">${formatCurrency(result.mortgage.totalInterest)}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 建議 */}
                                <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-md">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                                        <TrendingUp className="w-5 h-5 text-brand-primary mr-2" />
                                        AI 建議
                                    </h3>
                                    <ul className="space-y-2">
                                        {result.analysis.suggestions.map((s, i) => (
                                            <li key={i} className="flex items-start text-sm text-slate-700">
                                                <CheckCircle className="w-4 h-4 text-brand-primary mr-2 mt-0.5 flex-shrink-0" />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 pt-4 border-t border-blue-200">
                                        <p className="text-sm text-slate-600">
                                            <span className="font-bold">建議房價上限：</span>
                                            <span className="text-brand-primary font-black">${formatCurrency(Math.round(result.analysis.maxRecommendedPrice))}</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {!result && !loading && (
                            <div className="glass-card rounded-2xl p-12 bg-white border border-slate-200 shadow-md text-center">
                                <Home className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium">輸入條件後點擊「開始全能評估」</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
