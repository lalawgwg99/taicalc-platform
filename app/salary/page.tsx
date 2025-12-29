'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Calculator,
    ChevronDown,
    ChevronRight,
    HelpCircle,
    Lightbulb,
    BookOpen,
    ArrowRight,
    Check,
    TrendingUp,
    DollarSign,
    Users
} from 'lucide-react';
import { publicExecute } from '@/lib/publicExecute';

// 快速情境預設值
const QUICK_SCENARIOS = [
    { label: '新鮮人 35K', salary: 35000 },
    { label: '中階 55K', salary: 55000 },
    { label: '資深 80K', salary: 80000 },
    { label: '高階 120K', salary: 120000 },
];

// FAQ 資料
const FAQ_DATA = [
    {
        q: '勞保和健保自付額是怎麼算的？',
        a: '勞保費率 2024 年為 12%，勞工自付 20%（約 2.4%）。健保費率為 5.17%，勞工自付 30%（約 1.55%）。兩者都根據投保級距計算，而非實際薪資。'
    },
    {
        q: '年終獎金要扣多少稅？',
        a: '年終獎金併入年度所得計算。單次領超過薪資所得扣繳稅額標準（目前為 86,001 元）會先預扣 5%，年度報稅時多退少補。'
    },
    {
        q: '勞退自提 6% 划算嗎？',
        a: '自提 6% 的金額可從當年度所得稅中扣除，等於「延後課稅」。對高所得者（稅率 20% 以上）節稅效果明顯，但要到 60 歲才能領回。'
    },
    {
        q: '月薪 5 萬實際拿多少？',
        a: '月薪 50,000 元，扣除勞保約 1,200 元、健保約 775 元後，實領約 48,025 元。若有自提勞退 6%（3,000 元），實領約 45,025 元。'
    },
    {
        q: '面試時該開多少薪水？',
        a: '建議先算出「期望實領」，再往回推算應開多少月薪。例如期望實領 45,000 元，應開約 47,000-48,000 元（含勞健保扣款）。'
    },
];

