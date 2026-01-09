import Link from 'next/link';
import { Calculator, Heart } from 'lucide-react';

/**
 * Site Footer Component
 * Displays navigation links, copyright, and branding
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { href: '/salary', label: '薪資計算' },
        { href: '/tax', label: '所得稅' },
        { href: '/mortgage', label: '房貸試算' },
        { href: '/capital', label: '複利計算' },
        { href: '/knowledge', label: '財務知識庫' },
    ];

    const legalLinks = [
        { href: '/privacy', label: '隱私權政策' },
        { href: '/terms', label: '服務條款' },
        { href: '/developers', label: '開發者 API' },
    ];

    return (
        <footer className="bg-white/80 backdrop-blur-md border-t border-slate-100 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 group mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                <Calculator className="w-4 h-4" />
                            </div>
                            <span className="text-lg font-bold text-slate-800">TaiCalc</span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                            專為台灣人設計的財務計算工具。3 分鐘算清楚薪資、房貸、稅務、投資複利，結果清楚一看就懂。
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-4">計算工具</h3>
                        <ul className="space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-4">關於</h3>
                        <ul className="space-y-2">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                        © {currentYear} TaiCalc 數策. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-rose-400" /> in Taiwan
                    </p>
                </div>
            </div>
        </footer>
    );
}
