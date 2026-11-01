export interface TimelineEvent {
  timestamp: string;
  description: string;
}

export interface LocationDetails {
  state: string;
  district: string;
  policeStation: string;
  lat?: number;
  lng?: number;
}

export interface GroundingLink {
  uri: string;
  title: string;
  type: 'web' | 'maps';
  snippets?: string[];
}

export type EvidenceCategory =
  | 'Digital Evidence'
  | 'Physical Weaponry'
  | 'Witness Statements'
  | 'Financial Records'
  | 'Forensic & Medical'
  | 'Vehicle & Property';

export interface EvidenceItem {
  id: string;
  item: string;
  category: EvidenceCategory;
  confidence: number;
  sourceExcerpt?: string;
  chainOfCustodyStatus?: 'Pending Collection' | 'Logged & Sealed' | 'Sent to FSL';
  bnsRelevance?: string;
}

export interface WitnessStatement {
  id: string;
  witnessName: string;
  role: 'Complainant / Victim' | 'Independent Eyewitness' | 'Neighbor / Bystander' | 'First Responder' | 'Premise / Commercial Staff';
  bnssSection: 'Sec 173 BNSS (First Informant)' | 'Sec 180 BNSS (Police Examination)' | 'Sec 183 BNSS (Magistrate Recording)';
  recordedAt: string;
  reportedTimeClaim: string;
  suspectClaim: string;
  weaponClaim: string;
  vehicleOrExitClaim: string;
  statementText: string;
  credibilityScore: number;
}

export interface WitnessConflict {
  id: string;
  dimension: 'Temporal Sequence' | 'Suspect Description & Count' | 'Weapon / Force Used' | 'Escape Vector & Vehicle' | 'Scene & Action Details';
  severity: 'CRITICAL CONTRADICTION' | 'MATERIAL VARIANCE' | 'CORROBORATED';
  summary: string;
  statementsCompared: {
    witnessId: string;
    witnessName: string;
    role: string;
    claimExcerpt: string;
  }[];
  bsaStatutoryImplication: string;
  resolutionDirective: string;
  status: 'Unresolved Conflict' | 'Flagged for Re-Examination' | 'Reconciled via Forensics';
}

export interface FirAnalysisResult {
  stressWords: string[];
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidenceScore?: number;
  investigativeSteps?: string[];
  expectedOutcomes?: string[];
  recommendedActs?: string[];
  categories: string[];
  categoryScores?: { category: string; score: number }[];
  summary: string;
  timeline?: TimelineEvent[];
  locationDetails?: LocationDetails;
  evidenceItems?: EvidenceItem[];
  witnessStatements?: WitnessStatement[];
}

export interface HistoryItem extends FirAnalysisResult {
  id: string;
  rawText: string;
  timestamp: Date;
}

export interface DemoCase extends FirAnalysisResult {
  label: string;
  rawText: string;
}

