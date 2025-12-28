import Link from 'next/link';
import { ArrowLeft, PiggyBank, CheckCircle2, XCircle, Calculator, TrendingUp, Clock, Shield, AlertTriangle, Sparkles } from 'lucide-react';
import AIInsightCard from '@/components/AI/AIInsightCard';

export const metadata = {
    title: '2025 勞退自提 6% 完整攻略：節稅、報酬、優缺點一次看懂 | TaiCalc 數策',
    description: '勞退自提 6% 到底划不划算？深入分析節稅效果、保證收益機制、資金流動性，幫你做出最佳決策。',
};

export default function LaborPensionArticle() {
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
                        <span className="text-white bg-blue-500 px-2 py-1 rounded-md flex items-center gap-1">
                            <PiggyBank className="w-4 h-4" />
                            退休規劃
                        </span>
                        <span className="text-slate-400">2025.03.01</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-400">9 min read</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
                        2025 勞退自提 6% 完整攻略：<br />節稅、報酬、優缺點一次看懂
                    </h1>
                    <p className="text-lg text-slate-500">
                        勞退自提 6% 到底划不划算？本文深入分析節稅效果、保證收益機制、資金流動性限制，幫你做出最適合自己的決策。
                    </p>
                </header>

                {/* Article Content */}
                <article className="prose prose-lg prose-slate max-w-none">
                    {/* 前言 */}
                    <section className="mb-12">
                        <p>
                            台灣「勞工退休金新制」（勞退新制）自 2005 年 7 月實施，根據規定，雇主每月須為員工提繳不低於薪資 <strong>6%</strong> 的退休金至個人專戶。除此之外，勞工還可以選擇<strong>自願提繳 1% 至 6%</strong> 的薪資，這就是俗稱的「勞退自提」。
                        </p>
                        <p>
                            根據勞動部統計，2024 年底全台自願提繳勞工人數已突破 <strong>120 萬人</strong>，年增超過 15%。究竟這項制度有什麼吸引力？又有什麼需要注意的地方？
                        </p>
                    </section>

                    {/* 節稅效益 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-6">
                            <Calculator className="w-6 h-6 text-brand-primary" />
                            節稅效益：所得稅級距越高，省越多
                        </h2>
                        <p>
                            勞退自提最大的優勢是<strong>節稅</strong>。自願提繳的金額可以<strong>全額從當年度薪資所得中扣除</strong>，不計入綜合所得稅計算。
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 my-6">
                            <h3 className="font-bold text-blue-800 mb-4">💡 節稅試算範例</h3>
                            <p className="text-blue-700 mb-4">
                                假設月薪 <strong>50,000 元</strong>，自提 6%（每月 3,000 元），一年自提 <strong>36,000 元</strong>：
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-white rounded-xl p-4">
                                    <div className="text-slate-500 mb-1">所得稅率 5%</div>
                                    <div className="text-2xl font-black text-blue-600">省 $1,800</div>
                                </div>
                                <div className="bg-white rounded-xl p-4">
                                    <div className="text-slate-500 mb-1">所得稅率 12%</div>
                                    <div className="text-2xl font-black text-blue-600">省 $4,320</div>
                                </div>
                                <div className="bg-white rounded-xl p-4">
                                    <div className="text-slate-500 mb-1">所得稅率 20%</div>
                                    <div className="text-2xl font-black text-blue-600">省 $7,200</div>
                                </div>
                                <div className="bg-white rounded-xl p-4">
                                    <div className="text-slate-500 mb-1">所得稅率 30%</div>
                                    <div className="text-2xl font-black text-blue-600">省 $10,800</div>
                                </div>
                            </div>
                            <p className="text-blue-600 text-sm mt-4">
                                ⚠️ 提醒：報稅時若發現自提金額未扣除，請儘速通知公司向國稅局更正。
                            </p>
                        </div>
                    </section>

                    {/* 優點 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-6">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            勞退自提的 5 大優點
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                <h3 className="font-bold text-slate-900 mb-2">1. 強迫儲蓄，紀律累積退休金</h3>
                                <p className="text-slate-600">
                                    自提金額每月自動從薪水扣除，避免「月光」情況，適合缺乏儲蓄紀律的人。根據勞動部試算，35 歲、月薪 4 萬的勞工若自提 6% 達 30 年，退休時專戶可累積約 <strong>743 萬元</strong>，比未自提者多出 <strong>283 萬元</strong>。
                                </p>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                <h3 className="font-bold text-slate-900 mb-2">2. 保證收益機制</h3>
                                <p className="text-slate-600">
                                    勞退基金享有<strong>不低於銀行 2 年期定存利率</strong>的保證收益。即使基金投資虧損，政府也會補足差額，確保本金不會縮水。
                                </p>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                <h3 className="font-bold text-slate-900 mb-2">3. 個人專戶制，換工作不影響</h3>
                                <p className="text-slate-600">
                                    這筆錢完全歸勞工所有，不論轉職多少次、公司經營狀況如何，退休金都不會受影響，專戶跟著你一輩子。
                                </p>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                <h3 className="font-bold text-slate-900 mb-2">4. 彈性調整，隨時可停</h3>
                                <p className="text-slate-600">
                                    可選擇 1% 至 6% 的提繳比例，一年最多可調整 <strong>2 次</strong>。如有資金需求，也可以隨時停止提繳。
                                </p>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                <h3 className="font-bold text-slate-900 mb-2">5. 專業團隊代操</h3>
                                <p className="text-slate-600">
                                    勞退基金由勞動基金運用局管理，不需自己研究投資標的，對投資新手來說是省心的選擇。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 缺點 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-6">
                            <XCircle className="w-6 h-6 text-rose-500" />
                            勞退自提的 4 大缺點
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
                                <h3 className="font-bold text-rose-800 mb-2">1. 影響當期可支配所得</h3>
                                <p className="text-rose-700">
                                    每月扣款會減少實際到手的薪水，可能影響生活開銷或短期資金運用。
                                </p>
                            </div>

                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
                                <h3 className="font-bold text-rose-800 mb-2">2. 資金閉鎖期長達數十年</h3>
                                <p className="text-rose-700">
                                    原則上需等到 <strong>60 歲</strong> 才能請領，資金流動性極低，若有緊急需求無法動用。
                                </p>
                            </div>

                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
                                <h3 className="font-bold text-rose-800 mb-2">3. 無法自選投資標的</h3>
                                <p className="text-rose-700">
                                    目前勞退基金統一由政府管理，勞工無法自行選擇投資標的或進行更積極的資產配置。
                                </p>
                            </div>

                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
                                <h3 className="font-bold text-rose-800 mb-2">4. 長期報酬可能不如自行投資</h3>
                                <p className="text-rose-700">
                                    勞退基金的長期年化報酬約 3-5%，相對保守。若通膨較高，實質購買力可能受到影響。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 結論 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-6">
                            <TrendingUp className="w-6 h-6 text-brand-primary" />
                            結論：誰適合勞退自提？
                        </h2>

                        <div className="bg-slate-900 text-white rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-4">✅ 適合自提的人</h3>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    <span>所得稅率在 <strong>12% 以上</strong>，節稅效果明顯</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    <span>缺乏儲蓄紀律，需要強迫儲蓄機制</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    <span>不擅長投資，希望有保證收益</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    <span>已有足夠緊急預備金，不擔心資金流動性</span>
                                </li>
                            </ul>

                            <h3 className="text-xl font-bold mb-4">❌ 不適合自提的人</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                                    <span>目前有高利率負債（如信用卡債、信貸）</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                                    <span>尚未建立 3-6 個月的緊急預備金</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                                    <span>有信心長期投資報酬能超過 5%</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* AI 互動問答 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-6">
                            <Sparkles className="w-6 h-6 text-purple-500" />
                            AI 理財顧問 - 問我任何問題
                        </h2>

                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 mb-6">
                            <p className="text-purple-700 mb-4">
                                🤖 還有疑問嗎？問問 AI 顧問！常見問題包括：
                            </p>
                            <div className="grid md:grid-cols-2 gap-3 mb-6">
                                <div className="p-3 bg-white/80 rounded-xl text-sm text-purple-600 font-medium">
                                    💡 月薪 5 萬，自提能省多少稅？
                                </div>
                                <div className="p-3 bg-white/80 rounded-xl text-sm text-purple-600 font-medium">
                                    📊 勞退基金 vs 0050 報酬率比較？
                                </div>
                                <div className="p-3 bg-white/80 rounded-xl text-sm text-purple-600 font-medium">
                                    🎯 我 30 歲該自提嗎？
                                </div>
                                <div className="p-3 bg-white/80 rounded-xl text-sm text-purple-600 font-medium">
                                    ⚠️ 自提的錢 60 歲前能領出來嗎？
                                </div>
                            </div>
                            <AIInsightCard
                                title="勞退自提 AI 顧問"
                                buttonText="請 AI 分析我的情況"
                                prompt="你是TaiCalc的勞退專家顧問。用戶正在閱讀關於勞退自提6%的文章。請根據一般情況提供個人化建議。分析內容應包括：1.不同月薪級距的節稅效益 2.勞退基金歷年績效 3.自提vs自行投資的優缺點比較 4.給年輕人的具體建議。請用繁體中文回答，300字以內，給出具體數字和建議。"
                                context={{
                                    articleTopic: '勞退自提6%',
                                    keyPoints: '節稅效益、保證收益、資金閉鎖期、適合族群'
                                }}
                            />
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-black text-slate-900 mb-3">想知道退休需要存多少錢？</h3>
                        <p className="text-slate-500 mb-6">使用 TaiCalc 退休規劃計算器，3 分鐘算出你的退休目標</p>
                        <Link href="/retirement" className="inline-flex items-center space-x-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200">
                            <Calculator className="w-5 h-5" />
                            <span>開始計算</span>
                        </Link>
                    </section>
                </article>
            </main>
        </div>
    );
}
