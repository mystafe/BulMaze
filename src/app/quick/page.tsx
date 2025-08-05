import GameBoard from '@/components/GameBoard';

// placeholder word and hint
export default function QuickPage() {
  return (
    <div className="max-w-xl mx-auto">
      <GameBoard word="example" hint="Sample word" />
    </div>
  );
}
