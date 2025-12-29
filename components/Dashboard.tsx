import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { MISSION_PLAYBOOKS } from '../data/playbooks';
import { ActiveMission, MissionPlaybook } from '../types';
import CapacitySelector from './CapacitySelector';
import PredictiveAnalysis from './PredictiveAnalysis';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { missions, addMission, activeRemedies } = useStore(state => ({
    missions: state.missions,
    addMission: state.addMission,
    activeRemedies: state.remedies,
  }));

  const handleLaunchMission = (playbook: MissionPlaybook) => {
    const referenceNo = prompt(`Enter a reference number for this mission (e.g., account #, case #):`);
    if (!referenceNo) return;

    const newMission: ActiveMission = {
      instanceId: crypto.randomUUID(),
      playbookId: playbook.id,
      status: 'IN_PROGRESS',
      currentStepOrder: 1,
      activeRemedyInstanceId: null, // The orchestrator will handle this
      startedAt: new Date().toISOString(),
      variables: { referenceNo },
    };

    addMission(newMission);
    alert(`Mission "${playbook.missionName}" launched!`);
    // In a real scenario, the orchestrator would now kick off the first remedy
  };

  const getActiveRemedyForMission = (mission: ActiveMission) => {
    return activeRemedies.find(r => r.instanceId === mission.activeRemedyInstanceId);
  }

  return (
    <div className="h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="text-left">
              <h1 className="text-4xl font-serif font-bold text-sovereign-200">Mission Dashboard</h1>
              <p className="text-slate-400 font-mono text-sm">Command & Control for Sovereign Operations</p>
          </div>

          {/* Active Missions */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-cyan-400 mb-4 font-serif">Active Missions</h2>
            <div className="space-y-4">
              {missions.length > 0 ? missions.map(mission => {
                const playbook = MISSION_PLAYBOOKS.find(p => p.id === mission.playbookId);
                const currentStep = playbook?.steps.find(s => s.order === mission.currentStepOrder);
                const totalSteps = playbook?.steps.length || 0;
                const progress = totalSteps > 0 ? (mission.currentStepOrder / totalSteps) * 100 : 0;

                return (
                  <div key={mission.instanceId} className="bg-slate-900 border border-slate-700/50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-white">{playbook?.missionName}</h3>
                      <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border bg-blue-900/30 text-blue-400 border-blue-800">
                        {mission.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs font-mono text-slate-400">
                      <p>Objective: {playbook?.objective}</p>
                      <p>Current Step: <span className="text-sovereign-300">{currentStep?.title}</span></p>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                            <span>Progress</span>
                            <span>Step {mission.currentStepOrder} of {totalSteps}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                     <button 
                        onClick={() => mission.activeRemedyInstanceId && navigate(`/remedy/${mission.activeRemedyInstanceId}`)}
                        disabled={!mission.activeRemedyInstanceId}
                        className="w-full mt-4 bg-cyan-800 hover:bg-cyan-700 text-white font-bold py-2 rounded shadow text-xs tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        MANAGE CURRENT REMEDY
                     </button>
                  </div>
                )
              }) : (
                <p className="text-center text-slate-600 font-mono text-xs py-8">No active missions. Launch one from the Playbook Library.</p>
              )}
            </div>
          </div>
          
          {/* Available Playbooks */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-emerald-400 mb-4 font-serif">Playbook Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MISSION_PLAYBOOKS.map(playbook => (
                <div key={playbook.id} className="bg-slate-900 border border-slate-700/50 p-4 rounded-md flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white">{playbook.missionName}</h3>
                    <p className="text-xs text-slate-400 mt-1">{playbook.objective}</p>
                  </div>
                  <button 
                    onClick={() => handleLaunchMission(playbook)}
                    className="w-full mt-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2 rounded shadow text-xs tracking-wider transition-colors">
                    LAUNCH MISSION
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
            <CapacitySelector />
            <PredictiveAnalysis />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;