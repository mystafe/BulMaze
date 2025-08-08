// Global application header with BulMaze branding and navigation.
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b-2 border-[var(--bm-primary)] bg-[var(--bm-bg)]">
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[var(--bm-primary)]">
        <Image src="/logo.svg" alt="BulMaze logo" width={32} height={32} />
        BulMaze
      </Link>
      <nav className="flex items-center gap-2">
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
        <ThemeToggle />
      </nav>
    </header>
  );
}
