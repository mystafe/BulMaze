export function calcXpGain(level: number, remainingPoints: number): number {
  const base = 50;
  const difficultyBonus = level * 5;
  const performanceBonus = remainingPoints / 5;
  return Math.round(base + difficultyBonus + performanceBonus);
}

export function requiredXp(level: number): number {
  return Math.round(300 * Math.pow(level, 1.35));
}

export function cefrToNumeric(
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
): number {
  const mapping: Record<string, number> = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
  };
  return mapping[cefr];
}