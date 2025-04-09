import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
      },
    },
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'pbs.twimg.com',
      },
      {
        hostname: 'lh3.googleusercontent.com',
      },
      {
        hostname: '*.r2.dev',
      },
      {
        hostname: '*.tiktokcdn.com',
      },
    ],
  },
  serverExternalPackages: ['@prisma/client', '@prisma/engines'],
  // Add cache headers for static assets
  async headers() {
    return [
      {
        // Match all static files including images
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|css|js|webp)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
      {
        // Match static folder
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
      {
        // Match images folder
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
