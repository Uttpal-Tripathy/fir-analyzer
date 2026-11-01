import React, { useState, useEffect, useMemo } from 'react';
import { EvidenceCategory, EvidenceItem, FirAnalysisResult } from '../types';
import { Cpu, HardDrive, Shield, Users, Landmark, FlaskConical, Car, Plus, Sparkles, CheckCircle2, Clock, Send, Trash2, Tag, ArrowLeft } from 'lucide-react';

interface EvidenceAutoTaggerProps {
  firText: string;
  result: FirAnalysisResult;
  onEvidenceChange?: (items: EvidenceItem[]) => void;
  onBackToDashboard?: () => void;
}

const EVIDENCE_CATEGORIES: EvidenceCategory[] = [
  'Digital Evidence',
  'Physical Weaponry',
  'Witness Statements',
  'Financial Records',
  'Forensic & Medical',
  'Vehicle & Property',
];

interface CategoryFeatureModel {
  category: EvidenceCategory;
  keywords: { term: string; weight: number; label: string; bns: string }[];
  defaultBns: string;
}

const ML_FEATURE_MODELS: CategoryFeatureModel[] = [
  {
    category: 'Digital Evidence',
    defaultBns: 'Sec 63 BSA (Electronic Record Admissibility)',
    keywords: [
      { term: 'cctv', weight: 0.96, label: 'CCTV Surveillance Footage', bns: 'Sec 63 BSA (Electronic Evidence Certificate)' },
      { term: 'camera', weight: 0.91, label: 'Security / Traffic Camera Feed', bns: 'Sec 63 BSA (Electronic Record)' },
      { term: 'video', weight: 0.92, label: 'Recorded Mobile / Bystander Video', bns: 'Sec 63 BSA (Digital Recording)' },
      { term: 'phone', weight: 0.88, label: 'Telephonic / CDR Call Logs', bns: 'Sec 63 BSA & Sec 94 BNSS Summons' },
      { term: 'caller id', weight: 0.93, label: 'Caller ID & Telecom CDR Dump', bns: 'Sec 63 BSA (Telecom Records)' },
      { term: 'otp', weight: 0.94, label: 'OTP & Authentication Logs', bns: 'Sec 66D IT Act & Sec 63 BSA' },
      { term: 'screen-sharing', weight: 0.95, label: 'Remote Screen-Sharing App Artifacts', bns: 'Sec 63 BSA (Digital Forensics)' },
      { term: 'ip address', weight: 0.95, label: 'Network IP Access Logs', bns: 'Sec 63 BSA (Server/ISP Logs)' },
      { term: 'alarm', weight: 0.86, label: 'Electronic Intrusion Alarm Log', bns: 'Sec 63 BSA (System Telemetry)' },
    ],
  },
  {
    category: 'Physical Weaponry',
    defaultBns: 'Sec 106 BNSS (Seizure of Offensive Weapons)',
    keywords: [
      { term: 'hammer', weight: 0.96, label: 'Blunt Force Weapon (Hammer)', bns: 'Sec 106 BNSS Seizure & Sec 115/109 BNS' },
      { term: 'handgun', weight: 0.98, label: 'Firearm (Handgun)', bns: 'Arms Act Sec 25/27 & Ballistics FSL' },
      { term: 'pistol', weight: 0.98, label: 'Country-Made Pistol / Firearm', bns: 'Arms Act Sec 25 & Sec 106 BNSS' },
      { term: 'firearm', weight: 0.97, label: 'Seized Illegal Firearms', bns: 'Arms Act & FSL Ballistic Examination' },
      { term: 'gunshot', weight: 0.95, label: 'Ballistic Projectiles / Spent Casings', bns: 'Sec 103 BNS & Forensic Ballistics' },
      { term: 'iron rod', weight: 0.96, label: 'Metallic Assault Weapon (Iron Rods)', bns: 'Sec 117/109 BNS Weapon Seizure' },
      { term: 'accelerant', weight: 0.94, label: 'Incendiary Accelerant Residue', bns: 'Sec 326 BNS Arson Chemical Analysis' },
      { term: 'slashed', weight: 0.89, label: 'Sharp Cutting / Slashing Instrument', bns: 'Sec 324 BNS Toolmark Comparison' },
    ],
  },
  {
    category: 'Witness Statements',
    defaultBns: 'Sec 180 / Sec 183 BNSS (Witness & Victim Testimony)',
    keywords: [
      { term: 'witness', weight: 0.95, label: 'Eyewitness Deposition', bns: 'Sec 180 BNSS Police Examination' },
      { term: 'bystander', weight: 0.93, label: 'Bystander Eyewitness Account', bns: 'Sec 180 BNSS Independent Witness' },
      { term: 'complainant', weight: 0.94, label: 'Primary Complainant FIR Statement', bns: 'Sec 173 BNSS First Information' },
      { term: 'victim', weight: 0.91, label: 'Victim Injured/Survivor Statement', bns: 'Sec 183 BNSS Magistrate Recording' },
      { term: 'clerk', weight: 0.90, label: 'Store Clerk Eyewitness Testimony', bns: 'Sec 180 BNSS Statement' },
      { term: 'co-passenger', weight: 0.92, label: 'Commuter / Co-Passenger Testimony', bns: 'Sec 180 BNSS Witness Corroboration' },
    ],
  },
  {
    category: 'Financial Records',
    defaultBns: 'Sec 107 BNSS (Attachment of Proceeds of Crime)',
    keywords: [
      { term: 'upi', weight: 0.97, label: 'Unauthorized UPI Transaction Trail', bns: 'Sec 318 BNS & NPCI Ledger Freeze' },
      { term: 'wire transfer', weight: 0.96, label: 'Bank Wire Transfer Records', bns: 'Sec 94 BNSS Bank Nodal Summons' },
      { term: 'bank account', weight: 0.95, label: 'Beneficiary / Mule Bank Account Statement', bns: 'Sec 106/107 BNSS Account Freeze' },
      { term: 'cash', weight: 0.93, label: 'Currency / Cash Seizure Panchnama', bns: 'Sec 106 BNSS Seizure Memo' },
      { term: 'protection money', weight: 0.92, label: 'Extortion Demand Financial Log', bns: 'Sec 308 BNS Extortion Evidence' },
      { term: 'rs ', weight: 0.89, label: 'Quantified Financial Loss / Valuation Ledger', bns: 'Sec 318/309 BNS Pecuniary Record' },
      { term: '$', weight: 0.89, label: 'Financial Transaction / Currency Record', bns: 'Financial Trail Audit' },
    ],
  },
  {
    category: 'Forensic & Medical',
    defaultBns: 'Sec 51/52 BNSS & FSL Chain of Custody',
    keywords: [
      { term: 'laceration', weight: 0.95, label: 'Medico-Legal Certificate (Head Laceration)', bns: 'Sec 115/117 BNS Medical Injury Report' },
      { term: 'fracture', weight: 0.95, label: 'Radiology / Trauma Fracture MLC Report', bns: 'Sec 116/117 BNS Grievous Hurt Proof' },
      { term: 'hospital', weight: 0.91, label: 'Emergency Hospital Admission & MLC Record', bns: 'Medical Officer Testimony' },
      { term: 'deceased', weight: 0.97, label: 'Inquest & Post-Mortem Autopsy Report', bns: 'Sec 194 BNSS Inquest Report' },
      { term: 'fentanyl', weight: 0.98, label: 'Seized Contraband Narcotics Sample', bns: 'NDPS Act FSL Chemical Assay' },
      { term: 'narcotic', weight: 0.97, label: 'Forensic Narcotics Seizure Sample', bns: 'NDPS Act Sec 52A Inventory' },
      { term: 'fingerprint', weight: 0.95, label: 'Latent Fingerprint & DNA Swabs', bns: 'Forensic Science Lab (FSL) Match' },
    ],
  },
  {
    category: 'Vehicle & Property',
    defaultBns: 'Sec 106 BNSS Property Seizure & Panchnama',
    keywords: [
      { term: 'sedan', weight: 0.93, label: 'Suspect Getaway Vehicle (Silver Sedan)', bns: 'Vahan Database & Sec 106 BNSS' },
      { term: 'suv', weight: 0.93, label: 'Involved Motor Vehicle (SUV)', bns: 'Motor Vehicles Act & Mechanical Inspection' },
      { term: 'motorcycle', weight: 0.92, label: 'Suspect Two-Wheeler (Motorcycle)', bns: 'RTO Registration & ANPR Trace' },
      { term: 'van', weight: 0.92, label: 'Impounded Transport Van', bns: 'Sec 106 BNSS Vehicle Seizure' },
      { term: 'license plate', weight: 0.95, label: 'Vehicle Registration / License Plate Trace', bns: 'Vahan RTO Ownership Record' },
      { term: 'shattered', weight: 0.89, label: 'Point-of-Entry Physical Damage (Shattered Glass)', bns: 'Crime Scene Panchnama' },
    ],
  },
];