export default function SalaryCalculatorPage() {
    const [salary, setSalary] = useState<number>(50000);
    const [includeBonus, setIncludeBonus] = useState<boolean>(true);
    const [selfContribute, setSelfContribute] = useState<boolean>(false);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    // 純前端計算 - 不依賴 API
    const calculateSalary = () => {
        // 勞保費率 12% (勞工自付 20% = 2.4%)
        const laborInsuranceRate = 0.024;
        // 健保費率 5.17% (勞工自付 30% ≈ 1.55%)
        const healthInsuranceRate = 0.0155;
        // 勞退自提
        const pensionRate = selfContribute ? 0.06 : 0;

        const laborInsurance = Math.round(salary * laborInsuranceRate);
        const healthInsurance = Math.round(salary * healthInsuranceRate);
        const pension = Math.round(salary * pensionRate);

        const monthlyDeductions = laborInsurance + healthInsurance + pension;
        const takeHome = salary - monthlyDeductions;

        const bonusMonths = includeBonus ? 2 : 0;
        const annualGross = salary * (12 + bonusMonths);
        const annualDeductions = monthlyDeductions * 12;
        const annualNet = annualGross - annualDeductions;

        return {
            monthly: {
                gross: salary,
                labor: laborInsurance,
                health: healthInsurance,
                pension: pension,
                takeHome: takeHome
            },
            annual: {
                gross: annualGross,
                net: annualNet
            }
        };
    };

    const handleCalculate = () => {
        setLoading(true);
        const calc = calculateSalary();
        setResult(calc);
        setLoading(false);
    };

    // 快速套用情境
    const applyScenario = (s: number) => {
        setSalary(s);
    };

    // 格式化金額
    const fmt = (n: number) => n?.toLocaleString('zh-TW') || '0';

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* 導航 */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                            <span className="font-bold">T</span>
                        </div>
                        <span className="font-bold text-slate-900">TaiCalc</span>
                    </Link>
                    <Link href="/calculators" className="text-sm text-slate-600 hover:text-blue-500">
                        所有工具 →
                    </Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-8">

                {/* ===== 標題區 ===== */}
                <header className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">薪資</span>
                        <span className="text-slate-400 text-sm">salary.analyze</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        薪資計算器：月薪扣完勞健保實領多少？
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        輸入月薪，立即算出勞保、健保、勞退扣款明細，以及實際入帳金額。
                        適合談薪水、評估 offer、或規劃年度收入時使用。
                    </p>
                </header>

                {/* ===== 情境說明 ===== */}
                <section className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="font-bold text-slate-900 mb-2">什麼情況會用到？</h2>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 收到 offer，想知道實際拿多少</li>
                                <li>• 談薪水前，算出該開多少價</li>
                                <li>• 比較不同公司的薪資條件</li>
                                <li>• 考慮是否要自提勞退 6%</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ===== 快速情境按鈕 ===== */}
                <section className="mb-8">
                    <h3 className="text-sm font-medium text-slate-500 mb-3">快速試算：</h3>
                    <div className="flex flex-wrap gap-2">
                        {QUICK_SCENARIOS.map((s) => (
                            <button
                                key={s.label}
                                onClick={() => applyScenario(s.salary)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${salary === s.salary
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ===== 計算器 ===== */}
                <section className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* 輸入區 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <Calculator className="w-5 h-5 mr-2 text-blue-500" />
                            輸入條件
                        </h2>

                        <div className="space-y-5">
                            {/* 月薪 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    月薪（稅前）
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">NT$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        aria-label="月薪金額"
                                        value={salary.toLocaleString()}
                                        onChange={(e) => setSalary(Number(e.target.value.replace(/,/g, '')) || 0)}
                                        className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* 選項 */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includeBonus}
                                        onChange={(e) => setIncludeBonus(e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">含年終獎金（2 個月）</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selfContribute}
                                        onChange={(e) => setSelfContribute(e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">勞退自提 6%</span>
                                </label>
                            </div>

                            {/* 計算按鈕 */}
                            <button
                                onClick={handleCalculate}
                                disabled={loading}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? '計算中...' : '🧮 開始計算'}
                            </button>
                        </div>
                    </div>

                    {/* 結果區 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                            計算結果
                        </h2>

                        {result ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                {/* 主要數字 */}
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                                    <p className="text-sm text-green-600 mb-1">每月實領</p>
                                    <p className="text-3xl font-black text-green-700">
                                        NT$ {fmt(result?.monthly?.takeHome || result?.monthly?.net || 0)}
                                    </p>
                                </div>

                                {/* 扣款明細 */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">月薪</span>
                                        <span className="font-medium">NT$ {fmt(salary)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">勞保自付</span>
                                        <span className="text-red-500">- NT$ {fmt(result?.monthly?.labor || 0)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">健保自付</span>
                                        <span className="text-red-500">- NT$ {fmt(result?.monthly?.health || 0)}</span>
                                    </div>
                                    {selfContribute && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">勞退自提 6%</span>
                                            <span className="text-red-500">- NT$ {fmt(result?.monthly?.pension || 0)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* 年度總覽 */}
                                {result?.annual && (
                                    <div className="bg-slate-50 rounded-xl p-4 mt-4">
                                        <p className="text-sm text-slate-500 mb-2">年度預估</p>
                                        <p className="text-xl font-bold text-slate-900">
                                            NT$ {fmt(result.annual.totalIncome || 0)}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>輸入月薪後按「開始計算」</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ===== 公式說明 ===== */}
                <section className="mb-12 bg-white border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                        計算公式說明
                    </h2>
                    <div className="prose prose-slate prose-sm max-w-none">
                        <p>本計算器依據 2024 年台灣最新勞健保費率計算：</p>
                        <ul>
                            <li><strong>勞保費</strong>：投保級距 × 12% × 20%（勞工自付比例）</li>
                            <li><strong>健保費</strong>：投保級距 × 5.17% × 30%（勞工自付比例）</li>
                            <li><strong>勞退自提</strong>：月薪 × 6%（可選）</li>
                            <li><strong>實領</strong> = 月薪 - 勞保 - 健保 - 勞退自提</li>
                        </ul>
                        <p className="text-slate-500">
                            註：投保級距依勞保局公告，月薪 48,200 元以上適用最高級距。
                        </p>
                    </div>
                </section>

                {/* ===== FAQ ===== */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <HelpCircle className="w-5 h-5 mr-2 text-orange-500" />
                        常見問題 FAQ
                    </h2>
                    <div className="space-y-3">
                        {FAQ_DATA.map((faq, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                                >
                                    <span className="font-medium text-slate-900">{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedFaq === idx && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        className="px-4 pb-4"
                                    >
                                        <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== 相關工具 ===== */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">相關工具</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link href="/tax" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600">所得稅計算器</h3>
                                    <p className="text-sm text-slate-500">年終獎金要繳多少稅？</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                            </div>
                        </Link>
                        <Link href="/capital" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600">複利計算器</h3>
                                    <p className="text-sm text-slate-500">存到 100 萬要多久？</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                            </div>
                        </Link>
                        <Link href="/mortgage" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600">房貸計算器</h3>
                                    <p className="text-sm text-slate-500">月繳多少？總利息多少？</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                            </div>
                        </Link>
                    </div>
                </section>

            </main>

            {/* 頁尾 */}
            <footer className="border-t border-slate-100 bg-white py-8">
                <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-400">
                    <p>計算結果僅供參考，實際金額依公司及政府規定為準</p>
                    <p className="mt-2">© 2025 TaiCalc</p>
                </div>
            </footer>
        </div>
    );
}
