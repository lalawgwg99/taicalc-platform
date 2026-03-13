/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"SF Pro Text"',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                ],
                serif: [
                    '"Noto Serif TC"',
                    '"Noto Serif"',
                    'Georgia',
                    '"Times New Roman"',
                    'serif',
                ],
            },
            colors: {
                // Kenya Hara / MUJI Natural Material Palette — Milk Tea Edition
                // Warm Neutrals (紙/Paper) - for backgrounds and surfaces
                paper: {
                    50: '#FAFAF8',   // Lightest rice paper
                    100: '#F7F5F0',   // Milk tea background — main bg
                    200: '#EAE8E0',   // Aged paper
                    300: '#E2DED5',   // Warm border — card edges on milk-tea bg
                    400: '#C4C0B6',   // Deeper parchment
                },
                // Cool Neutrals (墨/Ink) - for text and emphasis
                ink: {
                    300: '#BBBAB3',   // Light ink - disabled states
                    400: '#9B9890',   // Faded ink - secondary text
                    500: '#5A5A5A',   // Medium ink - body text (warmer gray)
                    600: '#3A3A3A',   // Dark ink - headings
                    700: '#1A1A1A',   // Charcoal black - primary text
                    800: '#0D0D0D',   // Deep black
                },
                // Brand Jade Green (翡翠綠) — icons, active tabs, highlights
                // Conveys trust, stability, and growth for a finance platform
                brand: {
                    50:  '#ECFDF5',
                    100: '#D1FAE5',
                    200: '#A7F3D0',
                    300: '#6EE7B7',
                    DEFAULT: '#059669',
                    500: '#059669',
                    600: '#047857',
                    700: '#065F46',
                    dark: '#047857',
                },
                // Interactive Color (碧藍/Azure) - links, focus rings
                // Teal-shifted to harmonize with jade-green brand
                azure: {
                    50: '#ECFEFF',
                    100: '#CFFAFE',
                    200: '#A5F3FC',
                    300: '#67E8F9',
                    400: '#22D3EE',
                    500: '#0891B2',   // Primary interactive
                    600: '#0E7490',   // Darker / hover
                    700: '#155E75',   // Active / pressed
                    light: '#ECFEFF',
                    DEFAULT: '#0891B2',
                    dark: '#155E75',
                },
                // Accent (暖橙/Signal) - for alerts, warnings
                signal: {
                    green: '#16A34A',
                    red: '#DC2626',
                    amber: '#D97706',
                    DEFAULT: '#16A34A',
                },
                // Legacy alias – keep earth so existing pages don't break
                earth: {
                    DEFAULT: '#8B7355',
                    light: '#A68968',
                    dark: '#6B5843',
                },
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(45,44,40,0.08), 0 1px 2px -1px rgba(45,44,40,0.05)',
                'card-hover': '0 4px 12px 0 rgba(45,44,40,0.12), 0 2px 4px -1px rgba(45,44,40,0.08)',
                'input': '0 0 0 3px rgba(5,150,105,0.15)',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.25s ease-out',
                'fade-in': 'fadeIn 0.2s ease-out',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}
