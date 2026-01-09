'use client';

import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator,
    TrendingUp,
    PieChart as PieChartIcon,
    Info,
    CheckCircle,
    Home,
    Coins,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { ArticleRecommendations } from '@/components/knowledge';
import { InternalLinkSystem, Breadcrumb, SocialShareButtons } from '@/components/seo';

// 動態導入圖表以避免SSR問題
const MortgageDistributionChart = dynamic(
    () => import('@/components/charts/MortgageDistributionChart'),
    { ssr: false, loading: () => <div className="w-full h-72 bg-gray-100 rounded-lg animate-pulse" /> }
);

const RepaymentTimelineChart = dynamic(
    () => import('@/components/charts/RepaymentTimelineChart'),
    { ssr: false, loading: () => <div className="w-full h-72 bg-gray-100 rounded-lg animate-pulse" /> }
);

interface MortgageResult {
    monthlyPayment: number;      // 本息平均攤還金額 (寬限期後)
    gracePeriodPayment: number;  // 寬限期內月付金 (僅利息)
    totalInterest: number;
    totalPayment: number;
    timeline: {
        year: number;
        balance: number;
        paidPrincipal: number;
        paidInterest: number;
    }[];
}

// 本息平均攤還計算
function calculateMortgage(
    totalLoan: number,
    rate: number,
    years: number,
    gracePeriod: number
): MortgageResult {
    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;
    const graceMonths = gracePeriod * 12;

    // 寬限期內：只繳利息
    const gracePeriodPayment = Math.round(totalLoan * monthlyRate);

    // 寬限期後：本息平均攤還
    // 剩餘期數
    const remainingMonths = totalMonths - graceMonths;
    let monthlyPayment = 0;

    if (remainingMonths > 0) {
        monthlyPayment = Math.round(
            totalLoan * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
            (Math.pow(1 + monthlyRate, remainingMonths) - 1)
        );
    }

    let totalInterest = 0;
    let currentBalance = totalLoan;
    const timeline = [];

    // 計算總利息和時間軸
    if (remainingMonths > 0) {
        // 寬限期利息
        totalInterest += gracePeriodPayment * graceMonths;

        // 記錄寬限期時間軸 (每年一筆)
        for (let y = 1; y <= gracePeriod; y++) {
            timeline.push({
                year: y,
                balance: totalLoan,
                paidPrincipal: 0,
                paidInterest: gracePeriodPayment * 12 * y
            });
        }

        // 寬限期後
        // 簡單估算總還款 (精確計算需要逐月跑迴圈)
        const paymentPeriodTotal = monthlyPayment * remainingMonths;
        totalInterest = (gracePeriodPayment * graceMonths) + (paymentPeriodTotal - totalLoan);

        // 生成寬限期後的時間軸 (模擬每年餘額)
        // 僅為視覺化估算，簡化計算以提升效能
        for (let y = 1; y <= years - gracePeriod; y++) {
            const periodMonths = y * 12;
            const PaidPrincipal = totalLoan * ((Math.pow(1 + monthlyRate, periodMonths) - 1) / (Math.pow(1 + monthlyRate, remainingMonths) - 1));
            // 修正餘額計算公式 (近似值 for chart)
            const remainingBalance = totalLoan - PaidPrincipal;

            timeline.push({
                year: y + gracePeriod,
                balance: Math.max(0, Math.round(remainingBalance)),
                paidPrincipal: Math.round(PaidPrincipal),
                paidInterest: 0 // 未詳細計算
            });
        }
    } else {
        // 全是寬限期(異常情況 handled)
        monthlyPayment = gracePeriodPayment;
    }

    const totalPayment = totalLoan + totalInterest;

    return {
        monthlyPayment,
        gracePeriodPayment,
        totalInterest,
        totalPayment,
        timeline
    };
}

