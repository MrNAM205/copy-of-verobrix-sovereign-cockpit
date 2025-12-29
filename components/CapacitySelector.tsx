import React from 'react';
import { useStore } from '../lib/store';
import { LegalCapacity, SignatureMode, JurisdictionalContext } from '../types';

const CapacitySelector: React.FC = () => {
  const { capacity, setCapacity } = useStore();

  const handleCapacityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCapacity = e.target.value as LegalCapacity;
    setCapacity({ activeCapacity: newCapacity });

    // Also update signature mode to match if logical
    if (newCapacity === LegalCapacity.INDIVIDUAL) {
      setCapacity({ activeSignatureMode: SignatureMode.INDIVIDUAL });
    } else if (newCapacity === LegalCapacity.REPRESENTATIVE) {
      setCapacity({ activeSignatureMode: SignatureMode.REPRESENTATIVE });
    } else if (newCapacity === LegalCapacity.TRUSTEE) {
      setCapacity({ activeSignatureMode: SignatureMode.TRUSTEE });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-6 shadow-lg">
      <h3 className="text-sm font-bold text-sovereign-400 uppercase tracking-widest mb-4">
        Operational Capacity
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-mono">
            Acting In Capacity Of
          </label>
          <select
            value={capacity.activeCapacity}
            onChange={handleCapacityChange}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-sm focus:border-sovereign-500 focus:outline-none"
          >
            {Object.values(LegalCapacity).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-mono">
            Signature Mode
          </label>
          <select
            value={capacity.activeSignatureMode}
            onChange={(e) => setCapacity({ activeSignatureMode: e.target.value as SignatureMode })}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-sm focus:border-sovereign-500 focus:outline-none"
          >
            {Object.values(SignatureMode).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-mono">
            Jurisdictional Context
          </label>
          <select
            value={capacity.activeJurisdiction}
            onChange={(e) => setCapacity({ activeJurisdiction: e.target.value as JurisdictionalContext })}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-sm focus:border-sovereign-500 focus:outline-none"
          >
            {Object.values(JurisdictionalContext).map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-mono">
            Authority Source
          </label>
          <input
            type="text"
            value={capacity.authoritySource}
            onChange={(e) => setCapacity({ authoritySource: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-sm focus:border-sovereign-500 focus:outline-none"
            placeholder="e.g., Agency Law, UCC § 1-308"
          />
        </div>
      </div>
       <p className="text-[10px] text-slate-500 mt-4 italic">
          Your selected capacity determines the legal context and signature format for all generated documents and scripts.
      </p>
    </div>
  );
};

export default CapacitySelector;
