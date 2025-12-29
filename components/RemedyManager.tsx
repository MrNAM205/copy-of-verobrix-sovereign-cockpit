import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { REMEDY_DEFINITIONS } from '../data/remedies';
import { ActiveRemedy, RemedyDefinition, RemedyStep } from '../types';

const RemedyManager: React.FC = () => {
  const { instanceId } = useParams<{ instanceId: string }>();
  const navigate = useNavigate();

  const { remedy, definition, updateRemedy } = useStore(state => {
    const remedyInstance = state.remedies.find(r => r.instanceId === instanceId);
    const remedyDef = remedyInstance ? REMEDY_DEFINITIONS.find(def => def.id === remedyInstance.remedyDefinitionId) : undefined;
    return {
      remedy: remedyInstance,
      definition: remedyDef,
      updateRemedy: state.updateRemedy,
    };
  });

  if (!remedy || !definition) {
    return (
      <div className="h-full bg-slate-950 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="text-slate-400">Remedy process not found.</p>
          <button onClick={() => navigate('/remedy')} className="mt-4 text-xs font-mono py-1 px-3 rounded border border-slate-600 hover:bg-cyan-600">
            Return to Navigator
          </button>
        </div>
      </div>
    );
  }

  const currentStep = definition.steps.find(s => s.id === remedy.currentStepId);

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

  const handleAdvanceStep = (result: 'success' | 'failure') => {
    if (!currentStep) return;

    const nextStepId = result === 'success' ? currentStep.nextStep.onSuccess : currentStep.nextStep.onFailure;
    if (!nextStepId) {
        // This is an end step
        const finalStatus = result === 'success' ? 'CLOSED_SUCCESS' : 'CLOSED_FAILURE';
        const updatedRemedy: ActiveRemedy = {
            ...remedy,
            status: finalStatus,
            history: [...remedy.history, { stepId: currentStep.id, completedAt: new Date().toISOString(), result }],
        };
        updateRemedy(updatedRemedy);
        return;
    }

    const nextStep = definition.steps.find(s => s.id === nextStepId);
    if (!nextStep) return;

    const updatedRemedy: ActiveRemedy = {
      ...remedy,
      currentStepId: nextStepId,
      status: 'IN_PROGRESS', // Default for the new step
      history: [...remedy.history, { stepId: currentStep.id, completedAt: new Date().toISOString(), result }],
      deadline: undefined, // Clear previous deadline
    };

    if (nextStep.action.type === 'AWAIT_RESPONSE') {
      const { days, unit } = nextStep.action.deadline;
      const deadlineDate = unit === 'business'
        ? addBusinessDays(new Date(), days)
        : new Date(new Date().setDate(new Date().getDate() + days));
      
      updatedRemedy.deadline = deadlineDate.toISOString();
      updatedRemedy.status = 'AWAITING_RESPONSE';
    }

    updateRemedy(updatedRemedy);
  };

  const renderActionUI = () => {
    if (!currentStep) return <p className="text-sm text-red-500">Error: Current step is undefined.</p>;

    switch (currentStep.action.type) {
      case 'GENERATE_DOCUMENT':
        return (
          <div className="space-y-3">
            <p className="text-xs font-mono text-slate-400">This step requires generating a specific document.</p>
            <button
              onClick={() => navigate(`/drafter/${currentStep.action.templateId}`)}
              className="w-full bg-sovereign-700 hover:bg-sovereign-600 text-white font-bold py-2 rounded shadow text-sm"
            >
              Go to Drafter
            </button>
            <p className="text-center text-xs text-slate-500">--- OR ---</p>
            <button
              onClick={() => handleAdvanceStep('success')}
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-2 rounded text-sm"
            >
              Mark as Completed & Sent
            </button>
          </div>
        );
      case 'AWAIT_RESPONSE':
        return (
          <div>
            <p className="text-xs font-mono text-slate-400 mb-2">The process is now paused, awaiting a response.</p>
            <div className="text-center">
              <div className="text-slate-500 text-sm">Deadline</div>
              <div className="text-xl font-bold text-amber-400">
                {remedy.deadline ? new Date(remedy.deadline).toLocaleDateString() : 'N/A'}
              </div>
               <p className="text-[10px] text-slate-600 mt-1">If no response is received by this date, the process will automatically escalate.</p>
            </div>
          </div>
        );
      case 'USER_ACTION':
        return (
            <div className="space-y-3">
                <p className="text-xs font-mono text-slate-400">This step requires a manual action from you as described above.</p>
                <button
                    onClick={() => handleAdvanceStep('success')}
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-2 rounded text-sm"
                >
                    Mark as Completed
                </button>
          </div>
        );
      default:
        return <p className="text-sm text-slate-500">No action defined for this step.</p>;
    }
  };

  return (
    <div className="h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <button onClick={() => navigate('/remedy')} className="text-xs font-mono text-cyan-400 hover:underline mb-2">
            &larr; Back to Remedy Navigator
          </button>
          <h1 className="text-3xl font-serif font-bold text-sovereign-200">{definition.remedyName}</h1>
          <p className="text-slate-400 font-mono text-sm">REF: {remedy.variables.referenceNo}</p>
        </header>

        {/* Current Step Action Card */}
        <div className="bg-slate-900 border border-sovereign-700 rounded-lg p-6">
            <h2 className="text-lg font-bold text-sovereign-300 mb-2 font-serif">Current Task: {currentStep?.title}</h2>
            <p className="text-sm text-slate-400 mb-4">{currentStep?.description}</p>
            <div className="bg-slate-950/50 border border-slate-700/50 rounded p-4">
                {renderActionUI()}
            </div>
        </div>
        
        {/* Full Timeline */}
        <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Full Timeline</h3>
            {definition.steps.map(step => (
                 <div key={step.id} className={`p-3 rounded border ${step.id === currentStep?.id ? 'bg-slate-800/50 border-slate-700' : 'bg-transparent border-transparent'}`}>
                    <h4 className="font-bold text-sm text-slate-200">{step.title}</h4>
                    <p className="text-xs text-slate-500">{step.description}</p>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default RemedyManager;
