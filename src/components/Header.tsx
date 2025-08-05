import LanguageSelector from './LanguageSelector';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      <Link href="/" className="text-2xl font-bold">BulMaze</Link>
      <LanguageSelector />
    </header>
  );
}
