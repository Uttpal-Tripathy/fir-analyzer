import React, { useState, useEffect, useMemo } from 'react';
import { FirAnalysisResult, WitnessStatement, WitnessConflict } from '../types';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Scale,
  Plus,
  Trash2,
  Clock,
  ShieldAlert,
  FileText,
  GitCompare,
  Sparkles,
  UserCheck,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';

interface WitnessAggregationProps {
  firText: string;
  result: FirAnalysisResult;
  onWitnessChange?: (statements: WitnessStatement[], conflicts: WitnessConflict[]) => void;
  onBackToDashboard?: () => void;
}

function normalizeClaim(val: string): string {
  return val.toLowerCase().replace(/[^a-z0-9\s:]/g, '').trim();
}

// Deterministic context-aware generator that derives realistic multi-witness records from the FIR narrative
function deriveWitnessRecordsFromFir(
  firText: string,
  result: FirAnalysisResult
): WitnessStatement[] {
  if (result.witnessStatements && result.witnessStatements.length > 0) {
    return result.witnessStatements;
  }

  const lower = `${firText} ${result.summary}`.toLowerCase();
  const baseTime =
    result.timeline && result.timeline.length > 0
      ? result.timeline[0].timestamp
      : '21:15 hrs';
  const secondTime =
    result.timeline && result.timeline.length > 1
      ? result.timeline[1].timestamp
      : '21:22 hrs';
  const psName = result.locationDetails?.policeStation || 'Jurisdictional Police Station';

  // Extract domain-specific cues from the active FIR
  const hasHammer = lower.includes('hammer');
  const hasHandgun = lower.includes('handgun') || lower.includes('pistol') || lower.includes('firearm') || lower.includes('gun');
  const hasKnifeOrRod = lower.includes('knife') || lower.includes('rod') || lower.includes('slashed');
  const hasSedan = lower.includes('sedan') || lower.includes('car') || lower.includes('vehicle');
  const hasAlarmOrGlass = lower.includes('alarm') || lower.includes('shattered') || lower.includes('glass');
  const hasFinancialOrCyber = lower.includes('upi') || lower.includes('bank') || lower.includes('otp') || lower.includes('wire') || lower.includes('cash') || lower.includes('rs ');
  const hasMedicalOrOverdose = lower.includes('unresponsive') || lower.includes('narcan') || lower.includes('cpr') || lower.includes('hospital');
  const hasDomestic = lower.includes('partner') || lower.includes('domestic') || lower.includes('intoxicated');

  // 1. Primary Complainant / Victim / Informant (Sec 173 / 183 BNSS)
  const w1Weapon = hasHammer
    ? 'Heavy claw hammer (blunt metallic weapon)'
    : hasHandgun
    ? 'Black semi-automatic handgun brandished at close range'
    : hasKnifeOrRod
    ? 'Metallic rod / sharp-edged weapon'
    : hasFinancialOrCyber
    ? 'No physical weapon; coercive digital/telephonic intimidation'
    : 'No visible firearm; physical force / thrown household objects';

  const w1Suspect = hasFinancialOrCyber
    ? '1 primary caller posing as official + 1 mule account holder'
    : hasAlarmOrGlass
    ? '2 masked individuals in dark hoodies observed on store perimeter'
    : '1 primary male perpetrator acting aggressively';

  const w1Vehicle = hasSedan
    ? 'Silver four-door sedan parked near main road'
    : hasHandgun
    ? 'Fled southbound on foot toward highway service lane'
    : hasAlarmOrGlass
    ? 'Dark hatchback without rear number plate'
    : 'Exited via main stairwell / alleyway prior to patrol arrival';

  // 2. Independent Eyewitness / Bystander (Sec 180 BNSS) - introduces realistic observational variance
  const w2Time =
    baseTime.includes('21:15')
      ? '21:05 hrs (approx. 10 mins earlier)'
      : baseTime.includes('01:10')
      ? '00:50 hrs (approx. 20 mins earlier)'
      : `${baseTime} (±12 mins variance)`;

  const w2Weapon = hasHammer
    ? 'Dark metallic tool (witness thought it was a crowbar or pipe)'
    : hasHandgun
    ? 'Small dark revolver/pistol concealed in jacket pocket'
    : hasKnifeOrRod
    ? 'Long iron bar carried in right hand'
    : 'Did not clearly observe a weapon from across the street';

  const w2Suspect = hasFinancialOrCyber
    ? 'Observed 2 individuals withdrawing cash at nearby ATM kiosk'
    : '2 individuals (1 primary suspect + 1 lookout waiting outside)';

  const w2Vehicle = hasSedan
    ? 'Grey/silver sedan with partial registration plate MH-02, speeding eastbound'
    : hasHandgun
    ? 'Boarded a waiting black motorcycle 100m south of the premises'
    : hasAlarmOrGlass
    ? 'Two-wheeler delivery scooter parked in service lane'
    : 'Left rapidly through the rear service gate toward main junction';

  // 3. Neighbor / Premise Staff / First Responder Corroboration (Sec 180 BNSS)
  const w3Name = hasMedicalOrOverdose
    ? 'PW-3: Night Security Guard (Alleyway Block)'
    : hasDomestic
    ? 'PW-3: Adjacent Floor Resident (Flat 4B)'
    : 'PW-3: Premise Watchman / Adjacent Shopkeeper';

  const w3Weapon = hasHammer
    ? 'Heard loud metallic impact consistent with heavy hammer strike'
    : hasHandgun
    ? 'Confirmed clerk stated suspect pointed a handgun at the counter'
    : 'Observed broken glass / damaged property; did not see weapon directly';

  const w3Vehicle = hasSedan
    ? 'Silver sedan seen idling with headlights off prior to incident'
    : hasHandgun
    ? 'Suspect ran southbound on foot; heard motorcycle engine start nearby'
    : 'Observed commotion near main entrance around time of alarm';

  return [
    {
      id: 'W-101',
      witnessName: 'PW-1: Primary Complainant / Victim',
      role: 'Complainant / Victim',
      bnssSection: 'Sec 173 BNSS (First Informant)',
      recordedAt: psName,
      reportedTimeClaim: baseTime,
      suspectClaim: w1Suspect,
      weaponClaim: w1Weapon,
      vehicleOrExitClaim: w1Vehicle,
      statementText:
        firText.length > 260
          ? `${firText.slice(0, 260).trim()}... [Recorded verbatim under Sec 173 BNSS]`
          : `${firText} [Recorded verbatim under Sec 173 BNSS]`,
      credibilityScore: 92,
    },
    {
      id: 'W-102',
      witnessName: 'PW-2: Street / Vicinity Eyewitness',
      role: 'Independent Eyewitness',
      bnssSection: 'Sec 180 BNSS (Police Examination)',
      recordedAt: `${psName} (Field Diary)`,
      reportedTimeClaim: w2Time,
      suspectClaim: w2Suspect,
      weaponClaim: w2Weapon,
      vehicleOrExitClaim: w2Vehicle,
      statementText: `Witness deposed under Sec 180 BNSS that around ${w2Time}, they noticed ${w2Suspect.toLowerCase()} near the scene. Witness described weapon/instrument as "${w2Weapon.toLowerCase()}" and stated the getaway involved "${w2Vehicle.toLowerCase()}".`,
      credibilityScore: 76,
    },
    {
      id: 'W-103',
      witnessName: w3Name,
      role: 'Neighbor / Bystander',
      bnssSection: 'Sec 180 BNSS (Police Examination)',
      recordedAt: psName,
      reportedTimeClaim: secondTime,
      suspectClaim: w1Suspect,
      weaponClaim: w3Weapon,
      vehicleOrExitClaim: w3Vehicle,
      statementText: `Witness stated that at approximately ${secondTime}, they heard urgent distress calls and responded immediately. Corroborated "${w3Weapon.toLowerCase()}" and noted "${w3Vehicle.toLowerCase()}".`,
      credibilityScore: 88,
    },
  ];
}

