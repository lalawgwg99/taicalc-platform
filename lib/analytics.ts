/**
 * TaiCalc Analytics 事件追蹤
 * 支援 GA4 和 Cloudflare Web Analytics
 */

'use client';

// 事件類型定義
export type AnalyticsEvent =
    | 'calculator_view'
    | 'calculator_submit'
    | 'scenario_view'
    | 'share_export_click'
    | 'pro_compare_add'
    | 'pro_compare_submit'
    | 'pro_export'
    | 'cta_click';

interface EventParams {
    calculator?: string;
    scenario?: string;
    value?: number;
    label?: string;
    [key: string]: any;
}

/**
 * 發送 GA4 事件
 */
function sendGA4Event(eventName: string, params: EventParams = {}) {
    if (typeof window === 'undefined') return;

    const gtag = (window as any).gtag;
    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
}

/**
 * 發送 Cloudflare 自訂事件（透過 Beacon API）
 * 注意：CF Analytics 本身不支援自訂事件，這裡只做 console log
 * 如需完整事件追蹤，建議使用 GA4 或 PostHog
 */
function logEvent(eventName: string, params: EventParams = {}) {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${eventName}`, params);
    }
}

/**
 * 追蹤事件
 */
export function trackEvent(event: AnalyticsEvent, params: EventParams = {}) {
    // GA4
    sendGA4Event(event, params);

    // 開發環境 log
    logEvent(event, params);
}

/**
 * 追蹤計算器檢視
 */
export function trackCalculatorView(calculator: 'salary' | 'mortgage' | 'tax' | 'capital') {
    trackEvent('calculator_view', { calculator });
}

/**
 * 追蹤計算器提交
 */
export function trackCalculatorSubmit(calculator: string, params: EventParams = {}) {
    trackEvent('calculator_submit', { calculator, ...params });
}

/**
 * 追蹤情境頁檢視
 */
export function trackScenarioView(scenario: string) {
    trackEvent('scenario_view', { scenario });
}

/**
 * 追蹤分享/匯出點擊
 */
export function trackShareExport(type: 'copy_link' | 'native_share' | 'download') {
    trackEvent('share_export_click', { type });
}

/**
 * 追蹤 Pro 功能使用
 */
export function trackProUsage(action: 'add_plan' | 'compare' | 'export') {
    trackEvent(`pro_${action}` as AnalyticsEvent, {});
}

/**
 * 追蹤 CTA 點擊
 */
export function trackCTA(label: string, destination?: string) {
    trackEvent('cta_click', { label, destination });
}
