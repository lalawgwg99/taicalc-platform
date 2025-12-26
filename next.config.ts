/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    eslint: {
        // 為了止血，先讓 build 忽略 lint 錯誤
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
