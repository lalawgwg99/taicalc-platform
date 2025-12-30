'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, ChevronDown, TrendingUp, Wallet, PiggyBank } from 'lucide-react';

interface Props {
    salary: number;
}

export default function SalaryScenarioClient({ salary }: Props) {
    // 計算
    const laborRate = 0.024;
    const healthRate = 0.0155;
    const pensionRate = 0.06;

    const labor = Math.round(salary * laborRate);
    const health = Math.round(salary * healthRate);
    const pension = Math.round(salary * pensionRate);
    const takeHomeNoSelf = salary - labor - health;
    const takeHomeWithSelf = salary - labor - health - pension;

    const annualGross = salary * 14; // 含2個月年終
    const annualNet = takeHomeNoSelf * 12 + salary * 2;

    const fmt = (n: number) => n.toLocaleString('zh-TW');

    // 相關薪資級距
    const relatedSalaries = [35000, 40000, 45000, 50000, 55000, 60000, 70000, 80000, 100000, 120000]
        .filter(s => s !== salary)
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* 導航 */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="font-bold text-lg text-slate-900">TaiCalc</Link>
                    <Link href="/salary" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Calculator className="w-4 h-4" />
                        自訂試算
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* H1 標題 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        月薪 {fmt(salary)} 實領多少？
                    </h1>
                    <p className="text-lg text-slate-600">
                        扣除勞保、健保後，每月實領約 <span className="text-2xl font-bold text-green-600">{fmt(takeHomeNoSelf)} 元</span>
                    </p>
                </div>

                {/* 快速結論卡片 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-8"
                >
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-sm text-slate-600 mb-1">月薪</p>
                            <p className="text-2xl font-bold text-slate-900">NT$ {fmt(salary)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 mb-1">每月扣款</p>
                            <p className="text-2xl font-bold text-red-500">- NT$ {fmt(labor + health)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-green-200">
                            <p className="text-sm text-green-600 mb-1">每月實領</p>
                            <p className="text-3xl font-black text-green-600">NT$ {fmt(takeHomeNoSelf)}</p>
                        </div>
                    </div>
                </motion.div>

                {/* 扣款明細 */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-blue-500" />
                        扣款明細拆解
                    </h2>

                    <div className="space-y-3">
                        <div className="flex justify-between py-3 border-b border-slate-100">
                            <div>
                                <span className="font-medium text-slate-900">勞保自付額</span>
                                <p className="text-xs text-slate-500">費率 12% × 勞工自付 20% = 2.4%</p>
                            </div>
                            <span className="text-red-500 font-bold">- NT$ {fmt(labor)}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-slate-100">
                            <div>
                                <span className="font-medium text-slate-900">健保自付額</span>
                                <p className="text-xs text-slate-500">費率 5.17% × 自付 30% ≈ 1.55%</p>
                            </div>
                            <span className="text-red-500 font-bold">- NT$ {fmt(health)}</span>
                        </div>
                        <div className="flex justify-between py-3 bg-slate-50 rounded-lg px-4">
                            <span className="font-bold text-slate-900">總扣款</span>
                            <span className="text-red-600 font-bold">- NT$ {fmt(labor + health)}</span>
                        </div>
                    </div>
                </section>

                {/* 勞退自提情境 */}
                <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <PiggyBank className="w-5 h-5 text-amber-500" />
                        若開啟勞退自提 6%
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-sm text-slate-600 mb-1">自提金額 (每月)</p>
                            <p className="text-xl font-bold text-amber-600">NT$ {fmt(pension)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-sm text-slate-600 mb-1">開啟自提後實領</p>
                            <p className="text-xl font-bold text-slate-900">NT$ {fmt(takeHomeWithSelf)}</p>
                        </div>
                    </div>

                    <p className="text-sm text-amber-700 mt-4">
                        💡 自提 6% 可從年度所得中扣除，適合所得稅率 20% 以上的高薪族群節稅。
                    </p>
                </section>

                {/* 年薪試算 */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        年薪試算（含 2 個月年終）
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm text-slate-600 mb-1">年薪總額</p>
                            <p className="text-xl font-bold text-slate-900">NT$ {fmt(annualGross)}</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                            <p className="text-sm text-green-600 mb-1">年度實領（估計）</p>
                            <p className="text-xl font-bold text-green-600">NT$ {fmt(annualNet)}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">常見問題</h2>

                    <div className="space-y-4">
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-slate-900 mb-2">Q：月薪和實領差多少算正常？</h3>
                            <p className="text-slate-600 text-sm">通常差距約 4-10%，取決於勞健保與是否勞退自提。月薪 {fmt(salary)} 差距約 {fmt(labor + health)} 元。</p>
                        </div>
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-slate-900 mb-2">Q：勞退自提 6% 划算嗎？</h3>
                            <p className="text-slate-600 text-sm">自提金額可節稅，適合高稅率族群。月薪 {fmt(salary)} 每月自提 {fmt(pension)} 元，年節稅約 {fmt(Math.round(pension * 12 * 0.12))} 元（以 12% 稅率計算）。</p>
                        </div>
                        <div className="pb-4">
                            <h3 className="font-bold text-slate-900 mb-2">Q：年終獎金要扣稅嗎？</h3>
                            <p className="text-slate-600 text-sm">年終併入年度所得計算。單次超過 86,001 元會先預扣 5%，報稅時多退少補。</p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-center text-white mb-8">
                    <h2 className="text-2xl font-bold mb-4">想用不同薪資試算？</h2>
                    <p className="mb-6 opacity-90">輸入 3 個數字，10 秒看結果</p>
                    <Link
                        href={`/salary?salary=${salary}`}
                        className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all"
                    >
                        <Calculator className="w-5 h-5" />
                        自訂薪資試算
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </section>

                {/* 相關頁面 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">其他薪資級距試算</h2>
                    <div className="flex flex-wrap gap-2">
                        {relatedSalaries.map(s => (
                            <Link
                                key={s}
                                href={`/salary/scenarios/${s}`}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                            >
                                月薪 {fmt(s)}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 內部連結 */}
                <section className="bg-slate-50 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">延伸試算</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/capital" className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                            <TrendingUp className="w-8 h-8 text-indigo-500" />
                            <div>
                                <p className="font-bold text-slate-900">資本成長計算器</p>
                                <p className="text-sm text-slate-600">把每月可投資金額換算成 N 年後資產</p>
                            </div>
                        </Link>
                        <Link href="/tax" className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                            <Calculator className="w-8 h-8 text-purple-500" />
                            <div>
                                <p className="font-bold text-slate-900">所得稅試算</p>
                                <p className="text-sm text-slate-600">年薪 {fmt(annualGross)} 要繳多少稅？</p>
                            </div>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-8 mt-12">
                <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-500">
                    <p>TaiCalc 依據台灣 2024/2025 勞健保費率計算，實際金額以勞保局、健保署公告為準。</p>
                    <p className="mt-2">不用登入、不用留資料，直接算。</p>
                </div>
            </footer>
        </div>
    );
}
