import { create } from 'zustand';
import { getObject, setObject } from '@infra/storage/mmkv';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const THEME_KEY = 'theme-mode';

export const useThemeStore = create<ThemeState>()(set => ({
  mode: getObject<ThemeMode>(THEME_KEY) ?? 'system',
  setMode: mode => {
    setObject(THEME_KEY, mode);
    set({ mode });
  },
}));
