'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Calculator,
    ChevronDown,
    ChevronRight,
    HelpCircle,
    Lightbulb,
    BookOpen,
    Flame,
    Target,
    Banknote
} from 'lucide-react';
import { publicExecute } from '@/lib/publicExecute';

// 快速情境
const QUICK_SCENARIOS = [
    { label: '每月存 5000', initial: 0, monthly: 5000, rate: 6, years: 10 },
    { label: '每月存 1 萬', initial: 0, monthly: 10000, rate: 6, years: 10 },
    { label: '每月存 2 萬', initial: 100000, monthly: 20000, rate: 7, years: 15 },
    { label: '存到 100 萬', initial: 0, monthly: 10000, rate: 6, years: 7 },
];

// FAQ
const FAQ_DATA = [
    {
        q: '複利和單利差在哪？',
        a: '單利只對本金計算利息，複利則會「利滾利」，將利息併入本金再計算。長期下來，複利的效果驚人——這就是愛因斯坦所說的「世界第八大奇蹟」。'
    },
    {
        q: '年化報酬率 6% 合理嗎？',
        a: '台股大盤（加計股息）長期年化報酬約 8-10%；0050 ETF 過去 20 年約 8%；穩健型投資組合約 5-7%。保守估算可用 5-6%，積極估算可用 7-8%。'
    },
    {
        q: '每月存多少才能變有錢？',
        a: '假設年報酬 6%，每月存 1 萬，10 年後約 164 萬；每月存 2 萬，10 年後約 328 萬。關鍵是「持續」和「時間」，越早開始越好。'
    },
    {
        q: '72 法則是什麼？',
        a: '用 72 除以報酬率，就是資產翻倍所需年數。例如：報酬率 6%，約 12 年翻倍（72÷6=12）；報酬率 8%，約 9 年翻倍。'
    },
    {
        q: '存股 vs 定存哪個好？',
        a: '定存年利率約 1-1.5%，跑不贏通膨（約 2%）。存股（尤其是指數型 ETF）長期報酬較高，但短期有波動風險。適合用閒錢、長期投資。'
    },
];

