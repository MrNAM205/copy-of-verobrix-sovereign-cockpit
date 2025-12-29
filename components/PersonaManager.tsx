import React, { useState } from 'react';
import { Persona } from '../types';
import { useStore } from '../lib/store';
import StatusSelector from './StatusSelector';

const PersonaManager: React.FC = () => {
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [statutoryPersonaName, setStatutoryPersonaName] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');
  const [domicileDeclaration, setDomicileDeclaration] = useState('Domiciled on the land and soil of [State], a constituent republic of the Union, without the United States.');

  const { personas, activePersonaId, addPersona, setActivePersona } = useStore((state) => ({
    personas: state.personas,
    activePersonaId: state.activePersonaId,
    addPersona: state.addPersona,
    setActivePersona: state.setActivePersona,
  }));

    const handleSave = () => {
      if (!givenName || !familyName || !statutoryPersonaName) {
          alert("Please complete the core identity fields.");
          return;
      }
  
          const persona: Persona = {
            id: crypto.randomUUID(),
            givenName,
            familyName,
            statutoryPersonaName: statutoryPersonaName,
            mailingAddress,
            domicileDeclaration,
            keyPairId: 'default', // Placeholder for future crypto integration
            createdAt: new Date().toISOString()
          };      addPersona(persona);
      
      // Reset form
      setGivenName('');
      setFamilyName('');
      setStatutoryPersonaName('');
      setMailingAddress('');
      alert('Persona identity secured in Vault.');
    };
  return (
    <div className="h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4 border-b border-sovereign-800 pb-4">
            <div className="w-10 h-10 rounded bg-sovereign-900/50 flex items-center justify-center border border-sovereign-700">
                <svg className="w-6 h-6 text-sovereign-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h2 className="text-2xl font-serif font-bold text-sovereign-200">Identity Manager</h2>
                <p className="text-sm text-slate-400 font-mono">Define Personas for Individual and Representative Capacities</p>
            </div>
        </div>

        {/* Personas List */}
        <div className="bg-slate-900 border border-slate-800 rounded p-6 shadow-lg">
            <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-4">Active Personas</h3>
            <div className="space-y-2">
                {personas.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No persona profiles created. Define one below to begin.</p>
                )}
                {personas.map((p) => (
                    <div
                        key={p.id}
                        className={`flex items-center justify-between p-3 rounded border ${
                            activePersonaId === p.id
                                ? 'bg-sovereign-800/50 border-sovereign-700'
                                : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                        }`}
                    >
                        <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-3 ${activePersonaId === p.id ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                            <div>
                                <p className="font-mono text-slate-200 text-sm">{p.statutoryPersonaName}</p>
                                <p className="text-xs text-slate-400 font-mono">{p.givenName} {p.familyName}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActivePersona(p.id)}
                            disabled={activePersonaId === p.id}
                            className="text-xs font-mono py-1 px-3 rounded border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 hover:border-cyan-500 transition-colors"
                        >
                            {activePersonaId === p.id ? 'ACTIVE' : 'SELECT'}
                        </button>
                    </div>
                ))}
            </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded p-6 shadow-lg">
                    <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        Individual Capacity (Principal)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 font-mono">Given Name(s)</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-sm focus:border-emerald-500 focus:outline-none"
                                placeholder="John-Henry"
                                value={givenName}
                                onChange={e => setGivenName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 font-mono">Family Name</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-sm focus:border-emerald-500 focus:outline-none"
                                placeholder="Doe"
                                value={familyName}
                                onChange={e => setFamilyName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 font-mono">Affidavit of Domicile</label>
                            <textarea
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-sm focus:border-emerald-500 focus:outline-none h-24"
                                placeholder="e.g., Domiciled on the land and soil of..."
                                value={domicileDeclaration}
                                onChange={e => setDomicileDeclaration(e.target.value)}
                            />
                            <p className="text-[10px] text-slate-500 mt-1 italic">For use in affidavits; not for postal delivery.</p>
                        </div>
                    </div>
                </div>
                <StatusSelector />
            </div>

            <div className="space-y-6">
                 <div className="bg-slate-900 border border-slate-800 rounded p-6 shadow-lg">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Statutory Persona (Agent)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 font-mono">Statutory Persona Name (e.g., ALL CAPS)</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-sm focus:border-red-500 focus:outline-none uppercase"
                                placeholder="JOHN HENRY DOE"
                                value={statutoryPersonaName}
                                onChange={e => setStatutoryPersonaName(e.target.value.toUpperCase())}
                            />
                        </div>
                         <div>
                            <label className="block text-xs text-slate-400 mb-1 font-mono">Mailing Address (for service)</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-sm focus:border-red-500 focus:outline-none"
                                placeholder="123 Main St, City, State ZIP"
                                value={mailingAddress}
                                onChange={e => setMailingAddress(e.target.value)}
                            />
                            <p className="text-[10px] text-slate-500 mt-1 italic">
                                A deliverable address for receiving official notices.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-sovereign-900/10 border border-sovereign-800/30 rounded p-4">
                    <h4 className="text-xs font-bold text-sovereign-400 uppercase mb-2">Operational Note</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        This distinction allows the Individual (principal) to act in a Representative Capacity for the Statutory Persona (agent), managing administrative tasks without co-mingling personal and commercial liabilities.
                    </p>
                </div>

                <button 
                    onClick={handleSave}
                    className="w-full py-3 bg-sovereign-700 hover:bg-sovereign-600 text-white font-bold font-serif rounded shadow-lg transition-all"
                >
                    SAVE PERSONA PROFILE
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaManager;
