import { describe, it, expect } from 'vitest';
import { requiredXP, cefrToNumeric, numericToCefr } from './levels';

describe('level utils', () => {
  it('requiredXP grows with level', () => {
    expect(requiredXP(2)).toBeGreaterThan(requiredXP(1));
  });

  it('cefrToNumeric maps correctly', () => {
    expect(cefrToNumeric('B2')).toBe(4);
  });

  it('numericToCefr maps correctly', () => {
    expect(numericToCefr(4)).toBe('B2');
  });
});
