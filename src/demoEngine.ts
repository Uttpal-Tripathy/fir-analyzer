// Offline "demo mode" engine used by the server when no GEMINI_API_KEY is configured.
// Seeded demo cases are returned verbatim; any other FIR text goes through a transparent
// rule-based analyzer so every screen stays fully clickable without an AI backend.
import { demoCases } from './data';
import { BNS_CATALOG } from './data/bnsCatalog';
import { EvidenceCategory, EvidenceItem, FirAnalysisResult, GroundingLink, LocationDetails } from './types';

type RadarAxis = 'Violence' | 'Weapons' | 'Medical' | 'Theft' | 'Substance';

interface Rule {
  label: string;
  axis?: RadarAxis;
  pattern: RegExp;
  weight: number;
  critical?: boolean;
  acts?: string[];
  steps?: string[];
  outcomes?: string[];
  evidence?: { item: string; category: EvidenceCategory; bnsRelevance: string };
}

const RULES: Rule[] = [
  {
    label: 'Homicide',
    axis: 'Violence',
    pattern: /\b(murder\w*|killed|dead body|deceased|died|corpse|lifeless|death(?! threat))\b/gi,
    weight: 6,
    critical: true,
    acts: ['Section 103 BNS (Murder)'],
    steps: ['Conduct inquest and send body for post-mortem under Section 194 BNSS', 'Seal the scene and requisition the mobile forensic unit'],
    outcomes: ['Charge-sheet for murder before the Court of Session'],
    evidence: { item: 'Post-mortem report & inquest panchnama', category: 'Forensic & Medical', bnsRelevance: 'Sec 194 BNSS inquest; Sec 39 BSA expert opinion' },
  },
  {
    label: 'Weapons',
    axis: 'Weapons',
    pattern: /\b(gun\w*|pistol|revolver|firearm|rifle|country-?made|katta|shot at|fired|bullet\w*|cartridge\w*)\b/gi,
    weight: 4,
    critical: true,
    acts: ['Arms Act, 1959 (Section 25 / 27)'],
    steps: ['Recover the firearm and spent cartridges; forward to FSL ballistics division'],
    outcomes: ['Separate prosecution under the Arms Act, 1959'],
    evidence: { item: 'Firearm / ammunition', category: 'Physical Weaponry', bnsRelevance: 'Seizure under Sec 106 BNSS; FSL ballistics report' },
  },
  {
    label: 'Weapons',
    axis: 'Weapons',
    pattern: /\b(knife|knives|blade|sword|machete|chopper|hammer|iron rod|rod|lathi|stick|axe|sickle|acid)\b/gi,
    weight: 3,
    acts: ['Section 118 BNS (Voluntarily causing hurt or grievous hurt by dangerous weapons or means)'],
    steps: ['Seize the weapon under a seizure memo and send for fingerprint / blood-stain analysis'],
    outcomes: ['Charges for hurt / grievous hurt by dangerous weapon'],
    evidence: { item: 'Weapon of offence', category: 'Physical Weaponry', bnsRelevance: 'Seizure memo under Sec 106 BNSS' },
  },
  {
    label: 'Violence',
    axis: 'Violence',
    pattern: /\b(stabb\w*|fractur\w*|grievous\w*|deep wound|disfigur\w*)\b/gi,
    weight: 4,
    critical: true,
    acts: ['Section 117 BNS (Voluntarily causing grievous hurt)'],
  },
  {
    label: 'Violence',
    axis: 'Violence',
    pattern: /\b(assault\w*|attack\w*|beat\w*|punch\w*|slapp\w*|kick\w*|injur\w*|wound\w*|bleed\w*|laceration|hurt|bruis\w*)\b/gi,
    weight: 3,
    acts: ['Section 115 BNS (Voluntarily causing hurt)'],
    steps: ['Obtain Medico-Legal Certificate (MLC) for the injured'],
    outcomes: ['Charges for voluntarily causing hurt'],
    evidence: { item: 'Medico-Legal Certificate (injuries)', category: 'Forensic & Medical', bnsRelevance: 'Sec 39 BSA expert opinion' },
  },
  {
    label: 'Medical Emergency',
    axis: 'Medical',
    pattern: /\b(unresponsive|not breathing|unconscious|overdos\w*|cpr|ambulance|collapsed|seizure|hospitali[sz]ed|icu)\b/gi,
    weight: 3,
    steps: ['Coordinate with the treating hospital and record the injured person\'s statement when fit'],
    outcomes: ['Medical report filed with the case diary'],
    evidence: { item: 'Hospital admission & treatment records', category: 'Forensic & Medical', bnsRelevance: 'Documentary evidence under Sec 61 BSA' },
  },
  {
    label: 'Substance Abuse',
    axis: 'Substance',
    pattern: /\b(narcotic\w*|ganja|heroin|smack|cocaine|mdma|charas|opium|brown sugar|contraband)\b/gi,
    weight: 3,
    acts: ['NDPS Act, 1985 (Section 20 / 21 / 22)'],
    steps: ['Follow Section 50 NDPS search procedure in the presence of a gazetted officer / magistrate'],
    evidence: { item: 'Seized contraband sample', category: 'Forensic & Medical', bnsRelevance: 'Sample sealed per Sec 52A NDPS; FSL chemical analysis' },
  },
  {
    label: 'Substance Abuse',
    axis: 'Substance',
    pattern: /\b(drunk\w*|intoxicated|alcohol\w*|liquor|inebriated|narcan)\b/gi,
    weight: 1,
    steps: ['Arrange medical examination for intoxication under Section 51 BNSS'],
  },
  {
    label: 'Robbery',
    axis: 'Theft',
    pattern: /\b(robb\w*|loot\w*|at gunpoint|at knifepoint|dacoit\w*)\b/gi,
    weight: 4,
    critical: true,
    acts: ['Section 309 BNS (Robbery)'],
    steps: ['Circulate suspect description to all PCR vans and border check-posts'],
    outcomes: ['Recovery of looted property and arrest of accused'],
  },
  {
    label: 'Theft',
    axis: 'Theft',
    pattern: /\b(snatch\w*)\b/gi,
    weight: 3,
    acts: ['Section 304 BNS (Snatching)'],
    outcomes: ['Recovery of snatched property and arrest of the accused'],
  },
  {
    label: 'Theft',
    axis: 'Theft',
    pattern: /\b(stole|stolen|theft|thief|thieves|pickpocket\w*|missing from)\b/gi,
    weight: 2,
    acts: ['Section 303 BNS (Theft)'],
    steps: ['Prepare a list of stolen property and alert pawn shops / second-hand dealers'],
    outcomes: ['Recovery of stolen property'],
    evidence: { item: 'List of stolen property & ownership documents', category: 'Vehicle & Property', bnsRelevance: 'Property identification under Sec 105 BNSS' },
  },
  {
    label: 'Burglary',
    axis: 'Theft',
    pattern: /\b(broke into|break-?in|forced entry|burglar\w*|lock (?:was )?broken|broken lock|house-?breaking)\b/gi,
    weight: 3,
    acts: ['Section 331 BNS (House-trespass or house-breaking)'],
    steps: ['Lift chance prints from the point of entry'],
    evidence: { item: 'Chance fingerprints at point of entry', category: 'Forensic & Medical', bnsRelevance: 'Fingerprint Bureau report; Sec 39 BSA' },
  },
  {
    label: 'Trespass',
    pattern: /\b(trespass\w*|entered without permission)\b/gi,
    weight: 1,
    acts: ['Section 329 BNS (Criminal trespass and house-trespass)'],
  },
  {
    label: 'Cyber Fraud',
    pattern: /\b(otp|phishing|fraud\w*|scam\w*|cheat\w*|impersonat\w*|kyc|fake (?:call|link|app|profile))\b/gi,
    weight: 3,
    acts: ['Section 318 BNS (Cheating)', 'Section 66D IT Act, 2000 (Cheating by personation using computer resource)'],
    steps: ['Report on the National Cyber Crime Reporting Portal / helpline 1930 to freeze the transferred funds', 'Obtain CDRs and bank KYC of beneficiary accounts'],
    outcomes: ['Freezing of beneficiary bank accounts', 'Charges for cheating by personation'],
    evidence: { item: 'Transaction IDs, call logs & screenshots', category: 'Digital Evidence', bnsRelevance: 'Electronic record certificate under Sec 63 BSA' },
  },
  {
    label: 'Evidence',
    pattern: /\b(transferred|bank account|account number|upi|debit card|credit card|net ?banking|rs\.? ?[\d,]+|lakh\w*)\b/gi,
    weight: 0,
    evidence: { item: 'Bank statement of complainant', category: 'Financial Records', bnsRelevance: 'Bankers\' Books evidence; Sec 63 BSA certificate' },
  },
  {
    label: 'Domestic',
    pattern: /\b(husband|in-?laws|dowry|domestic|spouse|mother-in-law|father-in-law)\b/gi,
    weight: 3,
    acts: ['Section 85 BNS (Cruelty by husband or relative of husband)', 'Protection of Women from Domestic Violence Act, 2005'],
    steps: ['Inform the Protection Officer and offer shelter / medical aid to the aggrieved woman'],
    outcomes: ['Protection order under the PWDV Act'],
  },
  {
    label: 'Domestic',
    pattern: /\b(wife|partner|throwing objects)\b/gi,
    weight: 1,
  },
  {
    label: 'Criminal Intimidation',
    axis: 'Violence',
    pattern: /\b(threat\w*|intimidat\w*|kill (?:you|him|her|me)|feared for|abus\w*)\b/gi,
    weight: 2,
    acts: ['Section 351 BNS (Criminal intimidation)'],
  },
  {
    label: 'Extortion',
    pattern: /\b(extort\w*|ransom|demanded money|hafta)\b/gi,
    weight: 4,
    critical: true,
    acts: ['Section 308 BNS (Extortion)'],
    evidence: { item: 'Extortion call recordings / messages', category: 'Digital Evidence', bnsRelevance: 'Sec 63 BSA certificate for electronic records' },
  },
  {
    label: 'Vulnerable Person',
    pattern: /\b(kidnap\w*|abduct\w*|went missing|missing child|missing since|lured away)\b/gi,
    weight: 5,
    critical: true,
    acts: ['Section 137 BNS (Kidnapping)'],
    steps: ['Issue a look-out notice and upload details to TrackChild / Khoya-Paya portals', 'Alert railway stations, bus terminals and highway check-posts'],
    outcomes: ['Safe recovery of the missing person'],
  },
  {
    label: 'Vulnerable Person',
    pattern: /\b(child|minor|\d{1,2}-year-old|elderly|senior citizen|disabled)\b/gi,
    weight: 2,
  },
  {
    label: 'Women Safety',
    pattern: /\b(molest\w*|outrag\w*|sexual\w*|stalk\w*|eve-?teas\w*|groped)\b/gi,
    weight: 4,
    critical: true,
    acts: ['Section 74 BNS (Assault or criminal force to woman with intent to outrage her modesty)'],
    steps: ['Record the victim\'s statement through a woman officer (Section 176 BNSS proviso)'],
  },
  {
    label: 'Arson',
    pattern: /\b(set (?:on )?fire|set ablaze|arson|torched|petrol bomb|burnt down)\b/gi,
    weight: 4,
    critical: true,
    acts: ['Section 326 BNS (Mischief by fire or explosive substance)'],
    evidence: { item: 'Fire debris & accelerant samples', category: 'Forensic & Medical', bnsRelevance: 'FSL chemical analysis; Sec 39 BSA' },
  },
  {
    label: 'Road Accident',
    pattern: /\b(accident|hit[- ]and[- ]run|collided|collision|rash(?:ly)? driv\w*|overturned|ran over)\b/gi,
    weight: 3,
    acts: ['Section 281 BNS (Rash driving or riding on a public way)', 'Section 125 BNS (Act endangering life or personal safety of others)'],
    steps: ['Prepare scene site plan and get vehicles mechanically inspected (MVI report)'],
  },
  {
    label: 'Public Disturbance',
    pattern: /\b(noise|brawl|nuisance|loud music|quarrel\w*|creating ruckus)\b/gi,
    weight: 1,
    acts: ['Section 292 BNS (Public nuisance)'],
  },
  {
    label: 'Rioting',
    axis: 'Violence',
    pattern: /\b(riot\w*|mob|stone[- ]pelting|unlawful assembly)\b/gi,
    weight: 4,
    critical: true,
    acts: ['Section 191 BNS (Rioting)'],
  },
  {
    label: 'Property Damage',
    pattern: /\b(vandali[sz]\w*|smashed|shattered|damaged)\b/gi,
    weight: 1,
    acts: ['Section 324 BNS (Mischief)'],
  },
  {
    label: 'Evidence',
    pattern: /\b(car|sedan|suv|hatchback|bike|motorcycle|scooter|two-wheeler|auto-?rickshaw|truck|van|number plate|registration (?:no|number))\b/gi,
    weight: 0,
    steps: ['Run the vehicle through ANPR / e-challan databases and issue a BOLO alert'],
    evidence: { item: 'Suspect vehicle details', category: 'Vehicle & Property', bnsRelevance: 'Seizure under Sec 106 BNSS; RTO ownership records' },
  },
  {
    label: 'Evidence',
    pattern: /\b(cctv|camera|footage|recording|video)\b/gi,
    weight: 0,
    steps: ['Secure CCTV footage from the scene and approach routes before it is overwritten'],
    evidence: { item: 'CCTV footage', category: 'Digital Evidence', bnsRelevance: 'Electronic record certificate under Sec 63 BSA' },
  },
  {
    label: 'Evidence',
    pattern: /\b(witness\w*|eyewitness\w*|neighbou?r\w*|bystander\w*|passer-?by)\b/gi,
    weight: 0,
    steps: ['Record statements of eyewitnesses under Section 180 BNSS'],
    evidence: { item: 'Eyewitness statements', category: 'Witness Statements', bnsRelevance: 'Sec 180 BNSS examination; Sec 148 BSA cross-examination' },
  },
  {
    label: 'Evidence',
    pattern: /\b(mobile phone|phone|cell ?phone|laptop|email)\b/gi,
    weight: 0,
    evidence: { item: 'Mobile phone / digital device', category: 'Digital Evidence', bnsRelevance: 'Forensic imaging; Sec 63 BSA certificate' },
  },
];

