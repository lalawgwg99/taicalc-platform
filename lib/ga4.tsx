'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// GA4 Measurement ID - 需要在 .env.local 設定
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// gtag 函數類型定義
declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
        dataLayer: unknown[];
    }
}

// 初始化 gtag
export const initGA = () => {
    if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

    // 建立 dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
    });
};

// 追蹤頁面瀏覽
export const trackPageView = (url: string) => {
    if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
    });
};

// 追蹤自定義事件
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};

// 預設事件追蹤函數
export const GA_EVENTS = {
    // 計算器互動
    calculatorUsed: (calculator: string) => trackEvent('calculator_used', 'engagement', calculator),

    // 報表下載
    reportDownloaded: (calculator: string) => trackEvent('report_downloaded', 'conversion', calculator),

    // AI 分析
    aiAnalysisRequested: (calculator: string) => trackEvent('ai_analysis_requested', 'engagement', calculator),

    // 頁面滾動深度
    scrollDepth: (depth: number, page: string) => trackEvent('scroll_depth', 'engagement', page, depth),

    // 顧問 CTA 點擊
    consultantCTAClicked: (source: string) => trackEvent('consultant_cta_clicked', 'conversion', source),

    // 延伸閱讀點擊
    relatedPageClicked: (from: string, to: string) => trackEvent('related_page_clicked', 'navigation', `${from} -> ${to}`),

    // 快速情境使用
    scenarioUsed: (scenario: string, calculator: string) => trackEvent('scenario_used', 'engagement', `${calculator}: ${scenario}`),
};

// GA4 頁面追蹤組件
function GATrackerInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
            trackPageView(url);
        }
    }, [pathname, searchParams]);

    return null;
}

// GA4 Script 組件
export function GoogleAnalytics() {
    if (!GA_MEASUREMENT_ID) return null;

    return (
        <>
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
                id="google-analytics"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    );
}

// 頁面追蹤組件（包裝 Suspense）
export function GATracker() {
    return (
        <Suspense fallback={null}>
            <GATrackerInner />
        </Suspense>
    );
}
