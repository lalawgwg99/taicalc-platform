import type { Metadata } from 'next';
import { Inter, Noto_Sans_TC, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Footer from '@/components/Footer';
import Navigation from '@/components/shared/Navigation';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Font configuration
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansTC = Noto_Sans_TC({
    subsets: ['latin'],
    weight: ['400', '500', '700', '900'],
    variable: '--font-noto-sans',
});
const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
});

// SEO Metadata
export const metadata: Metadata = {
    title: 'TaiCalc｜3分鐘算清楚：薪資、房貸、稅務、投資複利',
    description:
        '專為台灣人設計的財務計算工具。面試該開多少？自提勞退划算嗎？轉貸省多少？用3分鐘快速試算，結果清楚一看就懂。',
    keywords: [
        '薪資計算',
        '所得稅計算',
        '房貸試算',
        '複利計算',
        '2025基本工資',
        '新青安房貸',
        '報稅試算',
        '勞健保試算',
    ],
    authors: [{ name: 'TaiCalc 數策' }],
    creator: 'TaiCalc',
    publisher: 'TaiCalc 數策',
    robots: 'index, follow',
    openGraph: {
        type: 'website',
        locale: 'zh_TW',
        url: 'https://taicalc.com',
        siteName: 'TaiCalc 數策',
        title: 'TaiCalc｜3分鐘算清楚：薪資、房貸、稅務、投資複利',
        description: '專為台灣人設計的財務計算工具。即時試算，結果清楚一看就懂。',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TaiCalc 數策',
        description: '快速、免費的實用計算工具平台。結果清楚一看就懂。',
    },
};

// Schema.org structured data
const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TaiCalc 數策',
    url: 'https://taicalc.com',
    logo: 'https://taicalc.com/logo.png',
    description: '專為台灣人設計的財務計算工具平台，提供薪資、房貸、稅務、投資等計算器。',
    sameAs: [
        'https://www.facebook.com/taicalc',
        'https://twitter.com/taicalc'
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'zh-TW'
    }
};

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TaiCalc 數策',
    url: 'https://taicalc.com',
    description: '專為台灣人設計的財務計算工具平台',
    inLanguage: 'zh-TW',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://taicalc.com/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string',
    },
};

const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TaiCalc 財務計算器',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'TWD'
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250'
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const cfToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

    return (
        <html
            lang="zh-TW"
            className={`${inter.variable} ${notoSansTC.variable} ${jetbrainsMono.variable}`}
        >
            <head>
                {/* Google Analytics */}
                {gaId && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                            strategy="afterInteractive"
                        />
                        <Script id="ga4-init" strategy="afterInteractive">
                            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { anonymize_ip: true });
              `}
                        </Script>
                    </>
                )}
                {/* Cloudflare Web Analytics */}
                {cfToken && (
                    <Script
                        src="https://static.cloudflareinsights.com/beacon.min.js"
                        data-cf-beacon={`{"token": "${cfToken}"}`}
                        strategy="afterInteractive"
                    />
                )}
                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
                />
            </head>
            <body
                suppressHydrationWarning
                className="font-sans antialiased aurora-bg min-h-screen text-slate-800 selection:bg-indigo-500/30 selection:text-indigo-900"
            >
                <Navigation />
                {children}
                <Footer />
            </body>
        </html>
    );
}
