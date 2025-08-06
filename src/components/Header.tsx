import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="text-2xl font-bold">
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
