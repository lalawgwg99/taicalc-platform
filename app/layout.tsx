import type { Metadata } from 'next';
import { Inter, Noto_Sans_TC, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SchemaOrg from '@/components/SEO/SchemaOrg';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansTC = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700', '900'], variable: '--font-noto-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'TaiCalc 數策 — 2025 薪資戰略決策系統',
  description: '全台最精準的薪資戰略工具。整合大數據分級查表、逆向談薪與資金流向視覺化分析，助您做出最佳財務決策。',
  keywords: ['薪資計算', '所得稅計算', '房貸試算', '複利計算', '2025基本工資', '新青安房貸', '報稅試算', '勞健保試算'],
  authors: [{ name: 'TaiCalc 數策' }],
  creator: 'TaiCalc',
  publisher: 'TaiCalc 數策',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://taicalc.com',
    siteName: 'TaiCalc 數策',
    title: 'TaiCalc 數策 — 2025 財務決策系統',
    description: '薪資計算、所得稅試算、房貸評估、複利增長，一站式財務決策工具。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaiCalc 數策',
    description: '把錢算清楚，再做決定。',
  },
};

// 全站 Schema.org 結構化數據
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TaiCalc 數策',
  url: 'https://taicalc.com',
  logo: 'https://taicalc.com/logo.png',
  description: '台灣領先的財務決策計算平台，提供薪資、稅務、房貸、投資等精準試算工具。',
  sameAs: [],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TaiCalc 數策',
  url: 'https://taicalc.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://taicalc.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${notoSansTC.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-brand-background text-brand-text-primary overflow-x-hidden selection:bg-brand-primary/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
