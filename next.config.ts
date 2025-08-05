import type { NextConfig } from 'next';
import nextI18NextConfig from './next-i18next.config.mjs';

const nextConfig: NextConfig = {
  i18n: nextI18NextConfig.i18n,
};

export default nextConfig;
