import { RemedyDefinition, JurisdictionalContext, LegalCapacity } from '../types';

export const REMEDY_DEFINITIONS: RemedyDefinition[] = [
  // 1a. FOIA Initial Request
  {
    id: 'FOIA-REQUEST-01',
    remedyName: 'FOIA Initial Request',
    jurisdictionType: JurisdictionalContext.ADMINISTRATIVE,
    statutoryAuthority: '5 U.S.C. § 552',
    requiredCapacity: [LegalCapacity.REPRESENTATIVE, LegalCapacity.INDIVIDUAL],
    triggerEvent: 'Need for federal agency records.',
    tags: ['foia', 'records', 'federal', 'request'],
    steps: [
      {
        id: 'foia-req-step-1',
        order: 1,
        title: 'Draft & Send FOIA Request',
        description: 'Generate and send a formal request for records to the target federal agency.',
        action: {
          type: 'GENERATE_DOCUMENT',
          templateId: 'FOIA_REQUEST_TEMPLATE',
        },
        successConditions: ['Document is generated and marked as sent by the user.'],
        failureConditions: [],
        nextStep: {
          onSuccess: 'foia-req-step-2',
          onFailure: 'foia-req-end-failure',
        },
      },
      {
        id: 'foia-req-step-2',
        order: 2,
        title: 'Await Agency Response',
        description: 'The agency has 20 business days to respond to the request.',
        action: {
          type: 'AWAIT_RESPONSE',
          deadline: {
            days: 20,
            unit: 'business',
          },
        },
        successConditions: ['Agency provides a final determination or records within the deadline.'],
        failureConditions: ['Agency fails to respond (Constructive Denial) or denies the request.'],
        nextStep: {
          onSuccess: 'foia-req-end-success',
          onFailure: 'foia-req-end-failure', 
        },
      },
      {
        id: 'foia-req-end-success',
        order: 99,
        title: 'Request Successful',
        description: 'The agency has responded with records. The remedy is complete.',
        action: { type: 'USER_ACTION', description: 'Review the provided records. Archive this remedy process.' },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
      {
        id: 'foia-req-end-failure',
        order: 100,
        title: 'Request Failed or Denied',
        description: 'The agency denied the request or failed to respond in time.',
        action: { type: 'USER_ACTION', description: 'This remedy is complete. You may now start an appeal mission.' },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
    ],
  },
  // 1b. FOIA Appeal
  {
    id: 'FOIA-APPEAL-01',
    remedyName: 'FOIA Appeal',
    jurisdictionType: JurisdictionalContext.ADMINISTRATIVE,
    statutoryAuthority: '5 U.S.C. § 552(a)(6)(A)',
    requiredCapacity: [LegalCapacity.REPRESENTATIVE, LegalCapacity.INDIVIDUAL],
    triggerEvent: 'A FOIA request was denied or constructively denied (no response).',
    tags: ['foia', 'records', 'federal', 'appeal'],
    steps: [
      {
        id: 'foia-app-step-1',
        order: 1,
        title: 'Draft & Send FOIA Appeal',
        description: 'Generate and send an appeal for the denial or constructive denial of your FOIA request.',
        action: {
          type: 'GENERATE_DOCUMENT',
          templateId: 'FOIA_APPEAL_DENIAL_TEMPLATE',
        },
        successConditions: ['Appeal is generated and sent.'],
        failureConditions: [],
        nextStep: {
          onSuccess: 'foia-app-step-2',
          onFailure: 'foia-app-end-failure',
        },
      },
      {
        id: 'foia-app-step-2',
        order: 2,
        title: 'Await Appeal Response',
        description: 'The agency has 20 business days to respond to the appeal.',
        action: {
          type: 'AWAIT_RESPONSE',
          deadline: {
            days: 20,
            unit: 'business',
          },
        },
        successConditions: ['Agency provides a final determination or records.'],
        failureConditions: ['Agency fails to respond to the appeal.'],
        nextStep: {
          onSuccess: 'foia-app-end-success',
          onFailure: 'foia-app-end-failure',
        },
      },
      {
        id: 'foia-app-end-success',
        order: 99,
        title: 'Appeal Successful',
        description: 'The agency has responded to the appeal with records.',
        action: { type: 'USER_ACTION', description: 'Review the provided records. Archive this remedy process.' },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
      {
        id: 'foia-app-end-failure',
        order: 100,
        title: 'Appeal Unsuccessful',
        description: 'The agency upheld its denial or failed to respond. Further action may require litigation.',
        action: { type: 'USER_ACTION', description: 'Consult legal counsel to determine next steps. Archive this remedy.' },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
    ],
  },

  // 2. FDCPA Debt Validation
  {
    id: 'FDCPA-DV-01',
    remedyName: 'FDCPA Debt Validation',
    jurisdictionType: JurisdictionalContext.REGULATORY,
    statutoryAuthority: '15 U.S.C. § 1692g(b)',
    requiredCapacity: [LegalCapacity.REPRESENTATIVE],
    triggerEvent: 'Receipt of a collection notice from a third-party debt collector.',
    tags: ['fdcpa', 'debt', 'validation', 'collection'],
    steps: [
      {
        id: 'fdcpa-step-1',
        order: 1,
        title: 'Draft & Send Debt Validation Letter',
        description: 'Generate and send a formal Debt Validation letter within 30 days of initial contact from the debt collector.',
        action: {
          type: 'GENERATE_DOCUMENT',
          templateId: 'FDCPA_VALIDATION_LETTER_TEMPLATE',
        },
        successConditions: ['Letter generated and sent via Certified Mail.'],
        failureConditions: ['30-day window is missed.'],
        nextStep: {
          onSuccess: 'fdcpa-step-2',
          onFailure: 'fdcpa-step-end-failure-user',
        },
      },
      {
        id: 'fdcpa-step-2',
        order: 2,
        title: 'Await Validation',
        description: 'The debt collector must cease collection efforts until they provide validation of the debt.',
        action: {
          type: 'AWAIT_RESPONSE',
          deadline: {
            days: 30, // No strict deadline for them to provide, but this is a reasonable wait.
            unit: 'calendar',
          },
        },
        successConditions: ['Collector provides complete validation as required by law.'],
        failureConditions: ['Collector fails to provide validation and/or continues collection efforts.'],
        nextStep: {
          onSuccess: 'fdcpa-step-end-success',
          onFailure: 'fdcpa-step-3',
        },
      },
      {
        id: 'fdcpa-step-3',
        order: 3,
        title: 'Escalate to CFPB/AG',
        description: 'The collector has violated the FDCPA by not validating the debt. File a complaint with the CFPB and/or your state Attorney General.',
        action: {
          type: 'GENERATE_DOCUMENT',
          templateId: 'FDCPA_VIOLATION_COMPLAINT_TEMPLATE',
        },
        successConditions: ['Complaint filed with regulatory bodies.'],
        failureConditions: [],
        nextStep: {
          onSuccess: 'fdcpa-step-end-escalated',
          onFailure: '',
        },
      },
       {
        id: 'fdcpa-step-end-success',
        order: 99,
        title: 'Remedy Successful',
        description: 'The debt has been validated, or the collector has ceased collection.',
        action: {
          type: 'USER_ACTION',
          description: 'Archive this remedy process.'
        },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
      {
        id: 'fdcpa-step-end-escalated',
        order: 100,
        title: 'Remedy Escalated',
        description: 'A complaint has been filed. Await response from regulatory bodies.',
        action: {
          type: 'USER_ACTION',
          description: 'Monitor communications from CFPB/AG. Archive this remedy process.'
        },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
      {
        id: 'fdcpa-step-end-failure-user',
        order: 101,
        title: 'Remedy Failed',
        description: 'The 30-day window to request validation was missed. This specific remedy path is no longer available.',
        action: {
          type: 'USER_ACTION',
          description: 'The statutory right to validation under 1692g is time-barred. Other dispute options may exist.'
        },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
    ],
  },

  // 3. FCRA Credit Reporting Dispute
  {
    id: 'FCRA-CRD-01',
    remedyName: 'FCRA Credit Report Dispute',
    jurisdictionType: JurisdictionalContext.REGULATORY,
    statutoryAuthority: '15 U.S.C. § 1681i',
    requiredCapacity: [LegalCapacity.REPRESENTATIVE],
    triggerEvent: 'Identification of an inaccurate or unverified item on a credit report.',
    tags: ['fcra', 'credit', 'dispute', 'cra'],
    steps: [
      {
        id: 'fcra-step-1',
        order: 1,
        title: 'Draft & Send Dispute to CRA',
        description: 'Generate and send a formal dispute letter to the Credit Reporting Agency (CRA) identifying the inaccurate information.',
        action: {
          type: 'GENERATE_DOCUMENT',
          templateId: 'FCRA_CRA_DISPUTE_TEMPLATE',
        },
        successConditions: ['Letter generated and sent via Certified Mail.'],
        failureConditions: [],
        nextStep: {
          onSuccess: 'fcra-step-2',
          onFailure: '',
        },
      },
      {
        id: 'fcra-step-2',
        order: 2,
        title: 'Await Investigation Outcome',
        description: 'The CRA generally has 30 days to investigate the dispute and provide a written result.',
        action: {
          type: 'AWAIT_RESPONSE',
          deadline: {
            days: 30,
            unit: 'calendar',
          },
        },
        successConditions: ['CRA corrects or deletes the disputed item.'],
        failureConditions: ['CRA verifies the item and refuses to remove it.'],
        nextStep: {
          onSuccess: 'fcra-step-end-success',
          onFailure: 'fcra-step-3',
        },
      },
      {
        id: 'fcra-step-3',
        order: 3,
        title: 'Draft & Send Dispute to Furnisher',
        description: 'The CRA verified the item. Now, send a dispute directly to the data furnisher (the original creditor or collector).',
        action: {
          type: 'GENERATE_DOCUMENT',
          templateId: 'FCRA_FURNISHER_DISPUTE_TEMPLATE',
        },
        successConditions: ['Letter sent to the data furnisher.'],
        failureConditions: [],
        nextStep: {
          onSuccess: 'fcra-step-4',
          onFailure: '',
        },
      },
      {
        id: 'fcra-step-4',
        order: 4,
        title: 'Await Furnisher Investigation',
        description: 'The furnisher must conduct their own investigation. This can also lead to filing a complaint with the CFPB if they fail their duties.',
        action: {
          type: 'AWAIT_RESPONSE',
          deadline: {
            days: 30,
            unit: 'calendar',
          },
        },
        successConditions: ['Furnisher requests deletion or correction of the item.'],
        failureConditions: ['Furnisher verifies the item again.'],
        nextStep: {
          onSuccess: 'fcra-step-end-success',
          onFailure: 'fcra-step-end-failure',
        },
      },
      {
        id: 'fcra-step-end-success',
        order: 99,
        title: 'Remedy Successful',
        description: 'The inaccurate item has been corrected or deleted from the credit report.',
        action: {
          type: 'USER_ACTION',
          description: 'Obtain a new copy of your credit report to confirm the change. Archive this remedy.'
        },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
      {
        id: 'fcra-step-end-failure',
        order: 100,
        title: 'Remedy Failed',
        description: 'The CRA and furnisher both verified the item. The administrative dispute process is exhausted.',
        action: {
          type: 'USER_ACTION',
          description: 'Further action may require litigation. Consult with an attorney specializing in FCRA matters.'
        },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
    ],
  },

  // 4. RESPA Mortgage Servicing Remedy
  {
    id: 'RESPA-QWR-01',
    remedyName: 'RESPA Mortgage Servicing (QWR)',
    jurisdictionType: JurisdictionalContext.REGULATORY,
    statutoryAuthority: '12 U.S.C. § 2605(e)',
    requiredCapacity: [LegalCapacity.REPRESENTATIVE],
    triggerEvent: 'A mortgage servicer has made an error or is not providing requested information.',
    tags: ['respa', 'qwr', 'mortgage', 'servicing', 'noe'],
    steps: [
      {
        id: 'respa-step-1',
        order: 1,
        title: 'Draft & Send Qualified Written Request (QWR)',
        description: 'Generate and send a QWR to your mortgage servicer to request information or assert an error.',
        action: {
          type: 'GENERATE_DOCUMENT',
          templateId: 'RESPA_QWR_TEMPLATE',
        },
        successConditions: ['QWR sent via Certified Mail.'],
        failureConditions: [],
        nextStep: {
          onSuccess: 'respa-step-2',
          onFailure: '',
        },
      },
      {
        id: 'respa-step-2',
        order: 2,
        title: 'Await Servicer Acknowledgment & Response',
        description: 'The servicer must acknowledge receipt within 5 business days and provide a substantive response within 30 business days.',
        action: {
          type: 'AWAIT_RESPONSE',
          deadline: {
            days: 30,
            unit: 'business',
          },
        },
        successConditions: ['Servicer provides a complete response and/or corrects the error.'],
        failureConditions: ['Servicer fails to respond adequately or within the statutory timeframe.'],
        nextStep: {
          onSuccess: 'respa-step-end-success',
          onFailure: 'respa-step-3',
        },
      },
      {
        id: 'respa-step-3',
        order: 3,
        title: 'Draft & Send Notice of Error (NOE)',
        description: 'The servicer has failed in their duty to respond correctly. Send a formal Notice of Error specifying their failure.',
        action: {
          type: 'GENERATE_DOCUMENT',
          templateId: 'RESPA_NOE_TEMPLATE',
        },
        successConditions: ['NOE sent via Certified Mail.'],
        failureConditions: [],
        nextStep: {
          onSuccess: 'respa-step-4',
          onFailure: '',
        },
      },
      {
        id: 'respa-step-4',
        order: 4,
        title: 'Await NOE Response & Escalate',
        description: 'Await the response to the NOE. If still unresolved, file a complaint with the CFPB.',
        action: {
          type: 'AWAIT_RESPONSE',
          deadline: {
            days: 30,
            unit: 'business',
          },
        },
        successConditions: ['Servicer corrects the error.'],
        failureConditions: ['Servicer fails to correct the error.'],
        nextStep: {
          onSuccess: 'respa-step-end-success',
          onFailure: 'respa-step-end-failure',
        },
      },
      {
        id: 'respa-step-end-success',
        order: 99,
        title: 'Remedy Successful',
        description: 'The servicer has corrected the error or provided the requested information.',
        action: {
          type: 'USER_ACTION',
          description: 'Review the servicer actions to confirm resolution. Archive this remedy.'
        },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
      {
        id: 'respa-step-end-failure',
        order: 100,
        title: 'Remedy Failed',
        description: 'The servicer has not resolved the issue after a QWR and NOE. The administrative process is exhausted.',
        action: {
          type: 'USER_ACTION',
          description: 'File a complaint with the CFPB and consult with an attorney specializing in RESPA matters.'
        },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
    ],
  },

  // 5. Property Tax Assessment Appeal
  {
    id: 'TAX-PTA-01',
    remedyName: 'Property Tax Assessment Appeal',
    jurisdictionType: JurisdictionalContext.ADMINISTRATIVE,
    statutoryAuthority: 'Varies by State/County',
    requiredCapacity: [LegalCapacity.REPRESENTATIVE, LegalCapacity.INDIVIDUAL],
    triggerEvent: 'Receipt of an annual property tax assessment that is believed to be inaccurate or unfair.',
    tags: ['tax', 'property', 'appeal', 'assessment', 'local'],
    steps: [
      {
        id: 'tax-step-1',
        order: 1,
        title: 'Gather Evidence & Find Comparables',
        description: 'Collect evidence to support your appeal, such as photos of the property condition and sales data for comparable properties (comps) in your area.',
        action: {
          type: 'USER_ACTION',
          description: 'Research recent sales of similar properties. Take photos of any property damage or undesirable features.',
        },
        successConditions: ['Sufficient evidence has been gathered to build a case.'],
        failureConditions: [],
        nextStep: {
          onSuccess: 'tax-step-2',
          onFailure: '',
        },
      },
      {
        id: 'tax-step-2',
        order: 2,
        title: 'File Appeal with Local Assessor',
        description: 'Generate and file the official property tax appeal form with your local tax assessor`s office before the deadline.',
        action: {
          type: 'GENERATE_DOCUMENT',
          templateId: 'TAX_APPEAL_FORM_GENERIC', // Note: Forms are highly jurisdiction-specific
        },
        successConditions: ['Appeal filed before the statutory deadline.'],
        failureConditions: ['Appeal deadline is missed.'],
        nextStep: {
          onSuccess: 'tax-step-3',
          onFailure: 'tax-step-end-failure',
        },
      },
      {
        id: 'tax-step-3',
        order: 3,
        title: 'Prepare for Administrative Hearing',
        description: 'Organize your evidence and prepare your arguments for the hearing before the assessment board.',
        action: {
          type: 'USER_ACTION',
          description: 'Assemble all documents into a hearing packet. Practice presenting your case.',
        },
        successConditions: ['A complete hearing packet is prepared.'],
        failureConditions: [],
        nextStep: {
          onSuccess: 'tax-step-4',
          onFailure: '',
        },
      },
      {
        id: 'tax-step-4',
        order: 4,
        title: 'Attend Hearing & Await Decision',
        description: 'Present your case to the board of equalization or equivalent body.',
        action: {
          type: 'AWAIT_RESPONSE',
          deadline: {
            days: 60, // Decision times vary wildly.
            unit: 'calendar',
          },
        },
        successConditions: ['Assessment is reduced.'],
        failureConditions: ['Appeal is denied.'],
        nextStep: {
          onSuccess: 'tax-step-end-success',
          onFailure: 'tax-step-end-failure',
        },
      },
       {
        id: 'tax-step-end-success',
        order: 99,
        title: 'Remedy Successful',
        description: 'The property assessment was successfully appealed and reduced.',
        action: {
          type: 'USER_ACTION',
          description: 'Confirm the new assessment value and archive this remedy.'
        },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
      {
        id: 'tax-step-end-failure',
        order: 100,
        title: 'Remedy Failed',
        description: 'The appeal was denied or the deadline was missed.',
        action: {
          type: 'USER_ACTION',
          description: 'Review options for appealing to a higher board or court, if available in your jurisdiction.'
        },
        successConditions: [],
        failureConditions: [],
        nextStep: { onSuccess: '', onFailure: '' },
      },
    ],
  },
];
