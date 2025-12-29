import { create } from 'zustand';
import { 
    ArchiveEntry, 
    Persona, 
    ActiveRemedy, 
    Trust, 
    CapacityState,
    LegalCapacity,
    SignatureMode,
    JurisdictionalContext,
    ActiveMission
} from '../types';

interface AppState {
  archive: ArchiveEntry[];
  personas: Persona[];
  activePersonaId: string | null;
  remedies: ActiveRemedy[];
  missions: ActiveMission[];
  trusts: Trust[];
  capacity: CapacityState;

  // Actions
  addToArchive: (entry: ArchiveEntry) => void;
  addPersona: (persona: Persona) => void;
  setActivePersona: (personaId: string) => void;
  addRemedy: (remedy: ActiveRemedy) => void;
  updateRemedy: (remedy: ActiveRemedy) => void;
  addMission: (mission: ActiveMission) => void;
  updateMission: (mission: ActiveMission) => void;
  addTrust: (trust: Trust) => void;
  updateTrust: (trust: Trust) => void;
  setCapacity: (newCapacity: Partial<CapacityState>) => void;
}

export const useStore = create<AppState>((set) => ({
  // Data
  archive: [],
  personas: [],
  activePersonaId: null,
  remedies: [],
  missions: [],
  trusts: [],
  
  // Initial Capacity State
  capacity: {
    activeCapacity: LegalCapacity.REPRESENTATIVE,
    activeSignatureMode: SignatureMode.REPRESENTATIVE,
    activeJurisdiction: JurisdictionalContext.ADMINISTRATIVE,
    authoritySource: 'Agency Law', // Default authority
  },

  // Actions
  addToArchive: (entry) => set((state) => ({ archive: [...state.archive, entry] })),
  
  addPersona: (persona) => set((state) => ({ 
    personas: [...state.personas, persona],
    // Automatically set the first persona as active
    activePersonaId: state.activePersonaId ?? persona.id 
  })),

  setActivePersona: (personaId) => set({ activePersonaId: personaId }),

  addRemedy: (remedy) => set((state) => ({ remedies: [...state.remedies, remedy] })),
  
  updateRemedy: (remedy) => set((state) => ({
    remedies: state.remedies.map((r) => (r.instanceId === remedy.instanceId ? remedy : r)),
  })),

  addMission: (mission) => set((state) => ({ missions: [...state.missions, mission] })),

  updateMission: (mission) => set((state) => ({
    missions: state.missions.map((m) => (m.instanceId === mission.instanceId ? mission : m)),
  })),

  addTrust: (trust) => set((state) => ({ trusts: [...state.trusts, trust] })),

  updateTrust: (trust) => set((state) => ({
    trusts: state.trusts.map((t) => (t.id === trust.id ? trust : t)),
  })),

  setCapacity: (newCapacity) => set((state) => ({
    capacity: { ...state.capacity, ...newCapacity }
  })),
}));