// "Evidence" rules only contribute evidence items and steps, never a crime category.
const NON_CATEGORY_LABELS = new Set(['Evidence']);

interface Place {
  match: RegExp;
  state: string;
  district: string;
  locality?: string;
  lat: number;
  lng: number;
}

// Localities first so they win over their parent city.
const PLACES: Place[] = [
  { match: /bandra/i, locality: 'Bandra West', district: 'Mumbai Suburban', state: 'Maharashtra', lat: 19.0596, lng: 72.8295 },
  { match: /andheri/i, locality: 'Andheri East', district: 'Mumbai Suburban', state: 'Maharashtra', lat: 19.1136, lng: 72.8697 },
  { match: /koramangala/i, locality: 'Koramangala', district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9352, lng: 77.6245 },
  { match: /whitefield/i, locality: 'Whitefield', district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9698, lng: 77.75 },
  { match: /banjara hills/i, locality: 'Banjara Hills', district: 'Hyderabad', state: 'Telangana', lat: 17.4126, lng: 78.4482 },
  { match: /anna nagar/i, locality: 'Anna Nagar', district: 'Chennai', state: 'Tamil Nadu', lat: 13.085, lng: 80.2101 },
  { match: /connaught place/i, locality: 'Connaught Place', district: 'New Delhi', state: 'Delhi', lat: 28.6315, lng: 77.2167 },
  { match: /hauz khas/i, locality: 'Hauz Khas', district: 'South Delhi', state: 'Delhi', lat: 28.5494, lng: 77.2001 },
  { match: /salt lake/i, locality: 'Salt Lake', district: 'Bidhannagar', state: 'West Bengal', lat: 22.5867, lng: 88.4173 },
  { match: /park street/i, locality: 'Park Street', district: 'Kolkata', state: 'West Bengal', lat: 22.553, lng: 88.352 },
  { match: /mumbai|bombay/i, district: 'Mumbai City', state: 'Maharashtra', lat: 19.076, lng: 72.8777 },
  { match: /new delhi|delhi/i, district: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209 },
  { match: /bengaluru|bangalore/i, district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { match: /hyderabad|secunderabad/i, district: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867 },
  { match: /chennai|madras/i, district: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { match: /kolkata|calcutta/i, district: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { match: /pune/i, district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { match: /nagpur/i, district: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { match: /ahmedabad/i, district: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { match: /surat/i, district: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { match: /jaipur/i, district: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { match: /lucknow/i, district: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { match: /varanasi|banaras/i, district: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { match: /noida/i, district: 'Gautam Buddh Nagar', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.391 },
  { match: /gurugram|gurgaon/i, district: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266 },
  { match: /chandigarh/i, district: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { match: /guwahati/i, district: 'Kamrup Metropolitan', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { match: /patna/i, district: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { match: /ranchi/i, district: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 },
  { match: /bhopal/i, district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { match: /indore/i, district: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { match: /raipur/i, district: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296 },
  { match: /bhubaneswar/i, district: 'Khordha', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { match: /visakhapatnam|vizag/i, district: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { match: /kochi|cochin|ernakulam/i, district: 'Ernakulam', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { match: /thiruvananthapuram|trivandrum/i, district: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
  { match: /dehradun/i, district: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322 },
  { match: /shimla/i, district: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
  { match: /srinagar/i, district: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973 },
  { match: /panaji|goa/i, district: 'North Goa', state: 'Goa', lat: 15.4909, lng: 73.8278 },
];

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

export function hasGeminiKey(): boolean {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key) && key !== 'MY_GEMINI_API_KEY';
}

export function findSeededCase(firText: string): FirAnalysisResult | null {
  const needle = normalize(firText);
  const match = demoCases.find((dc) => normalize(dc.rawText) === needle);
  if (!match) return null;
  const { label: _label, rawText: _raw, ...result } = match;
  return { ...result, analysisEngine: 'seeded-demo' };
}

function detectLocation(text: string): LocationDetails | undefined {
  const stationMatch = text.match(/\b([A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+){0,2}) (?:Police Station|PS)\b/);
  const place = PLACES.find((p) => p.match.test(text));
  if (!place && !stationMatch) return undefined;
  const station = stationMatch
    ? `${stationMatch[1]} Police Station`
    : place!.locality
      ? `${place!.locality} Police Station`
      : `Jurisdictional PS – ${place!.district}`;
  return {
    state: place?.state || 'To be confirmed',
    district: place?.district || 'To be confirmed',
    policeStation: station,
    ...(place ? { lat: place.lat, lng: place.lng } : {}),
  };
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
}

const TIME_RE = /\b(\d{1,2}[:.]\d{2}\s?(?:hrs|hours|am|pm|a\.m\.|p\.m\.)?|\d{1,2}\s?(?:am|pm|a\.m\.|p\.m\.)|(?:morning|afternoon|evening|night|midnight|noon))\b/i;

function buildTimeline(sentences: string[]) {
  return sentences.slice(0, 6).map((s, i) => {
    const t = s.match(TIME_RE);
    return {
      timestamp: t ? t[1] : `Sequence ${String(i + 1).padStart(2, '0')}`,
      description: s.length > 220 ? `${s.slice(0, 217)}...` : s,
    };
  });
}

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

function excerptAround(text: string, phrase: string): string {
  const idx = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx < 0) return phrase;
  const start = Math.max(0, text.lastIndexOf('.', idx) + 1);
  const endDot = text.indexOf('.', idx);
  const end = endDot < 0 ? text.length : endDot + 1;
  const sentence = text.slice(start, end).trim();
  return sentence.length > 160 ? `${sentence.slice(0, 157)}...` : sentence;
}

export function analyzeOffline(firText: string): FirAnalysisResult {
  const text = firText.replace(/\s+/g, ' ').trim();
  const hits: { rule: Rule; phrases: string[] }[] = [];

  for (const rule of RULES) {
    const phrases = uniq(Array.from(text.matchAll(rule.pattern), (m) => m[0].toLowerCase()));
    if (phrases.length > 0) hits.push({ rule, phrases });
  }

  const scoring = hits.filter((h) => h.rule.weight > 0);
  const totalWeight = scoring.reduce((sum, h) => sum + h.rule.weight, 0);
  const hasCritical = scoring.some((h) => h.rule.critical);

  let threatLevel: FirAnalysisResult['threatLevel'] = 'LOW';
  if (hasCritical && totalWeight >= 6) threatLevel = 'CRITICAL';
  else if (hasCritical || totalWeight >= 6) threatLevel = 'HIGH';
  else if (totalWeight >= 2) threatLevel = 'MEDIUM';

  const categories = uniq(scoring.map((h) => h.rule.label).filter((l) => !NON_CATEGORY_LABELS.has(l)));

  const axisScore = (axis: RadarAxis) => {
    const w = scoring.filter((h) => h.rule.axis === axis).reduce((s, h) => s + h.rule.weight * h.phrases.length, 0);
    return Math.min(98, w === 0 ? 5 : 35 + w * 12);
  };
  const categoryScores = (['Violence', 'Weapons', 'Medical', 'Theft', 'Substance'] as RadarAxis[]).map((axis) => ({
    category: axis,
    score: axisScore(axis),
  }));

  const stressWords = uniq(scoring.filter((h) => !NON_CATEGORY_LABELS.has(h.rule.label)).flatMap((h) => h.phrases)).slice(0, 12);

  const acts = uniq(hits.flatMap((h) => h.rule.acts || []));
  const recommendedActs = acts.length > 0 ? acts : ['Preliminary enquiry under Section 173(3) BNSS to ascertain whether a cognizable offence is made out'];

  const severeOffence = acts.some((a) => /Section (103|109|117|118|137|191|308|309|326) BNS|Arms Act|NDPS/.test(a));
  const investigativeSteps = uniq([
    ...(threatLevel === 'CRITICAL' ? ['Alert the SHO and District Control Room; dispatch the nearest PCR / QRT unit'] : []),
    'Register the FIR under Section 173 BNSS and provide a free copy to the informant',
    'Record the complainant\'s detailed statement under Section 180 BNSS',
    ...hits.flatMap((h) => h.rule.steps || []),
    ...(severeOffence ? ['Mandatory forensic team visit to the scene for offences punishable with 7+ years (Section 176(3) BNSS)'] : []),
  ]).slice(0, 8);

  const expectedOutcomes = uniq([
    ...hits.flatMap((h) => h.rule.outcomes || []),
    threatLevel === 'LOW' ? 'Resolution through counselling or a non-cognizable report if no offence is disclosed' : 'Final report under Section 193 BNSS within the statutory timeline',
  ]).slice(0, 5);

  const evidenceByItem = new Map<string, EvidenceItem>();
  for (const h of hits) {
    if (!h.rule.evidence || evidenceByItem.has(h.rule.evidence.item)) continue;
    evidenceByItem.set(h.rule.evidence.item, {
      id: '',
      item: h.rule.evidence.item,
      category: h.rule.evidence.category,
      confidence: Math.min(96, 78 + h.phrases.length * 6),
      sourceExcerpt: excerptAround(text, h.phrases[0]),
      chainOfCustodyStatus: 'Pending Collection',
      bnsRelevance: h.rule.evidence.bnsRelevance,
    });
  }
  const evidenceItems = Array.from(evidenceByItem.values()).map((ev, i) => ({ ...ev, id: `EV-${String(i + 1).padStart(2, '0')}` }));

  const sentences = splitSentences(text);
  const locationDetails = detectLocation(text);
  const first = sentences[0] || text;
  const lead = categories.length > 0 ? `${categories.slice(0, 2).join(' and ')} incident` : 'Complaint';
  const where = locationDetails && locationDetails.district !== 'To be confirmed' ? ` in ${locationDetails.district}, ${locationDetails.state}` : '';
  const summary = `${lead} reported${where}: ${first.length > 180 ? `${first.slice(0, 177)}...` : first}`;

  const confidenceScore = Math.min(90, 60 + scoring.length * 5 + (locationDetails ? 4 : 0));

  return {
    stressWords,
    threatLevel,
    confidenceScore,
    investigativeSteps,
    expectedOutcomes,
    recommendedActs,
    categories: categories.length > 0 ? categories : ['General Complaint'],
    categoryScores,
    summary,
    timeline: buildTimeline(sentences),
    locationDetails,
    evidenceItems,
    analysisEngine: 'offline-rules',
  };
}

export function demoAnalyze(firText: string): FirAnalysisResult {
  return findSeededCase(firText) || analyzeOffline(firText);
}

export function demoClassifyEvidence(firText: string, customItemText?: string): { evidenceItems: EvidenceItem[] } {
  if (customItemText) {
    const items = analyzeOffline(customItemText).evidenceItems || [];
    return {
      evidenceItems: [
        items[0]
          ? { ...items[0], item: customItemText, sourceExcerpt: 'Investigator manual entry' }
          : {
              id: 'EV-01',
              item: customItemText,
              category: 'Vehicle & Property',
              confidence: 60,
              sourceExcerpt: 'Investigator manual entry',
              chainOfCustodyStatus: 'Pending Collection',
              bnsRelevance: 'Seizure under Sec 106 BNSS',
            },
      ],
    };
  }
  const seeded = findSeededCase(firText);
  if (seeded?.evidenceItems?.length) return { evidenceItems: seeded.evidenceItems };
  return { evidenceItems: analyzeOffline(firText).evidenceItems || [] };
}

// ---------- Grounding & chat ----------

const searchUrl = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`;
const kanoonUrl = (q: string) => `https://indiankanoon.org/search/?formInput=${encodeURIComponent(q)}`;
const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

function sectionNumber(act: string): string | null {
  const m = act.match(/Section\s+(\d+[A-Z]?)(?:\(\d+\))?\s+BNS\b/i);
  return m ? m[1] : null;
}

function catalogEntry(section: string) {
  return BNS_CATALOG.find((s) => s.section.toLowerCase() === section.toLowerCase());
}

export interface DemoGroundingContext {
  location?: string;
  acts?: string[];
  categories?: string[];
}

export function demoGrounding(mode: 'search' | 'maps', ctx: DemoGroundingContext): { text: string; groundingLinks: GroundingLink[] } {
  const location = ctx.location?.trim() || 'India';

  if (mode === 'maps') {
    const facilities = [
      ['Police stations', `police station near ${location}`],
      ['Government trauma / emergency hospitals', `government hospital emergency near ${location}`],
      ['Forensic science laboratories', `forensic science laboratory near ${location}`],
      ['District & sessions courts', `district court near ${location}`],
    ];
    return {
      text:
        `Offline dispatch reference for ${location}.\n\n` +
        `Use the map links below to locate the nearest response facilities. National emergency lines: 112 (ERSS – police/fire/ambulance), 108 (ambulance in most states), 1930 (cyber fraud), 1098 (Childline), 181 (women helpline).\n\n` +
        `Live Google Maps grounding with ratings and distances is available when a Gemini API key is configured.`,
      groundingLinks: facilities.map(([title, q]) => ({ uri: mapsUrl(q), title, type: 'maps' as const })),
    };
  }

  const acts = (ctx.acts && ctx.acts.length > 0 ? ctx.acts : ctx.categories || []).slice(0, 4);
  const lines: string[] = [];
  for (const act of acts) {
    const num = sectionNumber(act);
    const entry = num ? catalogEntry(num) : undefined;
    if (entry) {
      const en = entry.translations.en;
      lines.push(`• ${act}: ${en.punishment} (${entry.cognizable}, ${entry.bailable}; triable by ${entry.triableBy}). Formerly ${entry.ipcEquivalent}.`);
    } else {
      lines.push(`• ${act}`);
    }
  }
  return {
    text:
      `Offline statutory reference (from the built-in BNS 2023 codebook).\n\n${lines.join('\n') || '• No specific sections identified.'}\n\n` +
      `Open the links below to research judgments and commentary. Live Google Search grounding with summarized precedents is available when a Gemini API key is configured.`,
    groundingLinks: acts.flatMap((act) => {
      const short = act.replace(/\s*\(.*\)\s*$/, '');
      return [
        { uri: kanoonUrl(short), title: `Indian Kanoon – judgments on ${short}`, type: 'web' as const },
        { uri: searchUrl(`${short} Bharatiya Nyaya Sanhita 2023 explained`), title: `Google – ${short} explained`, type: 'web' as const },
      ];
    }),
  };
}

export function demoChatReply(message: string, firContext: string | undefined): string {
  const sec = message.match(/(?:section|sec\.?|bns)\s*(\d+[A-Z]?)/i);
  if (sec) {
    const entry = catalogEntry(sec[1]);
    if (entry) {
      const en = entry.translations.en;
      return [
        `Section ${entry.section} BNS – ${en.title}`,
        '',
        en.description,
        '',
        `Punishment: ${en.punishment}`,
        `Classification: ${entry.cognizable}, ${entry.bailable}; triable by ${entry.triableBy}.`,
        `IPC equivalent: ${entry.ipcEquivalent}`,
        '',
        'Key ingredients:',
        ...entry.ingredients.map((i) => `• ${i}`),
        '',
        'Investigative steps:',
        ...entry.investigativeSteps.map((s) => `• ${s}`),
      ].join('\n');
    }
    return `Section ${sec[1]} is not in the built-in BNS codebook. Open the BNS Library from the top bar to browse the ${BNS_CATALOG.length} sections that are available offline.`;
  }

  if (firContext && firContext.trim().length > 20) {
    const a = demoAnalyze(firContext);
    return [
      `Assessment of the active FIR (threat level: ${a.threatLevel}).`,
      '',
      a.summary,
      '',
      'Applicable provisions:',
      ...(a.recommendedActs || []).map((x) => `• ${x}`),
      '',
      'Recommended next steps:',
      ...(a.investigativeSteps || []).slice(0, 5).map((x) => `• ${x}`),
      '',
      'Tip: ask about a specific section, e.g. "Explain Section 309".',
    ].join('\n');
  }

  return [
    'I can help with FIR processing and the Bharatiya Nyaya Sanhita (BNS), 2023.',
    '',
    'Try asking:',
    '• "Explain Section 303" (theft)',
    '• "What is Section 351?" (criminal intimidation)',
    '• Or load a demo case on the Analysis screen and ask "What should we do next?"',
  ].join('\n');
}

export const DEMO_MODE_NOTE =
  'Demo mode: no GEMINI_API_KEY is configured, so this answer comes from the built-in offline engine.';
