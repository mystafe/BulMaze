/** Basic mockup of the BulMaze home screen using brand theme. */
import Image from 'next/image';

export default function HomeMockup() {
  return (
    <div className="p-8 bg-[var(--bm-bg)] rounded-xl text-center space-y-6">
      <Image src="/logo.svg" alt="BulMaze logo" width={64} height={64} />
      <h1 className="text-4xl font-bold text-[var(--bm-primary)]">BulMaze</h1>
      <div className="flex justify-center gap-4">
        <button className="px-4 py-2 bg-[var(--bm-primary)] text-white rounded-lg flex items-center gap-2">
          <Image src="/icons/maze.svg" alt="" width={20} height={20} />
          Hemen Oyna
        </button>
        <button className="px-4 py-2 bg-[var(--bm-secondary)] text-white rounded-lg flex items-center gap-2">
          <Image src="/icons/trophy.svg" alt="" width={20} height={20} />
          Kariyer
        </button>
      </div>
    </div>
  );
}
