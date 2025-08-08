'use client';

// Demo component: switch between English, Turkish and German using useTranslation
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18nClient';

export default function LanguageDemo() {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col items-start gap-2">
      <p>{t('nav.settings')}</p>
      <div className="space-x-2">
        <button onClick={() => void i18n.changeLanguage('en')}>EN</button>
        <button onClick={() => void i18n.changeLanguage('tr')}>TR</button>
        <button onClick={() => void i18n.changeLanguage('de')}>DE</button>
      </div>
    </div>
  );
}
