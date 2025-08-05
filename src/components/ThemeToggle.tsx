'use client';
import { useUiStore } from '@/lib/store';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button onClick={toggle} className="px-3 py-1 border rounded">
      {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
