/* eslint-disable no-unused-vars */
import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WordItem } from './schemas'; // Using the centralized schema
import { postJSON } from './postJson';

// Check if authentication is enabled
const authEnabled = process.env.FEATURE_AUTH === 'true';

// --- Daily Quest Store ---
export interface DailyQuestState {
  quest: WordItem[];
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

export interface DailyQuestActions {
  fetchQuest: (
    level: 'beginner' | 'intermediate' | 'advanced',
  ) => Promise<void>;
  resetQuest: () => void;
}

const initialDailyQuestState: DailyQuestState = {
  quest: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

const dailyQuestStore: StateCreator<DailyQuestState & DailyQuestActions> = (
  set,
) => ({
  ...initialDailyQuestState,
  fetchQuest: async (level) => {
    set({ isLoading: true, error: null });
    try {
      const questData = await postJSON<WordItem[]>('/api/ai/generate', {
        level,
        count: 10,
      });

      if (questData) {
        set({ quest: questData, isLoading: false, lastFetched: new Date() });
      } else {
        throw new Error('Failed to fetch daily quest.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      set({ isLoading: false, error: errorMessage });
      console.error(errorMessage);
    }
  },
  resetQuest: () => set(initialDailyQuestState),
});

export const useDailyQuestStore = create<DailyQuestState & DailyQuestActions>()(
  persist(dailyQuestStore, {
    name: 'daily-quest',
    storage: createJSONStorage(() => localStorage),
  }),
);

// --- UI Store ---
export interface UIState {
  uiLang: string;
  readonly targetLang: 'en'; // Target language is always English and read-only
  theme: 'light' | 'dark';
}

export interface UIActions {
  setUiLang(lang: string): void;
  setTheme(theme: 'light' | 'dark'): void;
}

const uiStore: StateCreator<UIState & UIActions> = (set) => ({
  uiLang: 'en',
  targetLang: 'en', // Default to English
  theme: 'light',
  setUiLang: (uiLang: string) => set({ uiLang }),
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

// --- Cards Store (for spaced repetition) ---
export interface CardState {
  due: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
}

export interface CardsState {
  cards: Record<string, CardState>;
  queue: string[];
}

export interface CardsActions {
  addWord(word: WordItem): void;
  loadQueue(): void;
}

const initCard = (): CardState => ({
  due: new Date().toISOString(),
  interval: 0,
  repetitions: 0,
  easeFactor: 2.5,
});

export const useCardsStore = create<CardsState & CardsActions>()(
  persist(
    (set, get) => ({
      cards: {},
      queue: [],
      addWord: (word: WordItem) =>
        set((state) => ({
          cards: { ...state.cards, [word.word]: initCard() },
        })),
      loadQueue: () => {
        const today = new Date();
        const queue = Object.entries(get().cards)
          .filter(([, card]) => new Date(card.due) <= today)
          .sort(
            (a, b) =>
              new Date(a[1].due).getTime() - new Date(b[1].due).getTime(),
          )
          .map(([word]) => word);
        set({ queue });
      },
    }),
    {
      name: 'cards',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// --- Career Store (simplified for now) ---
export type CEFR = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type LevelNumeric = 1 | 2 | 3 | 4 | 5 | 6;

const requiredXP = (level: LevelNumeric): number => {
  return 200 + (level - 1) * 150;
};

const cefrToNumeric = (cefr: CEFR): LevelNumeric => {
  const map: Record<CEFR, LevelNumeric> = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
  };
  return map[cefr];
};

export interface CareerState {
  cefr: CEFR;
  levelNumeric: LevelNumeric;
  xp: number;
  requiredXp: number;
  history: number[];
}

export interface CareerActions {
  setCEFR(cefr: CEFR): void;
  setLevelNumeric(level: LevelNumeric): void;
  setRequiredXP(xp: number): void;
  awardXP(gain: number): boolean;
  maybeLevelUp(): boolean;
  load(): Promise<void>;
  save(): Promise<void>;
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
    const newXP = get().xp + gain;
    set({ xp: newXP });
    const leveledUp = get().maybeLevelUp();
    if (authEnabled) {
      void get().save();
    }
    return leveledUp;
  },
  maybeLevelUp: () => {
    const { xp, requiredXp, levelNumeric } = get();
    if (xp >= requiredXp && levelNumeric < 6) {
      const newLevel = (levelNumeric + 1) as LevelNumeric;
      set({
        levelNumeric: newLevel,
        requiredXp: requiredXP(newLevel),
        history: [...get().history, xp],
      });
      return true;
    }
    return false;
  },
  load: async () => {
    if (authEnabled) {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          set(data);
        }
      } catch (error) {
        console.error('Failed to load career data:', error);
      }
    }
  },
  save: async () => {
    if (authEnabled) {
      try {
        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(get()),
        });
      } catch (error) {
        console.error('Failed to save career data:', error);
      }
    }
  },
});

export const useCareerStore = create<CareerState & CareerActions>()(
  (authEnabled
    ? careerStore
    : persist(careerStore, {
        name: 'career',
        storage: createJSONStorage(() => localStorage),
      })) as StateCreator<CareerState & CareerActions>,
);
