'use client';

import React, { useState, useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
} from 'recharts';
import {
    Users,
    Wallet,
    Download,
    BarChart3,
    ShieldCheck,
    TrendingDown,
    Info,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { TAIWAN_PARAMS } from '@/lib/constants';

export default function TaxCalculatorPage() {
    // --- 狀態管理 ---
    const [annualIncome, setAnnualIncome] = useState(1200000); // 預設年薪 120 萬
    const [otherIncome, setOtherIncome] = useState(0);         // 兼職/租金等
    const [isMarried, setIsMarried] = useState(false);
    const [dependents, setDependents] = useState(0);           // 扶養親屬 (一般)
    const [seniorDependents, setSeniorDependents] = useState(0); // 70歲以上扶養

    // --- 核心計算引擎 (整合 lib/calculations 邏輯) ---
    const results = useMemo(() => {
        const { EXEMPTION, STANDARD, SALARY_SPECIAL, BASIC_LIVING_EXPENSE = 202000 } = TAIWAN_PARAMS.DEDUCTIONS as any;

        // 總收入
        const totalGross = annualIncome + otherIncome;

        // 1. 免稅額計算 (Exemptions)
        // 本人 + 配偶 + 扶養親屬
        // 70歲以上扶養親屬免稅額增加 50%
        const taxpayerCount = 1 + (isMarried ? 1 : 0);
        const totalExemption = (taxpayerCount * EXEMPTION) +
            (dependents * EXEMPTION) +
            (seniorDependents * EXEMPTION * 1.5);

        // 2. 扣除額計算 (Deductions)
        // 標準扣除額：有配偶 x2
        const standardDeduction = isMarried ? STANDARD * 2 : STANDARD;
        // 薪資特別扣除額：不可超過薪資收入
        const actualSalaryDeduction = Math.min(annualIncome, SALARY_SPECIAL);

        // 3. 基本生活費差額邏輯 (Basic Living Expense Difference)
        // 比較基礎 = 免稅額 + 標準扣除額 (不含薪資扣除額!)
        const basicLivingCheckSum = totalExemption + standardDeduction;
        // 基本生活費總額 = (納稅者 + 配偶 + 受扶養親屬) * 基本生活費
        const totalHouseholdSize = taxpayerCount + dependents + seniorDependents;
        const basicLivingTotal = totalHouseholdSize * BASIC_LIVING_EXPENSE;
        const basicLivingDifference = Math.max(0, basicLivingTotal - basicLivingCheckSum);

        // 總扣除額
        const totalDeductions = standardDeduction + actualSalaryDeduction + basicLivingDifference;

        // 4. 課稅所得 (Taxable Income)
        const taxableIncome = Math.max(0, totalGross - totalExemption - totalDeductions);

        // 5. 稅額計算
        let finalTax = 0;
        // 修正：顯式宣告型別，避免 TS 推斷為 tuple 的第一個 element type
        let currentBracket: (typeof TAIWAN_PARAMS.INCOME_TAX_BRACKETS)[number] = TAIWAN_PARAMS.INCOME_TAX_BRACKETS[0];
        let nextBracketDistance = 0;
        let nextBracketRate = 0;

        for (let i = 0; i < TAIWAN_PARAMS.INCOME_TAX_BRACKETS.length; i++) {
            const b = TAIWAN_PARAMS.INCOME_TAX_BRACKETS[i];
            if (taxableIncome <= b.limit) {
                finalTax = Math.round((taxableIncome * b.rate) - b.deduction);
                currentBracket = b;
                nextBracketDistance = b.limit === Infinity ? 0 : b.limit - taxableIncome;
                const nextB = TAIWAN_PARAMS.INCOME_TAX_BRACKETS[i + 1];
                nextBracketRate = nextB ? nextB.rate : currentBracket.rate;
                break;
            }
        }

        const netIncome = totalGross - finalTax;
        const effectiveRate = totalGross > 0 ? (finalTax / totalGross) * 100 : 0;

        return {
            totalGross,
            totalExemption,
            totalDeductions,
            basicLivingDifference, // 新增：顯示基本生活費紅利
            taxableIncome,
            finalTax,
            netIncome,
            effectiveRate,
            currentBracket,
            nextBracketDistance,
            nextBracketRate,
            totalHouseholdSize,
            pieData: [
                { name: '實領淨所得', value: netIncome, color: '#3b82f6' }, // brand-primary
                { name: '應繳所得稅', value: finalTax, color: '#ef4444' },    // red-500
                { name: '免稅與扣除額', value: totalExemption + totalDeductions, color: '#e2e8f0' }, // slate-200
            ]
        };
    }, [annualIncome, otherIncome, isMarried, dependents, seniorDependents]);

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
                            <div className="bg-brand-primary text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-200">2025 Tax Edition</div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">所得稅決策精算 <span className="text-brand-primary">PRO</span></h1>
                        </motion.div>
                        <p className="text-slate-500 font-medium max-w-2xl text-lg">
                            基於財政部 2024 年度最新稅制調升參數。導入「基本生活費差額」演算法，精算您的每一分合法節稅權益。
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-all shadow-sm active:scale-95 print:hidden"
                        >
                            <Download className="w-4 h-4" />
                            <span>導出申報試算表</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左側：參數配置 */}
                    <div className="lg:col-span-4 space-y-6 print:hidden">
                        <section className="glass-card rounded-[32px] p-6 bg-white/60 border border-white/40 shadow-xl shadow-slate-100/50 backdrop-blur-md">
                            <div className="flex items-center space-x-2 mb-6 text-brand-primary">
                                <Wallet className="w-5 h-5" />
                                <h2 className="font-black uppercase tracking-widest text-sm text-slate-400">收入配置</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">年度薪資總額 (含獎金)</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg group-focus-within:text-brand-primary">$</span>
                                        <input
                                            type="number"
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-10 py-4 text-xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-inner"
                                            value={annualIncome}
                                            onChange={(e) => setAnnualIncome(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">其他所得 (租金/兼職/股利)</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg group-focus-within:text-brand-primary">$</span>
                                        <input
                                            type="number"
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-10 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-inner"
                                            value={otherIncome}
                                            onChange={(e) => setOtherIncome(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="glass-card rounded-[32px] p-6 bg-white/60 border border-white/40 shadow-xl shadow-slate-100/50 backdrop-blur-md">
                            <div className="flex items-center space-x-2 mb-6 text-brand-primary">
                                <Users className="w-5 h-5" />
                                <h2 className="font-black uppercase tracking-widest text-sm text-slate-400">家庭與扣除額</h2>
                            </div>

                            <div className="space-y-6">
                                <label className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-brand-primary transition-all shadow-sm">
                                    <span className="text-sm font-bold text-slate-700">合併申報 (已婚)</span>
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-brand-primary rounded-md"
                                        checked={isMarried}
                                        onChange={(e) => setIsMarried(e.target.checked)}
                                    />
                                </label>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">扶養親屬 (未滿70歲)</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[0, 1, 2, 3, 4].map(n => (
                                            <button
                                                key={n}
                                                onClick={() => setDependents(n)}
                                                className={`py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${dependents === n ? 'bg-brand-primary text-white shadow-brand-primary/30' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">扶養親屬 (70歲以上)</label>
                                    <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                                        <button
                                            onClick={() => setSeniorDependents(Math.max(0, seniorDependents - 1))}
                                            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                                        >-</button>
                                        <span className="flex-1 text-center font-black text-xl text-slate-900">{seniorDependents}</span>
                                        <button
                                            onClick={() => setSeniorDependents(seniorDependents + 1)}
                                            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                                        >+</button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 ml-1 text-center">
                                        * 70歲以上免稅額增加 50%
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* 右側：決策儀表板 */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 核心指標卡片 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-brand-primary to-blue-600 text-white rounded-[32px] p-6 shadow-2xl shadow-blue-500/30 flex flex-col justify-between h-[180px]">
                                <div>
                                    <p className="text-xs font-black text-blue-100 uppercase mb-2 tracking-wider">預估應繳所得稅</p>
                                    <h3 className="text-4xl font-black text-white tracking-tight">${formatCurrency(results.finalTax)}</h3>
                                </div>
                                <div className="flex items-center text-xs font-black text-blue-600 bg-white/90 backdrop-blur w-fit px-3 py-1.5 rounded-lg shadow-sm">
                                    <TrendingDown className="w-3.5 h-3.5 mr-1.5" />
                                    有效稅率 {results.effectiveRate.toFixed(2)}%
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-lg shadow-slate-100 flex flex-col justify-between h-[180px]">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs font-black text-slate-400 uppercase mb-2 tracking-wider">免稅與扣除額紅利</p>
                                        {results.basicLivingDifference > 0 && (
                                            <div className="bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded text-[10px] font-bold">
                                                生活費差額啟用
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">${formatCurrency(results.totalExemption + results.totalDeductions)}</h3>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">包含薪資、標準扣除額與<br />基本生活費差額 <span className="font-bold text-brand-accent">+${formatCurrency(results.basicLivingDifference)}</span></p>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-[32px] p-6 border-l-4 border-l-emerald-400 shadow-lg shadow-emerald-500/10 flex flex-col justify-between h-[180px]">
                                <div>
                                    <p className="text-xs font-black text-emerald-600 uppercase mb-2 tracking-wider">稅後實領淨額 (Net)</p>
                                    <h3 className="text-3xl font-black text-emerald-600 tracking-tight">${formatCurrency(results.netIncome)}</h3>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">這是您今年可完全支配的<br />真實財務能量。</p>
                            </div>
                        </div>

                        {/* 視覺化與決策引導 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card rounded-[32px] p-8 bg-white border border-slate-200 shadow-lg shadow-slate-100">
                                <div className="flex items-center space-x-2 mb-6">
                                    <BarChart3 className="w-5 h-5 text-brand-primary" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">所得分配模型</h3>
                                </div>
                                <div className="h-[200px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={results.pieData}
                                                cx="50%" cy="50%" innerRadius={70} outerRadius={90}
                                                paddingAngle={5} dataKey="value" stroke="none"
                                            >
                                                {results.pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip
                                                formatter={(v) => `$${formatCurrency(v)}`}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* 中央文字 */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">實領佔比</span>
                                        <span className="text-2xl font-black text-slate-900">
                                            {Math.round((results.netIncome / (results.totalGross || 1)) * 100)}%
                                        </span>
                                    </div>
                                </div>
                                {/* 圖例 */}
                                <div className="mt-4 space-y-2">
                                    {results.pieData.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-slate-500 font-bold">{item.name}</span>
                                            </div>
                                            <span className="text-slate-900 font-black">${formatCurrency(item.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 級距決策引導卡 (Nudge) */}
                            <div className="bg-slate-900 rounded-[32px] p-8 border border-white/10 relative overflow-hidden group shadow-2xl shadow-slate-900/20">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ShieldCheck size={140} className="text-white" />
                                </div>
                                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-8">稅務級距決策引導 (Tax Nudge)</h3>

                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2">當前適用邊際稅率</p>
                                        <div className="flex items-end space-x-3">
                                            <span className="text-6xl font-black text-white">{(results.currentBracket.rate * 100).toFixed(0)}%</span>
                                            <div className="pb-2">
                                                <span className="text-xs font-bold text-slate-400 block">累進差額 (稅盾)</span>
                                                <span className="text-sm font-black text-blue-400">${formatCurrency(results.currentBracket.deduction)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                                            <span>目前位置</span>
                                            <span>距離下一級距 ({(results.nextBracketRate * 100).toFixed(0)}%)</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full transition-all duration-1000 relative"
                                                style={{ width: `${Math.min(100, (results.taxableIncome / (results.currentBracket.limit || results.taxableIncome * 1.2)) * 100)}%` }}
                                            >
                                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse" />
                                            </div>
                                        </div>
                                        {results.nextBracketDistance > 0 ? (
                                            <div className="flex items-start space-x-3 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                                                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-blue-100 leading-relaxed font-bold">
                                                    安全空間：<span className="text-white text-sm">${formatCurrency(results.nextBracketDistance)}</span>
                                                    <br />
                                                    <span className="text-[10px] text-blue-300 font-normal">在此額度內的額外獎金、股利或加班費，皆不會觸發 {(results.nextBracketRate * 100).toFixed(0)}% 的懲罰性稅率。</span>
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-red-300 font-bold bg-red-900/20 p-3 rounded-xl border border-red-500/20 flex items-center">
                                                <Info className="w-4 h-4 mr-2" />
                                                您已進入最高稅率級距，建議諮詢專業會計師進行資產配置。
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 明細表格 */}
                        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-lg shadow-slate-100/50">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">2025 申報參考明細 (Detail Logic)</h3>
                            </div>
                            <table className="w-full text-sm text-left border-collapse">
                                <tbody className="divide-y divide-slate-100">
                                    <TableRow label="總所得 (年度總額)" value={results.totalGross} subtext="薪資 + 其他來源" />
                                    <TableRow label="免稅額總計" value={results.totalExemption} isDeduction subtext={`${results.totalHouseholdSize} 人 (含 70歲以上加給)`} />
                                    <TableRow label="扣除額總計" value={results.totalDeductions} isDeduction subtext="標準 + 薪資特別 + 基本生活費差額" />
                                    <tr className="bg-slate-50/50">
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-black text-slate-500 uppercase">應稅所得 (Net Taxable)</div>
                                            <div className="text-[10px] text-slate-400">課稅級距判定基準</div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-lg text-slate-900 tracking-tight">${formatCurrency(results.taxableIncome)}</td>
                                    </tr>
                                    <TableRow label="應繳所得稅" value={results.finalTax} isRed subtext={`適用 ${(results.currentBracket.rate * 100).toFixed(0)}% 稅率 - 累進差額`} />
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

const TableRow = ({ label, value, isDeduction = false, isRed = false, subtext = '' }: any) => (
    <tr className="hover:bg-slate-50/50 transition-colors">
        <td className="px-6 py-4">
            <div className="text-sm font-bold text-slate-600">{label}</div>
            {subtext && <div className="text-[10px] text-slate-400 mt-0.5">{subtext}</div>}
        </td>
        <td className={`px-6 py-4 text-right font-mono font-bold text-base ${isDeduction ? 'text-brand-accent' : isRed ? 'text-red-500' : 'text-slate-900'}`}>
            {isDeduction ? '-' : ''}${formatCurrency(value)}
        </td>
    </tr>
);
