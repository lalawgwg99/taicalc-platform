'use client';

import { useState } from 'react';
import CalculatorWrapper from '@/components/CalculatorWrapper';
import { formatCurrency } from '@/lib/utils';
import { analyzeSalary } from '@/lib/calculations';

export default function SalaryCalculatorPage() {
    const [salary, setSalary] = useState<number>(40000);
    const result = analyzeSalary(salary);

    return (
        <CalculatorWrapper
            title="薪資試算器"
            description="計算月薪的實際收入、勞健保、勞退與年度所得稅"
        >
            {/* 左側：輸入區 */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 rounded-taicalc shadow-sm border border-slate-200">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        月薪（元）
                    </label>
                    <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                        placeholder="40000"
                    />
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-taicalc border border-blue-200">
                    <h3 className="font-semibold text-brand-primary mb-2 flex items-center gap-2">
                        💡 說明
                    </h3>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• 勞保個人負擔 20%</li>
                        <li>• 健保個人負擔 30%</li>
                        <li>• 勞退雇主最低提撥 6%</li>
                    </ul>
                </div>
            </div>

            {/* 右側：結果區 */}
            <div className="lg:col-span-7 space-y-4">
                {/* 月薪摘要 */}
                <div className="bg-gradient-to-br from-brand-secondary to-blue-600 text-white p-6 rounded-taicalc shadow-lg">
                    <p className="text-sm opacity-90 mb-1">實領月薪</p>
                    <p className="text-4xl font-bold">
                        NT$ {formatCurrency(result.monthly.takeHome)}
                    </p>
                    <p className="text-sm opacity-75 mt-2">
                        薪資 {formatCurrency(result.monthly.gross)} - 勞健保 {formatCurrency(result.monthly.insurance)}
                    </p>
                </div>

                {/* 詳細數據 */}
                <div className="bg-white p-6 rounded-taicalc shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-brand-primary mb-4">月度明細</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <DataItem label="勞健保扣除" value={result.monthly.insurance} />
                        <DataItem label="雇主勞退提撥" value={result.monthly.pension} accent />
                    </div>
                </div>

                {/* 年度數據 */}
                <div className="bg-white p-6 rounded-taicalc shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-brand-primary mb-4">年度摘要</h3>
                    <div className="space-y-3">
                        <DataRow label="年收入" value={result.annual.gross} />
                        <DataRow label="年度勞健保" value={result.annual.insurance} negative />
                        <DataRow label="年度所得稅" value={result.annual.tax} negative />
                        <div className="border-t border-slate-200 pt-3 mt-3">
                            <DataRow label="稅後年收入" value={result.annual.net} highlight />
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorWrapper>
    );
}

// 小型數據項元件
function DataItem({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
    return (
        <div className={`p-3 rounded-lg ${accent ? 'bg-green-50 border border-green-200' : 'bg-slate-50'}`}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-lg font-semibold ${accent ? 'text-brand-accent' : 'text-slate-700'}`}>
                {formatCurrency(value)}
            </p>
        </div>
    );
}

// 數據行元件
function DataRow({ label, value, negative = false, highlight = false }: {
    label: string;
    value: number;
    negative?: boolean;
    highlight?: boolean;
}) {
    return (
        <div className="flex justify-between items-center">
            <span className={`text-sm ${highlight ? 'font-semibold text-brand-primary' : 'text-slate-600'}`}>
                {label}
            </span>
            <span className={`font-mono font-semibold ${highlight ? 'text-brand-accent text-lg' :
                    negative ? 'text-red-600' : 'text-slate-700'
                }`}>
                {negative && '-'} {formatCurrency(value)}
            </span>
        </div>
    );
}
