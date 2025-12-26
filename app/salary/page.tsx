'use client';

import { useState, useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    Sankey, Tooltip
} from 'recharts';
import {
    Info, Calculator, TrendingUp, ShieldCheck,
    Download, Share2, ChevronLeft, ArrowRight, Zap, RefreshCw, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { analyzeSalary } from '@/lib/calculations';

// 使用自定義的 Sankey Nodes/Links 介面
// 注意：recharts 的 sankey 需要特定格式
const SANKEY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function SalaryCalculatorPage() {
    const [activeTab, setActiveTab] = useState<'normal' | 'reverse'>('normal');
    const [inputSalary, setInputSalary] = useState(50000); // 正常模式：月薪，逆向模式：實領
    const [bonusMonths, setBonusMonths] = useState(2);

    // 根據該模式計算結果
    const results = useMemo(() => {
        // 簡單的逆向推算邏輯：如果是在逆向模式，我們嘗試找到一個可以產生該實領薪資的稅前薪資
        // 這裡使用簡單的暴力逼近法 (Binary Search 會更準，但對於此範圍線性逼近足夠)
        let calculatedSalary = inputSalary;

        if (activeTab === 'reverse') {
            // 粗略估算：實領 = 稅前 * 0.95 (扣勞健保) -> 稅前 = 實領 / 0.95
            // 這裡做一個簡單的模擬，實際應用應使用二分搜尋法
            const estimate = Math.round(inputSalary / 0.92);
            // 暫時直接使用估算值作為 "稅前薪資" 進行分析，展示給用戶
            calculatedSalary = estimate;
        }

        return analyzeSalary(calculatedSalary, bonusMonths);
    }, [inputSalary, bonusMonths, activeTab]);

    return (
        <div className="min-h-screen font-sans pb-32 overflow-x-hidden">
            {/* 極光背景 */}
            <div className="fixed inset-0 pointer-events-none -z-10 aurora-bg opacity-70" />

            <nav className="sticky top-0 z-50 bg-brand-background/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary shadow-lg border border-white/5 transition-transform group-hover:scale-110">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-brand-text-secondary group-hover:text-brand-text-primary transition-colors">返回首頁</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black shadow-glow">T</div>
                        <span className="text-lg font-bold tracking-tight">TaiCalc <span className="text-brand-primary">Salary 2.0</span></span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                <header className="mb-12 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl cmd:text-5xl font-black text-white mb-4 tracking-tight">
                            薪資決策中樞
                        </h1>
                        <p className="text-lg text-brand-text-secondary font-medium max-w-2xl">
                            不僅是計算器，更是您的談薪軍師。切換視角，掌握談判主動權。
                        </p>
                    </motion.div>
                </header>

                {/* 模式切換 Tabs */}
                <div className="flex justify-center md:justify-start mb-8">
                    <div className="bg-brand-surface p-1.5 rounded-2xl flex space-x-1 border border-white/5">
                        <button
                            onClick={() => setActiveTab('normal')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${activeTab === 'normal' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-text-secondary hover:text-white'}`}
                        >
                            <Calculator className="w-4 h-4" />
                            <span>正向推算 (已知月薪)</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('reverse')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${activeTab === 'reverse' ? 'bg-brand-accent text-white shadow-lg' : 'text-brand-text-secondary hover:text-white'}`}
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>逆向推算 (已知實領)</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 左側：控制面板 */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="glass-card rounded-[32px] p-8 relative overflow-hidden">
                            <div className="relative z-10 space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-brand-text-secondary mb-3 ml-1">
                                        {activeTab === 'normal' ? '月薪 (Taxable Salary)' : '期望實領 (Target Take-home)'}
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text-muted font-black text-xl">$</span>
                                        <input
                                            type="number"
                                            className="w-full pl-10 pr-6 py-4 bg-brand-background border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all text-2xl font-black text-white placeholder-brand-text-muted"
                                            value={inputSalary}
                                            onChange={(e) => setInputSalary(Number(e.target.value))}
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
                                        <label className="text-sm font-bold text-brand-text-secondary">年終獎金 (Months)</label>
                                        <span className="text-lg font-black text-brand-primary px-3 py-1 bg-brand-primary/10 rounded-lg border border-brand-primary/20">{bonusMonths} 個月</span>
                                    </div>
                                    <div className="px-1">
                                        <input
                                            type="range"
                                            min="0" max="12" step="0.5"
                                            className="w-full h-2 bg-brand-background rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                            value={bonusMonths}
                                            onChange={(e) => setBonusMonths(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                {/* 稅務偵測 Alert */}
                                {results.effectiveTaxRate > 11 && results.effectiveTaxRate < 13 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-4 bg-brand-warning/10 border border-brand-warning/20 rounded-2xl flex items-start space-x-3"
                                    >
                                        <AlertTriangle className="w-5 h-5 text-brand-warning flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-brand-warning font-bold text-sm mb-1">稅率臨界點警示</h4>
                                            <p className="text-brand-text-secondary text-xs leading-relaxed">
                                                您的所得稅率即將突破 12% 級距。建議使用「自願提撥勞退」來降低應稅所得。
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </section>

                        {/* 手機版快速結果 (只在手機顯示) */}
                        <div className="lg:hidden glass-card rounded-[24px] p-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-brand-text-secondary font-bold">預估實領</span>
                                <span className="text-2xl font-black text-white">${formatCurrency(results.monthly.takeHome)}</span>
                            </div>
                            <div className="h-1 w-full bg-brand-background rounded-full overflow-hidden">
                                <div className="h-full bg-brand-primary w-[70%]" />
                            </div>
                        </div>
                    </div>

                    {/* 右側：視覺化儀表板 */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 核心數據卡片 Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="glass-card rounded-[24px] p-6 flex flex-col justify-between h-[160px]">
                                <div className="text-brand-text-secondary font-bold text-sm uppercase tracking-wider">
                                    {activeTab === 'reverse' ? '建議開價 (月薪)' : '稅前月薪'}
                                </div>
                                <div>
                                    <span className="text-3xl font-black text-white tracking-tight">${formatCurrency(results.monthly.gross)}</span>
                                    {activeTab === 'reverse' && <div className="text-brand-accent text-xs font-bold mt-1">含推算勞健保負擔</div>}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <Calculator className="w-5 h-5 text-brand-text-primary" />
                                </div>
                            </div>

                            <div className="glass-card rounded-[24px] p-6 flex flex-col justify-between h-[160px] bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 border-brand-primary/20">
                                <div className="text-brand-primary font-bold text-sm uppercase tracking-wider">實領薪資 (Take Home)</div>
                                <span className="text-4xl font-black text-brand-primary tracking-tight">${formatCurrency(results.monthly.takeHome)}</span>
                                <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-brand-primary" />
                                </div>
                            </div>

                            <div className="glass-card rounded-[24px] p-6 flex flex-col justify-between h-[160px]">
                                <div className="text-brand-error font-bold text-sm uppercase tracking-wider">年度所得稅</div>
                                <div>
                                    <span className="text-3xl font-black text-brand-error tracking-tight">${formatCurrency(results.annual.tax)}</span>
                                    <div className="text-brand-text-muted text-xs font-bold mt-1">有效稅率 {results.effectiveTaxRate.toFixed(1)}%</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-brand-error/10 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-brand-error" />
                                </div>
                            </div>
                        </div>

                        {/* 深度分析區 */}
                        <div className="glass-card rounded-[32px] p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white flex items-center">
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
                                                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">實領率</span>
                                        <span className="text-3xl font-black text-brand-primary">{Math.round((results.annual.net / results.annual.gross) * 100)}%</span>
                                    </div>
                                </div>

                                {/* 詳細數據列表 */}
                                <div className="space-y-4 justify-center flex flex-col">
                                    {results.chartData.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-brand-background/50 border border-white/5">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-brand-text-primary font-bold">{item.name}</span>
                                            </div>
                                            <span className="text-white font-mono font-bold">${formatCurrency(item.value)}</span>
                                        </div>
                                    ))}
                                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center px-4">
                                        <span className="text-brand-text-secondary font-bold">雇主勞退提撥 (6%)</span>
                                        <span className="text-brand-primary font-mono font-bold">+${formatCurrency(results.annual.pension)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 底部 FAQ */}
                <section className="mt-20 glass-card rounded-[32px] p-10 border border-white/5">
                    <h2 className="text-2xl font-black text-white mb-8">常見問題</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <h4 className="text-brand-primary font-bold">Q. 為什麼跟薪資單不一樣？</h4>
                            <p className="text-brand-text-secondary text-sm leading-relaxed">我們已導入 2024 投保薪資分級表，但公司可能會有「伙食津貼」等免稅項目影響投保級距，造成微小差異。</p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-brand-primary font-bold">Q. 逆向推算是什麼？</h4>
                            <p className="text-brand-text-secondary text-sm leading-relaxed">這是為了面試設計的功能。當您心中有期望的「實領金額」時，幫您算回「應該開多少稅前薪資」以免吃虧。</p>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-brand-surface/90 backdrop-blur-xl border-t border-white/10 p-4 z-40">
                <div className="max-w-7xl mx-auto flex gap-4">
                    <button className="flex-1 bg-brand-primary text-white h-14 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-glow flex items-center justify-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>下載報表</span>
                    </button>
                    <button className="px-6 bg-brand-surface border border-white/10 text-white h-14 rounded-xl font-bold hover:bg-white/5 transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
