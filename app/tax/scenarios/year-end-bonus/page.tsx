'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, Calculator, ChevronRight, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { publicExecute } from '@/lib/publicExecute';

export default function YearEndBonusTaxPage() {
    const [bonus, setBonus] = useState<number>(100000);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            // 簡單估算：年終獎金的預扣稅約 5%（超過 86,001 元時）
            const withheld = bonus > 86000 ? bonus * 0.05 : 0;
            setResult({ bonus, withheld, afterTax: bonus - withheld });
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
                    <Link href="/tax" className="text-sm text-slate-600 hover:text-blue-500">← 回稅務計算器</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-blue-500">首頁</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/tax" className="hover:text-blue-500">稅務計算器</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900">年終獎金稅務</span>
                </div>

                <header className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
                        <Gift className="w-4 h-4" />
                        年終專題
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        年終獎金要繳多少稅？2025 完整攻略
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        年終獎金是薪資所得的一部分，會被納入年度綜合所得稅計算。
                        這篇幫你了解年終的扣稅規則，以及如何規劃最節稅。
                    </p>
                </header>

                {/* 重點說明 */}
                <section className="mb-8 bg-red-50 border border-red-100 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-red-500 flex-shrink-0" />
                        <div>
                            <h2 className="font-bold text-slate-900 mb-2">年終獎金稅務重點</h2>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 年終獎金屬於「薪資所得」，併入全年所得計算</li>
                                <li>• 單次發放超過 <strong>86,001 元</strong> 會先預扣 5%</li>
                                <li>• 預扣稅款會在報稅時「多退少補」</li>
                                <li>• 實際稅率取決於你的全年所得落在哪個級距</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 計算器 */}
                <section className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-red-500" />
                            年終預扣稅試算
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">年終獎金金額</label>
                                <div className="flex flex-wrap gap-2">
                                    {[50000, 86000, 100000, 150000, 200000].map(b => (
                                        <button key={b} onClick={() => setBonus(b)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${bonus === b ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                            {(b / 10000).toFixed(0)} 萬
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleCalculate} disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl">
                                {loading ? '計算中...' : '計算預扣稅'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-red-500" />
                            計算結果
                        </h2>
                        {result ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center mb-4">
                                    <p className="text-sm text-red-600">實際入帳</p>
                                    <p className="text-3xl font-black text-red-700">NT$ {fmt(result.afterTax)}</p>
                                </div>
                                <div className="text-sm text-slate-600 space-y-2">
                                    <div className="flex justify-between"><span>年終獎金</span><span>{fmt(result.bonus)}</span></div>
                                    <div className="flex justify-between"><span>預扣稅款 5%</span><span className="text-orange-500">-{fmt(result.withheld)}</span></div>
                                </div>
                                {result.withheld === 0 && (
                                    <div className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                        ✓ 未達 86,001 元，不需預扣稅款
                                    </div>
                                )}
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
                            <h2 className="font-bold text-slate-900 mb-2">預扣 ≠ 實際要繳的稅</h2>
                            <p className="text-sm text-slate-700">
                                預扣 5% 只是「先扣著」，實際要繳多少稅取決於你的 <strong>年度總所得</strong>。
                                如果年收入較低（例如 60-70 萬），報稅時預扣的稅款可能會退回。
                                如果年收入較高（例如 150 萬+），可能還要補繳。
                            </p>
                        </div>
                    </div>
                </section>

                {/* 文章 */}
                <article className="prose prose-slate max-w-none mb-12">
                    <h2>年終獎金節稅策略</h2>
                    <ol>
                        <li>
                            <strong>勞退自提 6%</strong><br />
                            自提的金額可從年度所得中扣除，對高所得者節稅效果明顯。
                        </li>
                        <li>
                            <strong>善用扣除額</strong><br />
                            保險費、醫療費、房租、捐款等列舉扣除，可能比標準扣除額更有利。
                        </li>
                        <li>
                            <strong>分散收入年度</strong><br />
                            如果可能，與公司協調年終的發放時間，避免單一年度所得過高。
                        </li>
                    </ol>

                    <h2>年終獎金常見問題</h2>
                    <p><strong>Q：年終獎金一定會被扣 5% 嗎？</strong></p>
                    <p>A：不是。只有單次發放超過 86,001 元才會預扣。</p>

                    <p><strong>Q：預扣的稅可以退嗎？</strong></p>
                    <p>A：可以。如果你的全年所得算出來的應繳稅額 &lt; 預扣稅額，報稅時會退回多繳的部分。</p>
                </article>

                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">相關工具</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/tax" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:shadow-md">
                            <h3 className="font-bold text-slate-900 group-hover:text-red-600">完整所得稅計算器</h3>
                            <p className="text-sm text-slate-500">計算全年應繳稅額</p>
                        </Link>
                        <Link href="/salary" className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:shadow-md">
                            <h3 className="font-bold text-slate-900 group-hover:text-red-600">薪資計算器</h3>
                            <p className="text-sm text-slate-500">計算月薪扣款明細</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-100 bg-white py-8">
                <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-400">
                    <p>© 2025 TaiCalc. 計算結果僅供參考，實際依國稅局規定為準。</p>
                </div>
            </footer>
        </div>
    );
}
