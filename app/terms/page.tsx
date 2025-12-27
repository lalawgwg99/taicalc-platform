import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
                        <FileText className="w-8 h-8 text-brand-primary" />
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900">使用條款</h1>
                    </div>
                    <p className="text-slate-500">最後更新：2025 年 1 月 1 日</p>
                </header>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">服務說明</h2>
                        <p className="text-slate-600 leading-relaxed">
                            TaiCalc（數策）提供線上財務計算工具，包含薪資、稅務、房貸、資本決策等計算器。
                            所有計算結果僅供參考，實際情況請以政府公告法規與專業顧問建議為準。
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">免責聲明</h2>
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                            <p className="text-amber-900 font-medium">
                                重要提醒：本平台提供的戰略數據與計算結果僅供決策參考，不構成任何財務、法律或稅務建議。
                            </p>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-slate-600">
                            <li>計算結果可能因個人情況、法規變動而有所不同</li>
                            <li>稅務、保險費率可能隨政府政策調整</li>
                            <li>房貸利率以實際銀行核定為準</li>
                            <li>投資報酬率為預估值，實際績效可能不同</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">使用規範</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">使用本服務時，您同意：</p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600">
                            <li>不得將計算結果用於商業營利目的（未經授權）</li>
                            <li>不得濫用 AI 分析功能（我們設有使用頻率限制）</li>
                            <li>不得嘗試破解、攻擊或干擾網站運作</li>
                            <li>引用本站數據時應註明出處</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">資料準確性</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            我們盡力確保計算邏輯與資料正確性，並標註資料版本與更新日期。
                            如發現錯誤，歡迎透過 <a href="mailto:contact@taicalc.com" className="text-brand-primary hover:underline">contact@taicalc.com</a> 回報。
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">智慧財產權</h2>
                        <p className="text-slate-600 leading-relaxed">
                            本網站的設計、程式碼、計算邏輯、文字內容等，均受智慧財產權法保護。
                            未經授權，不得複製、修改或用於其他網站。
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">服務變更</h2>
                        <p className="text-slate-600 leading-relaxed">
                            我們保留隨時修改、暫停或終止部分或全部服務的權利，恕不另行通知。
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">適用法律</h2>
                        <p className="text-slate-600 leading-relaxed">
                            本條款適用中華民國法律。如有爭議，以台灣台北地方法院為第一審管轄法院。
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">聯絡我們</h2>
                        <p className="text-slate-600 leading-relaxed">
                            如有任何問題，請聯絡：<br />
                            Email: <a href="mailto:contact@taicalc.com" className="text-brand-primary hover:underline">contact@taicalc.com</a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
