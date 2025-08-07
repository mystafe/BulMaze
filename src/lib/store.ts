import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cefrToNumeric, requiredXP, CEFR, LevelNumeric } from './levels';
import {
  calcPoints,
  revealRandomLetter,
  diacriticInsensitiveEquals,
} from './scoring';

const authEnabled = process.env.FEATURE_AUTH === 'true';

export interface UIState {
  uiLang: string;
  targetLang: string;
  theme: 'light' | 'dark';
}

export interface UIActions {
  setUiLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const uiStore: StateCreator<UIState & UIActions> = (set) => ({
  uiLang: 'en',
  targetLang: 'en',
  theme: 'light',
  setUiLang: (uiLang: string) => set({ uiLang }),
  setTargetLang: (targetLang: string) => set({ targetLang }),
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
});

export const useUiStore = create<UIState & UIActions>()(
  (authEnabled ? uiStore : persist(uiStore, { name: 'ui' })) as StateCreator<
    UIState & UIActions
  >,
);

export interface WordItem {
  word: string;
  hint: string;
  example: string;
  exampleTranslation: string;
  pos: string;
  difficulty: string;
}

export interface GameState {
  word: string;
  hint: string;
  example: string;
  exampleTranslation: string;
  pos: string;
  difficulty: string;
  revealed: Set<string>;
  lettersTaken: number;
  points: number;
}

export interface GameActions {
  setWordItem: (item: WordItem) => void;
  takeLetter: () => void;
  makeGuess: (guess: string) => boolean;
  reset: () => void;
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      word: '',
      hint: '',
      example: '',
      exampleTranslation: '',
      pos: '',
      difficulty: '',
      revealed: new Set<string>(),
      lettersTaken: 0,
      points: 100,
      setWordItem: (item) =>
        set({
          word: item.word,
          hint: item.hint,
          example: item.example,
          exampleTranslation: item.exampleTranslation,
          pos: item.pos,
          difficulty: item.difficulty,
          revealed: new Set<string>(),
          lettersTaken: 0,
          points: 100,
        }),
      takeLetter: () =>
        set((state) => {
          const lettersTaken = state.lettersTaken + 1;
          return {
            revealed: revealRandomLetter(state.word, state.revealed),
            lettersTaken,
            points: calcPoints(lettersTaken),
          };
        }),
      makeGuess: (guess) => diacriticInsensitiveEquals(guess, get().word),
      reset: () =>
        set({
          word: '',
          hint: '',
          example: '',
          exampleTranslation: '',
          pos: '',
          difficulty: '',
          revealed: new Set<string>(),
          lettersTaken: 0,
          points: 100,
        }),
    }),
    {
      name: 'game',
      storage: createJSONStorage(() => localStorage, {
        replacer: (_key, value) =>
          value instanceof Set ? Array.from(value) : value,
        reviver: (key, value) => {
          if (key === 'revealed') {
            if (value instanceof Set) return value as Set<string>;
            if (Array.isArray(value)) return new Set<string>(value);
            if (value && typeof value === 'object')
              return new Set<string>(Array.from(value as Iterable<string>));
            return new Set<string>();
          }
          return value;
        },
      }),
    },
  ),
);

export interface CareerState {
  cefr: CEFR;
  levelNumeric: LevelNumeric;
  xp: number;
  requiredXp: number;
  history: number[];
}

export interface CareerActions {
  setCEFR: (cefr: CEFR) => void;
  awardXP: (gain: number) => boolean;
  maybeLevelUp: () => void;
  load: () => Promise<void>;
  save: () => Promise<void>;
}

const careerStore: StateCreator<CareerState & CareerActions> = (set, get) => ({
  cefr: 'A1',
  levelNumeric: 1 as LevelNumeric,
  xp: 0,
  requiredXp: requiredXP(1),
  history: [] as number[],
  setCEFR: (cefr: CEFR) => {
    const levelNumeric = cefrToNumeric(cefr);
    set({
      cefr,
      levelNumeric,
      requiredXp: requiredXP(levelNumeric),
    });
    if (authEnabled) {
      void get().save();
    }
  },
  awardXP: (gain: number) => {
    const prevLevel = get().levelNumeric;
    set((state: CareerState) => ({
      xp: state.xp + gain,
      history: [...state.history, gain],
    }));
    get().maybeLevelUp();
    if (authEnabled) {
      void get().save();
    }
    return get().levelNumeric > prevLevel;
  },
  maybeLevelUp: () =>
    set((state: CareerState) => {
      let { xp, levelNumeric } = state;
      let requiredXp = state.requiredXp;
      while (xp >= requiredXp) {
        xp -= requiredXp;
        levelNumeric = (levelNumeric + 1) as LevelNumeric;
        requiredXp = requiredXP(levelNumeric);
      }
      return { xp, levelNumeric, requiredXp };
    }),
  load: async () => {
    if (!authEnabled) return;
    const res = await fetch('/api/profile');
    if (res.ok) {
      const data: CareerState = await res.json();
      set(data);
    }
  },
  save: async () => {
    if (!authEnabled) return;
    const { cefr, levelNumeric, xp, requiredXp, history } = get();
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cefr, levelNumeric, xp, requiredXp, history }),
    });
  },
});

export const useCareerStore = create<CareerState & CareerActions>()(
  (authEnabled
    ? careerStore
    : persist(careerStore, { name: 'career' })) as StateCreator<
    CareerState & CareerActions
  >,
);
