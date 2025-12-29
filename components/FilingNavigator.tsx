import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WORKFLOWS, Workflow, WorkflowStep } from '../data/workflows';
import { useStore } from '../lib/store';
import { Trust } from '../types';

const FilingNavigator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trusts = useStore((state) => state.trusts);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [selectedTrustId, setSelectedTrustId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const workflowId = params.get('workflowId');
    if (workflowId) {
      const workflow = WORKFLOWS.find(wf => wf.id === workflowId);
      if (workflow) {
        handleWorkflowSelect(workflow);
      }
    }
  }, [location.search]);

  const handleWorkflowSelect = (wf: Workflow) => {
    setSelectedWorkflow(wf);
    setActiveStepIndex(0);
    setCompletedSteps({});
    setSelectedTrustId(null);
  };

  const handleStepComplete = () => {
    if (!selectedWorkflow) return;
    const currentStep = selectedWorkflow.steps[activeStepIndex];
    setCompletedSteps(prev => ({ ...prev, [currentStep.id]: true }));
    
    if (activeStepIndex < selectedWorkflow.steps.length - 1) {
        setActiveStepIndex(prev => prev + 1);
    }
  };

  const handleStepClick = (index: number) => {
      if (index <= activeStepIndex || completedSteps[selectedWorkflow!.steps[index-1]?.id]) {
          setActiveStepIndex(index);
      }
  };

  const handleNavigateToDrafter = (templateId: string) => {
      let path = `/drafter/${templateId}`;
      if (selectedTrustId) {
          path += `?trustId=${selectedTrustId}`;
      }
      navigate(path);
  }

  const renderTrustSelector = () => {
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border border-sovereign-700">
            <label className="block text-sm font-bold text-sovereign-300 mb-2">Select a Trust</label>
            <select 
                value={selectedTrustId || ''}
                onChange={(e) => setSelectedTrustId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"
            >
                <option value="" disabled>-- Choose a trust to file for --</option>
                {trusts.map(trust => (
                    <option key={trust.id} value={trust.id}>{trust.name}</option>
                ))}
            </select>
            {trusts.length === 0 && <p className="text-xs text-amber-400 mt-2">No trusts found. Please create a trust in the Trust Builder first.</p>}
        </div>
    )
  }

  const activeStep = selectedWorkflow?.steps[activeStepIndex];

  return (
    <div className="flex h-full bg-slate-950">
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-serif font-bold text-sovereign-200 text-lg">Filing Navigator</h2>
          <p className="text-xs text-slate-500 font-mono mt-1">Guided procedural workflows.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {WORKFLOWS.map(wf => (
                <button
                    key={wf.id}
                    onClick={() => handleWorkflowSelect(wf)}
                    className={`w-full text-left p-3 rounded border transition-all ${
                        selectedWorkflow?.id === wf.id 
                            ? 'bg-sovereign-900/30 border-sovereign-500 text-sovereign-100' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                >
                    <h3 className="font-bold text-sm mb-1">{wf.title}</h3>
                    <p className="text-[10px] opacity-70 truncate">{wf.description}</p>
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto flex flex-col">
        {selectedWorkflow && activeStep ? (
            <div className="max-w-4xl mx-auto w-full">
                <header className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-sovereign-200 mb-2">{selectedWorkflow.title}</h1>
                </header>

                <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-4">
                    {selectedWorkflow.steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center shrink-0">
                             <div 
                                onClick={() => handleStepClick(idx)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer border-2 ${
                                    idx === activeStepIndex ? 'bg-sovereign-600 border-sovereign-600 text-white' : 'bg-slate-900 border-slate-700 text-slate-600'
                                }`}
                             >
                                {idx + 1}
                             </div>
                             {idx < selectedWorkflow.steps.length - 1 && <div className="w-12 h-0.5 mx-2 bg-slate-800"></div>}
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <span className="text-xs font-mono text-sovereign-500 uppercase">Step {activeStepIndex + 1}</span>
                    <h2 className="text-2xl font-serif font-bold text-white mt-1 mb-4">{activeStep.title}</h2>
                    <p className="text-slate-400 mb-6">{activeStep.description}</p>

                    {activeStep.requiresTrustSelection && renderTrustSelector()}

                    <div className="bg-slate-950/50 rounded-lg p-6 border border-slate-800">
                        <h3 className="text-xs font-bold text-emerald-500 uppercase mb-4">Instructions</h3>
                        <ul className="space-y-3 text-sm text-slate-300 font-mono">
                            {activeStep.instructions.map((inst, i) => (
                                <li key={i} className="flex items-start"><span className="mr-3 text-slate-600">{i+1}.</span>{inst}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6 flex gap-4">
                        {activeStep.recommendedTemplateId && (
                             <button 
                                onClick={() => handleNavigateToDrafter(activeStep.recommendedTemplateId!)}
                                disabled={activeStep.requiresTrustSelection && !selectedTrustId}
                                className="flex items-center space-x-2 bg-purple-900/20 hover:bg-purple-900/40 px-4 py-3 rounded border border-purple-900/50 transition-colors group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                 <div className="p-2 bg-purple-900/30 rounded">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                 </div>
                                 <div>
                                    <span className="text-xs text-white font-mono block">Open in Drafter &rarr;</span>
                                 </div>
                             </button>
                         )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                <p className="font-serif text-lg">Select a workflow to begin.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default FilingNavigator;
