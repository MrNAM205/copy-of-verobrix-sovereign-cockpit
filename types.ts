export enum CorpusType {
  STATUTE = 'STATUTE',
  DICTIONARY = 'DICTIONARY',
  RULE = 'RULE',
  MANUAL = 'MANUAL',
  CASE_LAW = 'CASE_LAW',
  COMMENTARY = 'COMMENTARY',
  MAXIM = 'MAXIM',
  DOCTRINE = 'DOCTRINE',
}

export interface CorpusItem {
  id: string;
  type: CorpusType;
  title: string;
  citation: string;
  jurisdiction: string; // e.g., 'Federal', 'Alabama', 'Universal'
  text: string;
  notes?: string;
  tags: string[];
}

export interface TemplateField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'date' | 'textarea' | 'currency';
  helpText?: string; // Contextual guidance for the user
}

export interface TemplateDiscernment {
  lawful: string;
  contested: string;
  utility: string;
  outcome: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  jurisdiction: string;
  content: string; // The raw template text with {{keys}}
  fields: TemplateField[];
  instructions?: string[]; // Step-by-step execution guide
  discernment?: TemplateDiscernment; // Sovereign discernment framework
}

export interface Script {
  id: string;
  title: string;
  category: 'COURT' | 'PHONE' | 'COMMERCIAL';
  description: string;
  tags: string[];
  content: string; // The script text
  tips: string[]; // Delivery checklist/protocols
}

export interface ArchiveEntry {
  id: string;
  timestamp: number;
  type: 'DRAFT' | 'COGNITION' | 'SEARCH';
  title: string;
  summary: string;
  details: string; // JSON stringified content or raw text
  checksum: string;
}

export enum CognitionMode {
  STRICT = 'Lawful Strict',
  EXPLAINER = 'Explainer',
  COMPARE = 'Compare & Refute',
  LOCATOR = 'Jurisdiction Locator'
}

export interface MapLink {
  title: string;
  uri: string;
}

export interface CognitionResult {
  text: string;
  mapLinks?: MapLink[];
}

// --- PHASE 2: PERSONA & CAPACITY ENGINE ---

export interface Persona {
  id: string;
  givenName: string;            // The Individual's name
  familyName: string;             // The Individual's family name
  statutoryPersonaName: string;   // The name of the Legal Personhood Construct (e.g., ALL CAPS)
  mailingAddress: string;         // Deliverable postal address for the Statutory Persona
  domicileDeclaration: string;    // Narrative domicile for the Individual
  keyPairId: string;              // Link to crypto identity
  createdAt: string;
}

export enum LegalCapacity {
  INDIVIDUAL = 'Individual',
  REPRESENTATIVE = 'Representative',
  TRUSTEE = 'Trustee',
  EXECUTOR = 'Executor',
  AGENT = 'Agent',
  BENEFICIARY = 'Beneficiary',
  PRINCIPAL = 'Principal',
}

export enum SignatureMode {
  INDIVIDUAL = 'Individual', // e.g., John-Henry: Doe
  REPRESENTATIVE = 'Representative', // e.g., John Henry Doe, Authorized Representative
  TRUSTEE = 'Trustee', // e.g., John Henry Doe, Trustee
  EXECUTOR = 'Executor', // e.g., John Henry Doe, Executor
  UCC_RESERVATION = 'UCC Reservation', // e.g., John Henry Doe, without prejudice
}

export enum JurisdictionalContext {
  ADMINISTRATIVE = 'Administrative',
  CIVIL = 'Civil',
  COMMERCIAL = 'Commercial',
  REGULATORY = 'Regulatory',
  CONSTITUTIONAL = 'Constitutional',
}

export interface CapacityState {
  activeCapacity: LegalCapacity;
  activeSignatureMode: SignatureMode;
  activeJurisdiction: JurisdictionalContext;
  authoritySource: string; // e.g., "Agency Law", "Trust Instrument", "UCC § 1-308"
}

// --- END PHASE 2 ---


// --- END PHASE 4 ---


// --- PHASE 5: MISSION ORCHESTRATION ---

export interface MissionStep {
  order: number;
  title: string;
  remedyDefinitionId: string; // Links to a remedy in `data/remedies.ts`
  // Defines how to move to the next step based on the outcome of the remedy
  transitions: {
    onSuccess: number | 'COMPLETE'; // Go to this order number on success
    onFailure: number | 'FAIL';     // Go to this order number on failure
  };
}

export interface MissionPlaybook {
  id: string; // e.g., 'MISSION-FDCPA-01'
  missionName: string; // e.g., "Neutralize a Collection Attempt"
  objective: string;
  requiredPersona: LegalCapacity[];
  steps: MissionStep[];
  tags: string[];
}

export interface ActiveMission {
  instanceId: string; // A unique ID for this specific mission
  playbookId: string; // Links back to the playbook
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  currentStepOrder: number;
  activeRemedyInstanceId: string | null; // The instanceId of the currently running ActiveRemedy
  startedAt: string;
  variables: Record<string, any>; // To store user input for the whole mission
}

// --- END PHASE 5 ---


// --- Trust & Asset Management ---

export interface RealEstateAsset {
    type: 'REAL_ESTATE';
    parcelId: string;
    legalDescription: string;
    deedReference: string; // e.g., book/page or document number
}

export interface VehicleAsset {
    type: 'VEHICLE';
    vin: string;
    make: string;
    model: string;
    year: number;
    mcoReference: string; // Manufacturer's Certificate of Origin
}

export type Asset = RealEstateAsset | VehicleAsset;

export interface Trust {
    id: string;
    name: string; // e.g., "The John Henry Doe Family Trust"
    trustees: string[]; // For now, just names. Could be Persona IDs later.
    beneficiaries: string[];
    createdAt: string;
    jurisdiction: string; // e.g., "Common Law", "State of Alabama"
    assets: Asset[];
}