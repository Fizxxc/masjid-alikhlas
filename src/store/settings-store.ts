import { create } from 'zustand';
import { ThemeMode } from '@/src/types/db';

type State = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

export const useSettingsStore = create<State>((set) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme }),
}));
