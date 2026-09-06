import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/trace-viewer/*': ['./node_modules/playwright-core/lib/vite/traceViewer/**/*'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/artifacts/**',
      },
    ],
  },
};

export default nextConfig;