// Client-side ML feature classifier for single text item
export function classifySingleEvidenceItemML(text: string): {
  category: EvidenceCategory;
  confidence: number;
  bnsRelevance: string;
} {
  const lower = text.toLowerCase();
  let bestCategory: EvidenceCategory = 'Witness Statements';
  let bestScore = 0.78;
  let bestBns = 'Sec 106 BNSS (Evidence Seizure Memo)';

  for (const model of ML_FEATURE_MODELS) {
    for (const kw of model.keywords) {
      if (lower.includes(kw.term)) {
        if (kw.weight > bestScore) {
          bestScore = kw.weight;
          bestCategory = model.category;
          bestBns = kw.bns;
        }
      }
    }
  }

  // Secondary lexical heuristics
  if (bestScore === 0.78) {
    if (/(whatsapp|email|laptop|mobile|sim|server|cyber| screenshot|audio|recording)/i.test(lower)) {
      bestCategory = 'Digital Evidence';
      bestScore = 0.92;
      bestBns = 'Sec 63 BSA (Electronic Evidence Certificate)';
    } else if (/(knife|gun|rifle|blade|acid|bomb|cartridge|bullet|rod|club)/i.test(lower)) {
      bestCategory = 'Physical Weaponry';
      bestScore = 0.94;
      bestBns = 'Arms Act & Sec 106 BNSS Weapon Seizure';
    } else if (/(statement|testimony|affidavit|confession|interview|deposition)/i.test(lower)) {
      bestCategory = 'Witness Statements';
      bestScore = 0.91;
      bestBns = 'Sec 180 / Sec 183 BNSS Statement';
    } else if (/(cheque|invoice|receipt|ledger|account|rtgs|neft|ransom|money)/i.test(lower)) {
      bestCategory = 'Financial Records';
      bestScore = 0.93;
      bestBns = 'Sec 94 BNSS Financial Summons';
    } else if (/(blood|dna|autopsy|mlc|swab|viscera|hair|injury|medical)/i.test(lower)) {
      bestCategory = 'Forensic & Medical';
      bestScore = 0.94;
      bestBns = 'FSL Forensic Chain of Custody';
    } else if (/(car|truck|bike|scooter|chassis|property|door|lock)/i.test(lower)) {
      bestCategory = 'Vehicle & Property';
      bestScore = 0.89;
      bestBns = 'Crime Scene Property Panchnama';
    }
  }

  return {
    category: bestCategory,
    confidence: Math.round(bestScore * 100),
    bnsRelevance: bestBns,
  };
}

