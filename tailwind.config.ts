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