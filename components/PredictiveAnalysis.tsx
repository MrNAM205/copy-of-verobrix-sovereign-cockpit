import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { getPredictiveAnalysis } from '../services/geminiService';
import { MISSION_PLAYBOOKS } from '../data/playbooks';

const PredictiveAnalysis: React.FC = () => {
  const { missions } = useStore();
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async () => {
    if (missions.length === 0) {
      alert('No active missions to analyze.');
      return;
    }
    setLoading(true);
    setAnalysis('');

    // For simplicity, we analyze the first active mission
    const missionToAnalyze = missions[0];
    const playbook = MISSION_PLAYBOOKS.find(p => p.id === missionToAnalyze.playbookId);
    
    const context = `
      Mission: ${playbook?.missionName}
      Objective: ${playbook?.objective}
      Current Step: ${missionToAnalyze.currentStepOrder} - ${playbook?.steps.find(s => s.order === missionToAnalyze.currentStepOrder)?.title}
      Status: ${missionToAnalyze.status}
    `;

    const result = await getPredictiveAnalysis(context);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-sm font-bold text-sovereign-400 uppercase tracking-widest mb-4">
        Predictive Analysis
      </h3>
      <button
        onClick={handleAnalysis}
        disabled={loading || missions.length === 0}
        className="w-full mb-4 bg-indigo-800 hover:bg-indigo-700 text-white font-bold py-2 rounded shadow text-xs tracking-wider transition-colors disabled:opacity-50"
      >
        {loading ? 'ANALYZING...' : 'GET STRATEGIC BRIEFING'}
      </button>
      <div className="bg-slate-950 border border-slate-700/50 rounded p-4 min-h-[150px]">
        {analysis ? (
          <pre className="text-xs font-mono text-indigo-300 whitespace-pre-wrap">
            {analysis}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-600 font-mono text-xs">
            Awaiting analysis on active mission...
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveAnalysis;
