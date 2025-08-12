import { useCardsStore } from './store';
import { type WordItem } from './schemas';

const WORDS_URL = 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt';

export async function loadSeedWords(): Promise<void> {
  const response = await fetch(WORDS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch words: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  const words = text.split('\n').map((w) => w.trim()).filter(Boolean).slice(0, 2000);
  const { addWord } = useCardsStore.getState();
  for (const word of words) {
    const placeholder = { word, pos: 'noun', sample: '', level: 'A1' };
    addWord(placeholder as unknown as WordItem);
  }
}
