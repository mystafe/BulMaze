import type { NextConfig } from 'next';
import nextI18NextConfig from './next-i18next.config.mjs';

const nextConfig: NextConfig = {
  i18n: nextI18NextConfig.i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    PORT: process.env.PORT || '3001',
    FEATURE_AUTH: process.env.FEATURE_AUTH,
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL ||
      `http://localhost:${process.env.PORT || '3001'}`,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
  },
};

export default nextConfig;
