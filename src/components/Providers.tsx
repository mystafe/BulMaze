'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useUiStore, useDailyQuestStore } from '@/lib/store';
import { SessionProvider, useSession } from 'next-auth/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18nClient';

function AppInitializer({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const fetchQuest = useDailyQuestStore((s) => s.fetchQuest);
  const lastFetched = useDailyQuestStore((s) => s.lastFetched);
  const quest = useDailyQuestStore((s) => s.quest);

  useEffect(() => {
    const userLevel = localStorage.getItem('userLevel') as
      | 'beginner'
      | 'intermediate'
      | 'advanced'
      | null;
    const isAuthenticated = status === 'authenticated';

    // Fetch quest if user is logged in, has a level, and hasn't fetched in the last 24 hours
    // or if there's no quest data available.
    const shouldFetch = () => {
      if (!isAuthenticated || !userLevel) return false;
      if (quest.length === 0) return true;
      if (!lastFetched) return true;

      const oneDay = 24 * 60 * 60 * 1000;
      return new Date().getTime() - new Date(lastFetched).getTime() > oneDay;
    };

    if (shouldFetch()) {
      fetchQuest(userLevel!);
    }
  }, [status, fetchQuest, lastFetched, quest.length]);

  return <>{children}</>;
}

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
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, [setTheme]);

  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <AppInitializer>{children}</AppInitializer>
      </I18nextProvider>
    </SessionProvider>
  );
}
