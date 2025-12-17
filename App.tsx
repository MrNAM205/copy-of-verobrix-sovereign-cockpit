import { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KnowledgeView from './components/KnowledgeView';
import CognitionConsole from './components/CognitionConsole';
import Drafter from './components/Drafter';
import ScriptViewer from './components/ScriptViewer';
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
import { useStore } from './lib/store';

const App: React.FC = () => {
  const sessionId = useMemo(() => `0x${Date.now().toString(16).toUpperCase()}`, []);
  const { archive, addToArchive } = useStore();

  const Layout = () => (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative flex flex-col min-w-0">
        <header className="h-16 border-b border-sovereign-800/30 bg-slate-900 flex items-center justify-between px-8 shadow-sm shrink-0 z-20">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-sovereign-600 tracking-widest">SESSION ID:</span>
            <span className="font-mono text-xs text-slate-400">{sessionId}</span>
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="topics" element={<TopicExplorer />} />
          <Route path="filing" element={<FilingNavigator />} />
          <Route path="remedy" element={<RemedyTracker />} />
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
          <Route path="scripts/:scriptId" element={<ScriptViewer />} />
          <Route path="archive" element={<Archive entries={archive} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;