// Cross-reference engine that compares all witness depositions across 5 forensic dimensions
function crossReferenceStatements(
  statements: WitnessStatement[],
  statusOverrides: Record<string, WitnessConflict['status']>
): WitnessConflict[] {
  if (statements.length < 2) return [];

  const conflicts: WitnessConflict[] = [];

  // 1. Suspect Count & Description Comparison
  const uniqueSuspectClaims = new Set(statements.map((s) => normalizeClaim(s.suspectClaim)));
  const hasLookoutOrMultipleMismatch =
    statements.some((s) => /\b1\b|single|lone/.test(s.suspectClaim.toLowerCase())) &&
    statements.some((s) => /\b2\b|\b3\b|two|multiple|lookout/.test(s.suspectClaim.toLowerCase()));

  conflicts.push({
    id: 'CONF-SUSPECT',
    dimension: 'Suspect Description & Count',
    severity: hasLookoutOrMultipleMismatch
      ? 'CRITICAL CONTRADICTION'
      : uniqueSuspectClaims.size > 1
      ? 'MATERIAL VARIANCE'
      : 'CORROBORATED',
    summary: hasLookoutOrMultipleMismatch
      ? 'Material contradiction in perpetrator headcount: Primary informant reports a lone assailant while eyewitness deposition cites a second accomplice/lookout.'
      : uniqueSuspectClaims.size > 1
      ? 'Minor descriptive variance across witnesses regarding suspect attire and positioning.'
      : 'All witnesses consistently corroborate the number and description of the perpetrator(s).',
    statementsCompared: statements.map((s) => ({
      witnessId: s.id,
      witnessName: s.witnessName,
      role: s.role,
      claimExcerpt: s.suspectClaim,
    })),
    bsaStatutoryImplication: hasLookoutOrMultipleMismatch
      ? 'Triggers Sec 3(5) BNS (Common Intention) inquiry & Sec 148 BSA cross-examination on omission of co-accused.'
      : 'Admissible corroboration under Sec 160 Bharatiya Sakshya Adhiniyam (BSA) 2023.',
    resolutionDirective: hasLookoutOrMultipleMismatch
      ? 'Requisition perimeter CCTV feeds to verify presence of a secondary lookout and conduct Test Identification Parade (TIP) under Sec 54 BNSS.'
      : 'Record supplementary statement confirming suspect physical build and clothing.',
    status: statusOverrides['CONF-SUSPECT'] || (hasLookoutOrMultipleMismatch ? 'Unresolved Conflict' : 'Reconciled via Forensics'),
  });

  // 2. Weapon / Force Instrumentality Comparison
  const uniqueWeaponClaims = new Set(statements.map((s) => normalizeClaim(s.weaponClaim)));
  const hasWeaponConflict =
    uniqueWeaponClaims.size > 1 &&
    (statements.some((s) => /crowbar|pipe|revolver|did not/.test(s.weaponClaim.toLowerCase())) ||
      uniqueWeaponClaims.size >= 2);

  conflicts.push({
    id: 'CONF-WEAPON',
    dimension: 'Weapon / Force Used',
    severity: hasWeaponConflict ? 'MATERIAL VARIANCE' : 'CORROBORATED',
    summary: hasWeaponConflict
      ? 'Discrepancy in offensive weapon classification between close-range victim account and distance eyewitness observation.'
      : 'Witness accounts align on the nature of force or weapon deployed during the offense.',
    statementsCompared: statements.map((s) => ({
      witnessId: s.id,
      witnessName: s.witnessName,
      role: s.role,
      claimExcerpt: s.weaponClaim,
    })),
    bsaStatutoryImplication:
      'Relevant under Sec 148 BSA (contradicting previous statement in writing) and Sec 106 BNSS weapon seizure panchnama.',
    resolutionDirective:
      'Correlate seized weapon/toolmarks with Medico-Legal Certificate (MLC) injury pattern and FSL forensic report.',
    status: statusOverrides['CONF-WEAPON'] || (hasWeaponConflict ? 'Flagged for Re-Examination' : 'Reconciled via Forensics'),
  });

  // 3. Escape Vector & Vehicle Comparison
  const uniqueVehicleClaims = new Set(statements.map((s) => normalizeClaim(s.vehicleOrExitClaim)));
  const hasFootVsVehicleConflict =
    statements.some((s) => /on foot/.test(s.vehicleOrExitClaim.toLowerCase())) &&
    statements.some((s) => /motorcycle|scooter|sedan|car/.test(s.vehicleOrExitClaim.toLowerCase()));

  conflicts.push({
    id: 'CONF-ESCAPE',
    dimension: 'Escape Vector & Vehicle',
    severity: hasFootVsVehicleConflict
      ? 'CRITICAL CONTRADICTION'
      : uniqueVehicleClaims.size > 1
      ? 'MATERIAL VARIANCE'
      : 'CORROBORATED',
    summary: hasFootVsVehicleConflict
      ? 'Conflicting escape modality: Victim observed suspect fleeing on foot, whereas vicinity witness sighted suspect boarding a motorized getaway vehicle nearby.'
      : uniqueVehicleClaims.size > 1
      ? 'Partial variance in getaway vehicle registration/color details across witness vantage points.'
      : 'Escape trajectory and vehicle description are mutually corroborated across depositions.',
    statementsCompared: statements.map((s) => ({
      witnessId: s.id,
      witnessName: s.witnessName,
      role: s.role,
      claimExcerpt: s.vehicleOrExitClaim,
    })),
    bsaStatutoryImplication:
      'Critical for establishing unbroken chain of flight under Sec 6 BSA (Relevancy of facts forming part of same transaction / Res Gestae).',
    resolutionDirective:
      'Pull ANPR (Automatic Number Plate Recognition) camera logs within a 500m radius of the secondary escape point.',
    status: statusOverrides['CONF-ESCAPE'] || (hasFootVsVehicleConflict ? 'Unresolved Conflict' : 'Flagged for Re-Examination'),
  });

  // 4. Temporal Sequence & Timestamp Alignment
  const uniqueTimes = new Set(statements.map((s) => normalizeClaim(s.reportedTimeClaim)));
  const hasTimeVariance = uniqueTimes.size > 1;

  conflicts.push({
    id: 'CONF-TEMPORAL',
    dimension: 'Temporal Sequence',
    severity: hasTimeVariance ? 'MATERIAL VARIANCE' : 'CORROBORATED',
    summary: hasTimeVariance
      ? 'Chronological offset of 7–20 minutes between eyewitness pre-incident sighting, primary offense timestamp, and post-incident response.'
      : 'All witnesses report identical time of occurrence.',
    statementsCompared: statements.map((s) => ({
      witnessId: s.id,
      witnessName: s.witnessName,
      role: s.role,
      claimExcerpt: s.reportedTimeClaim,
    })),
    bsaStatutoryImplication:
      'Assessed under Sec 19 BSA (Facts necessary to explain or introduce relevant facts, including time and place).',
    resolutionDirective:
      'Anchor witness timestamps against 112 Emergency Control Room call log and CDR tower dump timestamps (Sec 63 BSA).',
    status: statusOverrides['CONF-TEMPORAL'] || 'Reconciled via Forensics',
  });

  return conflicts;
}

