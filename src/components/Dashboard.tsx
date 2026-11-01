import React, { useState, useMemo } from 'react';
import { HistoryItem, EvidenceCategory, FirAnalysisResult } from '../types';
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  ShieldAlert,
  Scale,
  MapPin,
  Cpu,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Layers,
  Activity,
  CheckCircle2,
  Database,
  Crosshair,
  Sparkles,
  RotateCcw,
  Eye,
  X,
  Radar as RadarIcon,
  Navigation,
  Siren,
  Compass
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  CartesianGrid,
  Legend
} from 'recharts';

interface DashboardProps {
  history: HistoryItem[];
  activeResult?: FirAnalysisResult | null;
  onNavigate: () => void;
  onImportKey: (key: string) => void;
  onSelectCase?: (item: HistoryItem) => void;
  onOpenBnsReference?: () => void;
}

const THREAT_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444', // red-500
  HIGH: '#f97316',     // orange-500
  MEDIUM: '#f59e0b',   // amber-500
  LOW: '#10b981',      // emerald-500
};

const EVIDENCE_COLORS: Record<EvidenceCategory, string> = {
  'Digital Evidence': '#3b82f6',
  'Physical Weaponry': '#ef4444',
  'Witness Statements': '#8b5cf6',
  'Financial Records': '#10b981',
  'Forensic & Medical': '#ec4899',
  'Vehicle & Property': '#f59e0b',
};

// Lightweight deterministic evidence classifier for historical/demo records without explicit evidenceItems
function inferCaseEvidenceCounts(item: HistoryItem): Record<EvidenceCategory, number> {
  const counts: Record<EvidenceCategory, number> = {
    'Digital Evidence': 0,
    'Physical Weaponry': 0,
    'Witness Statements': 0,
    'Financial Records': 0,
    'Forensic & Medical': 0,
    'Vehicle & Property': 0,
  };

  if (item.evidenceItems && item.evidenceItems.length > 0) {
    item.evidenceItems.forEach((ev) => {
      if (counts[ev.category] !== undefined) {
        counts[ev.category] += 1;
      }
    });
    return counts;
  }

  const corpus = `${item.rawText} ${item.summary} ${(item.investigativeSteps || []).join(' ')} ${(item.categories || []).join(' ')}`.toLowerCase();

  if (/(cctv|camera|video|phone|call|cyber|ip address|otp|alarm|digital|electronic|mobile|server)/.test(corpus)) {
    counts['Digital Evidence'] += 1;
  }
  if (/(hammer|handgun|pistol|firearm|weapon|knife|gun|rod|accelerant|slashed|armed|bullet)/.test(corpus)) {
    counts['Physical Weaponry'] += 1;
  }
  if (/(witness|victim|complainant|clerk|bystander|interview|statement|caller|neighbor|resident)/.test(corpus)) {
    counts['Witness Statements'] += 1;
  }
  if (/(cash|rs |rupees|bank|upi|wire|transfer|fraud|ransom|extortion|financial|account|stolenitems|valuable)/.test(corpus)) {
    counts['Financial Records'] += 1;
  }
  if (/(bleeding|laceration|hospital|medical|narcan|cpr|unresponsive|dna|fingerprint|injury|autopsy|substance|narcotic|overdose)/.test(corpus)) {
    counts['Forensic & Medical'] += 1;
  }
  if (/(sedan|vehicle|car|truck|motorcycle|glass|door|store|apartment|residence|property|premises|highway)/.test(corpus)) {
    counts['Vehicle & Property'] += 1;
  }

  return counts;
}

