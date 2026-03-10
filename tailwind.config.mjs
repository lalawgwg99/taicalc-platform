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
                // Kenya Hara / MUJI Natural Material Palette
                // Warm Neutrals (紙/Paper) - for backgrounds and surfaces
                paper: {
                    50: '#FAFAF8',   // Lightest rice paper
                    100: '#F5F4F0',   // Natural white - main background
                    200: '#EAE8E0',   // Aged paper
                    300: '#D9D6CC',   // Parchment - borders
                    400: '#C4C0B6',   // Deeper parchment
                },
                // Cool Neutrals (墨/Ink) - for text and emphasis
                ink: {
                    300: '#BBBAB3',   // Light ink - disabled states
                    400: '#9B9890',   // Faded ink - secondary text
                    500: '#6B6760',   // Medium ink - body text
                    600: '#4A4741',   // Dark ink - headings
                    700: '#2D2C28',   // Calligraphy black - primary text
                    800: '#1A1917',   // Deep black
                },
                // Signal Color (天藍/Azure) - primary interactive color
                // Replaces scattered emerald/blue/teal across components
                azure: {
                    50: '#EEF6FF',
                    100: '#DBEcFF',
                    200: '#BFDFFF',
                    300: '#93CBFF',
                    400: '#60AFFF',
                    500: '#3B93F7',   // Primary interactive
                    600: '#2876E0',   // Darker / hover
                    700: '#1A5CB8',   // Active / pressed
                    light: '#EEF6FF',
                    DEFAULT: '#3B93F7',
                    dark: '#1A5CB8',
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
                'input': '0 0 0 3px rgba(59,147,247,0.15)',
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
