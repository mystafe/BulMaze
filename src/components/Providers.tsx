'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useUiStore } from '@/lib/store';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18nClient';

export default function Providers({ children }: { children: ReactNode }) {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const uiLang = useUiStore((s) => s.uiLang);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    void i18n.changeLanguage(uiLang);
    document.documentElement.lang = uiLang;
  }, [uiLang]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('ui')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, [setTheme]);

  if (process.env.FEATURE_AUTH === 'true') {
    return (
      <SessionProvider>
        <I18nextProvider i18n={i18n}>
          {children}
          <Toaster />
        </I18nextProvider>
      </SessionProvider>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
      <Toaster />
    </I18nextProvider>
  );
}
