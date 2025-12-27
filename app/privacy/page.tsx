import Link from 'next/link';
import { ChevronLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-brand-background">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center">
                    <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-brand-primary">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-bold">返回首頁</span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-8 h-8 text-brand-primary" />
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900">隱私戰略</h1>
                    </div>
                    <p className="text-slate-500">最後更新：2025 年 1 月 1 日</p>
                </header>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">我們如何保護您的數據</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            TaiCalc（數策）致力於保護您的隱私。我們採用業界標準的安全措施來保護您的個人資訊。
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">我們收集的資訊</h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-600">
                            <li>計算器輸入數據（僅用於 AI 分析，不會永久儲存）</li>
                            <li>Email 地址（若您選擇訂閱）</li>
                            <li>使用分析數據（透過 Google Analytics 4，匿名收集）</li>
                            <li>Cookie 與瀏覽器本地儲存（用於改善使用體驗）</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">我們如何使用資訊</h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-600">
                            <li>提供個人化的財務分析與建議</li>
                            <li>發送您訂閱的電子報與財務洞察（可隨時取消訂閱）</li>
                            <li>改善網站功能與使用者體驗</li>
                            <li>統計分析與趨勢研究（完全匿名）</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">資料安全</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            我們採用 HTTPS 加密傳輸、Cloudflare 安全防護、以及業界標準的資料加密技術來保護您的資訊。
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">第三方服務</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            我們使用以下第三方服務：
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600">
                            <li>Google Analytics 4（網站分析）</li>
                            <li>Google Gemini AI（財務分析）</li>
                            <li>Cloudflare（CDN 與安全服務）</li>
                            <li>Email 服務商（電子報發送）</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">您的權利</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            您有權：
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600">
                            <li>隨時取消 Email 訂閱</li>
                            <li>要求刪除您的個人資料</li>
                            <li>查詢我們持有的您的資料</li>
                            <li>選擇退出 Cookie 追蹤</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">聯絡我們</h2>
                        <p className="text-slate-600 leading-relaxed">
                            如有任何隱私相關問題，請聯絡：<br />
                            <a href="mailto:privacy@taicalc.com" className="text-brand-primary hover:underline">
                                privacy@taicalc.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
