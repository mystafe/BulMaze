import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initCard, review, type CardState } from './spacedRepetition';

describe('spaced repetition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initCard returns starting values', () => {
    const card = initCard();
    expect(card).toEqual({
      interval: 1,
      repetition: 0,
      ease: 2.5,
      due: new Date('2024-01-01T00:00:00.000Z').toISOString(),
    });
  });

  it('review handles failure', () => {
    const card: CardState = {
      interval: 10,
      repetition: 5,
      ease: 2.5,
      due: new Date().toISOString(),
    };
    const result = review(card, 0);
    expect(result).toEqual({
      interval: 1,
      repetition: 0,
      ease: 2.3,
      due: new Date('2024-01-02T00:00:00.000Z').toISOString(),
    });
  });

  it('review schedules passes per SM-2', () => {
    let card = initCard();
    card = review(card, 5);
    expect(card).toEqual({
      interval: 1,
      repetition: 1,
      ease: 2.6,
      due: new Date('2024-01-02T00:00:00.000Z').toISOString(),
    });

    vi.setSystemTime(new Date('2024-01-02T00:00:00.000Z'));
    card = review(card, 5);
    expect(card).toEqual({
      interval: 6,
      repetition: 2,
      ease: 2.7,
      due: new Date('2024-01-08T00:00:00.000Z').toISOString(),
    });
  });

  it('ease never drops below 1.3', () => {
    const card: CardState = {
      interval: 5,
      repetition: 3,
      ease: 1.35,
      due: new Date().toISOString(),
    };
    const result = review(card, 0);
    expect(result.ease).toBe(1.3);
  });
});
