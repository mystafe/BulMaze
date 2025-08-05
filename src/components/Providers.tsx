'use client';

import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useEffect } from 'react';
import i18n from '@/lib/i18n';
import { useUiStore } from '@/lib/store';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: ReactNode }) {
  const uiLang = useUiStore((s) => s.uiLang);

  useEffect(() => {
    i18n.changeLanguage(uiLang);
  }, [uiLang]);

  if (process.env.FEATURE_AUTH === 'true') {
    return (
      <SessionProvider>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </SessionProvider>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
