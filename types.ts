
export enum CorpusType {
  STATUTE = 'STATUTE',
  DICTIONARY = 'DICTIONARY',
  RULE = 'RULE',
  MANUAL = 'MANUAL',
  CASE_LAW = 'CASE_LAW',
  COMMENTARY = 'COMMENTARY',
  MAXIM = 'MAXIM',
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

export interface Persona {
  id: string;
  givenName: string;
  familyName: string;
  tradeNameAllCaps: string;
  mailingAddress: string;        // deliverable postal address
  domicileDeclaration: string;   // sovereign narrative declaration
  keyPairId: string;             // link to crypto identity
  createdAt: string;
}

export interface PlaybookStep {
  id: string;
  order: number;
  title: string;
  action: string;
  rationale: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  source?: string; // Citation or legal basis
  duration?: string; // e.g. "Immediate" or "30 Days"
  completed: boolean;
}

export interface Playbook {
  id: string;
  title: string;
  description: string;
  category: 'TRAFFIC' | 'COMMERCIAL' | 'TRUST' | 'TREATY' | 'INDIGENOUS';
  steps: PlaybookStep[];
  tags: string[];
}

export interface UccSection {
  id: string;
  title: string;
  text: string;
}

export interface UccPart {
  title: string;
  sections: UccSection[];
}

export interface UccArticle {
  title: string;
  parts: UccPart[];
}

export interface Maxim {
  id: string;
  latin: string;
  english: string;
  explanation: string;
}
