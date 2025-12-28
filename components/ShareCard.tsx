'use client';

import React from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareCardProps {
    title: string;
    mainValue: string;
    mainLabel: string;
    subValues?: Array<{ label: string; value: string }>;
    insight?: string;
}

export default function ShareCard({
    title,
    mainValue,
    mainLabel,
    subValues = [],
    insight,
}: ShareCardProps) {
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
            });

            const link = document.createElement('a');
            link.download = `TaiCalc-${title}-${new Date().getTime()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('Failed to generate image:', error);
        }
    };

    return (
        <div className="space-y-4">
            {/* 可視化卡片 */}
            <div
                ref={cardRef}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl w-full max-w-[600px] mx-auto"
            >
                {/* Logo */}
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center text-blue-500 font-black text-sm sm:text-base">
                        T
                    </div>
                    <span className="text-lg sm:text-xl font-black">TaiCalc 數策</span>
                </div>

                {/* 標題 */}
                <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">{title}</h3>

                {/* 主要數字 */}
                <div className="mb-4 sm:mb-6">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-1 sm:mb-2 truncate">{mainValue}</div>
                    <div className="text-sm sm:text-lg opacity-90">{mainLabel}</div>
                </div>

                {/* 次要數據 */}
                {subValues.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        {subValues.map((item, idx) => (
                            <div key={idx} className="bg-white/10 rounded-xl p-2 sm:p-3">
                                <div className="text-[10px] sm:text-sm opacity-80 truncate">{item.label}</div>
                                <div className="text-base sm:text-xl font-bold truncate">{item.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* AI 洞察 */}
                {insight && (
                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed">
                        💡 {insight}
                    </div>
                )}
            </div>

            {/* 下載按鈕 */}
            <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all active:scale-95"
            >
                <Download className="w-5 h-5" />
                下載分享卡片
            </button>
        </div>
    );
}
