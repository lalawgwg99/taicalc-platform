import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
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
