'use client';

import { useState, useMemo } from 'react';
import { calculateTax, TaxInput, TaxResult } from '@/features/tax/logic';
import { InternalLinkSystem, Breadcrumb, SocialShareButtons } from '@/components/seo';
import dynamic from 'next/dynamic';
import { Calculator, PieChart as PieChartIcon, Table2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import for charts
const TaxBracketsChart = dynamic(() => import('@/components/charts/TaxBracketsChart'), { ssr: false });

export function TaxCalculator() {
    // Basic Info
    const [income, setIncome] = useState(1000000);
    const [isMarried, setIsMarried] = useState(false);
    const [spouseIncome, setSpouseIncome] = useState(0);

    // Dependents
    const [dependents, setDependents] = useState(0); // 一般扶養
    const [elderlyDependents, setElderlyDependents] = useState(0); // 70歲以上

    // Special Deductions
    const [preschoolChildren, setPreschoolChildren] = useState(0); // 5歲以下
    const [disabledDependents, setDisabledDependents] = useState(0); // 身心障礙

    // Deduction Mode
    const [deductionMode, setDeductionMode] = useState<'standard' | 'itemized'>('standard');
    const [itemizedAmount, setItemizedAmount] = useState(0);

    // UI State
    const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'details'>('overview');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Calculate Result
    const result = useMemo(() => {
        const input: TaxInput = {
            income,
            isMarried,
            spouseIncome: isMarried ? spouseIncome : 0,
            dependents,
            elderlyDependents,
            preschoolChildren,
            disabledDependents,
            deductionMode,
            itemizedAmount
        };
        return calculateTax(input);
    }, [income, isMarried, spouseIncome, dependents, elderlyDependents, preschoolChildren, disabledDependents, deductionMode, itemizedAmount]);

    // Breadcrumbs
    const breadcrumbItems = [
        { label: '首頁', href: '/' },
        { label: '計算工具', href: '/tools' },
        { label: '所得稅計算器' }
    ];

    // Share Data
    const shareData = {
        url: typeof window !== 'undefined' ? window.location.href : 'https://taicalc.com/tax',
        title: '2025 所得稅試算器 | TaiCalc',
        description: result
            ? `年收入 ${result.totalIncome.toLocaleString()}，預估稅額 ${result.taxAmount.toLocaleString()} (有效稅率 ${result.effectiveRate.toFixed(2)}%)`
            : '2025年綜合所得稅試算，支援新制免稅額、標準扣除額與各類特別扣除額試算。'
    };

    const tabs = [
        { id: 'overview', label: '結果總覽', icon: Calculator },
        { id: 'analysis', label: '稅率分析', icon: PieChartIcon },
        { id: 'details', label: '計算明細', icon: Table2 }
    ] as const;

    return (
        <div className="container max-w-6xl mx-auto px-4 pt-24 pb-12">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-slate-900">所得輸入</h1>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">2025申報適用</span>
                        </div>

                        {/* Basic Income */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">本人年收入</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">NT$</span>
                                    <input
                                        type="number"
                                        value={income}
                                        onChange={(e) => setIncome(Number(e.target.value))}
                                        className="glass-input w-full pl-12 pr-4 py-3 rounded-xl"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 p-3 glass-card rounded-xl cursor-pointer hover:bg-white/60 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isMarried}
                                    onChange={(e) => setIsMarried(e.target.checked)}
                                    className="w-5 h-5 rounded accent-indigo-500"
                                />
                                <span className="font-medium text-slate-700">已婚 (合併申報)</span>
                            </label>

                            {isMarried && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">配偶年收入</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">NT$</span>
                                        <input
                                            type="number"
                                            value={spouseIncome}
                                            onChange={(e) => setSpouseIncome(Number(e.target.value))}
                                            className="glass-input w-full pl-12 pr-4 py-3 rounded-xl"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Advanced Toggle */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 text-indigo-600 font-medium text-sm w-full justify-center py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {showAdvanced ? '隱藏進階設定 (扶養、扣除額)' : '顯示進階設定 (扶養、扣除額)'}
                        </button>

                        {/* Advanced Settings */}
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-6 space-y-6 border-t border-slate-100 mt-4">
                                        {/* Dependents */}
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                <Info size={16} className="text-slate-400" /> 扶養親屬
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-slate-500 mb-1">一般 (未滿70歲)</label>
                                                    <input
                                                        type="number"
                                                        value={dependents}
                                                        onChange={(e) => setDependents(Number(e.target.value))}
                                                        className="glass-input w-full px-3 py-2 rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-500 mb-1">年滿 70 歲</label>
                                                    <input
                                                        type="number"
                                                        value={elderlyDependents}
                                                        onChange={(e) => setElderlyDependents(Number(e.target.value))}
                                                        className="glass-input w-full px-3 py-2 rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Special Deductions */}
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-3">特別扣除額</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-slate-500 mb-1">5歲以下幼兒 (人)</label>
                                                    <input
                                                        type="number"
                                                        value={preschoolChildren}
                                                        onChange={(e) => setPreschoolChildren(Number(e.target.value))}
                                                        className="glass-input w-full px-3 py-2 rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-500 mb-1">身心障礙 (人)</label>
                                                    <input
                                                        type="number"
                                                        value={disabledDependents}
                                                        onChange={(e) => setDisabledDependents(Number(e.target.value))}
                                                        className="glass-input w-full px-3 py-2 rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Deduction Mode */}
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-3">扣除額方式</h3>
                                            <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
                                                {(['standard', 'itemized'] as const).map((mode) => (
                                                    <button
                                                        key={mode}
                                                        onClick={() => setDeductionMode(mode)}
                                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${deductionMode === mode
                                                            ? 'bg-white text-indigo-600 shadow-sm'
                                                            : 'text-slate-500 hover:text-slate-700'
                                                            }`}
                                                    >
                                                        {mode === 'standard' ? '標準扣除' : '列舉扣除'}
                                                    </button>
                                                ))}
                                            </div>
                                            {deductionMode === 'itemized' && (
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">NT$</span>
                                                    <input
                                                        type="number"
                                                        placeholder="輸入列舉總額 (保險/捐贈/醫藥等)"
                                                        value={itemizedAmount}
                                                        onChange={(e) => setItemizedAmount(Number(e.target.value))}
                                                        className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                                                    />
                                                    <p className="text-xs text-slate-500 mt-1">若列舉金額低於標準扣除額，系統將自動採用標準扣除額。</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-7">
                    {result && (
                        <div className="space-y-6">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-200">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="glass-panel p-6 rounded-b-3xl rounded-tr-3xl min-h-[400px]">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'overview' && (
                                        <motion.div
                                            key="overview"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-8"
                                        >
                                            <div className="text-center py-8">
                                                <p className="text-slate-500 mb-2">預估應繳稅額</p>
                                                <div className="text-5xl font-bold font-mono text-indigo-600">
                                                    NT$ {result.taxAmount.toLocaleString()}
                                                </div>
                                                <div className="flex justify-center gap-8 mt-6">
                                                    <div>
                                                        <span className="block text-xs text-slate-400 mb-1">有效稅率</span>
                                                        <span className="text-xl font-semibold text-slate-700">{result.effectiveRate.toFixed(2)}%</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs text-slate-400 mb-1">邊際稅率</span>
                                                        <span className="text-xl font-semibold text-emerald-600">{result.marginalRate * 100}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-indigo-50/50 rounded-xl">
                                                    <p className="text-sm text-slate-500 mb-1">綜合所得淨額</p>
                                                    <p className="text-lg font-semibold text-slate-800">NT$ {result.taxableIncome.toLocaleString()}</p>
                                                </div>
                                                <div className="p-4 bg-indigo-50/50 rounded-xl">
                                                    <p className="text-sm text-slate-500 mb-1">免稅額+扣除額合計</p>
                                                    <p className="text-lg font-semibold text-slate-800">
                                                        NT$ {(result.details.exemptions + result.details.standardDeduction + result.details.specialDeduction).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'analysis' && (
                                        <motion.div
                                            key="analysis"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            <h3 className="font-semibold text-slate-900 mb-6">稅率級距落點分析</h3>
                                            <TaxBracketsChart brackets={result.brackets} />
                                            <div className="mt-6 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                                                <p>說明：此圖表顯示您的所得淨額在各稅率級距中的分佈。顏色較深的部分代表您實際需要繳稅的金額區間。</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'details' && (
                                        <motion.div
                                            key="details"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            <h3 className="font-semibold text-slate-900 mb-4">計算過程明細</h3>

                                            <div className="space-y-2">
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-slate-600">所得總額</span>
                                                    <span className="font-medium">NT$ {result.totalIncome.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100 pl-4 text-sm text-slate-500 bg-red-50/50 rounded">
                                                    <span>(-) 免稅額</span>
                                                    <span>NT$ {result.details.exemptions.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100 pl-4 text-sm text-slate-500 bg-red-50/50 rounded">
                                                    <span>(-) {deductionMode === 'standard' ? '標準扣除額' : '列舉扣除額'}</span>
                                                    <span>NT$ {result.details.standardDeduction.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100 pl-4 text-sm text-slate-500 bg-red-50/50 rounded">
                                                    <span>(-) 特別扣除額 (薪資/身障等)</span>
                                                    <span>NT$ {result.details.specialDeduction.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between py-3 font-semibold bg-indigo-50 px-4 rounded-lg mt-2">
                                                    <span className="text-indigo-900">(=) 綜合所得淨額</span>
                                                    <span className="text-indigo-900">NT$ {result.taxableIncome.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Social Share */}
                            <div className="mt-8">
                                <SocialShareButtons
                                    url={shareData.url}
                                    title={shareData.title}
                                    description={shareData.description}
                                />
                            </div>

                            {/* Recommendations */}

                            <InternalLinkSystem
                                currentCalculator="tax"
                                className="mt-8"
                                maxLinks={3}
                                showDescription={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}