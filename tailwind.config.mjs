/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                stone: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                },
                // 優化後的柔和配色系統
                primary: '#10B981',
                'soft-blue': '#E0F2FE',
                'soft-emerald': '#D1FAE5',
                'soft-amber': '#FEF3C7',
                'soft-purple': '#EDE9FE',
                'accent-blue': '#0EA5E9',
                'accent-emerald': '#10B981',
                'accent-amber': '#F59E0B',
                'accent-purple': '#8B5CF6',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}
