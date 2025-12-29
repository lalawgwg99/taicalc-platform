'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Calculator, ChevronRight, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { publicExecute } from '@/lib/publicExecute';

export default function NewYouthMortgagePage() {
    const [principal, setPrincipal] = useState<number>(10000000);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await publicExecute('mortgage.calculate', { principal, years: 40, annualRate: 1.775 });
            if (res && typeof res === 'object' && 'data' in res) {
                setResult((res as any).data);
            } else {
                setResult(res);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fmt = (n: number) => n?.toLocaleString('zh-TW') || '0';

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                        <span className="font-bold text-slate-900">TaiCalc</span>
                    </Link>
                    <Link href="/mortgage" className="text-sm text-slate-600 hover:text-blue-500">← 回房貸計算器</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-blue-500">首頁</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/mortgage" className="hover:text-blue-500">房貸計算器</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900">新青安房貸</span>
                </div>

                <header className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
                        <Home className="w-4 h-4" />
                        2025 最新
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        2025 新青安房貸試算：貸 1000 萬每月繳多少？
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        新青年安心成家購屋優惠貸款（新青安）是首購族的好選擇。
                        最長可貸 40 年、優惠利率 1.775%。這篇幫你完整試算月繳金額與總利息。
                    </p>
                </header>

                {/* 新青安重點 */}
                <section className="mb-8 bg-green-50 border border-green-100 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <div>
                            <h2 className="font-bold text-slate-900 mb-2">新青安貸款重點</h2>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• <strong>利率</strong>：一段式 1.775%（機動調整）</li>
                                <li>• <strong>額度</strong>：最高 1,000 萬元</li>
                                <li>• <strong>年限</strong>：最長 40 年</li>
                                <li>• <strong>寬限期</strong>：最長 5 年（只繳利息）</li>
                                <li>• <strong>資格</strong>：首次購屋、年滿 18 歲、有穩定收入</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 計算器 */}
                <section className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-green-500" />
                            新青安試算
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">貸款金額</label>
                                <div className="flex gap-2">
                                    {[8000000, 10000000].map(p => (
                                        <button key={p} onClick={() => setPrincipal(p)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${principal === p ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                            {(p / 10000).toFixed(0)} 萬
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                                利率：1.775% ｜ 年限：40 年
                            </div>
                            <button onClick={handleCalculate} disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl">
                                {loading ? '計算中...' : '計算月繳'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            計算結果
                        </h2>
                        {result ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center mb-4">
                                    <p className="text-sm text-green-600">每月還款</p>
                                    <p className="text-3xl font-black text-green-700">NT$ {fmt(result?.monthlyPayment || 0)}</p>
                                </div>
                                <div className="text-sm text-slate-600 space-y-2">
                                    <div className="flex justify-between"><span>貸款本金</span><span>{fmt(principal)}</span></div>
                                    <div className="flex justify-between"><span>總利息</span><span className="text-orange-500">{fmt(result?.totalInterest || 0)}</span></div>
                                    <div className="flex justify-between font-bold"><span>總還款</span><span>{fmt(result?.totalPayment || 0)}</span></div>
                                </div>
                            </motion.div>
                        ) : (
                            <p className="text-slate-400 text-center py-8">選擇金額後點擊計算</p>
                        )}
                    </div>
                </section>

                {/* 注意事項 */}
                <section className="mb-12 bg-amber-50 border border-amber-100 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                        <div>
                            <h2 className="font-bold text-slate-900 mb-2">申請前注意</h2>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 新青安貸款需透過承辦銀行申請，各銀行條件可能略有差異</li>
                                <li>• 利率為機動利率，會隨央行利率調整</li>
                                <li>• 5 年寬限期結束後，月繳金額會增加</li>
                                <li>• 需要自備款（房價的 20-30%）</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 文章 */}
                <article className="prose prose-slate max-w-none mb-12">
                    <h2>新青安 vs 一般房貸比較</h2>
                    <table>
                        <thead>
                            <tr><th></th><th>新青安</th><th>一般房貸</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>利率</td><td>1.775%</td><td>2.0% ~ 2.5%</td></tr>
                            <tr><td>年限</td><td>最長 40 年</td><td>通常 30 年</td></tr>
                            <tr><td>額度</td><td>最高 1,000 萬</td><td>依銀行核定</td></tr>
                            <tr><td>寬限期</td><td>最長 5 年</td><td>通常 2-3 年</td></tr>
                        </tbody>
                    </table>

                    <h2>誰適合申請新青安？</h2>
                    <ul>
                        <li>✓ 首次購屋的年輕人</li>
                        <li>✓ 需要較長貸款年限降低月負擔</li>
                        <li>✓ 購屋總價在 1,500 萬以內（配合其他貸款）</li>
                    </ul>
                </article>

                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">相關工具</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/mortgage" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-green-300 hover:shadow-md">
                            <h3 className="font-bold text-slate-900 group-hover:text-green-600">完整房貸計算器</h3>
                            <p className="text-sm text-slate-500">比較不同利率與年限</p>
                        </Link>
                        <Link href="/salary" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-green-300 hover:shadow-md">
                            <h3 className="font-bold text-slate-900 group-hover:text-green-600">薪資計算器</h3>
                            <p className="text-sm text-slate-500">月收入能負擔多少房貸？</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-100 bg-white py-8">
                <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-400">
                    <p>© 2025 TaiCalc. 計算結果僅供參考，實際依銀行核定為準。</p>
                </div>
            </footer>
        </div>
    );
}