export function MortgageCalculator() {
    const [totalLoan, setTotalLoan] = useState(10000000);
    const [rate, setRate] = useState(2.185);
    const [years, setYears] = useState(30);
    const [gracePeriod, setGracePeriod] = useState(0);
    const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'schedule'>('overview');
    const [isCalculating, setIsCalculating] = useState(false);

    // 即時計算
    const result = useMemo(() => {
        if (totalLoan > 0 && years > gracePeriod) {
            return calculateMortgage(totalLoan, rate, years, gracePeriod);
        }
        return null;
    }, [totalLoan, rate, years, gracePeriod]);

    // 應用新青安方案
    const applyNewYouthLoan = () => {
        setTotalLoan(10000000); // 上限1000萬
        setRate(1.775);
        setYears(40);
        setGracePeriod(5);
    };

    // 應用一般房貸
    const applyGeneralLoan = () => {
        setTotalLoan(10000000);
        setRate(2.185);
        setYears(30);
        setGracePeriod(0);
    };

    const breadcrumbItems = [
        { label: '首頁', href: '/' },
        { label: '計算工具', href: '/tools' },
        { label: '房貸試算器' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="container max-w-6xl mx-auto px-4 pt-24 pb-8">
                <Breadcrumb items={breadcrumbItems} className="mb-6" />

                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                            <Home className="w-4 h-4" />
                            支援新青安貸款
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            房貸試算器
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            快速計算每月房貸還款金額、利息總額，支援寬限期與新青安方案試算
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* 左側輸入區 */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Calculator className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">貸款條件</h2>
                            </div>

                            {/* 快速方案按鈕 */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button
                                    onClick={applyNewYouthLoan}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                >
                                    <span className="font-bold text-sm">新青安貸款</span>
                                    <span className="text-xs opacity-70">1.775% / 40年</span>
                                </button>
                                <button
                                    onClick={applyGeneralLoan}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="font-bold text-sm">一般房貸</span>
                                    <span className="text-xs opacity-70">2.185% / 30年</span>
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">貸款總額 (萬)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={totalLoan / 10000}
                                            onChange={(e) => setTotalLoan(Math.max(0, Number(e.target.value) * 10000))}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-semibold"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">萬元</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">年利率 (%)</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={rate}
                                        onChange={(e) => setRate(Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-semibold"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">期限 (年)</label>
                                        <select
                                            value={years}
                                            onChange={(e) => setYears(Number(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            {[10, 15, 20, 25, 30, 35, 40].map(y => (
                                                <option key={y} value={y}>{y}年</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">寬限期 (年)</label>
                                        <select
                                            value={gracePeriod}
                                            onChange={(e) => setGracePeriod(Number(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            {[0, 1, 2, 3, 4, 5].map(y => (
                                                <option key={y} value={y}>{y}年</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* 即時預覽卡片 */}
                            {result && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-200">
                                        <div className="flex items-center gap-2 mb-2 opacity-90">
                                            <Coins className="w-4 h-4" />
                                            <span className="text-sm font-medium">每月還款預估</span>
                                        </div>
                                        <div className="text-3xl font-bold mb-1">
                                            NT$ {result.monthlyPayment.toLocaleString()}
                                        </div>
                                        {gracePeriod > 0 && (
                                            <div className="text-xs bg-white/20 inline-block px-2 py-1 rounded text-white font-medium mt-2">
                                                寬限期內僅需繳 NT$ {result.gracePeriodPayment.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* 右側結果區 */}
                    <div className="lg:col-span-2">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                {/* Tab Navigation */}
                                <div className="flex border-b border-gray-100">
                                    {[
                                        { id: 'overview', label: '結果總覽', icon: CheckCircle },
                                        { id: 'chart', label: '圖表分析', icon: PieChartIcon },
                                        { id: 'schedule', label: '還款明細', icon: Calendar }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <tab.icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6 md:p-8">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'overview' && (
                                            <motion.div
                                                key="overview"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-8"
                                            >
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                                                        <div className="text-sm text-gray-500 mb-2">房屋貸款總額</div>
                                                        <div className="text-2xl font-bold text-gray-900">
                                                            NT$ {totalLoan.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-center p-6 bg-red-50 rounded-2xl">
                                                        <div className="text-sm text-red-600/70 mb-2">預估利息總支出</div>
                                                        <div className="text-2xl font-bold text-red-600">
                                                            NT$ {result.totalInterest.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50 rounded-2xl p-6">
                                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                        <Info className="w-5 h-5 text-blue-600" />
                                                        還款方案摘要
                                                    </h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <div className="text-gray-500 mb-1">貸款年限</div>
                                                            <div className="font-semibold">{years} 年</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-500 mb-1">年利率</div>
                                                            <div className="font-semibold">{rate}%</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-500 mb-1">寬限期</div>
                                                            <div className="font-semibold">{gracePeriod} 年</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-500 mb-1">還款總額</div>
                                                            <div className="font-semibold text-blue-700">
                                                                NT$ {(result.totalPayment / 10000).toFixed(1)} 萬
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'chart' && (
                                            <motion.div
                                                key="chart"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-8"
                                            >
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 mb-4 text-center">本金與利息比例</h4>
                                                        <MortgageDistributionChart
                                                            principal={totalLoan}
                                                            interest={result.totalInterest}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 mb-4 text-center">貸款餘額變化</h4>
                                                        <RepaymentTimelineChart data={result.timeline} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'schedule' && (
                                            <motion.div
                                                key="schedule"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="bg-gray-50 text-gray-600">
                                                            <tr>
                                                                <th className="px-4 py-3 rounded-l-lg">年度</th>
                                                                <th className="px-4 py-3">剩餘本金</th>
                                                                <th className="px-4 py-3 text-right rounded-r-lg">累計償還本金</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {result.timeline.map((item, index) => (
                                                                <tr key={item.year} className="hover:bg-gray-50/50">
                                                                    <td className="px-4 py-3 font-medium">第 {item.year} 年</td>
                                                                    <td className="px-4 py-3 text-gray-600">
                                                                        NT$ {item.balance.toLocaleString()}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right text-gray-900">
                                                                        NT$ {item.paidPrincipal.toLocaleString()}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                    <Home className="w-10 h-10 text-blue-200" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    開始試算您的房貸
                                </h3>
                                <p className="text-gray-500 max-w-sm">
                                    輸入房價總額與貸款條件，我們幫您計算最適合的還款計畫
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 底部內容 */}
                {result && (
                    <div className="mt-12 space-y-8">
                        {/* <ArticleRecommendations
                            calculatorType="mortgage"
                            title="房貸相關知識"
                            maxItems={3}
                            showReason={true}
                        /> */}
                        <InternalLinkSystem
                            currentCalculator="mortgage"
                            className="mt-8"
                            maxLinks={3}
                            showDescription={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}