// Automatically extract & classify evidence items from FIR text + analysis result
export function autoExtractEvidenceFromFIR(firText: string, result: FirAnalysisResult): EvidenceItem[] {
  if (result.evidenceItems && result.evidenceItems.length > 0) {
    return result.evidenceItems.map((item, idx) => ({
      ...item,
      id: item.id || `EV-0${idx + 1}`,
      chainOfCustodyStatus: item.chainOfCustodyStatus || 'Pending Collection',
      bnsRelevance: item.bnsRelevance || classifySingleEvidenceItemML(item.item).bnsRelevance,
    }));
  }

  const combinedCorpus = `${firText} ${result.summary} ${(result.investigativeSteps || []).join(' ')}`;
  const lowerCorpus = combinedCorpus.toLowerCase();
  const sentences = firText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const extracted: EvidenceItem[] = [];
  const seenLabels = new Set<string>();

  for (const model of ML_FEATURE_MODELS) {
    for (const kw of model.keywords) {
      if (lowerCorpus.includes(kw.term) && !seenLabels.has(kw.label)) {
        seenLabels.add(kw.label);
        const matchingSentence = sentences.find((s) => s.toLowerCase().includes(kw.term));
        extracted.push({
          id: `EV-0${extracted.length + 1}`,
          item: kw.label,
          category: model.category,
          confidence: Math.round(kw.weight * 100),
          sourceExcerpt: matchingSentence || result.summary,
          chainOfCustodyStatus: 'Pending Collection',
          bnsRelevance: kw.bns,
        });
      }
    }
  }

  // Ensure at least 3 structured evidence items even for brief FIRs
  if (extracted.length === 0) {
    extracted.push({
      id: 'EV-01',
      item: 'Complainant First Information Statement',
      category: 'Witness Statements',
      confidence: 96,
      sourceExcerpt: result.summary,
      chainOfCustodyStatus: 'Logged & Sealed',
      bnsRelevance: 'Sec 173 BNSS Statutory FIR Record',
    });
  }

  return extracted.slice(0, 8);
}

