import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cefrToNumeric, requiredXP, CEFR, LevelNumeric } from './levels';
import { calcPoints, revealRandomLetter } from './scoring';
import { diacriticInsensitiveEquals } from './utils';

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

export const useUiStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      uiLang: 'en',
      targetLang: 'en',
      theme: 'light',
      setUiLang: (uiLang) => set({ uiLang }),
      setTargetLang: (targetLang) => set({ targetLang }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ui' }
  )
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
      makeGuess: (guess) =>
        diacriticInsensitiveEquals(guess, get().word),
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
        reviver: (key, value) =>
          key === 'revealed' ? new Set<string>(value as string[]) : value,
      }),
    }
  )
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
  awardXP: (gain: number) => void;
  maybeLevelUp: () => void;
}

export const useCareerStore = create<CareerState & CareerActions>()(
  persist(
    (set, get) => ({
      cefr: 'A1',
      levelNumeric: 1,
      xp: 0,
      requiredXp: requiredXP(1),
      history: [],
      setCEFR: (cefr) => {
        const levelNumeric = cefrToNumeric(cefr);
        set({
          cefr,
          levelNumeric,
          requiredXp: requiredXP(levelNumeric),
        });
      },
      awardXP: (gain) => {
        set((state) => ({
          xp: state.xp + gain,
          history: [...state.history, gain],
        }));
        get().maybeLevelUp();
      },
      maybeLevelUp: () =>
        set((state) => {
          let { xp, levelNumeric } = state;
          let requiredXp = state.requiredXp;
          while (xp >= requiredXp) {
            xp -= requiredXp;
            levelNumeric = (levelNumeric + 1) as LevelNumeric;
            requiredXp = requiredXP(levelNumeric);
          }
          return { xp, levelNumeric, requiredXp };
        }),
    }),
    { name: 'career' }
  )
);
