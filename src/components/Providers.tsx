'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useUiStore } from '@/lib/store';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';

export default function Providers({ children }: { children: ReactNode }) {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

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
    return (
      <SessionProvider>
        {children}
        <Toaster />
      </SessionProvider>
    );
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
