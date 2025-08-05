'use client';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { t } = useTranslation('common');
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="text-2xl font-bold">
        {t('title')}
      </Link>
      <nav className="flex gap-2">
        <Button asChild variant="ghost">
          <Link href="/quick">{t('nav.quick')}</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/career">{t('nav.career')}</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/profile">{t('nav.profile')}</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/settings">{t('nav.settings')}</Link>
        </Button>
      </nav>
    </header>
  );
}
