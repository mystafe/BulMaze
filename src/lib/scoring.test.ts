import { describe, it, expect, vi } from 'vitest';
import { buildMask, revealRandomLetter, calcPoints } from './scoring';

describe('scoring utils', () => {
  it('buildMask hides unrevealed letters', () => {
    const mask = buildMask('test', new Set(['t']));
    expect(mask).toBe('t _ _ t');
  });

  it('revealRandomLetter reveals a new letter', () => {
    const set = revealRandomLetter('abc', new Set());
    expect(set.size).toBe(1);
  });

  it('revealRandomLetter reveals all instances of a letter', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0);
    const set = revealRandomLetter('banana', new Set(['b']));
    spy.mockRestore();
    expect(buildMask('banana', set)).toBe('b a _ a _ a');
  });

  it('calcPoints decreases by 10 per letter', () => {
    expect(calcPoints(3)).toBe(70);
  });

  it('calcPoints has a minimum of 10', () => {
    expect(calcPoints(15)).toBe(10);
  });
});
