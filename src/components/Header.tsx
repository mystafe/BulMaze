'use client';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      <Link href="/" className="text-2xl font-bold">
        {t('title')}
      </Link>
      <nav className="flex gap-4">
        <Link href="/quick">Quick</Link>
        <Link href="/career">Career</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/settings">Settings</Link>
      </nav>
    </header>
  );
}
