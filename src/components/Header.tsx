'use client';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="text-2xl font-bold">
        {t('title')}
      </Link>
      <nav className="flex gap-2">
        <Button asChild variant="ghost">
          <Link href="/quick">Quick</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/career">Career</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/profile">Profile</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/settings">Settings</Link>
        </Button>
      </nav>
    </header>
  );
}
