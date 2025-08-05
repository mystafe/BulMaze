'use client';
import { useUiStore } from '@/lib/store';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="p-2 rounded-2xl shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
