"use client";

// Global application header with BulMaze branding and navigation.
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [showMore, setShowMore] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 border-b-2 border-[var(--bm-primary)] bg-[var(--bm-bg)]">
      <Link
        href="/"
        className="flex items-center gap-2 text-2xl font-bold text-[var(--bm-primary)]"
      >
        <Image src="/logo.svg" alt="BulMaze logo" width={32} height={32} />
        BulMaze
      </Link>
      <nav className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/trainer">Trainer</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/add-words">Add Words</Link>
        </Button>
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link href="/puzzle">Puzzle</Link>
        </Button>
        <div className="relative sm:hidden">
          <Button variant="ghost" onClick={() => setShowMore(!showMore)}>
            …
          </Button>
          {showMore && (
            <div className="absolute right-0 mt-2 border rounded bg-[var(--bm-bg)] shadow">
              <Button
                asChild
                variant="ghost"
                onClick={() => setShowMore(false)}
              >
                <Link href="/puzzle">Puzzle</Link>
              </Button>
            </div>
          )}
        </div>
        <Button asChild variant="ghost">
          <Link href="/about">About</Link>
        </Button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
