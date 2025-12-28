'use client';

import { useState, useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    Sankey, Tooltip
} from 'recharts';
import {
    Info, Calculator, TrendingUp, TrendingDown, ShieldCheck,
    Download, Share2, ChevronLeft, ArrowRight, Zap, RefreshCw, AlertTriangle,
    Clock, Gift, Briefcase, Shield, Target
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { analyzeSalary, calculateGrossFromNet } from '@/lib/calculations';
import AIInsightCard from '@/components/AI/AIInsightCard';
import { calculateOvertime, calculateBonusTax, checkLaborRights, predictCareerGrowth } from '@/lib/calculations/salary';

// 使用自定義的 Sankey Nodes/Links 介面
// 注意：recharts 的 sankey 需要特定格式
const SANKEY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function SalaryCalculatorPage() {
    const [activeTab, setActiveTab] = useState<'normal' | 'reverse'>('normal');
    const [inputSalary, setInputSalary] = useState(50000); // 正常模式：月薪，逆向模式：實領
    const [bonusMonths, setBonusMonths] = useState(2);
    const [selfContributionRate, setSelfContributionRate] = useState(0); // 勞退自提比例 0-6%

    // 根據該模式計算結果
    const results = useMemo(() => {
        let calculatedSalary = inputSalary;

        if (activeTab === 'reverse') {
            // 使用二分搜尋精算引擎反推稅前薪資
            calculatedSalary = calculateGrossFromNet(inputSalary);
        }

        return analyzeSalary(calculatedSalary, bonusMonths, {
            selfContributionRate,
        });
    }, [inputSalary, bonusMonths, activeTab, selfContributionRate]);

    // 加班費計算
    const overtimeResult = useMemo(() => {
        const baseSalary = activeTab === 'reverse' ? calculateGrossFromNet(inputSalary) : inputSalary;
        return calculateOvertime(baseSalary);
    }, [inputSalary, activeTab]);

    // 年終獎金稅務試算
    const bonusTaxResult = useMemo(() => {
        const baseSalary = activeTab === 'reverse' ? calculateGrossFromNet(inputSalary) : inputSalary;
        return calculateBonusTax(baseSalary, bonusMonths);
    }, [inputSalary, bonusMonths, activeTab]);

    // 勞權檢查
    const laborRightsCheck = useMemo(() => {
        const baseSalary = activeTab === 'reverse' ? calculateGrossFromNet(inputSalary) : inputSalary;
        return checkLaborRights(baseSalary);
    }, [inputSalary, activeTab]);

    // 職涯成長預測
    const careerGrowth = useMemo(() => {
        const baseSalary = activeTab === 'reverse' ? calculateGrossFromNet(inputSalary) : inputSalary;
        return predictCareerGrowth(baseSalary, 5, 10);
    }, [inputSalary, activeTab]);

    // 下載報表功能
    const handleDownload = () => {
        const reportContent = `
TaiCalc 數策 - 薪資分析報表
==============================
生成時間: ${new Date().toLocaleString('zh-TW')}

【基本資料】
月薪: ${formatCurrency(inputSalary)}
年終: ${bonusMonths} 個月
計算模式: ${activeTab === 'normal' ? '正向計算' : '逆向推算'}

【薪資明細】
稅前月薪: ${formatCurrency(results.monthly.gross)}
實領月薪: ${formatCurrency(results.monthly.takeHome)}
實領率: ${((results.monthly.takeHome / results.monthly.gross) * 100).toFixed(1)}%

【扣款明細】
勞保費: ${formatCurrency(results.monthly.labor)}
健保費: ${formatCurrency(results.monthly.health)}
勞退提撥 (6%): ${formatCurrency(results.monthly.pension)}

【年度統計】
年薪總額: ${formatCurrency(results.annual.gross)}
年度淨收入: ${formatCurrency(results.annual.net)}

==============================
由 TaiCalc 數策 提供 | https://taicalc.com
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `薪資報表_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    return (
        <div className="min-h-screen font-sans pb-8 overflow-x-hidden">
            {/* 極光背景 */}
            <div className="fixed inset-0 pointer-events-none -z-10 " />

            <nav className="sticky top-0 z-50 bg-brand-background/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary shadow-lg border border-white/5 transition-transform group-hover:scale-110">
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <span className="hidden md:block text-lg font-bold text-brand-text-secondary group-hover:text-brand-text-primary transition-colors">返回首頁</span>
                    </Link>
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center space-x-1 md:space-x-2 px-3 md:px-6 py-2 md:py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-all shadow-sm active:scale-95"
                            aria-label="下載報表"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden md:inline">下載報表</span>
                        </button>
                        <div className="flex items-center space-x-1 md:space-x-2">
                            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black shadow-glow">T</div>
                            <span className="hidden md:inline text-lg font-bold tracking-tight">TaiCalc <span className="text-brand-primary">數策</span></span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                <header className="mb-12 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl cmd:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            薪資戰略中樞
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl">
                            不僅是計算，更是佈局。切換攻守視角，掌握談判與資產主動權。
                        </p>
                    </motion.div>
                </header>

                {/* 模式切換 Tabs */}
                <div className="flex justify-center md:justify-start mb-8">
                    <div className="bg-slate-100 p-1 md:p-1.5 rounded-xl md:rounded-2xl flex space-x-1 border border-slate-200">
                        <button
                            onClick={() => setActiveTab('normal')}
                            className={`px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all flex items-center space-x-1 md:space-x-2 whitespace-nowrap ${activeTab === 'normal' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}
                            aria-label="切換到正向推算模式"
                        >
                            <Calculator className="w-3 h-3 md:w-4 md:h-4" />
                            <span>正向推算</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('reverse')}
                            className={`px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all flex items-center space-x-1 md:space-x-2 whitespace-nowrap ${activeTab === 'reverse' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}
                            aria-label="切換到逆向推算模式"
                        >
                            <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                            <span>逆向推算</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左側：控制面板 */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="glass-card rounded-2xl p-8 relative overflow-hidden bg-white/70 border border-slate-200">
                            <div className="relative z-10 space-y-8">                                {/* 快速填入情境 */}
                                <div className="mb-6">
                                    <p className="text-xs text-slate-400 mb-2">快速套用：</p>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => { setInputSalary(35000); setBonusMonths(1); }}
                                            className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-brand-primary hover:text-white rounded-full transition-all"
                                        >
                                            新鮮人 3.5萬
                                        </button>
                                        <button
                                            onClick={() => { setInputSalary(55000); setBonusMonths(2); }}
                                            className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-brand-primary hover:text-white rounded-full transition-all"
                                        >
                                            資深員工 5.5萬
                                        </button>
                                        <button
                                            onClick={() => { setInputSalary(85000); setBonusMonths(3); }}
                                            className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-brand-primary hover:text-white rounded-full transition-all"
                                        >
                                            主管級 8.5萬
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-3 ml-1">
                                        {activeTab === 'normal' ? '月薪 (Taxable Salary)' : '期望實領 (Target Take-home)'}
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">$</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            className="w-full pl-10 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all text-2xl font-black text-slate-900 placeholder-slate-300 shadow-sm"
                                            value={inputSalary === 0 ? '' : inputSalary}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                setInputSalary(val === '' ? 0 : parseInt(val, 10));
                                            }}
                                            placeholder="例如：45000"
                                            aria-label="輸入月薪"
                                        />
                                    </div>
                                    {activeTab === 'reverse' && (
                                        <p className="mt-3 text-brand-accent text-sm font-bold flex items-center">
                                            <Zap className="w-4 h-4 mr-1" />
                                            系統將自動反推您應向 HR 開出的薪資
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex justify-between mb-4 px-1">
                                        <label className="text-sm font-bold text-slate-600">年終獎金 (Months)</label>
                                        <span className="text-lg font-black text-brand-primary px-3 py-1 bg-blue-50 rounded-lg border border-blue-100">{bonusMonths} 個月</span>
                                    </div>
                                    <div className="px-1">
                                        <input
                                            type="range"
                                            min="0" max="12" step="0.5"
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                            value={bonusMonths}
                                            onChange={(e) => setBonusMonths(Number(e.target.value))}
                                            placeholder="例如：2"
                                            aria-label="輸入年終月數"
                                        />
                                    </div>
                                </div>

                                {/* 勞退自提比例 */}
                                <div>
                                    <div className="flex justify-between mb-4 px-1">
                                        <label className="text-sm font-bold text-slate-600">
                                            勞退自提 💰
                                            <span className="text-xs text-slate-400 ml-2">（每月額外存一點，退休多領很多）</span>
                                        </label>
                                        <span className="text-lg font-black text-brand-primary px-3 py-1 bg-blue-50 rounded-lg border border-blue-100">
                                            {selfContributionRate}%
                                        </span>
                                    </div>
                                    <div className="px-1 mb-2">
                                        <input
                                            type="range"
                                            min="0" max="6" step="1"
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                            value={selfContributionRate}
                                            onChange={(e) => setSelfContributionRate(Number(e.target.value))}
                                            aria-label="選擇勞退自提比例"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 px-1">
                                        <span>不自提（0%）</span>
                                        <span>最高（6%）</span>
                                    </div>
                                    {selfContributionRate > 0 && (
                                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                            <p className="text-xs text-green-700 font-bold">
                                                💡 自提 {selfContributionRate}% 可以節稅，而且退休時多領錢！
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* 稅務偵測 Alert */}
                                {results.effectiveTaxRate > 11 && results.effectiveTaxRate < 13 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start space-x-3"
                                    >
                                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-orange-700 font-bold text-sm mb-1">稅率臨界點警示</h4>
                                            <p className="text-orange-600 text-xs leading-relaxed">
                                                您的所得稅率即將突破 12% 級距。建議使用「自願提撥勞退」來降低應稅所得。
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </section>

                        {/* 手機版快速結果 (只在手機顯示) */}
                        <div className="lg:hidden glass-card rounded-[24px] p-6 bg-white border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-500 font-bold">預估實領</span>
                                <span className="text-2xl font-black text-brand-primary">${formatCurrency(results.monthly.takeHome)}</span>
                            </div>
                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-primary w-[70%]" />
                            </div>
                        </div>
                    </div>

                    {/* 右側：視覺化儀表板 */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 核心數據卡片 Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="glass-card rounded-[24px] p-6 flex flex-col justify-between h-[160px] bg-white border border-slate-200 shadow-lg shadow-slate-100">
                                <div className="text-slate-400 font-bold text-sm uppercase tracking-wider">
                                    {activeTab === 'reverse' ? '建議開價 (月薪)' : '稅前月薪'}
                                </div>
                                <div>
                                    <span className="text-3xl font-black text-slate-900 tracking-tight">${formatCurrency(results.monthly.gross)}</span>
                                    {activeTab === 'reverse' && <div className="text-brand-accent text-xs font-bold mt-1">含推算勞健保負擔</div>}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                    <Calculator className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            <div className="glass-card rounded-[24px] p-6 flex flex-col justify-between h-[160px] bg-gradient-to-br from-brand-primary to-blue-600 text-white shadow-lg shadow-blue-200">
                                <div className="text-blue-100 font-bold text-sm uppercase tracking-wider">實領薪資 (Take Home)</div>
                                <span className="text-4xl font-black text-white tracking-tight">${formatCurrency(results.monthly.takeHome)}</span>
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <div className="glass-card rounded-[24px] p-6 flex flex-col justify-between h-[160px] bg-white border border-slate-200 shadow-lg shadow-slate-100">
                                <div className="text-brand-error font-bold text-sm uppercase tracking-wider">年度所得稅</div>
                                <div>
                                    <span className="text-3xl font-black text-brand-error tracking-tight">${formatCurrency(results.annual.tax)}</span>
                                    <div className="text-slate-400 text-xs font-bold mt-1">有效稅率 {results.effectiveTaxRate.toFixed(1)}%</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-brand-error" />
                                </div>
                            </div>
                        </div>

                        {/* 深度分析區 */}
                        <div className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                                    <Info className="w-5 h-5 mr-3 text-brand-primary" />
                                    薪資結構深度分析
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* 圓餅圖 */}
                                <div className="h-[300px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={results.chartData}
                                                cx="50%" cy="50%"
                                                innerRadius={80}
                                                outerRadius={110}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {results.chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                itemStyle={{ color: '#0f172a' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">實領率</span>
                                        <span className="text-3xl font-black text-brand-primary">{Math.round((results.annual.net / results.annual.gross) * 100)}%</span>
                                    </div>
                                </div>

                                {/* 詳細數據列表 */}
                                <div className="space-y-4 justify-center flex flex-col">
                                    {results.chartData.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-slate-700 font-bold">{item.name}</span>
                                            </div>
                                            <span className="text-slate-900 font-mono font-bold">${formatCurrency(item.value)}</span>
                                        </div>
                                    ))}
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center px-4">
                                        <span className="text-slate-500 font-bold">雇主勞退提撥 (6%)</span>
                                        <span className="text-brand-primary font-mono font-bold">+${formatCurrency(results.annual.pension)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI 顧問區塊 */}
                        <div className="mt-6">
                            <AIInsightCard
                                title="✨ AI 薪資戰略顧問"
                                buttonText="AI 戰略分析：這份薪水值得嗎？"
                                prompt={activeTab === 'normal'
                                    ? "請分析這份薪資結構。考量台灣的物價與勞健保隱形成本，這份薪水在台灣職場的競爭力如何？針對「實領率」給我 3 個具體的談判或理財建議。請用條列式回答。"
                                    : "我正在進行逆向談薪。我的目標是實領這個金額，請幫我分析：如果我跟 HR 開這個稅前價格，會不會太高？有沒有什麼話術可以確保我不吃虧？請提供 3 個談判籌碼。"
                                }
                                context={{
                                    mode: activeTab,
                                    input: inputSalary,
                                    salaryStructure: results.monthly,
                                    annualOverview: results.annual,
                                    effectiveTaxRate: results.effectiveTaxRate
                                }}
                            />
                        </div>

                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* 加班/特休換算器：獨家功能 */}
                    <section className="glass-card rounded-2xl p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-lg font-black text-indigo-900">⚡ 加班 vs 特休換算器</h3>
                            </div>
                            <div className="px-2 py-1 bg-white/50 rounded-lg text-[10px] font-black text-indigo-500 border border-indigo-100">
                                勞基法標準
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/80 rounded-xl border border-indigo-50">
                                <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-tighter">若選擇平日加班 4 小時</div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-black text-indigo-600">${formatCurrency(overtimeResult.weekday2hrs * 2)}</div>
                                        <div className="text-[10px] text-slate-500">領取加班費</div>
                                    </div>
                                    <div className="text-slate-300 text-xl font-thin">vs</div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-slate-700">6 小時</div>
                                        <div className="text-[10px] text-slate-500">換取補休 (1:1.5)</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                                <p className="text-xs font-bold opacity-80 mb-1">💡 戰略建議</p>
                                <p className="text-sm font-medium">若您的時薪高於市場平均，領錢通常比補休更具「複利價值」。</p>
                            </div>
                        </div>
                    </section>

                    {/* 面試開價助手：面試利器 */}
                    <section className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Target className="w-32 h-32" />
                        </div>
                        <div className="flex items-center space-x-2 mb-6">
                            <Target className="w-5 h-5 text-brand-primary" />
                            <h3 className="text-lg font-black text-slate-900">🎯 面試戰略：開價助手</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-brand-surface rounded-xl border border-brand-primary/10">
                                    <div className="text-[10px] font-bold text-brand-primary uppercase mb-1">您的時薪價值</div>
                                    <div className="text-xl font-black text-slate-900">${Math.round(results.monthly.gross / 22 / 8)}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">期望實領</div>
                                    <div className="text-xl font-black text-slate-700">${formatCurrency(inputSalary)}</div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-900 rounded-xl text-white">
                                <div className="text-xs font-bold text-slate-400 mb-2">建議報給 HR 的數字：</div>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-black text-brand-primary">${formatCurrency(results.monthly.gross)}</span>
                                    <span className="text-xs text-slate-400">(稅前月薪)</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-slate-300">
                                    這樣扣完勞健保與預扣稅後，才能確保領到約 ${formatCurrency(results.monthly.takeHome)} 元。
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* 勞權診斷書：避坑指南 */}
                    <section className="glass-card rounded-2xl p-6 bg-slate-50 border border-slate-200 shadow-sm">
                        <div className="flex items-center space-x-2 mb-6">
                            <Shield className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-lg font-black text-slate-900">🛡️ 勞權診斷：避坑指南</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-emerald-100">
                                <div>
                                    <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">法定投保級距</div>
                                    <div className="text-xl font-black text-slate-900">${formatCurrency(laborRightsCheck.expectedLaborGrade)}</div>
                                </div>
                                <div className="text-right">
                                    {laborRightsCheck.warnings.length > 0 ? (
                                        <div className="flex items-center text-red-500 font-bold space-x-1 animate-pulse">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span>高薪低報警示</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-emerald-500 font-bold space-x-1">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>合規建議</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ul className="space-y-2">
                                {laborRightsCheck.warnings.concat(laborRightsCheck.tips).slice(0, 3).map((note, idx) => (
                                    <li key={idx} className="flex items-start space-x-2 text-sm text-slate-600">
                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5" />
                                        <span>{note}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* 職涯複利增長模擬 */}
                    <section className="glass-card rounded-2xl p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl overflow-hidden relative group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-brand-primary" />
                                <h3 className="text-lg font-black text-white">📈 職涯複利增長模擬</h3>
                            </div>
                            <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-slate-300">
                                年增 5% vs 原地踏步
                            </div>
                        </div>
                        <div className="flex items-end justify-between space-x-2 h-24 mb-4">
                            {careerGrowth.map((year, idx) => (
                                <div key={year.year} className="flex-1 group/bar relative">
                                    <div
                                        className="w-full bg-brand-primary/20 rounded-t-sm transition-all group-hover/bar:bg-brand-primary/60"
                                        style={{ height: `${20 + (idx * 15)}px` }}
                                    >
                                        <div
                                            className="absolute bottom-0 w-full bg-slate-700 rounded-t-sm opacity-30"
                                            style={{ height: `20px` }}
                                        />
                                    </div>
                                    {idx % 3 === 0 && <div className="text-[8px] text-slate-500 mt-2 text-center">Y{year.year}</div>}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-slate-400">10 年後月薪預估</span>
                                <span className="font-black text-brand-primary">${formatCurrency(careerGrowth[9].salary)}</span>
                            </div>
                            <div className="text-[10px] text-red-400 flex items-center space-x-1">
                                <TrendingDown className="w-3 h-3" />
                                <span>對比不調薪，累積少賺 ${formatCurrency(careerGrowth.reduce((acc, curr) => acc + (curr.annual - careerGrowth[0].annual), 0))}</span>
                            </div>
                        </div>
                    </section>
                </div>



                <section className="mt-12 mb-12">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center space-x-2">
                        <Info className="w-6 h-6 text-brand-primary" />
                        <span>智慧分析小幫手</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 bg-white rounded-2xl border border-slate-200">
                            <h4 className="text-brand-primary font-bold">Q. 為什麼實領差這麼多？</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">勞健保是根據政府投保級距計算的，月薪越高，級距越高扣得越多。加上勞退自提後，每月現金流會變少，但未來退休金會更多。</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-slate-200">
                            <h4 className="text-brand-primary font-bold">Q. 逆向推算是什麼？</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">這是為了面試設計的功能。當您心中有期望的「實領金額」時，幫您算回「應該開多少稅前薪資」以免吃虧。</p>
                        </div>
                    </div>
                </section>



                {/* 延伸閱讀區塊 */}
                <section className="mt-12 glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">📚 延伸閱讀</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/tax" className="group p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                            <p className="font-bold text-slate-900 group-hover:text-brand-primary mb-1">稅務優化計算器</p>
                            <p className="text-sm text-slate-500">計算年度所得稅負擔</p>
                        </Link>
                        <Link href="/mortgage" className="group p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                            <p className="font-bold text-slate-900 group-hover:text-brand-primary mb-1">房貸佈局計算器</p>
                            <p className="text-sm text-slate-500">評估購屋能力上限</p>
                        </Link>
                        <Link href="/articles" className="group p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                            <p className="font-bold text-slate-900 group-hover:text-brand-primary mb-1">理財知識庫</p>
                            <p className="text-sm text-slate-500">探索更多理財策略</p>
                        </Link>
                    </div>
                </section>

            </main>


        </div>
    );
}
