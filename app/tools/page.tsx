import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: '所有計算器 | TaiCalc',
    description: 'TaiCalc 提供的所有免費線上計算工具，包含成本、利潤、薪資、電費、租屋、退休金等實用計算器。',
};

const tools = [
    // 金錢與決策
    {
        category: '💰 金錢與決策',
        items: [
            { href: '/tools/cost-calculator', title: '成本計算器', desc: '快速計算產品或服務的實際成本' },
            { href: '/tools/profit-calculator', title: '利潤計算器', desc: '計算銷售利潤與利潤率' },
            { href: '/tools/credit-card-calculator', title: '信用卡分期計算器', desc: '銀行不告訴你的真實利息' },
        ],
    },
    // 工作效率
    {
        category: '⏰ 工作效率',
        items: [
            { href: '/tools/work-hours-calculator', title: '工時計算器', desc: '計算上班時數與薪資' },
            { href: '/tools/overtime-calculator', title: '加班費計算器', desc: '依勞基法計算合法加班費' },
            { href: '/tools/delivery-income-calculator', title: '外送收入計算器', desc: '估算外送員日、週、月收入' },
        ],
    },
    // 生活開銷
    {
        category: '🏠 生活開銷',
        items: [
            { href: '/tools/electricity-calculator', title: '電費計算器', desc: '依台電級距試算每月電費' },
            { href: '/tools/rent-cost-calculator', title: '租屋成本計算器', desc: '計算租屋真實每月支出' },
            { href: '/tools/split-calculator', title: '分攤計算器', desc: '快速平分聚餐、合租費用' },
        ],
    },
    // 理財規劃
    {
        category: '📈 理財規劃',
        items: [
            { href: '/tools/percentage-calculator', title: '百分比計算器', desc: '計算百分比、變化率、原值' },
            { href: '/tools/labor-pension-calculator', title: '勞保退休金計算器', desc: '估算退休後每月可領多少' },
            { href: '/mortgage', title: '房貸計算器', desc: '計算每月還款金額與利息' },
            { href: '/capital', title: '複利計算器', desc: '試算複利成長效果' },
        ],
    },
];

export default function ToolsPage() {
    return (
        <div className="container max-w-5xl mx-auto px-4 pt-24 pb-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    所有計算器
                </h1>
                <p className="text-xl text-slate-600">
                    快速、免費、立刻用。選擇你需要的工具。
                </p>
            </div>

            <div className="space-y-10">
                {tools.map((group) => (
                    <div key={group.category}>
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">
                            {group.category}
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {group.items.map((tool) => (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all group"
                                >
                                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-slate-500 mt-2 text-sm">
                                        {tool.desc}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
