import { useEffect } from 'react';
import { useStore } from '../lib/store';
import { MISSION_PLAYBOOKS } from '../data/playbooks';
import { REMEDY_DEFINITIONS } from '../data/remedies';
import { ActiveRemedy, ActiveMission } from '../types';

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

export const useMissionOrchestrator = () => {
  const { missions, remedies, addRemedy, updateRemedy, updateMission } = useStore();

  useEffect(() => {
    // Check all missions to see if any require orchestration
    missions.forEach(mission => {
      if (mission.status !== 'IN_PROGRESS') {
        return; // Mission is already completed or failed
      }

      const playbook = MISSION_PLAYBOOKS.find(p => p.id === mission.playbookId);
      if (!playbook) return;

      const currentMissionStep = playbook.steps.find(s => s.order === mission.currentStepOrder);
      if (!currentMissionStep) return;

      const activeRemedy = remedies.find(r => r.instanceId === mission.activeRemedyInstanceId);

      // Case 1: New mission, no active remedy. Start the first one.
      if (!activeRemedy) {
        const remedyDef = REMEDY_DEFINITIONS.find(rd => rd.id === currentMissionStep.remedyDefinitionId);
        if (!remedyDef) return;

        const firstRemedyStep = remedyDef.steps[0];
        const newRemedy: ActiveRemedy = {
          instanceId: crypto.randomUUID(),
          remedyDefinitionId: remedyDef.id,
          status: 'IN_PROGRESS',
          currentStepId: firstRemedyStep.id,
          startedAt: new Date().toISOString(),
          history: [],
          variables: { ...mission.variables }, // Pass mission variables to the remedy
        };

        if (firstRemedyStep.action.type === 'AWAIT_RESPONSE') {
          const { days, unit } = firstRemedyStep.action.deadline;
          newRemedy.deadline = (unit === 'business' ? addBusinessDays(new Date(), days) : new Date(new Date().setDate(new Date().getDate() + days))).toISOString();
          newRemedy.status = 'AWAITING_RESPONSE';
        }
        
        addRemedy(newRemedy);
        updateMission({ ...mission, activeRemedyInstanceId: newRemedy.instanceId });
        console.log(`Orchestrator: Started remedy '${remedyDef.remedyName}' for mission '${playbook.missionName}'.`);
      }
      // Case 2: Active remedy has finished. Time to transition.
      else if (activeRemedy.status === 'CLOSED_SUCCESS' || activeRemedy.status === 'CLOSED_FAILURE') {
        const result = activeRemedy.status === 'CLOSED_SUCCESS' ? 'onSuccess' : 'onFailure';
        const nextStepOrder = currentMissionStep.transitions[result];

        if (nextStepOrder === 'COMPLETE') {
          updateMission({ ...mission, status: 'COMPLETED', activeRemedyInstanceId: null });
          console.log(`Orchestrator: Mission '${playbook.missionName}' completed successfully.`);
        } else if (nextStepOrder === 'FAIL') {
          updateMission({ ...mission, status: 'FAILED', activeRemedyInstanceId: null });
          console.log(`Orchestrator: Mission '${playbook.missionName}' failed.`);
        } else {
          // Transition to the next remedy in the sequence
          const nextMissionStep = playbook.steps.find(s => s.order === nextStepOrder);
          if (nextMissionStep) {
            // "Deactivate" the old remedy link and update the mission step
            updateMission({ ...mission, currentStepOrder: nextMissionStep.order, activeRemedyInstanceId: null });
            console.log(`Orchestrator: Advancing mission '${playbook.missionName}' to step ${nextMissionStep.order}.`);
            // The logic will loop back on the next render and trigger Case 1 for the new step.
          }
        }
      }
    });
  }, [missions, remedies, addRemedy, updateRemedy, updateMission]);
};