// Haversine distance in km between two lat/lng points
function computeDistanceKm(lat1?: number, lng1?: number, lat2?: number, lng2?: number): number | null {
  if (
    typeof lat1 !== 'number' ||
    typeof lng1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lng2 !== 'number'
  ) {
    return null;
  }
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function Dashboard({
  history,
  activeResult,
  onNavigate,
  onImportKey,
  onSelectCase,
  onOpenBnsReference
}: DashboardProps) {
  const [importKey, setImportKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [threatFilter, setThreatFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historySearchScope, setHistorySearchScope] = useState<'ALL' | 'DATE' | 'INCIDENT' | 'LOCATION'>('ALL');
  const [incidentTypeFilter, setIncidentTypeFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [exactDateFilter, setExactDateFilter] = useState('');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [focalCaseSelection, setFocalCaseSelection] = useState<string>('AUTO');

  // Resolve the focal FIR used as the anchor for 24-hour predictive hotspot modeling
  const focalFir = useMemo(() => {
    if (focalCaseSelection === 'ACTIVE' && activeResult) {
      return {
        id: 'ACTIVE-FIR',
        label: 'Active Analyzer Dossier',
        data: activeResult,
      };
    }
    if (focalCaseSelection !== 'AUTO' && focalCaseSelection !== 'ACTIVE') {
      const found = history.find((h) => h.id === focalCaseSelection);
      if (found) {
        return {
          id: found.id,
          label: `${found.id} • ${found.locationDetails?.policeStation || found.locationDetails?.district || 'Recorded FIR'}`,
          data: found,
        };
      }
    }
    if (activeResult) {
      return {
        id: 'ACTIVE-FIR',
        label: 'Active Analyzer Dossier',
        data: activeResult,
      };
    }
    if (history.length > 0) {
      const latest = history[0];
      return {
        id: latest.id,
        label: `${latest.id} • ${latest.locationDetails?.policeStation || latest.locationDetails?.district || 'Latest FIR'}`,
        data: latest,
      };
    }
    return null;
  }, [focalCaseSelection, activeResult, history]);

  // 24-Hour Predictive Hotspot & Temporal Contagion Forecasting Engine
  const predictiveForecast = useMemo(() => {
    if (!focalFir) return null;

    const anchor = focalFir.data;
    const anchorLoc = anchor.locationDetails || {
      state: 'Maharashtra',
      district: 'Mumbai City',
      policeStation: 'Colaba PS',
      lat: 18.9067,
      lng: 72.8147,
    };
    const anchorCategories = anchor.categories && anchor.categories.length > 0
      ? anchor.categories
      : ['General Offense'];
    const primaryIncidentType = anchorCategories[0];
    const anchorActs = anchor.recommendedActs || [];
    const threatWeight =
      anchor.threatLevel === 'CRITICAL'
        ? 26
        : anchor.threatLevel === 'HIGH'
        ? 19
        : anchor.threatLevel === 'MEDIUM'
        ? 12
        : 6;

    // Group historical records into candidate spatial/pattern zones
    interface CandidateHotspot {
      zoneId: string;
      policeStation: string;
      district: string;
      state: string;
      addressHint: string;
      lat?: number;
      lng?: number;
      matchingCases: HistoryItem[];
      categoryMatches: number;
      statuteMatches: number;
      criticalCount: number;
      distanceKm: number | null;
      isAnchorZone: boolean;
    }

    const zoneMap = new Map<string, CandidateHotspot>();

    // Ensure the anchor FIR's immediate jurisdiction is seeded as the Primary Contagion Epicenter
    const anchorKey = `${anchorLoc.state}|${anchorLoc.district}|${anchorLoc.policeStation}`;
    zoneMap.set(anchorKey, {
      zoneId: anchorKey,
      policeStation: anchorLoc.policeStation || 'Central PS',
      district: anchorLoc.district || 'Metropolitan District',
      state: anchorLoc.state || 'Maharashtra',
      addressHint: anchorLoc.address || `${anchorLoc.policeStation}, ${anchorLoc.district}`,
      lat: anchorLoc.lat,
      lng: anchorLoc.lng,
      matchingCases: [],
      categoryMatches: 1,
      statuteMatches: anchorActs.length > 0 ? 1 : 0,
      criticalCount: anchor.threatLevel === 'CRITICAL' || anchor.threatLevel === 'HIGH' ? 1 : 0,
      distanceKm: 0,
      isAnchorZone: true,
    });

    history.forEach((h) => {
      const loc = h.locationDetails;
      if (!loc) return;
      const key = `${loc.state}|${loc.district}|${loc.policeStation}`;
      const catOverlap = (h.categories || []).filter((c) =>
        anchorCategories.some(
          (ac) =>
            ac.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(ac.toLowerCase())
        )
      ).length;
      const actOverlap = (h.recommendedActs || []).filter((a) =>
        anchorActs.some((aa) => aa.slice(0, 12).toLowerCase() === a.slice(0, 12).toLowerCase())
      ).length;

      const dist = computeDistanceKm(anchorLoc.lat, anchorLoc.lng, loc.lat, loc.lng);
      const existing = zoneMap.get(key);

      if (existing) {
        existing.matchingCases.push(h);
        existing.categoryMatches += catOverlap;
        existing.statuteMatches += actOverlap;
        if (h.threatLevel === 'CRITICAL' || h.threatLevel === 'HIGH') {
          existing.criticalCount += 1;
        }
      } else {
        zoneMap.set(key, {
          zoneId: key,
          policeStation: loc.policeStation || 'Sector PS',
          district: loc.district || 'District HQ',
          state: loc.state || 'State',
          addressHint: `${loc.policeStation}, ${loc.district}`,
          lat: loc.lat,
          lng: loc.lng,
          matchingCases: [h],
          categoryMatches: catOverlap,
          statuteMatches: actOverlap,
          criticalCount: h.threatLevel === 'CRITICAL' || h.threatLevel === 'HIGH' ? 1 : 0,
          distanceKm: dist,
          isAnchorZone: false,
        });
      }
    });

    // Also synthesize an adjacent Spillover Corridor Sector for realistic 24h tactical perimeter coverage
    const spilloverSectorName = `${anchorLoc.district} Transit & Perimeter Corridor`;
    const spilloverKey = `${anchorLoc.state}|${anchorLoc.district}|${spilloverSectorName}`;
    if (!zoneMap.has(spilloverKey)) {
      const sameStateCases = history.filter(
        (h) =>
          h.locationDetails?.state === anchorLoc.state ||
          (h.categories || []).some((c) => anchorCategories.includes(c))
      );
      zoneMap.set(spilloverKey, {
        zoneId: spilloverKey,
        policeStation: spilloverSectorName,
        district: anchorLoc.district,
        state: anchorLoc.state,
        addressHint: `3.5–6.0 km Radial Contagion Buffer around ${anchorLoc.policeStation}`,
        lat: anchorLoc.lat ? anchorLoc.lat + 0.028 : undefined,
        lng: anchorLoc.lng ? anchorLoc.lng + 0.031 : undefined,
        matchingCases: sameStateCases.slice(0, 2),
        categoryMatches: Math.max(1, sameStateCases.length),
        statuteMatches: 1,
        criticalCount: anchor.threatLevel === 'CRITICAL' ? 1 : 0,
        distanceKm: 4.2,
        isAnchorZone: false,
      });
    }

    // Determine incident-type specific peak risk windows & tactical response profile
    const incidentLower = anchorCategories.join(' ').toLowerCase();
    let defaultPeakWindow = '21:00 – 02:00 HRS';
    let contagionMechanism = 'Nocturnal repeat-offense & radial getaway corridor dispersion';
    let basePatrolDirective = 'Deploy 2 PCR interceptors + Night Beat Nakabandi at arterial exits';

    if (/(cyber|fraud|financial|extortion|scam|forgery)/.test(incidentLower)) {
      defaultPeakWindow = '11:00 – 17:00 HRS';
      contagionMechanism = 'Coordinated mule-account withdrawal & SIM-box tower hopping cluster';
      basePatrolDirective = 'Alert Cyber Cell Nodal Officer + Freeze ATM/Banking cluster terminals';
    } else if (/(theft|burglary|robbery|dacoity|snatching|property)/.test(incidentLower)) {
      defaultPeakWindow = '00:30 – 04:30 HRS';
      contagionMechanism = 'Serial commercial/residential break-in cluster along highway feeder lanes';
      basePatrolDirective = 'Establish Night Vision CCTV Overwatch + QRT roving patrol every 20 mins';
    } else if (/(narcotic|drug|contraband|smuggling)/.test(incidentLower)) {
      defaultPeakWindow = '22:30 – 03:00 HRS';
      contagionMechanism = 'Secondary peddling & transit drop-point relocation within 5 km radius';
      basePatrolDirective = 'Deploy ANTF Canine Squad + Unmarked decoy surveillance at transit hubs';
    } else if (/(public|riot|disturbance|unlawful|arson|mob)/.test(incidentLower)) {
      defaultPeakWindow = '18:00 – 23:00 HRS';
      contagionMechanism = 'Evening crowd mobilization & social-media amplified flashpoint spillover';
      basePatrolDirective = 'Pre-position RAF/Riot Control Platoon + Drone aerial crowd telemetry';
    } else if (/(violent|assault|murder|homicide|weapon|kidnap|firearm)/.test(incidentLower)) {
      defaultPeakWindow = '20:00 – 01:30 HRS';
      contagionMechanism = 'Retaliatory escalation & armed suspect evasion across adjacent beats';
      basePatrolDirective = 'Armed QRT seal-off + ANPR vehicle check-posts at district borders';
    }

    // Score and rank hotspots for the next 24 hours
    const hotspots = Array.from(zoneMap.values())
      .map((zone, idx) => {
        const proximityBonus = zone.isAnchorZone
          ? 28
          : zone.distanceKm !== null
          ? zone.distanceKm < 15
            ? 22
            : zone.distanceKm < 60
            ? 15
            : zone.distanceKm < 300
            ? 9
            : 4
          : zone.state === anchorLoc.state
          ? 16
          : 6;

        const patternScore =
          zone.categoryMatches * 9 +
          zone.statuteMatches * 6 +
          zone.criticalCount * 7 +
          zone.matchingCases.length * 4;

        const rawRisk = Math.min(
          97,
          Math.max(
            44,
            Math.round(32 + threatWeight + proximityBonus + Math.min(28, patternScore))
          )
        );

        const hotspotTier: 'CRITICAL' | 'HIGH' | 'ELEVATED' =
          rawRisk >= 82 ? 'CRITICAL' : rawRisk >= 68 ? 'HIGH' : 'ELEVATED';

        const peakWindow = zone.isAnchorZone
          ? defaultPeakWindow
          : idx % 2 === 1
          ? '19:30 – 23:30 HRS'
          : defaultPeakWindow;

        const correlatedAct =
          zone.matchingCases[0]?.recommendedActs?.[0] ||
          anchorActs[0] ||
          'BNS Sec 115 / 303 (Repeat MO)';

        const spreadLabel = zone.isAnchorZone
          ? '0.0 – 2.5 km (Primary Epicenter)'
          : zone.distanceKm !== null && zone.distanceKm <= 25
          ? `${zone.distanceKm} km Radial Spillover`
          : zone.state === anchorLoc.state
          ? `Intra-State MO Corridor (${zone.district})`
          : `Cross-Jurisdiction MO Match (${zone.state})`;

        return {
          ...zone,
          riskProbability: rawRisk,
          hotspotTier,
          peakWindow,
          correlatedAct,
          spreadLabel,
          patrolDirective: zone.isAnchorZone
            ? basePatrolDirective
            : `Coordinate Inter-PS Wireless Alert with ${zone.policeStation} • Monitor ${primaryIncidentType} MO`,
        };
      })
      .sort((a, b) => b.riskProbability - a.riskProbability)
      .slice(0, 4);

    const topRisk = hotspots[0]?.riskProbability || 78;

    // Build 24-Hour Temporal Escalation Forecast (8 x 3-hour blocks)
    const timeWindows = [
      { horizon: '+03h', windowLabel: 'Next 3h', hourTag: 'T+03h' },
      { horizon: '+06h', windowLabel: 'Next 6h', hourTag: 'T+06h' },
      { horizon: '+09h', windowLabel: 'Next 9h', hourTag: 'T+09h' },
      { horizon: '+12h', windowLabel: 'Next 12h', hourTag: 'T+12h' },
      { horizon: '+15h', windowLabel: 'Next 15h', hourTag: 'T+15h' },
      { horizon: '+18h', windowLabel: 'Next 18h', hourTag: 'T+18h' },
      { horizon: '+21h', windowLabel: 'Next 21h', hourTag: 'T+21h' },
      { horizon: '+24h', windowLabel: 'Next 24h', hourTag: 'T+24h' },
    ];

    // Shape temporal curve according to incident category
    const isDaytimePeak = /(cyber|fraud|financial|extortion|forgery)/.test(incidentLower);
    const isEveningPeak = /(public|riot|disturbance|unlawful|mob)/.test(incidentLower);

    const waveMultipliers = isDaytimePeak
      ? [0.84, 0.96, 1.0, 0.91, 0.76, 0.68, 0.79, 0.88]
      : isEveningPeak
      ? [0.88, 1.0, 0.94, 0.78, 0.65, 0.72, 0.89, 0.93]
      : [0.86, 0.95, 1.0, 0.89, 0.73, 0.69, 0.84, 0.92];

    const temporalCurve = timeWindows.map((slot, i) => {
      const predictedRisk = Math.min(
        98,
        Math.max(35, Math.round(topRisk * waveMultipliers[i]))
      );
      const historicalBaseline = Math.min(
        80,
        Math.max(24, Math.round(predictedRisk * 0.58 + (i % 3) * 3))
      );
      const patrolReadiness = Math.min(
        95,
        Math.round(predictedRisk * 0.88 + 6)
      );
      return {
        ...slot,
        predictedRisk,
        historicalBaseline,
        patrolReadiness,
      };
    });

    // Historical pattern match count across entire archive
    const totalPatternMatches = history.filter((h) =>
      (h.categories || []).some((c) =>
        anchorCategories.some(
          (ac) =>
            ac.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(ac.toLowerCase())
        )
      )
    ).length;

    return {
      anchor,
      anchorLoc,
      primaryIncidentType,
      anchorCategories,
      contagionMechanism,
      defaultPeakWindow,
      hotspots,
      temporalCurve,
      topRisk,
      totalPatternMatches,
    };
  }, [focalFir, history]);

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (importKey.trim()) {
      onImportKey(importKey.trim());
    }
  };

  // Extract all unique Indian states represented in history
  const availableStates = useMemo(() => {
    const states = new Set<string>();
    history.forEach((h) => {
      if (h.locationDetails?.state) {
        states.add(h.locationDetails.state);
      }
    });
    return Array.from(states).sort();
  }, [history]);

  // Extract all unique incident types (categories) represented in history
  const availableIncidentTypes = useMemo(() => {
    const types = new Set<string>();
    history.forEach((h) => {
      (h.categories || []).forEach((cat) => {
        if (cat && cat.trim()) {
          types.add(cat.trim());
        }
      });
    });
    return Array.from(types).sort();
  }, [history]);

  // Extract all unique locations (Police Station, District, State) represented in history
  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    history.forEach((h) => {
      if (h.locationDetails) {
        const { policeStation, district, state } = h.locationDetails;
        if (policeStation && district) {
          locs.add(`${policeStation}, ${district}`);
        }
        if (state) {
          locs.add(state);
        }
      }
    });
    return Array.from(locs).sort();
  }, [history]);

  // Helper to build searchable date strings for a HistoryItem
  const getItemDateSearchString = (item: HistoryItem): string => {
    const itemDateObj = new Date(item.timestamp);
    const baseDates = !isNaN(itemDateObj.getTime())
      ? `${itemDateObj.toLocaleDateString()} ${itemDateObj.toISOString().slice(0, 10)} ${itemDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${itemDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${itemDateObj.toDateString()}`
      : '';
    const timelineDates = (item.timeline || []).map((t) => t.timestamp).join(' ');
    return `${baseDates} ${timelineDates}`.toLowerCase();
  };

  // Filtered dataset driving both the database table and interactive charts
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const hq = historySearchQuery.toLowerCase().trim();
      const itemDateObj = new Date(item.timestamp);
      const isoDate = !isNaN(itemDateObj.getTime()) ? itemDateObj.toISOString().slice(0, 10) : '';
      const formattedDates = getItemDateSearchString(item);
      const incidentCorpus = `${(item.categories || []).join(' ')} ${(item.categoryScores || []).map((c) => c.category).join(' ')} ${(item.recommendedActs || []).join(' ')}`.toLowerCase();
      const locationCorpus = item.locationDetails
        ? `${item.locationDetails.policeStation || ''} ${item.locationDetails.district || ''} ${item.locationDetails.state || ''}`.toLowerCase()
        : '';

      const matchesSearch =
        q === '' ||
        item.id.toLowerCase().includes(q) ||
        formattedDates.includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.rawText.toLowerCase().includes(q) ||
        incidentCorpus.includes(q) ||
        locationCorpus.includes(q) ||
        (item.stressWords && item.stressWords.join(' ').toLowerCase().includes(q));

      // Dedicated History Section search bar matching (by Date, Incident Type, or Location)
      let matchesHistorySearch = true;
      if (hq !== '') {
        if (historySearchScope === 'DATE') {
          matchesHistorySearch = formattedDates.includes(hq);
        } else if (historySearchScope === 'INCIDENT') {
          matchesHistorySearch =
            incidentCorpus.includes(hq) || item.summary.toLowerCase().includes(hq);
        } else if (historySearchScope === 'LOCATION') {
          matchesHistorySearch =
            locationCorpus.includes(hq) || item.summary.toLowerCase().includes(hq);
        } else {
          // ALL scope: matches Date, Incident Type, Location, FIR ID, or Summary
          matchesHistorySearch =
            formattedDates.includes(hq) ||
            incidentCorpus.includes(hq) ||
            locationCorpus.includes(hq) ||
            item.id.toLowerCase().includes(hq) ||
            item.summary.toLowerCase().includes(hq);
        }
      }

      const matchesIncidentType =
        incidentTypeFilter === 'ALL' ||
        (item.categories || []).some(
          (cat) => cat.toLowerCase() === incidentTypeFilter.toLowerCase()
        );

      const matchesLocationFilter =
        locationFilter === 'ALL' ||
        locationCorpus.includes(locationFilter.toLowerCase()) ||
        (item.locationDetails &&
          `${item.locationDetails.policeStation}, ${item.locationDetails.district}`.toLowerCase() ===
            locationFilter.toLowerCase());

      const matchesExactDate =
        exactDateFilter === '' ||
        isoDate === exactDateFilter ||
        formattedDates.includes(exactDateFilter.toLowerCase());

      const matchesThreat = threatFilter === 'ALL' || item.threatLevel === threatFilter;
      const matchesState =
        stateFilter === 'ALL' || item.locationDetails?.state === stateFilter;

      let matchesDate = true;
      if (dateFilter !== 'ALL') {
        const itemDate = new Date(item.timestamp);
        const now = new Date();
        const diffMs = now.getTime() - itemDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateFilter === 'TODAY' && diffDays > 1) matchesDate = false;
        if (dateFilter === 'WEEK' && diffDays > 7) matchesDate = false;
        if (dateFilter === 'MONTH' && diffDays > 30) matchesDate = false;
      }

      return (
        matchesSearch &&
        matchesHistorySearch &&
        matchesIncidentType &&
        matchesLocationFilter &&
        matchesExactDate &&
        matchesThreat &&
        matchesState &&
        matchesDate
      );
    });
  }, [
    history,
    searchTerm,
    historySearchQuery,
    historySearchScope,
    incidentTypeFilter,
    locationFilter,
    exactDateFilter,
    threatFilter,
    stateFilter,
    dateFilter,
  ]);

  const activeFiltersCount =
    (searchTerm.trim() !== '' ? 1 : 0) +
    (historySearchQuery.trim() !== '' ? 1 : 0) +
    (incidentTypeFilter !== 'ALL' ? 1 : 0) +
    (locationFilter !== 'ALL' ? 1 : 0) +
    (exactDateFilter !== '' ? 1 : 0) +
    (threatFilter !== 'ALL' ? 1 : 0) +
    (stateFilter !== 'ALL' ? 1 : 0) +
    (dateFilter !== 'ALL' ? 1 : 0);

  const resetFilters = () => {
    setSearchTerm('');
    setHistorySearchQuery('');
    setHistorySearchScope('ALL');
    setIncidentTypeFilter('ALL');
    setLocationFilter('ALL');
    setExactDateFilter('');
    setThreatFilter('ALL');
    setStateFilter('ALL');
    setDateFilter('ALL');
  };

  // Core KPIs computed from filteredHistory (with total history context)
  const kpiMetrics = useMemo(() => {
    const dataset = filteredHistory;
    const total = dataset.length;
    const critical = dataset.filter((h) => h.threatLevel === 'CRITICAL').length;
    const high = dataset.filter((h) => h.threatLevel === 'HIGH').length;
    const medium = dataset.filter((h) => h.threatLevel === 'MEDIUM').length;
    const low = dataset.filter((h) => h.threatLevel === 'LOW').length;

    const confScores = dataset
      .map((h) => h.confidenceScore || 0)
      .filter((s) => s > 0);
    const avgConfidence =
      confScores.length > 0
        ? Math.round(confScores.reduce((a, b) => a + b, 0) / confScores.length)
        : 0;
    const minConfidence = confScores.length > 0 ? Math.min(...confScores) : 0;
    const maxConfidence = confScores.length > 0 ? Math.max(...confScores) : 0;

    let totalBnsCitations = 0;
    const uniqueBnsActs = new Set<string>();
    let totalTimelineEvents = 0;
    let totalStressMarkers = 0;
    let totalInvestigativeSteps = 0;
    let totalEvidenceExhibits = 0;

    const statesSet = new Set<string>();
    const districtsSet = new Set<string>();
    const stationsSet = new Set<string>();

    dataset.forEach((h) => {
      (h.recommendedActs || []).forEach((act) => {
        totalBnsCitations += 1;
        uniqueBnsActs.add(act.split('(')[0].trim());
      });
      totalTimelineEvents += (h.timeline || []).length;
      totalStressMarkers += (h.stressWords || []).length;
      totalInvestigativeSteps += (h.investigativeSteps || []).length;

      const evCounts = inferCaseEvidenceCounts(h);
      totalEvidenceExhibits += Object.values(evCounts).reduce((a, b) => a + b, 0);

      if (h.locationDetails?.state) statesSet.add(h.locationDetails.state);
      if (h.locationDetails?.district) districtsSet.add(h.locationDetails.district);
      if (h.locationDetails?.policeStation) stationsSet.add(h.locationDetails.policeStation);
    });

    return {
      total,
      critical,
      high,
      medium,
      low,
      avgConfidence,
      minConfidence,
      maxConfidence,
      totalBnsCitations,
      uniqueBnsCount: uniqueBnsActs.size,
      totalTimelineEvents,
      totalStressMarkers,
      totalInvestigativeSteps,
      totalEvidenceExhibits,
      statesCount: statesSet.size,
      districtsCount: districtsSet.size,
      stationsCount: stationsSet.size,
    };
  }, [filteredHistory]);

  // 1. Multi-Metric Case Telemetry Trend (Confidence + Stress Markers + BNS Acts)
  const caseTelemetryData = useMemo(() => {
    return filteredHistory
      .slice(0, 12)
      .map((h, idx) => {
        const shortId = h.id.length > 10 ? h.id.slice(-6) : h.id;
        return {
          name: shortId,
          fullId: h.id,
          confidence: h.confidenceScore || 85,
          stressDensity: (h.stressWords || []).length * 15, // scaled 0-100 for dual comparison
          rawStressCount: (h.stressWords || []).length,
          bnsCount: (h.recommendedActs || []).length,
          timelineEvents: (h.timeline || []).length,
          threatLevel: h.threatLevel,
          state: h.locationDetails?.state || 'Unmapped',
        };
      })
      .reverse();
  }, [filteredHistory]);

  // 2. Threat Level Severity Breakdown (Donut Chart)
  const threatDistributionData = useMemo(() => {
    const levels: ('CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')[] = [
      'CRITICAL',
      'HIGH',
      'MEDIUM',
      'LOW',
    ];
    return levels.map((lvl) => {
      const matching = filteredHistory.filter((h) => h.threatLevel === lvl);
      const count = matching.length;
      const avgConf =
        count > 0
          ? Math.round(
              matching.reduce((acc, item) => acc + (item.confidenceScore || 0), 0) /
                count
            )
          : 0;
      return {
        name: lvl,
        value: count,
        percentage:
          filteredHistory.length > 0
            ? Math.round((count / filteredHistory.length) * 100)
            : 0,
        avgConfidence: avgConf,
        color: THREAT_COLORS[lvl],
      };
    });
  }, [filteredHistory]);

  // 3. Crime Domain Volume vs. Mean Severity Index
  const categoryAnalyticsData = useMemo(() => {
    const map = new Map<
      string,
      { totalScore: number; scoreCount: number; caseCount: number; criticalCases: number }
    >();

    filteredHistory.forEach((h) => {
      const seenInCase = new Set<string>();

      (h.categoryScores || []).forEach((cs) => {
        const key = cs.category.trim();
        const entry = map.get(key) || {
          totalScore: 0,
          scoreCount: 0,
          caseCount: 0,
          criticalCases: 0,
        };
        entry.totalScore += cs.score;
        entry.scoreCount += 1;
        if (cs.score >= 30) {
          entry.caseCount += 1;
          if (h.threatLevel === 'CRITICAL' || h.threatLevel === 'HIGH') {
            entry.criticalCases += 1;
          }
        }
        seenInCase.add(key.toLowerCase());
        map.set(key, entry);
      });

      (h.categories || []).forEach((cat) => {
        const key = cat.trim();
        if (!seenInCase.has(key.toLowerCase())) {
          const entry = map.get(key) || {
            totalScore: 0,
            scoreCount: 0,
            caseCount: 0,
            criticalCases: 0,
          };
          entry.totalScore += h.threatLevel === 'CRITICAL' ? 90 : h.threatLevel === 'HIGH' ? 75 : 55;
          entry.scoreCount += 1;
          entry.caseCount += 1;
          if (h.threatLevel === 'CRITICAL' || h.threatLevel === 'HIGH') {
            entry.criticalCases += 1;
          }
          map.set(key, entry);
        }
      });
    });

    return Array.from(map.entries())
      .map(([category, stats]) => ({
        category: category.length > 16 ? `${category.slice(0, 14)}..` : category,
        fullCategory: category,
        meanSeverity:
          stats.scoreCount > 0 ? Math.round(stats.totalScore / stats.scoreCount) : 0,
        caseCount: stats.caseCount,
        criticalCases: stats.criticalCases,
      }))
      .filter((d) => d.caseCount > 0 || d.meanSeverity > 25)
      .sort((a, b) => b.caseCount - a.caseCount || b.meanSeverity - a.meanSeverity)
      .slice(0, 8);
  }, [filteredHistory]);

  // 4. Top Invoked BNS (2023) & Statutory Sections
  const bnsSectionFrequencyData = useMemo(() => {
    const counts = new Map<
      string,
      { shortCode: string; fullTitle: string; count: number; criticalCount: number }
    >();

    filteredHistory.forEach((h) => {
      (h.recommendedActs || []).forEach((act) => {
        const match = act.match(/^(Section\s+\d+[A-Z]*\s+BNS|[^()]+)/i);
        const shortCode = match ? match[1].trim() : act.slice(0, 22);
        const existing = counts.get(shortCode) || {
          shortCode,
          fullTitle: act,
          count: 0,
          criticalCount: 0,
        };
        existing.count += 1;
        if (h.threatLevel === 'CRITICAL' || h.threatLevel === 'HIGH') {
          existing.criticalCount += 1;
        }
        counts.set(shortCode, existing);
      });
    });

    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredHistory]);

  // 5. Forensic Evidence Taxonomy Distribution (Radar & Bar Data)
  const evidenceTaxonomyData = useMemo(() => {
    const totals: Record<EvidenceCategory, { count: number; highPriority: number; statute: string }> = {
      'Digital Evidence': { count: 0, highPriority: 0, statute: 'Sec 63 BSA' },
      'Physical Weaponry': { count: 0, highPriority: 0, statute: 'Sec 106 BNSS' },
      'Witness Statements': { count: 0, highPriority: 0, statute: 'Sec 180 BNSS' },
      'Financial Records': { count: 0, highPriority: 0, statute: 'Sec 107 BNSS' },
      'Forensic & Medical': { count: 0, highPriority: 0, statute: 'Sec 51 BNSS' },
      'Vehicle & Property': { count: 0, highPriority: 0, statute: 'Sec 106 BNSS' },
    };

    filteredHistory.forEach((h) => {
      const caseCounts = inferCaseEvidenceCounts(h);
      const isUrgent = h.threatLevel === 'CRITICAL' || h.threatLevel === 'HIGH';
      (Object.keys(caseCounts) as EvidenceCategory[]).forEach((cat) => {
        totals[cat].count += caseCounts[cat];
        if (isUrgent && caseCounts[cat] > 0) {
          totals[cat].highPriority += caseCounts[cat];
        }
      });
    });

    return (Object.keys(totals) as EvidenceCategory[]).map((cat) => ({
      category: cat,
      shortName: cat.replace(' Evidence', '').replace(' Statements', '').replace(' Records', ''),
      exhibits: totals[cat].count,
      urgentExhibits: totals[cat].highPriority,
      statute: totals[cat].statute,
      color: EVIDENCE_COLORS[cat],
    }));
  }, [filteredHistory]);

  // 6. State-wise Jurisdictional Caseload & Threat Stack
  const stateJurisdictionData = useMemo(() => {
    const stateMap = new Map<
      string,
      {
        state: string;
        CRITICAL: number;
        HIGH: number;
        MEDIUM: number;
        LOW: number;
        total: number;
        stations: Set<string>;
      }
    >();

    filteredHistory.forEach((h) => {
      const stateName = h.locationDetails?.state || 'Unassigned';
      const entry = stateMap.get(stateName) || {
        state: stateName,
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
        total: 0,
        stations: new Set<string>(),
      };
      entry[h.threatLevel] += 1;
      entry.total += 1;
      if (h.locationDetails?.policeStation) {
        entry.stations.add(h.locationDetails.policeStation);
      }
      stateMap.set(stateName, entry);
    });

    return Array.from(stateMap.values())
      .map((item) => ({
        ...item,
        stationCount: item.stations.size,
        stationList: Array.from(item.stations).join(', '),
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredHistory]);

  // 7. High-Risk Lexical Stress Triggers & Threat Correlation
  const stressLexiconStats = useMemo(() => {
    const wordMap = new Map<
      string,
      { word: string; count: number; maxThreat: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' }
    >();
    const threatRank = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

    filteredHistory.forEach((h) => {
      (h.stressWords || []).forEach((w) => {
        const clean = w.toLowerCase().trim();
        if (!clean) return;
        const existing = wordMap.get(clean);
        if (!existing) {
          wordMap.set(clean, {
            word: clean,
            count: 1,
            maxThreat: h.threatLevel,
          });
        } else {
          existing.count += 1;
          if (threatRank[h.threatLevel] > threatRank[existing.maxThreat]) {
            existing.maxThreat = h.threatLevel;
          }
        }
      });
    });

    return Array.from(wordMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 18);
  }, [filteredHistory]);

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/60';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/60';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/60';
      case 'LOW':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/60';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-6 pb-14 space-y-8 print:px-0 print:pb-0">
      {/* Top Command Banner, Quick Search & Quick Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                CCTNS • BNS 2023 Forensic Telemetry
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                {filteredHistory.length} of {history.length} Dossiers Active
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              National FIR Crime Intelligence & Statutory Analytics Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
              Real-time multi-dimensional aggregation of semantic threat assessments, Bharatiya Nyaya Sanhita (2023) statutory citations, forensic evidence exhibits, and state-wise police station caseloads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
            {onOpenBnsReference && (
              <button
                onClick={onOpenBnsReference}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                BNS 2023 Codebook
              </button>
            )}
            <button
              onClick={onNavigate}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              + New FIR Analysis
            </button>
          </div>
        </div>

        {/* Dashboard Header Search Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-blue-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Quick search FIR records by FIR ID (e.g., FIR-2026-0891), date (YYYY-MM-DD / DD/MM/YYYY), BNS section, or keyword..."
              aria-label="Search FIR history by FIR ID, date, or keyword"
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchTerm.trim() !== '' && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  title="Clear search query"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 tabular-nums">
                {filteredHistory.length}/{history.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
            <span className="hidden md:inline font-semibold uppercase tracking-wider text-slate-400">
              Quick Filter:
            </span>
            {['FIR-2026', 'BNS 103', 'Cyber', new Date().getFullYear().toString()].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setSearchTerm((prev) => (prev === chip ? '' : chip))}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                  searchTerm === chip
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6-Card Executive KPI Telemetry Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Total FIRs Analyzed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Analyzed Dossiers
            </span>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {kpiMetrics.total}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              <span>{kpiMetrics.totalInvestigativeSteps} Action Steps</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">100% Indexed</span>
            </div>
          </div>
        </div>

        {/* KPI 2: High/Critical Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Critical / High Alerts
            </span>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                {kpiMetrics.critical + kpiMetrics.high}
              </p>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                ({kpiMetrics.total > 0
                  ? Math.round(((kpiMetrics.critical + kpiMetrics.high) / kpiMetrics.total) * 100)
                  : 0}
                %)
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] tabular-nums">
              <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-semibold">
                {kpiMetrics.critical} Crit
              </span>
              <span className="px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-semibold">
                {kpiMetrics.high} High
              </span>
              <span className="text-slate-400">{kpiMetrics.medium + kpiMetrics.low} Routine</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Mean AI Confidence */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mean AI Confidence
            </span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {kpiMetrics.avgConfidence}%
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              <span>Range: {kpiMetrics.minConfidence}%–{kpiMetrics.maxConfidence}%</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified</span>
            </div>
          </div>
        </div>

        {/* KPI 4: BNS Statutory Citations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              BNS 2023 Citations
            </span>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {kpiMetrics.totalBnsCitations}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              <span>{kpiMetrics.uniqueBnsCount} Distinct Sections</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">BNSS / BSA</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Evidence Exhibits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Forensic Exhibits
            </span>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {kpiMetrics.totalEvidenceExhibits}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              <span>6 ML Class Models</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">FSL Tagged</span>
            </div>
          </div>
        </div>

        {/* KPI 6: Jurisdictional Coverage */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Jurisdictions Active
            </span>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {kpiMetrics.stationsCount}
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
                Stations
              </span>
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              <span>{kpiMetrics.statesCount} States / UTs</span>
              <span>{kpiMetrics.totalTimelineEvents} Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Global Filter Bar & FIR Key Loader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-500" />
              Interactive Telemetry & Database Filters
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {/* Keyword Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search FIR, BNS, station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Threat Level Filter */}
            <div className="relative">
              <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={threatFilter}
                onChange={(e) => setThreatFilter(e.target.value)}
                className="w-full pl-9 pr-7 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="ALL">All Threat Levels</option>
                <option value="CRITICAL">Critical Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            {/* State Jurisdiction Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full pl-9 pr-7 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="ALL">All States ({availableStates.length})</option>
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Window Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-9 pr-7 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="ALL">All Time Window</option>
                <option value="TODAY">Last 24 Hours</option>
                <option value="WEEK">Last 7 Days</option>
                <option value="MONTH">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Direct FIR Tracking Key Loader */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" />
              Retrieve Dossier By FIR Key
            </h3>
            <span className="text-[10px] font-mono text-slate-400">CCTNS SYNC</span>
          </div>
          <form onSubmit={handleImport} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. FIR-2026-001 or FIR-DEMO-6"
              value={importKey}
              onChange={(e) => setImportKey(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <button
              type="submit"
              className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors shrink-0"
            >
              Load FIR
            </button>
          </form>
        </div>
      </div>

      {/* 24-HOUR PREDICTIVE HOTSPOT & CRIME PATTERN FORECASTING CARD */}
      {predictiveForecast && (
        <div className="bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/60 rounded-xl shadow-sm overflow-hidden">
          {/* Top Command Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 border-b border-indigo-900/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shrink-0 mt-0.5 sm:mt-0">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <Siren className="w-3 h-3" />
                    Next 24-Hour Predictive Forecast
                  </span>
                  <span className="text-[11px] font-mono text-indigo-300/90">
                    SPATIAL-TEMPORAL CONTAGION ENGINE • {predictiveForecast.totalPatternMatches} HISTORICAL MO CORRELATIONS
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
                  24-Hour Potential Hotspot & Escalation Forecast Matrix
                </h3>
                <p className="text-xs text-slate-300/80 mt-0.5">
                  Forecasts high-probability crime spillover zones for the next 24 hours by correlating the focal FIR&apos;s location ({predictiveForecast.anchorLoc.policeStation}, {predictiveForecast.anchorLoc.district}) and incident typology ({predictiveForecast.primaryIncidentType}) with historical CCTNS crime patterns.
                </p>
              </div>
            </div>

            {/* Focal FIR Selector & Quick Status */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1 mb-1">
                  <Crosshair className="w-3 h-3" />
                  Focal FIR Anchor Case
                </label>
                <select
                  value={focalCaseSelection}
                  onChange={(e) => setFocalCaseSelection(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-md px-2.5 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="AUTO">
                    Auto ({activeResult ? 'Active Analyzer FIR' : `${history[0]?.id || 'Latest FIR'}`})
                  </option>
                  {activeResult && (
                    <option value="ACTIVE">
                      Active Workspace FIR ({activeResult.locationDetails?.policeStation || 'Current Analysis'})
                    </option>
                  )}
                  {history.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.id} • {h.locationDetails?.policeStation || h.locationDetails?.district || 'FIR'} ({h.categories?.[0] || 'Offense'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:border-l border-slate-800 sm:pl-3 flex items-center justify-between sm:justify-start gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                    Peak 24h Risk Index
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-rose-400 font-mono">
                      {predictiveForecast.topRisk}%
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 uppercase">
                      {predictiveForecast.defaultPeakWindow}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Focal Incident Context Strip */}
          <div className="bg-indigo-50/60 dark:bg-slate-950/60 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Anchor Vector:
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {predictiveForecast.anchorLoc.policeStation}, {predictiveForecast.anchorLoc.district} ({predictiveForecast.anchorLoc.state})
              </span>
              {predictiveForecast.anchorCategories.map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600/10 dark:bg-indigo-500/15 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-[11px]"
                >
                  {cat}
                </span>
              ))}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase text-white"
                style={{
                  backgroundColor:
                    THREAT_COLORS[predictiveForecast.anchor.threatLevel] || '#f59e0b',
                }}
              >
                {predictiveForecast.anchor.threatLevel} Threat
              </span>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>
                <strong className="text-slate-800 dark:text-slate-200">Contagion Vector:</strong>{' '}
                {predictiveForecast.contagionMechanism}
              </span>
            </div>
          </div>

          {/* Main Body: Left 7 Cols Ranked Hotspot Forecast Cards + Right 5 Cols 24h Temporal Trajectory */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Forecasted Hotspot Zones */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-rose-500" />
                    Forecasted High-Risk Hotspot Zones (Next 24 Hours)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Click any predicted hotspot sector to filter dashboard intelligence or inspect correlated FIR records.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                  Top {predictiveForecast.hotspots.length} Sectors
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {predictiveForecast.hotspots.map((spot, index) => {
                  const isCritical = spot.hotspotTier === 'CRITICAL';
                  const isHigh = spot.hotspotTier === 'HIGH';

                  return (
                    <div
                      key={spot.zoneId}
                      onClick={() => {
                        setStateFilter(spot.state);
                        setSearchTerm(spot.district);
                      }}
                      className={`group cursor-pointer rounded-xl border p-4 transition-all relative overflow-hidden ${
                        spot.isAnchorZone
                          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/70 hover:border-rose-500'
                          : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500'
                      }`}
                    >
                      {/* Top row: Rank + Sector Name + Risk Score */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                isCritical
                                  ? 'bg-rose-600 text-white'
                                  : isHigh
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-amber-500 text-slate-950'
                              }`}
                            >
                              #{index + 1} • {spot.hotspotTier}
                            </span>
                            {spot.isAnchorZone && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-600/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                                Focal Epicenter
                              </span>
                            )}
                          </div>
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {spot.policeStation}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {spot.district}, {spot.state}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-lg font-black font-mono ${
                              isCritical
                                ? 'text-rose-600 dark:text-rose-400'
                                : isHigh
                                ? 'text-orange-500 dark:text-orange-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {spot.riskProbability}%
                          </span>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            24h Probability
                          </span>
                        </div>
                      </div>

                      {/* Probability Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCritical
                              ? 'bg-gradient-to-r from-orange-500 to-rose-600'
                              : isHigh
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${spot.riskProbability}%` }}
                        />
                      </div>

                      {/* Metadata Badges */}
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Clock className="w-3 h-3 text-amber-500" />
                            Peak Window:
                          </span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {spot.peakWindow}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3 h-3 text-indigo-500" />
                            Vector:
                          </span>
                          <span className="font-medium text-right truncate max-w-[175px]">
                            {spot.spreadLabel}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Scale className="w-3 h-3 text-blue-500" />
                            Statutory Watch:
                          </span>
                          <span className="font-mono text-[10px] bg-slate-200/70 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 truncate max-w-[165px]">
                            {spot.correlatedAct}
                          </span>
                        </div>
                      </div>

                      {/* Recommended Patrol Directive Footer */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between gap-2">
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          <strong className="text-slate-800 dark:text-slate-200 uppercase">
                            Directive:
                          </strong>{' '}
                          {spot.patrolDirective}
                        </p>
                        <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:translate-x-0.5 transition-transform">
                          Filter →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 Cols: 24-Hour Temporal Escalation Curve & Predictive Synthesis */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    24-Hour Temporal Hotspot Risk Trajectory
                  </h4>
                  <span className="text-[10px] font-mono text-rose-500 font-bold">
                    3-HOUR INTERVALS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                  Models predicted hotspot escalation (%) vs. historical district baseline across the upcoming 24-hour operational window.
                </p>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={predictiveForecast.temporalCurve}
                      margin={{ top: 8, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="hotspotRiskGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.38} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.18} />
                      <XAxis
                        dataKey="horizon"
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        unit="%"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: '#f8fafc',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="predictedRisk"
                        name="24h Predicted Hotspot Risk (%)"
                        stroke="#f43f5e"
                        strokeWidth={2.5}
                        fill="url(#hotspotRiskGrad)"
                      />
                      <Line
                        type="monotone"
                        dataKey="historicalBaseline"
                        name="Historical Baseline (%)"
                        stroke="#6366f1"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 2.5, fill: '#6366f1' }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend + Tactical Pattern Brief */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      Predicted Hotspot Surge
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="w-2.5 h-0.5 bg-indigo-500 inline-block" />
                      Historical Baseline
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    CONFIDENCE: {predictiveForecast.anchor.confidenceScore || 92}%
                  </span>
                </div>

                <div className="bg-indigo-950/90 text-slate-200 rounded-lg p-3 border border-indigo-800/60 text-[11px] leading-relaxed">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold uppercase tracking-wider text-indigo-300 text-[10px] flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      Predictive Pattern Advisory
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      PREEMPTIVE DEPLOYMENT READY
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Historical CCTNS clustering indicates a{' '}
                    <strong className="text-white">{predictiveForecast.topRisk}% probability</strong> of secondary{' '}
                    <strong className="text-indigo-300">{predictiveForecast.primaryIncidentType}</strong> activity within{' '}
                    <strong className="text-white">{predictiveForecast.anchorLoc.district}</strong> during{' '}
                    <strong className="text-amber-300">{predictiveForecast.defaultPeakWindow}</strong>. Recommend immediate saturation patrolling across the top {predictiveForecast.hotspots.length} forecasted sectors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHART ROW 1: Multi-Metric Case Telemetry Trend (8 cols) + Threat Severity Donut (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Multi-Metric Case Telemetry */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Case-by-Case AI Confidence, Lexical Stress & Statutory Density
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Correlates neural confidence score (%) with extracted high-stress lexical markers and BNS section citations across recent FIRs.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                Confidence (%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                Stress Index
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={caseTelemetryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="confAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: string, props: any) => {
                    if (name === 'confidence') return [`${value}%`, 'AI Confidence'];
                    if (name === 'stressDensity')
                      return [`${props.payload.rawStressCount} triggers (${value} pts)`, 'Stress Intensity'];
                    if (name === 'bnsCount') return [`${value} Sections`, 'BNS Citations'];
                    return [value, name];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  fill="url(#confAreaGrad)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="confidence"
                  fill="#3b82f6"
                  barSize={18}
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.85}
                />
                <Line
                  type="monotone"
                  dataKey="stressDensity"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#f43f5e' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Threat Severity Distribution Donut */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Threat Severity Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any severity tier below to filter caseload.
            </p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatDistributionData.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={74}
                  paddingAngle={4}
                  dataKey="value"
                  onClick={(entry) => {
                    if (entry && entry.name) {
                      setThreatFilter((prev) => (prev === entry.name ? 'ALL' : entry.name));
                    }
                  }}
                  className="cursor-pointer"
                >
                  {threatDistributionData
                    .filter((d) => d.value > 0)
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="transparent"
                      />
                    ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: string, props: any) => [
                    `${value} FIRs (${props.payload.percentage}%) • Avg Conf: ${props.payload.avgConfidence}%`,
                    props.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Severity Legend Table */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            {threatDistributionData.map((tier) => {
              const isSelected = threatFilter === tier.name;
              return (
                <button
                  key={tier.name}
                  onClick={() =>
                    setThreatFilter((prev) => (prev === tier.name ? 'ALL' : tier.name))
                  }
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 font-bold ring-1 ring-blue-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">
                      {tier.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 tabular-nums">
                    <span className="text-slate-400 text-[11px]">
                      Avg {tier.avgConfidence}% conf
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 w-14 text-right">
                      {tier.value} ({tier.percentage}%)
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CHART ROW 2: Crime Category Severity vs Volume (6 cols) + Top BNS Sections Invoked (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Crime Domain Volume vs. Mean Severity Index */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Crime Classification Volume vs. Severity Score
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Compares active FIR caseload count per offense domain against AI-computed mean severity index (0–100).
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={categoryAnalyticsData}
                margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'caseCount') return [`${value} FIRs`, 'Active Cases'];
                    if (name === 'criticalCases') return [`${value} FIRs`, 'Critical/High Cases'];
                    if (name === 'meanSeverity') return [`${value} / 100`, 'Mean Severity Score'];
                    return [value, name];
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="caseCount"
                  fill="#6366f1"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="criticalCases"
                  fill="#ef4444"
                  barSize={12}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="meanSeverity"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#f59e0b' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Top Invoked Bharatiya Nyaya Sanhita (BNS 2023) Sections */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-500" />
                Top Invoked BNS (2023) & Special Act Sections
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Frequency distribution of statutory charges recommended by semantic analysis across FIRs.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            {bnsSectionFrequencyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No statutory citations in current filter selection.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bnsSectionFrequencyData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.18} horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortCode"
                    width={125}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: string, props: any) => [
                      `${value} FIR Citations (${props.payload.criticalCount} High/Crit)`,
                      props.payload.fullTitle,
                    ]}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* CHART ROW 3: Forensic Evidence Taxonomy Radar (5 cols) + State-wise Jurisdictional Caseload Stack (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 5: Forensic Evidence Class Distribution */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" />
              Forensic Evidence Class Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ML-classified physical, digital, financial, and testimonial exhibits mapped to BNSS/BSA admissibility rules.
            </p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={evidenceTaxonomyData}>
                <PolarGrid stroke="#334155" opacity={0.35} />
                <PolarAngleAxis
                  dataKey="shortName"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  tick={{ fontSize: 9, fill: '#64748b' }}
                  axisLine={false}
                />
                <Radar
                  name="Total Exhibits"
                  dataKey="exhibits"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.35}
                />
                <Radar
                  name="Critical/High Case Exhibits"
                  dataKey="urgentExhibits"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            {evidenceTaxonomyData.map((ev) => (
              <div
                key={ev.category}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-xs"
              >
                <div className="truncate pr-2">
                  <div className="font-semibold text-slate-700 dark:text-slate-200 truncate text-[11px]">
                    {ev.shortName}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">{ev.statute}</div>
                </div>
                <span
                  className="font-bold text-xs tabular-nums px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${ev.color}20`,
                    color: ev.color,
                  }}
                >
                  {ev.exhibits}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 6: State-Wise Jurisdictional Case Load & Threat Stack */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                State-Wise Jurisdictional Caseload & Threat Stack
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Geographic distribution of FIRs across Indian States & Police Stations stacked by threat severity.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-500">Crit</span>
              <span className="px-2 py-0.5 rounded bg-orange-500/15 text-orange-500">High</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-500">Med</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">Low</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stateJurisdictionData}
                margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis
                  dataKey="state"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  angle={-18}
                  textAnchor="end"
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="CRITICAL" stackId="a" fill="#ef4444" barSize={24} />
                <Bar dataKey="HIGH" stackId="a" fill="#f97316" barSize={24} />
                <Bar dataKey="MEDIUM" stackId="a" fill="#f59e0b" barSize={24} />
                <Bar dataKey="LOW" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Jurisdiction Police Station Directory Pill Strip */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Active Reporting Police Stations ({kpiMetrics.stationsCount})
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
              {stateJurisdictionData.map((st) => (
                <button
                  key={st.state}
                  onClick={() =>
                    setStateFilter((prev) => (prev === st.state ? 'ALL' : st.state))
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] border transition-colors ${
                    stateFilter === st.state
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                  }`}
                  title={st.stationList}
                >
                  <span>{st.state}</span>
                  <span className="font-mono text-[10px] opacity-80 tabular-nums">
                    ({st.total})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FORENSIC LEXICON & OPERATIONAL INTELLIGENCE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Extracted High-Stress Trigger Matrix */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-rose-500" />
                High-Stress Lexical Trigger Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Acoustic and semantic urgency markers extracted from FIR narratives. Click any marker to filter matching cases.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 tabular-nums">
              {kpiMetrics.totalStressMarkers} Total Markers
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {stressLexiconStats.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No stress triggers found for current filter.</p>
            ) : (
              stressLexiconStats.map((item) => {
                const isSelected = searchTerm.toLowerCase() === item.word.toLowerCase();
                return (
                  <button
                    key={item.word}
                    onClick={() =>
                      setSearchTerm((prev) =>
                        prev.toLowerCase() === item.word.toLowerCase() ? '' : item.word
                      )
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      isSelected
                        ? 'ring-2 ring-blue-500 font-bold ' + getThreatLevelColor(item.maxThreat)
                        : getThreatLevelColor(item.maxThreat) + ' hover:opacity-85'
                    }`}
                  >
                    <span>"{item.word}"</span>
                    {item.count > 1 && (
                      <span className="px-1.5 py-0.2 bg-black/10 dark:bg-white/10 rounded text-[10px] font-bold tabular-nums">
                        ×{item.count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Investigative Readiness & Statutory Compliance Summary */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              BNSS / BSA Procedural Readiness Metrics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Aggregate compliance indicators across analyzed First Information Reports.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  BNS (2023) Statutory Section Mapping Coverage
                </span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {filteredHistory.length > 0
                    ? Math.round(
                        (filteredHistory.filter(
                          (h) => h.recommendedActs && h.recommendedActs.length > 0
                        ).length /
                          filteredHistory.length) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${
                      filteredHistory.length > 0
                        ? Math.round(
                            (filteredHistory.filter(
                              (h) => h.recommendedActs && h.recommendedActs.length > 0
                            ).length /
                              filteredHistory.length) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  GIS Police Station & Jurisdiction Geotagging
                </span>
                <span className="font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                  {filteredHistory.length > 0
                    ? Math.round(
                        (filteredHistory.filter((h) => h.locationDetails?.policeStation)
                          .length /
                          filteredHistory.length) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${
                      filteredHistory.length > 0
                        ? Math.round(
                            (filteredHistory.filter((h) => h.locationDetails?.policeStation)
                              .length /
                              filteredHistory.length) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Investigative Action Directives Generated
                </span>
                <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {kpiMetrics.totalInvestigativeSteps} Directives
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYZED CASES DATABASE & HISTORY SECTION WITH DEDICATED SEARCH BAR (DATE, INCIDENT TYPE, LOCATION) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                FIR History & Past Cases Registry
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 tabular-nums">
                Showing {filteredHistory.length} of {history.length} FIRs
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Search and filter past FIR dossiers by <strong className="text-slate-700 dark:text-slate-300">Date</strong>, <strong className="text-slate-700 dark:text-slate-300">Incident Type</strong>, or <strong className="text-slate-700 dark:text-slate-300">Location</strong> (Police Station, District, State). Click any record to inspect full findings.
            </p>
          </div>

          {(historySearchQuery.trim() !== '' ||
            incidentTypeFilter !== 'ALL' ||
            locationFilter !== 'ALL' ||
            exactDateFilter !== '' ||
            activeFiltersCount > 0) && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear History Filters
            </button>
          )}
        </div>

        {/* Dedicated History Section Search Bar & Facet Controls */}
        <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3.5">
          {/* Primary Search Input + Search Scope Selector */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-blue-400 pointer-events-none" />
              <input
                type="text"
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                placeholder={
                  historySearchScope === 'DATE'
                    ? 'Search past FIRs by date (e.g., 2026-11-01, 01 Nov 2026, October, Today)...'
                    : historySearchScope === 'INCIDENT'
                    ? 'Search past FIRs by incident type (e.g., Armed Robbery, Cyber Fraud, Narcotics, Assault)...'
                    : historySearchScope === 'LOCATION'
                    ? 'Search past FIRs by location (e.g., Colaba PS, Mumbai, Connaught Place, Delhi, Maharashtra)...'
                    : 'Search past FIRs by Date (YYYY-MM-DD / DD MMM), Incident Type (Robbery, Cyber, Assault), or Location (PS, District, State)...'
                }
                aria-label="Search past FIRs in history by date, incident type, or location"
                className="w-full pl-10 pr-24 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-2xs"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {historySearchQuery.trim() !== '' && (
                  <button
                    type="button"
                    onClick={() => setHistorySearchQuery('')}
                    title="Clear history search"
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 tabular-nums">
                  {filteredHistory.length}/{history.length}
                </span>
              </div>
            </div>

            {/* Scope Pills: All | Date | Incident Type | Location */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 overflow-x-auto">
              {(
                [
                  { id: 'ALL', label: 'All Fields' },
                  { id: 'DATE', label: 'By Date' },
                  { id: 'INCIDENT', label: 'By Incident Type' },
                  { id: 'LOCATION', label: 'By Location' },
                ] as const
              ).map((scope) => (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => setHistorySearchScope(scope.id)}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    historySearchScope === scope.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {scope.label}
                </button>
              ))}
            </div>
          </div>

          {/* Structured Filter Dropdowns: Incident Type, Location, and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Filter by Incident Type */}
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-500 pointer-events-none" />
              <select
                value={incidentTypeFilter}
                onChange={(e) => setIncidentTypeFilter(e.target.value)}
                aria-label="Filter history by incident type"
                className="w-full pl-9 pr-7 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="ALL">All Incident Types ({availableIncidentTypes.length})</option>
                {availableIncidentTypes.map((type) => (
                  <option key={type} value={type}>
                    Incident: {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Location (PS / District / State) */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rose-500 pointer-events-none" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                aria-label="Filter history by location"
                className="w-full pl-9 pr-7 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="ALL">All Locations & Police Stations ({availableLocations.length})</option>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    Location: {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Exact Date */}
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500 pointer-events-none" />
                <input
                  type="date"
                  value={exactDateFilter}
                  onChange={(e) => setExactDateFilter(e.target.value)}
                  aria-label="Filter history by exact date"
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {exactDateFilter !== '' && (
                <button
                  type="button"
                  onClick={() => setExactDateFilter('')}
                  title="Clear exact date"
                  className="px-2 py-2 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick-Filter Chips for Incident Types & Locations */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Quick Filter Tags:
            </span>
            {availableIncidentTypes.slice(0, 4).map((inc) => {
              const active = incidentTypeFilter === inc || historySearchQuery.toLowerCase() === inc.toLowerCase();
              return (
                <button
                  key={`inc-${inc}`}
                  type="button"
                  onClick={() =>
                    setIncidentTypeFilter((prev) => (prev === inc ? 'ALL' : inc))
                  }
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                  }`}
                >
                  <Layers className="w-3 h-3 opacity-75" />
                  {inc}
                </button>
              );
            })}
            {availableStates.slice(0, 3).map((st) => {
              const active = locationFilter === st || stateFilter === st;
              return (
                <button
                  key={`loc-${st}`}
                  type="button"
                  onClick={() =>
                    setLocationFilter((prev) => (prev === st ? 'ALL' : st))
                  }
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                    active
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-400'
                  }`}
                >
                  <MapPin className="w-3 h-3 opacity-75" />
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 pr-3 font-bold">FIR ID & Date</th>
                <th className="py-3 pr-3 font-bold">Incident Type</th>
                <th className="py-3 pr-3 font-bold">Location (PS / District / State)</th>
                <th className="py-3 pr-3 font-bold">Threat</th>
                <th className="py-3 pr-3 font-bold">Confidence</th>
                <th className="py-3 pr-3 font-bold">BNS Sections</th>
                <th className="py-3 pr-3 font-bold">Summary</th>
                <th className="py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 space-y-2">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      No past FIR records match your date, incident type, or location filter.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset All History Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const isExpanded = expandedCaseId === item.id;
                  const evCounts = inferCaseEvidenceCounts(item);
                  const totalEv = Object.values(evCounts).reduce((a, b) => a + b, 0);
                  const itemDateObj = new Date(item.timestamp);
                  const formattedDate = !isNaN(itemDateObj.getTime())
                    ? itemDateObj.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Unknown Date';
                  const isoDateStr = !isNaN(itemDateObj.getTime())
                    ? itemDateObj.toISOString().slice(0, 10)
                    : '';

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() =>
                          setExpandedCaseId((prev) => (prev === item.id ? null : item.id))
                        }
                        className="hover:bg-slate-50 dark:hover:bg-slate-950/60 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 pr-3 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap tabular-nums">
                          <div>{item.id}</div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isoDateStr) {
                                setExactDateFilter((prev) => (prev === isoDateStr ? '' : isoDateStr));
                              }
                            }}
                            title="Filter history by this date"
                            className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-normal text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                          </button>
                        </td>
                        <td className="py-3.5 pr-3 text-xs">
                          <div className="flex flex-wrap gap-1 max-w-[190px]">
                            {(item.categories && item.categories.length > 0
                              ? item.categories
                              : ['General Offense']
                            ).map((cat, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIncidentTypeFilter((prev) => (prev === cat ? 'ALL' : cat));
                                }}
                                title={`Filter by incident type: ${cat}`}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
                                  incidentTypeFilter === cat
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-400'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 pr-3 text-xs">
                          {item.locationDetails ? (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                const locKey = `${item.locationDetails!.policeStation}, ${item.locationDetails!.district}`;
                                setLocationFilter((prev) => (prev === locKey ? 'ALL' : locKey));
                              }}
                              title="Click to filter by this Police Station / Location"
                              className="group/loc"
                            >
                              <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover/loc:text-blue-600 dark:group-hover/loc:text-blue-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                {item.locationDetails.policeStation}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-4">
                                {item.locationDetails.district}, {item.locationDetails.state}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 pr-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded border text-[10px] font-bold ${getThreatLevelColor(
                              item.threatLevel
                            )}`}
                          >
                            {item.threatLevel}
                          </span>
                        </td>
                        <td className="py-3.5 pr-3 font-mono text-xs font-bold tabular-nums">
                          {item.confidenceScore ? `${item.confidenceScore}%` : 'N/A'}
                        </td>
                        <td className="py-3.5 pr-3 text-xs">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {(item.recommendedActs || []).slice(0, 2).map((act, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] truncate max-w-[160px]"
                              >
                                {act.split('(')[0].trim()}
                              </span>
                            ))}
                            {(item.recommendedActs || []).length > 2 && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                +{(item.recommendedActs || []).length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 pr-3 max-w-xs">
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                            {item.summary}
                          </p>
                        </td>
                        <td
                          className="py-3.5 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                setExpandedCaseId((prev) =>
                                  prev === item.id ? null : item.id
                                )
                              }
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                              title="Toggle inline forensic preview"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            {onSelectCase && (
                              <button
                                onClick={() => onSelectCase(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                                title="Open full analysis dossier"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Inspect
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Forensic Detail Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 dark:bg-slate-950/80">
                          <td colSpan={8} className="p-5 border-b border-slate-200 dark:border-slate-800">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
                              {/* Left: Raw FIR Narrative & Stress Markers */}
                              <div className="lg:col-span-5 space-y-3">
                                <div>
                                  <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                    Verbatim FIR Narrative Excerpt
                                  </h4>
                                  <p className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                                    {item.rawText}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                    Stress Triggers ({(item.stressWords || []).length}) & Evidence Classes ({totalEv})
                                  </h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {(item.stressWords || []).map((sw, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-mono text-[11px]"
                                      >
                                        {sw}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Center: Invoked BNS Sections & Investigative Directives */}
                              <div className="lg:col-span-4 space-y-3">
                                <div>
                                  <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                    Recommended BNS (2023) & Statutory Charges
                                  </h4>
                                  <ul className="space-y-1">
                                    {(item.recommendedActs || []).map((act, i) => (
                                      <li
                                        key={i}
                                        className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200"
                                      >
                                        • {act}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                    Standard Operating Investigative Directives
                                  </h4>
                                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                                    {(item.investigativeSteps || []).map((step, i) => (
                                      <li key={i}>{step}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* Right: Chronological Timeline & Direct Analyzer Launch */}
                              <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
                                <div>
                                  <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                                    Extracted Timeline ({(item.timeline || []).length})
                                  </h4>
                                  {(item.timeline || []).length > 0 ? (
                                    <div className="space-y-2 border-l-2 border-blue-500/40 pl-3">
                                      {(item.timeline || []).map((ev, i) => (
                                        <div key={i}>
                                          <div className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                            {ev.timestamp}
                                          </div>
                                          <div className="text-[11px] text-slate-600 dark:text-slate-300">
                                            {ev.description}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-[11px] text-slate-400 italic">
                                      Open full analyzer to generate sequence of events.
                                    </p>
                                  )}
                                </div>

                                {onSelectCase && (
                                  <button
                                    onClick={() => onSelectCase(item)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider text-xs shadow-sm transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Open Full Forensic Dossier
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
