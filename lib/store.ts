import { create } from 'zustand';
import { ArchiveEntry, Persona, RemedyProcess } from '../types';

interface AppState {
  archive: ArchiveEntry[];
  personas: Persona[];
  remedies: RemedyProcess[];
  addToArchive: (entry: ArchiveEntry) => void;
  addPersona: (persona: Persona) => void;
  addRemedy: (remedy: RemedyProcess) => void;
  updateRemedy: (remedy: RemedyProcess) => void;
}

export const useStore = create<AppState>((set) => ({
  archive: [],
  personas: [],
  remedies: [],
  addToArchive: (entry) => set((state) => ({ archive: [...state.archive, entry] })),
  addPersona: (persona) => set((state) => ({ personas: [...state.personas, persona] })),
  addRemedy: (remedy) => set((state) => ({ remedies: [...state.remedies, remedy] })),
  updateRemedy: (remedy) => set((state) => ({
    remedies: state.remedies.map((r) => (r.id === remedy.id ? remedy : r)),
  })),
}));