export default function CapitalPage() {
    const [initial, setInitial] = useState<number>(0);
    const [monthly, setMonthly] = useState<number>(10000);
    const [rate, setRate] = useState<number>(6);
    const [years, setYears] = useState<number>(10);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await publicExecute('capital.growth', {
                initialCapital: initial,
                monthlyContribution: monthly,
                annualReturnRate: rate,
                years: years
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
        setInitial(s.initial);
        setMonthly(s.monthly);
        setRate(s.rate);
        setYears(s.years);
    };

    const fmt = (n: number) => n?.toLocaleString('zh-TW') || '0';

    // 簡單計算（若 API 尚未返回）
    const simpleCalc = () => {
        const r = rate / 100 / 12;
        const n = years * 12;
        const futureValue = initial * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
        const totalContributed = initial + monthly * n;
        return {
            futureValue: Math.round(futureValue),
            totalContributed: Math.round(totalContributed),
            totalEarnings: Math.round(futureValue - totalContributed)
        };
    };

    const calc = result || simpleCalc();

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
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded">理財</span>
                        <span className="text-slate-400 text-sm">capital.growth</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        複利計算器：存到 100 萬要多久？
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        輸入每月儲蓄金額與預期報酬率，立即計算資產成長軌跡。
                        了解「時間」與「複利」的威力，規劃你的財富自由之路。
                    </p>
                </header>

                {/* 情境說明 */}
                <section className="mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="font-bold text-slate-900 mb-2">什麼情況會用到？</h2>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 想知道每月存 1 萬，10 年後會變多少</li>
                                <li>• 設定存到 100 萬的目標，看需要多久</li>
                                <li>• 比較不同報酬率（定存 vs 股市）的長期差異</li>
                                <li>• 規劃退休金或子女教育基金</li>
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
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${monthly === s.monthly && years === s.years
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-300'
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
                            <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
                            投資計畫
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">初始本金</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">NT$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        aria-label="初始本金"
                                        value={initial.toLocaleString()}
                                        onChange={(e) => setInitial(Number(e.target.value.replace(/,/g, '')) || 0)}
                                        className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">每月投入</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">NT$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        aria-label="每月投入金額"
                                        value={monthly.toLocaleString()}
                                        onChange={(e) => setMonthly(Number(e.target.value.replace(/,/g, '')) || 0)}
                                        className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">年報酬率 %</label>
                                    <input
                                        type="number"
                                        aria-label="年報酬率"
                                        value={rate}
                                        onChange={(e) => setRate(Number(e.target.value) || 0)}
                                        className="w-full py-3 px-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">投資年數</label>
                                    <input
                                        type="number"
                                        aria-label="投資年數"
                                        value={years}
                                        onChange={(e) => setYears(Number(e.target.value) || 0)}
                                        className="w-full py-3 px-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCalculate}
                                disabled={loading}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-colors"
                            >
                                {loading ? '計算中...' : '📈 計算成長'}
                            </button>
                        </div>
                    </div>

                    {/* 結果 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <Flame className="w-5 h-5 mr-2 text-orange-500" />
                            {years} 年後的你
                        </h2>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 text-center">
                                <p className="text-sm text-indigo-600 mb-1">預計資產總額</p>
                                <p className="text-3xl font-black text-indigo-700">
                                    NT$ {fmt(calc.futureValue || result?.finalValue || 0)}
                                </p>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-600">累計投入</span>
                                    <span className="font-medium">NT$ {fmt(calc.totalContributed || 0)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-600">投資收益</span>
                                    <span className="text-green-600 font-bold">+ NT$ {fmt(calc.totalEarnings || result?.totalEarnings || 0)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-600">收益佔比</span>
                                    <span className="font-bold text-indigo-600">
                                        {calc.totalContributed > 0 ? ((calc.totalEarnings / calc.totalContributed) * 100).toFixed(0) : 0}%
                                    </span>
                                </div>
                            </div>

                            {/* 重點提示 */}
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                <p className="text-sm text-amber-700">
                                    💡 如果每月多存 <strong>NT$ 5,000</strong>，{years} 年後會多 <strong>NT$ {fmt(5000 * years * 12 * (1 + rate / 100 * years / 2))}</strong> 以上！
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 公式說明 */}
                <section className="mb-12 bg-white border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                        複利計算公式
                    </h2>
                    <div className="prose prose-slate prose-sm max-w-none">
                        <p>本計算器使用複利公式，假設每月投入並月複利：</p>
                        <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            FV = P × (1 + r)^n + PMT × ((1 + r)^n - 1) / r
                        </div>
                        <ul className="mt-4">
                            <li><strong>FV</strong> = 終值（最終資產）</li>
                            <li><strong>P</strong> = 初始本金</li>
                            <li><strong>PMT</strong> = 每月投入金額</li>
                            <li><strong>r</strong> = 月報酬率（年報酬率 ÷ 12）</li>
                            <li><strong>n</strong> = 總月數（年數 × 12）</li>
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
                    <h2 className="text-xl font-bold text-slate-900 mb-4">更多理財工具</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link href="/calculators/capital.fire" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
                            <Flame className="w-6 h-6 text-orange-500 mb-2" />
                            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600">FIRE 計算器</h3>
                            <p className="text-sm text-slate-500">財務自由需要多少錢？</p>
                        </Link>
                        <Link href="/calculators/capital.goalReverse" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
                            <Target className="w-6 h-6 text-red-500 mb-2" />
                            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600">目標反推</h3>
                            <p className="text-sm text-slate-500">存到 100 萬每月要存多少？</p>
                        </Link>
                        <Link href="/salary" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
                            <Banknote className="w-6 h-6 text-green-500 mb-2" />
                            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600">薪資計算器</h3>
                            <p className="text-sm text-slate-500">實領多少？能存多少？</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-100 bg-white py-8">
                <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-400">
                    <p>投資有風險，計算結果不保證未來報酬</p>
                    <p className="mt-2">© 2025 TaiCalc</p>
                </div>
            </footer>
        </div>
    );
}
