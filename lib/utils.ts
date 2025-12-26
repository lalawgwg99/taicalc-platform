import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合併 tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 格式化台幣金額 (加入千分位)
 * @param amount 金額數值
 * @returns 格式化後的字串 (e.g., "1,234,567")
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('zh-TW', {
        style: 'decimal',
        maximumFractionDigits: 0,
    }).format(amount);
}
