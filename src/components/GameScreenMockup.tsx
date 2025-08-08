/** Basic mockup of a BulMaze game screen using brand theme. */
import Image from 'next/image';

export default function GameScreenMockup() {
  return (
    <div className="p-8 bg-[var(--bm-bg)] rounded-xl border-2 border-[var(--bm-primary)] space-y-4 max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 text-[var(--bm-primary)]">
        <Image src="/icons/brain.svg" alt="" width={24} height={24} />
        <h2 className="text-2xl font-bold">Bulmaca</h2>
      </div>
      <div className="h-40 rounded-lg bg-white/50 flex items-center justify-center">
        <span className="text-gray-500">Oyun Tahtası</span>
      </div>
      <button className="w-full px-4 py-2 bg-[var(--bm-accent)] text-white rounded-lg">Tahmin Gönder</button>
    </div>
  );
}
