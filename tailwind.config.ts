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
          primary: "#0F172A",   // 決策藍
          secondary: "#3B82F6", // 科技藍
          accent: "#10B981",    // 成長綠
          warning: "#F59E0B",   // 警示橘
          background: "#F8FAFC",
        },
      },
      borderRadius: {
        'taicalc': '12px',
      }
    },
  },
  plugins: [],
};
export default config;