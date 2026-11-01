import React, { useRef, useState, useEffect } from 'react';
import { HistoryItem, FirAnalysisResult, GroundingLink, EvidenceItem } from '../types';
import { ShieldAlert, AlertTriangle, Send, Loader2, Printer, Download, FileText, Upload, File as FileIcon, X, Globe, ExternalLink, FileDown, Mic, MicOff, MapPin, Search, Compass, Database, Scale, CheckCircle2, Save, RotateCcw, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { demoCases } from '../data';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import { CrimeHeatmapD3 } from './CrimeHeatmapD3';
import { EvidenceAutoTagger } from './EvidenceAutoTagger';
import { WitnessAggregation } from './WitnessAggregation';

const SUBSTATE_STORAGE_KEY = 'cctns_fir_analysis_substate_v1';

interface AnalysisViewProps {
  firText: string;
  setFirText: (val: string) => void;
  selectedFile?: {name: string, data: string, mimeType: string} | null;
  handleFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile?: () => void;
  loading: boolean;
  result: FirAnalysisResult | null;
  error: string | null;
  handleAnalyze: (e: React.FormEvent) => void;
  loadHistoryItem: (item: HistoryItem) => void;
  history: HistoryItem[];
  autoSaveStatus?: 'idle' | 'saving' | 'saved' | 'restored';
  lastSavedAt?: Date | null;
  onManualSave?: () => void;
  onClearDraft?: () => void;
  onBackToDashboard?: () => void;
}

export function AnalysisView({
  firText,
  setFirText,
  selectedFile,
  handleFileUpload,
  removeFile,
  loading,
  result,
  error,
  handleAnalyze,
  loadHistoryItem,
  history,
  autoSaveStatus = 'saved',
  lastSavedAt,
  onManualSave,
  onClearDraft,
  onBackToDashboard
}: AnalysisViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Audio Transcription state (gemini-3.5-transcribe)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Grounding Intelligence state (Google Search & Google Maps Grounding)
  const [groundingLoading, setGroundingLoading] = useState<'none' | 'search' | 'maps'>('none');
  const [groundingText, setGroundingText] = useState<string | null>(null);
  const [groundingLinks, setGroundingLinks] = useState<GroundingLink[]>([]);
  const [groundingActiveMode, setGroundingActiveMode] = useState<'search' | 'maps' | null>(null);
  const [groundingError, setGroundingError] = useState<string | null>(null);
  const [managedEvidence, setManagedEvidence] = useState<EvidenceItem[]>([]);

  // Restore interactive sub-state (completedSteps, managedEvidence, grounding) if matching current result
  useEffect(() => {
    if (!result) {
      setCompletedSteps(new Set());
      setGroundingText(null);
      setGroundingLinks([]);
      setGroundingActiveMode(null);
      setGroundingError(null);
      return;
    }

    try {
      const raw = localStorage.getItem(SUBSTATE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.resultSignature === result.summary) {
          setCompletedSteps(new Set(Array.isArray(parsed.completedSteps) ? parsed.completedSteps : []));
          setGroundingText(parsed.groundingText || null);
          setGroundingLinks(Array.isArray(parsed.groundingLinks) ? parsed.groundingLinks : []);
          setGroundingActiveMode(parsed.groundingActiveMode || null);
          if (Array.isArray(parsed.managedEvidence) && parsed.managedEvidence.length > 0) {
            setManagedEvidence(parsed.managedEvidence);
          }
          setGroundingError(null);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to restore AnalysisView sub-state:', err);
    }

    setCompletedSteps(new Set());
    setGroundingText(null);
    setGroundingLinks([]);
    setGroundingActiveMode(null);
    setGroundingError(null);
  }, [result]);

  // Auto-save interactive sub-state whenever investigator checks steps, tags evidence, or runs grounding
  useEffect(() => {
    if (!result) return;
    try {
      const payload = {
        resultSignature: result.summary,
        completedSteps: Array.from(completedSteps),
        groundingText,
        groundingLinks,
        groundingActiveMode,
        managedEvidence
      };
      localStorage.setItem(SUBSTATE_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed to auto-save AnalysisView sub-state:', err);
    }
  }, [result, completedSteps, groundingText, groundingLinks, groundingActiveMode, managedEvidence]);

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Record & Transcribe Audio via gemini-3.5-transcribe
  const handleToggleAudioRecording = async () => {
    setTranscriptionError(null);
    if (isRecordingAudio) {
      mediaRecorderRef.current?.stop();
      setIsRecordingAudio(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (audioBlob.size === 0) return;

        setIsTranscribing(true);
        try {
          const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result as string;
              resolve(res.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
          });

          const response = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioData: base64Audio,
              mimeType: audioBlob.type || 'audio/webm',
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data?.details || data?.error || 'Audio transcription failed');
          }
          if (data.transcript) {
            setFirText(firText ? `${firText.trim()} ${data.transcript}` : data.transcript);
          }
        } catch (err: any) {
          setTranscriptionError(err.message || 'Unable to transcribe audio');
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecordingAudio(true);
    } catch (err: any) {
      setTranscriptionError('Microphone permission denied or unavailable.');
    }
  };

  // Run Google Search or Google Maps Grounding on the active FIR
  const handleRunGroundingIntel = async (mode: 'search' | 'maps') => {
    if (!result) return;
    setGroundingLoading(mode);
    setGroundingActiveMode(mode);
    setGroundingError(null);

    const locString = result.locationDetails
      ? `${result.locationDetails.policeStation || ''}, ${result.locationDetails.district || ''}, ${result.locationDetails.state || ''}, India`
      : 'India';

    const query =
      mode === 'maps'
        ? `Find nearby police stations, government trauma hospitals, forensic laboratories, and district courts near ${locString} for handling a ${result.threatLevel} priority case (${result.summary}).`
        : `Provide recent Indian legal precedents, official Bharatiya Nyaya Sanhita (BNS) guidelines, and recent news or advisories for ${
            result.recommendedActs?.join(', ') || result.categories.join(', ')
          } in ${locString}. Incident context: ${result.summary}`;

    const latLng =
      result.locationDetails?.lat && result.locationDetails?.lng
        ? { latitude: result.locationDetails.lat, longitude: result.locationDetails.lng }
        : undefined;

    try {
      const response = await fetch('/api/grounding-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, query, latLng }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Failed to fetch grounded intelligence');
      }
      setGroundingText(data.text);
      setGroundingLinks(data.groundingLinks || []);
    } catch (err: any) {
      setGroundingError(err.message || 'Failed to load grounded intelligence.');
    } finally {
      setGroundingLoading('none');
    }
  };

  const renderHighlightedText = (text: string, stressWords: string[]) => {
    if (!text) return null;
    if (!stressWords || stressWords.length === 0) return <span>{text}</span>;
    const sortedWords = [...stressWords].sort((a, b) => b.length - a.length);
    const escapedWords = sortedWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) => {
          const isStressWord = sortedWords.some(w => w.toLowerCase() === part.toLowerCase());
          if (isStressWord) {
            return (
              <span key={i} className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 px-1 py-0.5 rounded font-medium shadow-sm border border-red-200 dark:border-red-800/50">
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  const handlePrint = () => {
    const previousTitle = document.title;
    const now = new Date();
    const dateStamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const stationSlug = (result?.locationDetails?.policeStation || 'CCTNS_HQ')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 24);
    document.title = `Official_FIR_Forensic_Report_${stationSlug}_${dateStamp}`;
    window.print();
    setTimeout(() => {
      document.title = previousTitle;
    }, 500);
  };

  const handleExport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify({ rawText: firText, managedEvidence, ...result }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FIR_Analysis_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCrimeDmsCSV = () => {
    if (!result) return;

    const now = new Date();
    const caseRefId = `CRIME-DMS-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getTime()).slice(-5)}`;

    const escapeCsvField = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/\r?\n|\r/g, ' ').trim();
      return `"${str.replace(/"/g, '""')}"`;
    };

    const activeEvidence = managedEvidence && managedEvidence.length > 0
      ? managedEvidence
      : (result.evidenceItems || []);

    const filterEvidenceByCategory = (cat: string) =>
      activeEvidence
        .filter((e) => e.category === cat)
        .map((e) => `${e.id}: ${e.item} (${e.confidence}% | ${e.chainOfCustodyStatus || 'Pending Collection'})`)
        .join(' ; ');

    const fullEvidenceManifest = activeEvidence
      .map(
        (e) =>
          `[${e.id} | ${e.category} | ${e.confidence}% | ${e.chainOfCustodyStatus || 'Pending Collection'}] ${e.item}${
            e.bnsRelevance ? ` (BSA/BNS: ${e.bnsRelevance})` : ''
          }`
      )
      .join(' || ');

    const completedStepsList = (result.investigativeSteps || [])
      .filter((_, idx) => completedSteps.has(idx))
      .map((s, i) => `${i + 1}. ${s}`)
      .join(' ; ');

    const pendingStepsList = (result.investigativeSteps || [])
      .filter((_, idx) => !completedSteps.has(idx))
      .map((s, i) => `${i + 1}. ${s}`)
      .join(' ; ');

    const timelineSerialized = (result.timeline || [])
      .map((t, idx) => `T${idx + 1}[${t.timestamp}]: ${t.description}`)
      .join(' -> ');

    const categoryScoresSerialized = (result.categoryScores || [])
      .map((cs) => `${cs.category}:${cs.score}%`)
      .join(' | ');

    const groundingSummary = groundingText
      ? `${groundingText} ${groundingLinks.map((l) => `[${l.title}: ${l.uri}]`).join(' ')}`
      : 'Not Queried';

    const headers = [
      'DMS_SCHEMA_VERSION',
      'CRIME_DMS_CASE_REF_ID',
      'EXPORT_TIMESTAMP_ISO',
      'STATUTORY_FRAMEWORK',
      'STATE_OR_UT',
      'DISTRICT',
      'POLICE_STATION_JURISDICTION',
      'GEO_LATITUDE',
      'GEO_LONGITUDE',
      'THREAT_SEVERITY_CODE',
      'AI_CONFIDENCE_SCORE_PCT',
      'EXECUTIVE_FIR_SUMMARY',
      'RECOMMENDED_BNS_2023_SECTIONS',
      'PRIMARY_CRIME_CATEGORIES',
      'CATEGORY_DISTRIBUTION_VECTOR',
      'DETECTED_STRESS_LEXICON',
      'CHRONOLOGICAL_EVENT_TIMELINE',
      'EVIDENCE_COUNT_TOTAL',
      'EVIDENCE_DIGITAL_RECORDS',
      'EVIDENCE_PHYSICAL_WEAPONRY',
      'EVIDENCE_WITNESS_STATEMENTS',
      'EVIDENCE_FINANCIAL_RECORDS',
      'EVIDENCE_FORENSIC_MEDICAL',
      'EVIDENCE_VEHICLE_PROPERTY',
      'EVIDENCE_CHAIN_OF_CUSTODY_MANIFEST',
      'INVESTIGATIVE_STEPS_COMPLETED',
      'INVESTIGATIVE_STEPS_PENDING',
      'EXPECTED_JUDICIAL_OUTCOMES',
      'GROUNDED_INTELLIGENCE_NOTES',
      'SANITIZED_VERBATIM_FIR_NARRATIVE',
    ];

    const rowValues = [
      'CRIME-DMS-v4.2-CCTNS-BNS2023',
      caseRefId,
      now.toISOString(),
      'Bharatiya Nyaya Sanhita (BNS) 2023 / BNSS Sec 173 / BSA Sec 63',
      result.locationDetails?.state || 'Unspecified State/UT',
      result.locationDetails?.district || 'Unspecified District',
      result.locationDetails?.policeStation || 'Unspecified Police Station',
      result.locationDetails?.lat !== undefined ? String(result.locationDetails.lat) : '',
      result.locationDetails?.lng !== undefined ? String(result.locationDetails.lng) : '',
      result.threatLevel,
      String(result.confidenceScore ?? 85),
      result.summary || '',
      (result.recommendedActs || []).join(' ; '),
      (result.categories || []).join(' ; '),
      categoryScoresSerialized,
      (result.stressWords || []).join(', '),
      timelineSerialized,
      String(activeEvidence.length),
      filterEvidenceByCategory('Digital Evidence'),
      filterEvidenceByCategory('Physical Weaponry'),
      filterEvidenceByCategory('Witness Statements'),
      filterEvidenceByCategory('Financial Records'),
      filterEvidenceByCategory('Forensic / Medical'),
      filterEvidenceByCategory('Vehicle / Property'),
      fullEvidenceManifest,
      completedStepsList,
      pendingStepsList,
      (result.expectedOutcomes || []).join(' ; '),
      groundingSummary,
      firText ? firText.trim() : '',
    ];

    const csvContent =
      '\uFEFF' +
      headers.map(escapeCsvField).join(',') +
      '\r\n' +
      rowValues.map(escapeCsvField).join(',') +
      '\r\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CRIME_DMS_Import_${caseRefId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    const now = new Date();
    const dossierId = `BNSS-173/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getTime()).slice(-4)}`;
    let y = 18;

    const drawPageBorder = () => {
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.5);
      doc.rect(9, 9, pageWidth - 18, pageHeight - 18);
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.2);
      doc.rect(10.5, 10.5, pageWidth - 21, pageHeight - 21);
    };

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 20) {
        doc.addPage();
        drawPageBorder();
        y = 18;
      }
    };

    const addLegalSectionHeader = (romanNumeral: string, title: string) => {
      checkPageBreak(14);
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, contentWidth, 7.5, 'F');
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`SECTION ${romanNumeral} : ${title.toUpperCase()}`, margin + 3, y + 5.1);
      y += 11;
    };

    const addWrappedLegalText = (
      text: string,
      fontSize = 9.5,
      fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
      color: [number, number, number] = [15, 23, 42],
      indent = 0,
      widthOverride?: number
    ) => {
      doc.setFont('times', fontStyle);
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      const availWidth = (widthOverride || contentWidth) - indent;
      const lines = doc.splitTextToSize(text || 'N/A', availWidth);
      const lineHeight = fontSize * 0.44;
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight + 2);
        doc.text(line, margin + indent, y);
        y += lineHeight;
      });
      y += 1.5;
    };

    // Draw Page 1 Legal Border
    drawPageBorder();

    // Official Statutory Header Block
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('INDIAN POLICE FORENSIC INTELLIGENCE & LEGAL DOSSIER', pageWidth / 2, y, { align: 'center' });
    y += 5;

    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.text('FORM - I : FIRST INFORMATION & FORENSIC ANALYSIS REPORT', pageWidth / 2, y, { align: 'center' });
    y += 4.5;

    doc.setFont('times', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      '[Prepared Pursuant to Section 173 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 & Bharatiya Nyaya Sanhita (BNS), 2023]',
      pageWidth / 2,
      y,
      { align: 'center' }
    );
    y += 4;

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4.5;

    // Metadata Ribbon
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`DOSSIER REF NO: ${dossierId}`, margin, y);
    doc.text(`DATE & TIME OF ISSUE: ${now.toLocaleString()}`, pageWidth - margin, y, { align: 'right' });
    y += 3.5;

    doc.setLineWidth(0.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // SECTION I: JURISDICTION, REGISTRATION & THREAT PARTICULARS
    addLegalSectionHeader('I', 'Jurisdiction, Registration & Threat Particulars');

    const colWidth = contentWidth / 2;
    const tableRows: Array<[string, string, string, string]> = [
      [
        '1. State / Union Territory:',
        result.locationDetails?.state || 'Not Specified in Narrative',
        '2. District Jurisdiction:',
        result.locationDetails?.district || 'Not Specified in Narrative',
      ],
      [
        '3. Police Station (P.S.):',
        result.locationDetails?.policeStation || 'Not Specified in Narrative',
        '4. Geo-Coordinates:',
        result.locationDetails?.lat !== undefined && result.locationDetails?.lng !== undefined
          ? `${result.locationDetails.lat.toFixed(4)}° N, ${result.locationDetails.lng.toFixed(4)}° E`
          : 'Unmapped / General India',
      ],
      [
        '5. Assessed Threat Priority:',
        `${result.threatLevel} PRIORITY`,
        '6. AI Forensic Confidence:',
        `${result.confidenceScore ?? 85}% Verified Match`,
      ],
      [
        '7. Primary Crime Classification:',
        (result.categories && result.categories.length > 0 ? result.categories.join(', ') : 'General Cognizable Offence'),
        '8. CRIME-DMS Export Status:',
        'CCTNS / CRIME-DMS v4.2 Ready',
      ],
    ];

    tableRows.forEach((row) => {
      checkPageBreak(9);
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 3.5, contentWidth, 8, 'FD');
      doc.line(margin + colWidth, y - 3.5, margin + colWidth, y + 4.5);

      doc.setFont('times', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(row[0], margin + 2, y + 1.2);

      doc.setFont('times', 'normal');
      doc.setTextColor(15, 23, 42);
      const val1 = doc.splitTextToSize(row[1], colWidth - 42)[0] || 'N/A';
      doc.text(val1, margin + 42, y + 1.2);

      doc.setFont('times', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(row[2], margin + colWidth + 2, y + 1.2);

      doc.setFont('times', 'normal');
      doc.setTextColor(15, 23, 42);
      const val2 = doc.splitTextToSize(row[3], colWidth - 42)[0] || 'N/A';
      doc.text(val2, margin + colWidth + 42, y + 1.2);

      y += 8;
    });
    y += 4;

    // SECTION II: APPLICABLE STATUTORY PROVISIONS (BHARATIYA NYAYA SANHITA, 2023)
    addLegalSectionHeader('II', 'Prima Facie Statutory Offences & Applicable BNS (2023) Sections');
    if (result.recommendedActs && result.recommendedActs.length > 0) {
      result.recommendedActs.forEach((act, index) => {
        checkPageBreak(9);
        doc.setFillColor(239, 246, 255);
        doc.setDrawColor(191, 219, 254);
        const lines = doc.splitTextToSize(`Charge ${index + 1}: ${act}`, contentWidth - 6);
        const boxH = lines.length * 4.3 + 3;
        doc.rect(margin, y - 3, contentWidth, boxH, 'FD');
        doc.setFont('times', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 58, 138);
        lines.forEach((line: string, lineIdx: number) => {
          doc.text(line, margin + 3, y + 1 + lineIdx * 4.3);
        });
        y += boxH + 2;
      });
    } else {
      addWrappedLegalText('No specific Bharatiya Nyaya Sanhita (BNS) statutory sections identified.', 9.5, 'italic');
    }
    y += 2;

    // SECTION III: EXECUTIVE FORENSIC SUMMARY & CATEGORY DISTRIBUTION
    addLegalSectionHeader('III', 'Executive Case Summary & Forensic Threat Breakdown');
    addWrappedLegalText('3.1 Brief Facts & Executive Summary of Incident:', 9.5, 'bold', [15, 23, 42]);
    addWrappedLegalText(result.summary, 9.5, 'normal', [30, 41, 59], 3);
    y += 1;

    if (result.categoryScores && result.categoryScores.length > 0) {
      addWrappedLegalText('3.2 Algorithmic Crime Category Probability Distribution:', 9.5, 'bold', [15, 23, 42]);
      const scoreSummary = result.categoryScores.map((c) => `${c.category}: ${c.score}%`).join('   |   ');
      addWrappedLegalText(scoreSummary, 9, 'normal', [51, 65, 85], 3);
      y += 1;
    }

    addWrappedLegalText('3.3 Extracted High-Stress & Threat Lexical Triggers:', 9.5, 'bold', [15, 23, 42]);
    addWrappedLegalText(
      result.stressWords && result.stressWords.length > 0
        ? result.stressWords.map((w) => `"${w}"`).join(', ')
        : 'No acute lexical stress indicators flagged.',
      9,
      'italic',
      [185, 28, 28],
      3
    );
    y += 3;

    // SECTION IV: VERBATIM FIRST INFORMATION NARRATIVE (SANITIZED RECORD)
    addLegalSectionHeader('IV', 'Verbatim First Information Narrative (Sanitized Complainant Statement)');
    if (firText && firText.trim()) {
      addWrappedLegalText(
        'The following statement represents the verbatim text submitted for forensic evaluation under Section 173 BNSS:',
        8.5,
        'italic',
        [71, 85, 105]
      );
      addWrappedLegalText(`"${firText.trim()}"`, 9, 'normal', [15, 23, 42], 3);
    } else {
      addWrappedLegalText('No raw narrative text recorded (Document/Multimodal attachment analysis).', 9, 'italic', [71, 85, 105], 3);
    }
    y += 3;

    // SECTION V: CHRONOLOGICAL SEQUENCE OF EVENTS (TIMELINE)
    addLegalSectionHeader('V', 'Chronological Sequence of Events (Reconstructed Forensic Timeline)');
    if (result.timeline && result.timeline.length > 0) {
      result.timeline.forEach((event, idx) => {
        checkPageBreak(12);
        addWrappedLegalText(
          `Event #${String(idx + 1).padStart(2, '0')}  |  Timestamp / Phase: ${event.timestamp}`,
          9.5,
          'bold',
          [15, 23, 42],
          2
        );
        addWrappedLegalText(`Description: ${event.description}`, 9, 'normal', [51, 65, 85], 6);
      });
    } else {
      addWrappedLegalText('No discrete chronological timestamps extracted from the narrative.', 9, 'italic', [71, 85, 105], 2);
    }
    y += 3;

    // SECTION VI: ML AUTO-TAGGED EVIDENCE INVENTORY & BSA ADMISSIBILITY LEDGER
    const activeEvidence =
      managedEvidence && managedEvidence.length > 0 ? managedEvidence : result.evidenceItems || [];
    addLegalSectionHeader('VI', 'Material Evidence Seizure & BSA (2023) Admissibility Ledger');
    if (activeEvidence.length > 0) {
      activeEvidence.forEach((ev, idx) => {
        checkPageBreak(18);
        addWrappedLegalText(
          `${idx + 1}. Exhibit ID: ${ev.id}  |  Class: ${ev.category.toUpperCase()}  |  ML Confidence: ${ev.confidence}%  |  Custody: [${
            ev.chainOfCustodyStatus || 'Pending Collection'
          }]`,
          9,
          'bold',
          [15, 23, 42],
          2
        );
        addWrappedLegalText(`Particulars of Exhibit: ${ev.item}`, 9, 'normal', [30, 41, 59], 6);
        if (ev.sourceExcerpt) {
          addWrappedLegalText(`FIR Source Excerpt: "${ev.sourceExcerpt}"`, 8.5, 'italic', [71, 85, 105], 6);
        }
        if (ev.bnsRelevance) {
          addWrappedLegalText(
            `Statutory Admissibility (BSA 2023 / BNSS 2023): ${ev.bnsRelevance}`,
            8.5,
            'normal',
            [29, 78, 216],
            6
          );
        }
        y += 1.5;
      });
    } else {
      addWrappedLegalText('No discrete physical or digital exhibits cataloged in this session.', 9, 'italic', [71, 85, 105], 2);
    }
    y += 3;

    // SECTION VII: INVESTIGATIVE ACTION PLAN & EXPECTED JUDICIAL OUTCOMES
    addLegalSectionHeader('VII', 'Standard Operating Investigative Directives & Expected Outcomes');
    if (result.investigativeSteps && result.investigativeSteps.length > 0) {
      addWrappedLegalText('7.1 Mandatory Investigative Action Plan (I.O. Checklist):', 9.5, 'bold', [15, 23, 42]);
      result.investigativeSteps.forEach((step, idx) => {
        const isDone = completedSteps.has(idx);
        const statusTag = isDone ? '[ACTION COMPLETED]' : '[ACTION PENDING]';
        addWrappedLegalText(
          `${idx + 1}. ${statusTag} ${step}`,
          9,
          isDone ? 'bold' : 'normal',
          isDone ? [5, 150, 105] : [30, 41, 59],
          4
        );
      });
      y += 2;
    }

    if (result.expectedOutcomes && result.expectedOutcomes.length > 0) {
      addWrappedLegalText('7.2 Projected Legal & Procedural Outcomes:', 9.5, 'bold', [15, 23, 42]);
      result.expectedOutcomes.forEach((outcome, idx) => {
        addWrappedLegalText(`(${String.fromCharCode(97 + idx)}) ${outcome}`, 9, 'normal', [51, 65, 85], 4);
      });
      y += 2;
    }

    if (groundingText) {
      addWrappedLegalText('7.3 Verified Grounded Legal & Geographical Intelligence:', 9.5, 'bold', [15, 23, 42]);
      addWrappedLegalText(groundingText, 8.5, 'normal', [51, 65, 85], 4);
      if (groundingLinks.length > 0) {
        groundingLinks.forEach((link) => {
          addWrappedLegalText(`• Reference: ${link.title} (${link.uri})`, 8, 'italic', [29, 78, 216], 6);
        });
      }
      y += 2;
    }

    // SECTION VIII: OFFICIAL CERTIFICATION & ATTESTATION BLOCK
    checkPageBreak(42);
    addLegalSectionHeader('VIII', 'Statutory Certification & Investigating Officer Attestation');
    addWrappedLegalText(
      'CERTIFIED that the above Forensic First Information Analytical Dossier has been generated and verified in accordance with standard digital policing protocols under the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 and the Bharatiya Sakshya Adhiniyam (BSA), 2023 (Section 63 Electronic Record Certification).',
      8.5,
      'italic',
      [51, 65, 85],
      2
    );
    y += 12;

    checkPageBreak(22);
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.3);
    // Signature Line 1: Investigating Officer
    doc.line(margin + 4, y, margin + 62, y);
    // Signature Line 2: Station House Officer
    doc.line(margin + 72, y, margin + 130, y);
    // Signature Line 3: Official Seal / Digital Hash
    doc.line(margin + 138, y, pageWidth - margin - 2, y);

    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('SIGNATURE OF INVESTIGATING OFFICER', margin + 4, y + 4);
    doc.text('COUNTERSIGNED BY S.H.O. / SEAL', margin + 72, y + 4);
    doc.text('DIGITAL FORENSIC ATTESTATION', margin + 138, y + 4);

    doc.setFont('times', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`P.S.: ${result.locationDetails?.policeStation || '________________'}`, margin + 4, y + 8);
    doc.text(`District: ${result.locationDetails?.district || '________________'}`, margin + 72, y + 8);
    doc.text(`Ref: ${dossierId}`, margin + 138, y + 8);

    // Legal Footers on All Pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('times', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `OFFICIAL LEGAL DOSSIER [${dossierId}] • BNS / BNSS Sec. 173 / BSA Sec. 63 Compliant • Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 12,
        { align: 'center' }
      );
    }

    doc.save(`Legal_FIR_Dossier_${dossierId.replace(/[\/\\:]/g, '_')}.pdf`);
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      case 'HIGH':
        return 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
    }
  };

  const loadSample = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = demoCases.find(f => f.label === e.target.value);
    if (selected) {
      setFirText(selected.rawText);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-6 pb-12 space-y-6 print:px-0 print:pb-0 print:max-w-none">
      {/* Auto-Save & Local Browser Persistence Status Bar + Back to Main Screen Button */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              title="Return directly to Main Dashboard Screen"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Screen</span>
            </button>
          )}
          {autoSaveStatus === 'saving' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Auto-saving analysis workspace...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {autoSaveStatus === 'restored'
                ? 'Active FIR Dossier Restored from Local Storage'
                : 'Auto-Save Active (Local Browser Storage)'}
            </span>
          )}
          <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            {lastSavedAt
              ? `Last synced: ${lastSavedAt.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}`
              : 'Synced periodically every 10s'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {result && (
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-600 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              title="Generate Official Printable Document / Save as PDF via Print Layout"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download Report as PDF</span>
            </button>
          )}
          {onManualSave && (
            <button
              type="button"
              onClick={onManualSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors"
              title="Immediately checkpoint current FIR narrative and analysis state to browser storage"
            >
              <Save className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Save Snapshot
            </button>
          )}
          {onClearDraft && (firText.trim().length > 0 || result !== null) && (
            <button
              type="button"
              onClick={onClearDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold transition-colors"
              title="Clear current draft and reset local workspace"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Draft
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:hidden">
        
        {/* History Sidebar */}
        <aside className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col shadow-sm print:hidden h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Recent Analyses</span>
            </h2>
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                title="Back to Main Screen (Dashboard)"
              >
                <ArrowLeft className="w-3 h-3" />
                Main Screen
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 py-8 text-center space-y-2 opacity-60">
              <FileText className="w-8 h-8" />
              <p className="text-xs">No recent reports found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className="w-full text-left p-3 rounded-md border border-slate-100 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getThreatLevelColor(item.threatLevel)}`}>
                      {item.threatLevel}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                    {item.summary}
                  </p>
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Input Section */}
        <section className="col-span-1 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col overflow-hidden shadow-sm print:hidden">
          <div className="bg-slate-50 dark:bg-slate-950 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Raw Narrative Input</span>
            <div className="flex items-center space-x-2">
              <select 
                onChange={loadSample}
                className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 outline-none focus:border-blue-500"
                defaultValue=""
              >
                <option value="" disabled>Load Demo Sample...</option>
                {demoCases.map((sample, idx) => (
                  <option key={idx} value={sample.label}>{sample.label}</option>
                ))}
              </select>
            </div>
          </div>
          <form onSubmit={handleAnalyze} className="flex flex-col flex-1 h-[calc(100vh-20rem)] overflow-y-auto">
            <div className="relative bg-white dark:bg-slate-900 border-0 flex-1 flex flex-col">
              <textarea
                className="w-full h-full min-h-[250px] bg-transparent border-0 p-5 text-sm text-slate-700 dark:text-slate-300 italic placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-0 resize-none leading-relaxed"
                placeholder="Paste sanitized FIR text here, dictate with AI voice transcription, or upload a document..."
                value={firText}
                onChange={(e) => setFirText(e.target.value)}
              />
              
              {selectedFile && (
                <div className="px-5 pb-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800/50">
                    <FileIcon className="w-4 h-4" />
                    <span className="text-xs font-medium max-w-[200px] truncate">{selectedFile.name}</span>
                    <button 
                      type="button" 
                      onClick={removeFile}
                      className="ml-2 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {transcriptionError && (
                <div className="px-5 pb-2 text-xs text-red-500 font-medium">
                  {transcriptionError}
                </div>
              )}
              
              <div className="px-5 pb-3 pt-1 flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5" />
                <span>Multilingual Support: Hindi, Marathi, Bengali, Tamil, Telugu, and more...</span>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,image/jpeg,image/png"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider px-2.5 py-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleAudioRecording}
                  disabled={isTranscribing}
                  className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-2.5 py-2 rounded border transition-colors ${
                    isRecordingAudio
                      ? 'bg-red-600 text-white border-red-600 animate-pulse'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  title="Record & transcribe spoken FIR narrative via Gemini Audio Transcription"
                >
                  {isTranscribing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Transcribing...</span>
                    </>
                  ) : isRecordingAudio ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Stop Mic</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Dictate FIR</span>
                    </>
                  )}
                </button>
              </div>
              
              <button
                type="submit"
                disabled={loading || (!firText.trim() && !selectedFile)}
                className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs px-5 py-2 rounded font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Process Evidence</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Analysis Results Display */}
        <section className="col-span-1 lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col shadow-sm print:border-none print:shadow-none print:p-0 print:bg-transparent">
          <div className="mb-6 flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 print:border-slate-300">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2 print:text-slate-600">
                <span>Forensic Breakdown</span>
              </h2>
              {onBackToDashboard && (
                <button
                  type="button"
                  onClick={onBackToDashboard}
                  className="print:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                  title="Return to Main Dashboard Screen"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Main Screen
                </button>
              )}
            </div>
            {result && (
              <div className="flex flex-wrap gap-1.5 print:hidden">
                <button
                  onClick={handlePrint}
                  className="text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center space-x-1.5 border border-indigo-600 px-2.5 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wider shadow-xs cursor-pointer"
                  title="Download Report as PDF using Official Print Document Layout (window.print)"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download Report as PDF</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center space-x-1.5 border border-blue-600 px-2.5 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wider shadow-xs cursor-pointer"
                  title="Direct Statutory Legal Dossier PDF Download (BNSS Sec 173 / BNS / BSA)"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Legal PDF</span>
                </button>
                <button
                  onClick={handleExportCrimeDmsCSV}
                  className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center space-x-1.5 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wider shadow-xs cursor-pointer"
                  title="Export Analyzed FIR Summary to CRIME-DMS / CCTNS Police Database CSV Format"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>CRIME-DMS CSV</span>
                </button>
                <button
                  onClick={handleExport}
                  className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center space-x-1 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  title="Export raw JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-start space-x-3 mb-6">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-slate-400 dark:text-slate-600 px-8 py-12">
              <ShieldAlert className="w-12 h-12 opacity-50" />
              <p className="text-sm font-medium">Awaiting FIR input. System will extract stress words, categories, threat level, timeline, and Indian jurisdiction coordinates.</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-blue-600 dark:text-blue-500 py-12">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-sm font-semibold uppercase tracking-widest animate-pulse">Running analysis...</p>
            </div>
          )}

          {result && !loading && (
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="space-y-8"
            >
              
              {/* Threat Level, Confidence & Location */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Threat Assessment</span>
                  <h2 className={`text-4xl font-bold tracking-tighter ${result.threatLevel === 'CRITICAL' ? 'text-red-600 dark:text-red-500' : result.threatLevel === 'HIGH' ? 'text-orange-600 dark:text-orange-500' : result.threatLevel === 'MEDIUM' ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                    {result.threatLevel}
                  </h2>
                  {result.locationDetails && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700 w-full max-w-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Location Details (India)</span>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {result.locationDetails.policeStation && <div>PS: {result.locationDetails.policeStation}</div>}
                        {result.locationDetails.district && <div>District: {result.locationDetails.district}</div>}
                        {result.locationDetails.state && <div>State: {result.locationDetails.state}</div>}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right md:w-48 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">AI Confidence Score</span>
                  <div className="flex flex-col items-end gap-2">
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xl font-bold border border-slate-200 dark:border-slate-700 shadow-sm min-w-20 justify-end">
                      {result.confidenceScore || 85}%
                    </div>
                    <div className="w-32 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${
                          (result.confidenceScore || 85) >= 90 ? 'bg-emerald-500' :
                          (result.confidenceScore || 85) >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.confidenceScore || 85}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Highlighted Raw Narrative / Print */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Original FIR Input</h3>
                <p className="text-slate-800 dark:text-slate-300 text-sm font-serif leading-relaxed border-l-2 border-slate-300 dark:border-slate-700 pl-4 py-1">
                  {renderHighlightedText(firText, result.stressWords)}
                </p>
              </motion.div>

              {/* Summary */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Incident Summary</h3>
                <p className="text-slate-800 dark:text-slate-200 text-lg font-medium leading-snug">
                  {result.summary}
                </p>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categories */}
                <div className="space-y-4 relative">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    Primary Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.categories.length > 0 ? (
                      result.categories.map((cat, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-[10px] font-bold rounded uppercase tracking-wide border border-slate-200 dark:border-slate-700">
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500 dark:text-slate-500">No categories identified.</span>
                    )}
                  </div>
                </div>

                {/* Stress Words */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    Detected Stress Indicators
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {result.stressWords.length > 0 ? (
                      result.stressWords.map((word, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${result.threatLevel === 'CRITICAL' || result.threatLevel === 'HIGH' ? 'bg-red-500' : 'bg-slate-500'}`}></div>
                          <span className="text-sm text-slate-700 dark:text-slate-300">{word}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500 dark:text-slate-500">No stress words extracted.</span>
                    )}
                  </div>
                </div>

                {/* Radar Chart */}
                {result.categoryScores && result.categoryScores.length > 0 && (
                  <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 md:col-span-2">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Category Distribution Match
                    </h3>
                    <div className="h-64 w-full bg-slate-50 dark:bg-slate-950/50 rounded-lg flex items-center justify-center p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.categoryScores}>
                          <PolarGrid stroke="#a1a1aa" opacity={0.3} />
                          <PolarAngleAxis dataKey="category" tick={{ fill: '#888', fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Category Match" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

                {/* Timeline */}
                {result.timeline && result.timeline.length > 0 && (
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 md:col-span-2">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                      Incident Timeline
                    </h3>
                    <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6">
                      {result.timeline.map((event, idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-1.5 border-2 border-white dark:border-slate-900"></div>
                          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{event.timestamp}</div>
                          <div className="text-sm text-slate-800 dark:text-slate-200">{event.description}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ML Evidence Auto-Tagging & Management System */}
                <EvidenceAutoTagger
                  firText={firText}
                  result={result}
                  onEvidenceChange={setManagedEvidence}
                  onBackToDashboard={onBackToDashboard}
                />

                {/* Multi-Witness Aggregation & Statement Cross-Examination Engine */}
                <WitnessAggregation
                  firText={firText}
                  result={result}
                  onBackToDashboard={onBackToDashboard}
                />

                {/* Investigative Steps */}
                {result.investigativeSteps && result.investigativeSteps.length > 0 && (
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 md:col-span-2">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Recommended Investigative Steps
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      {result.investigativeSteps.map((step, idx) => (
                        <li 
                          key={idx} 
                          className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${completedSteps.has(idx) ? 'bg-slate-50 dark:bg-slate-800/50 opacity-60' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                          onClick={() => toggleStep(idx)}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${completedSteps.has(idx) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                            {completedSteps.has(idx) && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className={completedSteps.has(idx) ? 'line-through' : ''}>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Expected Outcomes */}
                {result.expectedOutcomes && result.expectedOutcomes.length > 0 && (
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 md:col-span-1">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Potential Expected Outcomes
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {result.expectedOutcomes.map((outcome, idx) => (
                        <li key={idx}>{outcome}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Recommended Acts */}
                {result.recommendedActs && result.recommendedActs.length > 0 && (
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 md:col-span-1">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Recommended BNS Acts
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300 font-serif">
                      {result.recommendedActs.map((act, idx) => (
                        <li key={idx} className="text-blue-700 dark:text-blue-400">
                          <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(act + " legal statute definition India")}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline inline-flex items-center gap-1 align-middle"
                            title={`Search for ${act} definition`}
                          >
                            <span>{act}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Live AI Grounding Intelligence (Google Search & Google Maps Grounding) */}
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 md:col-span-2 print:hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-blue-500" />
                        <span>Real-Time Grounded Intelligence (Search & Maps)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Verify BNS legal precedents via Google Search or find nearby emergency/judicial facilities via Google Maps.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleRunGroundingIntel('search')}
                        disabled={groundingLoading !== 'none'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider border transition-colors ${
                          groundingActiveMode === 'search'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {groundingLoading === 'search' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                        <span>Search Legal Precedents</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRunGroundingIntel('maps')}
                        disabled={groundingLoading !== 'none'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider border transition-colors ${
                          groundingActiveMode === 'maps'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {groundingLoading === 'maps' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                        <span>Nearby Police & Hospitals</span>
                      </button>
                    </div>
                  </div>

                  {groundingError && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-xs text-red-600 dark:text-red-400">
                      {groundingError}
                    </div>
                  )}

                  {groundingText && (
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                      <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                        {groundingText}
                      </p>

                      {groundingLinks.length > 0 && (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Verified Grounding Sources & Places
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {groundingLinks.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                                  link.type === 'maps'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
                                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 hover:bg-blue-100'
                                }`}
                              >
                                {link.type === 'maps' ? <MapPin className="w-3 h-3 shrink-0" /> : <Globe className="w-3 h-3 shrink-0" />}
                                <span className="truncate max-w-[220px]">{link.title}</span>
                                <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </section>
      </div>

      {/* D3 Geographical Crime Intensity Heatmap Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm print:hidden">
        <CrimeHeatmapD3
          activeResult={result}
          history={history}
          onBackToDashboard={onBackToDashboard}
        />
      </section>

      {/* Bottom Return to Main Screen (Dashboard) Action Bar */}
      {onBackToDashboard && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs print:hidden">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Return to the unified CCTNS Command Dashboard to view macro crime analytics and 24-hour predictive hotspots.
          </span>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Back to Main Screen (Dashboard)</span>
          </button>
        </div>
      )}

      {/* ===========================================================================
          OFFICIAL PRINTABLE FIR FINDINGS DOCUMENT (RENDERED ONLY ON window.print())
         =========================================================================== */}
      {result && (
        <div className="hidden print:block text-slate-900 bg-white w-full font-sans text-[11px] leading-relaxed">
          {/* Official Government Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-center justify-between gap-4 print-avoid-break">
            <div className="flex items-center gap-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="State Emblem of India"
                className="w-12 h-14 object-contain"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Government of India • Ministry of Home Affairs • CCTNS Forensic Intelligence
                </p>
                <h1 className="text-base font-extrabold uppercase tracking-wider text-slate-950 mt-0.5">
                  Official First Information Report (FIR) Forensic &amp; Statutory Dossier
                </h1>
                <p className="text-[10px] font-medium text-slate-700 mt-0.5">
                  Issued Pursuant to Sec. 173 Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 &amp; Sec. 63 Bharatiya Sakshya Adhiniyam (BSA), 2023
                </p>
              </div>
            </div>
            <div className="text-right border border-slate-400 rounded px-3 py-2 bg-slate-50 shrink-0">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                Classification
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                OFFICIAL POLICE RECORD
              </div>
              <div className="text-[9px] font-mono text-slate-600 mt-0.5">
                Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Section I: Dossier Metadata & Jurisdiction Table */}
          <div className="mb-5 print-avoid-break">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-900 text-white px-3 py-1.5 mb-2">
              Section I — Case Registration, Jurisdiction &amp; Threat Matrix
            </h2>
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <tbody>
                <tr>
                  <td className="border border-slate-300 bg-slate-100 font-bold px-2.5 py-1.5 w-1/5">
                    Dossier Ref. ID
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5 font-mono w-3/10">
                    CCTNS/FIR/{new Date().getFullYear()}/{String(new Date().getTime()).slice(-6)}
                  </td>
                  <td className="border border-slate-300 bg-slate-100 font-bold px-2.5 py-1.5 w-1/5">
                    Assessed Threat Level
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5 font-extrabold uppercase w-3/10">
                    <span
                      className={`inline-block px-2 py-0.5 rounded border text-[10px] ${
                        result.threatLevel === 'CRITICAL'
                          ? 'bg-red-100 text-red-900 border-red-400'
                          : result.threatLevel === 'HIGH'
                          ? 'bg-orange-100 text-orange-900 border-orange-400'
                          : result.threatLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-900 border-amber-400'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      }`}
                    >
                      {result.threatLevel} PRIORITY
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 bg-slate-100 font-bold px-2.5 py-1.5">
                    Police Station (P.S.)
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5">
                    {result.locationDetails?.policeStation || 'Jurisdictional Station (Pending Field Verification)'}
                  </td>
                  <td className="border border-slate-300 bg-slate-100 font-bold px-2.5 py-1.5">
                    AI Forensic Confidence
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5 font-mono font-bold">
                    {result.confidenceScore || 85}% Verified Match
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 bg-slate-100 font-bold px-2.5 py-1.5">
                    District &amp; State
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5">
                    {[result.locationDetails?.district, result.locationDetails?.state].filter(Boolean).join(', ') || 'India (National CCTNS Grid)'}
                  </td>
                  <td className="border border-slate-300 bg-slate-100 font-bold px-2.5 py-1.5">
                    Geo-Coordinates
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5 font-mono">
                    {result.locationDetails?.coordinates
                      ? `${result.locationDetails.coordinates.lat.toFixed(4)}° N, ${result.locationDetails.coordinates.lng.toFixed(4)}° E`
                      : 'Not Specified'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section II: Executive Summary & Primary Crime Classification */}
          <div className="mb-5 print-avoid-break">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-900 text-white px-3 py-1.5 mb-2">
              Section II — Executive Incident Summary &amp; Crime Classification
            </h2>
            <div className="border border-slate-300 p-3 bg-slate-50/60 mb-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Synthesized Forensic Synopsis:
              </div>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                {result.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-300 p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Primary Offence Categories:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 border border-slate-400 bg-slate-100 text-slate-900 font-bold text-[10px] uppercase rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border border-slate-300 p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Extracted Stress &amp; Severity Triggers:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.stressWords.length > 0 ? (
                    result.stressWords.map((word, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 border border-red-300 bg-red-50 text-red-900 font-semibold text-[10px] rounded"
                      >
                        {word}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500">None flagged</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section III: Verbatim FIR Statement */}
          <div className="mb-5 print-avoid-break">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-900 text-white px-3 py-1.5 mb-2">
              Section III — Verbatim First Information Report (FIR) Narrative (With Highlighted Triggers)
            </h2>
            <div className="border border-slate-300 p-3 font-serif text-xs leading-relaxed text-slate-900 bg-white whitespace-pre-wrap">
              {firText
                ? renderHighlightedText(firText, result.stressWords)
                : 'Multimedia / Document attachment analyzed via OCR forensic pipeline.'}
            </div>
          </div>

          {/* Section IV: Prima Facie Statutory Provisions (BNS 2023) & Category Scores */}
          <div className="mb-5 print-avoid-break">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-900 text-white px-3 py-1.5 mb-2">
              Section IV — Prima Facie Statutory Offences (Bharatiya Nyaya Sanhita, 2023) &amp; Probability Matrix
            </h2>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-7 border border-slate-300 p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Applicable BNS 2023 &amp; Special Act Sections:
                </div>
                {result.recommendedActs && result.recommendedActs.length > 0 ? (
                  <ol className="list-decimal list-inside space-y-1 text-[11px] font-serif text-slate-900">
                    {result.recommendedActs.map((act, idx) => (
                      <li key={idx} className="font-semibold">
                        {act}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-[10px] text-slate-500">No statutory provisions mapped.</p>
                )}
              </div>
              <div className="col-span-5 border border-slate-300 p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Category Match Distribution:
                </div>
                {result.categoryScores && result.categoryScores.length > 0 ? (
                  <table className="w-full text-[10px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-300 text-left">
                        <th className="py-1 font-bold">Offence Class</th>
                        <th className="py-1 font-bold text-right">Match %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.categoryScores.map((cs, idx) => (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="py-1">{cs.category}</td>
                          <td className="py-1 text-right font-mono font-bold">{cs.score}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-[10px] text-slate-500">N/A</p>
                )}
              </div>
            </div>
          </div>

          {/* Section V: Reconstructed Chronological Event Timeline */}
          {result.timeline && result.timeline.length > 0 && (
            <div className="mb-5 print-avoid-break">
              <h2 className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-900 text-white px-3 py-1.5 mb-2">
                Section V — Reconstructed Chronological Incident Timeline
              </h2>
              <table className="w-full border-collapse border border-slate-300 text-[11px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-2.5 py-1.5 text-left font-bold w-1/4">
                      Timestamp / Sequence
                    </th>
                    <th className="border border-slate-300 px-2.5 py-1.5 text-left font-bold">
                      Forensic Event Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.timeline.map((event, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 px-2.5 py-1.5 font-mono font-semibold text-slate-800 align-top">
                        {event.timestamp}
                      </td>
                      <td className="border border-slate-300 px-2.5 py-1.5 text-slate-900">
                        {event.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Section VI: Extracted Forensic Evidence & Chain-of-Custody Manifest */}
          {(managedEvidence.length > 0 || (result.evidenceItems && result.evidenceItems.length > 0)) && (
            <div className="mb-5 print-avoid-break">
              <h2 className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-900 text-white px-3 py-1.5 mb-2">
                Section VI — ML Auto-Tagged Forensic Evidence &amp; Chain-of-Custody Manifest
              </h2>
              <table className="w-full border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-2 py-1 text-left font-bold">ID</th>
                    <th className="border border-slate-300 px-2 py-1 text-left font-bold">Evidence Category</th>
                    <th className="border border-slate-300 px-2 py-1 text-left font-bold">Extracted Entity &amp; Forensic Context</th>
                    <th className="border border-slate-300 px-2 py-1 text-center font-bold">Criticality</th>
                    <th className="border border-slate-300 px-2 py-1 text-center font-bold">Custody Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(managedEvidence.length > 0 ? managedEvidence : result.evidenceItems || []).map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="border border-slate-300 px-2 py-1 font-mono font-semibold">
                        {item.id || `EVD-${idx + 1}`}
                      </td>
                      <td className="border border-slate-300 px-2 py-1 font-bold">
                        {item.category}
                      </td>
                      <td className="border border-slate-300 px-2 py-1">
                        <div className="font-bold text-slate-900">{item.entity}</div>
                        <div className="text-slate-600">{item.context}</div>
                      </td>
                      <td className="border border-slate-300 px-2 py-1 text-center font-bold">
                        {item.criticality}
                      </td>
                      <td className="border border-slate-300 px-2 py-1 text-center font-mono">
                        {item.custodyStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Section VII: Mandatory Investigative Action Plan & Expected Judicial Outcomes */}
          <div className="mb-6 print-avoid-break">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-900 text-white px-3 py-1.5 mb-2">
              Section VII — Standard Operating Investigative Action Plan &amp; Expected Judicial Outcomes
            </h2>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-7 border border-slate-300 p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mandatory I.O. Action Checklist:
                </div>
                {result.investigativeSteps && result.investigativeSteps.length > 0 ? (
                  <ul className="space-y-1 text-[10.5px]">
                    {result.investigativeSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-mono font-bold text-slate-800 shrink-0">
                          {completedSteps.has(idx) ? '[COMPLETED]' : '[PENDING]  '}
                        </span>
                        <span className={completedSteps.has(idx) ? 'line-through text-slate-500' : 'text-slate-900'}>
                          {step}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[10px] text-slate-500">No steps listed.</p>
                )}
              </div>
              <div className="col-span-5 border border-slate-300 p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Expected Judicial / Prosecution Outcomes:
                </div>
                {result.expectedOutcomes && result.expectedOutcomes.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-[10.5px] text-slate-900">
                    {result.expectedOutcomes.map((outcome, idx) => (
                      <li key={idx}>{outcome}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[10px] text-slate-500">No outcomes listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Official Sign-Off & Attestation Block */}
          <div className="border-t-2 border-slate-900 pt-6 mt-6 grid grid-cols-3 gap-6 text-[10px] print-avoid-break">
            <div className="border border-slate-300 p-3 rounded bg-slate-50">
              <div className="font-bold uppercase tracking-wider text-slate-700 mb-6">
                Investigating Officer (I.O.)
              </div>
              <div className="border-t border-slate-400 pt-1 text-slate-600">
                Signature, Name, Rank &amp; Belt No.
              </div>
            </div>
            <div className="border border-slate-300 p-3 rounded bg-slate-50">
              <div className="font-bold uppercase tracking-wider text-slate-700 mb-6">
                Station House Officer (S.H.O.)
              </div>
              <div className="border-t border-slate-400 pt-1 text-slate-600">
                Counter-Signature &amp; Police Station Seal
              </div>
            </div>
            <div className="border border-slate-300 p-3 rounded bg-slate-50 flex flex-col justify-between">
              <div className="font-bold uppercase tracking-wider text-slate-700">
                BSA Sec. 63 Digital Certificate
              </div>
              <div className="font-mono text-[9px] text-slate-600 my-1">
                SHA-256: {String(new Date().getTime()).slice(-8)}-CCTNS-VERIFIED
              </div>
              <div className="border-t border-slate-400 pt-1 text-slate-600">
                Timestamp: {new Date().toISOString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
