import { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KnowledgeView from './components/KnowledgeView';
import CognitionConsole from './components/CognitionConsole';
import Drafter from './components/Drafter';
import ScriptViewer from './components/ScriptViewer';
import ScriptList from './components/ScriptList';
import Archive from './components/Archive';
import Jarvis from './components/Jarvis';
import Dialogos from './components/Dialogos';
import EndorsementStudio from './components/EndorsementStudio';
import Vault from './components/Vault';
import FilingNavigator from './components/FilingNavigator';
import PersonaManager from './components/PersonaManager';
import TrustBuilder from './components/TrustBuilder';
import TopicExplorer from './components/TopicExplorer';
import RemedyTracker from './components/RemedyTracker';
import PlaybookNavigator from './components/PlaybookNavigator';
import GuidingPrinciplesModal from './components/GuidingPrinciplesModal';
import FoiaGenerator from './components/FoiaGenerator';
import BondIntelligence from './components/BondIntelligence';
import { useStore } from './lib/store';
import { useTimelineEngine } from './hooks/useTimelineEngine';
import { useMissionOrchestrator } from './hooks/useMissionOrchestrator';

const App: React.FC = () => {
  const sessionId = useMemo(() => `0x${Date.now().toString(16).toUpperCase()}`, []);
  const { archive, addToArchive } = useStore();
  const [isPrinciplesModalOpen, setPrinciplesModalOpen] = useState(false);

  // Initialize the core background engines
  useTimelineEngine();
  useMissionOrchestrator();

  useEffect(() => {
    const hasSeenPrinciples = localStorage.getItem('hasSeenGuidingPrinciples');
    if (!hasSeenPrinciples) {
      setPrinciplesModalOpen(true);
    }
  }, []);

  const handleClosePrinciplesModal = () => {
    setPrinciplesModalOpen(false);
    localStorage.setItem('hasSeenGuidingPrinciples', 'true');
  };

  const Layout = () => {
    const { personas, activePersonaId, capacity } = useStore();
    const activePersona = useMemo(() => personas.find(p => p.id === activePersonaId), [personas, activePersonaId]);

    return (
      <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
        <GuidingPrinciplesModal isOpen={isPrinciplesModalOpen} onClose={handleClosePrinciplesModal} />
        <Sidebar onOpenPrinciples={() => setPrinciplesModalOpen(true)} />
        <main className="flex-1 relative flex flex-col min-w-0">
          <header className="h-16 border-b border-sovereign-800/30 bg-slate-900 flex items-center justify-between px-8 shadow-sm shrink-0 z-20">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-sovereign-600 tracking-widest">SESSION ID:</span>
              <span className="font-mono text-xs text-slate-400">{sessionId}</span>
            </div>
            
            {/* Persona and Capacity Status Display */}
            <div className="flex items-center space-x-4">
                {activePersona ? (
                    <div className="flex items-center space-x-2 text-xs text-center">
                        <span className="text-slate-500 font-mono">OPERATING AS:</span>
                        <span className="font-bold text-sovereign-300 font-mono">{activePersona.statutoryPersonaName}</span>
                        <span className="text-slate-500">/</span>
                        <span className="font-bold text-sovereign-400 font-mono uppercase">{capacity.activeCapacity}</span>
                    </div>
                ) : (
                     <div className="flex items-center space-x-2 text-xs text-center">
                        <span className="text-amber-500 font-mono">WARNING: NO ACTIVE PERSONA</span>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-sovereign-900/20 rounded border border-sovereign-800/50">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-sovereign-300 tracking-wide uppercase">Lawful Mode</span>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-hidden relative">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="topics" element={<TopicExplorer />} />
          <Route path="filing" element={<FilingNavigator />} />
          <Route path="remedy" element={<RemedyTracker />} />
          <Route path="remedy/:instanceId" element={<RemedyManager />} />
          <Route path="playbooks" element={<PlaybookNavigator />} />
          <Route path="identity" element={<PersonaManager />} />
          <Route path="trust" element={<TrustBuilder />} />
          <Route path="jarvis" element={<Jarvis />} />
          <Route path="dialogos" element={<Dialogos />} />
          <Route path="endorsement" element={<EndorsementStudio />} />
          <Route path="vault" element={<Vault />} />
          <Route path="knowledge" element={<KnowledgeView />} />
          <Route path="cognition" element={<CognitionConsole onArchive={addToArchive} />} />
          <Route path="drafter" element={<Drafter onArchive={addToArchive} />} />
          <Route path="drafter/:templateId" element={<Drafter onArchive={addToArchive} />} />
          <Route path="scripts" element={<ScriptList />} />
          <Route path="scripts/:scriptId" element={<ScriptViewer />} />
          <Route path="archive" element={<Archive entries={archive} />} />
          <Route path="foia" element={<FoiaGenerator />} />
          <Route path="bond-intelligence" element={<BondIntelligence />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;