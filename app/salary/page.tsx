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
import { analyzeSalary, calculateGrossFromNet } from '@/lib/calculations';
import AIInsightCard from '@/components/AI/AIInsightCard';

// 使用自定義的 Sankey Nodes/Links 介面
// 注意：recharts 的 sankey 需要特定格式
const SANKEY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function SalaryCalculatorPage() {
    const [activeTab, setActiveTab] = useState<'normal' | 'reverse'>('normal');
    const [inputSalary, setInputSalary] = useState(50000); // 正常模式：月薪，逆向模式：實領
    const [bonusMonths, setBonusMonths] = useState(2);

    // 根據該模式計算結果
    const results = useMemo(() => {
        let calculatedSalary = inputSalary;

        if (activeTab === 'reverse') {
            // 使用二分搜尋精算引擎反推稅前薪資
            calculatedSalary = calculateGrossFromNet(inputSalary);
        }

        return analyzeSalary(calculatedSalary, bonusMonths);
    }, [inputSalary, bonusMonths, activeTab]);

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
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary shadow-lg border border-white/5 transition-transform group-hover:scale-110">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-brand-text-secondary group-hover:text-brand-text-primary transition-colors">返回首頁</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-all shadow-sm active:scale-95"
                            aria-label="下載報表"
                        >
                            <Download className="w-4 h-4" />
                            <span>下載報表</span>
                        </button>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black shadow-glow">T</div>
                            <span className="text-lg font-bold tracking-tight">TaiCalc <span className="text-brand-primary">數策</span></span>
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
                    <div className="bg-slate-100 p-1.5 rounded-2xl flex space-x-1 border border-slate-200">
                        <button
                            onClick={() => setActiveTab('normal')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${activeTab === 'normal' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}
                            aria-label="切換到正向推算模式"
                        >
                            <Calculator className="w-4 h-4" />
                            <span>正向推算 (已知月薪)</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('reverse')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${activeTab === 'reverse' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}
                            aria-label="切換到逆向推算模式"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>逆向推算 (已知實領)</span>
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
                                            type="number"
                                            className="w-full pl-10 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all text-2xl font-black text-slate-900 placeholder-slate-300 shadow-sm"
                                            value={inputSalary}
                                            onChange={(e) => setInputSalary(Number(e.target.value))}
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

                {/* 底部 FAQ */}
                <section className="mt-20 glass-card rounded-2xl p-10 border border-slate-200 bg-white shadow-lg shadow-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 mb-8">常見問題</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <h4 className="text-brand-primary font-bold">Q. 為什麼跟薪資單不一樣？</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">我們已導入 2024 投保薪資分級表，但公司可能會有「伙食津貼」等免稅項目影響投保級距，造成微小差異。</p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-brand-primary font-bold">Q. 逆向推算是什麼？</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">這是為了面試設計的功能。當您心中有期望的「實領金額」時，幫您算回「應該開多少稅前薪資」以免吃虧。</p>
                        </div>
                    </div>
                </section>

            </main>


        </div>
    );
}
