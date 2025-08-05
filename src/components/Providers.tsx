'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useUiStore } from '@/lib/store';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: ReactNode }) {
  const uiLang = useUiStore((s) => s.uiLang);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(uiLang);
  }, [uiLang, i18n]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('ui')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, [setTheme]);

  if (process.env.FEATURE_AUTH === 'true') {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return children;
}
