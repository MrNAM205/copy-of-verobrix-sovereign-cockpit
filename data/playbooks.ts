import { MissionPlaybook, LegalCapacity } from '../types';

export const MISSION_PLAYBOOKS: MissionPlaybook[] = [
  {
    id: 'MISSION-FOIA-01',
    missionName: 'FOIA Records Acquisition',
    objective: 'Obtain specific records from a federal agency, handling denials and escalations.',
    requiredPersona: [LegalCapacity.REPRESENTATIVE, LegalCapacity.INDIVIDUAL],
    tags: ['foia', 'records', 'mission'],
    steps: [
      {
        order: 1,
        title: 'Initial Request',
        remedyDefinitionId: 'FOIA-REQUEST-01',
        transitions: {
          onSuccess: 'COMPLETE', // If the first request succeeds, the mission is over.
          onFailure: 2,          // If it fails, move to step 2 (Appeal).
        },
      },
      {
        order: 2,
        title: 'Administrative Appeal',
        remedyDefinitionId: 'FOIA-APPEAL-01',
        transitions: {
          onSuccess: 'COMPLETE',
          onFailure: 'FAIL',
        },
      },
    ],
  },
  {
    id: 'MISSION-FDCPA-01',
    missionName: 'Neutralize Collection Attempt',
    objective: 'Challenge a third-party debt collector and escalate if they fail to validate the debt.',
    requiredPersona: [LegalCapacity.REPRESENTATIVE],
    tags: ['fdcpa', 'debt', 'collection', 'mission'],
    steps: [
        {
            order: 1,
            title: 'Debt Validation',
            remedyDefinitionId: 'FDCPA-DV-01',
            transitions: {
                onSuccess: 'COMPLETE', // The collector validated or ceased collection.
                onFailure: 'FAIL',     // The user failed to send the letter in time.
            }
        }
        // Note: The FDCPA remedy itself contains the escalation step to the CFPB.
        // A more complex mission could chain a successful validation into a credit report cleanup mission.
    ]
  },
  // More missions can be added here...
];