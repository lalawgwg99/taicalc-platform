import type { Metadata } from 'next';
import { Inter, Noto_Sans_TC, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansTC = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700', '900'], variable: '--font-noto-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'TaiCalc 數策 — 2025 薪資戰略決策系統',
  description: '全台最精準的薪資戰略工具。整合大數據分級查表、逆向談薪與資金流向視覺化分析，助您做出最佳財務決策。',
  keywords: ['薪資戰略', '數策', '薪資計算', '逆向談薪', '勞健保分級'],
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
