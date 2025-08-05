export type CEFR = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type LevelNumeric = 1 | 2 | 3 | 4 | 5 | 6;

const cefrToNumMap: Record<CEFR, LevelNumeric> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const numToCefrMap: Record<LevelNumeric, CEFR> = {
  1: 'A1',
  2: 'A2',
  3: 'B1',
  4: 'B2',
  5: 'C1',
  6: 'C2',
};

export function cefrToNumeric(cefr: CEFR): LevelNumeric {
  return cefrToNumMap[cefr];
}

export function numericToCefr(level: LevelNumeric): CEFR {
  return numToCefrMap[level];
}

export function requiredXP(level: LevelNumeric): number {
  return Math.round(300 * Math.pow(level, 1.35));
}
