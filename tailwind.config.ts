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
          background: '#f8fafc', // 雲朵白 (回歸清新)
          surface: '#ffffff',    // 純白卡片
          primary: '#2563eb',    // 蘋果藍 (更亮一點)
          accent: '#7c3aed',     // 皇室紫
          success: '#059669',    // 森林綠
          warning: '#d97706',    // 琥珀橘
          error: '#dc2626',      // 警示紅
          text: {
            primary: '#0f172a',  // 深藍黑文字 (高對比)
            secondary: '#64748b', // 舒適灰
            muted: '#94a3b8'     // 淺灰
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
        'glass': '0 8px 30px rgba(0, 0, 0, 0.04)', // 輕量化陰影
        'glow': '0 0 20px rgba(37, 99, 235, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;