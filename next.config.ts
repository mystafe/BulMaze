import type { NextConfig } from 'next';
import nextI18NextConfig from './next-i18next.config.mjs';

const nextConfig: NextConfig = {
  i18n: nextI18NextConfig.i18n,
  env: {
    FEATURE_AUTH: process.env.FEATURE_AUTH,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
  },
};

export default nextConfig;
