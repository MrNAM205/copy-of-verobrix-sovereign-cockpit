import { create } from 'zustand';
import { ArchiveEntry, Persona, RemedyProcess, Trust } from '../types';

interface AppState {
  archive: ArchiveEntry[];
  personas: Persona[];
  remedies: RemedyProcess[];
  trusts: Trust[];
  addToArchive: (entry: ArchiveEntry) => void;
  addPersona: (persona: Persona) => void;
  addRemedy: (remedy: RemedyProcess) => void;
  updateRemedy: (remedy: RemedyProcess) => void;
  addTrust: (trust: Trust) => void;
  updateTrust: (trust: Trust) => void;
}

export const useStore = create<AppState>((set) => ({
  archive: [],
  personas: [],
  remedies: [],
  trusts: [],
  addToArchive: (entry) => set((state) => ({ archive: [...state.archive, entry] })),
  addPersona: (persona) => set((state) => ({ personas: [...state.personas, persona] })),
  addRemedy: (remedy) => set((state) => ({ remedies: [...state.remedies, remedy] })),
  updateRemedy: (remedy) => set((state) => ({
    remedies: state.remedies.map((r) => (r.id === remedy.id ? remedy : r)),
  })),
  addTrust: (trust) => set((state) => ({ trusts: [...state.trusts, trust] })),
  updateTrust: (trust) => set((state) => ({
    trusts: state.trusts.map((t) => (t.id === trust.id ? trust : t)),
  })),
}));
