import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    // 設定輸出文件追蹤根目錄以解決多重 lockfile 警告
    outputFileTracingRoot: __dirname,
    // Enforce strict builds - no hidden errors
    eslint: {
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    // Optimize for Edge deployment
    experimental: {
        // Enable PPR for faster page loads
        // ppr: true,
    },
};

export default nextConfig;
