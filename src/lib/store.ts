import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { requiredXp } from './levels';

export interface GameState {
  currentWord: string;
  hint: string;
  revealed: Set<string>;
  lettersTaken: number;
  points: number;
}

export const useGameStore = create<GameState>()(
  persist(
    (): GameState => ({
      currentWord: '',
      hint: '',
      revealed: new Set(),
      lettersTaken: 0,
      points: 100,
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
  level: number;
  xp: number;
}

export const useCareerStore = create<CareerState & { addXp: (gain: number) => void }>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      addXp: (gain) => {
        let { level, xp } = get();
        xp += gain;
        while (xp >= requiredXp(level)) {
          xp -= requiredXp(level);
          level += 1;
        }
        set({ level, xp });
      },
    }),
    { name: 'career' }
  )
);

export interface UiState {
  uiLang: string;
  targetLang: string;
  theme: 'light' | 'dark';
}

export const useUiStore = create<UiState>()(
  persist(
    (): UiState => ({
      uiLang: 'en',
      targetLang: 'en',
      theme: 'light',
    }),
    { name: 'ui' }
  )
);
