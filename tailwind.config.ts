import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          background: '#f8fafc',
          surface: '#ffffff',
          primary: '#6366f1',    // Indigo-500
          accent: '#9333ea',     // Purple-600
          secondary: '#ec4899',  // Pink-500
          success: '#10b981',    // Emerald-500
          warning: '#f59e0b',    // Amber-500
          error: '#f43f5e',      // Rose-500
          text: {
            primary: '#0f172a',  // Slate-900
            secondary: '#475569', // Slate-600
            muted: '#94a3b8'     // Slate-400
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'taicalc': '12px',  // 從 16px 降為 12px
        'card': '16px',     // 從 24px 降為 16px
      },
      boxShadow: {
        'glass': '0 4px 6px rgba(0, 0, 0, 0.07)',  // 更輕量（舊：0 8px 30px 0.04）
        'glow': '0 0 15px rgba(37, 99, 235, 0.12)', // 更柔和（舊：0 0 20px 0.15）
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',    // 新增：卡片陰影
      },
    },
  },
  plugins: [],
};
export default config;