'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Home,
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
    { label: '首購 800 萬', principal: 8000000, years: 30, rate: 2.0 },
    { label: '新青安 1000 萬', principal: 10000000, years: 40, rate: 1.775 },
    { label: '換屋 1500 萬', principal: 15000000, years: 30, rate: 2.2 },
    { label: '北市 2000 萬', principal: 20000000, years: 30, rate: 2.1 },
];

// FAQ
const FAQ_DATA = [
    {
        q: '新青安房貸利率是多少？',
        a: '2024 年新青安優惠利率約 1.775%（一段式機動），貸款額度最高 1,000 萬，貸款年限最長 40 年，寬限期最長 5 年。適用首購族及特定條件者。'
    },
    {
        q: '寬限期要選嗎？',
        a: '寬限期內只繳利息、不還本金，短期壓力較小，但總利息會增加。若短期內有大筆支出或收入會增加，可考慮；否則建議直接還本息。'
    },
    {
        q: '本息攤還和本金攤還差在哪？',
        a: '本息攤還每月金額固定，前期利息佔比高；本金攤還每月還固定本金，月付金額遞減，總利息較少。多數人選本息攤還，因為初期壓力較小。'
    },
    {
        q: '房貸利率怎麼談？',
        a: '可多家銀行比較，強調信用良好、收入穩定、願意搭配其他產品（信用卡、保險）。首購族可爭取到更低的利率，通常比牌告再低 0.1-0.3%。'
    },
    {
        q: '我的月收入能貸多少？',
        a: '一般建議房貸月付不超過月收入的 1/3。例如月收 6 萬，月付建議不超過 2 萬。以利率 2%、30 年期計算，約可貸 540 萬左右。'
    },
];

export default function MortgageCalculatorPage() {
    const [principal, setPrincipal] = useState<number>(10000000);
    const [years, setYears] = useState<number>(30);
    const [rate, setRate] = useState<number>(2.0);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await publicExecute('mortgage.calculate', {
                loanAmount: principal,
                years,
                annualRate: rate
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
        setPrincipal(s.principal);
        setYears(s.years);
        setRate(s.rate);
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
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">房貸</span>
                        <span className="text-slate-400 text-sm">mortgage.calculate</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        房貸計算器：每月要繳多少？總利息多少？
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        輸入貸款金額、年限、利率，立即算出每月還款金額與總利息支出。
                        適合評估買房預算、比較房貸方案、或規劃換屋時使用。
                    </p>
                </header>

                {/* 情境說明 */}
                <section className="mb-8 bg-green-50 border border-green-100 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="font-bold text-slate-900 mb-2">什麼情況會用到？</h2>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 想知道月收入能負擔多少房價</li>
                                <li>• 評估新青安貸款 vs 一般房貸的差別</li>
                                <li>• 比較不同年限（20年 vs 30年 vs 40年）</li>
                                <li>• 考慮是否要選寬限期</li>
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
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${principal === s.principal && years === s.years
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-green-300'
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
                            <Home className="w-5 h-5 mr-2 text-green-500" />
                            貸款條件
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">貸款金額</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">NT$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        aria-label="貸款金額"
                                        value={principal.toLocaleString()}
                                        onChange={(e) => setPrincipal(Number(e.target.value.replace(/,/g, '')) || 0)}
                                        className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">貸款年限</label>
                                    <select
                                        value={years}
                                        onChange={(e) => setYears(Number(e.target.value))}
                                        aria-label="貸款年限"
                                        className="w-full py-3 px-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value={20}>20 年</option>
                                        <option value={30}>30 年</option>
                                        <option value={40}>40 年（新青安）</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">年利率 %</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        aria-label="年利率"
                                        value={rate}
                                        onChange={(e) => setRate(Number(e.target.value) || 0)}
                                        className="w-full py-3 px-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCalculate}
                                disabled={loading}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors"
                            >
                                {loading ? '計算中...' : '🏠 計算房貸'}
                            </button>
                        </div>
                    </div>

                    {/* 結果 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                            計算結果
                        </h2>

                        {result ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                                    <p className="text-sm text-green-600 mb-1">每月還款</p>
                                    <p className="text-3xl font-black text-green-700">
                                        NT$ {fmt(result?.monthlyPayment || 0)}
                                    </p>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">貸款本金</span>
                                        <span className="font-medium">NT$ {fmt(principal)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">總利息支出</span>
                                        <span className="text-orange-500 font-medium">NT$ {fmt(result?.totalInterest || 0)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">總還款金額</span>
                                        <span className="font-bold">NT$ {fmt(result?.totalPayment || 0)}</span>
                                    </div>
                                </div>

                                {/* 小提示 */}
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-700">
                                        建議月付金額不超過月收入的 1/3，以確保生活品質與財務彈性。
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <Home className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>輸入貸款條件後按「計算房貸」</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 公式說明 */}
                <section className="mb-12 bg-white border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                        計算公式（本息平均攤還法）
                    </h2>
                    <div className="prose prose-slate prose-sm max-w-none">
                        <p>採用本息平均攤還法，每月還款金額固定：</p>
                        <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            每月還款 = 本金 × 月利率 × (1 + 月利率)^期數 / ((1 + 月利率)^期數 - 1)
                        </div>
                        <ul className="mt-4">
                            <li><strong>月利率</strong> = 年利率 ÷ 12</li>
                            <li><strong>期數</strong> = 貸款年數 × 12</li>
                            <li><strong>總利息</strong> = 每月還款 × 期數 - 本金</li>
                        </ul>
                    </div>
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
                        <Link href="/salary" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 group-hover:text-green-600">薪資計算器</h3>
                            <p className="text-sm text-slate-500">月收入能負擔多少房貸？</p>
                        </Link>
                        <Link href="/mortgage/scenario/early-repayment" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 group-hover:text-green-600">提前還款試算</h3>
                            <p className="text-sm text-slate-500">提前還款能省多少利息？</p>
                        </Link>
                        <Link href="/capital" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 group-hover:text-green-600">複利計算器</h3>
                            <p className="text-sm text-slate-500">存下頭期款要多久？</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-100 bg-white py-8">
                <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-400">
                    <p>計算結果僅供參考，實際金額依銀行及政府規定為準</p>
                    <p className="mt-2">© 2025 TaiCalc</p>
                </div>
            </footer>
        </div>
    );
}
