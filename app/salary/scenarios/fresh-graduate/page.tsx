'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, Calculator, ChevronRight, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { publicExecute } from '@/lib/publicExecute';

export default function FreshGraduateSalaryPage() {
    const [salary, setSalary] = useState<number>(35000);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await publicExecute('salary.analyze', { monthlySalary: salary, bonusMonths: 2, selfContributionRate: 0 });
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
                    <Link href="/salary" className="text-sm text-slate-600 hover:text-blue-500">← 回薪資計算器</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-10">
                {/* 麵包屑 */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-blue-500">首頁</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/salary" className="hover:text-blue-500">薪資計算器</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900">新鮮人薪資</span>
                </div>

                {/* 標題 */}
                <header className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                        <Briefcase className="w-4 h-4" />
                        新鮮人專屬
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        2025 新鮮人薪資：月薪 35K 實際拿多少？
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        剛畢業、第一份工作，想知道月薪 35,000 元扣完勞健保後實際能拿多少？
                        這篇幫你完整試算，並提供談薪時的參考建議。
                    </p>
                </header>

                {/* 情境說明 */}
                <section className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-blue-500 flex-shrink-0" />
                        <div>
                            <h2 className="font-bold text-slate-900 mb-2">新鮮人看這裡</h2>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 2025 年基本工資：月薪 27,470 元、時薪 183 元</li>
                                <li>• 新鮮人平均月薪：30,000 ~ 38,000 元（視產業而定）</li>
                                <li>• 科技業新鮮人可達 40,000 ~ 50,000 元</li>
                                <li>• 第一份工作重點是「學習」，但也別賣太便宜</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 快速計算器 */}
                <section className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-blue-500" />
                            試算你的實領
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">月薪（稅前）</label>
                                <div className="flex gap-2">
                                    {[32000, 35000, 38000, 42000].map(s => (
                                        <button key={s} onClick={() => setSalary(s)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${salary === s ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                            {(s / 1000).toFixed(0)}K
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleCalculate} disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl">
                                {loading ? '計算中...' : '計算實領'}
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
                                    <p className="text-sm text-green-600">月薪 {fmt(salary)} 實領</p>
                                    <p className="text-3xl font-black text-green-700">NT$ {fmt(result?.monthly?.takeHome || result?.monthly?.net || 0)}</p>
                                </div>
                                <div className="text-sm text-slate-600 space-y-1">
                                    <div className="flex justify-between"><span>勞保自付</span><span>-{fmt(result?.monthly?.laborInsurance || 0)}</span></div>
                                    <div className="flex justify-between"><span>健保自付</span><span>-{fmt(result?.monthly?.healthInsurance || 0)}</span></div>
                                </div>
                            </motion.div>
                        ) : (
                            <p className="text-slate-400 text-center py-8">選擇月薪後點擊計算</p>
                        )}
                    </div>
                </section>

                {/* 文章內容 */}
                <article className="prose prose-slate max-w-none mb-12">
                    <h2>新鮮人薪資怎麼談？</h2>
                    <p>
                        第一份工作談薪水很重要，因為這會影響你未來的起點。以下是幾個建議：
                    </p>
                    <ol>
                        <li><strong>先了解行情</strong>：科技業、金融業起薪較高，服務業、傳產相對較低。</li>
                        <li><strong>算清楚實領</strong>：月薪 35,000 不等於拿 35,000，扣完勞健保大約實領 33,000 上下。</li>
                        <li><strong>考慮福利</strong>：年終獎金、三節禮金、保險、培訓資源都是價值。</li>
                        <li><strong>別先開價</strong>：讓公司先說，你再評估是否接受或協商。</li>
                    </ol>

                    <h2>2025 各產業新鮮人薪資參考</h2>
                    <table>
                        <thead>
                            <tr><th>產業</th><th>新鮮人月薪範圍</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>科技業（軟體工程師）</td><td>45,000 ~ 60,000</td></tr>
                            <tr><td>科技業（硬體/製造）</td><td>38,000 ~ 48,000</td></tr>
                            <tr><td>金融業</td><td>38,000 ~ 50,000</td></tr>
                            <tr><td>傳產製造</td><td>30,000 ~ 38,000</td></tr>
                            <tr><td>服務業/餐飲</td><td>28,000 ~ 35,000</td></tr>
                            <tr><td>行銷/設計</td><td>32,000 ~ 42,000</td></tr>
                        </tbody>
                    </table>

                    <h2>勞退自提 6% 新鮮人適合嗎？</h2>
                    <p>
                        勞退自提 6% 可以節稅，但要到 60 歲才能領。對新鮮人來說，如果薪水不高、生活支出大，
                        <strong>不一定要馬上開始自提</strong>。等薪水穩定後再考慮也不遲。
                    </p>
                </article>

                {/* 相關工具 */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">相關工具</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/salary" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600">完整薪資計算器</h3>
                            <p className="text-sm text-slate-500">更多選項：年終、自提勞退等</p>
                        </Link>
                        <Link href="/tax" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600">所得稅計算器</h3>
                            <p className="text-sm text-slate-500">新鮮人年薪要繳多少稅？</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-100 bg-white py-8">
                <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-400">
                    <p>© 2025 TaiCalc. 計算結果僅供參考。</p>
                </div>
            </footer>
        </div>
    );
}
