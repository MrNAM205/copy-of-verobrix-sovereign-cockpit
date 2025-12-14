import { Playbook } from '../types';

export const initialPlaybooks: Playbook[] = [
    {
        id: 'pb-traffic-001',
        title: 'Traffic Ticket Sovereign Response',
        description: 'A tactical checklist for handling roadside encounters and citations using commercial and constitutional remedies.',
        category: 'TRAFFIC',
        tags: ['jurisdiction', 'UCC', 'travel', 'rights'],
        steps: [
            {
                id: 'step-1',
                order: 1,
                title: 'Jurisdiction Challenge',
                action: 'Assert standing and challenge subject matter jurisdiction immediately.',
                rationale: 'Without a damaged party or verified contract, the court lacks subject matter jurisdiction over a sovereign.',
                riskLevel: 'Medium',
                source: 'Murdock v. Pennsylvania (License vs. Liberty)',
                duration: 'On Encounter',
                completed: false
            },
            {
                id: 'step-2',
                order: 2,
                title: 'Conditional Acceptance',
                action: 'Accept the presentment (ticket) for value upon proof of claim.',
                rationale: 'Avoids dishonor while shifting the burden of proof back to the claimant.',
                riskLevel: 'Low',
                source: 'UCC 3-501 (Presentment)',
                duration: 'Within 72 Hours',
                completed: false
            },
            {
                id: 'step-3',
                order: 3,
                title: 'Tender of Remedy',
                action: 'Remit the instrument with a specialized endorsement/payment bond if applicable.',
                rationale: 'Discharges the debt obligation created by the citation.',
                riskLevel: 'High',
                source: 'HJR 192 / UCC 3-603',
                duration: 'Before Court Date',
                completed: false
            },
            {
                id: 'step-4',
                order: 4,
                title: 'Preserve Objection',
                action: 'Sign all documents with "All Rights Reserved" or "Without Prejudice".',
                rationale: 'Prevents the waiver of common law rights and establishment of unconscious contracts.',
                riskLevel: 'Low',
                source: 'UCC 1-308 (Performance or Acceptance under Reservation of Rights)',
                duration: 'Always',
                completed: false
            }
        ]
    }
];
