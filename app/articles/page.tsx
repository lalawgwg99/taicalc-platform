import Link from 'next/link';
import { ArrowLeft, BookOpen, TrendingUp, Shield, HelpCircle, PiggyBank, Heart, Landmark, Target, CheckCircle2 } from 'lucide-react';

// ========== 文章資料 ==========
const ARTICLES = [
    // 保險專題
    {
        id: 'insurance-101',
        title: '保險規劃入門：壽險、醫療險、儲蓄險怎麼選？',
        excerpt: '從零開始認識保險：定期 vs 終身、純保障 vs 還本型，教你用最低成本買到最高保障。',
        category: '保險知識',
        categoryColor: 'bg-rose-500',
        date: '2025.03.20',
        readTime: '7 min read',
        icon: <Heart className="w-5 h-5" />,
        featured: true,
        slug: '#'
    },
    {
        id: 'medical-insurance-2025',
        title: '2025 實支實付醫療險大比較：住院一天理賠多少？',
        excerpt: '健保不給付的自費項目越來越多，實支實付如何挑選？副本理賠還有嗎？一次看懂最新市場動態。',
        category: '保險知識',
        categoryColor: 'bg-rose-500',
        date: '2025.02.28',
        readTime: '6 min read',
        icon: <Shield className="w-5 h-5" />,
        slug: '#'
    },
    // 理財商品
    {
        id: 'etf-vs-mutual-fund',
        title: 'ETF vs 共同基金：年輕人第一桶金怎麼存？',
        excerpt: '0050、0056、00878 差在哪？基金經理人值得付管理費嗎？破解理財小白最常踩的坑。',
        category: '理財商品',
        categoryColor: 'bg-emerald-500',
        date: '2025.03.15',
        readTime: '8 min read',
        icon: <TrendingUp className="w-5 h-5" />,
        featured: true,
        slug: '/articles/etf-comparison'
    },
    {
        id: 'dollar-cost-averaging',
        title: '定期定額 vs 單筆投資：數據告訴你哪個賺更多',
        excerpt: '用 20 年歷史數據回測台股與美股，揭開「紀律投資」的真實報酬率。',
        category: '理財商品',
        categoryColor: 'bg-emerald-500',
        date: '2025.02.10',
        readTime: '10 min read',
        icon: <Target className="w-5 h-5" />,
        slug: '#'
    },
    // 退休規劃
    {
        id: 'labor-pension-2025',
        title: '2025 勞退新制完整指南：自提 6% 划不划算？',
        excerpt: '勞退自願提繳節稅優惠計算、基金績效分析、退休金試算，一篇搞懂你該不該自提。',
        category: '退休規劃',
        categoryColor: 'bg-blue-500',
        date: '2025.03.01',
        readTime: '9 min read',
        icon: <PiggyBank className="w-5 h-5" />,
        featured: true,
        slug: '/articles/labor-pension-2025'
    },
    {
        id: 'fire-inflation-guide',
        title: '通膨時代的 FIRE 攻略：4% 法則還適用嗎？',
        excerpt: '物價飛漲下，傳統「25 倍年支出」可能讓你提早破產。動態提領率與抗通膨配置策略。',
        category: '退休規劃',
        categoryColor: 'bg-blue-500',
        date: '2025.01.20',
        readTime: '8 min read',
        icon: <Landmark className="w-5 h-5" />,
        slug: '#'
    },
    // 稅務
    {
        id: 'tax-deduction-2025',
        title: '2025 報稅懶人包：12 項扣除額你用對了嗎？',
        excerpt: '房貸利息、保險費、醫療費、教育費...完整列舉扣除額攻略，幫你省到最多。',
        category: '稅務優化',
        categoryColor: 'bg-amber-500',
        date: '2025.04.01',
        readTime: '6 min read',
        icon: <HelpCircle className="w-5 h-5" />,
        slug: '#'
    },
];

// ========== 理財商品推薦 ==========
const PRODUCTS = [
    {
        name: '高股息 ETF',
        example: '0056 / 00878',
        description: '每年配息 5-7%，適合追求現金流的投資人',
        risk: '中低',
        riskColor: 'text-emerald-600 bg-emerald-50',
    },
    {
        name: '市值型 ETF',
        example: '0050 / 006208',
        description: '追蹤大盤，長期年化報酬約 8-10%',
        risk: '中',
        riskColor: 'text-blue-600 bg-blue-50',
    },
    {
        name: '美股 ETF',
        example: 'VTI / VOO',
        description: '一籃子美國企業，分散風險、長期成長',
        risk: '中高',
        riskColor: 'text-amber-600 bg-amber-50',
    },
];

// ========== 保險清單 ==========
const INSURANCE_TYPES = [
    { name: '定期壽險', purpose: '家庭責任保障', priority: '必備', icon: '🛡️' },
    { name: '實支實付', purpose: '醫療自費項目', priority: '必備', icon: '🏥' },
    { name: '重大傷病', purpose: '癌症/重症理賠', priority: '建議', icon: '💊' },
    { name: '意外險', purpose: '意外傷害保障', priority: '建議', icon: '🚗' },
    { name: '失能險', purpose: '長期照護需求', priority: '進階', icon: '♿' },
];

