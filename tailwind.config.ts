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
          background: '#0f172a', // 深海藍底色
          surface: '#1e293b',    // 卡片表面色
          primary: '#3b82f6',    // 電光藍
          accent: '#8b5cf6',     // 霓虹紫
          success: '#10b981',    // 翡翠綠
          warning: '#f59e0b',    // 琥珀金
          error: '#ef4444',      // 警示紅
          text: {
            primary: '#f8fafc',  // 極致白
            secondary: '#94a3b8', // 霧灰
            muted: '#64748b'     // 深灰
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'taicalc': '16px',
        'card': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
};
export default config;