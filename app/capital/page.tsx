'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Target, Banknote, Flag } from 'lucide-react';
import Link from 'next/link';

const tools = [
    {
        id: 'capital.growth',
        name: '資本成長模擬',
        desc: '計算複利效應，預測資產隨時間的增長曲線。',
        icon: TrendingUp,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        id: 'capital.fire',
        name: 'FIRE 財務自由',
        desc: '計算距離財務自由還需要多少資金與時間。',
        icon: Flame,
        color: 'text-orange-600',
        bg: 'bg-orange-50'
    },
    {
        id: 'capital.goalReverse',
        name: '目標反推計算',
        desc: '設定財務目標，反推每月需要儲蓄或投資多少。',
        icon: Target,
        color: 'text-red-600',
        bg: 'bg-red-50'
    },
    {
        id: 'capital.passiveIncome',
        name: '被動收入計算',
        desc: '評估不同資產配置下的被動收入現金流。',
        icon: Banknote,
        color: 'text-green-600',
        bg: 'bg-green-50'
    },
    {
        id: 'capital.milestones',
        name: '財富里程碑',
        desc: '預測何時能達到第一桶金、千萬資產等里程碑。',
        icon: Flag,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    }
];

export default function CapitalPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-slate-900 mb-4">資本增長實驗室</h1>
                    <p className="text-slate-600 text-lg">選擇合適的工具，規劃您的財富增值藍圖。</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <Link href={`/calculators/${tool.id}`} key={tool.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 h-full group"
                            >
                                <div className={`w-12 h-12 ${tool.bg} ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <tool.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.name}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{tool.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
