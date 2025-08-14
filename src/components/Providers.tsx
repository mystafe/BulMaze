'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useUiStore, useDailyQuestStore } from '@/lib/store';
import { SessionProvider, useSession } from 'next-auth/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18nClient';

function AppStateInitializer({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const { fetchQuest, lastFetched, quest } = useDailyQuestStore();
  const { targetLang } = useUiStore(); // Get targetLang from the UI store
  const [userLevel, setUserLevel] = useState<
    'beginner' | 'intermediate' | 'advanced' | null
  >(null);

  // Get userLevel from localStorage on the client side
  useEffect(() => {
    const level = localStorage.getItem('userLevel') as
      | 'beginner'
      | 'intermediate'
      | 'advanced'
      | null;
    setUserLevel(level);
  }, []);

  // Simplified logic to fetch user level (replace with your actual logic)
  useEffect(() => {
    const isAuthenticated = status === 'authenticated';

    if (!isAuthenticated || !userLevel) return;

    // Fetch quest if user is logged in, has a level, and hasn't fetched in the last 24 hours
    // or if there's no quest data available.
    const shouldFetch = (): boolean => {
      if (quest.length > 0) return false; // Already have a quest
      if (!lastFetched) return true; // No quest and never fetched

      const now = new Date();
      const last = new Date(lastFetched);
      const hoursSinceLastFetch =
        (now.getTime() - last.getTime()) / (1000 * 60 * 60);

      return hoursSinceLastFetch >= 24; // Fetch if it has been 24 hours
    };

    if (shouldFetch()) {
      fetchQuest(userLevel, targetLang);
    }
  }, [status, fetchQuest, lastFetched, quest.length, userLevel, targetLang]);

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
    if (uiLang && uiLang !== i18n.language) {
      void i18n.changeLanguage(uiLang);
      document.documentElement.lang = uiLang;
    }
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
        <AppStateInitializer>{children}</AppStateInitializer>
      </I18nextProvider>
    </SessionProvider>
  );
}
