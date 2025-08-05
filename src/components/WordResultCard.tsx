export default function WordResultCard({ word, example, translation }: { word: string; example: string; translation: string }) {
  return (
    <div className="p-4 rounded-2xl shadow bg-white dark:bg-neutral-800">
      <h3 className="text-lg font-bold mb-2">{word}</h3>
      <p className="italic">{example}</p>
      <p className="text-sm opacity-75">{translation}</p>
    </div>
  );
}
