import Link from 'next/link';
import { ArrowLeft, BookOpen, TrendingUp, Shield, HelpCircle } from 'lucide-react';

const ARTICLES = [
    {
        id: 'labor-insurance-2025',
        title: '2025 勞保費率調漲懶人包：你的薪水會少多少？',
        excerpt: '勞動部宣布 2025 年最新勞保費率調整方案，解析勞工與雇主的負擔變化，以及對退休金的影響。',
        category: '勞工權益',
        date: '2025.01.15',
        readTime: '5 min read',
        icon: <Shield className="w-5 h-5" />,
        slug: '#'
    },
    {
        id: 'fire-inflation-guide',
        title: '通膨時代的 FIRE 攻略：為什麼傳統 4% 法則失效了？',
        excerpt: '物價飛漲下，傳統的「25倍年支出」法則可能導致退休金提早耗盡。本文提供動態提領率與抗通膨資產配置策略。',
        category: '資本決策',
        date: '2025.02.01',
        readTime: '8 min read',
        icon: <TrendingUp className="w-5 h-5" />,
        slug: '#'
    },
    {
        id: 'new-house-tax-2025',
        title: '2025 房地合一稅 3.0？新制重點一次看懂',
        excerpt: '針對預售屋與短期交易的稅制再升級，試算新制下的稅額差異，幫助置產族群提前佈局。',
        category: '稅務優化',
        date: '2025.03.10',
        readTime: '6 min read',
        icon: <HelpCircle className="w-5 h-5" />,
        slug: '#'
    }
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

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        <BookOpen className="w-4 h-4" />
                        <span>Financial Knowledge Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        財務決策 <span className="text-brand-primary">知識庫</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        深入淺出的金融分析與政策解讀，協助您在變動的經濟環境中做出最佳決策。
                    </p>
                </div>

                <div className="grid gap-6">
                    {ARTICLES.map((article) => (
                        <article key={article.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 hover:shadow-xl hover:border-brand-primary/30 transition-all group cursor-pointer relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full -z-10 group-hover:from-brand-primary/5 transition-all" />

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest">
                                        <span className="text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-md flex items-center gap-1">
                                            {article.icon}
                                            {article.category}
                                        </span>
                                        <span className="text-slate-400">{article.date}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-400">{article.readTime}</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 group-hover:text-brand-primary transition-colors leading-tight">
                                        {article.title}
                                    </h2>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        {article.excerpt}
                                    </p>
                                </div>
                                <div className="flex items-center justify-end md:justify-center">
                                    <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-white transition-all shadow-sm">
                                        <ArrowLeft className="w-5 h-5 rotate-180" />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Lead Gen Banner */}
                <div className="mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <h3 className="text-3xl font-black">需要更進階的財務規劃？</h3>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            預約 TaiCalc 認證財務顧問，為您量身打造專屬的資產配置方案。
                        </p>
                        <button className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-primary/90 transition-all shadow-glow hover:shadow-glow-lg transform hover:-translate-y-1">
                            預約專業諮詢
                        </button>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>
            </main>
        </div>
    );
}
