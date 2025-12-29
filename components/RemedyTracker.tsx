import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import { REMEDY_DEFINITIONS } from '../data/remedies';
import { ActiveRemedy, RemedyDefinition } from '../types';

const RemedyTracker: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { activeRemedies, addRemedy } = useStore((state) => ({
      activeRemedies: state.remedies,
      addRemedy: state.addRemedy,
    }));

    useEffect(() => {
        const remedyToInitiate = searchParams.get('initiate');
        if (remedyToInitiate) {
            const remedyDef = REMEDY_DEFINITIONS.find(r => r.id === remedyToInitiate);
            if (remedyDef) {
                handleInitiateRemedy(remedyDef);
            }
            // Clear the query param after attempting to initiate
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    // Helper function to add business days
    const addBusinessDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      let addedDays = 0;
      while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        const dayOfWeek = result.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
          addedDays++;
        }
      }
      return result;
    };

    const handleInitiateRemedy = (remedyDef: RemedyDefinition) => {
      // Check if a remedy of this type for the same reference is already active
      const referenceNo = prompt(`Please enter the reference number (e.g., account #, case #) for this remedy:`);
      if (!referenceNo) {
        alert("A reference number is required to initiate a remedy.");
        return;
      }

      const isAlreadyActive = activeRemedies.some(ar => ar.remedyDefinitionId === remedyDef.id && ar.variables.referenceNo === referenceNo);
      if (isAlreadyActive) {
          alert(`A remedy for "${remedyDef.remedyName}" with reference "${referenceNo}" is already active.`);
          return;
      }

      const firstStep = remedyDef.steps[0];
      const newActiveRemedy: ActiveRemedy = {
        instanceId: crypto.randomUUID(),
        remedyDefinitionId: remedyDef.id,
        status: 'IN_PROGRESS', // Default status
        currentStepId: firstStep.id,
        startedAt: new Date().toISOString(),
        history: [],
        variables: {
          referenceNo: referenceNo,
        },
      };

      // If the first step is to wait for a response, set the deadline now.
      if (firstStep.action.type === 'AWAIT_RESPONSE') {
        const { days, unit } = firstStep.action.deadline;
        const deadlineDate = unit === 'business'
          ? addBusinessDays(new Date(), days)
          : new Date(new Date().setDate(new Date().getDate() + days));
        
        newActiveRemedy.deadline = deadlineDate.toISOString();
        newActiveRemedy.status = 'AWAITING_RESPONSE';
      }

      addRemedy(newActiveRemedy);
      alert(`Remedy "${remedyDef.remedyName}" has been initiated.`);
    };

    const getRemedyDefinition = (definitionId: string) => {
      return REMEDY_DEFINITIONS.find(def => def.id === definitionId);
    }

    return (
        <div className="h-full bg-slate-950 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-6">
                    <h1 className="text-3xl font-serif font-bold text-sovereign-200">Remedy Navigator</h1>
                    <p className="text-slate-400 font-mono text-sm">Initiate and track real-world administrative remedies.</p>
                </header>

                {/* Active Remedies Section */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-cyan-400 mb-4 font-serif">Active Processes</h2>
                    <div className="space-y-4">
                        {activeRemedies.length > 0 ? activeRemedies.map(ar => {
                            const def = getRemedyDefinition(ar.remedyDefinitionId);
                            const currentStep = def?.steps.find(s => s.id === ar.currentStepId);
                            return (
                                <div key={ar.instanceId} className="bg-slate-900 border border-slate-700/50 p-4 rounded-md flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-white">{def?.remedyName}</h3>
                                        <p className="text-xs text-slate-400 font-mono">REF: {ar.variables.referenceNo}</p>
                                        <div className="mt-2 text-xs font-mono">
                                            <span className="text-slate-500">Current Step: </span>
                                            <span className="font-semibold text-sovereign-300">{currentStep?.title}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                            ar.status === 'IN_PROGRESS' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                                            ar.status === 'AWAITING_RESPONSE' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                                            'bg-gray-900/30 text-gray-400 border-gray-800'
                                        }`}>
                                            {ar.status}
                                        </span>
                                        <button 
                                          onClick={() => navigate(`/remedy/${ar.instanceId}`)}
                                          className="mt-2 text-xs font-mono py-1 px-3 rounded border border-slate-600 hover:bg-cyan-600 hover:border-cyan-500 transition-colors">
                                            MANAGE
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p className="text-center text-slate-600 font-mono text-xs py-8">No active remedies. Select one from the library below to begin.</p>
                        )}
                    </div>
                </div>

                {/* Available Remedies (Remedy Library) */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-emerald-400 mb-4 font-serif">Remedy Library</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {REMEDY_DEFINITIONS.map(remedy => (
                            <div key={remedy.id} className="bg-slate-900 border border-slate-700/50 rounded-lg p-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-white mb-1">{remedy.remedyName}</h3>
                                    <p className="text-xs text-slate-400 font-mono mb-2">Authority: {remedy.statutoryAuthority}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Triggered by: {remedy.triggerEvent}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {remedy.tags.map(tag => (
                                            <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-sovereign-800/50 text-sovereign-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleInitiateRemedy(remedy)}
                                    className="w-full mt-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2 rounded shadow text-xs tracking-wider transition-colors"
                                >
                                    INITIATE
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemedyTracker;