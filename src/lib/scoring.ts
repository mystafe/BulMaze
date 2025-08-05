export function buildMask(word: string, revealed: Set<string>): string {
  return word
    .split('')
    .map((ch) => (revealed.has(ch.toLowerCase()) ? ch : '_'))
    .join(' ');
}

export function revealRandomLetter(word: string, revealed: Set<string>): Set<string> {
  const remaining = word
    .toLowerCase()
    .split('')
    .filter((ch) => !revealed.has(ch));
  if (remaining.length === 0) return revealed;
  const random = remaining[Math.floor(Math.random() * remaining.length)];
  const updated = new Set(revealed);
  word
    .toLowerCase()
    .split('')
    .forEach((ch) => {
      if (ch === random) updated.add(ch);
    });
  return updated;
}

export function calcPoints(lettersTaken: number): number {
  const points = 100 - lettersTaken * 10;
  return points < 10 ? 10 : Math.round(points);
}