export default function ArticlesPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group transition-all">
                        <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 shadow-sm group-hover:border-brand-primary group-hover:text-brand-primary transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-slate-600 group-hover:text-brand-primary">首頁</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black text-xs shadow-glow">T</div>
                        <span className="font-black text-slate-900 tracking-tighter">TaiCalc <span className="text-brand-primary">Insight</span></span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        <BookOpen className="w-4 h-4" />
                        <span>Financial Knowledge Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        從現在 <span className="text-brand-primary">走向</span> 美好未來
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        保險、理財、退休規劃一站式知識庫。TaiCalc 幫你分析過去、掌握現在、規劃未來。
                    </p>
                </div>

                {/* Quick Navigation */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {['全部', '保險知識', '理財商品', '退休規劃', '稅務優化'].map((tag) => (
                        <button
                            key={tag}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${tag === '全部'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-primary'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Featured Articles */}
                <section className="mb-16">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">🔥 精選文章</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {ARTICLES.filter(a => a.featured).map((article) => (
                            <article key={article.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-brand-primary/30 transition-all group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full -z-10 group-hover:from-brand-primary/5 transition-all" />
                                <div className={`inline-flex items-center space-x-1 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${article.categoryColor} mb-4`}>
                                    {article.icon}
                                    <span>{article.category}</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-primary transition-colors leading-tight mb-2">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-2">{article.excerpt}</p>
                                <div className="mt-4 text-xs text-slate-400">{article.date} · {article.readTime}</div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Insurance Section */}
                <section className="mb-16 bg-gradient-to-br from-rose-50 to-pink-50 rounded-[2.5rem] p-8 md:p-10">
                    <div className="flex items-center space-x-3 mb-6">
                        <Heart className="w-6 h-6 text-rose-500" />
                        <h2 className="text-2xl font-black text-slate-900">保險規劃入門</h2>
                    </div>
                    <p className="text-slate-600 mb-6">不知道該買什麼險？這張表幫你快速掌握優先順序。</p>
                    <div className="grid md:grid-cols-5 gap-4">
                        {INSURANCE_TYPES.map((ins) => (
                            <div key={ins.name} className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all">
                                <div className="text-3xl mb-2">{ins.icon}</div>
                                <div className="font-bold text-slate-800">{ins.name}</div>
                                <div className="text-xs text-slate-500 mb-2">{ins.purpose}</div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ins.priority === '必備' ? 'bg-rose-100 text-rose-600' :
                                    ins.priority === '建議' ? 'bg-amber-100 text-amber-600' :
                                        'bg-slate-100 text-slate-500'
                                    }`}>
                                    {ins.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <button className="inline-flex items-center space-x-2 px-6 py-3 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all">
                            <Shield className="w-4 h-4" />
                            <span>免費保險健診</span>
                        </button>
                    </div>
                </section>

                {/* Investment Products */}
                <section className="mb-16">
                    <div className="flex items-center space-x-3 mb-6">
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                        <h2 className="text-2xl font-black text-slate-900">理財商品比較</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {PRODUCTS.map((product) => (
                            <div key={product.name} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="font-black text-lg text-slate-900">{product.name}</div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${product.riskColor}`}>
                                        風險：{product.risk}
                                    </span>
                                </div>
                                <div className="text-sm text-brand-primary font-bold mb-2">{product.example}</div>
                                <p className="text-sm text-slate-500">{product.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* All Articles */}
                <section className="mb-16">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">📚 所有文章</h2>
                    <div className="grid gap-4">
                        {ARTICLES.map((article) => (
                            <article key={article.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-brand-primary/20 transition-all flex items-center gap-4 cursor-pointer group">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${article.categoryColor}`}>
                                    {article.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors truncate">{article.title}</h3>
                                    <div className="text-xs text-slate-400">{article.category} · {article.date}</div>
                                </div>
                                <ArrowLeft className="w-5 h-5 text-slate-300 rotate-180 group-hover:text-brand-primary transition-colors flex-shrink-0" />
                            </article>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mb-16">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                        <div className="relative z-10">
                            <Target className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-3xl font-black text-slate-900 mb-3">開始規劃你的未來</h3>
                            <p className="text-slate-500 mb-8 max-w-xl mx-auto">使用 TaiCalc 計算器，3 分鐘算出你的退休目標、薪資配置與稅務優化方案。</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link href="/retirement" className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>退休規劃</span>
                                </Link>
                                <Link href="/salary" className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all">
                                    <span>薪資戰略</span>
                                </Link>
                                <Link href="/mortgage" className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all">
                                    <span>房貸佈局</span>
                                </Link>
                                <Link href="/tax" className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all">
                                    <span>稅務優化</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
