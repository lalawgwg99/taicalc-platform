import Link from 'next/link';
import { Mail, Shield, FileText } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* 主要內容區 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* 品牌與說明 */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black">T</div>
                            <span className="text-xl font-bold text-white">TaiCalc <span className="text-brand-primary">數策</span></span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            台灣財務決策計算平台<br />
                            精準試算，明智決策
                        </p>
                    </div>

                    {/* 快速連結 */}
                    <div>
                        <h3 className="text-white font-bold mb-4">計算工具</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/salary" className="hover:text-white transition-colors">薪資戰略計算器</Link>
                            </li>
                            <li>
                                <Link href="/tax" className="hover:text-white transition-colors">所得稅精算計算器</Link>
                            </li>
                            <li>
                                <Link href="/mortgage" className="hover:text-white transition-colors">房貸決策計算器</Link>
                            </li>
                            <li>
                                <Link href="/capital" className="hover:text-white transition-colors">資本決策計算器</Link>
                            </li>
                        </ul>
                    </div>

                    {/* 聯絡與政策 */}
                    <div>
                        <h3 className="text-white font-bold mb-4">關於我們</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="mailto:contact@taicalc.com"
                                    className="flex items-center gap-2 hover:text-white transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    聯絡顧問
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="flex items-center gap-2 hover:text-white transition-colors"
                                >
                                    <Shield className="w-4 h-4" />
                                    隱私戰略
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="flex items-center gap-2 hover:text-white transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    使用條款
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 分隔線 */}
                <div className="border-t border-slate-800 pt-6">
                    {/* 免責聲明與版權 */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-slate-500">
                        <p className="leading-relaxed">
                            © {currentYear} 數策 NumStrat. 戰略數據僅供決策參考，實際法規以政府公告為準。
                        </p>
                        <p className="text-slate-600">
                            Made with ❤️ in Taiwan
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
