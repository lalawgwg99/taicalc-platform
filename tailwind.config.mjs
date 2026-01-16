/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                // 品牌主色
                primary: {
                    DEFAULT: '#10B981',
                    light: '#D1FAE5',
                    dark: '#047857',
                },
                // 中性色系
                stone: {
                    50: '#FAFAF9',
                    100: '#F5F5F4',
                    200: '#E7E5E4',
                    300: '#D6D3D1',
                    400: '#A8A29E',
                    500: '#78716C',
                    600: '#57534E',
                    700: '#44403C',
                    800: '#292524',
                    900: '#1C1917',
                },
                // 背景色
                'bg-warm': '#FDFBF7',
                // 功能色系（Quest 卡片）
                'quest-blue': '#E0F2FE',
                'quest-emerald': '#D1FAE5',
                'quest-amber': '#FEF3C7',
                'quest-purple': '#EDE9FE',
                'accent-blue': '#0EA5E9',
                'accent-emerald': '#10B981',
                'accent-amber': '#F59E0B',
                'accent-purple': '#8B5CF6',
                // 語義色系
                success: {
                    DEFAULT: '#10B981',
                    light: '#D1FAE5',
                    dark: '#047857',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    light: '#FEF3C7',
                    dark: '#B45309',
                },
                error: {
                    DEFAULT: '#EF4444',
                    light: '#FEE2E2',
                    dark: '#B91C1C',
                },
                info: {
                    DEFAULT: '#3B82F6',
                    light: '#DBEAFE',
                    dark: '#1D4ED8',
                },
            },
            // 字體
            fontFamily: {
                sans: ['Inter', 'Noto Sans TC', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            // 動畫速度
            transitionDuration: {
                '100': '100ms',
                '200': '200ms',
                '400': '400ms',
                '600': '600ms',
            },
            // 緩動曲線
            transitionTimingFunction: {
                'out': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'spring': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
            },
            // 浮動動畫
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
    darkMode: 'class',
};
