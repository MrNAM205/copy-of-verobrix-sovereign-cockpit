import { create } from 'zustand';
import { ArchiveEntry } from '../types';

interface AppState {
  archive: ArchiveEntry[];
  addToArchive: (entry: ArchiveEntry) => void;
}

export const useStore = create<AppState>((set) => ({
  archive: [],
  addToArchive: (entry) => set((state) => ({ archive: [...state.archive, entry] })),
}));
