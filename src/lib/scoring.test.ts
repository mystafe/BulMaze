import { describe, it, expect } from 'vitest';
import { buildMask, revealRandomLetter, calcPoints } from './scoring';
import { calcXpGain, requiredXp, cefrToNumeric } from './levels';

describe('scoring utils', () => {
  it('buildMask hides unrevealed letters', () => {
    const mask = buildMask('test', new Set(['t']));
    expect(mask).toBe('t _ _ t');
  });

  it('revealRandomLetter reveals a new letter', () => {
    const set = revealRandomLetter('abc', new Set());
    expect(set.size).toBe(1);
  });

  it('calcPoints decreases by 10 per letter', () => {
    expect(calcPoints(3)).toBe(70);
  });
});

describe('level utils', () => {
  it('calcXpGain considers level and points', () => {
    expect(calcXpGain(2, 80)).toBeGreaterThan(0);
  });

  it('requiredXp grows with level', () => {
    expect(requiredXp(2)).toBeGreaterThan(requiredXp(1));
  });

  it('cefrToNumeric maps correctly', () => {
    expect(cefrToNumeric('B2')).toBe(4);
  });
});
