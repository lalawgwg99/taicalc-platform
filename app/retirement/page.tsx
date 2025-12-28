'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, Download, Target, Wallet, TrendingUp, Calendar, PiggyBank, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import AIInsightCard from '@/components/AI/AIInsightCard';

// 勞退新制參數 (2025)
const LABOR_PENSION = {
    EMPLOYER_RATE: 0.06, // 雇主提撥 6%
    MAX_CONTRIBUTION_BASE: 150000, // 最高提繳工資
    ASSUMED_RETURN: 0.03, // 勞退基金保證收益約 2-3%
};

export default function RetirementPage() {
    // 核心狀態
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(65);
    const [currentSavings, setCurrentSavings] = useState(500000);
    const [monthlyContribution, setMonthlyContribution] = useState(15000);
    const [expectedReturn, setExpectedReturn] = useState(5);
    const [monthlySalary, setMonthlySalary] = useState(50000);

    // 計算結果
    const results = useMemo(() => {
        const yearsToRetirement = Math.max(0, retirementAge - currentAge);
        const months = yearsToRetirement * 12;
        const monthlyRate = expectedReturn / 100 / 12;

        // === 個人投資部分 (複利計算) ===
        // FV = PV * (1+r)^n + PMT * ((1+r)^n - 1) / r
        let personalFutureValue = 0;
        if (monthlyRate === 0) {
            personalFutureValue = currentSavings + monthlyContribution * months;
        } else {
            const factor = Math.pow(1 + monthlyRate, months);
            personalFutureValue =
                currentSavings * factor +
                monthlyContribution * ((factor - 1) / monthlyRate);
        }

        // === 勞退新制部分 ===
        // 雇主每月提撥 = 薪資 * 6% (上限 15 萬)
        const laborBase = Math.min(monthlySalary, LABOR_PENSION.MAX_CONTRIBUTION_BASE);
        const monthlyLaborContribution = laborBase * LABOR_PENSION.EMPLOYER_RATE;
        const laborMonthlyRate = LABOR_PENSION.ASSUMED_RETURN / 12;

        let laborPensionValue = 0;
        if (laborMonthlyRate === 0) {
            laborPensionValue = monthlyLaborContribution * months;
        } else {
            const laborFactor = Math.pow(1 + laborMonthlyRate, months);
            laborPensionValue = monthlyLaborContribution * ((laborFactor - 1) / laborMonthlyRate);
        }

        // === 總退休金 ===
        const totalRetirementFund = personalFutureValue + laborPensionValue;

        // === 4% 法則月領金額 ===
        const monthlyWithdrawal = (totalRetirementFund * 0.04) / 12;

        // === 反推：若要達成目標，需要存多少 ===
        const targetFund = 20000000; // 2000 萬目標
        let requiredMonthly = 0;
        if (months > 0 && monthlyRate > 0) {
            const factor = Math.pow(1 + monthlyRate, months);
            // PMT = (FV - PV * (1+r)^n) * r / ((1+r)^n - 1)
            requiredMonthly = Math.max(0,
                (targetFund - currentSavings * factor) * monthlyRate / (factor - 1)
            );
        } else if (months > 0) {
            requiredMonthly = Math.max(0, (targetFund - currentSavings) / months);
        }

        return {
            yearsToRetirement,
            personalFutureValue: Math.round(personalFutureValue),
            laborPensionValue: Math.round(laborPensionValue),
            totalRetirementFund: Math.round(totalRetirementFund),
            monthlyWithdrawal: Math.round(monthlyWithdrawal),
            requiredMonthly: Math.round(requiredMonthly),
            totalContributed: Math.round(currentSavings + monthlyContribution * months),
            investmentGain: Math.round(personalFutureValue - currentSavings - monthlyContribution * months),
        };
    }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, monthlySalary]);

    // 下載報表
    const handleDownload = () => {
        const report = `
TaiCalc 數策 - 退休規劃報表
==============================
生成時間: ${new Date().toLocaleString('zh-TW')}

【個人資料】
現在年齡: ${currentAge} 歲
預計退休: ${retirementAge} 歲
距離退休: ${results.yearsToRetirement} 年

【投資參數】
目前存款: ${formatCurrency(currentSavings)}
每月定存: ${formatCurrency(monthlyContribution)}
預期報酬: ${expectedReturn}%
月薪(勞退): ${formatCurrency(monthlySalary)}

【退休金預估】
個人投資: ${formatCurrency(results.personalFutureValue)}
勞退新制: ${formatCurrency(results.laborPensionValue)}
退休總額: ${formatCurrency(results.totalRetirementFund)}

【4% 法則】
每月可領: ${formatCurrency(results.monthlyWithdrawal)}

==============================
由 TaiCalc 數策 提供
        `.trim();

        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `退休規劃_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32">
            {/* 導航欄 */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 shadow-sm group-hover:border-brand-primary group-hover:text-brand-primary transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-slate-600 group-hover:text-brand-primary">首頁</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black text-xs shadow-glow">T</div>
                        <span className="font-black text-slate-900 tracking-tighter">TaiCalc <span className="text-brand-primary">數策</span></span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {/* 標題區 */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3 text-[10px] font-black tracking-[0.2em] text-brand-primary uppercase">
                            <span className="bg-brand-primary/10 px-2 py-0.5 rounded">簡潔穩定版</span>
                            <span>v1.0.0</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            退休規劃 <span className="text-brand-primary font-outline">RETIRE</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-xl">
                            簡單複利計算 + 勞退新制試算，幫你算出退休需要多少錢。
                        </p>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-brand-primary transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        <span>下載報表</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* 左側：控制面板 */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* 快速情境 */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">⚡ 快速情境</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: '👶 剛出社會', age: 25, savings: 100000, monthly: 10000 },
                                    { name: '👨‍💼 中堅份子', age: 35, savings: 1000000, monthly: 20000 },
                                    { name: '👴 準備退休', age: 50, savings: 3000000, monthly: 30000 },
                                    { name: '🎯 積極存錢', age: 30, savings: 500000, monthly: 35000 },
                                ].map((s) => (
                                    <button
                                        key={s.name}
                                        onClick={() => {
                                            setCurrentAge(s.age);
                                            setCurrentSavings(s.savings);
                                            setMonthlyContribution(s.monthly);
                                        }}
                                        className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-brand-primary group transition-all"
                                    >
                                        <div className="text-xs font-black text-slate-700 group-hover:text-brand-primary">{s.name}</div>
                                        <div className="text-[10px] text-slate-400">{s.age}歲 / 月存${s.monthly / 1000}k</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 參數區 */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">個人參數</span>
                                <button
                                    onClick={() => {
                                        setCurrentAge(30); setRetirementAge(65);
                                        setCurrentSavings(500000); setMonthlyContribution(15000);
                                        setExpectedReturn(5); setMonthlySalary(50000);
                                    }}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-brand-primary transition-colors"
                                    title="重置"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>

                            {/* 年齡區間 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">現在年齡</label>
                                    <input
                                        type="number"
                                        min={18} max={70}
                                        value={currentAge}
                                        onChange={(e) => setCurrentAge(Number(e.target.value))}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">退休年齡</label>
                                    <input
                                        type="number"
                                        min={50} max={80}
                                        value={retirementAge}
                                        onChange={(e) => setRetirementAge(Number(e.target.value))}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20"
                                    />
                                </div>
                            </div>

                            {/* 存款與月存 */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">目前存款</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={currentSavings === 0 ? '' : currentSavings.toLocaleString()}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setCurrentSavings(val === '' ? 0 : parseInt(val, 10));
                                        }}
                                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">每月定存</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={monthlyContribution === 0 ? '' : monthlyContribution.toLocaleString()}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setMonthlyContribution(val === '' ? 0 : parseInt(val, 10));
                                        }}
                                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20"
                                    />
                                </div>
                            </div>

                            {/* 預期報酬率 */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-500">預期年報酬率</label>
                                    <span className="text-lg font-black text-brand-primary">{expectedReturn}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={1} max={12} step={0.5}
                                    value={expectedReturn}
                                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>保守 1%</span>
                                    <span>積極 12%</span>
                                </div>
                            </div>

                            {/* 月薪 (勞退) */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">月薪 (勞退計算用)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={monthlySalary === 0 ? '' : monthlySalary.toLocaleString()}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setMonthlySalary(val === '' ? 0 : parseInt(val, 10));
                                        }}
                                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">* 雇主每月提撥 6%，上限 $150,000</p>
                            </div>
                        </div>
                    </aside>

                    {/* 右側：結果 */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* 主要結果卡片 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 退休總額 */}
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                                <Target className="absolute -right-8 -top-8 text-white/5 w-40 h-40" />
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                                        <PiggyBank className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">預估退休總額</span>
                                    </div>
                                    <div className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                                        ${formatCurrency(results.totalRetirementFund)}
                                    </div>
                                    <div className="text-xs font-bold text-slate-400">
                                        {results.yearsToRetirement} 年後，{retirementAge} 歲時
                                    </div>
                                </div>
                                <div className="relative z-10 mt-6 bg-white/5 border border-white/5 rounded-2xl p-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] text-slate-400 mb-1">個人投資</div>
                                        <div className="text-lg font-black text-blue-400">${formatCurrency(results.personalFutureValue)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 mb-1">勞退新制</div>
                                        <div className="text-lg font-black text-emerald-400">${formatCurrency(results.laborPensionValue)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* 4% 法則月領 */}
                            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-brand-primary/20 transition-all">
                                <Wallet className="absolute -right-8 -bottom-8 text-slate-50 w-40 h-40 group-hover:text-blue-50 transition-colors" />
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-2 text-brand-primary mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">4% 法則每月可領</span>
                                    </div>
                                    <div className="text-4xl font-black tracking-tight text-slate-900">
                                        ${formatCurrency(results.monthlyWithdrawal)}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-4">
                                        根據 4% 安全提領法則，您退休後每月可從退休金中提領約 <span className="text-brand-primary font-bold">${formatCurrency(results.monthlyWithdrawal)}</span> 元，理論上可維持 25-30 年。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 投資回報分析 */}
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex items-center space-x-3 mb-6">
                                <TrendingUp className="w-5 h-5 text-brand-primary" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">投資回報分析</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">累計投入</div>
                                    <div className="text-xl font-black text-slate-700">${formatCurrency(results.totalContributed)}</div>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                                    <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">投資獲利</div>
                                    <div className="text-xl font-black text-emerald-600">+${formatCurrency(results.investmentGain)}</div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-2xl text-center">
                                    <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">報酬倍數</div>
                                    <div className="text-xl font-black text-blue-600">
                                        {results.totalContributed > 0
                                            ? (results.personalFutureValue / results.totalContributed).toFixed(1)
                                            : 0}x
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2000 萬目標反推 */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-[2.5rem] p-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <Target className="w-5 h-5 text-amber-600" />
                                <h3 className="text-lg font-black text-amber-800">🎯 目標反推：2000 萬退休金</h3>
                            </div>
                            <p className="text-sm text-amber-700 mb-4">
                                若您的目標是在 {retirementAge} 歲時存到 2000 萬，以目前的存款和報酬率，您每月需要存：
                            </p>
                            <div className="text-4xl font-black text-amber-600 mb-2">
                                ${formatCurrency(results.requiredMonthly)}<span className="text-lg text-amber-500">/月</span>
                            </div>
                            <div className="text-xs text-amber-600/70">
                                {results.requiredMonthly > monthlyContribution
                                    ? `⚠️ 比目前多存 $${formatCurrency(results.requiredMonthly - monthlyContribution)}/月`
                                    : `✓ 您目前的存款速度已足夠達成目標！`}
                            </div>
                        </div>

                        {/* AI 診斷 */}
                        <AIInsightCard
                            title="AI 退休規劃顧問"
                            buttonText="分析我的退休計劃"
                            prompt="你是 TaiCalc 退休規劃顧問。請分析這份退休計劃，提供 3 個具體建議。包含：1.目前存款速度是否足夠 2.報酬率假設是否合理 3.勞退新制的補充建議。字數 200 字內。"
                            context={{
                                currentAge,
                                retirementAge,
                                yearsToRetirement: results.yearsToRetirement,
                                currentSavings,
                                monthlyContribution,
                                expectedReturn,
                                totalRetirementFund: results.totalRetirementFund,
                                monthlyWithdrawal: results.monthlyWithdrawal,
                            }}
                        />
                    </div>
                </div>

                {/* 底部連結 */}
                <footer className="mt-20 pt-10 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center space-x-8">
                            {[
                                { label: '薪資戰略', path: '/salary' },
                                { label: '房貸佈局', path: '/mortgage' },
                                { label: '稅務優化', path: '/tax' }
                            ].map((item) => (
                                <Link key={item.label} href={item.path} className="text-slate-400 hover:text-brand-primary transition-all font-black text-[10px] uppercase tracking-widest">
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">© 2025 TaiCalc. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
