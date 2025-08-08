export type CardState = {
  interval: number;
  repetition: number;
  ease: number;
  due: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function initCard(): CardState {
  const now = new Date();
  return {
    interval: 1,
    repetition: 0,
    ease: 2.5,
    due: now.toISOString(),
  };
}

export function review(card: CardState, quality: 0 | 3 | 4 | 5): CardState {
  const now = new Date();
  let { interval, repetition, ease } = card;

  if (quality === 0) {
    repetition = 0;
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
    repetition += 1;
    const delta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    ease = Math.max(1.3, ease + delta);
  }

  const due = new Date(now.getTime() + interval * DAY_MS).toISOString();
  return { interval, repetition, ease, due };
}
