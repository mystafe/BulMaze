/* eslint-disable no-unused-vars */
import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WordItem } from './schemas'; // Using the centralized schema
import { postJSON } from './postJson';
import { useUiStore } from './store'; // Assuming uiStore is defined in the same file or imported

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
      const { uiLang } = useUiStore.getState();
      const questData = await postJSON<WordItem[]>('/api/ai/generate', {
        level,
        uiLanguage: uiLang,
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
export interface CardsState {
  cards: Record<string, CardState>;
  queue: string[];
}

export interface CardsActions {
  addWord(word: WordItem): void;
  loadQueue(): void;
}

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
