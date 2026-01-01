/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    eslint: {
        // Enforce strict linting for stability
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;
