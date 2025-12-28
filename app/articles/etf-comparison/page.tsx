import Link from 'next/link';
import { ArrowLeft, TrendingUp, CheckCircle2, BarChart3, DollarSign, AlertTriangle, Calculator } from 'lucide-react';

export const metadata = {
    title: 'ETF 三雄大比拚：0050 vs 0056 vs 00878 投資人怎麼選？ | TaiCalc 數策',
    description: '深入比較台灣三大熱門 ETF 的報酬率、配息策略、風險特性，幫助你選擇最適合的投資標的。',
};

export default function ETFComparisonArticle() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-4xl mx-auto px-6 h-18 flex items-center justify-between">
                    <Link href="/articles" className="flex items-center space-x-3 group transition-all">
                        <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 shadow-sm group-hover:border-brand-primary group-hover:text-brand-primary transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-slate-600 group-hover:text-brand-primary">知識庫</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black text-xs shadow-glow">T</div>
                        <span className="font-black text-slate-900 tracking-tighter">TaiCalc <span className="text-brand-primary">Insight</span></span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Article Header */}
                <header className="mb-12">
                    <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest mb-4">
                        <span className="text-white bg-emerald-500 px-2 py-1 rounded-md flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            理財商品
                        </span>
                        <span className="text-slate-400">2025.03.15</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-400">10 min read</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
                        ETF 三雄大比拚：<br />0050 vs 0056 vs 00878 投資人怎麼選？
                    </h1>
                    <p className="text-lg text-slate-500">
                        2024 年台股 ETF 績效差異驚人！市值型 0050 報酬率近 49%，高股息 0056 卻只有 4.7%。本文用數據分析三大 ETF 的差異，幫你找到最適合的投資標的。
                    </p>
                </header>

                {/* Article Content */}
                <article className="prose prose-lg prose-slate max-w-none">
                    {/* 2024 績效比較 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-6">
                            <BarChart3 className="w-6 h-6 text-brand-primary" />
                            2024 年績效大比拚
                        </h2>

                        <div className="grid md:grid-cols-3 gap-4 my-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                                <div className="text-4xl font-black text-blue-600 mb-2">48.67%</div>
                                <div className="text-lg font-bold text-slate-900">0050</div>
                                <div className="text-sm text-slate-500">元大台灣50</div>
                                <div className="text-xs text-blue-600 mt-2">含息報酬率</div>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                                <div className="text-4xl font-black text-amber-600 mb-2">11.15%</div>
                                <div className="text-lg font-bold text-slate-900">00878</div>
                                <div className="text-sm text-slate-500">國泰永續高股息</div>
                                <div className="text-xs text-amber-600 mt-2">含息報酬率</div>
                            </div>
                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
                                <div className="text-4xl font-black text-rose-600 mb-2">4.71%</div>
                                <div className="text-lg font-bold text-slate-900">0056</div>
                                <div className="text-sm text-slate-500">元大高股息</div>
                                <div className="text-xs text-rose-600 mt-2">含息報酬率</div>
                            </div>
                        </div>

                        <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-600">
                            <strong>📊 數據來源：</strong>各投信官網及 MoneyDJ 理財網，統計期間為 2024 年全年。
                        </div>
                    </section>

                    {/* 三種 ETF 特性 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-6">
                            <DollarSign className="w-6 h-6 text-emerald-500" />
                            三種 ETF 的核心差異
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="text-left p-4 font-bold">項目</th>
                                        <th className="text-center p-4 font-bold text-blue-600">0050</th>
                                        <th className="text-center p-4 font-bold text-amber-600">00878</th>
                                        <th className="text-center p-4 font-bold text-rose-600">0056</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-200">
                                        <td className="p-4 font-medium">投資策略</td>
                                        <td className="p-4 text-center">市值型</td>
                                        <td className="p-4 text-center">ESG 高股息</td>
                                        <td className="p-4 text-center">預測高股息</td>
                                    </tr>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <td className="p-4 font-medium">成分股數</td>
                                        <td className="p-4 text-center">50 檔</td>
                                        <td className="p-4 text-center">30 檔</td>
                                        <td className="p-4 text-center">50 檔</td>
                                    </tr>
                                    <tr className="border-b border-slate-200">
                                        <td className="p-4 font-medium">配息頻率</td>
                                        <td className="p-4 text-center">半年配</td>
                                        <td className="p-4 text-center">季配</td>
                                        <td className="p-4 text-center">季配</td>
                                    </tr>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <td className="p-4 font-medium">2024 殖利率</td>
                                        <td className="p-4 text-center">~3%</td>
                                        <td className="p-4 text-center">~8.89%</td>
                                        <td className="p-4 text-center">~7.5%</td>
                                    </tr>
                                    <tr className="border-b border-slate-200">
                                        <td className="p-4 font-medium">管理費</td>
                                        <td className="p-4 text-center">0.355%</td>
                                        <td className="p-4 text-center">0.25%</td>
                                        <td className="p-4 text-center">0.66%</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">適合族群</td>
                                        <td className="p-4 text-center">追求成長</td>
                                        <td className="p-4 text-center">穩定現金流</td>
                                        <td className="p-4 text-center">穩定現金流</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 怎麼選 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-6">
                            <CheckCircle2 className="w-6 h-6 text-brand-primary" />
                            該怎麼選？看你的投資目標
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                                <h3 className="font-bold text-blue-800 mb-2">🎯 選 0050：追求長期資產成長</h3>
                                <p className="text-blue-700">
                                    適合 30-40 歲、距離退休還有 20 年以上的投資人。不需要現金流，想讓資產隨台股大盤一起成長。歷史年化報酬約 <strong>8-10%</strong>。
                                </p>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                                <h3 className="font-bold text-amber-800 mb-2">💰 選 00878：ESG 永續 + 穩定配息</h3>
                                <p className="text-amber-700">
                                    適合重視 ESG 永續議題、同時想要穩定現金流的投資人。季配息設計讓收息更平穩，殖利率約 <strong>8-9%</strong>。
                                </p>
                            </div>

                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
                                <h3 className="font-bold text-rose-800 mb-2">📈 選 0056：老牌高股息</h3>
                                <p className="text-rose-700">
                                    台灣最老牌的高股息 ETF，成分股調整策略為「預測」未來高股息，但管理費較高。適合信任品牌歷史的保守投資人。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 注意事項 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-6">
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                            投資 ETF 的注意事項
                        </h2>

                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                            <ul className="space-y-3 text-amber-800">
                                <li className="flex items-start gap-2">
                                    <span className="font-bold">1.</span>
                                    <span><strong>過去績效不代表未來表現</strong>：2024 年 0050 表現特別好，但不保證每年都如此。</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold">2.</span>
                                    <span><strong>高股息不等於高報酬</strong>：配息高但股價下跌，總報酬可能比市值型 ETF 低。</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold">3.</span>
                                    <span><strong>分散投資</strong>：不要把所有資金放在單一 ETF，可考慮搭配台股 + 美股 ETF。</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold">4.</span>
                                    <span><strong>長期持有</strong>：ETF 適合 5 年以上的長期投資，短期進出會增加交易成本。</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-black text-slate-900 mb-3">規劃你的退休投資組合</h3>
                        <p className="text-slate-500 mb-6">使用 TaiCalc 退休規劃計算器，算出達成目標需要的每月投資金額</p>
                        <Link href="/retirement" className="inline-flex items-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                            <Calculator className="w-5 h-5" />
                            <span>開始計算</span>
                        </Link>
                    </section>
                </article>
            </main>
        </div>
    );
}
