'use client';

import React, { useState, useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import {
    Calculator,
    Info,
    ChevronLeft,
    Download,
    Share2,
    TrendingDown,
    Users,
    Target,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { TAIWAN_PARAMS } from '@/lib/constants';
import { calculateIncomeTax } from '@/lib/calculations';
import AIInsightCard from '@/components/AI/AIInsightCard';

export default function TaxPage() {
    // 狀態管理
    const [annualIncome, setAnnualIncome] = useState(1200000); // 預設 120 萬
    const [otherIncome, setOtherIncome] = useState(0); // 其他所得
    const [isMarried, setIsMarried] = useState(false);
    const [childrenCount, setChildrenCount] = useState(0);
    const [parentsCount, setParentsCount] = useState(0); // 70歲以下
    const [elderlyParentsCount, setElderlyParentsCount] = useState(0); // 70歲以上

    // --- 核心計算引擎 (整合 lib/calculations 邏輯) ---
    const results = useMemo(() => {
        const { EXEMPTION, STANDARD, SALARY_SPECIAL, BASIC_LIVING_EXPENSE = 202000 } = TAIWAN_PARAMS.DEDUCTIONS as any;

        // 總收入
        const totalGross = annualIncome + otherIncome;

        // 1. 免稅額計算 (Exemptions)
        // 本人 + 配偶 + 扶養親屬
        // 70歲以上扶養親屬免稅額增加 50%
        const taxpayerCount = 1 + (isMarried ? 1 : 0);
        const totalExemption = (taxpayerCount + childrenCount + parentsCount) * EXEMPTION +
            (elderlyParentsCount * EXEMPTION * 1.5);

        // 2. 標準扣除額 (Standard Deduction)
        const standardDeduction = isMarried ? STANDARD * 2 : STANDARD;

        // 3. 薪資特別扣除額 (Special Deduction for Salary)
        // 不能超過薪資收入本身
        const salaryDeduction = Math.min(annualIncome, SALARY_SPECIAL);

        // 4. 基本生活費差額 (Basic Living Expense Difference)
        // 比較基礎 = 免稅額 + 標準扣除額 + (身心障礙/教育/幼兒/長照...這裡暫簡化不計入，只計前兩項)
        // 正確邏輯：比較項目包含「免稅額、標準/列舉扣除額、特別扣除額(不含薪資/財產交易損失/儲蓄)」
        // 這裡做一個簡化模擬：只比 免稅額 + 標扣
        // 實際申報戶人數
        const householdSize = taxpayerCount + childrenCount + parentsCount + elderlyParentsCount;
        const basicLivingTotal = householdSize * BASIC_LIVING_EXPENSE;
        const comparisonSum = totalExemption + standardDeduction; // 簡化
        const basicLivingDifference = Math.max(0, basicLivingTotal - comparisonSum);

        // 總扣除額 (不含列舉)
        const totalDeductions = totalExemption + standardDeduction + salaryDeduction + basicLivingDifference;

        // 淨所得 (Net Taxable Income)
        const netTaxableIncome = Math.max(0, totalGross - totalDeductions);

        // 稅額計算 (Tax Payable) - 累進稅率
        let taxPayable = 0;
        let currentBracket = { rate: 0.05, deduction: 0 }; // 預設

        // 尋找適用級距
        for (const bracket of TAIWAN_PARAMS.INCOME_TAX_BRACKETS) {
            if (netTaxableIncome <= bracket.limit) {
                currentBracket = bracket;
                taxPayable = Math.round(netTaxableIncome * bracket.rate - bracket.deduction);
                break;
            }
            // 超過最高級距，則直接適用最高級距
            if (bracket.limit === Infinity || bracket === TAIWAN_PARAMS.INCOME_TAX_BRACKETS[TAIWAN_PARAMS.INCOME_TAX_BRACKETS.length - 1]) {
                currentBracket = bracket;
                taxPayable = Math.round(netTaxableIncome * bracket.rate - bracket.deduction);
            }
        }

        // 有效稅率
        const effectiveRate = totalGross > 0 ? (taxPayable / totalGross) * 100 : 0;

        return {
            totalGross,
            totalExemption,
            standardDeduction,
            salaryDeduction,
            basicLivingDifference,
            totalDeductions,
            netTaxableIncome,
            taxPayable,
            effectiveRate,
            marginalRate: currentBracket.rate * 100,
            householdSize
        };
    }, [annualIncome, otherIncome, isMarried, childrenCount, parentsCount, elderlyParentsCount]);

    // 視覺化數據
    const chartData = [
        { name: '實領', value: results.totalGross - results.taxPayable, color: '#3b82f6' }, // Brand Primary
        { name: '繳稅', value: results.taxPayable, color: '#ef4444' }, // Brand Error
    ];

    // 下載報表功能
    const handleDownload = () => {
        const reportContent = `
TaiCalc 數策 - 所得稅分析報表
==============================
生成時間: ${new Date().toLocaleString('zh-TW')}

【申報資料】
年薪所得: ${formatCurrency(annualIncome)}
其他所得: ${formatCurrency(otherIncome)}
婚姻狀態: ${isMarried ? '已婚' : '單身'}
申報戶人數: ${results.householdSize} 人

【扣除額明細】
免稅額: ${formatCurrency(results.totalExemption)}
標準扣除額: ${formatCurrency(results.standardDeduction)}
薪資特別扣除額: ${formatCurrency(results.salaryDeduction)}
基本生活費差額: ${formatCurrency(results.basicLivingDifference)}
總扣除額: ${formatCurrency(results.totalDeductions)}

【稅務結果】
淨所得: ${formatCurrency(results.netTaxableIncome)}
應繳稅額: ${formatCurrency(results.taxPayable)}
邊際稅率: ${results.marginalRate.toFixed(0)}%
有效稅率: ${results.effectiveRate.toFixed(2)}%

==============================
由 TaiCalc 數策 提供 | https://taicalc.com
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `所得稅報表_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-brand-background font-sans pb-32 overflow-x-hidden text-slate-900">
            {/* 極光背景 */}
            <div className="fixed inset-0 pointer-events-none -z-10 aurora-bg opacity-70" />

            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
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

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">

                {/* Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-3 mb-3"
                        >
                            <div className="bg-brand-error text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-red-200">2025 最新稅制</div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">所得稅精算戰情室</h1>
                        </motion.div>
                        <p className="text-slate-500 font-medium max-w-2xl text-lg">
                            不僅是計算，更是節稅佈局。掌握免稅額、扣除額與基本生活費差額的交互影響。
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左側：控制面板 */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="glass-card rounded-[32px] p-8 bg-white/60 border border-white/40 shadow-xl shadow-slate-100/50 backdrop-blur-md">
                            <div className="flex items-center space-x-2 text-brand-primary mb-6">
                                <Calculator className="w-5 h-5" />
                                <h2 className="font-black uppercase tracking-widest text-sm text-slate-400">所得來源設定</h2>
                            </div>

                            <div className="space-y-6">
                                {/* 薪資收入 */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                                        年度薪資總額
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">$</span>
                                        <input
                                            type="number"
                                            className="w-full pl-8 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 text-lg shadow-sm"
                                            value={annualIncome}
                                            onChange={(e) => setAnnualIncome(Number(e.target.value))}
                                            placeholder="請輸入年度薪資"
                                            aria-label="輸入年度薪資總額"
                                        />
                                    </div>
                                </div>

                                {/* 其他所得 */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                                        其他所得 (股利/利息等)
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">$</span>
                                        <input
                                            type="number"
                                            className="w-full pl-8 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 shadow-sm"
                                            value={otherIncome}
                                            onChange={(e) => setOtherIncome(Number(e.target.value))}
                                            placeholder="選填"
                                            aria-label="輸入其他所得"
                                        />
                                    </div>
                                </div>

                                {/* 婚姻狀態 */}
                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200">
                                    <span className="text-sm font-bold text-slate-700">婚姻狀態</span>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => setIsMarried(false)}
                                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${!isMarried ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            aria-label="設定為單身"
                                        >
                                            單身
                                        </button>
                                        <button
                                            onClick={() => setIsMarried(true)}
                                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${isMarried ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            aria-label="設定為已婚"
                                        >
                                            已婚
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="glass-card rounded-[32px] p-8 bg-white/60 border border-white/40 shadow-xl shadow-slate-100/50 backdrop-blur-md">
                            <div className="flex items-center space-x-2 text-brand-primary mb-6">
                                <Users className="w-5 h-5" />
                                <h2 className="font-black uppercase tracking-widest text-sm text-slate-400">扶養親屬 (免稅額)</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 text-center">子女</label>
                                    <input
                                        type="number" min="0" max="10"
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20"
                                        value={childrenCount}
                                        onChange={(e) => setChildrenCount(Number(e.target.value))}
                                        aria-label="輸入子女人數"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 text-center">長輩(&lt;70)</label>
                                    <input
                                        type="number" min="0" max="4"
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20"
                                        value={parentsCount}
                                        onChange={(e) => setParentsCount(Number(e.target.value))}
                                        aria-label="輸入70歲以下長輩人數"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 text-center">長輩(&gt;70)</label>
                                    <input
                                        type="number" min="0" max="4"
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20"
                                        value={elderlyParentsCount}
                                        onChange={(e) => setElderlyParentsCount(Number(e.target.value))}
                                        aria-label="輸入70歲以上長輩人數"
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-4 text-center">
                                * 70歲以上長輩免稅額加成 50%
                            </p>
                        </section>
                    </div>

                    {/* 右側：儀表板 */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 核心指標卡片 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-brand-error to-red-600 rounded-[32px] p-8 shadow-2xl shadow-red-500/30 text-white flex flex-col justify-between h-[200px] relative overflow-hidden">
                                <Target className="absolute right-4 top-4 text-white/10 w-32 h-32 -rotate-12" />
                                <div>
                                    <h3 className="text-xs font-black text-red-100 uppercase tracking-widest mb-1">預估應繳稅額</h3>
                                    <div className="text-5xl font-black tracking-tight">${formatCurrency(results.taxPayable)}</div>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2 text-sm font-bold bg-white/10 w-fit px-3 py-1.5 rounded-lg mb-2">
                                        <TrendingDown className="w-4 h-4" />
                                        <span>實際有效稅率 {results.effectiveRate.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-lg shadow-slate-100 flex flex-col justify-between h-[200px] relative overflow-hidden">
                                <Zap className="absolute right-4 top-4 text-slate-100 w-32 h-32 rotate-12" />
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center">
                                        邊際稅率 (級距)
                                    </h3>
                                    <div className="text-4xl font-black tracking-tight text-slate-900">{results.marginalRate}%</div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        您的淨所得為 <span className="text-slate-900 font-bold">${formatCurrency(results.netTaxableIncome)}</span>。<br />
                                        若再增加收入，每 $100 元需多繳 ${results.marginalRate} 元稅金。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 深度分析與決策卡片 */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                            {/* 扣除額總覽 (Table) */}
                            <div className="md:col-span-7 glass-card rounded-[32px] p-8 bg-white border border-slate-200 shadow-xl shadow-slate-100">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-2 text-slate-900">
                                        <Info className="w-5 h-5 text-brand-primary" />
                                        <h3 className="font-black uppercase tracking-widest text-sm text-slate-400">扣除額明細分析</h3>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500 font-bold">免稅額 (Exemptions)</span>
                                        <span className="text-slate-900 font-mono font-bold">${formatCurrency(results.totalExemption)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500 font-bold">標準扣除額</span>
                                        <span className="text-slate-900 font-mono font-bold">${formatCurrency(results.standardDeduction)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500 font-bold">薪資特別扣除額</span>
                                        <span className="text-slate-900 font-mono font-bold">${formatCurrency(results.salaryDeduction)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 bg-emerald-50/50 px-2 rounded-lg -mx-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-emerald-700 font-bold">基本生活費差額</span>
                                            <span className="text-[10px] text-emerald-600/70">多口之家節稅關鍵</span>
                                        </div>
                                        <span className="text-emerald-700 font-mono font-black">+${formatCurrency(results.basicLivingDifference)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 mt-2">
                                        <span className="text-sm text-slate-900 font-black">扣除額總計</span>
                                        <span className="text-lg text-brand-primary font-mono font-black">${formatCurrency(results.totalDeductions)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 圓餅圖 */}
                            <div className="md:col-span-5 glass-card rounded-[32px] p-6 bg-white border border-slate-200 shadow-xl shadow-slate-100 flex flex-col items-center justify-center">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 w-full text-center">實領 vs 繳稅</h3>
                                <div className="w-full h-[180px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%" cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip
                                                formatter={(value: any) => `$${formatCurrency(value)}`}
                                                contentStyle={{ borderRadius: '12px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex gap-4 mt-2 text-xs font-bold">
                                    <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-brand-primary mr-1" />實領收入</div>
                                    <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-brand-error mr-1" />稅金</div>
                                </div>
                            </div>

                        </div>

                        {/* AI 智慧診斷區塊 */}
                        <div className="mb-6">
                            <AIInsightCard
                                title="AI 稅務優化顧問"
                                buttonText="點擊進行 AI 節稅戰略分析"
                                prompt="你是 TaiCalc 首席稅務顧問。請分析這份台灣所得稅數據，並提供 3 個具體的節稅建議。重點包括：1.目前的邊際稅率級距分析。2.勞退自提或捐贈的節稅潛力。3.扶養親屬與基本生活費的佈局建議。請直接切入重點，字數控制在 250 字內。"
                                context={{
                                    annualIncome,
                                    otherIncome,
                                    isMarried,
                                    householdSize: results.householdSize,
                                    netTaxableIncome: results.netTaxableIncome,
                                    taxPayable: results.taxPayable,
                                    marginalRate: results.marginalRate,
                                    effectiveRate: results.effectiveRate,
                                    deductions: {
                                        exemption: results.totalExemption,
                                        standard: results.standardDeduction,
                                        salarySpecial: results.salaryDeduction,
                                        basicLivingDiff: results.basicLivingDifference
                                    }
                                }}
                            />
                        </div>

                        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <Target className="w-6 h-6 text-brand-accent" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">數策節稅洞察</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                        您的家庭成員共 {results.householdSize} 人。基於 2024 年度每人基本生活費 ${formatCurrency(TAIWAN_PARAMS.DEDUCTIONS.BASIC_LIVING_EXPENSE)} 元，
                                        {results.basicLivingDifference > 0
                                            ? `系統已自動為您計算出 ${formatCurrency(results.basicLivingDifference)} 元的基本生活費差額，這筆額外的扣除額有效降低了您的稅負。`
                                            : '目前的免稅額與標準扣除額總和已超過基本生活費標準，無需額外調整。'}
                                    </p>
                                    {results.marginalRate >= 12 && (
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-error/20 text-brand-error text-xs font-bold border border-brand-error/20">
                                            級距警示：建議運用勞退自提 6% 降低 {results.marginalRate}% 的稅率成本
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <footer className="fixed bottom-0 left-0 right-0 bg-brand-surface/90 backdrop-blur-xl border-t border-white/10 p-4 z-40">
                <div className="max-w-7xl mx-auto flex gap-4">
                    <button onClick={handleDownload} className="flex-1 bg-brand-primary text-white h-14 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-glow flex items-center justify-center space-x-2" aria-label="下載報表">
                        <Download className="w-5 h-5" />
                        <span>下載報表</span>
                    </button>
                    <button className="px-6 bg-brand-surface border border-white/10 text-white h-14 rounded-xl font-bold hover:bg-white/5 transition-all" aria-label="分享結果">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