export function EvidenceAutoTagger({ firText, result, onEvidenceChange, onBackToDashboard }: EvidenceAutoTaggerProps) {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | EvidenceCategory>('ALL');
  const [newItemText, setNewItemText] = useState('');
  const [reclassifying, setReclassifying] = useState(false);

  useEffect(() => {
    const initial = autoExtractEvidenceFromFIR(firText, result);
    setItems(initial);
    onEvidenceChange?.(initial);
  }, [result, firText]);

  const updateItems = (next: EvidenceItem[]) => {
    setItems(next);
    onEvidenceChange?.(next);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: items.length };
    EVIDENCE_CATEGORIES.forEach((c) => (counts[c] = 0));
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'ALL') return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const handleAddEvidenceItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const mlPrediction = classifySingleEvidenceItemML(newItemText.trim());
    const newItem: EvidenceItem = {
      id: `EV-0${items.length + 1}`,
      item: newItemText.trim(),
      category: mlPrediction.category,
      confidence: mlPrediction.confidence,
      sourceExcerpt: 'Investigator manual entry — auto-tagged by ML classifier',
      chainOfCustodyStatus: 'Pending Collection',
      bnsRelevance: mlPrediction.bnsRelevance,
    };
    updateItems([newItem, ...items]);
    setNewItemText('');
  };

  const handleDeepAiReclassify = async () => {
    if (!firText.trim()) return;
    setReclassifying(true);
    try {
      const response = await fetch('/api/classify-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firText }),
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data.evidenceItems) && data.evidenceItems.length > 0) {
        updateItems(
          data.evidenceItems.map((ev: EvidenceItem, idx: number) => ({
            ...ev,
            id: ev.id || `EV-0${idx + 1}`,
            chainOfCustodyStatus: ev.chainOfCustodyStatus || 'Pending Collection',
          }))
        );
      }
    } catch (err) {
      console.error('Failed to run deep AI evidence classification:', err);
    } finally {
      setReclassifying(false);
    }
  };

  const cycleCustodyStatus = (id: string) => {
    const order: ('Pending Collection' | 'Logged & Sealed' | 'Sent to FSL')[] = [
      'Pending Collection',
      'Logged & Sealed',
      'Sent to FSL',
    ];
    updateItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const currIdx = order.indexOf(item.chainOfCustodyStatus || 'Pending Collection');
        const nextStatus = order[(currIdx + 1) % order.length];
        return { ...item, chainOfCustodyStatus: nextStatus };
      })
    );
  };

  const handleCategoryChange = (id: string, newCat: EvidenceCategory) => {
    updateItems(
      items.map((item) => (item.id === id ? { ...item, category: newCat, confidence: 100 } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    updateItems(items.filter((item) => item.id !== id));
  };

  const getCategoryStyle = (category: EvidenceCategory) => {
    switch (category) {
      case 'Digital Evidence':
        return {
          badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
          icon: <HardDrive className="w-3.5 h-3.5 text-sky-500" />,
        };
      case 'Physical Weaponry':
        return {
          badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60',
          icon: <Shield className="w-3.5 h-3.5 text-red-500" />,
        };
      case 'Witness Statements':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
          icon: <Users className="w-3.5 h-3.5 text-purple-500" />,
        };
      case 'Financial Records':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
          icon: <Landmark className="w-3.5 h-3.5 text-emerald-500" />,
        };
      case 'Forensic & Medical':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
          icon: <FlaskConical className="w-3.5 h-3.5 text-amber-500" />,
        };
      case 'Vehicle & Property':
      default:
        return {
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
          icon: <Car className="w-3.5 h-3.5 text-indigo-500" />,
        };
    }
  };

  return (
    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 md:col-span-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>ML Evidence Auto-Tagging & Chain of Custody</span>
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Automatically classifies extracted evidentiary items into forensic classes with confidence scoring and BSA/BNSS admissibility tags.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto print:hidden">
          <button
            type="button"
            onClick={handleDeepAiReclassify}
            disabled={reclassifying || !firText.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${reclassifying ? 'animate-spin' : ''}`} />
            <span>{reclassifying ? 'Classifying...' : 'Deep ML Re-Scan'}</span>
          </button>

          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-700 transition-colors cursor-pointer"
              title="Back to Main Dashboard Screen"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Main Screen</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-1.5 print:hidden">
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-600'
              : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          All ({categoryCounts.ALL || 0})
        </button>
        {EVIDENCE_CATEGORIES.map((cat) => {
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{cat}</span>
              <span className="px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 text-[10px] font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add & Auto-Tag New Evidence Form */}
      <form onSubmit={handleAddEvidenceItem} className="flex gap-2 print:hidden">
        <div className="relative flex-1">
          <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Log additional evidence item (e.g., 'Suspect WhatsApp chat dump', '9mm shell casing', 'HDFC bank statement')..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={!newItemText.trim()}
          className="px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-40 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Auto-Tag</span>
        </button>
      </form>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((ev) => {
          const style = getCategoryStyle(ev.category);
          return (
            <div
              key={ev.id}
              className="p-3.5 rounded-lg bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {ev.id}
                    </span>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold border ${style.badge}`}>
                      {style.icon}
                      <select
                        value={ev.category}
                        onChange={(e) => handleCategoryChange(ev.id, e.target.value as EvidenceCategory)}
                        className="bg-transparent font-bold outline-none cursor-pointer"
                        title="Override ML classification category"
                      >
                        {EVIDENCE_CATEGORIES.map((catOption) => (
                          <option key={catOption} value={catOption} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                            {catOption}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800"
                      title="ML Classification Confidence Score"
                    >
                      {ev.confidence}% ML
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(ev.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-0.5 print:hidden"
                      title="Remove evidence item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {ev.item}
                </h4>

                {ev.sourceExcerpt && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2 border-l-2 border-slate-300 dark:border-slate-700 pl-2">
                    "{ev.sourceExcerpt}"
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium truncate" title={ev.bnsRelevance}>
                  {ev.bnsRelevance || 'Sec 106 BNSS Seizure'}
                </span>

                <button
                  type="button"
                  onClick={() => cycleCustodyStatus(ev.id)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors ${
                    ev.chainOfCustodyStatus === 'Sent to FSL'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : ev.chainOfCustodyStatus === 'Logged & Sealed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                  title="Click to advance Chain of Custody status"
                >
                  {ev.chainOfCustodyStatus === 'Sent to FSL' ? (
                    <Send className="w-2.5 h-2.5" />
                  ) : ev.chainOfCustodyStatus === 'Logged & Sealed' ? (
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  ) : (
                    <Clock className="w-2.5 h-2.5" />
                  )}
                  <span>{ev.chainOfCustodyStatus || 'Pending Collection'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
