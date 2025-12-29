'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Receipt,
    Calculator,
    ChevronDown,
    ChevronRight,
    HelpCircle,
    Lightbulb,
    BookOpen,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { publicExecute } from '@/lib/publicExecute';

// 快速情境
const QUICK_SCENARIOS = [
    { label: '年收 60 萬', income: 600000, status: 'single' },
    { label: '年收 80 萬', income: 800000, status: 'single' },
    { label: '年收 120 萬', income: 1200000, status: 'single' },
    { label: '年收 200 萬', income: 2000000, status: 'single' },
];

// 2024 稅率級距
const TAX_BRACKETS = [
    { min: 0, max: 560000, rate: 5 },
    { min: 560001, max: 1260000, rate: 12 },
    { min: 1260001, max: 2520000, rate: 20 },
    { min: 2520001, max: 4720000, rate: 30 },
    { min: 4720001, max: Infinity, rate: 40 },
];

// FAQ
const FAQ_DATA = [
    {
        q: '2024 年基本免稅額是多少？',
        a: '2024 年度（2025 年 5 月申報）個人免稅額為 92,000 元，年滿 70 歲者為 138,000 元。配偶及扶養親屬可額外增加免稅額。'
    },
    {
        q: '標準扣除額 vs 列舉扣除額怎麼選？',
        a: '單身標準扣除額 124,000 元，夫妻合併 248,000 元。若你的醫療、保險、房租、捐款等支出加總超過標準扣除額，選列舉較有利。'
    },
    {
        q: '年終獎金會被扣多少稅？',
        a: '年終獎金併入年度綜合所得計算。單次發放超過 86,001 元會先預扣 5%，年度報稅時多退少補。實際稅率取決於你的總所得落在哪個級距。'
    },
    {
        q: '薪資所得特別扣除額是什麼？',
        a: '2024 年薪資所得特別扣除額為 207,000 元，是針對薪資所得者的固定扣除項目，不需任何條件或單據即可適用。'
    },
    {
        q: '什麼情況可以不用繳稅？',
        a: '如果你是單身、無扶養親屬、年收入低於免稅額 + 標準扣除額 + 薪資扣除額 = 92,000 + 124,000 + 207,000 = 423,000 元，理論上無需繳稅。'
    },
];

export default function TaxCalculatorPage() {
    const [income, setIncome] = useState<number>(800000);
    const [status, setStatus] = useState<string>('single');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await publicExecute('tax.calculate', {
                annualIncome: income,
                isMarried: status === 'married'
            });
            if (res && typeof res === 'object' && 'data' in res) {
                setResult((res as any).data);
            } else {
                setResult(res);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const applyScenario = (s: typeof QUICK_SCENARIOS[0]) => {
        setIncome(s.income);
        setStatus(s.status);
    };

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

                {/* 標題 */}
                <header className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">稅務</span>
                        <span className="text-slate-400 text-sm">tax.calculate</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        所得稅計算器：年收入要繳多少稅？
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        輸入年收入，立即算出應繳稅額與有效稅率。
                        適合報稅前估算、規劃節稅策略、或評估 offer 的稅後實際收入。
                    </p>
                </header>

                {/* 情境說明 */}
                <section className="mb-8 bg-purple-50 border border-purple-100 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="font-bold text-slate-900 mb-2">什麼情況會用到？</h2>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 報稅前預估今年要繳多少</li>
                                <li>• 拿到 offer 想知道稅後實際收入</li>
                                <li>• 考慮是否要自提勞退節稅</li>
                                <li>• 規劃年終獎金的發放時機</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 快速情境 */}
                <section className="mb-8">
                    <h3 className="text-sm font-medium text-slate-500 mb-3">快速試算：</h3>
                    <div className="flex flex-wrap gap-2">
                        {QUICK_SCENARIOS.map((s) => (
                            <button
                                key={s.label}
                                onClick={() => applyScenario(s)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${income === s.income
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-purple-300'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 計算器 */}
                <section className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* 輸入 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <Receipt className="w-5 h-5 mr-2 text-purple-500" />
                            所得資料
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">年度綜合所得（稅前）</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">NT$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        aria-label="年度綜合所得"
                                        value={income.toLocaleString()}
                                        onChange={(e) => setIncome(Number(e.target.value.replace(/,/g, '')) || 0)}
                                        className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">申報身份</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    aria-label="申報身份"
                                    className="w-full py-3 px-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="single">單身</option>
                                    <option value="married">已婚合併申報</option>
                                </select>
                            </div>

                            <button
                                onClick={handleCalculate}
                                disabled={loading}
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-xl transition-colors"
                            >
                                {loading ? '計算中...' : '📋 計算稅額'}
                            </button>
                        </div>
                    </div>

                    {/* 結果 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                            計算結果
                        </h2>

                        {result ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
                                    <p className="text-sm text-purple-600 mb-1">應繳稅額</p>
                                    <p className="text-3xl font-black text-purple-700">
                                        NT$ {fmt(result?.taxAmount || 0)}
                                    </p>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">年度所得</span>
                                        <span className="font-medium">NT$ {fmt(income)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">免稅額</span>
                                        <span className="text-green-500">- NT$ {fmt(result?.deductionDetails?.exemption || 92000)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">標準扣除額</span>
                                        <span className="text-green-500">- NT$ {fmt(result?.deductionDetails?.standardDeduction || 124000)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">有效稅率</span>
                                        <span className="font-bold">{result?.effectiveTaxRate?.toFixed(1) || '0'}%</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <Receipt className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>輸入年所得後按「計算稅額」</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 稅率級距表 */}
                <section className="mb-12 bg-white border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                        2024 年度綜合所得稅率級距
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 font-medium text-slate-600">淨所得範圍</th>
                                    <th className="text-right py-3 font-medium text-slate-600">稅率</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TAX_BRACKETS.map((b, idx) => (
                                    <tr key={idx} className="border-b border-slate-100">
                                        <td className="py-3">
                                            NT$ {fmt(b.min)} ~ {b.max === Infinity ? '以上' : `NT$ ${fmt(b.max)}`}
                                        </td>
                                        <td className="text-right font-bold text-purple-600">{b.rate}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                        淨所得 = 年所得 - 免稅額 - 扣除額 - 特別扣除額
                    </p>
                </section>

                {/* FAQ */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <HelpCircle className="w-5 h-5 mr-2 text-orange-500" />
                        常見問題 FAQ
                    </h2>
                    <div className="space-y-3">
                        {FAQ_DATA.map((faq, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50"
                                >
                                    <span className="font-medium text-slate-900">{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedFaq === idx && (
                                    <div className="px-4 pb-4">
                                        <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 相關工具 */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">相關工具</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link href="/salary" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 group-hover:text-purple-600">薪資計算器</h3>
                            <p className="text-sm text-slate-500">年終獎金實領多少？</p>
                        </Link>
                        <Link href="/tax/2025/deductions" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 group-hover:text-purple-600">扣除額一覽</h3>
                            <p className="text-sm text-slate-500">2025 年最新扣除額整理</p>
                        </Link>
                        <Link href="/capital" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 group-hover:text-purple-600">複利計算器</h3>
                            <p className="text-sm text-slate-500">稅後存錢能變多少？</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-100 bg-white py-8">
                <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-400">
                    <p>計算結果僅供參考，實際稅額依國稅局核定為準</p>
                    <p className="mt-2">© 2025 TaiCalc</p>
                </div>
            </footer>
        </div>
    );
}
