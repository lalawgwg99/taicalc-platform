import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-4 py-16">
                {/* Hero Section */}
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-brand-primary mb-4">
                        TaiCalc <span className="text-brand-secondary">台算</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-2">把錢算清楚，再做決定</p>
                    <p className="text-sm text-slate-500">台灣在地化決策工具箱</p>
                </header>

                {/* Tools Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <ToolCard
                        title="💰 薪資試算器"
                        description="計算實領薪資、勞健保、勞退與所得稅"
                        href="/salary"
                        available
                    />
                    <ToolCard
                        title="🏠 房貸試算器"
                        description="計算每月還款金額與總利息"
                        href="/mortgage"
                        available={false}
                    />
                    <ToolCard
                        title="📊 所得稅計算器"
                        description="精確計算年度所得稅負"
                        href="/tax"
                        available={false}
                    />
                    <ToolCard
                        title="💹 投資報酬計算"
                        description="複利計算與投資目標規劃"
                        href="/investment"
                        available={false}
                    />
                </div>

                {/* Features */}
                <div className="bg-white rounded-taicalc shadow-md p-8 border border-slate-200">
                    <h2 className="text-2xl font-bold text-brand-primary mb-6 text-center">
                        為何選擇 TaiCalc？
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Feature
                            icon="🇹🇼"
                            title="台灣在地化"
                            description="符合台灣現行法規，數據即時更新"
                        />
                        <Feature
                            icon="🎯"
                            title="精準計算"
                            description="採用官方公式，計算結果準確可靠"
                        />
                        <Feature
                            icon="📱"
                            title="簡單易用"
                            description="直覺介面設計，輸入即得結果"
                        />
                    </div>
                </div>

                {/* Footer */}
                <footer className="text-center mt-12 text-sm text-slate-500">
                    <p>© 2024 TaiCalc. 本工具僅供參考，實際金額以政府機關公告為準。</p>
                </footer>
            </div>
        </div>
    );
}

function ToolCard({ title, description, href, available }: {
    title: string;
    description: string;
    href: string;
    available: boolean;
}) {
    const content = (
        <div className={`
      bg-white rounded-taicalc p-6 border-2 transition-all
      ${available
                ? 'border-slate-200 hover:border-brand-secondary hover:shadow-lg cursor-pointer'
                : 'border-slate-100 opacity-60 cursor-not-allowed'
            }
    `}>
            <h3 className="text-xl font-semibold text-brand-primary mb-2">{title}</h3>
            <p className="text-slate-600 text-sm mb-3">{description}</p>
            {available ? (
                <span className="text-brand-secondary text-sm font-medium">
                    開始使用 →
                </span>
            ) : (
                <span className="text-slate-400 text-xs">即將推出</span>
            )}
        </div>
    );

    return available ? <Link href={href}>{content}</Link> : content;
}

function Feature({ icon, title, description }: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="text-center">
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="font-semibold text-brand-primary mb-2">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
        </div>
    );
}
