/**
 * TaiCalc 共用元件：免責聲明 + 假設條件
 * 用於所有計算器結果頁面，提升可解釋性與合規性
 */

'use client';

import React from 'react';
import { Info, AlertTriangle, Shield } from 'lucide-react';

interface Assumption {
    label: string;
    value: string;
}

interface DisclaimerProps {
    /** 計算器類型 */
    type: 'salary' | 'mortgage' | 'tax' | 'capital' | 'general';
    /** 使用的假設條件 */
    assumptions?: Assumption[];
    /** 版本資訊 */
    version?: string;
    /** 是否顯示詳細模式 */
    detailed?: boolean;
}

// 各類型的預設假設條件
const DEFAULT_ASSUMPTIONS: Record<string, Assumption[]> = {
    salary: [
        { label: '勞保費率', value: '12%（勞工自付 20%）' },
        { label: '健保費率', value: '5.17%（自付 30%）' },
        { label: '勞退雇提', value: '6%（不從薪資扣）' },
        { label: '投保級距', value: '依月薪對應級距計算' },
    ],
    mortgage: [
        { label: '還款方式', value: '本息平均攤還' },
        { label: '計息方式', value: '月複利' },
        { label: '手續費', value: '未計入' },
        { label: '寬限期', value: '僅付利息，本金不攤還' },
    ],
    tax: [
        { label: '年度', value: '2024/2025 年度' },
        { label: '免稅額', value: 'NT$ 92,000（70歲以上 NT$ 138,000）' },
        { label: '標準扣除額', value: '單身 NT$ 124,000 / 已婚 NT$ 248,000' },
        { label: '薪資扣除額', value: '最高 NT$ 207,000' },
    ],
    capital: [
        { label: '計算方式', value: '月複利滾入' },
        { label: '報酬率', value: '固定年化報酬（實際波動未計入）' },
        { label: '稅務', value: '未計入資本利得稅' },
        { label: '通膨', value: '未計入通膨調整' },
    ],
    general: [],
};

// 各類型的警告訊息
const WARNINGS: Record<string, string[]> = {
    salary: [
        '未包含加班費、獎金、津貼等變動薪資',
        '實際扣款依投保級距，可能與月薪略有差異',
    ],
    mortgage: [
        '未包含房屋稅、地價稅、管理費等持有成本',
        '實際利率依銀行核貸條件為準',
    ],
    tax: [
        '未包含列舉扣除、特別扣除額（如房貸利息、長照、幼兒學前）',
        '未包含扶養親屬、境外所得等情況',
    ],
    capital: [
        '歷史報酬不代表未來績效',
        '實際投資有風險，可能損失本金',
    ],
    general: [],
};

export function Disclaimer({ type, assumptions, version, detailed = false }: DisclaimerProps) {
    const finalAssumptions = assumptions || DEFAULT_ASSUMPTIONS[type] || [];
    const warnings = WARNINGS[type] || [];
    const versionText = version || '2024.12';

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
            {/* 標題 */}
            <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-slate-700">
                    試算說明（版本：{versionText}）
                </span>
            </div>

            {/* 免責聲明 */}
            <p className="text-slate-600 mb-3">
                本工具為試算與規劃用途，結果僅供參考。實際金額依相關機構公告為準。
            </p>

            {/* 假設條件（詳細模式） */}
            {detailed && finalAssumptions.length > 0 && (
                <div className="mb-3">
                    <div className="flex items-center gap-1 mb-2 text-slate-500">
                        <Info className="w-3 h-3" />
                        <span className="text-xs">採用假設</span>
                    </div>
                    <ul className="text-xs text-slate-500 space-y-1 ml-4">
                        {finalAssumptions.map((a, i) => (
                            <li key={i}>
                                <span className="text-slate-600">{a.label}：</span>
                                {a.value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 警告事項 */}
            {warnings.length > 0 && (
                <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="flex items-center gap-1 mb-2 text-amber-600">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs font-medium">未包含項目</span>
                    </div>
                    <ul className="text-xs text-slate-500 space-y-1">
                        {warnings.map((w, i) => (
                            <li key={i}>• {w}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

/**
 * 精簡版免責聲明（用於結果卡片底部）
 */
export function DisclaimerCompact({ type }: { type: DisclaimerProps['type'] }) {
    return (
        <p className="text-xs text-slate-400 text-center mt-4">
            ⚠️ 本試算僅供參考，實際金額依相關機構公告為準
            {type === 'tax' && '（未含列舉扣除、扶養等）'}
            {type === 'capital' && '（不代表未來績效）'}
        </p>
    );
}
