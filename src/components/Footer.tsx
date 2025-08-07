"use client";

import { useTranslation } from 'react-i18next';
import '@/lib/i18nClient';

export default function Footer() {
  const { t } = useTranslation('common');
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      {t('footer.developed')}
    </footer>
  );
}
