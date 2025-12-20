import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Persona, ArchiveEntry } from '../types';
import { useNavigate } from 'react-router-dom';

const Vault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'instruments' | 'personas'>('instruments');
  const [selectedInstrument, setSelectedInstrument] = useState<ArchiveEntry | null>(null);
  
  const instruments = useStore((state) => state.archive);
  const personas = useStore((state) => state.personas);
  const navigate = useNavigate();

  const InstrumentCard = ({ item }: { item: ArchiveEntry }) => {
    const details = JSON.parse(item.details);
    return (
      <div className="bg-slate-900 border border-slate-800 rounded p-4 hover:border-sovereign-800/50 transition-colors shadow-lg flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${
              details.type === 'SignedDocument' ? 'bg-indigo-900/30 text-indigo-400 border-indigo-900' :
              'bg-emerald-900/30 text-emerald-400 border-emerald-900'
          }`}>
              {details.type || item.type}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
              {new Date(details.createdAt || item.timestamp).toLocaleDateString()}
          </span>
        </div>

        <div className="flex-1 bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs text-slate-400 mb-3 overflow-hidden relative h-24">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 opacity-50 pointer-events-none"></div>
            {details.contentText ? `${details.contentText.slice(0, 150)}...` : item.summary}
        </div>

        {details.bundleHash && (
            <div className="mb-2">
                <div className="text-[9px] text-slate-600 uppercase">Fingerprint</div>
                <div className="text-[9px] font-mono text-emerald-500 truncate">{details.bundleHash}</div>
            </div>
        )}
        
        {details.extracted && (
            <div className="mb-2">
                <div className="text-[9px] text-slate-600 uppercase">Extracted Data</div>
                <div className="text-[9px] font-mono text-sovereign-500">
                    {details.extracted.creditor || 'Unknown Creditor'} - {details.extracted.amountDue || 'N/A'}
                </div>
            </div>
        )}

        <button onClick={() => setSelectedInstrument(item)} className="w-full mt-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded border border-slate-700">
            VIEW DETAILS
        </button>
      </div>
    )
  }

  const InstrumentDetailModal = ({ item, onClose }: { item: ArchiveEntry, onClose: () => void }) => {
    const details = JSON.parse(item.details);
    const hasFinancialIds = details.financialIdentifiers && (details.financialIdentifiers.cusip || details.financialIdentifiers.bondNumber);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 border border-sovereign-700 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-2xl font-serif font-bold text-sovereign-200">{item.title}</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white">&times;</button>
          </div>
          <div className="space-y-4">
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap bg-slate-950 p-4 rounded border border-slate-800">{JSON.stringify(details, null, 2)}</pre>
            
            {hasFinancialIds && (
                 <div className="p-4 bg-amber-900/10 border border-amber-800/50 rounded-lg">
                    <h3 className="font-bold text-amber-400 mb-2">Financial Identifiers Found</h3>
                    {details.financialIdentifiers.cusip && <p className="text-xs font-mono text-slate-300">CUSIP: {details.financialIdentifiers.cusip}</p>}
                    {details.financialIdentifiers.bondNumber && <p className="text-xs font-mono text-slate-300">Bond #: {details.financialIdentifiers.bondNumber}</p>}
                </div>
            )}

            {details.caseNumber && (
              <button 
                onClick={() => navigate(`/foia?caseNumber=${encodeURIComponent(details.caseNumber)}&creditor=${encodeURIComponent(details.creditor || '')}`)}
                className="w-full mt-2 py-2 bg-sovereign-700 hover:bg-sovereign-600 text-white font-bold font-serif rounded shadow-lg"
              >
                Generate FOIA Request for Case: {details.caseNumber}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-slate-950 p-8 overflow-y-auto">
      {selectedInstrument && <InstrumentDetailModal item={selectedInstrument} onClose={() => setSelectedInstrument(null)} />}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-sovereign-800 pb-4">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded bg-sovereign-900/50 flex items-center justify-center border border-sovereign-700">
                    <svg className="w-6 h-6 text-sovereign-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-bold text-sovereign-200">Document Vault</h2>
                    <p className="text-sm text-slate-400 font-mono">Secured Instruments & Identities</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button 
                    onClick={() => setActiveTab('instruments')}
                    className={`px-4 py-2 rounded text-sm font-mono transition-colors ${activeTab === 'instruments' ? 'bg-sovereign-700 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-sovereign-600'}`}
                >
                    INSTRUMENTS
                </button>
                <button 
                    onClick={() => setActiveTab('personas')}
                    className={`px-4 py-2 rounded text-sm font-mono transition-colors ${activeTab === 'personas' ? 'bg-sovereign-700 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-sovereign-600'}`}
                >
                    PERSONAS
                </button>
            </div>
        </div>

        {activeTab === 'instruments' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instruments.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-slate-600 italic font-mono">
                        The Vault is empty. Process instruments via JARVIS or Endorsement Studio.
                    </div>
                ) : (
                    instruments.map((item) => <InstrumentCard key={item.id} item={item} />)
                )}
            </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {personas.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-slate-600 italic font-mono">
                        No personas established. Create one in the Identity Manager.
                    </div>
                ) : (
                    personas.map((p) => (
                        <div key={p.id} className="bg-slate-900 border border-slate-800 rounded p-6 hover:border-sovereign-800/50 transition-colors shadow-lg relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                 <svg className="w-24 h-24 text-sovereign-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            
                            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                                <h3 className="font-bold font-serif text-white text-lg">{p.tradeNameAllCaps}</h3>
                                <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-900/50">FICTION</span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase">Authorized Representative</div>
                                    <div className="text-sm font-mono text-emerald-400">{p.givenName} {p.familyName}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase">Mailing Location</div>
                                    <div className="text-sm font-sans text-slate-300">{p.mailingAddress}</div>
                                </div>
                            </div>

                            <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                <div className="text-[10px] text-sovereign-600 uppercase mb-1">Status Declaration</div>
                                <div className="text-xs text-slate-400 italic font-serif">"{p.domicileDeclaration}"</div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-600 font-mono">
                                <span>Created: {new Date(p.createdAt).toLocaleDateString()}</span>
                                <span>Key: {p.keyPairId}</span>
                            </div>
                        </div>
                    ))
                )}
             </div>
        )}
      </div>
    </div>
  );
};

export default Vault;