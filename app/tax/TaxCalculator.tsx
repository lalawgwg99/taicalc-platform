'use client';

import { useState, useCallback } from 'react';
import { calculateTax, TaxInput } from '@/features/tax/logic';
import { InternalLinkSystem, Breadcrumb, SocialShareButtons } from '@/components/seo';

export function TaxCalculator() {
    const [income, setIncome] = useState(1000000);
    const [isMarried, setIsMarried] = useState(false);
    const [spouseIncome, setSpouseIncome] = useState(0);
    const [children, setChildren] = useState(0);
    const [result, setResult] = useState<number | null>(null);

    const handleCalculate = useCallback(() => {
        const input: TaxInput = { income, isMarried, spouseIncome, children };
        setResult(calculateTax(input));
    }, [income, isMarried, spouseIncome, children]);

    // 麵包屑導航數據
    const breadcrumbItems = [
        { label: '首頁', href: '/' },
        { label: '計算工具', href: '/tools' },
        { label: '所得稅計算器' }
    ];

    // 分享數據
    const shareData = {
        url: typeof window !== 'undefined' ? window.location.href : 'https://taicalc.com/tax',
        title: '所得稅計算器 - 2025年稅率級距 | TaiCalc',
        description: result !== null 
            ? `年收入 NT$ ${income.toLocaleString()}，預估應繳稅額 NT$ ${result.toLocaleString()}` 
            : '2025年所得稅試算，支援單身、已婚、扶養親屬等不同情況。'
    };

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            {/* 麵包屑導航 */}
            <Breadcrumb items={breadcrumbItems} className="mb-6" />
            
            <div className="glass-panel rounded-3xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">所得稅計算</h1>
                <p className="text-slate-500 mb-8">2025 年所得稅試算</p>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            年收入 (NT$)
                        </label>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            撫養子女數
                        </label>
                        <input
                            type="number"
                            value={children}
                            onChange={(e) => setChildren(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isMarried}
                            onChange={(e) => setIsMarried(e.target.checked)}
                            className="w-5 h-5 rounded accent-indigo-500"
                        />
                        <span className="text-slate-700">已婚</span>
                    </label>
                </div>

                {isMarried && (
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            配偶年收入 (NT$)
                        </label>
                        <input
                            type="number"
                            value={spouseIncome}
                            onChange={(e) => setSpouseIncome(Number(e.target.value))}
                            className="glass-input w-full px-4 py-3 rounded-xl text-lg"
                        />
                    </div>
                )}

                <button
                    onClick={handleCalculate}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-semibold"
                >
                    計算
                </button>

                {result !== null && (
                    <>
                        <div className="mt-8">
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <p className="text-slate-500 mb-2">預估應繳稅額</p>
                                <p className="text-4xl font-bold font-mono text-gradient-primary">
                                    NT$ {result.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* 社交媒體分享 */}
                        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                            <h4 className="font-medium text-slate-700 mb-3">分享計算結果</h4>
                            <SocialShareButtons
                                url={shareData.url}
                                title={shareData.title}
                                description={shareData.description}
                            />
                        </div>
                    </>
                )}

                {/* 相關計算工具推薦 */}
                <InternalLinkSystem
                    currentCalculator="tax"
                    className="mt-8"
                    maxLinks={3}
                    showDescription={true}
                />
            </div>
        </div>
    );
}