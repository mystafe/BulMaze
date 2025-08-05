import { describe, it, expect } from 'vitest';
import { diacriticInsensitiveEquals } from './utils';

describe('diacriticInsensitiveEquals', () => {
  it('matches regardless of diacritics and case', () => {
    expect(diacriticInsensitiveEquals('café', 'CAFE')).toBe(true);
    expect(diacriticInsensitiveEquals('mañana', 'manana')).toBe(true);
  });

  it('fails when words differ', () => {
    expect(diacriticInsensitiveEquals('cafe', 'tea')).toBe(false);
  });
});

