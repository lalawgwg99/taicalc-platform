/**
 * HyperGrid 渲染引擎
 * 遞迴解析 JSON 結構並動態生成 React 組件
 */

import React from 'react';
import { UIComponent } from '@/types/schema';
import {
    User, ShoppingCart, Star, Zap, Clock, TrendingUp,
    Home, Package, Heart, Bell, Search, Settings
} from 'lucide-react';
import { clsx } from 'clsx';

// ============ 原子組件庫 ============

const Atoms = {
    // 容器組件：基礎佈局容器
    container: ({ children, className, bg, padding = 'md' }: any) => {
        const paddingMap: Record<string, string> = { sm: 'p-2', md: 'p-4', lg: 'p-6' };
        return (
            <div className={clsx(
                paddingMap[padding] || 'p-4',
                'rounded-lg',
                bg || 'bg-white',
                className
            )}>
                {children}
            </div>
        );
    },

    // Grid 佈局：響應式網格系統
    grid: ({ children, cols = 2, gap = 'md' }: any) => {
        const gapMap: Record<string, string> = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
        return (
            <div className={clsx(
                'grid',
                gapMap[gap] || 'gap-4',
                `grid-cols-1 md:grid-cols-${cols}`
            )}>
                {children}
            </div>
        );
    },

    // 文字組件：通用文字渲染
    text: ({ content, size = 'base', weight = 'normal', color, align = 'left' }: any) => {
        const sizeMap: Record<string, string> = {
            xs: 'text-xs',
            sm: 'text-sm',
            base: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
            '2xl': 'text-2xl',
            '3xl': 'text-3xl'
        };
        const weightMap: Record<string, string> = {
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold'
        };
        const alignMap: Record<string, string> = {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right'
        };

        return (
            <div className={clsx(
                sizeMap[size] || 'text-base',
                weightMap[weight] || 'font-normal',
                alignMap[align] || 'text-left',
                color || 'text-slate-800'
            )}>
                {content}
            </div>
        );
    },

    // 圖片組件：響應式圖片
    image: ({ src, alt, aspect = 'video', fit = 'cover' }: any) => {
        const aspectMap: Record<string, string> = {
            square: 'aspect-square',
            video: 'aspect-video',
            portrait: 'aspect-[3/4]',
            auto: ''
        };

        return (
            <img
                src={src}
                alt={alt}
                className={clsx(
                    'w-full h-full rounded-md',
                    aspectMap[aspect] || 'aspect-video',
                    fit === 'cover' ? 'object-cover' : 'object-contain'
                )}
            />
        );
    },

    // 徽章組件：標籤與狀態指示
    badge: ({ text, color, variant = 'solid' }: any) => {
        const baseColor = color || 'bg-blue-600';

        return (
            <span className={clsx(
                'px-2 py-1 text-xs rounded-full inline-block',
                variant === 'solid'
                    ? `${baseColor} text-white`
                    : `border-2 ${baseColor.replace('bg-', 'border-')} ${baseColor.replace('bg-', 'text-')}`
            )}>
                {text}
            </span>
        );
    },

    // 按鈕組件：互動按鈕
    button: ({ label, variant = 'primary', size = 'md', icon }: any) => {
        const variantMap: Record<string, string> = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700',
            secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
            outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
            ghost: 'text-blue-600 hover:bg-blue-50'
        };

        const sizeMap: Record<string, string> = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2',
            lg: 'px-6 py-3 text-lg'
        };

        const IconComponent = icon ? (
            React.createElement(iconMap[icon] || ShoppingCart, { className: 'w-4 h-4' })
        ) : null;

        return (
            <button className={clsx(
                'rounded-md font-medium transition-all w-full',
                'flex items-center justify-center gap-2',
                variantMap[variant] || 'bg-blue-600 text-white',
                sizeMap[size] || 'px-4 py-2'
            )}>
                {IconComponent}
                {label}
            </button>
        );
    },

    // 產品卡片：電商專用卡片
    card: ({ title, description, imageUrl, price, discount, children }: any) => {
        return (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {imageUrl && (
                    <div className="relative">
                        <img src={imageUrl} alt={title} className="w-full aspect-square object-cover" />
                        {discount && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                                {discount}
                            </span>
                        )}
                    </div>
                )}
                <div className="p-4">
                    {title && <h3 className="font-bold text-lg text-slate-900 mb-1">{title}</h3>}
                    {description && <p className="text-sm text-slate-600 mb-2">{description}</p>}
                    {price && <div className="text-xl font-bold text-blue-600">{price}</div>}
                    {children}
                </div>
            </div>
        );
    },

    // 倒數計時器：促銷計時
    timer: ({ endTime, label }: any) => {
        const [timeLeft, setTimeLeft] = React.useState('');

        React.useEffect(() => {
            const interval = setInterval(() => {
                const end = new Date(endTime).getTime();
                const now = new Date().getTime();
                const diff = end - now;

                if (diff <= 0) {
                    setTimeLeft('已結束');
                } else {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                }
            }, 1000);

            return () => clearInterval(interval);
        }, [endTime]);

        return (
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                    {label && <div className="text-xs text-orange-700">{label}</div>}
                    <div className="text-lg font-bold text-orange-600 tabular-nums">{timeLeft}</div>
                </div>
            </div>
        );
    },

    // 簡易圖表：數據視覺化
    chart: ({ type, data, color = 'bg-blue-500' }: any) => {
        const maxValue = Math.max(...data.map((d: any) => d.value));

        return (
            <div className="space-y-2">
                {data.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                        <div className="text-xs text-slate-600 w-16 text-right">{item.label}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                            <div
                                className={clsx(color, 'h-full flex items-center justify-end px-2 text-xs text-white font-bold')}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            >
                                {item.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
};

// 圖標對照表
const iconMap: Record<string, any> = {
    user: User,
    cart: ShoppingCart,
    star: Star,
    zap: Zap,
    clock: Clock,
    trending: TrendingUp,
    home: Home,
    package: Package,
    heart: Heart,
    bell: Bell,
    search: Search,
    settings: Settings
};

// ============ 遞迴渲染引擎 ============

export const Engine: React.FC<{ data: UIComponent }> = ({ data }) => {
    const Component = Atoms[data.type as keyof typeof Atoms];

    if (!Component) {
        console.warn(`[HyperGrid] 未知的組件類型: ${data.type}`);
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                ⚠️ 未支援的組件: <code>{data.type}</code>
            </div>
        );
    }

    return (
        <Component {...data.props}>
            {data.children?.map((child) => (
                <Engine key={child.id} data={child} />
            ))}
        </Component>
    );
};
