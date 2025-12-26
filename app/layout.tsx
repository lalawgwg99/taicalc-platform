import type { Metadata } from 'next';
import { Inter, Noto_Sans_TC, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansTC = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700', '900'], variable: '--font-noto-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'TaiCalc 台算 — 2025 決策級薪資試算',
  description: '全台最精準的薪資計算器，整合勞健保分級表、逆向談薪與資金流向視覺化分析。',
  keywords: ['薪資計算', '所得稅計算', '勞健保分級表', '實領薪資', '逆向推算'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${notoSansTC.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-brand-background text-brand-text-primary overflow-x-hidden selection:bg-brand-primary/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
