/**
 * 統一格式化工具
 * 全站金額、數字、百分比顯示的一致性來源
 */

export function formatCurrencyTWD(value: unknown): string {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n)) return '—';
    // 台灣習慣：四捨五入到整數
    const rounded = Math.round(n);
    return rounded.toLocaleString('zh-Hant-TW');
}

export function formatNumber(value: unknown, digits = 0): string {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString('zh-Hant-TW', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

// 注意：這裡假設 percent 輸入是「百分比數值」（例如 6 表示 6%）
export function formatPercent(value: unknown, digits = 2): string {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n)) return '—';
    return `${formatNumber(n, digits)}%`;
}

export type FormatKind = 'currencyTWD' | 'percent' | 'number' | 'integer' | 'text';

export function formatByKind(value: unknown, kind?: FormatKind): string {
    switch (kind) {
        case 'currencyTWD':
            return formatCurrencyTWD(value);
        case 'percent':
            return formatPercent(value);
        case 'integer':
            return Number.isFinite(Number(value)) ? `${Math.trunc(Number(value)).toLocaleString('zh-Hant-TW')}` : '—';
        case 'number':
            return formatNumber(value, 2);
        case 'text':
        default:
            return value == null ? '—' : String(value);
    }
}