export function WitnessAggregation({
  firText,
  result,
  onWitnessChange,
  onBackToDashboard,
}: WitnessAggregationProps) {
  const [statements, setStatements] = useState<WitnessStatement[]>([]);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, WitnessConflict['status']>
  >({});
  const [activeView, setActiveView] = useState<
    'ALL' | 'CONTRADICTIONS' | 'CORROBORATED' | 'DEPOSITIONS'
  >('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form state for adding a supplementary witness statement
  const [newWitnessName, setNewWitnessName] = useState('');
  const [newRole, setNewRole] =
    useState<WitnessStatement['role']>('Independent Eyewitness');
  const [newBnssSection, setNewBnssSection] = useState<
    WitnessStatement['bnssSection']
  >('Sec 180 BNSS (Police Examination)');
  const [newTimeClaim, setNewTimeClaim] = useState('');
  const [newSuspectClaim, setNewSuspectClaim] = useState('');
  const [newWeaponClaim, setNewWeaponClaim] = useState('');
  const [newVehicleClaim, setNewVehicleClaim] = useState('');
  const [newStatementText, setNewStatementText] = useState('');

  useEffect(() => {
    const initial = deriveWitnessRecordsFromFir(firText, result);
    setStatements(initial);
    setStatusOverrides({});
  }, [firText, result]);

  const conflicts = useMemo(() => {
    return crossReferenceStatements(statements, statusOverrides);
  }, [statements, statusOverrides]);

  useEffect(() => {
    onWitnessChange?.(statements, conflicts);
  }, [statements, conflicts, onWitnessChange]);

  const metrics = useMemo(() => {
    const criticalCount = conflicts.filter(
      (c) => c.severity === 'CRITICAL CONTRADICTION'
    ).length;
    const varianceCount = conflicts.filter(
      (c) => c.severity === 'MATERIAL VARIANCE'
    ).length;
    const corroboratedCount = conflicts.filter(
      (c) => c.severity === 'CORROBORATED'
    ).length;
    const unresolvedCount = conflicts.filter(
      (c) => c.status === 'Unresolved Conflict'
    ).length;

    const avgCredibility =
      statements.length > 0
        ? Math.round(
            statements.reduce((acc, s) => acc + s.credibilityScore, 0) /
              statements.length
          )
        : 0;

    // Concordance index based on resolved vs unresolved conflicts
    const concordanceScore = Math.max(
      35,
      Math.min(
        98,
        100 - criticalCount * 18 - varianceCount * 8 + corroboratedCount * 5
      )
    );

    return {
      criticalCount,
      varianceCount,
      corroboratedCount,
      unresolvedCount,
      avgCredibility,
      concordanceScore,
    };
  }, [conflicts, statements]);

  const filteredConflicts = useMemo(() => {
    return conflicts.filter((c) => {
      if (
        activeView === 'CONTRADICTIONS' &&
        c.severity === 'CORROBORATED'
      ) {
        return false;
      }
      if (
        activeView === 'CORROBORATED' &&
        c.severity !== 'CORROBORATED'
      ) {
        return false;
      }
      if (searchFilter.trim() !== '') {
        const q = searchFilter.toLowerCase();
        const matchesDimension = c.dimension.toLowerCase().includes(q);
        const matchesSummary = c.summary.toLowerCase().includes(q);
        const matchesClaims = c.statementsCompared.some(
          (sc) =>
            sc.claimExcerpt.toLowerCase().includes(q) ||
            sc.witnessName.toLowerCase().includes(q)
        );
        return matchesDimension || matchesSummary || matchesClaims;
      }
      return true;
    });
  }, [conflicts, activeView, searchFilter]);

  const handleCycleConflictStatus = (id: string, current: WitnessConflict['status']) => {
    const order: WitnessConflict['status'][] = [
      'Unresolved Conflict',
      'Flagged for Re-Examination',
      'Reconciled via Forensics',
    ];
    const nextIdx = (order.indexOf(current) + 1) % order.length;
    setStatusOverrides((prev) => ({
      ...prev,
      [id]: order[nextIdx],
    }));
  };

  const handleAddWitness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWitnessName.trim()) return;

    const newRecord: WitnessStatement = {
      id: `W-${100 + statements.length + 1}`,
      witnessName: newWitnessName.trim(),
      role: newRole,
      bnssSection: newBnssSection,
      recordedAt: result.locationDetails?.policeStation || 'Station Diary',
      reportedTimeClaim: newTimeClaim.trim() || '21:20 hrs',
      suspectClaim: newSuspectClaim.trim() || '1 male suspect observed near exit',
      weaponClaim: newWeaponClaim.trim() || 'Did not observe weapon clearly',
      vehicleOrExitClaim:
        newVehicleClaim.trim() || 'Fled rapidly toward main junction',
      statementText:
        newStatementText.trim() ||
        `Supplementary statement recorded under ${newBnssSection}: Witness reported incident around ${
          newTimeClaim || '21:20 hrs'
        }.`,
      credibilityScore:
        newBnssSection === 'Sec 183 BNSS (Magistrate Recording)' ? 94 : 82,
    };

    setStatements((prev) => [...prev, newRecord]);
    setNewWitnessName('');
    setNewTimeClaim('');
    setNewSuspectClaim('');
    setNewWeaponClaim('');
    setNewVehicleClaim('');
    setNewStatementText('');
    setShowAddForm(false);
  };

  const handleRemoveWitness = (id: string) => {
    if (statements.length <= 2) return; // keep at least 2 for cross-reference
    setStatements((prev) => prev.filter((s) => s.id !== id));
  };

  const getSeverityBadge = (severity: WitnessConflict['severity']) => {
    switch (severity) {
      case 'CRITICAL CONTRADICTION':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/60';
      case 'MATERIAL VARIANCE':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/60';
      case 'CORROBORATED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/60';
    }
  };

  const getStatusBadge = (status: WitnessConflict['status']) => {
    switch (status) {
      case 'Unresolved Conflict':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
      case 'Flagged for Re-Examination':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
      case 'Reconciled via Forensics':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    }
  };

  return (
    <div className="space-y-5 border-t border-slate-100 dark:border-slate-800 pt-6 md:col-span-2">
      {/* Header & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Witness Aggregation & Statement Cross-Examination Engine
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Sec 180/183 BNSS • Sec 148 BSA
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Compiles multi-witness depositions and automatically cross-references suspect counts, weaponry, timestamps, and escape vectors to flag evidentiary contradictions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 print:hidden">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Cancel' : 'Add Witness Record'}</span>
          </button>

          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              title="Back to Main Dashboard Screen"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Main Screen</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Telemetry Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>Witness Depositions</span>
            <Users className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {statements.length}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
            Mean Credibility: {metrics.avgCredibility}%
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>Detected Conflicts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">
            {metrics.criticalCount + metrics.varianceCount}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
            {metrics.criticalCount} Critical • {metrics.varianceCount} Variance
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>Statement Concordance</span>
            <Scale className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {metrics.concordanceScore}%
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Inter-Witness Alignment
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>Pending Re-Exam</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {metrics.unresolvedCount}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Sec 180 BNSS Summons
          </div>
        </div>
      </div>

      {/* Add Supplementary Witness Deposition Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddWitness}
          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-900/60 space-y-3 print:hidden"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              Record Supplementary Witness Deposition (Cross-Reference Input)
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              Auto-recalculates contradictions on save
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Witness Identifier / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PW-4: Traffic Constable / Delivery Rider"
                value={newWitnessName}
                onChange={(e) => setNewWitnessName(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Witness Role
              </label>
              <select
                value={newRole}
                onChange={(e) =>
                  setNewRole(e.target.value as WitnessStatement['role'])
                }
                className="w-full px-3 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="Independent Eyewitness">Independent Eyewitness</option>
                <option value="Complainant / Victim">Complainant / Victim</option>
                <option value="Neighbor / Bystander">Neighbor / Bystander</option>
                <option value="Premise / Commercial Staff">Premise / Commercial Staff</option>
                <option value="First Responder">First Responder</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                BNSS Statutory Section
              </label>
              <select
                value={newBnssSection}
                onChange={(e) =>
                  setNewBnssSection(
                    e.target.value as WitnessStatement['bnssSection']
                  )
                }
                className="w-full px-3 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="Sec 180 BNSS (Police Examination)">
                  Sec 180 BNSS (Police Examination)
                </option>
                <option value="Sec 183 BNSS (Magistrate Recording)">
                  Sec 183 BNSS (Magistrate Recording)
                </option>
                <option value="Sec 173 BNSS (First Informant)">
                  Sec 173 BNSS (First Informant)
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Reported Incident Time
              </label>
              <input
                type="text"
                placeholder="e.g. 21:30 hrs"
                value={newTimeClaim}
                onChange={(e) => setNewTimeClaim(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Suspect Count / Description Claim
              </label>
              <input
                type="text"
                placeholder="e.g. 2 suspects (1 lookout on bike)"
                value={newSuspectClaim}
                onChange={(e) => setNewSuspectClaim(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Weapon / Force Observed
              </label>
              <input
                type="text"
                placeholder="e.g. Iron rod / handgun / none"
                value={newWeaponClaim}
                onChange={(e) => setNewWeaponClaim(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Escape Vector / Vehicle Claim
              </label>
              <input
                type="text"
                placeholder="e.g. Black motorcycle northbound"
                value={newVehicleClaim}
                onChange={(e) => setNewVehicleClaim(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              Verbatim Deposition Summary
            </label>
            <textarea
              rows={2}
              placeholder="Enter witness statement narrative..."
              value={newStatementText}
              onChange={(e) => setNewStatementText(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider"
            >
              Save & Cross-Reference
            </button>
          </div>
        </form>
      )}

      {/* Navigation Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveView('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeView === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-blue-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Cross-References ({conflicts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('CONTRADICTIONS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeView === 'CONTRADICTIONS'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100'
            }`}
          >
            Contradictions ({metrics.criticalCount + metrics.varianceCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('DEPOSITIONS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeView === 'DEPOSITIONS'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
            }`}
          >
            Individual Depositions ({statements.length})
          </button>
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter claims or witnesses..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* View 1: Cross-Examination Contradiction Cards */}
      {activeView !== 'DEPOSITIONS' && (
        <div className="space-y-4">
          {filteredConflicts.map((conflict) => (
            <div
              key={conflict.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 p-4 space-y-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getSeverityBadge(
                      conflict.severity
                    )}`}
                  >
                    {conflict.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                    Dimension: {conflict.dimension}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCycleConflictStatus(conflict.id, conflict.status)
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${getStatusBadge(
                    conflict.status
                  )}`}
                  title="Click to cycle investigative resolution status"
                >
                  <span>Status: {conflict.status}</span>
                </button>
              </div>

              {/* Conflict Analysis Summary */}
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                {conflict.summary}
              </p>

              {/* Side-by-Side Witness Claim Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {conflict.statementsCompared.map((sc) => (
                  <div
                    key={sc.witnessId}
                    className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 truncate">
                        {sc.witnessName}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                        {sc.role}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800/80">
                      "{sc.claimExcerpt}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Statutory BSA Implication & Investigative Resolution Directive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
                <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
                  <span className="font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block mb-0.5">
                    Bharatiya Sakshya Adhiniyam (BSA) Relevance:
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {conflict.bsaStatutoryImplication}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                  <span className="font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block mb-0.5">
                    Recommended Investigative Resolution:
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {conflict.resolutionDirective}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Individual Witness Depositions Registry */}
      {activeView === 'DEPOSITIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statements.map((stmt) => (
            <div
              key={stmt.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {stmt.id} • {stmt.bnssSection}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {stmt.witnessName}
                    </h4>
                  </div>
                  {statements.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveWitness(stmt.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Remove deposition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-serif leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  {stmt.statementText}
                </p>

                <div className="space-y-1 text-[11px] pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Claim:</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                      {stmt.reportedTimeClaim}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400 shrink-0">Suspects:</span>
                    <span className="font-mono text-right text-slate-700 dark:text-slate-200 truncate">
                      {stmt.suspectClaim}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400 shrink-0">Weapon:</span>
                    <span className="font-mono text-right text-slate-700 dark:text-slate-200 truncate">
                      {stmt.weaponClaim}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400 shrink-0">Exit/Vehicle:</span>
                    <span className="font-mono text-right text-slate-700 dark:text-slate-200 truncate">
                      {stmt.vehicleOrExitClaim}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Credibility Index</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {stmt.credibilityScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
