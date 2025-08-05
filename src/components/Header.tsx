'use client';
import LanguageSelector from './LanguageSelector';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      <Link href="/" className="text-2xl font-bold">
        {t('title')}
      </Link>
      <LanguageSelector />
    </header>
  );
}
