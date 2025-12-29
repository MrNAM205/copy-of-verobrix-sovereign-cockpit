import { useEffect } from 'react';
import { useStore } from '../lib/store';
import { REMEDY_DEFINITIONS } from '../data/remedies';
import { ActiveRemedy } from '../types';

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

export const useTimelineEngine = () => {
  const { activeRemedies, updateRemedy } = useStore((state) => ({
    activeRemedies: state.remedies,
    updateRemedy: state.updateRemedy,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      activeRemedies.forEach(remedy => {
        if (remedy.status === 'AWAITING_RESPONSE' && remedy.deadline) {
          const deadlineDate = new Date(remedy.deadline);

          if (now > deadlineDate) {
            console.log(`Deadline passed for remedy: ${remedy.instanceId}`);
            
            const definition = REMEDY_DEFINITIONS.find(def => def.id === remedy.remedyDefinitionId);
            const currentStep = definition?.steps.find(s => s.id === remedy.currentStepId);

            if (definition && currentStep && currentStep.nextStep.onFailure) {
              const nextStepId = currentStep.nextStep.onFailure;
              const nextStep = definition.steps.find(s => s.id === nextStepId);

              if (nextStep) {
                const updatedRemedy: ActiveRemedy = {
                  ...remedy,
                  status: 'ESCALATED', // Or determine from next step
                  currentStepId: nextStepId,
                  history: [
                    ...remedy.history,
                    {
                      stepId: remedy.currentStepId,
                      completedAt: new Date().toISOString(),
                      result: 'failure',
                      notes: 'Deadline passed (Constructive Denial).',
                    },
                  ],
                  deadline: undefined, // Clear the deadline until a new one is set
                };
                
                // If the new step has a deadline, set it
                if (nextStep.action.type === 'AWAIT_RESPONSE') {
                  const newDeadline = nextStep.action.deadline.unit === 'business'
                    ? addBusinessDays(new Date(), nextStep.action.deadline.days)
                    : new Date(new Date().setDate(new Date().getDate() + nextStep.action.deadline.days));
                  updatedRemedy.deadline = newDeadline.toISOString();
                  updatedRemedy.status = 'AWAITING_RESPONSE';
                }

                updateRemedy(updatedRemedy);
                console.log(`Remedy ${remedy.instanceId} escalated to step: ${nextStep.title}`);
              }
            }
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [activeRemedies, updateRemedy]);
};
