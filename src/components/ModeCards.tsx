import Link from 'next/link';

export default function ModeCards() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Link href="/career" className="p-6 rounded-2xl shadow bg-white dark:bg-neutral-800">
        <h2 className="text-xl font-bold mb-2">Career Mode</h2>
        <p>Progress through levels and earn XP.</p>
      </Link>
      <Link href="/quick" className="p-6 rounded-2xl shadow bg-white dark:bg-neutral-800">
        <h2 className="text-xl font-bold mb-2">Quick Play</h2>
        <p>Start a game instantly without login.</p>
      </Link>
    </div>
  );
}
