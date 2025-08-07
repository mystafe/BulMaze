import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cefrToNumeric, requiredXP, CEFR, LevelNumeric } from './levels';
import {
  calcPoints,
  revealRandomLetter,
  diacriticInsensitiveEquals,
} from './scoring';
import { postJSON } from './postJson';

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
  (authEnabled
    ? uiStore
    : persist(uiStore, {
        name: 'ui',
        storage: createJSONStorage(() => localStorage),
      })) as StateCreator<UIState & UIActions>,
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

const initialGameState = (): GameState => ({
  word: '',
  hint: '',
  example: '',
  exampleTranslation: '',
  pos: '',
  difficulty: '',
  revealed: new Set<string>(),
  lettersTaken: 0,
  points: 100,
});

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialGameState(),
      setWordItem: (item) => set({ ...initialGameState(), ...item }),
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
      reset: () => set(initialGameState()),
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
      migrate: (state: unknown) => {
        const s = state as { revealed?: unknown };
        if (Array.isArray(s?.revealed)) {
          return { ...s, revealed: new Set<string>(s.revealed) };
        }
        return state;
      },
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
  setLevelNumeric: (level: LevelNumeric) => void;
  setRequiredXP: (xp: number) => void;
  awardXP: (gain: number) => boolean;
  maybeLevelUp: () => boolean;
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
    set({ cefr });
    get().setLevelNumeric(cefrToNumeric(cefr));
    if (authEnabled) {
      void get().save();
    }
  },
  setLevelNumeric: (level: LevelNumeric) => {
    set({ levelNumeric: level });
    get().setRequiredXP(requiredXP(level));
  },
  setRequiredXP: (xp: number) => set({ requiredXp: xp }),
  awardXP: (gain: number) => {
    set((state) => ({
      xp: state.xp + gain,
      history: [...state.history, gain],
    }));
    const leveledUp = get().maybeLevelUp();
    if (authEnabled) {
      void get().save();
    }
    return leveledUp;
  },
  maybeLevelUp: () => {
    let leveledUp = false;
    set((state) => {
      let { xp, levelNumeric } = state;
      let requiredXp = state.requiredXp;
      while (xp >= requiredXp) {
        xp -= requiredXp;
        levelNumeric = (levelNumeric + 1) as LevelNumeric;
        requiredXp = requiredXP(levelNumeric);
        leveledUp = true;
      }
      return { xp, levelNumeric, requiredXp };
    });
    return leveledUp;
  },
  load: async () => {
    if (!authEnabled) return;
    try {
      const data = await postJSON<CareerState>('/api/profile', undefined, {
        method: 'GET',
      });
      set(data);
    } catch {
      // error handled in postJSON
    }
  },
  save: async () => {
    if (!authEnabled) return;
    const { cefr, levelNumeric, xp, requiredXp, history } = get();
    try {
      await postJSON('/api/profile', {
        cefr,
        levelNumeric,
        xp,
        requiredXp,
        history,
      });
    } catch {
      // error handled in postJSON
    }
  },
});

export const useCareerStore = create<CareerState & CareerActions>()(
  (authEnabled
    ? careerStore
    : persist(careerStore, { name: 'career' })) as StateCreator<
    CareerState & CareerActions
  >,
);
