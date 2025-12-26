import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TaiCalc 台算 — 把錢算清楚，再做決定',
  description: '台灣在地化決策工具箱，包含薪資、稅務、貸款、投資等計算工具。',
  keywords: ['薪資計算', '所得稅計算', '房貸試算', '台灣稅務'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="antialiased bg-slate-50">{children}</body>
    </html>
  )
}
