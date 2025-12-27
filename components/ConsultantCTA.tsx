'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';

interface ConsultantCTAProps {
    source?: string;
    variant?: 'inline' | 'floating' | 'card';
}

export function ConsultantCTA({ source = 'unknown', variant = 'card' }: ConsultantCTAProps) {
    const handleClick = () => {
        // TODO: 整合 GA4 追蹤
        console.log(`Consultant CTA clicked from: ${source}`);
    };

    if (variant === 'floating') {
        return (
            <div className="fixed bottom-6 right-6 z-50 print:hidden">
                <Link
                    href="/contact"
                    onClick={handleClick}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-primary to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-bold text-sm animate-pulse hover:animate-none"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden md:inline">免費諮詢</span>
                </Link>
            </div>
        );
    }

    if (variant === 'inline') {
        return (
            <Link
                href="/contact"
                onClick={handleClick}
                className="inline-flex items-center gap-2 text-brand-primary font-bold hover:underline"
            >
                <span>需要專業建議？聯繫顧問</span>
                <ArrowRight className="w-4 h-4" />
            </Link>
        );
    }

    // Default: card variant
    return (
        <section className="glass-card rounded-2xl p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">需要更專業的分析？</h3>
                    <p className="text-slate-300 text-sm">
                        我們的財務顧問團隊可以為您提供個人化建議
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <a
                        href="tel:+886912345678"
                        onClick={handleClick}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all"
                    >
                        <Phone className="w-4 h-4" />
                        <span>電話諮詢</span>
                    </a>
                    <a
                        href="mailto:contact@taicalc.com"
                        onClick={handleClick}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
                    >
                        <Mail className="w-4 h-4" />
                        <span>Email 預約</span>
                    </a>
                </div>
            </div>
        </section>
    );
}

// 簡化版 CTA 橫幅
export function ConsultantBanner() {
    return (
        <div className="bg-gradient-to-r from-brand-primary to-blue-600 text-white p-4 md:p-6 rounded-2xl text-center">
            <p className="font-bold mb-2">📞 需要專人協助？</p>
            <p className="text-sm text-blue-100 mb-4">免費 15 分鐘電話諮詢，解答您的財務疑問</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a
                    href="https://calendly.com/taicalc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-white text-brand-primary rounded-lg font-bold hover:bg-blue-50 transition-all text-sm"
                >
                    <MessageCircle className="w-4 h-4" />
                    預約諮詢
                </a>
            </div>
        </div>
    );
}
